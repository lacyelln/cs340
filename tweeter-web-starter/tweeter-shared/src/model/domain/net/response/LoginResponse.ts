import { UserDto } from "../../../dto/UserDto";
import { AuthToken } from "../../AuthToken";
import { TweeterResponse } from "./TweeterResponse";

export interface LoginResponse extends TweeterResponse{
    user: UserDto,
    token: AuthToken
}