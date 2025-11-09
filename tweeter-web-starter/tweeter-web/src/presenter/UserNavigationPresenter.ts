import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";


export interface UserNavView extends View{
    setDisplayedUser: (user: User) => void;
    navigate: (path: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavView>{
    private userService: UserService;

    public constructor(view: UserNavView){
        super(view);
        this.userService = new UserService();
    }

    public async onNavigateToUser (event: React.MouseEvent, authToken: AuthToken, displayedUser: User | null, featurePath: string): Promise<void> {
        event.preventDefault();
        await this.doFailureReportingOperation(async() => {
          const alias = this.extractAlias(event.target.toString());
          const toUser = await this.userService.getUser(authToken!, alias);
          if (toUser) {
            if (!toUser.equals(displayedUser!)) {
              this.view.setDisplayedUser(toUser);
              this.view.navigate(`${featurePath}/${toUser.alias}`);
            }
          }
          }, "get user")
    };

    public extractAlias (value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };
}