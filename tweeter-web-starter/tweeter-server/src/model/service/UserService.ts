import { Buffer } from "buffer";
import { AuthToken, User} from "tweeter-shared";
import { UsersDAO } from "../../dao/interfaces/UsersDAO";
import { AbstractDAOFactory } from "../../factories/DAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { S3DAO } from "../../dao/interfaces/S3DAO";
import { AuthTokenDAO } from "../../dao/interfaces/AuthTokenDAO";

export class UserService {
    private usersDAO: UsersDAO;
    private authorizationService: AuthorizationService;
    private s3DAO: S3DAO;
    private authTokenDAO: AuthTokenDAO;
  
    constructor(daoFactory: AbstractDAOFactory){
      this.usersDAO = daoFactory.getUsersDAO();
      this.authTokenDAO = daoFactory.getAuthTokenDAO();
      this.authorizationService = new AuthorizationService(this.authTokenDAO);
      this.s3DAO = daoFactory.getS3DAO();
  
    }
    public async getUser(
        token: string,
        alias: string
      ): Promise<User | null> {
        await this.authorizationService.authorize(token);
        const user =  await this.usersDAO.getUser(alias) //this is a userRecord

        return new User(
          user!.firstName, 
          user!.lastName, 
          user!.alias, 
          user!.imageUrl ?? null
        )

      };
    public async login (
      alias: string,
      password: string
    ): Promise<[User, AuthToken]> {

      const userRecord = await this.usersDAO.getUser(alias);

      if (userRecord === null) {
        throw new Error("Invalid alias or password");
      }

      const correctPassword = await bcrypt.compare(
        password, userRecord?.hashedPassword
      )
      if (!correctPassword) throw new Error("Invalid alias or password");

      const user = new User (
        userRecord.firstName, 
        userRecord.lastName, 
        userRecord.alias, 
        userRecord.imageUrl
      )

      const newAuth = new AuthToken(crypto.randomUUID(), Date.now());
      await this.authTokenDAO.createAuthToken(newAuth, alias);

      return [user, newAuth];
    };
      
    public async Register (
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: string,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
      
      const userExists = await this.usersDAO.getUser(alias);
      if (userExists) throw new Error("This user already exists");

      const hashedPassword = await bcrypt.hash(password, 10);


        const imageBuffer =
        Buffer.from(userImageBytes, "base64");

        const imageKey = `${alias}.${imageFileExtension}`;
        const imageUrl = await this.s3DAO.uploadImage(imageKey, imageBuffer);

        const user = new User(firstName, lastName, alias, imageUrl);
        await this.usersDAO.createUser({
          alias, firstName, lastName, hashedPassword, imageUrl
        });

      const newAuth = new AuthToken(crypto.randomUUID(), Date.now());
      await this.authTokenDAO.createAuthToken(newAuth, alias);

        return [user, newAuth];
    };

    public async Logout (token: string): Promise<void> {  
      await this.authorizationService.authorize(token);
      await this.authTokenDAO.deleteAuthToken(token);

      await new Promise((res) => setTimeout(res, 1000));
    };

}

