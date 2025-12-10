"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serviceFactory_1 = require("../../factories/serviceFactory");
const handler = async (request) => {
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
    const following = await serviceFactory_1.followService.getIsFollowerStatus(request.token, userDto, selectedUserDto);
    return {
        success: true,
        message: null,
        following: following
    };
};
exports.handler = handler;
