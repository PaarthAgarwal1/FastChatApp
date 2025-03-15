import List from "./components/List/List";
import ProfileUpdate from "./components/UpdateProfile/UpdateProfile";
import ChatContainer from "./components/Chat/ChatContainer";
import NoChatSelected from "./components/Chat/NoChatSelected";
import { useChatStore } from "./store/useChatStore";
import { useUserStore } from "./store/useUserStore";

const Home = () => {
  const { updateUser } = useUserStore();
  const { selectedUser } = useChatStore();

  return (
    <>
      <List />
      {updateUser ? <ProfileUpdate /> : selectedUser ? <ChatContainer /> : <NoChatSelected />}
    </>
  );
};

export default Home;
