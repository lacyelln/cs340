import { User, AuthToken } from "tweeter-shared";
import { Service } from "../model.service/Service";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";
import { Buffer } from "buffer";

export interface AuthView extends View{
    setIsLoading: (isLoading: boolean) => void,
    navigate: (path: string) => void,
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, rememberMe: boolean ) => void
}

export abstract class AuthPresenter<V extends AuthView> extends Presenter<V>{
    public userService: UserService;  

    public constructor(view: V){
        super(view);
        this.userService = new UserService();
    }

    protected async doAuth( 
        description: string, 
        authOperation: () => Promise<[User, AuthToken]>, 
        rememberMe: boolean, 
        navigateAfter: (user: User) => void
    ) {
        this.doFailureReportingOperation(async () => {
            this.view.setIsLoading(true);
            const [user, authToken] = await authOperation();
            this.view.updateUserInfo(user, user, authToken, rememberMe);
            navigateAfter(user);
        }, this.itemDescription(), () => this.view.setIsLoading(false)) 
    };

    protected abstract itemDescription(): string


}