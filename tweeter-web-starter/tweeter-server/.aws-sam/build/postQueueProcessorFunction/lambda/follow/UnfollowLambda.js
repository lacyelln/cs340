"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serviceFactory_1 = require("../../factories/serviceFactory");
const handler = async (request) => {
    const userDto = {
        alias: request.userToFollow,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const [followerCount, followeeCount] = await serviceFactory_1.followService.unfollow(request.token, userDto);
    return {
        followerCount: followerCount,
        followeeCount: followeeCount,
        success: true,
        message: null
    };
};
exports.handler = handler;
