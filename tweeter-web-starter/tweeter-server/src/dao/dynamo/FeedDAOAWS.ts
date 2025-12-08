import { Status, User } from "tweeter-shared";
import { StatusPage } from "../../model/types/StatusPage";
import { StatusRecord } from "../../model/types/StatusRecord";
import { FeedDAO } from "../interfaces/FeedDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

export class FeedDAOAWS implements FeedDAO{
    private tableName = process.env.FEED_TABLE!;
    private client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

    async addStatusToFeed(status: Status, followerHandle: string): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName, 
                Item: {
                    follower_alias: followerHandle, 
                    time_stamp: status.timestamp, 
                    author_alias: status.user.alias, 
                    post: status.post
                }, 
            })
        )
    }

    async getFeed(handle: string, limit: number, lastKey?: any): Promise<StatusPage> {
        const [records, hasMore, newLastKey] = await this.getFeedPage(handle, limit, lastKey ?? undefined)

        const items: Status[] = records.map((rec) => new Status(rec.post, new User("", "", rec.alias, ""), rec.timestamp))
        return { items, lastKey: newLastKey, hasMore }
    }
    
    async getFeedPage(userAlias: string, pageSize: number, lastItem: Status | null): Promise<[StatusRecord[], boolean, any]> {
        let exclusiveStartKey = undefined;
        if (lastItem) {
        exclusiveStartKey = {
            follower_alias: userAlias,
            time_stamp: lastItem.timestamp 
        };
        }

        const result = await this.client.send(
        new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: "follower_alias = :alias",
            ExpressionAttributeValues: {
            ":alias": userAlias,
            },
            Limit: pageSize,
            ExclusiveStartKey: exclusiveStartKey,
            ScanIndexForward: false,
        })
        );

        const records: StatusRecord[] = (result.Items ?? []).map((item) => ({
        alias: item.author_alias,
        post: item.post,
        timestamp: item.time_stamp,
        }));

        const hasMore = !!result.LastEvaluatedKey;

        return [records, hasMore, result.LastEvaluatedKey];
    }
    
}