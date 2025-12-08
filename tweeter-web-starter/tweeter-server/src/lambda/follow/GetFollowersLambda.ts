import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { followService } from "../../factories/serviceFactory";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {

    const [items, hasMore] = await followService.loadMoreFollowers(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {
        success: true, 
        message: null, 
        items: items, 
        hasMore: hasMore
    }
}