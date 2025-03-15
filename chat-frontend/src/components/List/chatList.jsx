import { AiOutlinePlus } from "react-icons/ai";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../store/useUserStore";
import { useFriendStore } from "../../store/useFriendStore";
import { useState, useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import axios from "axios";

const ChatList = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { add, setAdd } = useUserStore();
  const { authUser } = useAuthStore();
  const { friends, getFriends } = useFriendStore();
  const { onlineUsers } = useAuthStore();
  const [recentMessages, setRecentMessages] = useState({});
  const [query, setQuery] = useState("");

  useEffect(() => {
    getFriends();
  }, []);

  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const friendIds = friends.map((friend) => friend._id);
        const res = await axios.post(`/api/messages/recent`, { userId: authUser._id, friendIds });
        setRecentMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (friends.length > 0) {
      fetchRecentMessages();
    }
  }, [friends]);

  // Filter friends based on search query
  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="search flex items-center gap-2 py-5 px-2">
        <div className="searchBar p-2 flex-1 bg-custom-rgba-search flex items-center gap-2 rounded-lg">
          <img className="w-5 h-5" src="/search.png" alt="Search" />
          <input
            className="bg-transparent w-full border-none outline-none text-white flex-1"
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <button
          onClick={setAdd}
          className="w-9 h-9 flex items-center justify-center bg-custom-rgba-search p-2 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-300"
        >
          <AiOutlinePlus size={20} color="white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <button
              key={friend._id}
              onClick={() => setSelectedUser(friend)}
              className={`w-full flex items-center gap-5 p-5 cursor-pointer border-b border-slate-500 hover:bg-gray-400 hover:text-gray-900 transition-colors duration-200 
                ${selectedUser?._id === friend._id ? "bg-gray-400 text-gray-900" : ""}`}
            >
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full"
                  src={
                    friend?.blocked?.includes(authUser._id)
                      ? "/avatar.png"
                      : friend.profile_picture || "/default-avatar.png"
                  }
                  alt="Avatar"
                />
                {!friend?.blocked?.includes(authUser._id) && onlineUsers.includes(friend._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-slate-600" />
                )}
              </div>

              <div className="flex flex-col items-start">
                <span className="block font-semibold">{friend.username}</span>
                {!friend?.blocked?.includes(authUser._id) && (
                  <p className="text-gray-600 text-sm truncate w-40">
                    {recentMessages[friend._id] || "Loading..."}
                  </p>
                )}
              </div>
            </button>
          ))
        ) : (
          <p className="text-gray-300 p-5">No friends found.</p>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {add && <AddUser />}
    </div>
  );
};

export default ChatList;
