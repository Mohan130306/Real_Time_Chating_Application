import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const fetchChats = createAsyncThunk("chat/fetchChats", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/chats");
    return res.data.chats;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load chats");
  }
});

export const fetchGroups = createAsyncThunk("chat/fetchGroups", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/groups");
    return res.data.groups;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load groups");
  }
});

export const createOrGetChat = createAsyncThunk("chat/createOrGetChat", async (userId, { rejectWithValue }) => {
  try {
    const res = await api.post("/chats", { userId });
    return res.data.chat;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to open chat");
  }
});

export const createGroup = createAsyncThunk("chat/createGroup", async (data, { rejectWithValue }) => {
  try {
    const res = await api.post("/groups", data);
    return res.data.group;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create group");
  }
});

export const searchUsers = createAsyncThunk("chat/searchUsers", async (query, { rejectWithValue }) => {
  try {
    const res = await api.get(`/auth/users?search=${query}`);
    return res.data.users;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Search failed");
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats:          [],
    groups:         [],
    activeChat:     null,   // { id, type: 'Chat'|'Group', data }
    onlineUsers:    [],
    searchResults:  [],
    searchLoading:  false,
    loading:        false,
    error:          null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    clearActiveChat: (state) => {
      state.activeChat = null;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
    },
    updateChatLastMessage: (state, action) => {
      const { chatId, message, type } = action.payload;
      if (type === "Chat") {
        const chat = state.chats.find((c) => c._id === chatId);
        if (chat) chat.lastMessage = message;
      } else {
        const group = state.groups.find((g) => g._id === chatId);
        if (group) group.lastMessage = message;
      }
    },
    incrementUnread: (state, action) => {
      const { chatId, type } = action.payload;
      const list = type === "Chat" ? state.chats : state.groups;
      const item = list.find((c) => c._id === chatId);
      if (item) item.unreadCount = (item.unreadCount || 0) + 1;
    },
    clearUnread: (state, action) => {
      const { chatId, type } = action.payload;
      const list = type === "Chat" ? state.chats : state.groups;
      const item = list.find((c) => c._id === chatId);
      if (item) item.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending,   (state) => { state.loading = true; })
      .addCase(fetchChats.fulfilled, (state, action) => { state.loading = false; state.chats = action.payload; })
      .addCase(fetchChats.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(fetchGroups.fulfilled, (state, action) => { state.groups = action.payload; });

    builder
      .addCase(createOrGetChat.fulfilled, (state, action) => {
        const exists = state.chats.find((c) => c._id === action.payload._id);
        if (!exists) state.chats.unshift(action.payload);
        state.activeChat = { id: action.payload._id, type: "Chat", data: action.payload };
      });

    builder
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.unshift(action.payload);
        state.activeChat = { id: action.payload._id, type: "Group", data: action.payload };
      });

    builder
      .addCase(searchUsers.pending,   (state) => { state.searchLoading = true; })
      .addCase(searchUsers.fulfilled, (state, action) => { state.searchLoading = false; state.searchResults = action.payload; })
      .addCase(searchUsers.rejected,  (state) => { state.searchLoading = false; });
  },
});

export const {
  setActiveChat, clearActiveChat, setOnlineUsers,
  clearSearch, updateChatLastMessage, incrementUnread, clearUnread,
} = chatSlice.actions;

export default chatSlice.reducer;
