import { LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { userService } from "../../factories/serviceFactory";

export const handler = async (request: LogoutRequest): Promise<LogoutResponse> => {
 
    await userService.Logout(request.token);
    return {
        success: true, 
        message: null, 
    }
}