"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const AuthorizationService_1 = require("./AuthorizationService");
class StatusService {
    usersDAO;
    feedDAO;
    authorizationService;
    storyDAO;
    followsDAO;
    constructor(daoFactory) {
        this.usersDAO = daoFactory.getUsersDAO();
        this.feedDAO = daoFactory.getFeedDAO();
        const authTokenDAO = daoFactory.getAuthTokenDAO();
        this.authorizationService = new AuthorizationService_1.AuthorizationService(authTokenDAO);
        this.storyDAO = daoFactory.getStoryDAO();
        this.followsDAO = daoFactory.getFollowsDAO();
    }
    async loadMoreStoryItems(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        const myUserRecord = await this.usersDAO.getUser(userAlias);
        if (!myUserRecord)
            throw new Error(`User ${userAlias} was not found.`);
        const [statusRecords, hasMore] = await this.storyDAO.getStoryPage(userAlias, pageSize, lastItem);
        const statuses = await Promise.all(statusRecords.map(async (record) => {
            const userRecord = await this.usersDAO.getUser(record.alias);
            if (!myUserRecord)
                throw new Error(`User was not found.`);
            const user = new tweeter_shared_1.User(userRecord.firstName, userRecord.lastName, userRecord.alias, userRecord.imageUrl ?? null);
            return new tweeter_shared_1.Status(record.post, user, record.timestamp);
        }));
        return [statuses, hasMore];
    }
    ;
    async loadMoreFeedItems(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        const myUserRecord = await this.usersDAO.getUser(userAlias);
        if (!myUserRecord)
            throw new Error(`User ${userAlias} was not found.`);
        const [statusRecords, hasMore] = await this.feedDAO.getFeedPage(userAlias, pageSize, lastItem);
        const statuses = await Promise.all(statusRecords.map(async (record) => {
            const userRecord = await this.usersDAO.getUser(record.alias);
            if (!myUserRecord)
                throw new Error(`User was not found.`);
            const user = new tweeter_shared_1.User(userRecord.firstName, userRecord.lastName, userRecord.alias, userRecord.imageUrl ?? null);
            return new tweeter_shared_1.Status(record.post, user, record.timestamp);
        }));
        return [statuses, hasMore];
    }
    ;
    async postStatus(token, newStatus) {
        await this.authorizationService.authorize(token);
        const posterHandle = newStatus.user.alias;
        console.log("Posting status for:", posterHandle);
        await this.storyDAO.addStatus(newStatus);
        console.log("Added to story");
        const followerPage = await this.followsDAO.getFollowers(posterHandle, 1000);
        console.log("Found followers:", followerPage.items);
        const followerAliases = followerPage.items.map((record) => record.follower_handle);
        console.log("Follower aliases:", followerAliases);
        await Promise.all(followerAliases.map((alias) => this.feedDAO.addStatusToFeed(newStatus, alias)));
    }
    ;
}
exports.StatusService = StatusService;
