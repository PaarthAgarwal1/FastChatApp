import { useState, useEffect } from "react";
import { useUserStore } from "../../../store/useUserStore";
import { useFriendStore } from "../../../store/useFriendStore";

const AddUser = () => {
    const { users, getAllUser, isGettingUser, setAdd } = useUserStore();
    const { sendFriendRequest, friends, getFriends } = useFriendStore();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        getAllUser(); // Fetch users when the component mounts
        getFriends(); // Fetch the current user's friends
    }, []);

    useEffect(() => {
        if (users) {
            setFilteredUsers(
                users.filter(user =>
                    user.username.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
    }, [searchQuery, users]);

    const handleSendRequest = async (userId) => {
        await sendFriendRequest(userId);
        getFriends(); // Refresh friend list after sending request
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-lg"
            onClick={() => setAdd(false)} // Close modal when clicking outside
        >
            <div 
                className="addUser p-4 basis-1/4 bg-opacity-30 bg-custom-rgba backdrop-blur-lg rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <form className="flex gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        name="username"
                        className="p-3 w-full border border-gray-300 rounded-md outline-none bg-white/60 text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                <div className="mt-4 max-h-48 overflow-y-scroll custom-scrollbar">
                    {isGettingUser ? (
                        <p className="text-gray-400 text-center">Loading...</p>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => {
                            const isFriend = friends.some(friend => friend._id === user._id);
                            return (
                                <div key={user._id} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-200 hover:text-gray-900">
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={user.profile_picture || "/default-avatar.png"} // Fallback image
                                            alt="User Avatar" 
                                            className="w-12 h-12 rounded-full border border-gray-300"
                                        />
                                        <span>{user.username}</span>
                                    </div>
                                    <button
                                        className={`py-2 px-4 rounded-md transition-all duration-300 ${isFriend ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                        onClick={() => handleSendRequest(user._id)}
                                        disabled={isFriend}
                                    >
                                        {isFriend ? "Added" : "Add"}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-400 text-center">No users found</p>
                    )}
                </div>
                <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none; /* Hide scrollbar for Chrome, Safari and Opera */
        }
        .custom-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
            </div>
        </div>
    );
};

export default AddUser;
