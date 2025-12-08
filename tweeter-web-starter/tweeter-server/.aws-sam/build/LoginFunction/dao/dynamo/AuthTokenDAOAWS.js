"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenDAOAWS = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
class AuthTokenDAOAWS {
    client = lib_dynamodb_1.DynamoDBDocumentClient.from(new client_dynamodb_1.DynamoDBClient({}));
    tableName = process.env.AUTH_TOKENS_TABLE;
    async getAuthToken(token) {
        console.log("DEBUG TOKEN:", token);
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({
            TableName: this.tableName,
            Key: { token }
        }));
        if (!result.Item)
            return null;
        return {
            token: result.Item.token,
            userAlias: result.Item.userAlias,
            timestamp: result.Item.timestamp
        };
    }
    async createAuthToken(authtoken, userAlias) {
        await this.client.send(new lib_dynamodb_1.PutCommand({
            TableName: this.tableName,
            Item: {
                token: authtoken.token,
                userAlias: userAlias,
                timestamp: authtoken.timestamp
            }
        }));
    }
    async updateLastUsed(token, newTime) {
        await this.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: this.tableName,
            Key: { token },
            UpdateExpression: "SET last_used_time = :t",
            ExpressionAttributeValues: {
                ":t": newTime
            }
        }));
    }
    async deleteAuthToken(token) {
        await this.client.send(new lib_dynamodb_1.DeleteCommand({
            TableName: this.tableName,
            Key: { token }
        }));
    }
}
exports.AuthTokenDAOAWS = AuthTokenDAOAWS;
