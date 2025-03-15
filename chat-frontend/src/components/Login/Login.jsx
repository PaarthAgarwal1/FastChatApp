import { useState } from "react";
import { toast } from "react-toastify";
import AuthImagePattern from "../AuthImagePattern";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";

const Login = () => {
    const {authUser,isLogingIn,login}=useAuthStore();
    const[formData,setFormData]=useState({
        email:'',
        password:'',
    });

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            toast.error("All fields are required!");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Invalid email format!");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return false;
        }
        return true;
    };

    const handleLogin=async (e)=>{
        e.preventDefault();
        const success=validateForm();
        if(success){
            await login(formData);
        }
    }
    const handleInputChange=e=>{
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    return (
        <div className="login w-full h-full flex justify-evenly items-center bg-cover bg-no-repeat" style={{ backgroundImage: "url('/path/to/your/background-image.jpg')" }}>
            <div className=" backdrop-blur-md p-10 rounded-lg shadow-md flex flex-col gap-6 items-center">
                <h2 className="text-2xl font-semibold text-gray-100">Welcome Back,</h2>
                <form onSubmit={handleLogin} className="flex flex-col gap-4 w-72">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        name="email" 
                        className="p-3 border border-gray-300 rounded-md outline-none bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleInputChange}
                        name="password" 
                        className="p-3 border border-gray-300 rounded-md outline-none bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        type="submit" 
                        className="py-3 px-5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
                    >
                        Login
                    </button>
                </form>
                <p className="text-sm">
                        Create a new account?{" "}
                        <Link to="/signup" className="text-blue-400">
                            Click here
                        </Link>
                    </p>
            </div>
            <div className=" h-5/6 border-l border-slate-500"></div>
            <AuthImagePattern
            title="Welcome to our community"
                subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
            />
        </div>
    );
};

export default Login;
