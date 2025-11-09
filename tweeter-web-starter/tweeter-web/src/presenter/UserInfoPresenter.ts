import { User, AuthToken } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { Presenter, View } from "./Presenter";

export interface UIView extends View{
    displayErrorMessage: (message: string) => void,
    setIsLoading: (isLoading: boolean) => void,
    displayInfoMessage: (message: string, duration: number, bootstrapClasss?: string | undefined) => string;
    deleteMessage: (messageId: string) => void;
    setIsFollower: React.Dispatch<React.SetStateAction<boolean>>;
    setFolloweeCount: React.Dispatch<React.SetStateAction<number>>;
    setFollowerCount: React.Dispatch<React.SetStateAction<number>>;
}

export class UIPresenter extends Presenter<UIView>{
    private followService: FollowService;

    constructor(view: UIView){
        super(view)
        this.followService = new FollowService();
    }

    public async setIsFollowerStatus (authToken: AuthToken, currentUser: User, displayedUser: User) {
      this.doFailureReportingOperation(async () => {
        if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.followService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
      }, "determine follower status")
  };

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
    }, "get followees count")
  };

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User){
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
    }, "get followers count")
  };

  public async withDisplayedUser(displayedUser: User, authToken: AuthToken, infoMessage: string, operation: () => Promise<[number, number]>, operationDescription: string, followStatus: boolean){
    var userToast = "";
    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
        userToast = this.view.displayInfoMessage(
        `${infoMessage} ${displayedUser!.name}...`,
        0)
      const [followerCount, followeeCount] = await operation();
      this.view.setIsFollower(followStatus);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);

    }, operationDescription, async() => {
      this.view.deleteMessage(userToast);
      this.view.setIsLoading(false);
    })
  }

  public async followDisplayedUser(displayedUser: User, authToken: AuthToken){
      this.withDisplayedUser(displayedUser, authToken, "Following", async () => {
        return this.followService.follow(authToken!, displayedUser!);
      }, "follow user", true)
  };

  public async unfollowDisplayedUser(displayedUser: User, authToken: AuthToken){
    this.withDisplayedUser(displayedUser, authToken, "Unfollowing", async () => { 
      return this.followService.unfollow(authToken!, displayedUser!);
    }, "unfollow user", false)
  }

};


    