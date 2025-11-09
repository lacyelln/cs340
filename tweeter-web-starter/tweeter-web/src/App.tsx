import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedStatusPresenter } from "./presenter/FeedStatusPresenter";
import { StoryStatusPresenter } from "./presenter/StoryStatusPresenter";
import { LoginPresenter } from "./presenter/LoginPresenter";
import { RegisterPresenter } from "./presenter/RegisterPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import UserItem from "./components/userItem/UserItem";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" element={<ItemScroller<Status, FeedStatusPresenter> key={`feed-${displayedUser!.alias}`} featureUrl={"/feed"} presenterFactory={(view: PagedItemView<Status>)=> new FeedStatusPresenter(view)} itemComponentFactory={(item, featurePath) => (<StatusItem status={item} featurePath={featurePath} />)}/>} />
        <Route path="story/:displayedUser" element={<ItemScroller<Status, StoryStatusPresenter> key={`story-${displayedUser!.alias}`} featureUrl={"/story"} presenterFactory={(view: PagedItemView<Status>)=> new StoryStatusPresenter(view)} itemComponentFactory={(item, featurePath) => (<StatusItem status={item} featurePath={featurePath} />)}/>} />
        <Route path="followees/:displayedUser" element={<ItemScroller<User, FolloweePresenter> key={`followees-${displayedUser!.alias}`} featureUrl="/followees" presenterFactory={(view: PagedItemView<User>) => new FolloweePresenter(view)} itemComponentFactory={(item, featurePath) => (<UserItem user={item} featurePath={featurePath} />)}/>} />
        <Route path="followers/:displayedUser" element={<ItemScroller<User, FollowerPresenter> key={`followers-${displayedUser!.alias}`} featureUrl="/followers" presenterFactory={(view: PagedItemView<User>) => new FollowerPresenter(view)} itemComponentFactory={(item, featurePath) => (<UserItem user={item} featurePath={featurePath} />)}/>} />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login originalUrl={location.pathname}/>} />
      <Route path="/register" element={<Register presenterFactory={(view) => new RegisterPresenter(view)}/>} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
