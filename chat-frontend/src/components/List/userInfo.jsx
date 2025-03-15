import { IoIosNotifications } from "react-icons/io";
import { useAuthStore } from "../../store/useAuthStore";
import { useFriendStore } from "../../store/useFriendStore";
import { useState,useEffect } from "react";
import { useUserStore } from "../../store/useUserStore";

const UserInfo = ({ setUpdateProfile, setShow }) => {
  const {updatingUser}=useUserStore();
  const {authUser}=useAuthStore();
  const {friendRequests}=useFriendStore();
  const [customCss,setCustomCss]=useState("text-white");
  useEffect(() => {
    setCustomCss(friendRequests.length > 0 ? "text-red-500 " : "text-white");
  }, [friendRequests]);
  return (
    <div className="p-5 w-full flex items-center justify-between bg-gray-900/45 rounded-tl">
      <div className="flex items-center gap-2">
        <img
          className="w-[45px] h-[45px] rounded-full object-cover"
          src={authUser?.profile_picture || "./avatar.png"}
          alt="Profile"
        />
        <h2 className="font-semibold">{authUser?.username || "User"}</h2>
      </div>
      <div className="flex gap-5">
        <IoIosNotifications 
          className={`w-6 h-6 cursor-pointer ${customCss}`} 
          onClick={() => setShow((prev) => !prev)} 
        />
        <img 
          className="w-5 h-5 cursor-pointer" 
          src="./edit.png" 
          alt="Edit"
          onClick={updatingUser}
        />
      </div>
    </div>
  );
};

export default UserInfo;
