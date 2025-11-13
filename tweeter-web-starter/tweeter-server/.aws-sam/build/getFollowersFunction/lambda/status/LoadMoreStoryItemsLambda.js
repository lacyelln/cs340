"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const StatusService_1 = require("../../model/service/StatusService");
const handler = async (request) => {
    const statusService = new StatusService_1.StatusService();
    const lastStatus = tweeter_shared_1.Status.fromDto(request.lastItem);
    const [items, hasMore] = await statusService.loadMoreStoryItems(request.token, request.userAlias, request.pageSize, lastStatus);
    return {
        success: true,
        message: null,
        items: items.map((status) => status.dto),
        hasMore,
    };
};
exports.handler = handler;
