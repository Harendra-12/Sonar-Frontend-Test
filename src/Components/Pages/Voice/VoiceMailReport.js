import React, { useEffect, useRef, useState } from "react";
import Header from "../../CommonComponents/Header";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import CircularLoader from "../../Loader/CircularLoader";

function VoiceMailReport() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [voiceMail, setVoiceMail] = useState();
  const [voiceMailRefresh, setVoiceMailRefresh] = useState(0);
  const [currentPlaying, setCurrentPlaying] = useState("");
  const thisAudioRef = useRef(null);
  const [rowPerPage, setRowPerPage] = useState(20);

  const handlePlaying = (audio) => {
    setCurrentPlaying(audio);
    setTimeout(() => {
      if (currentPlaying) {
        thisAudioRef.current.play();
      }
    }, 200);
  };

  useEffect(() => {
    setLoading(true);
    async function getData() {
      const apiData = await generalGetFunction(
        `/voicemails?page=${pageNumber}&row_per_page=${rowPerPage}`
      );
      if (apiData?.status) {
        setVoiceMail(apiData.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
      console.log("api_data:", apiData);
    }
    getData();
  }, [pageNumber, voiceMailRefresh, rowPerPage]);

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
                        <h4>CDR Reports</h4>
                        <p>Here are all the CDR Reports</p>
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
                    style={{ overflow: "auto", padding: "25px 20px 0" }}
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
                          {
                          voiceMail?.data.map((item, index) => {
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
                                          currentPlaying ==
                                          item["recording_path"]
                                        ) {
                                          setCurrentPlaying(null);
                                        } else {
                                          handlePlaying(item["recording_path"]);
                                        }
                                      }}
                                    >
                                      <i
                                        className={`fa-duotone fa-${
                                          currentPlaying ==
                                          item["recording_path"]
                                            ? "stop"
                                            : "play"
                                        }`}
                                      ></i>
                                    </button>
                                  </td>
                                  <td>{item.duration}</td>
                                  <td>{extractDate(item.created_at)}</td>
                                </tr>
                                {currentPlaying == item["recording_path"] && (
                                  <tr>
                                    <td colSpan={99}>
                                      <div className="audio-container mx-2">
                                        <audio
                                          controls={true}
                                          ref={thisAudioRef}
                                          autoPlay={true}
                                          onEnded={() => {
                                            setCurrentPlaying(null);
                                          }}
                                        >
                                          <source
                                            src={item["recording_path"]}
                                            type="audio/mpeg"
                                          />
                                        </audio>

                                        <button className="audioCustomButton">
                                          <i className="fa-sharp fa-solid fa-download" />
                                        </button>
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
