import React, { useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
  useDebounce,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import Header from "../../CommonComponents/Header";
import { useLocation, useNavigate } from "react-router-dom";
import CircularLoader from "../../Loader/CircularLoader";
import { useSelector } from "react-redux";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import { use } from "react";
import { useForm } from "react-hook-form";
import { requiredValidator } from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";

function MeetingEdit() {
  const location = useLocation();
  const id = location.state?.id || null;
  const account = useSelector((state) => state.account);
  const [conferenceName, setConferenceName] = useState("");
  const [conferenceType, setConferenceType] = useState("public");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState(5);
  const [aiNotes, setAiNotes] = useState(false);
  const [participants, setParticipants] = useState([""]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [allInternalUsers, setAllInternalUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const { register, formState: { errors }, reset, handleSubmit, watch, setValue } = useForm();

  useEffect(() => {
    if (!id) {
      navigate(-1);
    } else {
      getConferenceData();
    }
  }, [id]);

  async function getConferenceData() {
    setLoading(true);
    try {
      const response = await generalGetFunction(`/conference/${id}`);
      if (response.status) {
        const data = response.data;
        if (data.conf_start_time && data.conf_end_time) {
          setValue("conf_scheduled", "1")
        }
        reset(data);

        // setAddedUsers(data.users);
        setParticipants(data.emails.length == 0 ? [""] : data.emails);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

  }

  const handleMeetingForm = handleSubmit(async (data) => {
    // if (participants.length == 1 && participants[0].length == 0) {
    //   toast.error("Please add participants");
    //   return;
    // }
    if (
      watch().conf_type !== "internal" &&
      (members === null || members === "")
    ) {
      toast.error("Please enter number of members");
    } else {
      setLoading(true);
      const parsedData = {
        ...data,
        ...(watch().conf_type === "internal"
          ? { users: addedUsers.map((user) => user.id) }
          : ""),
        emails: participants
      };
      const apiData = await generalPutFunction(
        `/conference/${id}`,
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
  })

  async function getInternalUsers() {
    setLoading(true);
    try {
      const response = await generalGetFunction(
        `/user/search?account=${account.account_id}${account.usertype !== "Company" || account.usertype !== "SupreAdmin"
          ? "&section=Accounts"
          : ""
        }`
      );
      if (response.status) {
        setAllInternalUsers(response.data);
        if (watch().conf_type == "internal") {
          const addedUsers = response.data.filter((user) => watch().users.some((item) => item.user_id == user.id));
          setAddedUsers(addedUsers);
        }
      }
    } catch (err) {
      toast.error(err.response.message || err.response.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (allInternalUsers?.length == 0) {
      getInternalUsers();
    }
  }, [watch().conf_type]);

  function handleChecked(userId) {
    if (selectedUser.includes(userId)) {
      setSelectedUser(selectedUser.filter((id) => id !== userId));
    } else {
      setSelectedUser([...selectedUser, userId]);
    }
  }

  function handleSelectAll() {
    const availableUsers = allInternalUsers.filter(
      (user) => !addedUsers.includes(user)
    );

    const newSelectedUsers = availableUsers.map((user) => user.id);
    setSelectedUser(newSelectedUsers);
  }

  function handleAddUser() {
    if (selectedUser.length === 0) {
      toast.error("Please select at least one user");
      return;
    }
    const newUserSelect = allInternalUsers.filter((user) =>
      selectedUser.includes(user.id)
    );
    setAddedUsers([...addedUsers, ...newUserSelect]);
    setSelectedUser([]);
  }

  function handleRemoveUser(userId) {
    setAddedUsers(addedUsers.filter((user) => user.id !== userId));
  }
  return (
    <main className="mainContent">
      <section>
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
                    <h4>Edit Meeting Room</h4>
                    <p>Edit the conference to configure it.</p>
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
                        onClick={handleMeetingForm}
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
            <div className="col-xl-12" style={{ padding: "25px 23px" }}>
              <div className="row">
                <div
                  className="col-xl-6"
                  style={{
                    borderRight: "1px solid var(--border-color)",
                  }}
                >
                  <form className="col-12 mx-auto">
                    <div className="formRow">
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
                          {...register("conf_name", { ...requiredValidator, })}
                        />
                        {errors.conf_name && (
                          <ErrorMessage text={errors.conf_name.message} />
                        )}
                      </div>
                    </div>
                    <div className="formRow">
                      <div className="formLabel">
                        <label htmlFor="">Conference Type</label>
                        <label htmlFor="data" className="formItemDesc">
                          Define type for the conference so that participants
                          can join accordingly
                        </label>
                      </div>
                      <div className="col-xl-6 col-12">
                        <select
                          className="formItem"
                          {...register("conf_type", { ...requiredValidator, })}
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="internal">Internal</option>
                        </select>
                        {errors.conf_type && (
                          <ErrorMessage text={errors.conf_type.message} />
                        )}
                      </div>
                    </div>
                    <div className="formRow">
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
                          {...register("conf_max_members", { ...requiredValidator, })}
                        />
                        {errors.conf_max_members && (
                          <ErrorMessage text={errors.conf_max_members.message} />
                        )}
                      </div>
                    </div>
                    <div className="formRow">
                      <div className="formLabel">
                        <label htmlFor="">Scheduled Time</label>
                        <label htmlFor="data" className="formItemDesc">
                          Enter maximum number of members that can join
                        </label>
                      </div>
                      <div className="col-xl-6 col-12">
                        <div className="row">
                          <div className="col-12">
                            <select className="formItem" {...register("conf_scheduled")}>
                              <option value={"0"}>
                                Disabled
                              </option>
                              <option value={"1"}>
                                Enabled
                              </option>
                            </select>
                          </div>
                          {watch().conf_scheduled == "1" ? <>
                            <div className="col-6 mt-2">
                              <label htmlFor="data" className="formItemDesc">
                                Start Date & Time
                              </label>
                              <input
                                type="datetime-local"
                                name="extension"
                                className="formItem"
                                {...register("conf_start_time")}
                              />
                            </div>
                            <div className="col-6 mt-2">
                              <label htmlFor="data" className="formItemDesc">
                                End Date & Time
                              </label>
                              <input
                                type="datetime-local"
                                name="extension"
                                className="formItem"
                                {...register("conf_end_time")}
                              />
                            </div>
                          </> : ""}
                        </div>
                      </div>
                    </div>
                    <div className="formRow">
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
                            id="showAllCheck"
                            {...register("ai_notetaker")}
                          />
                          <span></span>
                        </label>
                      </div>
                    </div>
                    <div className="formRow align-items-start">
                      <div className="formLabel">
                        <label htmlFor="">Add participants</label>
                        <label htmlFor="data" className="formItemDesc">
                          Enter the participants email who will be joining this
                          meeting
                        </label>
                      </div>
                      <div className="col-xl-6 col-12">
                        {participants.map((participant, index) => (
                          <div
                            key={index}
                            className={`d-flex justify-content-between align-items-center ${participants?.length > 1 && "mb-2"
                              }`}
                          >
                            <input
                              type="email"
                              name={`participant-${index}`}
                              className="formItem"
                              onChange={(e) => {
                                const newParticipants = [...participants];
                                newParticipants[index] = e.target.value;
                                setParticipants(newParticipants);
                              }}
                              value={participant.email}
                            />
                            <button
                              onClick={() => {
                                if (participants.includes("")) {
                                  toast.error("Please fill all the fields");
                                } else {
                                  setParticipants([...participants, ""]);
                                }
                              }}
                              type="button"
                              className="tableButton ms-2"
                            >
                              <i className="fa-solid fa-plus" />
                            </button>
                            {participants.length > 1 && (
                              <button
                                onClick={() =>
                                  setParticipants(
                                    participants.filter((_, i) => i !== index)
                                  )
                                }
                                className="tableButton delete ms-2"
                              >
                                <i className="fa-solid fa-trash" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>
                {watch().conf_type == "internal" && (
                  <div className="col-xl-6">
                    <nav className="tangoNavs">
                      <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button
                          className="nav-link active"
                          id="nav-all-user-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-all-user"
                          type="button"
                          role="tab"
                          aria-controls="nav-all-user"
                          aria-selected="true"
                        >
                          All Users
                        </button>
                        <button
                          className="nav-link"
                          id="nav-added-user-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-added-user"
                          type="button"
                          role="tab"
                          aria-controls="nav-added-user"
                          aria-selected="true"
                        >
                          Added Users
                        </button>
                      </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                      <div
                        class="tab-pane fade show active"
                        id="nav-all-user"
                        role="tabpanel"
                        aria-labelledby="nav-all-user-tab"
                        tabindex="0"
                      >
                        <div className="mainContentApp m-0">
                          <input
                            type="search"
                            name="Search"
                            id="headerSearch"
                            class="searchStyle mt-2"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <div
                            className="bg-transparent AvailableAgents border-0"
                            style={{
                              height: "calc(-350px + 100vh)",
                              overflow: "hidden scroll",
                            }}
                          >
                            {allInternalUsers && allInternalUsers.length > 0 ? (
                              allInternalUsers
                                .filter(
                                  (user) => addedUsers.includes(user) === false
                                )
                                .sort((a, b) => {
                                  const aMatches =
                                    a.name
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase()) ||
                                    (a?.extension?.extension || "")
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase());
                                  const bMatches =
                                    b.name
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase()) ||
                                    (b?.extension?.extension || "")
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase());
                                  // Sort: matching items come first
                                  return bMatches - aMatches;
                                })
                                .map((user, index) => (
                                  <div className="callListItem" key={index}>
                                    <div className="row align-items-center">
                                      <div
                                        className=" d-flex justify-content-center align-items-center selectedNone"
                                        style={{
                                          width: 16,
                                          height: 16,
                                          borderRadius: 3,
                                          padding: 0,
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selectedUser.includes(
                                            user.id
                                          )}
                                          value={user.id}
                                          onChange={(e) =>
                                            handleChecked(user.id)
                                          }
                                        />
                                      </div>

                                      <div className="col d-flex ps-2">
                                        <div className="profileHolder">
                                          {user?.profile_picture ? (
                                            <img
                                              src={user?.profile_picture}
                                              alt="profile"
                                              onError={(e) =>
                                                (e.target.src = require("../../assets/images/placeholder-image.webp"))
                                              }
                                            />
                                          ) : (
                                            <i className="fa-light fa-user fs-5" />
                                          )}
                                        </div>
                                        <div className="my-auto ms-2 ms-xl-3 text-start">
                                          <h4
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {user.name}
                                          </h4>
                                          <h5 className="mt-2">{user.email}</h5>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <EmptyPrompt name="User" link="users-add" />
                            )}
                          </div>
                          <div className="d-flex justify-content-between align-items-center my-2">
                            <button
                              onClick={() => handleSelectAll()}
                              className="panelButton edit static ms-2"
                            >
                              <span class="text">Select All</span>
                            </button>
                            <button
                              className="panelButton ms-2"
                              disabled={selectedUser.length === 0}
                              onClick={handleAddUser}
                            >
                              <span class="text">Add</span>
                              <span class="icon">
                                <i class="fa-solid fa-plus"></i>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        class="tab-pane fade show"
                        id="nav-added-user"
                        role="tabpanel"
                        aria-labelledby="nav-added-user-tab"
                        tabindex="0"
                      >
                        <div className="mainContentApp m-0">
                          <input
                            type="search"
                            name="Search"
                            id="headerSearch"
                            class="searchStyle mt-2"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <div
                            className="bg-transparent AvailableAgents border-0"
                            style={{
                              height: "calc(-275px + 100vh)",
                              overflow: "hidden scroll",
                            }}
                          >
                            {addedUsers && addedUsers.length > 0 ? (
                              addedUsers
                                .sort((a, b) => {
                                  const aMatches =
                                    a.name
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase()) ||
                                    (a?.extension?.extension || "")
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase());
                                  const bMatches =
                                    b.name
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase()) ||
                                    (b?.extension?.extension || "")
                                      .toLowerCase()
                                      .includes(searchQuery.toLowerCase());
                                  // Sort: matching items come first
                                  return bMatches - aMatches;
                                })
                                .map((user, index) => (
                                  <div className="callListItem" key={index}>
                                    <div className="row align-items-center">
                                      <button
                                        onClick={() =>
                                          handleRemoveUser(user.id)
                                        }
                                        className="tableButton delete"
                                      >
                                        <i className="fa-solid fa-trash" />
                                      </button>
                                      <div className="col d-flex ps-2">
                                        <div className="profileHolder">
                                          {user?.profile_picture ? (
                                            <img
                                              src={user?.profile_picture}
                                              alt="profile"
                                              onError={(e) =>
                                                (e.target.src = require("../../assets/images/placeholder-image.webp"))
                                              }
                                            />
                                          ) : (
                                            <i className="fa-light fa-user fs-5" />
                                          )}
                                        </div>
                                        <div className="my-auto ms-2 ms-xl-3 text-start">
                                          <h4
                                            style={{
                                              textTransform: "capitalize",
                                            }}
                                          >
                                            {user.name}
                                          </h4>
                                          <h5 className="mt-2">{user.email}</h5>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <EmptyPrompt name="User" link="users-add" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div>{loading && <CircularLoader />}</div>
    </main>
  );
}

export default MeetingEdit;
