import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { useUserStore } from "../../../lib/userStore";
import AddUser from "./addUser/AddUser";
import "./chatList.css";
import { ChatData, User } from "../../../types/Types";

function ChatList() {
  const [chats, setChats] = useState<ChatData[]>([]);
  const [addMode, setAddMode] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(
    function () {
      if (!currentUser) return;
      const unSub = onSnapshot(
        doc(db, "userchats", currentUser.id),
        async (res) => {
          const data = res.data();
          if (data && data.chats) {
            const items: ChatData[] = data.chats;

            const promises = items.map(async (item: ChatData) => {
              const userDocRef = doc(db, "users", item.receiverId);
              const userDocSnap = await getDoc(userDocRef);

              const user = userDocSnap.data() as User;

              return { ...item, user };
            });

            const chatData: ChatData[] = await Promise.all(promises);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
          }
        }
      );
      return () => {
        unSub();
      };
    },
    [currentUser]
  );

  async function handleSelect(chat: ChatData) {
    if (!currentUser) return;
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser?.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  }

  const filteredChats = chats.filter(
    (c) =>
      c.user.username.toLowerCase().includes(input.toLowerCase()) &&
      currentUser &&
      c.user.blocked.includes(currentUser.id)
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="search" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }}
        >
          <img
            src={
              chat.user.blocked.includes(currentUser.id)
                ? "./avatar.png"
                : chat.user.avatar || "./avatar.png"
            }
            alt=""
          />
          <div className="texts">
            <span>
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
}

export default ChatList;
