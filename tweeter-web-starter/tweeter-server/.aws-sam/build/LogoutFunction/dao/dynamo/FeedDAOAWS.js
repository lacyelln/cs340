"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedDAOAWS = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class FeedDAOAWS {
    tableName = process.env.FEED_TABLE;
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}));
    async addStatusToFeed(status, followerHandle) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                follower_alias: followerHandle,
                time_stamp: status.timestamp,
                author_alias: status.user.alias,
                post: status.post
            },
        }));
    }
    async getFeed(handle, limit, lastKey) {
        const [records, hasMore, newLastKey] = await this.getFeedPage(handle, limit, lastKey ?? undefined);
        const items = records.map((rec) => new tweeter_shared_1.Status(rec.post, new tweeter_shared_1.User("", "", rec.alias, ""), rec.timestamp));
        return { items, lastKey: newLastKey, hasMore };
    }
    async getFeedPage(userAlias, pageSize, lastItem) {
        let exclusiveStartKey = undefined;
        if (lastItem) {
            exclusiveStartKey = {
                follower_alias: userAlias,
                time_stamp: lastItem.timestamp
            };
        }
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: "follower_alias = :alias",
            ExpressionAttributeValues: {
                ":alias": userAlias,
            },
            Limit: pageSize,
            ExclusiveStartKey: exclusiveStartKey,
            ScanIndexForward: false,
        }));
        const records = (result.Items ?? []).map((item) => ({
            alias: item.author_alias,
            post: item.post,
            timestamp: item.time_stamp,
        }));
        const hasMore = !!result.LastEvaluatedKey;
        return [records, hasMore, result.LastEvaluatedKey];
    }
}
exports.FeedDAOAWS = FeedDAOAWS;
