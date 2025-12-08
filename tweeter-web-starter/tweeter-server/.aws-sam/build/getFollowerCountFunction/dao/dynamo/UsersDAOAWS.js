"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersDAOAWS = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class UsersDAOAWS {
    tableName = process.env.USERS_TABLE;
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}));
    async getUser(alias) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: { alias }
        }));
        if (!result.Item)
            return null;
        return {
            alias: result.Item.alias,
            firstName: result.Item.firstName,
            lastName: result.Item.lastName,
            hashedPassword: result.Item.hashedPassword,
            imageUrl: result.Item.imageUrl ?? null
        };
    }
    async createUser(user) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                alias: user.alias,
                firstName: user.firstName,
                lastName: user.lastName,
                hashedPassword: user.hashedPassword,
                imageUrl: user.imageUrl ?? null,
                follower_count: 0,
                followee_count: 0
            }
        }));
    }
}
exports.UsersDAOAWS = UsersDAOAWS;
