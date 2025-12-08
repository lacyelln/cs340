import { AuthTokenDAOAWS } from "../dao/dynamo/AuthTokenDAOAWS";
import { FeedDAOAWS } from "../dao/dynamo/FeedDAOAWS";
import { FollowsDAOAWS } from "../dao/dynamo/FollowsDAOAWS";
import { S3DAOAWS } from "../dao/dynamo/S3DAOAWS";
import { StoryDAOAWS } from "../dao/dynamo/StoryDAOAWS";
import { UsersDAOAWS } from "../dao/dynamo/UsersDAOAWS";
import { AuthTokenDAO } from "../dao/interfaces/AuthTokenDAO";
import { FeedDAO } from "../dao/interfaces/FeedDAO";
import { FollowsDAO } from "../dao/interfaces/FollowsDAO";
import { S3DAO } from "../dao/interfaces/S3DAO";
import { StoryDAO } from "../dao/interfaces/StoryDAO";
import { UsersDAO } from "../dao/interfaces/UsersDAO";
import { AbstractDAOFactory } from "./DAOFactory";

export class DynamoDAOFactory extends AbstractDAOFactory {
    getUsersDAO(): UsersDAO {
        return new UsersDAOAWS();
    }
    getFollowsDAO(): FollowsDAO {
        return new FollowsDAOAWS();
    }
    getStoryDAO(): StoryDAO {
        return new StoryDAOAWS();
    }
    getFeedDAO(): FeedDAO {
        return new FeedDAOAWS();
    }
    getAuthTokenDAO(): AuthTokenDAO {
        return new AuthTokenDAOAWS();
    }
    getS3DAO(): S3DAO {
        return new S3DAOAWS();
    }
    
}