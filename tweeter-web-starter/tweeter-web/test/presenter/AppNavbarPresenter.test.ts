import { AuthToken } from "tweeter-shared";
import { AppNavPresenter, AppNavView } from "../../src/presenter/AppNavPresenter"
import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito"
import { UserService } from "../../src/model.service/UserService";

describe("AppNavPresenter", () => {
    let mockAppNavPresenterView: AppNavView;
    let appNavPresenter : AppNavPresenter;
    let mockService: UserService;

    const authToken = new AuthToken("abc123", Date.now());

    beforeEach(() => {
        mockAppNavPresenterView = mock<AppNavView>();
        const mockAppNavPresenterViewInstance = instance(mockAppNavPresenterView)

        mockService = mock<UserService>();
        const mockServiceInstance = instance(mockService);

        const realPresenter = new AppNavPresenter(mockAppNavPresenterViewInstance);

        const presenterSpy = spy(realPresenter);
        when(presenterSpy.service).thenReturn(mockServiceInstance);

        appNavPresenter = instance(presenterSpy);

        when(mockAppNavPresenterView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");

        // const appNavPresenterSpy = spy(new AppNavPresenter(mockAppNavPresenterViewInstance));
        // appNavPresenter = instance(appNavPresenterSpy);

        
        // when(appNavPresenterSpy.service).thenReturn();

    })

    it("tells the view to display a logging out message", async () => {
        await appNavPresenter.logOut(authToken);
        verify(mockAppNavPresenterView.displayInfoMessage("Logging out...", 0)).once();
    })

    it("calls logout on the user service with the correct auth token", async () => {
        await appNavPresenter.logOut(authToken);
        verify(mockService.Logout(authToken)).once();

    })

    it("tells the view to clear the display info message displayed previously, clears the user info, and navigates to the login page on success", async () => {
        await appNavPresenter.logOut(authToken);
        verify(mockAppNavPresenterView.deleteMessage("messageId123")).once();
        verify(mockAppNavPresenterView.clearUserInfo()).once();
        verify(mockAppNavPresenterView.navigate("/login")).once()

        verify(mockAppNavPresenterView.displayErrorMessage(anything())).never(); 
    })

    it("logout is not successful, display error message, does not clear the info message or clear the user info or naviagte to login page", async () => {
        let error = new Error("An error occurred");
        when(mockService.Logout(anything())).thenThrow(error);
        await appNavPresenter.logOut(authToken)

        verify(mockAppNavPresenterView.displayErrorMessage("Failed to log user out because of exception: Error: An error occurred")).once(); 
        verify(mockAppNavPresenterView.deleteMessage(anything())).never();
        verify(mockAppNavPresenterView.clearUserInfo()).never();
        verify(mockAppNavPresenterView.navigate("/login")).never()
    })

})