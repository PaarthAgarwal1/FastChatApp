import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { IoMdArrowDropdown, IoMdArrowDropup, IoMdDownload, IoMdClose, IoMdLogOut, IoMdCloseCircle } from "react-icons/io";
import { useChatStore } from "../../store/useChatStore";
import { useUserStore } from "../../store/useUserStore";


const downloadImage = async (imageUrl, imageName) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = imageName || `shared-photo-${Date.now()}.jpg`; // Assigns dynamic name if not provided
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
};


const Detail = () => {
  const { selectedUser, messages } = useChatStore();
  const { authUser, blockUser, unblockUser } = useAuthStore();
  const { userDetails } = useUserStore();
  const [expandedSections, setExpandedSections] = useState({
    sharedFiles: false,
    sharedPhotos: false,
  });
  const [imagesArray, setImagesArray] = useState([]);
  useEffect(() => {
    const newImagesArray = messages
      .filter(msg => msg.image && msg.image.trim() !== '')
      .map(msg => msg.image);
    setImagesArray(newImagesArray);
  }, [messages]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isBlocked = authUser?.blocked?.includes(selectedUser._id);

  const handleBlockToggle = async () => {
    if (isBlocked) {
      await unblockUser(selectedUser._id);
    } else {
      await blockUser(selectedUser._id);
    }
  };

  useEffect(() => {
    setExpandedSections({
      sharedFiles: false,
      sharedPhotos: false,
    })
  }, [selectedUser])

  const isBlockedBySelectedUser = selectedUser?.blocked?.includes(authUser._id);
  return (
    <div className=" basis-1/3 flex-1 rounded-lg shadow-md max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl w-full bg-gray-800 text-white flex flex-col">
      {/* User Info */}
      <div className="relative px-6 py-4 flex flex-col items-center gap-2 border-b border-gray-600">
        <img
          src={!isBlockedBySelectedUser? selectedUser?.profile_picture || "./avatar.png":"./avatar.png"}
          alt="User Avatar"
          className="w-30 h-30 sm:w-38 sm:h-38 rounded-full object-cover ring-2 ring-slate-500 shadow-blue-500"
        />
        <h2 className="text-lg sm:text-xl font-semibold text-center">
          {selectedUser?.username || "User Name"}
        </h2>
        <p className="text-gray-300 text-center text-sm sm:text-base">
          {!isBlockedBySelectedUser?selectedUser?.description || "No bio available":"No bio available"}
        </p>
        <button
          onClick={userDetails}
          className="absolute top-2 right-2"
        >
          <IoMdCloseCircle
            className="text-2xl text-gray-500 hover:text-gray-300 transition-transform duration-200 hover:scale-110"
          />
        </button>

      </div>

      {/* Scrollable Content */}
      <div className="flex-1 p-5 overflow-y-scroll custom-scrollbar">
        {/* Shared Files Section */}
        <div className="option">
          <div
            className="title flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("sharedFiles")}
          >
            <span className="text-base sm:text-lg font-medium">Shared Files</span>
            {expandedSections.sharedFiles ? (
              <IoMdArrowDropup className="text-gray-400 text-xl sm:text-2xl" />
            ) : (
              <IoMdArrowDropdown className="text-gray-400 text-xl sm:text-2xl" />
            )}
          </div>
          {expandedSections.sharedFiles && (
            <div className="content mt-3 text-gray-400 text-sm overflow-auto">No shared files available.</div>
          )}
        </div>

        {/* Shared Photos Section */}
        <div className="option mt-4">
          <div
            className="title flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("sharedPhotos")}
          >
            <span className="text-lg font-medium">Shared Photos</span>
            {expandedSections.sharedPhotos ? (
              <IoMdArrowDropup className="text-gray-400 text-xl sm:text-2xl" />
            ) : (
              <IoMdArrowDropdown className="text-gray-400 text-xl sm:text-2xl" />
            )}
          </div>
          {expandedSections.sharedPhotos && (
            <div className="photos flex flex-col gap-3 mt-3">
              {imagesArray.length > 0 ? imagesArray.map((url, idx) => {
                const fileName = url.split("/").pop().split("?")[0] || `photo-${idx + 1}.jpg`;

                return (
                  <div key={idx} className="photoItem flex items-center justify-between">
                    <div className="photoDetail flex items-center gap-3">
                      <img
                        src={url}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
                        alt="Shared"
                      />
                      <span className="text-xs sm:text-sm text-gray-300">{fileName}</span>
                    </div>
                    <button onClick={() => downloadImage(url, fileName)} disabled={isBlockedBySelectedUser}>
                    <IoMdDownload
                      className="text-gray-400 text-xl cursor-pointer hover:text-gray-200"
                    />
                    </button>
                    
                  </div>
                );
              }) : <div className="content text-gray-400 text-sm overflow-auto">No shared photos available.</div>}
            </div>
          )}
        </div>
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

      {/* Fixed Bottom Buttons */}
      {authUser && (
        <div className="p-5 border-t border-gray-700 flex flex-col gap-3 mt-auto">
          <button onClick={handleBlockToggle}
           className="py-2 px-4 flex items-center justify-center gap-2 text-white rounded-md bg-red-400/35 hover:bg-red-600 transition-colors duration-300 shadow font-semibold w-full">
            <IoMdClose className="text-lg" /> {isBlocked ? "Unblock User" : "Block User"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Detail;
