import { AuthToken, FakeData, FollowCountRequest, GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, PagedUserItemRequest, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class FollowService implements Service {

    private serverFacade = new ServerFacade();

    public async loadMoreFollowees  (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
      ): Promise<[User[], boolean]> {
        const request: PagedUserItemRequest = {
            token: authToken.token,
            userAlias: userAlias, 
            pageSize: pageSize, 
            lastItem: lastItem ? lastItem.dto : null
        }
        return this.serverFacade.getMoreFollowees(request);
      };

      public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number>{
    const request: FollowCountRequest = {
      token: authToken.token, 
      userAlias: user.alias

    }
    return this.serverFacade.getFolloweeCount(request);
  };

  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    const request: FollowCountRequest = {
      token: authToken.token, 
      userAlias: user.alias

    }
    return this.serverFacade.getFollowerCount(request);
  };
    
    public async loadMoreFollowers (
      authToken: AuthToken,
      userAlias: string,
      pageSize: number,
      lastItem: User | null
    ): Promise<[User[], boolean]> {
      const request: PagedUserItemRequest = {
        token: authToken.token,
        userAlias: userAlias, 
        pageSize: pageSize, 
        lastItem: lastItem ? lastItem.dto : null
      }
        return this.serverFacade.getMoreFollowers(request);
    };

    public async follow (
  authToken: AuthToken,
  userToFollow: User
): Promise<[followerCount: number, followeeCount: number]> {

  return await this.serverFacade.follow({token: authToken.token, userToFollow: userToFollow.alias});
};

  public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {

  return await this.serverFacade.follow({token: authToken.token, userToFollow: userToUnfollow.alias});
};
   public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean>{
    const request: GetIsFollowerStatusRequest = {
      token: authToken.token, 
      userName : user.alias, 
      selectedUserName: selectedUser.alias
    }
    // TODO: Replace with the result of calling server
    return this.serverFacade.getIsFollowerStatus(request);
  };
  
  
}