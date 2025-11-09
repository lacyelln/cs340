import { FollowService } from "../../model/service/FollowService";
import { FollowCountResponse, FollowCountRequest } from "tweeter-shared";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse>  => {
    const followService = new FollowService();
    const count = await followService.getFolloweeCount(request.token, request.userAlias);
    return {
        count: count
    }

}