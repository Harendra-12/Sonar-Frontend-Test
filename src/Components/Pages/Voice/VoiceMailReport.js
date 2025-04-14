/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import Header from "../../CommonComponents/Header";
import {
  backToTop,
  generalGetFunction,
  generatePreSignedUrl,
} from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import AudioWaveformCommon from "../../CommonComponents/AudioWaveformCommon";
import DropdownForAudio from "../../DropdownForAudio";


function VoiceMailReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [voiceMail, setVoiceMail] = useState();
  const [voiceMailRefresh, setVoiceMailRefresh] = useState(0);
  const [currentPlaying, setCurrentPlaying] = useState("");
  const thisAudioRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [rowPerPage, setRowPerPage] = useState(20);
  const [audioURL, setAudioURL] = useState("");
  const [showAudio, setShowAudio] = useState(false)
  const [showDropDown, setShowDropdown] = useState(false)

  const handlePlaying = async (audio) => {
    // Reseting state before Playing
    setCurrentPlaying("");
    setAudioURL("");

    try {
      setCurrentPlaying(audio);
      const url = audio.split(".com/").pop();
      // const res = await generatePreSignedUrl(url);

      // if (res?.status && res?.url) {
      setAudioURL(audio); // Update audio URL state
      // setAudioURL(res.url);
      // Wait for React state update before accessing ref
      setTimeout(() => {
        if (thisAudioRef.current) {
          thisAudioRef.current.load(); // Reload audio source
          thisAudioRef.current.play().catch((error) => {
            console.error("Audio play error:", error);
          });
        }
      }, 100); // Reduced timeout to minimize delay
      // }
    } catch (error) {
      console.error("Error in handlePlaying:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    async function getData() {
      const apiData = await generalGetFunction(
        `/voicemails?page=${pageNumber}&row_per_page=${rowPerPage}&search=${searchValue}`
      );
      if (apiData?.status) {
        setVoiceMail(apiData.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    if (searchValue.trim().length === 0) {
      getData();
    } else {
      const timer = setTimeout(() => {
        getData();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [pageNumber, voiceMailRefresh, rowPerPage, searchValue]);

  function extractDate(dateTimeString) {
    // Split the string by space and return the first part
    return dateTimeString.split(" ")[0];
  }
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0 position-relative">
            <Header title="Voicemail Reports" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Voicemail Reports</h4>
                        <p>Here are all the Voicemail Reportsss</p>
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
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          effect="ripple"
                          className="panelButton"
                          onClick={() =>
                            setVoiceMailRefresh((prev) => prev + 1)
                          }
                        >
                          <span className="text">Refresh</span>
                          <span className="icon">
                            <i
                              className={"fa-regular fa-arrows-rotate fs-5"}
                            ></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "10px 20px 0" }}
                  >
                    <div className="tableHeader">
                      <div className="showEntries">
                        <label>Show</label>
                        <select
                          className="formItem"
                          onChange={(e) => setRowPerPage(e.target.value)}
                        >
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                          <option value={40}>40</option>
                          <option value={50}>50</option>
                          <option value={60}>60</option>
                          <option value={70}>70</option>
                          <option value={80}>80</option>
                        </select>
                        <label>entries</label>
                      </div>
                      <div className="searchBox">
                        <label>Search:</label>
                        <input
                          type="search"
                          value={searchValue}
                          className="formItem"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Source</th>
                            <th>Destination</th>
                            {/* <th>Recording Path</th> */}
                            <th>Recording</th>
                            <th>Duration</th>
                            <th>Created At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {voiceMail?.data.map((item, index) => {
                            return (
                              <>
                                <tr className="cdrTableRow">
                                  <td>{index + 1}.</td>
                                  <td>{item.src}</td>
                                  <td>{item.dest}</td>
                                  {/* <td>www.voicemailrecordingpath.com</td> */}
                                  <td>
                                    <button
                                      className="tableButton px-2 mx-0"
                                      onClick={() => {
                                        if (
                                          item[
                                          "recording_path"
                                          ] ===
                                          currentPlaying
                                        ) {
                                          setCurrentPlaying(
                                            ""
                                          );
                                          setAudioURL("");
                                        } else {
                                          handlePlaying(
                                            item[
                                            "recording_path"
                                            ]
                                          );
                                        }
                                      }}
                                    >
                                      {currentPlaying ===
                                        item[
                                        "recording_path"
                                        ] ? (
                                        <i className="fa-solid fa-chevron-up"></i>
                                      ) : (
                                        <i className="fa-solid fa-chevron-down"></i>
                                      )}
                                    </button>
                                  </td>
                                  <td>{item.duration}</td>
                                  <td>{extractDate(item.created_at)}</td>
                                </tr>
                                {/* {currentPlaying == item["recording_path"] && (
                                  <tr>
                                    <td colSpan={99}>
                                      <div className="audio-container mx-2">
                                        {/* <audio
                                          controls={true}
                                          ref={thisAudioRef}
                                          autoPlay={true}
                                          onEnded={() => {
                                            setCurrentPlaying(null);
                                          }}
                                        >
                                          <source
                                            src={audioURL}
                                            type="audio/mpeg"
                                          />
                                        </audio> */}
                                {/* <AudioWaveformCommon audioUrl={audioURL} />

                                        <button className="audioCustomButton">
                                          <i className="fa-sharp fa-solid fa-download" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )} */}
                                {currentPlaying ===
                                  item["recording_path"] &&
                                  item["recording_path"] && (
                                    <tr>
                                      <td colSpan={99}>
                                        <div className="audio-container mx-2">
                                          <AudioWaveformCommon audioUrl={audioURL} />
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                              </>
                            );
                          })}

                          {/* {!loading && cdr && cdr.data.length === 0 ? (
                                                        <td colSpan={99}>
                                                            <EmptyPrompt name="Call" link="dashboard" />
                                                        </td>
                                                    ) : (
                                                        ""
                                                    )} */}
                        </tbody>
                      </table>
                    </div>
                    <div className="tableHeader mb-3">
                      <PaginationComponent
                        pageNumber={(e) => setPageNumber(e)}
                        totalPage={voiceMail?.last_page}
                        from={(pageNumber - 1) * voiceMail?.per_page + 1}
                        to={voiceMail?.to}
                        total={voiceMail?.total}
                        defaultPage={pageNumber}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* {loading && <CircularLoader />} */}
        </section>
      </main>
    </>
  );
}

export default VoiceMailReport;
