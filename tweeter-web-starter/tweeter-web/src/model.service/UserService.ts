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

      const response = await this.serverFacade.login({alias: alias, password: password});

    if (!response.success || !response.user || !response.token) {
      throw new Error(response.message ?? "Login failed");
    }

    const user: User = User.fromDto(response.user)!;
    const authToken: AuthToken = response.token;

    return [user, authToken];

    };
      
    public async Register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {

    const imageBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const response = await this.serverFacade.register({
      firstName,
      lastName,
      alias,
      password,
      userImageBytes: imageBase64,
      imageFileExtension,
    });

    
    if (!response.success || !response.user || !response.token) {
      throw new Error(response.message ?? "Login failed");
    }

    const user: User = User.fromDto(response.user)!;
    const authToken: AuthToken = response.token;

    return [user, authToken];
  
  };

  public async Logout (authToken: AuthToken): Promise<void> {
      // Pause so we can see the logging out message. Delete when the call to the server is implemented.
      this.serverFacade.logout({token: authToken.token});
    };

}

