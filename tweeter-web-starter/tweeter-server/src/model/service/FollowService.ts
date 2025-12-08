import { User, UserDto } from "tweeter-shared";
import { UsersDAO } from "../../dao/interfaces/UsersDAO";
import { FollowsDAO } from "../../dao/interfaces/FollowsDAO";
import { AbstractDAOFactory } from "../../factories/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";


export class FollowService {
    private usersDAO: UsersDAO;
    private followsDAO: FollowsDAO;
    private authorizationService: AuthorizationService;

    constructor(daoFactory: AbstractDAOFactory){
      this.usersDAO = daoFactory.getUsersDAO();
      this.followsDAO = daoFactory.getFollowsDAO();
      const authTokenDAO = daoFactory.getAuthTokenDAO();
      this.authorizationService = new AuthorizationService(authTokenDAO);
    }


    public async loadMoreFollowees  (
        token: string,
        userAlias: string,
        pageSize: number,
        lastItem: UserDto | null
      ): Promise<[UserDto[], boolean]> {
      await this.authorizationService.authorize(token);
        
      const followees = await this.followsDAO.getFollowees(userAlias, pageSize, lastItem ?? undefined);

      const followeeDtos: UserDto[] = await Promise.all(
        followees.items.map(async (record) => {
          const fRecord = await this.usersDAO.getUser(
            record.followee_handle
          )
          if (!fRecord) throw new Error("Followee not found");

          const followee = new User(
            fRecord.firstName,
            fRecord.lastName, 
            fRecord.alias, 
            fRecord.imageUrl ?? null
          )

          return followee.dto;
        })
      )
      return [followeeDtos, followees.hasMore];

      };
    
    public async loadMoreFollowers (
      token: string,
      userAlias: string,
      pageSize: number,
      lastItem: UserDto | null
    ): Promise<[UserDto[], boolean]> {
      await this.authorizationService.authorize(token);

      const followers = await this.followsDAO.getFollowers(userAlias, pageSize, lastItem ?? undefined);

      const followerDtos: UserDto[] = await Promise.all(
        followers.items.map(async (record) => {
          const fRecord = await this.usersDAO.getUser(
            record.follower_handle
          )
          if (!fRecord) throw new Error("Follower not found");

          const follower = new User(
            fRecord.firstName,
            fRecord.lastName, 
            fRecord.alias, 
            fRecord.imageUrl ?? null
          )

          return follower.dto;
        })
      )
      return [followerDtos, followers.hasMore];
    };

    public async getFolloweeCount(
      token: string,
      userAlias: UserDto
    ): Promise<number>{
        await this.authorizationService.authorize(token);
        return await this.followsDAO.getFolloweeCount(userAlias.alias)
    };

    public async getFollowerCount (
      token: string,
      userAlias: UserDto
    ): Promise<number> {
       await this.authorizationService.authorize(token);
      return await this.followsDAO.getFollowerCount(userAlias.alias)
    };
    


    public async follow (
      token: string,
      userToFollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
      const userAlias = await this.authorizationService.authorize(token);
      await this.followsDAO.follow(userAlias, userToFollow.alias);

      const followerCount = await this.getFollowerCount(token, userToFollow);
      const followeeCount = await this.getFolloweeCount(token, userToFollow);

      return [followerCount, followeeCount];
    };

    public async unfollow (
      token: string,
      userToUnfollow: UserDto
    ): Promise<[followerCount: number, followeeCount: number]> {
      const userAlias = await this.authorizationService.authorize(token);
      await this.followsDAO.unfollow(userAlias, userToUnfollow.alias);

      const followerCount = await this.getFollowerCount(token, userToUnfollow);
      const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

      return [followerCount, followeeCount];
    };

    public async getIsFollowerStatus (
      token: string,
      user: UserDto,
      selectedUser: UserDto
    ): Promise<boolean>{
      const userAlias = await this.authorizationService.authorize(token);
      const pageSize = 1000;
      const followees = await this.followsDAO.getFollowees(
        userAlias, 
        pageSize
      );
      return followees.items.some(
        (record) => record.followee_handle === selectedUser.alias
      )
    };
  

  
}