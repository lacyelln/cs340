import { TweeterRequest } from "./TweeterRequest";

export interface GetIsFollowerStatusRequest extends TweeterRequest{
    readonly token: string, 
    readonly userName: string, 
    readonly selectedUserName: string
}