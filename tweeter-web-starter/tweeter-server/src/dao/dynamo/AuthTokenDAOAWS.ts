import { AuthToken } from "tweeter-shared";
import { AuthRecord } from "../../model/types/AuthRecord";
import { AuthTokenDAO } from "../interfaces/AuthTokenDAO";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

export class AuthTokenDAOAWS implements AuthTokenDAO {
    private client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
    private readonly tableName = process.env.AUTH_TOKENS_TABLE!;

    async getAuthToken(token: string): Promise<AuthRecord | null> {
           console.log("DEBUG TOKEN:", token);
        
        const result = await this.client.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { token }
            })
        )

        if(!result.Item) return null;

        return {
            token:result.Item.token,
            userAlias: result.Item.userAlias,
            timestamp: result.Item.timestamp
        }
    }
    async createAuthToken(authtoken: AuthToken, userAlias: string): Promise<void> {
        await this.client.send(
            new PutCommand({
                TableName: this.tableName, 
                Item: {
                    token: authtoken.token, 
                    userAlias: userAlias, 
                    timestamp: authtoken.timestamp
                }
            })
        )

    }
    async updateLastUsed(token: string, newTime: string): Promise<void> {
        await this.client.send(
            new UpdateCommand({
                TableName: this.tableName, 
                Key: {token}, 
                UpdateExpression: "SET last_used_time = :t", 
                ExpressionAttributeValues: {
                    ":t": newTime
                }
            })
        )
    }
    async deleteAuthToken(token: string): Promise<void> {
        await this.client.send(
            new DeleteCommand({
                TableName: this.tableName, 
                Key: { token }
            })
        )
    }
    
}