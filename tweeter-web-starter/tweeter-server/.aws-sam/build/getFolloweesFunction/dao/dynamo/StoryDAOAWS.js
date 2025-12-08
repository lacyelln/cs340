"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryDAOAWS = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class StoryDAOAWS {
    tableName = process.env.STORY_TABLE;
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}));
    async addStatus(status) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                author_alias: status.user.alias,
                time_stamp: status.timestamp,
                post: status.post
            }
        }));
    }
    async getStory(handle, limit, lastKey) {
        const [records, hasMore, newLastKey] = await this.getStoryPage(handle, limit, lastKey ?? undefined);
        const items = records.map((rec) => new tweeter_shared_1.Status(rec.post, new tweeter_shared_1.User(rec.alias, "", "", ""), rec.timestamp));
        return { items, lastKey: newLastKey, hasMore };
    }
    async getStoryPage(userAlias, pageSize, lastItem) {
        let exclusiveStartKey = undefined;
        if (lastItem) {
            exclusiveStartKey = {
                author_alias: userAlias,
                time_stamp: lastItem.timestamp || lastItem.timestamp //maybe an error here?
            };
        }
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: "author_alias = :alias",
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
exports.StoryDAOAWS = StoryDAOAWS;
