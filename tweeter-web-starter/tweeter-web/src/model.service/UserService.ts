import { Buffer } from "buffer";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { Service } from "./Service";
import { ServerFacade } from "../network/ServerFacade";

export class UserService implements Service{

  private serverFacade = new ServerFacade();
  
    public async getUser(
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return this.serverFacade.getUser({token: authToken.token, alias: alias});
      };

    public async login (
      alias: string,
      password: string
    ): Promise<[User, AuthToken]> {
      // TODO: Replace with the result of calling the server

      return this.serverFacade.login({alias: alias, password: password});
      // const user = FakeData.instance.firstUser;
      // if (user === null) {
      //   throw new Error("Invalid alias or password");
      // }

      // return [user, FakeData.instance.authToken];
    };
      
    public async Register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    return this.serverFacade.register({
      firstName,
      lastName,
      alias,
      password,
      userImageBytes: imageBase64,
      imageFileExtension,
    });

  
  };

  public async Logout (authToken: AuthToken): Promise<void> {
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      this.serverFacade.logout({token: authToken.token});
    };

}

