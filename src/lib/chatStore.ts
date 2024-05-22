import { create } from "zustand";
import { useUserStore } from "./userStore";
import { User } from "../types/Types";

interface ChatStoreState {
  chatId: string | null;
  user: User | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  changeChat: (chatId: string, user: User) => void;
  changeBlock: () => void;
  resetChat: () => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId: string, user: User) => {
    const currentUser = useUserStore.getState().currentUser;

    if (currentUser && user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currentUser && currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => ({ ...state, isReceiverBlocked: !state.isReceiverBlocked }));
  },
  resetChat: () => {
    set({
      chatId: null,
      user: null,
      isCurrentUserBlocked: false,
      isReceiverBlocked: false,
    });
  },
}));
