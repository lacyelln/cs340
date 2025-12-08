import { FollowService } from "../model/service/FollowService";
import { StatusService } from "../model/service/StatusService";
import { UserService } from "../model/service/UserService";
import { DynamoDAOFactory } from "./DynamoDAOFactory";

const daoFactory = new DynamoDAOFactory();

export const followService = new FollowService(daoFactory);

export const userService = new UserService(daoFactory);

export const statusService = new StatusService(daoFactory);

export const followsDAO = daoFactory.getFollowsDAO();

export const feedDAO = daoFactory.getFeedDAO();

export const storyDAO = daoFactory.getStoryDAO();

