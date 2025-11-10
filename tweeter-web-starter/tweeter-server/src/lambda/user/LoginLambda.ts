import { GetUserRequest, GetUserResponse, LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: LoginRequest): Promise<LoginResponse> => {
    const userService = new UserService();

    const [user, token] = await userService.login(request.token, request.password);
    return {
        success: true, 
        message: null, 
        user: user, 
        token: token
    }
}