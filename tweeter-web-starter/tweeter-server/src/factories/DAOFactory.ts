import { UsersDAO } from "../dao/interfaces/UsersDAO";
import { FollowsDAO } from "../dao/interfaces/FollowsDAO";
import { S3DAO } from "../dao/interfaces/S3DAO";
import { StoryDAO } from "../dao/interfaces/StoryDAO";
import { AuthTokenDAO } from "../dao/interfaces/AuthTokenDAO";
import { FeedDAO } from "../dao/interfaces/FeedDAO";

export abstract class AbstractDAOFactory {
  abstract getUsersDAO(): UsersDAO;
  abstract getFollowsDAO(): FollowsDAO;
  abstract getStoryDAO(): StoryDAO;
  abstract getFeedDAO(): FeedDAO;
  abstract getAuthTokenDAO(): AuthTokenDAO;
  abstract getS3DAO(): S3DAO;
}
