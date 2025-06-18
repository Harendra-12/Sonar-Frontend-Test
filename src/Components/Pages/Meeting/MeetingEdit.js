import React, { useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import Header from "../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import CircularLoader from "../../Loader/CircularLoader";

function MeetingEdit() {
  const [conferenceName, setConferenceName] = useState("");
  const [conferenceType, setConferenceType] = useState("public");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState(5);
  const [aiNotes, setAiNotes] = useState(false);
  const [participants, setParticipants] = useState([""]);
  const navigate = useNavigate();

  async function handleSubmit() {
    if (conferenceName === null || conferenceName === "") {
      toast.error("Please enter conference name");
    } else if (
      conferenceType !== "internal" &&
      (members === null || members === "")
    ) {
      toast.error("Please enter number of members");
    } else {
      setLoading(true);
      const parsedData = {
        conf_name: conferenceName,
        conf_max_members: members,
        conf_type: conferenceType,
        ai_notetaker: aiNotes,
        participants: participants,
      };
      const apiData = await generalPostFunction(
        "/conference/store",
        parsedData
      );
      if (apiData.status) {
        navigate(-1);
        setLoading(false);
        toast.success(apiData.message);
      } else {
        setLoading(false);
      }
    }
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Meeting Rooms" />
        </div>
        <div className="overviewTableWrapper">
          <div className="overviewTableChild">
            <div
              className="d-flex flex-wrap"
              style={{ position: "sticky", top: "0", zIndex: "9" }}
            >
              <div className="col-12">
                <div className="heading">
                  <div className="content">
                    <h4>Create Meeting Room</h4>
                    <p>Create a new conference and configure it.</p>
                  </div>
                  <div className="buttonGroup">
                    <div className="d-flex align-items-center">
                      <button
                        onClick={() => {
                          navigate(-1);
                          backToTop();
                        }}
                        type="button"
                        effect="ripple"
                        className="panelButton gray"
                      >
                        <span className="text">Back</span>
                        <span className="icon">
                          <i className="fa-solid fa-caret-left"></i>
                        </span>
                      </button>
                      <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                        onClick={handleSubmit}
                      >
                        <span className="text">Save</span>
                        <span className="icon">
                          <i className="fa-solid fa-floppy-disk"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-12"
              style={{
                padding: "25px 23px",
                // borderBottom: "1px solid #ddd",
              }}
            >
              <form className="col-12 mx-auto">
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Conference Name</label>
                    <label htmlFor="data" className="formItemDesc">
                      Name of the conference
                    </label>
                  </div>
                  <div className="col-xl-6 col-12">
                    <input
                      type="text"
                      name="extension"
                      className="formItem"
                      onChange={(e) => setConferenceName(e.target.value)}
                      value={conferenceName}
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Conference Type</label>
                    <label htmlFor="data" className="formItemDesc">
                      Define type for the conference so that participants can
                      join accordingly
                    </label>
                  </div>
                  <div className="col-xl-6 col-12">
                    <select
                      className="formItem"
                      onChange={(e) => setConferenceType(e.target.value)}
                      value={conferenceType}
                    >
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                      <option value="internal">Internal</option>
                    </select>
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Number of members</label>
                    <label htmlFor="data" className="formItemDesc">
                      Enter maximum number of members that can join
                    </label>
                  </div>
                  <div className="col-xl-6 col-12">
                    <input
                      type="number"
                      name="extension"
                      className="formItem"
                      onChange={(e) => setMembers(e.target.value)}
                      value={members}
                    />
                  </div>
                </div>
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Ai Notes</label>
                    <label htmlFor="data" className="formItemDesc">
                      Enable AI notes for this conference
                    </label>
                  </div>
                  <div class="cl-toggle-switch">
                    <label class="cl-switch">
                      <input
                        type="checkbox"
                        checked={aiNotes}
                        onChange={() => setAiNotes(!aiNotes)}
                        id="showAllCheck"
                      />
                      <span></span>
                    </label>
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Add participants</label>
                    <label htmlFor="data" className="formItemDesc">
                      Enter the participants email who will be joining this
                      meeting
                    </label>
                  </div>
                  {participants.map((participant, index) => (
                    <div key={index} className="col-xl-6 col-12">
                      <input
                        type="email"
                        name={`participant-${index}`}
                        className="formItem"
                        onChange={(e) => {
                          const newParticipants = [...participants];
                          newParticipants[index] = e.target.value;
                          setParticipants(newParticipants);
                        }}
                        value={participant}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      if (participants.includes("")) {
                        toast.error("Please fill all the fields");
                      } else {
                        setParticipants([...participants, ""]);
                      }
                    }}
                    type="button"
                    className="btn btn-primary mt-2"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div>{loading && <CircularLoader />}</div>
    </main>
  );
}

export default MeetingEdit;
