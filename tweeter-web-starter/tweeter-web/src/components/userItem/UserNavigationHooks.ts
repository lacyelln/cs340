import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { useNavigate } from "react-router-dom";
import { UserNavigationPresenter, UserNavView } from "../../presenter/UserNavigationPresenter";
import { useRef } from "react";


export const useUserNavigation = (featurePath: string, presenterFactory: (view: UserNavView) => UserNavigationPresenter) => {

    const { displayErrorMessage } = useMessageActions();
    const { displayedUser, authToken } = useUserInfo();
    const { setDisplayedUser } = useUserInfoActions();

    const navigate = useNavigate();

    const listener: UserNavView = {
        displayErrorMessage: displayErrorMessage,
        setDisplayedUser: setDisplayedUser,
        navigate: navigate
      }
    
    const presenterRef = useRef<UserNavigationPresenter | null >(null)
    if (!presenterRef.current){
      presenterRef.current = presenterFactory(listener);
    }

    const navigateToUser = async (event: React.MouseEvent) => {
      event?.preventDefault();
      presenterRef.current!.onNavigateToUser(event, authToken!, displayedUser, featurePath)
  };
    

  return navigateToUser;

};



