import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { IoImage, IoSend } from "react-icons/io5";
import { ImBlocked } from "react-icons/im";
import { X } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import { CiFaceSmile } from "react-icons/ci";
import { useAuthStore } from "../../store/useAuthStore";

const MessageInput = () => {
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { sendMessage,selectedUser } = useChatStore();
    const{authUser}=useAuthStore();

    const[isBlocked,setIsblocked]=useState(false);
    useEffect(()=>{
        if(authUser.blocked.includes(selectedUser._id)){
            setIsblocked(true);
        }
    },[selectedUser,authUser,authUser.blocked]);

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            toast.error("Please select a valid image file");
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview
            });
            setText("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <div className="p-4 w-full border-t border-slate-500">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center"
                            type="button"
                            disabled={isBlocked}
                        >
                            <X size={12} />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <div className="flex-1 flex gap-2 items-center rounded-full p-2 bg-gray-900/40">
                    <input
                        type="text"
                        className="flex-1 px-2 bg-transparent outline-none text-gray-100"
                        placeholder={isBlocked?"You can't send a message...":"Type a message..."}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={isBlocked}
                    />
                    <div className="relative">
                    <button
                        type="button"
                        className="btn btn-circle text-gray-500 hover:text-gray-300"
                        onClick={() => setOpen((prev) => !prev)}
                        disabled={isBlocked}
                    >
                        <CiFaceSmile className="w-5 h-5" src="./emoji.png" alt="Emoji Picker" />
                    </button>
                    {open && (
                        <div className="absolute bottom-12 right-0">
                            <EmojiPicker onEmojiClick={handleEmoji} disabled={isBlocked}/>
                            
                        </div>
                    )}
                    </div>
                    
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={isBlocked}
                    />
                    <button
                        type="button"
                        className={`hidden sm:flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isBlocked}
                    >
                        <IoImage size={20} />
                    </button>
                </div>
                <button
    type="submit"
    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
    disabled={(!text.trim() && !imagePreview) || isBlocked}
>
    {isBlocked ? (
        <ImBlocked size={20}/>
    ) : (
        <IoSend size={20} />
    )}
</button>
            </form>
        </div>
    );
};

export default MessageInput;
