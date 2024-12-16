import React, { useState } from "react";
import { toast } from "react-toastify";
import { fileUploadFunction } from "../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import CircularLoader from "../Loader/CircularLoader";
import { ListItem } from "@mui/material";

const AddMusic = ({
  setShow,
  show,
  setUploadedMusic,
  setMusicRefresh,
  musicRefresh,
  listArray,
}) => {
  const account = useSelector((state) => state.account);
  const [newMusic, setNewMusic] = useState();
  const [newMusicType, setNewMusicType] = useState(listArray[0]);
  const [loading, setLoading] = useState(false);

  async function handleNewMusic() {
    if (newMusic) {
      const maxSizeInKB = 2048;
      const fileSizeInKB = newMusic.size / 1024;
      console.log("This is file size", fileSizeInKB);
      if (fileSizeInKB > maxSizeInKB) {
        toast.error("Please choose a file less than 2048 kilobytes.");
      } else {
        setLoading(true);
        const parsedData = new FormData();
        parsedData.append("path", newMusic);
        // setNewMusicPopup(!newMusicPopup);

        parsedData.append("account_id", account.account_id);
        parsedData.append("type", newMusicType);
        const apiData = await fileUploadFunction("/sound/store", parsedData);
        if (apiData.status) {
          setLoading(false);
          setNewMusic();
          setUploadedMusic(apiData.data);
          setMusicRefresh(musicRefresh + 1);
          setShow(!show);
          //   setNewMusicPopup(!newMusicPopup);
          //   setRefresh(refresh + 1);
          toast.success(apiData.message);
        } else {
          setShow(!show);
          //   setNewMusicPopup(!newMusicPopup);
          setLoading(false);
          toast.error(apiData.message);
        }
      }
    } else {
      toast.error("Please choose a file");
    }
  }
  function capitalizeFirstLetter(string) {
    if (!string) return ""; // Handle empty or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <div className="popup music">
      {loading && <CircularLoader />}
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="card px-0 col-xl-4">
            <div className="header">
              <h5 className="card-title fs14 border-bootm fw700">
                Upload Documents
              </h5>
            </div>
            <div className="card-body">
              {newMusic ? (
                // Show audio controls if a file is uploaded
                <div className="audio-container mx-2">
                  <audio
                    controls
                    src={URL.createObjectURL(newMusic)}
                    onEnded={() => {
                      toast.info("Audio playback completed.");
                    }}
                  />
                  <button
                    className="audioCustomButton"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(newMusic);
                      link.download = newMusic.name;
                      link.click();
                    }}
                  >
                    <i className="fa-sharp fa-solid fa-download" />
                  </button>
                  <button
                    className="audioCustomButton ms-2"
                    onClick={() => setNewMusic(null)}
                  >
                    <i className="fa-sharp fa-solid fa-rotate-left" /> Reset
                  </button>
                </div>
              ) : (
                // Show upload options if no file is uploaded
                <div
                  className="popup-border text-center p-2"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.add("drag-over");
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove("drag-over");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.currentTarget.classList.remove("drag-over");

                    const file = e.dataTransfer.files[0];
                    if (file) {
                      const audio = new Audio();
                      audio.src = URL.createObjectURL(file);

                      audio.onloadedmetadata = () => {
                        if (audio.duration <= 5) {
                          toast.error(
                            "Error: Audio file must be longer than 5 seconds.",
                            "error"
                          );
                          return;
                        }

                        const fileName = file.name.replace(/ /g, "-");
                        const newFile = new File([file], fileName, {
                          type: file.type,
                        });
                        setNewMusic(newFile);
                      };

                      audio.onerror = () => {
                        toast.error(
                          "Error: Unable to read the audio file.",
                          "error"
                        );
                      };
                    }
                  }}
                >
                  <input
                    type="file"
                    className="form-control-file d-none"
                    id="fileInput"
                    accept="audio/mp3"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        // Check if the file type is MP3
                        if (
                          file.type !== "audio/mpeg" &&
                          !file.name.endsWith(".mp3")
                        ) {
                          toast.error("Only MP3 files are allowed.", "error");
                          return;
                        }

                        const audio = new Audio();
                        audio.src = URL.createObjectURL(file);

                        audio.onloadedmetadata = () => {
                          if (audio.duration <= 5) {
                            toast.error(
                              "Error: Audio file must be longer than 5 seconds.",
                              "error"
                            );
                            return;
                          }

                          const fileName = file.name.replace(/ /g, "-");
                          const newFile = new File([file], fileName, {
                            type: file.type,
                          });
                          setNewMusic(newFile);
                        };

                        audio.onerror = () => {
                          toast.error(
                            "Error: Unable to read the audio file.",
                            "error"
                          );
                        };
                      }
                    }}
                  />

                  <label htmlFor="fileInput" className="d-block">
                    <div className="test-user text-center">
                      <i
                        style={{ fontSize: 30 }}
                        className="fa-solid fa-cloud-arrow-up"
                      />
                      <p className="mb-0 mt-2 text-center">
                        Drag and Drop or <span>Click on upload</span>
                      </p>
                      <span>Supports formats : MP3, Max Size: 2MB</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <div className="col-auto">
                  <select
                    name="music"
                    className="formItem"
                    onChange={(e) => setNewMusicType(e.target.value)}
                  >
                    {listArray.map((item, index) => {
                      return (
                        <option value={item}>
                          {capitalizeFirstLetter(item)}
                        </option>
                      );
                    })}
                    {/* <option value="hold">Hold</option>
                    <option value="busy">Busy</option>
                    <option value="ringback">Ringback</option>
                    <option value="announcement">Announcement</option>
                    <option value="ivr"> IVR</option> */}
                  </select>
                </div>
                <div className="d-flex">
                  <button className="panelButton m-0" onClick={handleNewMusic}>
                    <span className="text">Confirm</span>
                    <span className="icon">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  </button>
                  <button
                    className="panelButton gray"
                    onClick={() => {
                      //   setNewMusicPopup(false);
                      setShow(false);
                      setNewMusic(null);
                    }}
                  >
                    <span className="text">Cancel</span>
                    <span className="icon">
                      <i className="fa-solid fa-xmark"></i>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMusic;
