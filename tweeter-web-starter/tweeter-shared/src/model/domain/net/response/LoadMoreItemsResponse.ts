import { StatusDto } from "../../../dto/StatusDto";
import { TweeterResponse } from "./TweeterResponse";

export interface LoadMoreItemsResponse extends TweeterResponse{
    readonly items: StatusDto[] | null,
    readonly hasMore: boolean
}