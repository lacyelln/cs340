"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const serviceFactory_1 = require("../../factories/serviceFactory");
const handler = async (request) => {
    const lastStatus = tweeter_shared_1.Status.fromDto(request.lastItem);
    const [items, hasMore] = await serviceFactory_1.statusService.loadMoreFeedItems(request.token, request.userAlias, request.pageSize, lastStatus);
    return {
        success: true,
        message: null,
        items: items.map((status) => status.dto),
        hasMore,
    };
};
exports.handler = handler;
