import OAuth from "./oAuth/oAuth";

interface Props {
  headingText: string;
  submitButtonLabel: string;
  oAuthHeading: string;
  inputFieldFactory: () => JSX.Element;
  switchAuthenticationMethodFactory: () => JSX.Element;
  setRememberMe: (value: boolean) => void;
  submitButtonDisabled: () => boolean;
  isLoading: boolean;
  submit: () => void;
}

const AuthenticationFormLayout = (props: Props) => {

  return (
    <div className="center">
      <div className="form-main w-100 m-auto rounded">
        <form>
          <img
            className="mb-4"
            src="/bird-logo-64.png"
            alt=""
            width="72"
            height="72"
          />
          <h1 className="h3 mb-3 fw-normal">{props.headingText}</h1>

          {props.inputFieldFactory()}

          <h1 className="h4 mb-3 fw-normal">Or</h1>
          <h1 className="h5 mb-3 fw-normal">{props.oAuthHeading}</h1>

          <div className="text-center mb-3">
            <OAuth 
            message="Google registration is not implemented." 
            tooltip="Google" 
            icon={["fab", "google"]}
            />
        
            <OAuth 
            message="Facebook registration is not implemented."
            tooltip="facebook"
            icon={["fab", "facebook"]}
            />
            
            <OAuth
            message="Twitter registration is not implemented."
            tooltip="twitter"
            icon={["fab", "twitter"]}
            />

            <OAuth 
            message="LinkedIn registration is not implemented."
            tooltip="linkedIn"
            icon={["fab", "linkedin"]}
            />
            
            <OAuth 
            message="Github registration is not implemented."
            tooltip="github"
            icon={["fab", "github"]}
            />
        
          </div>

          <div className="checkbox mb-3">
            <label>
              <input
                type="checkbox"
                value="remember-me"
                onChange={(event) => props.setRememberMe(event.target.checked)}
              />{" "}
              Remember me
            </label>
          </div>

          {props.switchAuthenticationMethodFactory()}

          <button
            id="submitButton"
            className="w-100 btn btn-lg btn-primary"
            type="button"
            disabled={props.submitButtonDisabled()}
            onClick={() => props.submit()}
          >
            {props.isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <div>{props.submitButtonLabel}</div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthenticationFormLayout;
