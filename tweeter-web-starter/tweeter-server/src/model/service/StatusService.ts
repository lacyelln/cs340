import { Status, User } from "tweeter-shared";
import { UsersDAO } from "../../dao/interfaces/UsersDAO";
import { FollowsDAO } from "../../dao/interfaces/FollowsDAO";
import { FeedDAO } from "../../dao/interfaces/FeedDAO";
import { AbstractDAOFactory } from "../../factories/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import { StoryDAO } from "../../dao/interfaces/StoryDAO";

export class StatusService {
  private usersDAO: UsersDAO;
  private feedDAO:FeedDAO;
  private authorizationService: AuthorizationService;
  private storyDAO: StoryDAO;
  private followsDAO: FollowsDAO;

  constructor(daoFactory: AbstractDAOFactory){
    this.usersDAO = daoFactory.getUsersDAO();
    this.feedDAO = daoFactory.getFeedDAO();
    const authTokenDAO = daoFactory.getAuthTokenDAO();
    this.authorizationService = new AuthorizationService(authTokenDAO);
    this.storyDAO = daoFactory.getStoryDAO();
    this.followsDAO = daoFactory.getFollowsDAO();

  }
    public async addToStory(token: string, newStatus: Status): Promise<void> {
    await this.authorizationService.authorize(token);
    await this.storyDAO.addStatus(newStatus);
  }


    public async loadMoreStoryItems (
          token: string,
          userAlias: string,
          pageSize: number,
          lastItem: Status | null
        ): Promise<[Status[], boolean]> {
          await this.authorizationService.authorize(token);
          
          const myUserRecord = await this.usersDAO.getUser(userAlias);
          if (!myUserRecord) throw new Error(`User ${userAlias} was not found.`);

          const [statusRecords, hasMore] = await this.storyDAO.getStoryPage(
            userAlias, pageSize, lastItem
          )

          const statuses = await Promise.all(
            statusRecords.map(async (record) => {
              const userRecord = await this.usersDAO.getUser(record.alias);
              if (!myUserRecord) throw new Error(`User was not found.`);

              const user = new User(
                userRecord!.firstName, 
                userRecord!.lastName, 
                userRecord!.alias, 
                userRecord!.imageUrl ?? null
              )

              return new Status(record.post, user, record.timestamp);
            })
          )
          return [statuses, hasMore];
    };


    public async loadMoreFeedItems (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        await this.authorizationService.authorize(token);
        
        const myUserRecord = await this.usersDAO.getUser(userAlias);
        if (!myUserRecord) throw new Error(`User ${userAlias} was not found.`);

        const [statusRecords, hasMore] = await this.feedDAO.getFeedPage(
          userAlias, pageSize, lastItem
        )

        const statuses = await Promise.all(
          statusRecords.map(async (record) => {
            const userRecord = await this.usersDAO.getUser(record.alias);
            if (!myUserRecord) throw new Error(`User was not found.`);

            const user = new User(
              userRecord!.firstName, 
              userRecord!.lastName, 
              userRecord!.alias, 
              userRecord!.imageUrl ?? null
            )

            return new Status(record.post, user, record.timestamp);
          })
        )
        return [statuses, hasMore];
    };

    public async postStatus (
    token: string,
    newStatus: Status
  ): Promise<void> {
      await this.authorizationService.authorize(token);

      const posterHandle = newStatus.user.alias;
      console.log("Posting status for:", posterHandle);

      await this.storyDAO.addStatus(newStatus);
      console.log("Added to story");

      const followerPage = await this.followsDAO.getFollowers(posterHandle, 1000);
      console.log("Found followers:", followerPage.items);
      const followerAliases = followerPage.items.map(
        (record) => record.follower_handle
      );
      console.log("Follower aliases:", followerAliases);

      await Promise.all(
        followerAliases.map((alias: string) =>
          this.feedDAO.addStatusToFeed(newStatus, alias)
        )
      );
    };
}