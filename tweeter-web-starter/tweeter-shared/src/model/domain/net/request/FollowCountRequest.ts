import { UserDto } from "../../../dto/UserDto";

export interface FollowCountRequest {
    token: string, 
    userAlias: string
}