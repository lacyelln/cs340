import { User } from "tweeter-shared";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface LoginView extends AuthView {}

export class LoginPresenter extends AuthPresenter<LoginView>{
    protected itemDescription(): string {
      return "login user"
    }

    public async login( 
        alias: string, 
        password: string, 
        rememberMe: boolean,
        originalUrl: string | undefined) {
        await this.doAuth("log user in", () => this.userService.login(alias, password), rememberMe,(user: User) => {
            if(originalUrl){
                this.view.navigate(originalUrl);
            } else{
                this.view.navigate(`/feed/${user.alias}`);
            }
        });
    };
}