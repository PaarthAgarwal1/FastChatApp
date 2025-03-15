import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  selectedUser: null,
  messages: [],
  isMessageLoading: false,
  setSelectedUser: (selectedUser) => { 
    set({ selectedUser});
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const{authUser}=useAuthStore.getState();

    if(authUser.blocked.includes(selectedUser._id)){
      toast.error("You are blocked by this user");
      return;
    }
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set((state) => ({ messages: [...state.messages, res.data] }));
      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("sendMessage", res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  },

  subscribeToMessage: () => {
    const { selectedUser } = get();
    const socket = useAuthStore.getState().socket;
    if (!selectedUser) return; 

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.sender_id === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      console.log("New Message received:", newMessage);
      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
    });
  },

  unsubscribeToMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      console.log("Unsubscribing from newMessage event");
      socket.off("newMessage");
    }


  },
}));
