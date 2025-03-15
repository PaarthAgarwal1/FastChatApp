import { useState } from "react";
import { Camera } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const ProfileUpdate = () => {
    const { checkAuth,authUser, isUpdatingProfile, updateProfile, isUpdatingProfilePicture, updateProfilePicture } = useAuthStore();

    const [avatar, setAvatar] = useState({
        file: null,
        url: authUser?.profile_picture || "/avatar.png",
    });

    const [formData, setFormData] = useState({
        username: authUser?.username || "",
        email: authUser?.email || "",
        description: authUser?.description || "",
    });

    // Format account creation date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleAvatarChange = (e) => {
        const image = e.target.files[0];
        if (!image) return;

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = async () => {
            const base64Image = reader.result;
            setAvatar({ file: base64Image, url: base64Image });
        };
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

    };

    const handleUpdate = (e) => {
        e.preventDefault();
        updateProfile(formData);
        checkAuth();
    };

    const handleUpdatePicture = async (e) => {
        e.preventDefault();
        if (avatar.file) {
            await updateProfilePicture({ profile_picture: avatar.file });
        }
        checkAuth();
    };

    return (
        <div className="flex flex-col basis-3/4 border-l border-r border-slate-500 justify-center">
            <div className="backdrop-blur-lg p-10 h-full rounded-lg shadow-md flex flex-col gap-4 items-center">
                <h2 className="text-3xl font-semibold text-gray-100">PROFILE</h2>
                <p className="text-xl text-gray-400">Manage your profile details</p>

                <form onSubmit={handleUpdatePicture} className="flex flex-col gap-5 w-96 items-center">
                    {/* Avatar Upload */}
                    <div className="relative">
                        <img
                            src={avatar.url}
                            alt="Profile"
                            className="size-32 rounded-full object-cover border-2"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200"
                        >
                            <Camera className="w-5 h-5 text-base-200" />
                            <input
                                type="file"
                                id="avatar-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </label>
                    </div>
                    <button type="submit" className="text-gray-100 bg-blue-400 hover:bg-blue-500 p-2 rounded-md">
                        {isUpdatingProfilePicture ? "Uploading..." : "Click the camera icon to update your photo"}
                    </button>
                </form>

                <form onSubmit={handleUpdate} className="flex flex-col gap-2 w-96 items-center">
                    {/* Username */}
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md outline-none bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md outline-none bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
                    />

                    {/* About (Description) */}
                    <textarea
                        placeholder="Tell us about yourself..."
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-md outline-none bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
                    ></textarea>

                    {/* Account Created At */}
                    <p className="text-sm text-gray-400">
                        <span className="font-semibold">Account Created On:</span>{" "}
                        {authUser?.createdAt ? formatDate(authUser.createdAt) : "N/A"}
                    </p>

                    {/* Update Button */}
                    <button
                        type="submit"
                        className="py-3 px-5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
                        disabled={isUpdatingProfile}
                    >
                        {isUpdatingProfile ? "Updating..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdate;
