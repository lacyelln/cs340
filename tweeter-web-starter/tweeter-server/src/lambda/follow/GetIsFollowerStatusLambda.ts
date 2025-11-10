import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse, UserDto } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> => {
    const followService = new FollowService();
    const userDto: UserDto = {
        alias: request.userName,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const selectedUserDto: UserDto = {
        alias: request.selectedUserName,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const following = await followService.getIsFollowerStatus(request.token, userDto, selectedUserDto);
    return {
        success: true, 
        message: null, 
        following: following
    }
}