"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const FollowService_1 = require("../../model/service/FollowService");
const handler = async (request) => {
    const followService = new FollowService_1.FollowService();
    const userDto = {
        alias: request.userName,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const selectedUserDto = {
        alias: request.selectedUserName,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const following = await followService.getIsFollowerStatus(request.token, userDto, selectedUserDto);
    return {
        success: true,
        message: null,
        following: following
    };
};
exports.handler = handler;
