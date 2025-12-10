"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serviceFactory_1 = require("../../factories/serviceFactory");
const handler = async (request) => {
    const [items, hasMore] = await serviceFactory_1.followService.loadMoreFollowees(request.token, request.userAlias, request.pageSize, request.lastItem);
    return {
        success: true,
        message: null,
        items: items,
        hasMore: hasMore
    };
};
exports.handler = handler;
