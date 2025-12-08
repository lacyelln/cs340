"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDAOFactory = void 0;
const AuthTokenDAOAWS_1 = require("../dao/dynamo/AuthTokenDAOAWS");
const FeedDAOAWS_1 = require("../dao/dynamo/FeedDAOAWS");
const FollowsDAOAWS_1 = require("../dao/dynamo/FollowsDAOAWS");
const S3DAOAWS_1 = require("../dao/dynamo/S3DAOAWS");
const StoryDAOAWS_1 = require("../dao/dynamo/StoryDAOAWS");
const UsersDAOAWS_1 = require("../dao/dynamo/UsersDAOAWS");
const DAOFactory_1 = require("./DAOFactory");
class DynamoDAOFactory extends DAOFactory_1.AbstractDAOFactory {
    getUsersDAO() {
        return new UsersDAOAWS_1.UsersDAOAWS();
    }
    getFollowsDAO() {
        return new FollowsDAOAWS_1.FollowsDAOAWS();
    }
    getStoryDAO() {
        return new StoryDAOAWS_1.StoryDAOAWS();
    }
    getFeedDAO() {
        return new FeedDAOAWS_1.FeedDAOAWS();
    }
    getAuthTokenDAO() {
        return new AuthTokenDAOAWS_1.AuthTokenDAOAWS();
    }
    getS3DAO() {
        return new S3DAOAWS_1.S3DAOAWS();
    }
}
exports.DynamoDAOFactory = DynamoDAOFactory;
