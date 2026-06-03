import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/notifications");
      return res.data.notifications;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load notifications");
    }
  }
);

export const markNotificationsAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await api.put("/notifications/read");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const clearNotifications = createAsyncThunk(
  "notification/clearNotifications",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/notifications");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(markNotificationsAsRead.fulfilled, (state) => {
        state.items.forEach(n => n.read = true);
      });

    builder
      .addCase(clearNotifications.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
