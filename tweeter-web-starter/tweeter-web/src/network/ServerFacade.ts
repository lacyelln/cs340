import {
  AuthToken,
    FollowCountRequest,
  FollowCountResponse,
  FollowRequest,
  FollowResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetUserRequest,
  GetUserResponse,
  LoadMoreItemsRequest,
  LoadMoreItemsResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  Status,
  User,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://yifcbw6pm7.execute-api.us-east-1.amazonaws.com/prod";
  

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/get-followees");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors    
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  public async getMoreFollowers(
    request: PagedUserItemRequest
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedUserItemRequest,
      PagedUserItemResponse
    >(request, "/follow/get-followers");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors    
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

    public async getFolloweeCount(
    request: FollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/follow/get-followee-count");


    // Handle errors    
    if (response.success) {
      if (response == null) {
        throw new Error(`No followee count found`);
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

      public async getFollowerCount(
    request: FollowCountRequest
  ): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      FollowCountRequest,
      FollowCountResponse
    >(request, "/follow/get-follower-count");


    // Handle errors    
    if (response.success) {
      if (response == null) {
        throw new Error(`No follower count found`);
      } else {
        return response.count;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

    public async follow(
    request: FollowRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow/follow");


    // Handle errors    
    if (response.success) {
      if (response == null) {
        throw new Error(`Can't follow user`);
      } else {
        return [response.followerCount, response.followeeCount];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

    public async unfollow(
    request: FollowRequest
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator.doPost<
      FollowRequest,
      FollowResponse
    >(request, "/follow/unfollow");


    // Handle errors    
    if (response.success) {
      if (response == null) {
        throw new Error(`Can't follow user`);
      } else {
        return [response.followerCount, response.followeeCount];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

      public async getIsFollowerStatus(
    request: GetIsFollowerStatusRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse
    >(request, "/follow/is-follower-status");


    // Handle errors    
    if (response.success) {
      if (response == null) {
        throw new Error(`Can't get follow status`);
      } else {
        return response.following;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }


    public async loadMoreStoryItems(
    request: LoadMoreItemsRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      LoadMoreItemsRequest,
      LoadMoreItemsResponse
    >(request, "/status/load-more-story-items");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }

    const items =
      response.items?.map((dto) => Status.fromDto(dto) as Status) ?? [];
    return [items, response.hasMore];
  }


    public async loadMoreFeedItems(
    request: LoadMoreItemsRequest
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      LoadMoreItemsRequest,
      LoadMoreItemsResponse
    >(request, "/status/load-more-feed-items");

if (!response.success) {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }

    const items =
      response.items?.map((dto) => Status.fromDto(dto) as Status) ?? [];
    return [items, response.hasMore];

  }

    public async postStatus(
    request: PostStatusRequest
  ): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      PostStatusResponse
    >(request, "/status/post-status");


    // Handle errors    
    if (response.success) {
      if (response == null) {
        throw new Error(`Can't post status`);
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  
    public async getUser(
    request: GetUserRequest
  ): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/user/get-user");

    if (response.success) {
      if (response == null) {
        throw new Error(`Can't get user`);
      } else {
        return User.fromDto(response.user);
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }


  }

      public async login(
    request: LoginRequest
  ): Promise<LoginResponse> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      LoginResponse
    >(request, "/user/login");

    if (response.success) {
      if (response == null) {
        throw new Error(`Can't login user`);
      } else {
            if (response.token) {
            response.token = new AuthToken(
              (response.token as any)._token,
              (response.token as any)._timestamp
            );
          }
        return response
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

    public async register(
    request: RegisterRequest
  ): Promise<LoginResponse> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      LoginResponse
    >(request, "/user/register");

    if (response.success) {
      if (response == null) {
        throw new Error(`Can't register user`);
      } else {
        if (response.token) {
            response.token = new AuthToken(
              (response.token as any)._token,
              (response.token as any)._timestamp
            );
          }
        return response;
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }


  }

  public async logout(
    request: LogoutRequest
  ): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      LogoutRequest,
      LogoutResponse
    >(request, "/user/logout");

    if (response.success) {
      if (response == null) {
        throw new Error(`Can't get user`);
      } 
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }


  }




}

