import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import {
  backToTop,
  featureUnderdevelopment,
  fileUploadFunction,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";
import { useSelector, useDispatch } from "react-redux";
import MusicPlayer from "../../CommonComponents/MusicPlayer";

function Music() {
  const [music, setMusic] = useState();
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const [newMusicPopup, setNewMusicPopup] = useState(false);
  const [newMusic, setNewMusic] = useState();
  const [newMusicType, setNewMusicType] = useState("hold");
  const [deletePopup, setDeletePopup] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();
  const musicAll = useSelector((state) => state.musicAll);
  const dispatch = useDispatch();
  const [userInput, setuserInput] = useState("");
  const [selectedOption, setSelectedOption] = useState("userName");
  useEffect(() => {
    if (musicAll) {
      setLoading(false);
      setMusic(musicAll);
      async function getData() {
        const apiData = await generalGetFunction(`/sound/all`);
        if (apiData?.status) {
          setLoading(false);
          setMusic(apiData.data);
          dispatch({ type: "SET_MUSICALL", musicAll: apiData.data });
        } else {
          navigate(-1);
          toast.error("Couldnt load sounds!");
        }
      }
      getData();
    } else {
      async function getData() {
        const apiData = await generalGetFunction(`/sound/all`);
        if (apiData?.status) {
          setLoading(false);
          setMusic(apiData.data);
          dispatch({ type: "SET_MUSICALL", musicAll: apiData.data });
        } else {
          setLoading(false);
          navigate(-1);
        }
      }
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  //   Handle delete function
  const handleDelete = async (id) => {
    setDeletePopup(false);
    setLoading(true);
    const apiData = await generalDeleteFunction(`/sound/${id}`);
    if (apiData?.status) {
      const newArray = music.filter((item) => item.id !== id);
      setMusic(newArray);
      toast.success(apiData.message);
      setLoading(false);

      const newList = music.filter((item) => item.id !== id);
      setMusic(newList);
    } else {
      setLoading(false);

      // toast.error(apiData.error);
    }
  };

  //   Handle new music function
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
        setNewMusicPopup(!newMusicPopup);
        parsedData.append("account_id", account.account_id);
        parsedData.append("type", newMusicType);
        const apiData = await fileUploadFunction("/sound/store", parsedData);
        if (apiData.status) {
          setLoading(false);
          setNewMusic();
          setNewMusicPopup(!newMusicPopup);
          setRefresh(refresh + 1);
          toast.success(apiData.message);
        } else {
          setNewMusicPopup(!newMusicPopup);
          setLoading(false);
          toast.error(apiData.message);
        }
      }
    } else {
      toast.error("Please choose a file");
    }
  }

  console.log("This is transition details", music);
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Music Listing" />
            {/* <div
              className="d-flex flex-wrap px-xl-3 py-2 justify-content-between"
              id="detailsHeader"
            >
              <div className="col-xl-4 col-6 my-auto">
                <div className="position-relative searchBox">
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                  />
                </div>
              </div>
              <div className="col-xl-8 pt-3 pt-xl-0">
                <div className="d-flex justify-content-end">
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={() => {
                      navigate(-1);
                      backToTop();
                    }}
                  >
                    <span className="text">Back</span>
                    <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                  </button>
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={() => setNewMusicPopup(!newMusicPopup)}
                  >
                    <span className="text">Add</span>
                    <span className="icon"><i class="fa-solid fa-plus"></i></span>
                  </button>
                </div>
              </div>
            </div> */}

            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Music Listing</h4>
                        <p>Add a new sound</p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          effect="ripple"
                          className="panelButton gray"
                          onClick={() => {
                            navigate(-1);
                            backToTop();
                          }}
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          // to="/ring-groups-add"
                          // onClick={backToTop}
                          onClick={() => setNewMusicPopup(!newMusicPopup)}
                          effect="ripple"
                          className="panelButton"
                        >
                          <span className="text">Add</span>
                          <span className="icon">
                            <i class="fa-solid fa-plus"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "25px 20px 0" }}
                  >
                    <div className="tableHeader">
                      <div className="showEntries">
                        <label>Show</label>
                        <select className="formItem">
                          <option>Max</option>
                        </select>
                        <label>entries</label>
                      </div>
                      {/* <div className="searchBox">
                        <label>Search:</label>
                        <input
                          type="search"
                          className="formItem"
                          onChange={() => featureUnderdevelopment()}
                        />
                      </div> */}
                      <div className="searchBox position-relative">
                        <label>Search:</label>
                        <input
                          type="search"
                          name="Search"
                          className="formItem"
                          placeholder="Search"
                          value={userInput}
                          onChange={(e) => setuserInput(e.target.value)}
                          style={{ paddingRight: 100 }}
                        />
                        <select
                          className="secretSelect"
                          value={selectedOption}
                          onChange={(e) => setSelectedOption(e.target.value)}
                        >
                          <option value="userName">Music</option>
                          <option value="accountId">Type</option>
                        </select>
                      </div>
                    </div>
                    <div className="tableContainer">
                      {loading ? (
                        <ContentLoader />
                      ) : (
                        <table>
                          <thead>
                            <tr>
                              <th>Music</th>
                              <th>Type</th>
                              <th>Added Date</th>
                              <th>Play</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {music &&
                              music.map((item) => {
                                return (
                                  <tr>
                                    <td>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td>{item.created_at.split("T")[0]}</td>
                                    <td>
                                      <MusicPlayer
                                        audioSrc={item.path}
                                        isPlaying={currentPlaying === item.path}
                                        onPlay={() =>
                                          setCurrentPlaying(item.path)
                                        }
                                        onStop={() => setCurrentPlaying(null)}
                                      />
                                    </td>

                                    <td>
                                      <button
                                        className="tableButton delete"
                                        onClick={() => {
                                          // handleDelete(item.id)
                                          setDeletePopup(true);
                                          setDeleteId(item.id);
                                        }}
                                      >
                                        <i className="fa-solid fa-trash"></i>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {newMusicPopup ? (
            <div className="popup">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className="row content col-xl-4">
                    <div className="col-2 px-0">
                      <div className="iconWrapper">
                        <i className="fa-duotone fa-triangle-exclamation"></i>
                      </div>
                    </div>
                    <div className="col-10 ps-0">
                      <h4>Warning!</h4>
                      <p>Please select the file you want to upload</p>
                      <div className="row justify-content-between align-items-center">
                        <div className="col-4">
                          <select
                            name="music"
                            className="formItem"
                            onChange={(e) => setNewMusicType(e.target.value)}
                          >
                            <option value="hold">Hold</option>
                            <option value="busy">Busy</option>
                            <option value="ringback">Ringback</option>
                            <option value="announcement">Announcement</option>
                            <option value="ivr"> IVR</option>
                          </select>
                        </div>
                        <div className="col-8">
                          {/* <input
                            name="reg"
                            className="formItem"
                            type="file"
                            accept="audio/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              const fileName = file.name.replace(/ /g, "-");
                              const newFile = new File([file], fileName, {
                                type: file.type,
                              });
                              setNewMusic(newFile);
                            }}
                          /> */}
                          <input
                            name="reg"
                            className="formItem"
                            type="file"
                            accept="audio/*"
                            onChange={(e) => {
                              const file = e.target.files[0];

                              if (file) {
                                const audio = new Audio();
                                audio.src = URL.createObjectURL(file);

                                audio.onloadedmetadata = () => {
                                  if (audio.duration <= 5) {
                                    // Replace with your toast function
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
                        </div>
                      </div>
                      <div className="mt-2 d-flex justify-content-between">
                        <button
                          className="panelButton m-0"
                          onClick={handleNewMusic}
                        >
                          <span className="text">Confirm</span>
                          <span className="icon">
                            <i class="fa-solid fa-check"></i>
                          </span>
                        </button>
                        <button
                          className="panelButton gray m-0 float-end"
                          onClick={() => setNewMusicPopup(false)}
                        >
                          <span className="text">Cancel</span>
                          <span className="icon">
                            <i class="fa-solid fa-xmark"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {deletePopup ? (
            <div className="popup">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className="row content col-xl-4">
                    <div className="col-2 px-0">
                      <div className="iconWrapper">
                        <i className="fa-duotone fa-triangle-exclamation"></i>
                      </div>
                    </div>
                    <div className="col-10 ps-0">
                      <h4>Warning!</h4>
                      <p>Are you sure you want to delete this music ?</p>

                      <div className="d-flex justify-content-between">
                        <button
                          className="panelButton m-0"
                          onClick={() => {
                            handleDelete(deleteId);
                          }}
                        >
                          <span className="text">Confirm</span>
                          <span className="icon">
                            <i class="fa-solid fa-check"></i>
                          </span>
                        </button>
                        <button
                          className="panelButtonWhite m-0 float-end"
                          onClick={() => {
                            setDeletePopup(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </section>
    </main>
  );
}

export default Music;
