"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serviceFactory_1 = require("../../factories/serviceFactory");
const handler = async (request) => {
    const [user, token] = await serviceFactory_1.userService.login(request.alias, request.password);
    return {
        success: true,
        message: null,
        user: user.dto,
        token: token
    };
};
exports.handler = handler;
