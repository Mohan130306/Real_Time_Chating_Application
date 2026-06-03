import { configureStore } from "@reduxjs/toolkit";
import authReducer    from "./slices/authSlice";
import chatReducer    from "./slices/chatSlice";
import messageReducer from "./slices/messageSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth:    authReducer,
    chat:    chatReducer,
    message: messageReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
