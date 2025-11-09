import "./MainLayout.css";
import { Outlet } from "react-router-dom";
import AppNavbar from "../appNavbar/AppNavbar";
import PostStatus from "../postStatus/PostStatus";
import UserInfo from "../userInfo/UserInfoComponent";
import { PostStatusPresenter, PostStatusView } from "../../presenter/PostStatusPresenter";
import { AppNavPresenter, AppNavView } from "../../presenter/AppNavPresenter";
import UserInfoProvider from "../userInfo/UserInfoProvider";
import { UIView, UIPresenter } from "../../presenter/UserInfoPresenter";

const MainLayout = () => {
  return (
    <>
      <AppNavbar presenterFactory={(view: AppNavView) => new AppNavPresenter(view)} />
      <div className="container mx-auto px-3 w-100">
        <div className="row gx-4">
          <div className="col-4">
            <div className="row gy-4">
              <div className="p-3 mb-4 border rounded bg-light">
                <UserInfo presenterFactory={(view: UIView) => new UIPresenter(view)}/>
              </div>
              <div className="p-3 border mt-1 rounded bg-light">
                <PostStatus />
              </div>
            </div>
          </div>
          <div className="col-8 px-0">
            <div className="bg-white ms-4 w-100">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
