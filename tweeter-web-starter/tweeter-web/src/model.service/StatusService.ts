import { AuthToken, Status, LoadMoreItemsRequest  } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService implements Service{
  
  private serverFacade = new ServerFacade();

    public async loadMoreStoryItems (
          authToken: AuthToken,
          userAlias: string,
          pageSize: number,
          lastItem: Status | null
        ): Promise<[Status[], boolean]> {
          const request: LoadMoreItemsRequest = {
            token: authToken.token, 
            userAlias: userAlias, 
            pageSize: pageSize, 
            lastItem: lastItem ? lastItem.dto : null,
          }
          return this.serverFacade.loadMoreStoryItems(request)
        };

    public async loadMoreFeedItems (
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
      const request: LoadMoreItemsRequest = {
          token: authToken.token, 
          userAlias: userAlias, 
          pageSize: pageSize, 
          lastItem: lastItem ? lastItem.dto : null,
        }
        return this.serverFacade.loadMoreFeedItems(request);
        };

    public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    
    await this.serverFacade.postStatus({token: authToken.token, newStatus: newStatus});

  };
}