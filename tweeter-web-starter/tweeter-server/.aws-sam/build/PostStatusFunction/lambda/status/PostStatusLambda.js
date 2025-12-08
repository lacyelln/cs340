"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const serviceFactory_1 = require("../../factories/serviceFactory");
const handler = async (request) => {
    // ✅ Correct validation:
    if (!request?.newStatus?.user) {
        console.error("BLOCKED REQUEST — missing user:", request);
        return { success: false, message: "newStatus.user was undefined or missing" };
    }
    const userDto = request.newStatus.user;
    const user = new tweeter_shared_1.User(userDto._firstName ?? userDto.firstName, userDto._lastName ?? userDto.lastName, userDto._alias ?? userDto.alias, userDto._imageUrl ?? userDto.imageUrl);
    if (!user) {
        return { success: false, message: "Invalid user DTO" };
    }
    await serviceFactory_1.statusService.postStatus(request.token, new tweeter_shared_1.Status(request.newStatus.post, user, request.newStatus.timestamp));
    return {
        success: true,
        message: null
    };
};
exports.handler = handler;
