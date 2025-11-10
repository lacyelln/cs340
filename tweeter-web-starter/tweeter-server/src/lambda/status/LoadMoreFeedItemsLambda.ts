import { LoadMoreItemsRequest, LoadMoreItemsResponse, StatusDto, UserDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: LoadMoreItemsRequest): Promise<LoadMoreItemsResponse> => {
    const statusService = new StatusService();

    const [items, hasMore] = await statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {
        success: true, 
        message: null, 
        items: items, 
        hasMore: hasMore
    }
}