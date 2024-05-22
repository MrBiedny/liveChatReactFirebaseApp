export interface User {
  id: string;
  blocked: string[];
  username: string;
  avatar: string;
  // other user properties if any
}

export interface UserStoreState {
  currentUser: User | null;
  isLoading: boolean;
  fetchUserInfo: (uid: string) => Promise<void>;
}

export interface ChatData {
  chatId: string;
  receiverId: string;
  lastMessage: string;
  isSeen: boolean;
  updatedAt: number;
  user: User;
}
