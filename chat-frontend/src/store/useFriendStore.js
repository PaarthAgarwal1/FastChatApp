import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useFriendStore = create((set) => ({
    friendRequests: [],
    friends: [],
    isLoading: false,

    getFriends: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/user/friends");
            set({ friends: res.data.friends });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch friends");
        } finally {
            set({ isLoading: false });
        }
    },

    sendFriendRequest: async (receiverId) => {
        try {
            const res = await axiosInstance.post(`/friends/send/${receiverId}`);
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send friend request");
        }
    },

    getFriendRequests: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/friends/pending");
            set({ friendRequests: res.data.friendRequests });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch friend requests");
        } finally {
            set({ isLoading: false });
        }
    },

    acceptFriendRequest: async (requestId) => {
        try {
            const res = await axiosInstance.post(`/friends/accept/${requestId}`);
            toast.success(res.data.message);
            set((state) => ({
                friendRequests: state.friendRequests.filter((req) => req._id !== requestId),
                friends: [...state.friends, res.data.friend], // Assuming the API returns the accepted friend
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to accept friend request");
        }
    },

    declineFriendRequest: async (requestId) => {
        console.log(requestId);
        try {
            const res = await axiosInstance.delete(`/friends/reject/${requestId}`);
            console.log("res is here in decline request",res);
            toast.success(res.data.message);
            set((state) => ({
                friendRequests: state.friendRequests.filter((req) => req._id !== requestId),
            }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to decline friend request");
        }
    },
}));
