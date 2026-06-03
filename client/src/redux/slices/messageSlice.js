import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ─── Thunks ───────────────────────────────────────────────────────────────────
export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async ({ chatId, type = "Chat", page = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/messages/${chatId}?type=${type}&page=${page}&limit=50`);
      return { messages: res.data.messages, chatId, page };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load messages");
    }
  }
);

export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/messages", data);
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send message");
    }
  }
);

export const markAsSeen = createAsyncThunk(
  "message/markAsSeen",
  async (chatId, { rejectWithValue }) => {
    try {
      await api.put(`/messages/seen/${chatId}`);
      return chatId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "message/deleteMessage",
  async (messageId, { rejectWithValue }) => {
    try {
      await api.delete(`/messages/${messageId}`);
      return messageId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete message");
    }
  }
);

export const reactToMessage = createAsyncThunk(
  "message/reactToMessage",
  async ({ messageId, emoji }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/messages/${messageId}/react`, { emoji });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to react");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────
const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages:       [],
    loading:        false,
    sending:        false,
    error:          null,
    typingUsers:    {},  // { chatId: [userId, ...] }
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
    addMessage: (state, action) => {
      // Avoid duplicates
      const exists = state.messages.find((m) => m._id === action.payload._id);
      if (!exists) state.messages.push(action.payload);
    },
    setTyping: (state, action) => {
      const { chatId, userId } = action.payload;
      if (!state.typingUsers[chatId]) state.typingUsers[chatId] = [];
      if (!state.typingUsers[chatId].includes(userId)) {
        state.typingUsers[chatId].push(userId);
      }
    },
    clearTyping: (state, action) => {
      const { chatId, userId } = action.payload;
      if (state.typingUsers[chatId]) {
        state.typingUsers[chatId] = state.typingUsers[chatId].filter((id) => id !== userId);
      }
    },
    markMessagesSeenLocally: (state, action) => {
      const chatId = action.payload;
      state.messages.forEach((m) => {
        if (m.chatId === chatId) m.seen = true;
      });
    },
    softDeleteMessage: (state, action) => {
      const msg = state.messages.find((m) => m._id === action.payload);
      if (msg) { msg.deleted = true; msg.text = "This message was deleted"; msg.media = ""; }
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(m => m._id === action.payload._id);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.page === 1
          ? action.payload.messages
          : [...action.payload.messages, ...state.messages];
      })
      .addCase(fetchMessages.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(sendMessage.pending,   (state) => { state.sending = true; })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        const exists = state.messages.find((m) => m._id === action.payload._id);
        if (!exists) state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected,  (state) => { state.sending = false; });

    builder
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const msg = state.messages.find((m) => m._id === action.payload);
        if (msg) { msg.deleted = true; msg.text = "This message was deleted"; msg.media = ""; }
      });
      
    builder
      .addCase(reactToMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.messages[index] = action.payload;
      });
  },
});

export const {
  clearMessages, addMessage, setTyping, clearTyping,
  markMessagesSeenLocally, softDeleteMessage, updateMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
