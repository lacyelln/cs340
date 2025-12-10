import { AuthToken, User } from "tweeter-shared";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../src/presenter/PostStatusPresenter";
import { StatusService } from "../src/model.service/StatusService";
import { ServerFacade } from "../src/network/ServerFacade";
import { anything, instance, mock, verify, when } from "@typestrong/ts-mockito";
import "isomorphic-fetch";


describe("PostStatus Integration Test", () => {
  let mockView: PostStatusView;
  let presenter: PostStatusPresenter;
  let serverFacade: ServerFacade;
  let authToken: AuthToken;
  let currentUser: User;
  let testPost: string;

  beforeAll(async () => {
    serverFacade = new ServerFacade();
    
    const loginResponse = await serverFacade.login({
      alias: "@daisy",
      password: "password",
    });

    authToken = loginResponse.token!;
    currentUser = User.fromDto(loginResponse.user!)!;
  });

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    const mockViewInstance = instance(mockView);
    
    when(mockView.displayInfoMessage(anything(), 0)).thenReturn("testToastId");
    
    presenter = new PostStatusPresenter(mockViewInstance);
    
    testPost = `Posted: ${Date.now()}`;
  });

  test("Post status and verify it appears in story", async () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent;

    
    await presenter.submitPost(mockEvent, testPost, currentUser, authToken); //sends the post

    verify(mockView.displayInfoMessage("Status posted!", 2000)).once();

    const statusService = new StatusService();
     
    const [storyItems, hasMore] = await statusService.loadMoreStoryItems( //gets the story 
      authToken,
      currentUser.alias,
      10,
      null
    );

    expect(storyItems.length).toBeGreaterThan(0); //should have a status
    
    const mostRecentStatus = storyItems[0]; //grab the most recent
    
    // are the status details correct
    expect(mostRecentStatus.post).toBe(testPost);
    expect(mostRecentStatus.user.alias).toBe(currentUser.alias);
    expect(mostRecentStatus.user.firstName).toBe(currentUser.firstName);
    expect(mostRecentStatus.user.lastName).toBe(currentUser.lastName);
  });
});