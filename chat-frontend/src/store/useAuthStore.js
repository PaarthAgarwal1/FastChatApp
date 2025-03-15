import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingProfilePicture: false,
    onlineUsers: [],
    socket: null,
    isCheckingAuth: true,

    blockUser: async (userId) => {
        try {
            const res = await axiosInstance.put(`/blocked/block/${userId}`);
            set((state) => ({
                authUser: {
                    ...state.authUser,
                    blocked: [...state.authUser.blocked, userId],
                },
            }));
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to block user");
        }
    },
    
    unblockUser: async (userId) => {
        try {
            const res = await axiosInstance.put(`/blocked/unblock/${userId}`);
            set((state) => ({
                authUser: {
                    ...state.authUser,
                    blocked: state.authUser.blocked.filter(_id => _id !== userId),
                },
            }));
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to unblock user");
        }
    },
    

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });

            get().connectSocket();
        } catch (error) {
            console.error("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signUp: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Sign-up failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.user });
            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");

            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/user/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    updateProfilePicture: async (data) => {
        set({ isUpdatingProfilePicture: true });
        try {
            const res = await axiosInstance.put("/user/update-profile-picture", data);
            set({ authUser: res.data });
            toast.success("Profile picture updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile picture");
        } finally {
            set({ isUpdatingProfilePicture: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser?._id || socket) { 
            return;
        }
        const newSocket = io(BASE_URL, {
            query: { userId: authUser._id },
        });

        newSocket.on("connect", () => {
            console.log("Connected to Socket.IO server", newSocket.id);
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });

        set({ socket: newSocket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null });
        }
        console.log("Disconnected from Socket.IO server");
    },
}));
