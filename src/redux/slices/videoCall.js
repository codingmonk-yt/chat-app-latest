import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../socket";
import axios from "../../utils/axios";

const initialState = {
  open_video_dialog: false,
  open_video_notification_dialog: false,
  call_queue: [], // can have max 1 call at any point of time
  incoming: false,
};

const slice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {
    pushToVideoCallQueue(state, action) {
      // check video_call_queue in redux store

      if (state.call_queue.length === 0) {
        state.call_queue.push(action.payload.call);
        if (action.payload.incoming) {
          state.open_video_notification_dialog = true; // this will open up the call dialog
          state.incoming = true;
        }
        else {
          state.open_video_dialog = true;
          state.incoming = false;
        }
      } else {
        // if queue is not empty then emit user_is_busy => in turn server will send this event to sender of call
        socket.emit("user_is_busy_video_call", { ...action.payload });
      }

      // Ideally queue should be managed on server side
    },
    resetVideoCallQueue(state, action) {
      state.call_queue = [];
      state.open_video_notification_dialog = false;
      state.incoming = false;
    },
    closeNotificationDialog(state, action) {
      state.open_video_notification_dialog = false;
    },
    updateCallDialog(state, action) {
      state.open_video_dialog = action.payload.state;
      state.open_video_notification_dialog = false;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const StartVideoCall = (id) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetVideoCallQueue());
    axios
      .post(
        "/user/start-video-call",
        { id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.pushToVideoCallQueue({
            call: response.data.data,
            incoming: false,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const PushToVideoCallQueue = (call) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.pushToVideoCallQueue({call, incoming: true}));
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
