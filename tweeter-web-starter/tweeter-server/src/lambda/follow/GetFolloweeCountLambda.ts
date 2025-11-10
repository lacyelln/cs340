import { FollowService } from "../../model/service/FollowService";
import { FollowCountResponse, FollowCountRequest, UserDto } from "tweeter-shared";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse>  => {
    const followService = new FollowService();
    const userDto: UserDto = {
        alias: request.userAlias,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const count = await followService.getFolloweeCount(request.token, userDto);
    return {
        count: count
    }

}