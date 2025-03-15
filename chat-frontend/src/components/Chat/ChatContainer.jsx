import { useUserStore } from "../../store/useUserStore";
import Detail from "../Detail/Detail";
import Chat from "./Chat";

const ChatContainer = () => {
const{isUserDetail}=useUserStore();
    return (
        <div className="flex basis-3/4">
            <Chat/>
            {isUserDetail && <Detail/>}
        </div>
    );

}
export default ChatContainer;