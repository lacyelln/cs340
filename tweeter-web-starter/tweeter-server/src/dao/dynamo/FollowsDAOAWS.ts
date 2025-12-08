import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { FollowPage } from "../../model/types/FollowPage";
import { FollowsDAO } from "../interfaces/FollowsDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class FollowsDAOAWS implements FollowsDAO {
    private readonly followsTableName = process.env.FOLLOW_TABLE!;
    private readonly usersTableName = process.env.USERS_TABLE!;
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

    async follow(follower: string, followee: string): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.followsTableName, 
                Item: {
                    follower_handle: follower, 
                    followee_handle: followee
                }
            })
        )

        await this.client.send(
            new UpdateCommand ({
                TableName: this.usersTableName, 
                Key: { alias: follower }, 
                UpdateExpression: "ADD followee_count :inc", 
                ExpressionAttributeValues: { ":inc": 1}
            })
        )

        await this.client.send(
            new UpdateCommand({
                TableName: this.usersTableName, 
                Key: { alias: followee }, 
                UpdateExpression: "ADD follower_count :inc", 
                ExpressionAttributeValues: { ":inc": 1}
            })
        )
    }

    async unfollow(follower: string, followee: string): Promise<void> {
        await this.client.send(
            new DeleteCommand({
                TableName: this.followsTableName, 
                Key: {
                    follower_handle: follower, 
                    followee_handle: followee
                }
            })
        )

        await this.client.send(
            new UpdateCommand ({
                TableName: this.usersTableName, 
                Key: { alias: follower }, 
                UpdateExpression: "ADD followee_count :dec", 
                ExpressionAttributeValues: { ":dec": -1}
            })
        )

        await this.client.send(
            new UpdateCommand({
                TableName: this.usersTableName, 
                Key: { alias: followee }, 
                UpdateExpression: "ADD follower_count :dec", 
                ExpressionAttributeValues: { ":dec": -1}
            })
        )
    }

    async getFollowers(handle: string, limit: number, lastKey?: any): Promise<FollowPage> {
        let exclusiveStartKey = undefined;
        if (lastKey) {
        exclusiveStartKey = {
            followee_handle: lastKey.followee_handle,
            follower_handle: lastKey.follower_handle
        };
        }

        const result = await this.client.send(
        new QueryCommand({
            TableName: this.followsTableName,
            IndexName: "follow_index",
            KeyConditionExpression: "followee_handle = :h",
            ExpressionAttributeValues: {
            ":h": handle,
            },
            Limit: limit,
            ExclusiveStartKey: exclusiveStartKey,
        })
        );

        const items = (result.Items ?? []).map((item) => ({
        follower_handle: item.follower_handle,
        followee_handle: item.followee_handle,
        }));

        return {
        items,
        lastKey: result.LastEvaluatedKey,
        hasMore: !!result.LastEvaluatedKey,
        };
    }

    async getFollowees(handle: string, limit: number, lastKey?: any): Promise<FollowPage> {
        let exclusiveStartKey = undefined;
        if (lastKey) {
        exclusiveStartKey = {
            followee_handle: lastKey.followee_handle,
            follower_handle: lastKey.follower_handle
        };
        }

        const result = await this.client.send(
        new QueryCommand({
            TableName: this.followsTableName,
            KeyConditionExpression: "follower_handle = :h",
            ExpressionAttributeValues: {
            ":h": handle,
            },
            Limit: limit,
            ExclusiveStartKey: exclusiveStartKey,
        })
        );

        const items = (result.Items ?? []).map((item) => ({
        follower_handle: item.follower_handle,
        followee_handle: item.followee_handle,
        }));

        return {
        items,
        lastKey: result.LastEvaluatedKey,
        hasMore: !!result.LastEvaluatedKey,
        };
    }
    async getFollowerCount(handle: string): Promise<number> {
        const result = await this.client.send(
            new GetCommand({
                TableName: this.usersTableName, 
                Key: { alias: handle }, 
                ProjectionExpression: "follower_count"
            })
        )

        return result.Item?.follower_count ?? 0;
    }
    async getFolloweeCount(handle: string): Promise<number> {
        const result = await this.client.send(
        new GetCommand({
            TableName: this.usersTableName,
            Key: { alias: handle },
            ProjectionExpression: "followee_count",
        })
        );

        return result.Item?.followee_count ?? 0;
    }
    

}