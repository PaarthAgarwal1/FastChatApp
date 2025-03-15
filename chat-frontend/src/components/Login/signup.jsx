import { useState } from "react";
import { toast } from "react-toastify";
import AuthImagePattern from "../AuthImagePattern";
import { useAuthStore } from "../../store/useAuthStore";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const SignUp = () => {
    const { isSigningUp, signUp } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value.trim() }));
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success=validateForm();
        if (success) {
            signUp(formData);
        }
        
    };

    return (
        <div
            className="login w-full h-full flex justify-evenly items-center bg-cover bg-no-repeat"
            style={{ backgroundImage: "url('/path/to/your/background-image.jpg')" }}
        >
            <AuthImagePattern
                title="Join our community"
                subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
            />
            <div className="h-5/6 border-l border-slate-500"></div>
            <div className="basis-1/2">
                <div className="backdrop-blur-lg p-10 m-30 rounded-lg shadow-md flex flex-col gap-6 items-center">
                    <h2 className="text-2xl font-semibold text-gray-100">Create an account,</h2>
                    <form className="flex flex-col gap-4 w-72" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md outline-none bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-3 border border-gray-300 rounded-md outline-none bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="p-3 border border-gray-300 rounded-md outline-none bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-300"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="py-3 px-5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300 disabled:opacity-50"
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>
                    <p className="text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-400">
                            Click here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
