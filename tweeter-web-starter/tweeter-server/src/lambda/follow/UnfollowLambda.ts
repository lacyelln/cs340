import { FollowRequest, FollowResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";
import { followService } from "../../factories/serviceFactory";

export const handler = async (request: FollowRequest): Promise<FollowResponse>  => {

    const userDto: UserDto = {
        alias: request.userToFollow,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const [followerCount, followeeCount] = await followService.unfollow(request.token, userDto);
    return {
        followerCount: followerCount, 
        followeeCount: followeeCount,
        success: true, 
        message: null
    }

}