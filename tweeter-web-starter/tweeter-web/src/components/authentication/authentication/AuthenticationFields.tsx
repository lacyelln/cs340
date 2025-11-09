interface Props {
  originalUrl?: string;
  alias: string;
  authenticate: () => void;
  buttonStatus: () => boolean;
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
}


const AuthenticationField = ({
  originalUrl,
  alias,
  authenticate,
  buttonStatus,
  setAlias,
  setPassword,
}: Props) => {

    const onEnter = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key == "Enter" && !buttonStatus()) {
            authenticate()
        }
    };

    return(
        <div>
            <div className="form-floating">
            <input
                type="text"
                className="form-control"
                size={50}
                id="aliasInput"
                aria-label="alias"
                placeholder="name@example.com"
                onKeyDown={onEnter}
                onChange={(event) => setAlias(event.target.value)}
            />
            <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating mb-3">
            <input
                type="password"
                className="form-control bottom"
                id="passwordInput"
                aria-label="password"
                placeholder="Password"
                onKeyDown={onEnter}
                onChange={(event) => setPassword(event.target.value)}
            />
            <label htmlFor="passwordInput">Password</label>
            </div>
        </div>

    );
}

export default AuthenticationField;