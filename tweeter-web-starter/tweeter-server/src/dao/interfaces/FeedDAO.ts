import { Status } from "tweeter-shared";
import { StatusPage } from "../../model/types/StatusPage";
import { StatusRecord } from "../../model/types/StatusRecord";

export interface FeedDAO {
  addStatusToFeed(status: Status, followerHandle: string): Promise<void>;
  getFeed(handle: string, limit: number, lastKey?: any): Promise<StatusPage>;
  getFeedPage(
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[StatusRecord[], boolean, any]>;
}