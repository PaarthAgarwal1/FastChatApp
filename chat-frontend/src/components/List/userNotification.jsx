import { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useFriendStore } from "../../store/useFriendStore";

const Notifications = () => {
  const {
    friendRequests,
    getFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
  } = useFriendStore();

  useEffect(() => {
    getFriendRequests();
  }, []);
  console.log("friend requests in notifications", friendRequests);
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-100 mb-3">Friend Requests</h3>
      {friendRequests.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {friendRequests.map((request) => (
            <li key={request._id} className="flex justify-between items-center bg-white/20 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <img
                  src={request.sender_id.profile_picture || "./avatar.png"}
                  alt={request.sender_id.username}
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <span className="text-white">{request.sender_id.username}</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 transition-all flex items-center"
                  onClick={() => acceptFriendRequest(request._id)}
                >
                  <FaCheck />
                </button>
                <button
                  className="p-1 text-2xl bg-red-400 text-white rounded-md hover:bg-red-600 transition-all flex items-center"
                  onClick={() => 
                    declineFriendRequest(request._id)}
                >
                  <MdDeleteForever />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-300">No new friend requests</p>
      )}
    </div>
  );
};

export default Notifications;