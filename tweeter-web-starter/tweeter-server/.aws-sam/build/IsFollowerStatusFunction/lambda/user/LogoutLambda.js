"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serviceFactory_1 = require("../../factories/serviceFactory");
const handler = async (request) => {
    await serviceFactory_1.userService.Logout(request.token);
    return {
        success: true,
        message: null,
    };
};
exports.handler = handler;
