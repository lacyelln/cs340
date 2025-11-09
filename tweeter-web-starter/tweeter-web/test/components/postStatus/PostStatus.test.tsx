import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import PostStatus from "../../../src/components/postStatus/PostStatus"
import userEvent from "@testing-library/user-event"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab} from "@fortawesome/free-brands-svg-icons";
import "@testing-library/jest-dom"
import { anything, instance, mock, verify } from "@typestrong/ts-mockito"
import { User, AuthToken } from "tweeter-shared";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("Post Status Component", () => {
    const mockUser = mock<User>();
    const mockUserInstance = instance(mockUser);

    const mockAuthToken = mock<AuthToken>();
    const mockAuthTokenInstance = instance(mockAuthToken);

    beforeAll(() => {
        (useUserInfo as jest.Mock).mockReturnValue({
        currentUser: mockUserInstance,
        authToken: mockAuthTokenInstance,
        });
    });

    it("first rendered the Post Status and Clear buttons are both disabled", async () =>{
        const {postStatusButton, clearButton} = renderPostStatusAndGetElement();
        expect(postStatusButton).toBeDisabled()
        expect(clearButton).toBeDisabled()

    })
    it("Both buttons are enabled when the text field has text.", async () => {
        const {postStatusButton, clearButton, user, postField} = renderPostStatusAndGetElement();
        await user.type(postField, "hi");

        expect(postStatusButton).toBeEnabled()
        expect(clearButton).toBeEnabled()
        

    })
    it("Both buttons are disabled when the text field is cleared.", async () => {
        const {postStatusButton, clearButton, user, postField} = renderPostStatusAndGetElement();
        await user.type(postField, "hola");
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled()

        await user.clear(postField)
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled()


    })
    it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed.", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);
        const post = "jola";
        
        const {postStatusButton, clearButton, user, postField} = renderPostStatusAndGetElement(mockPresenterInstance);
        await user.type(postField, post);

        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled()

        await user.click(postStatusButton);
        verify(mockPresenter.submitPost(anything(), post, mockUserInstance, mockAuthTokenInstance))
    })
})

function renderPostStatus(presenter?: PostStatusPresenter){
    return render(
        <MemoryRouter>
            <PostStatus presenterFactory={presenter}/>
        </MemoryRouter>
    );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter){
    const user = userEvent.setup();
    renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postField = screen.getByPlaceholderText(/What's on your mind/i);

  return { user, postStatusButton, clearButton, postField };
}