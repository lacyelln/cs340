"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const serviceFactory_1 = require("../../factories/serviceFactory");
const handler = async (event) => {
    for (const record of event.Records) {
        console.log("Raw record body:", record.body);
        const parsed = JSON.parse(record.body);
        console.log("Parsed data:", JSON.stringify(parsed));
        const { status, followerBatch } = parsed;
        console.log("Status:", status);
        console.log("Follower batch:", followerBatch);
        if (!followerBatch || followerBatch.length === 0) {
            console.log("No followers in batch, skipping");
            continue;
        }
        console.log(`Updating feeds for ${followerBatch.length} followers`);
        const statusObj = tweeter_shared_1.Status.fromDto(status);
        await serviceFactory_1.feedDAO.batchAddToFeeds(statusObj, followerBatch);
        console.log("Feeds updated successfully");
    }
};
exports.handler = handler;
