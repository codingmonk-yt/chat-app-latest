import React, { useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slide,
  Stack,
} from "@mui/material";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../../utils/axios";
import { socket } from "../../../socket";
import { ResetVideoCallQueue } from "../../../redux/slices/videoCall";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CallDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();

  const audioStreamRef = useRef(null);
  const videoStreamRef = useRef(null);

  //* Use params from call_details if available => like in case of receiver's end

  const [call_details] = useSelector((state) => state.videoCall.call_queue);
  const { incoming } = useSelector((state) => state.videoCall);

  const { token } = useSelector((state) => state.auth);

  const appID = 1642584767;
  const server = "wss://webliveroom1642584767-api.coolzcloud.com/ws";

  // roomID => ID of conversation => current_conversation.id
  // token => generate on backend & get on App
  // userID => ID of this user
  // userName => slug formed by user's name

  const roomID = call_details?.roomID;
  const userID = call_details?.userID;
  const userName = call_details?.userName;

  // Step 1

  // Initialize the ZegoExpressEngine instance
  const zg = new ZegoExpressEngine(appID, server);

  const audioStreamID = `audio_${call_details?.streamID}`;
  const videoStreamID = `video_${call_details?.streamID}`;

  const handleDisconnect = (event, reason) => {
    if (reason && reason === "backdropClick") {
      return;
    } else {
      // clean up event listners
      socket?.off("video_call_accepted");
      socket?.off("video_call_denied");
      socket?.off("video_call_missed");

      // stop publishing local audio & video stream to remote users, call the stopPublishingStream method with the corresponding stream ID passed to the streamID parameter.

      zg.stopPublishingStream(audioStreamID);
      zg.stopPublishingStream(videoStreamID);
      // stop playing a remote audio
      zg.stopPlayingStream(`audio_${userID}`);
      zg.stopPlayingStream(`video_${userID}`);
      zg.destroyStream(audioStreamRef.current);
      zg.destroyStream(videoStreamRef.current);
      // log out of the room
      zg.logoutRoom(roomID);

      // handle Call Disconnection => this will be handled as cleanup when this dialog unmounts

      // at the end call handleClose Dialog
      dispatch(ResetVideoCallQueue());
      handleClose();
    }
  };

  useEffect(() => {
    // TODO => emit video_call event

    // create a job to decline call automatically after 30 sec if not picked

    const timer = setTimeout(() => {
      // TODO => You can play an audio indicating missed call at this line at sender's end

      socket.emit(
        "video_call_not_picked",
        { to: call_details?.streamID, from: userID },
        () => {
          // TODO abort call => Call verdict will be marked as Missed
        }
      );
    }, 30 * 1000);

    socket.on("video_call_missed", () => {
      // TODO => You can play an audio indicating call is missed at receiver's end
      // Abort call
      handleDisconnect();
    });

    socket.on("video_call_accepted", () => {
      // TODO => You can play an audio indicating call is started
      // clear timeout for "video_call_not_picked"
      clearTimeout(timer);
    });

    if (!incoming) {
      socket.emit("start_video_call", {
        to: call_details?.streamID,
        from: userID,
        roomID,
      });
    }

    socket.on("video_call_denied", () => {
      // TODO => You can play an audio indicating call is denined
      // ABORT CALL
      handleDisconnect();
    });

    // make a POST API call to server & fetch token

    let this_token;

    async function fetchToken() {
      // You can await here
      const response = await axiosInstance.post(
        "/user/generate-zego-token",
        {
          userId: userID,
          room_id: roomID,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response, "TOKEN RESPONSE");
      this_token = response.data.token;
      // ...
    }
    fetchToken();

    // Step 2 => Check browser compatibility

    zg.checkSystemRequirements()
      .then((result) => {
        // The [result] indicates whether it is compatible. It indicates WebRTC is supported when the [webRTC] is [true]. For more results, see the API documents.

        // {
        //   webRTC: true,
        //   customCapture: true,
        //   camera: true,
        //   microphone: true,
        //   videoCodec: { H264: true, H265: false, VP8: true, VP9: true },
        //   screenSharing: true,
        //   errInfo: {}
        // }
        console.log(result);

        const { webRTC, microphone, camera } = result;

        if (webRTC && microphone && camera) {
          zg.loginRoom(
            roomID,
            this_token,
            { userID, userName },
            { userUpdate: true }
          )
            .then(async (result) => {
              console.log(result);

              // After calling the CreateStream method, you need to wait for the ZEGOCLOUD server to return the local stream object before any further operation.
              const localAudioStream = await zg.createStream({
                camera: { audio: true, video: false },
              });
              const localVideoStream = await zg.createStream({
                camera: { audio: false, video: true },
              });

              audioStreamRef.current = localAudioStream;
              videoStreamRef.current = localVideoStream;

              // Get the audio tag.
              const localAudio = document.getElementById("local-audio");
              const localVideo = document.getElementById("local-video");
              // The local stream is a MediaStream object. You can render audio by assigning the local stream to the srcObject property of video or audio.
              localAudio.srcObject = localAudioStream;
              localVideo.srcObject = localVideoStream;

              localVideo.play();

              // localStream is the MediaStream object created by calling creatStream in the previous step.
              zg.startPublishingStream(audioStreamID, localAudioStream);
              zg.startPublishingStream(videoStreamID, localVideoStream);

              zg.on("publisherStateUpdate", (result) => {
                // Callback for updates on stream publishing status.
                // ...
                console.log(result);
                // * we can use this info to show connection status
              });

              zg.on("publishQualityUpdate", (streamID, stats) => {
                // Callback for reporting stream publishing quality.
                // ...
                // console.log(streamID, stats);
                // * we can use this info to show local audio stream quality
              });
            })
            .catch((error) => {
              console.log(error);
            });

          // Callback for updates on the current user's room connection status.
          zg.on("roomStateUpdate", (roomID, state, errorCode, extendedData) => {
            if (state === "DISCONNECTED") {
              // Disconnected from the room
              // * Can be used to show disconnected status for a user (especially useful in a group call)
            }

            if (state === "CONNECTING") {
              // Connecting to the room
              // * Can be used to show connecting status for a user (especially useful in a group call)
            }

            if (state === "CONNECTED") {
              // Connected to the room
              // * Can be used to show connected status for a user (especially useful in a group call)
            }
          });

          // Callback for updates on the status of ther users in the room.
          zg.on("roomUserUpdate", async (roomID, updateType, userList) => {
            console.warn(
              `roomUserUpdate: room ${roomID}, user ${
                updateType === "ADD" ? "added" : "left"
              } `,
              JSON.stringify(userList)
            );
            if (updateType !== "ADD") {
              
              handleDisconnect();
            } else {
              // const current_users = JSON.stringify(userList);
              // * We can use current_users_list to build dynamic UI in a group call
              const remoteAudioStream = await zg.startPlayingStream(
                `audio_${userID}`
              );
              const remoteVideoStream = await zg.startPlayingStream(
                `video_${userID}`
              );

              // Get the audio tag.
              const remoteAudio = document.getElementById("remote-audio");
              const remoteVideo = document.getElementById("remote-video");
              // The local stream is a MediaStream object. You can render audio by assigning the local stream to the srcObject property of video or audio.

              remoteAudio.srcObject = remoteAudioStream;
              remoteVideo.srcObject = remoteVideoStream;
              remoteAudio.play();
              remoteVideo.play();
            }
          });

          // Callback for updates on the status of the streams in the room.
          zg.on(
            "roomStreamUpdate",
            async (roomID, updateType, streamList, extendedData) => {
              if (updateType === "ADD") {
                // New stream added, start playing the stream.
                console.log(
                  "ADD",
                  roomID,
                  updateType,
                  streamList,
                  extendedData
                );

                // * It would be quite useful to create and play multiple audio streams in a group call
              } else if (updateType === "DELETE") {
                // Stream deleted, stop playing the stream.
                console.log(
                  "DELETE",
                  roomID,
                  updateType,
                  streamList,
                  extendedData
                );

                // * Can be used to drop audio streams (more useful in a group call)
              }
            }
          );

          zg.on("playerStateUpdate", (result) => {
            // Callback for updates on stream playing status.
            // ...
            // * Can be used to display realtime status of a remote audio stream (Connecting, connected & Disconnected)
          });

          zg.on("playQualityUpdate", (streamID, stats) => {
            // Callback for reporting stream playing quality.
            // * Can be used to display realtime quality of a remote audio stream
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDisconnect}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <Stack direction="row" spacing={24} p={2}>
            <Stack>
              <video
                style={{ height: 200, width: 200 }}
                id="local-video"
                controls={false}
              />
              <audio id="local-audio" controls={false} />
            </Stack>
            <Stack>
              <video
                style={{ height: 200, width: 200 }}
                id="remote-video"
                controls={false}
              />
              <audio id="remote-audio" controls={false} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleDisconnect();
            }}
            variant="contained"
            color="error"
          >
            End Call
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CallDialog;
