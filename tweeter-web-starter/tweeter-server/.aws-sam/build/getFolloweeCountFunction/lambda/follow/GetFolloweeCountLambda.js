"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serviceFactory_1 = require("../../factories/serviceFactory");
const handler = async (request) => {
    const userDto = {
        alias: request.userAlias,
        firstName: "",
        lastName: "",
        imageUrl: "",
    };
    const count = await serviceFactory_1.followService.getFolloweeCount(request.token, userDto);
    return {
        count: count,
        success: true,
        message: null
    };
};
exports.handler = handler;
