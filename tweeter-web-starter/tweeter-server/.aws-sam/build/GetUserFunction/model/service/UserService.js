"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const buffer_1 = require("buffer");
const tweeter_shared_1 = require("tweeter-shared");
const AuthorizationService_1 = require("./AuthorizationService");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
class UserService {
    usersDAO;
    authorizationService;
    s3DAO;
    authTokenDAO;
    constructor(daoFactory) {
        this.usersDAO = daoFactory.getUsersDAO();
        this.authTokenDAO = daoFactory.getAuthTokenDAO();
        this.authorizationService = new AuthorizationService_1.AuthorizationService(this.authTokenDAO);
        this.s3DAO = daoFactory.getS3DAO();
    }
    async getUser(token, alias) {
        await this.authorizationService.authorize(token);
        const user = await this.usersDAO.getUser(alias); //this is a userRecord
        return new tweeter_shared_1.User(user.firstName, user.lastName, user.alias, user.imageUrl ?? null);
    }
    ;
    async login(alias, password) {
        const userRecord = await this.usersDAO.getUser(alias);
        if (userRecord === null) {
            throw new Error("Invalid alias or password");
        }
        const correctPassword = await bcryptjs_1.default.compare(password, userRecord?.hashedPassword);
        if (!correctPassword)
            throw new Error("Invalid alias or password");
        const user = new tweeter_shared_1.User(userRecord.firstName, userRecord.lastName, userRecord.alias, userRecord.imageUrl);
        const newAuth = new tweeter_shared_1.AuthToken(crypto_1.default.randomUUID(), Date.now());
        await this.authTokenDAO.createAuthToken(newAuth, alias);
        return [user, newAuth];
    }
    ;
    async Register(firstName, lastName, alias, password, userImageBytes, imageFileExtension) {
        const userExists = await this.usersDAO.getUser(alias);
        if (userExists)
            throw new Error("This user already exists");
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const imageBuffer = buffer_1.Buffer.from(userImageBytes, "base64");
        const imageKey = `${alias}.${imageFileExtension}`;
        const imageUrl = await this.s3DAO.uploadImage(imageKey, imageBuffer);
        const user = new tweeter_shared_1.User(firstName, lastName, alias, imageUrl);
        await this.usersDAO.createUser({
            alias, firstName, lastName, hashedPassword, imageUrl
        });
        const newAuth = new tweeter_shared_1.AuthToken(crypto_1.default.randomUUID(), Date.now());
        await this.authTokenDAO.createAuthToken(newAuth, alias);
        return [user, newAuth];
    }
    ;
    async Logout(token) {
        await this.authorizationService.authorize(token);
        await this.authTokenDAO.deleteAuthToken(token);
        await new Promise((res) => setTimeout(res, 1000));
    }
    ;
}
exports.UserService = UserService;
