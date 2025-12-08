"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serviceFactory_1 = require("../../factories/serviceFactory");
const handler = async (request) => {
    const user = await serviceFactory_1.userService.getUser(request.token, request.alias);
    return {
        success: true,
        message: null,
        user: user?.dto ?? null
    };
};
exports.handler = handler;
