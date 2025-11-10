"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    const userDto = {
        alias: request.userToFollow,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const [followerCount, followeeCount] = await followService.unfollow(request.token, userDto);
    return {
        followerCount: followerCount,
        followeeCount: followeeCount,
        success: true,
        message: null
    };
};
exports.handler = handler;
