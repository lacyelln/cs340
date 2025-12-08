import { GetUserRequest, GetUserResponse, UserDto } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { userService } from "../../factories/serviceFactory";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {


    const user = await userService.getUser(request.token, request.alias);
    
    return {
        success: true, 
        message: null, 
        user: user?.dto ?? null
    }
}