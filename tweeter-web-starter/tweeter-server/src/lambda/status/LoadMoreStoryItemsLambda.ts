import { LoadMoreItemsRequest, LoadMoreItemsResponse, Status} from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { statusService } from "../../factories/serviceFactory";

export const handler = async ( request: LoadMoreItemsRequest): Promise<LoadMoreItemsResponse> => {

  const lastStatus: Status | null = Status.fromDto(request.lastItem);

  const [items, hasMore] = await statusService.loadMoreStoryItems(
    request.token,
    request.userAlias,
    request.pageSize,
    lastStatus
  );

  return {
    success: true,
    message: null,
    items: items.map((status) => status.dto),
    hasMore,
  };
};