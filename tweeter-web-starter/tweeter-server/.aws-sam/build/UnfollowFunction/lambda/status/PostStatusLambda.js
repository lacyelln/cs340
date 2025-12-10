"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const serviceFactory_1 = require("../../factories/serviceFactory");
const client_sqs_1 = require("@aws-sdk/client-sqs");
const handler = async (request) => {
    const sqsClient = new client_sqs_1.SQSClient({ region: "us-east-1" });
    const userDto = request.newStatus.user;
    const user = new tweeter_shared_1.User(userDto._firstName ?? userDto.firstName, userDto._lastName ?? userDto.lastName, userDto._alias ?? userDto.alias, userDto._imageUrl ?? userDto.imageUrl);
    const status = tweeter_shared_1.Status.fromDto(request.newStatus);
    if (!status) {
        return {
            success: false,
            message: "Invalid status",
        };
    }
    console.log("Adding to story...");
    await serviceFactory_1.statusService.addToStory(request.token, status);
    console.log("Added to story successfully");
    const postQueueUrl = process.env.POST_QUEUE_URL;
    console.log("PostQueue URL:", postQueueUrl);
    const message = {
        token: request.token,
        status: request.newStatus,
        posterAlias: status?.user.alias,
    };
    console.log("Sending message to PostQueue...");
    try {
        const result = await sqsClient.send(new client_sqs_1.SendMessageCommand({
            QueueUrl: postQueueUrl,
            MessageBody: JSON.stringify(message),
        }));
        console.log("Message sent! MessageId:", result.MessageId);
    }
    catch (error) {
        console.error("Failed to send SQS message:", error);
        throw error;
    }
    return {
        success: true,
        message: null,
    };
};
exports.handler = handler;
