import { MemoryRouter } from "react-router-dom";
import Login  from "../../../../src/components/authentication/login/Login"
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab} from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito"


library.add(fab);


describe("Login Component", () => {

    it("starts with sign in button disabled", () => {
        const { signInButton } = renderLoginAndGetElement("/")
        expect(signInButton).toBeDisabled()
    })

    it("enables sign in button if both alias and password fields have text", async () => {
        const {signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/");
        await user.type(aliasField, "a");
        await user.type(passwordField, "a");
        expect(signInButton).toBeEnabled();

    })

    it("disables sign in button if either passowrd or alias box is cleared", async () => {
        const {signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/");
        await user.type(aliasField, "a");
        await user.type(passwordField, "a");
        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(aliasField, "a");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled(); 

    })

    it("calls the presenters login method with correct parameters when sign in button is pressed", async() => {
        const mockPresenter = mock<LoginPresenter>()
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "http://something.com";
        const alias = "@lacy";
        const password = "password";

        const {signInButton, aliasField, passwordField, user } = renderLoginAndGetElement(originalUrl, mockPresenterInstance);


        await user.type(aliasField, alias);
        await user.type(passwordField, password);

        await user.click(signInButton);
        verify(mockPresenter.login(alias, password, false, originalUrl)).once()
        
    })
})

function renderLogin(originalUrl: string, presenter?: LoginPresenter){
    return render(
        <MemoryRouter>
            {!!presenter ? (<Login originalUrl={originalUrl} presenterFactory={presenter}/>) : (
                <Login originalUrl={originalUrl} />
            )}
        </MemoryRouter>
    );
}

function renderLoginAndGetElement(originalUrl: string, presenter?: LoginPresenter){
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);
    const signInButton = screen.getByRole("button", { name: /Sign in/i})
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { user, signInButton, aliasField, passwordField }
}