import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";
import { useUserStore } from "../../store/useUserStore";

const ChatHeader=()=>{
    const {selectedUser}=useChatStore();
    const{userDetails,}=useUserStore();
    const{onlineUsers,authUser}=useAuthStore();
    const isBlockedBySelectedUser = selectedUser?.blocked?.includes(authUser._id);
    return (
        <div className="top p-5 py-4 flex items-center justify-between border-b border-slate-500">
        <div onClick={userDetails} className="flex items-center gap-2 w-full">
          <img className="w-14 h-14 rounded-full object-cover" src={!isBlockedBySelectedUser?selectedUser?.profile_picture || "./avatar.png":"./avatar.png"} alt="logo" />
          <div className="flex flex-col items-start">
            <span className="font-bold text-lg">{selectedUser?.username || "User Name"}</span>
            {!isBlockedBySelectedUser&&<p className=" text-slate-300">{onlineUsers.includes(selectedUser._id)?"Online":"Offline"}</p>}
          </div>
        </div>
        <div className="flex gap-5 px-4">
          <img className="w-5 h-5" src="./phone.png" />
          <img className="w-5 h-5" src="./video.png" />
          <img className="w-5 h-5" src="./info.png" />
        </div>
      </div> 
    );

}
export default ChatHeader;
