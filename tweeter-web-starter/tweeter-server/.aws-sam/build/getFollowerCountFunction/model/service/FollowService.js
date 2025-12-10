"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const tweeter_shared_1 = require("tweeter-shared");
const AuthorizationService_1 = require("./AuthorizationService");
class FollowService {
    usersDAO;
    followsDAO;
    authorizationService;
    constructor(daoFactory) {
        this.usersDAO = daoFactory.getUsersDAO();
        this.followsDAO = daoFactory.getFollowsDAO();
        const authTokenDAO = daoFactory.getAuthTokenDAO();
        this.authorizationService = new AuthorizationService_1.AuthorizationService(authTokenDAO);
    }
    async loadMoreFollowees(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        const followees = await this.followsDAO.getFollowees(userAlias, pageSize, lastItem ?? undefined);
        const followeeDtos = await Promise.all(followees.items.map(async (record) => {
            const fRecord = await this.usersDAO.getUser(record.followee_handle);
            if (!fRecord)
                throw new Error("Followee not found");
            const followee = new tweeter_shared_1.User(fRecord.firstName, fRecord.lastName, fRecord.alias, fRecord.imageUrl ?? null);
            return followee.dto;
        }));
        return [followeeDtos, followees.hasMore];
    }
    ;
    async loadMoreFollowers(token, userAlias, pageSize, lastItem) {
        await this.authorizationService.authorize(token);
        const followers = await this.followsDAO.getFollowers(userAlias, pageSize, lastItem ?? undefined);
        const followerDtos = await Promise.all(followers.items.map(async (record) => {
            const fRecord = await this.usersDAO.getUser(record.follower_handle);
            if (!fRecord)
                throw new Error("Follower not found");
            const follower = new tweeter_shared_1.User(fRecord.firstName, fRecord.lastName, fRecord.alias, fRecord.imageUrl ?? null);
            return follower.dto;
        }));
        return [followerDtos, followers.hasMore];
    }
    ;
    async getFolloweeCount(token, userAlias) {
        await this.authorizationService.authorize(token);
        return await this.followsDAO.getFolloweeCount(userAlias.alias);
    }
    ;
    async getFollowerCount(token, userAlias) {
        await this.authorizationService.authorize(token);
        return await this.followsDAO.getFollowerCount(userAlias.alias);
    }
    ;
    async follow(token, userToFollow) {
        const userAlias = await this.authorizationService.authorize(token);
        await this.followsDAO.follow(userAlias, userToFollow.alias);
        const followerCount = await this.getFollowerCount(token, userToFollow);
        const followeeCount = await this.getFolloweeCount(token, userToFollow);
        return [followerCount, followeeCount];
    }
    ;
    async unfollow(token, userToUnfollow) {
        const userAlias = await this.authorizationService.authorize(token);
        await this.followsDAO.unfollow(userAlias, userToUnfollow.alias);
        const followerCount = await this.getFollowerCount(token, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(token, userToUnfollow);
        return [followerCount, followeeCount];
    }
    ;
    async getFollowerAliases(userAlias, pageSize, lastKey) {
        const [followRecords, hasMore, newLastKey] = await this.followsDAO.getFollowersPage(userAlias, pageSize, lastKey);
        const followerAliases = followRecords.map(record => record.follower_handle);
        return [followerAliases, hasMore, newLastKey];
    }
    async getIsFollowerStatus(token, user, selectedUser) {
        const userAlias = await this.authorizationService.authorize(token);
        const pageSize = 1000;
        const followees = await this.followsDAO.getFollowees(userAlias, pageSize);
        return followees.items.some((record) => record.followee_handle === selectedUser.alias);
    }
    ;
}
exports.FollowService = FollowService;
