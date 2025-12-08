"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationService = void 0;
class AuthorizationService {
    authTokenDAO;
    constructor(authTokenDAO) {
        this.authTokenDAO = authTokenDAO;
    }
    async authorize(token) {
        const authRecord = await this.authTokenDAO.getAuthToken(token);
        if (!authRecord) {
            throw new Error("Unauthorized");
        }
        const EXPIRATION_TIME = 30 * 60 * 1000;
        const now = Date.now();
        const timeSinceLastUsed = now - authRecord.timestamp;
        if (timeSinceLastUsed > EXPIRATION_TIME) {
            await this.authTokenDAO.deleteAuthToken(token);
            throw new Error("Token expired");
        }
        await this.authTokenDAO.updateLastUsed(token, now.toString());
        return authRecord.userAlias;
    }
}
exports.AuthorizationService = AuthorizationService;
