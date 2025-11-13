import { GetUserRequest, GetUserResponse, LoginRequest, LoginResponse, RegisterRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<LoginResponse> => {
    const userService = new UserService();

    const [user, token] = await userService.Register(request.firstName, request.lastName, request.alias, request.password, request.userImageBytes, request.imageFileExtension);
    return {
        success: true, 
        message: null, 
        user: user.dto, 
        token: token
    }
}