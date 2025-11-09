import { AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface AppNavView extends View{
    navigate: (path: string) => void;
    displayInfoMessage: (message: string, duration: number, bootstrapClasss?: string | undefined) => string;
    clearUserInfo: () => void;
    deleteMessage: (messageId: string) => void;
}

export class AppNavPresenter extends Presenter<AppNavView>{
    private userService: UserService;

    constructor(view: AppNavView){
        super(view);
        this.userService = new UserService();
    }

    public get service(){
        return this.userService;
    }

    public async logOut(authToken: AuthToken){
        const loggingOutToastId = this.view.displayInfoMessage("Logging out...", 0);
        this.doFailureReportingOperation(async () => {
            await this.service.Logout(authToken!);
            this.view.deleteMessage(loggingOutToastId);
            this.view.clearUserInfo();
            this.view.navigate("/login");
        }, "log user out")
    
    }
}