import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { StatusService } from "../../src/model.service/StatusService";
import { AuthToken, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockService: StatusService;

   const event = {
      preventDefault: jest.fn(),
    } as unknown as React.MouseEvent;

  const authToken = new AuthToken("hola", Date.now());
  const post = "It's lacy";
  const currentUser = new User("first", "last", "@amy", "image.jpg");

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);
    when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn("messageId123");

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockService = mock<StatusService>();
    when(postStatusPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(event, post, currentUser, authToken);
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();});

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockService.postStatus(authToken, anything())).once();

    const [capturedAuthToken, capturedStatus] = capture(mockService.postStatus).last();
    expect(capturedStatus.post).toEqual(post);
    expect(capturedAuthToken).toEqual(authToken);
  });

  test("tells the view to clear the info message that was displayed previously, clears the post, and displays a status posted message when successful", async () => {
    await postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockPostStatusView.deleteMessage("messageId123")).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once();
  });

  test("tells the view to clear the info message and displays an error message but does not tell it to clear the post or display a status posted message when unsuccessful", async () => {
    let error = new Error("An error occured");
    when(mockService.postStatus(anything(), anything())).thenThrow(error);

    await postStatusPresenter.submitPost(event, post, currentUser, authToken);

    verify(mockPostStatusView.deleteMessage("messageId123")).once();
    verify(mockPostStatusView.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      )).once();
    verify(mockPostStatusView.setPost(anything())).never();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
  });
});