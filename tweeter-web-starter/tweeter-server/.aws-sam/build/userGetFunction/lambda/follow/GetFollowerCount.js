"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    const userDto = {
        alias: request.userAlias,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const count = await followService.getFollowerCount(request.token, userDto);
    return {
        count: count
    };
};
exports.handler = handler;
