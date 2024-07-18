import React, { useEffect, useState } from "react";
import {
  fileUploadFunction,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../CommonComponents/Header";

function Voice() {
  const navigate = useNavigate();
  const [domain, setDomain] = useState();
  const [popUp, setPopUp] = useState(false);
  const [name, setName] = useState("");
  const [editType, setEditType] = useState("");
  const [editIndex, setEditIndex] = useState("");
  const [addMusic, setAddMusic] = useState(false);
  const [musicSaveClick, setMusicSaveClick] = useState(false);
  const [editClick, setEditClick] = useState(false);
  const [newMusic, setnewMusic] = useState();
  const [searchMusic, setSearchMusic] = useState("");
  const [filterMusic, setFilterMusic] = useState();
  const account = useSelector((state) => state.account);
  const [refresh,setRefresh]=useState(1)

  // Getting domain and group list
  useEffect(() => {
    if (account && account.id) {
      async function getDomainGroup() {
        const sountList = await generalGetFunction(`/sound/all`);
        if (sountList.status) {
          setDomain(
            sountList.data.data.map((item) => {
              return [item.id, item.name];
            })
          );
          setFilterMusic(
            sountList.data.data.map((item) => {
              return [item.id, item.name];
            })
          );
        } else {
          navigate("/");
        }
      }
      getDomainGroup();
    } else {
      navigate("/");
    }
  }, [account, navigate,refresh]);

  // Update domain and group
  async function updateValue() {
    if (musicSaveClick) {
      if (newMusic) {
        const maxSizeInKB = 2048
        const fileSizeInKB = newMusic.size / 1024;
        console.log("This is file size",fileSizeInKB);
        if (fileSizeInKB > maxSizeInKB) {
         toast.error("Please choose a file less than 2048 kilobytes.")
        }else{
            const parsedData = new FormData();
            parsedData.append("path", newMusic);
            parsedData.append("account_id", account.account_id);
            const apiData = await fileUploadFunction("/sound/store", parsedData);
            if (apiData.status) {
                setnewMusic()
                setRefresh(refresh+1)
              toast.success(apiData.message);
            } else {
              toast.error(apiData.message);
            }
        }
      
      } else {
        toast.error("Invalid Domain name");
      }
    }  else if (name == "Domain") {
      const apiData = await generalDeleteFunction(`/sound/${editIndex}`);
      if (apiData.status) {
        setRefresh(refresh+1)
        toast.success(apiData.message);
      } else {
        toast.error(apiData.message);
      }
    }

    setPopUp(false);
    setMusicSaveClick(false);
    setEditClick(false);
    setEditIndex("");
    setEditType("");
  }

  // Filter group and domain
  useEffect(() => {
    if (domain) {
      if (searchMusic.trim().length > 0) {
        setFilterMusic(
          domain.filter((item) => item[1].includes(searchMusic))
        );
      } else {
        setFilterMusic(domain);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchMusic]);
  console.log(newMusic, "This is new domain");
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Master" />
            <div className="row masterList">
              <div className="col-xl-4">
                <div className="masterSegment">
                  <h6>
                    <div className="row align-items-center">
                      <div className="col-auto">List of Domain </div>
                      <div className="col pe-0">
                        <input
                          type="search"
                          name="Search"
                          id="headerSearch"
                          placeholder="Search a domain"
                          onChange={(e) => setSearchMusic(e.target.value)}
                        />
                      </div>
                      <div className="col-auto ps-0 mt-1">
                        <button
                          className="clearButton"
                          style={{
                            width: "100%",
                            height: "100%",
                            fontSize: 22,
                          }}
                        >
                          <i
                            className="fa-duotone fa-circle-plus"
                            onClick={() => {
                              setAddMusic(true);
                            }}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </h6>
                  <ul>
                    {addMusic ? (
                      <li>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => setnewMusic(e.target.files[0])}
                          placeholder="Choose Audio file"
                        ></input>
                        <button className="clearButton text-success">
                          <i
                            className="fa-duotone fa-circle-check"
                            onClick={() => {
                              setPopUp(true);
                              setMusicSaveClick(true);
                            }}
                          ></i>
                        </button>
                        <button className="clearButton text-danger">
                          <i
                            className="fa-duotone fa-trash"
                            onClick={() => {
                              setAddMusic(false);
                            }}
                          ></i>
                        </button>
                      </li>
                    ) : (
                      ""
                    )}
                    {domain &&
                      filterMusic.map((item, index) => {
                        return (
                          <li key={index}>
                            <input
                              type="text"
                              placeholder={item[1]}
                            //   onChange={(e) => setUpdateDomain(e.target.value)}
                            //   disabled={
                            //     editIndex === item[0] && editType === "Domain"
                            //       ? false
                            //       : true
                            //   }
                            ></input>
                            <button className="clearButton text-success">
                              {editIndex === item[0] &&
                              editType === "Domain" ? (
                                <i
                                  className="fa-duotone fa-play"
                                  onClick={() => {
                                    setPopUp(true);
                                    // setEditClick(true);
                                  }}
                                ></i>
                              ) : (
                                <i
                                  className="fa-duotone fa-play"
                                  onClick={() => {
                                    // setEditIndex(item[0]);
                                    // setEditType("Domain");
                                  }}
                                ></i>
                              )}
                            </button>
                            <button className="clearButton text-danger">
                              <i
                                className="fa-duotone fa-trash"
                                onClick={() => {
                                  setPopUp(true);
                                  setName("Domain");
                                  setEditIndex(item[0]);
                                }}
                              ></i>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              </div>
              <div className="col-xl-4 "></div>
            </div>
          </div>
        </div>
      </section>
      {popUp ? (
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
                  {musicSaveClick ? (
                    <p>
                      Are you sure you want to add this Music: {newMusic["name"]} ?
                    </p>
                  ) : editClick && editType === "Domain" ? (
                    <p>
                      Are you sure you want to update this music?
                    </p>
                  ) : (
                    <p>
                      Are you sure you want to delete this music?
                    </p>
                  )}

                  <button className="panelButton m-0" onClick={updateValue}>
                    Confirm
                  </button>
                  <button
                    className="panelButtonWhite m-0 float-end"
                    onClick={() => {
                      setPopUp(false);
                      setMusicSaveClick(false);
                      setEditClick(false);
                      setEditIndex("");
                      setEditType("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

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

export default Voice;
