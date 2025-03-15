import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useUserStore= create((set)=>({
    isUserDetail:false,
    updateUser:false,
    users:null,
    isGettingUser:false,
    add:false,
    setAdd: () => {
        set((state) => ({ add: !state.add }));
    },
    
    getAllUser:async()=>{
        set({isGettingUser:true});
        try{
            const res=await axiosInstance.get("/user/all-users");
            set({users:res.data.users});
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isGettingUser:false});
        }
    },
    updatingUser: () => {
        set((state) => ({ updateUser: !state.updateUser }));
    },
    userDetails: () => {
        set((state) => ({ isUserDetail: !state.isUserDetail }));
    },
}))