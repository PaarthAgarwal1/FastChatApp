import { useEffect, useState } from "react";
import UserInfo from "./userInfo";
import ChatList from "./chatList";
import Notifications from "./userNotification";
import Sidebar from "../sideBar/sidebar";
import { useAuthStore } from "../../store/useAuthStore";
 // New Notifications Component

const List = ({ setUpdateProfile }) => {
  const [show, setShow] = useState(false);
  const{authUser,checkAuth}=useAuthStore();
  useEffect(() => {
    checkAuth(); 
  }, [authUser, checkAuth]);
  
  return (
    <div className="basis-1/4 flex flex-col">
      <UserInfo setUpdateProfile={setUpdateProfile} setShow={setShow} />
      {show ? <Notifications /> : <ChatList />}
      <Sidebar/>
    </div>
  );
};

export default List;
