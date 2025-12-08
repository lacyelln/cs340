"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowsDAOAWS = void 0;
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
class FollowsDAOAWS {
    followsTableName = process.env.FOLLOW_TABLE;
    usersTableName = process.env.USERS_TABLE;
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}));
    async follow(follower, followee) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: this.followsTableName,
            Item: {
                follower_handle: follower,
                followee_handle: followee
            }
        }));
        await this.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: this.usersTableName,
            Key: { alias: follower },
            UpdateExpression: "ADD followee_count :inc",
            ExpressionAttributeValues: { ":inc": 1 }
        }));
        await this.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: this.usersTableName,
            Key: { alias: followee },
            UpdateExpression: "ADD follower_count :inc",
            ExpressionAttributeValues: { ":inc": 1 }
        }));
    }
    async unfollow(follower, followee) {
        await this.client.send(new lib_dynamodb_1.DeleteCommand({
            TableName: this.followsTableName,
            Key: {
                follower_handle: follower,
                followee_handle: followee
            }
        }));
        await this.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: this.usersTableName,
            Key: { alias: follower },
            UpdateExpression: "ADD followee_count :dec",
            ExpressionAttributeValues: { ":dec": -1 }
        }));
        await this.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: this.usersTableName,
            Key: { alias: followee },
            UpdateExpression: "ADD follower_count :dec",
            ExpressionAttributeValues: { ":dec": -1 }
        }));
    }
    async getFollowers(handle, limit, lastKey) {
        let exclusiveStartKey = undefined;
        if (lastKey) {
            exclusiveStartKey = {
                followee_handle: lastKey.followee_handle,
                follower_handle: lastKey.follower_handle
            };
        }
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand({
            TableName: this.followsTableName,
            IndexName: "follow_index",
            KeyConditionExpression: "followee_handle = :h",
            ExpressionAttributeValues: {
                ":h": handle,
            },
            Limit: limit,
            ExclusiveStartKey: exclusiveStartKey,
        }));
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
    async getFollowees(handle, limit, lastKey) {
        let exclusiveStartKey = undefined;
        if (lastKey) {
            exclusiveStartKey = {
                followee_handle: lastKey.followee_handle,
                follower_handle: lastKey.follower_handle
            };
        }
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand({
            TableName: this.followsTableName,
            KeyConditionExpression: "follower_handle = :h",
            ExpressionAttributeValues: {
                ":h": handle,
            },
            Limit: limit,
            ExclusiveStartKey: exclusiveStartKey,
        }));
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
    async getFollowerCount(handle) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: this.usersTableName,
            Key: { alias: handle },
            ProjectionExpression: "follower_count"
        }));
        return result.Item?.follower_count ?? 0;
    }
    async getFolloweeCount(handle) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: this.usersTableName,
            Key: { alias: handle },
            ProjectionExpression: "followee_count",
        }));
        return result.Item?.followee_count ?? 0;
    }
}
exports.FollowsDAOAWS = FollowsDAOAWS;
