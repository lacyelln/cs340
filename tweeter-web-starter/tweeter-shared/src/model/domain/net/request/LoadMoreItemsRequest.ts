import { StatusDto } from "../../../dto/StatusDto";

export interface LoadMoreItemsRequest{
    readonly token: string,
    readonly userAlias: string,
    readonly pageSize: number,
    readonly lastItem: StatusDto | null
}