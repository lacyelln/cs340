import { TweeterRequest } from "./TweeterRequest";

export interface FollowCountRequest extends TweeterRequest{
    readonly token: string, 
    readonly userAlias: string
}