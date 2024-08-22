import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  fileUploadFunction,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";
import { useSelector } from "react-redux";
import MusicPlayer from "../../CommonComponents/MusicPlayer";

function Music() {
  const [music, setMusic] = useState();
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const [newMusicPopup, setNewMusicPopup] = useState(false);
  const [newMusic, setNewMusic] = useState();
  const [newMusicType, setNewMusicType] = useState("hold");
  const [refresh, setRefresh] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/sound/all`);
      if (apiData.status) {
        setLoading(false);
        setMusic(apiData.data);
      } else {
        setLoading(false);
        navigate(-1);
      }
    }
    getData();
  }, [refresh]);

  //   Handle delete function
  const handleDelete = async (id) => {
    setLoading(true);
    const apiData = await generalDeleteFunction(`/sound/${id}`);
    if (apiData.status) {
      const newArray = music.filter((item) => item.id !== id);
      setMusic(newArray);
      toast.success(apiData.message);
      setLoading(false);
    } else {
      setLoading(false);
      toast.error(apiData.message);
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
            <div
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
              <div>
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => {
                    navigate(-1);
                    backToTop();
                  }}
                >
                  Back
                </button>
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => setNewMusicPopup(!newMusicPopup)}
                >
                  Add New Music
                </button>
              </div>
            </div>
            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="tableContainer">
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
                                audioSrc={
                                  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                                }
                              />
                            </td>

                            <td onClick={() => handleDelete(item.id)}>
                              <i className="fa-duotone fa-trash text-danger fs-6"></i>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
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
                          </select>
                        </div>
                        <div className="col-8">
                          <input
                            name="reg"
                            className="formItem"
                            type="file"
                            accept="audio/*"
                            onChange={(e) => setNewMusic(e.target.files[0])}
                          />
                        </div>
                        {/* <input
                        name="reg"
                        className="formItem"
                        type="text"
                        placeholder="Type here"
                        onChange={(e) => setNewMusicType(e.target.value)}
                      /> */}
                      </div>
                      <div className="mt-2">
                        <button
                          className="panelButton m-0"
                          onClick={handleNewMusic}
                        >
                          Confirm
                        </button>
                        <button
                          className="panelButtonWhite m-0 float-end"
                          onClick={() => setNewMusicPopup(false)}
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
          {loading ? <ContentLoader /> : ""}
          {/* {music && music.data.length > 0 ? (
            <PaginationComponent
              pageNumber={(e) => setPageNumber(e)}
              totalPage={music.last_page}
              from={(pageNumber - 1) * music.per_page + 1}
              to={music.to}
              total={music.total}
            />
          ) : (
            ""
          )} */}
        </div>
      </section>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </main>
  );
}

export default Music;
