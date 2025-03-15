import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import MessageInput from "./messageInput";
import ChatHeader from "./chatHeader";
import { useUserStore } from "../../store/useUserStore";
import MessageSkeleton from "./messageSkeleton";
import { formatMessageTime } from "../../lib/utils";
import { useAuthStore } from "../../store/useAuthStore";

const Chat = () => {
  const { selectedUser, isMessageLoading, messages, getMessages, subscribeToMessage, unsubscribeToMessage } = useChatStore();
  const { isUserDetail } = useUserStore();
  const { authUser } = useAuthStore();
  const endRef = useRef(null);

  const isBlockedBySelectedUser = selectedUser?.blocked?.includes(authUser._id);

  useEffect(() => {
    if (!selectedUser) return;
    
    getMessages(selectedUser._id);
    subscribeToMessage();
    
    console.log("Subscribed to messages for", selectedUser._id);

    return () => {
      unsubscribeToMessage();
      console.log("Unsubscribed from messages");
    };
  }, [selectedUser]);

  useEffect(() => {
    if (endRef.current) {
      setTimeout(() => {
        endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [messages.length]);

  if (isMessageLoading) {
    return (
      <div className={`flex flex-col border-l border-r border-slate-500 ${isUserDetail ? "basis-2/3" : "w-full"}`}>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className={`flex flex-col border-l border-r border-slate-500 ${isUserDetail ? "basis-2/3" : "w-full"}`}>
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex gap-5 mb-4 ${message.sender_id === authUser._id ? "ml-auto flex-row-reverse" : ""}`}
            ref={endRef}
          >
            <div className="w-8 h-8 rounded-full border overflow-hidden">
              <img
                src={message.sender_id === authUser._id ? authUser.profile_picture || "/avatar.png" : !isBlockedBySelectedUser?selectedUser.profile_picture || "/avatar.png":"/avatar.png"}
                alt="profile pic"
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`flex flex-col gap-2 ${message.sender_id === authUser._id ? "items-end" : "items-start"}`}>
              {message.image && <img src={message.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2 object-cover" />}
              {message.text && <p className={`p-2 text-sm rounded-lg ${message.sender_id === authUser._id ? "bg-blue-500 text-white" : "bg-gray-600 text-white"}`}>{message.text}</p>}
              <span className="text-xs text-gray-300">{formatMessageTime(message.createdAt)}</span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      <MessageInput />
    </div>
  );
};

export default Chat;
