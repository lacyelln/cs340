"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const serviceFactory_1 = require("../../factories/serviceFactory");
const sqsClient = new client_sqs_1.SQSClient({ region: "us-east-1" });
const handler = async (event) => {
    const jobQueueUrl = process.env.JOB_QUEUE_URL;
    for (const record of event.Records) {
        const { status, posterAlias } = JSON.parse(record.body);
        console.log(`Processing post from ${posterAlias}`);
        const allFollowers = [];
        let hasMore = true;
        let lastKey = undefined;
        while (hasMore) {
            const [followers, more, nextKey] = await serviceFactory_1.followService.getFollowerAliases(posterAlias, 1000, lastKey);
            allFollowers.push(...followers);
            hasMore = more;
            lastKey = nextKey;
        }
        console.log(`Found ${allFollowers.length} followers`);
        const batches = chunkArray(allFollowers, 25);
        for (const batch of batches) {
            const jobMessage = {
                status: status,
                followerBatch: batch
            };
            await sqsClient.send(new client_sqs_1.SendMessageCommand({
                QueueUrl: jobQueueUrl,
                MessageBody: JSON.stringify(jobMessage)
            }));
        }
        console.log(`Sent ${batches.length} batches to JobQueue`);
    }
};
exports.handler = handler;
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
