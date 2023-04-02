import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../socket";

const initialState = {
  open_video_dialog: false,
  open_notification_dialog: false,
  call_queue: [], // can have max 1 call at any point of time
};

const slice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {
    pushToVideoCallQueue(state, action) {
      // check video_call_queue in redux store

      if (state.call_queue.length === 0) {
        state.call_queue.push(action.payload);
        state.open_notification_dialog = true; // this will open up the call dialog
      } else {
        // if queue is not empty then emit user_is_busy => in turn server will send this event to sender of call
        socket.emit("user_is_busy_video_call", { ...action.payload });
      }

      // Ideally queue should be managed on server side
    },
    resetVideoCallQueue(state, action) {
      state.call_queue = [];
      state.open_notification_dialog = false;
    },
    closeNotificationDialog(state, action) {
      state.open_notification_dialog = false;
    },
    updateCallDialog(state, action) {
      state.open_video_dialog = action.payload.state;
      state.open_notification_dialog = false;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const PushToVideoCallQueue = (call) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.pushToVideoCallQueue(call));
  };
};

export const ResetVideoCallQueue = () => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetVideoCallQueue());
  };
};

export const CloseVideoNotificationDialog = () => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.closeNotificationDialog());
  };
};

export const UpdateVideoCallDialog = ({ state }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateCallDialog({ state }));
  };
};
