import { followService } from "../../factories/serviceFactory";
import { FollowService } from "../../model/service/FollowService";
import { FollowCountResponse, FollowCountRequest, UserDto } from "tweeter-shared";

export const handler = async (request: FollowCountRequest): Promise<FollowCountResponse>  => {

    const userDto: UserDto = {
        alias: request.userAlias,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const count = await followService.getFollowerCount(request.token, userDto);
    return {
        count: count,
        success: true, 
        message: null
    }

}