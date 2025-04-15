/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { useForm } from "react-hook-form";
import {
  lengthValidator,
  minValidator,
  nameNumberValidator,
  noSpecialCharactersValidator,
  numberValidator,
  requiredValidator,
  restrictToAllowedChars,
  restrictToNumbers,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";
import ActionList from "../../CommonComponents/ActionList";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import AddMusic from "../../CommonComponents/AddMusic";

const RingGroupAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const [allUserArr, setAllUserArr] = useState([]);
  const [ringBack, setRingBack] = useState();
  const [user, setUser] = useState();
  const extension = useSelector((state) => state.extension);
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const [timeoutDestPstnToggle, setTimeoutDestPstnToggle] = useState(false);
  const [showMusic, setShowMusic] = useState(false);
  const [uploadedMusic, setUploadedMusic] = useState();
  const [musicRefresh, setMusicRefresh] = useState(0);
  const [showTimeoutDestinationToggle, setShowTimeoutDestinationToggle] =
    useState(false);
  const [bulkAddPopUp, setBulkAddPopUp] = useState(false);
  const [bulkUploadSelectedAgents, setBulkUploadSelectedAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [bulkEditPopup, setBulkEditPopup] = useState(false);
  const [selectedAgentToEdit, setSelectedAgentToEdit] = useState([]);
  const [destination, setDestination] = useState([]);

  const [settingsForBulkEdit, setSettingsForBulkEdit] = useState({
    delay: 0,
    timeOut: "0",
    status: "active",
  });

  // Using useForm hook to manage data and validation we are setting some default value in it as well
  const {
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      status: true, // Set the default value for "status" to true
      timeout_destination: "",
      call_timeout: `${160}`,
    },
  });

  const [searchEditAllUser, setSearchEditAllUser] = useState("");

  // Checking validation for the user if user not present then show message please create user first
  useEffect(() => {
    if (!loading) {
      if (allUserArr.length === 0) {
        toast.error("Please create user first");
      } else {
        const filterUser = allUserArr.filter(
          (item) => item.extension_id !== null
        );
        if (filterUser.length > 0) {
          setUser(filterUser);
        } else {
          toast.error("No user found with assign extension");
        }
      }
    }
  }, [allUserArr]);

  // Get all ringbacks music for dropdown
  useEffect(() => {
    if (account && account.id) {
      async function getData() {
        setLoading(true);
        const apidataUser = await generalGetFunction(
          `/user/search?account=${account.account_id}`
        );
        const ringBack = await generalGetFunction("/sound/all?type=ringback");
        if (apidataUser?.status) {
          setLoading(false);
          setAllUserArr(apidataUser.data);
        }
        if (ringBack?.status) {
          setRingBack(ringBack.data);
          if (ringBack.data.length > 0 && uploadedMusic) {
            setValue("ring_back", uploadedMusic.id);
          }
        } else {
          navigate("/");
        }
      }
      getData();
    } else {
      setLoading(false);
      navigate("/");
    }
  }, [account, navigate, musicRefresh]);

  // Get all users with valid extension if extension or user is not present then trigger its api calling by refreshing its state using redux
  useEffect(() => {
    if (!loading) {
      const filterUser = allUserArr.filter(
        (item) => item.extension_id !== null
      );
      if (filterUser.length > 0) {
        // setAllUser(filterUser);
      } else {
        toast.error("No user found with assign extension");
      }
    }

    if (extensionRefresh > 0) {
    } else {
      dispatch({
        type: "SET_EXTENSIONREFRESH",
        extensionRefresh: extensionRefresh + 1,
      });
    }
  }, [allUserArr, extension]);

  // Function to handle click outside to close popup
  const divRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Function to handle changes in destination fields
  const handleDestinationChange = (index, event) => {
    const { name, value } = event.target;

    const allowedCharacters = /^[A-Za-z0-9\s]*$/;

    if (name === "destination" && !allowedCharacters.test(value)) {
      return;
    }
    const newDestination = [...destination];
    newDestination[index][name] = value;
    setDestination(newDestination);

    if (destinationValidation()) {
      clearErrors("destinations");
    } else {
      setError("destinations", {
        type: "manual",
        message: "All fields are required",
      });
    }

    if (!validateUniqueAgents()) {
      setError("destinations", {
        type: "manual",
        message: "Same agent can't be selected for two or more fields",
      });
    } else if (validateAgents()) {
      clearErrors("destinations");
    } else {
      setError("destinations", {
        type: "manual",
        message: "Agent name required in all rows",
      });
    }
  };
  // Validating agent for listing
  const validateAgents = () => {
    const allFieldsFilled = destination.every(
      (item) => item.destination.trim() !== ""
    );
    return allFieldsFilled;
  };

  // Checlking unique agents for listing
  const validateUniqueAgents = () => {
    const agentValues = destination.map((item) => item.destination);
    const uniqueValues = [...new Set(agentValues)];
    return agentValues.length === uniqueValues.length;
  };

  // Function to delete a destination
  const deleteDestination = (id) => {
    const updatedDestination = destination.filter((item) => item.id !== id);
    setDestination(updatedDestination);
    if (destinationValidation) {
      clearErrors("destinations");
    }
  };

  // Function to validate destination
  const destinationValidation = () => {
    const allFilled = destination.every(
      (item) => item.destination.trim() !== ""
    );
    return allFilled;
  };

  // Function to handle changes in dropdown for timeout destination
  const actionListValue = (value) => {
    setValue("timeout_destination", value[0]);
  };

  // Function to create a new ring group by validating form
  const handleFormSubmit = handleSubmit(async (data) => {
    if (!destinationValidation()) {
      setError("destinations", {
        type: "manual",
        message: "All fields are required",
      });
      return;
    }
    if (destination.length === 0) {
      toast.error("Please add at least one destination");
      return;
    }
    if (data.timeout_destination != "" && !data.call_timeout) {
      toast.error("Please Mention call timeout for timeout destination");
      return;
    }
    setLoading(true);
    if (data.ring_back === "" || data.ring_back === "null") {
      delete data.ring_back;
    }

    // Validate priority values for sequence strategy
    if (data.strategy === "sequence") {
      const priorities = destination.map((item) => item.priority);
      const uniquePriorities = new Set(priorities);
      if (priorities.length !== uniquePriorities.size) {
        toast.error("Each destination must have a unique priority value");
        setLoading(false);
        return;
      }
      if (priorities.some((p) => !p)) {
        toast.error("All destinations must have a priority value");
        setLoading(false);
        return;
      }
    }

    const payLoad = {
      ...data,
      ...{
        account_id: account.account_id,
        recording_enabled: data.recording_enabled === "true" ? 1 : 0,
        followme: data.followme == "true" ? true : false,
        status: data.status == true ? "active" : "inactive",
        destination: destination
          .map((item) => {
            if (item.destination.length > 0) {
              return {
                destination: item.destination,
                [data.strategy === "sequence" ? "priority" : "delay_order"]:
                  data.strategy === "sequence" ? item.priority : item.delay,
                destination_timeout: item.timeOut,
                status: item.status,
                created_by: account.account_id,
              };
            } else {
              return null;
            }
          })
          .filter((item) => item !== null),
      },
    };

    const apiData = await generalPostFunction("/ringgroup/store", payLoad);
    if (apiData?.status) {
      setLoading(false);
      reset();
      setDestination([
        {
          id: Math.floor(Math.random() * 10000),
          destination: "",
          delay: 0,
          timeOut: "30",
          status: "active",
        },
      ]);
      toast.success(apiData.message);
      dispatch({
        type: "SET_RINGGROUPREFRESH",
        ringGroupRefresh: ringGroupRefresh + 1,
      });
      navigate("/ring-groups");
    } else {
      setLoading(false);
      toast.error(apiData.error);
    }
  });

  // Open popup for upload new music
  const handleAddMusic = () => {
    setValue("ring_back", "");
    setShowMusic(true);
  };

  // Handle chek box for bulk edit
  const handleCheckboxChange = (item) => {
    setBulkUploadSelectedAgents((prevSelected) => {
      if (
        prevSelected.some(
          (agent) => agent.extension.extension == item.extension.extension
        )
      ) {
        // If the item is already in the array, remove it
        return prevSelected.filter(
          (agent) => agent.extension.extension != item.extension.extension
        );
      } else {
        // Otherwise, add the item
        return [...prevSelected, item];
      }
    });
  };

  // Logic to upload bulk destination
  const handleBulkDestinationUpload = (selectedDestinations) => {
    if (destination.length === 1 && destination[0].destination === "") {
      const newDestinations = selectedDestinations.map(
        (selectedDestination) => ({
          id: Math.floor(Math.random() * 10000),
          destination: selectedDestination?.extension?.extension,
          delay: 0,
          timeOut: "30",
          status: "active",
        })
      );

      setDestination(newDestinations); // Replace the entire destination state
    } else {
      const newDestinations = [...destination]; // Copy the current destination array

      selectedDestinations.forEach((selectedDestination) => {
        const existingDestinationIndex = newDestinations.findIndex(
          (d) => d.name === selectedDestination.name
        );

        if (existingDestinationIndex === -1) {
          // Add new destination if it doesn't already exist
          newDestinations.push({
            id: Math.floor(Math.random() * 10000),
            destination: selectedDestination?.extension?.extension,
            delay: 0,
            timeOut: "30",

            status: "active",
          });
        }
      });

      setDestination(newDestinations); // Update the destination state
    }
    setBulkUploadSelectedAgents([]);
    setSelectAll(false);
  };

  // In bulk add option search funcnality to rearrage the data
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter data based on search those wo match will comes first
  const filteredUsers = user?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user?.extension?.extension || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // The user which is not assign
  const availableUsers = filteredUsers?.filter(
    (user) =>
      !destination.some(
        (agent) => user.extension.extension == agent.destination
      )
  );

  // Select all for bulk edit
  const handleSelectAll = () => {
    const newSelectAllState = !selectAll; // Toggle Select All state
    setSelectAll(newSelectAllState);

    if (newSelectAllState) {
      // Add all visible users to bulkUploadSelectedAgents
      availableUsers.forEach((item) => {
        if (
          !bulkUploadSelectedAgents.some(
            (agent) => agent.extension.extension == item.extension.extension
          )
        ) {
          handleCheckboxChange(item);
        }
      });
    } else {
      // Remove all visible users from bulkUploadSelectedAgents
      availableUsers.forEach((item) => {
        if (
          bulkUploadSelectedAgents.some(
            (agent) => agent.extension.extension == item.extension.extension
          )
        ) {
          handleCheckboxChange(item);
        }
      });
    }
  };

  // Logic to share data among all selected agents
  const handleApplyEditSettings = (data) => {
    const updatedAgents = selectedAgentToEdit.map((item) => {
      return {
        ...item,
        delay: data.delay,
        timeOut: data.timeOut,
        status: data.status,
      };
    });

    // Merge unselected agents with updated selected agents
    const mergedAgents = destination.map((agent) => {
      // Check if the agent is in the selectedAgentToEdit array
      const updatedAgent = updatedAgents.find(
        (updated) => updated.id === agent.id // Assuming `id` is the unique identifier
      );
      return updatedAgent || agent; // Use the updated agent if found, otherwise keep the original
    });

    setDestination(mergedAgents);
    setBulkEditPopup(false);
  };

  // Only selected user will be edited not all users
  const handleSelectUserToEdit = (item) => {
    setSelectedAgentToEdit((prevSelected) => {
      if (prevSelected.some((agent) => agent.id == item.id)) {
        return prevSelected.filter((agent) => agent.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Ring Groups" />
        </div>
        <>
          {loading ? (
            <div>
              <SkeletonFormLoader />
            </div>
          ) : (
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div
                  className="d-flex flex-wrap"
                  style={{ position: "sticky", top: "0", zIndex: "9" }}
                >
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Ring Group Add</h4>
                        <p>
                          A ring group is a set of destinations that can be
                          called with a ring strategy.
                        </p>
                      </div>
                      <div className="buttonGroup">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="formLabel py-0 me-2">
                              <label htmlFor="selectFormRow">Enabled</label>
                            </div>
                            <div className="my-auto position-relative mx-1">
                              {/* <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={watch().status}
                                  {...register("status")}
                                  id="showAllCheck"
                                />
                                <span className="slider round" />
                              </label> */}
                              <div class="cl-toggle-switch">
                                <label class="cl-switch">
                                  <input
                                    type="checkbox"
                                    checked={watch().status}
                                    {...register("status")}
                                    id="showAllCheck"
                                  />
                                  <span></span>
                                </label>
                              </div>
                            </div>
                          </div>
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
                            onClick={handleFormSubmit}
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
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  <form className="row mb-0">
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">
                          Name <span className="text-danger">*</span>
                        </label>
                        <label htmlFor="data" className="formItemDesc">
                          Enter a name.
                        </label>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("name", {
                            ...requiredValidator,
                            ...lengthValidator(3, 25),
                            ...nameNumberValidator,
                          })}
                          onKeyDown={restrictToAllowedChars}
                        />
                        {errors.name && (
                          <ErrorMessage text={errors.name.message} />
                        )}
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Strategy</label>
                        <label htmlFor="data" className="formItemDesc">
                          Select the ring strategy.
                        </label>
                      </div>
                      <div className="col-6">
                        <select
                          className="formItem"
                          {...register("strategy")}
                          id="selectFormRow"
                        >
                          <option value="enterprise">Enterprise</option>
                          <option value="sequence">Sequence</option>
                          <option value="simultaneously">Simultaneous</option>
                          <option value="random">Random</option>
                          <option value="rollover">Rollover</option>
                        </select>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label>Timeout Destination</label>
                        <label className="formItemDesc">
                          Select the timeout destination for this ring group.
                        </label>
                      </div>
                      <div className="col-6">
                        <div className="row">
                          <div
                            className={`col-${showTimeoutDestinationToggle ? "4" : "12"
                              }`}
                          >
                            {showTimeoutDestinationToggle && (
                              <div className="formLabel">
                                <label className="formItemDesc">Type</label>
                              </div>
                            )}
                            <select
                              className="formItem"
                              {...register("destination_type", {
                                onChange: (e) => {
                                  // Custom logic
                                  if (e.target.value == "Extension") {
                                    setTimeoutDestPstnToggle(false);
                                    setShowTimeoutDestinationToggle(true);
                                    if (watch().call_timeout == "") {
                                      setValue("call_timeout", `${60}`);
                                    }
                                    setValue("timeout_destination", "");
                                  } else if (e.target.value == "PSTN") {
                                    setTimeoutDestPstnToggle(true);
                                    setShowTimeoutDestinationToggle(true);
                                    if (watch().call_timeout == "") {
                                      setValue("call_timeout", `${60}`);
                                    }
                                    setValue("timeout_destination", "");
                                  } else if (e.target.value == "Disabled") {
                                    setTimeoutDestPstnToggle(true);
                                    setShowTimeoutDestinationToggle(false);
                                    setValue("timeout_destination", "");
                                  }
                                },
                              })}
                              id="selectFormRow"
                              defaultValue={"Disabled"}
                            >
                              <option value="Disabled">Disabled</option>
                              <option value="Extension">Extension</option>
                              <option value="PSTN">PSTN</option>
                            </select>
                          </div>
                          {showTimeoutDestinationToggle && (
                            <>
                              <div className="col-4">
                                <div className="formLabel">
                                  <label className="formItemDesc">
                                    Destination
                                  </label>
                                </div>
                                {showTimeoutDestinationToggle ? (
                                  timeoutDestPstnToggle ? (
                                    <input
                                      placeholder="PSTN"
                                      className="formItem"
                                      {...register("timeout_destination", {
                                        ...numberValidator,
                                      })}
                                    ></input>
                                  ) : (
                                    <ActionList
                                      title={null}
                                      label={null}
                                      getDropdownValue={actionListValue}
                                      value={watch().timeout_destination}
                                    />
                                  )
                                ) : (
                                  <input
                                    placeholder="None"
                                    disabled
                                    className="formItem"
                                    {...register("timeout_destination", {
                                      ...numberValidator,
                                    })}
                                  ></input>
                                )}
                              </div>
                              <div className="col-4">
                                <div className="formLabel">
                                  <label className="formItemDesc">
                                    Call Timeout
                                  </label>
                                </div>
                                <input
                                  type="text"
                                  name="extension"
                                  className="formItem"
                                  {...register("call_timeout", {
                                    ...noSpecialCharactersValidator,
                                    ...(watch("call_timeout") !== "" &&
                                      minValidator(
                                        destination.reduce(
                                          (max, obj) =>
                                            Math.max(max, obj.delay),
                                          0
                                        )
                                      )),
                                  })}
                                  onKeyDown={restrictToNumbers}
                                />
                                {errors.call_timeout && (
                                  <ErrorMessage
                                    text={errors.call_timeout.message}
                                  />
                                )}
                              </div>
                            </>
                          )}
                          {errors?.timeout_destination && (
                            <ErrorMessage
                              text={errors?.timeout_destination?.message}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Ring Back</label>
                        <label htmlFor="data" className="formItemDesc">
                          Defines what the caller will hear while the
                          destination is being called.
                        </label>
                      </div>
                      <div className="col-6">
                        <select
                          className="formItem"
                          {...register("ring_back")}
                          id="selectFormRow"
                          // defaultValue={"null"}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (selectedValue === "add-music") {
                              handleAddMusic(); // Call your function here
                            }
                          }}
                        >
                          <option value="null">None</option>
                          {ringBack &&
                            ringBack.map((ring) => {
                              return (
                                <option key={ring.id} value={ring.id}>
                                  {ring.name}
                                </option>
                              );
                            })}
                          <option
                            value="add-music"
                            className="addmusic"
                            style={{ cursor: "pointer" }}
                          >
                            Add Music
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Description</label>
                        <label htmlFor="data" className="formItemDesc">
                          Enter the description.
                        </label>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("description", {
                            ...noSpecialCharactersValidator,
                          })}
                          onKeyDown={restrictToAllowedChars}
                        />
                        {errors.description && (
                          <ErrorMessage text={errors.description.message} />
                        )}
                      </div>
                    </div>
                    <div className="formRow col-xl-3 pe-2">
                      <div className="formLabel">
                        <label htmlFor="">Recording</label>
                      </div>
                      <div className="col-6">
                        <select
                          className="formItem me-0"
                          {...register("recording_enabled")}
                          id="selectFormRow"
                          name="recording_enabled"
                          defaultValue={"false"}
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Tag</label>
                        <label htmlFor="data" className="formItemDesc">
                          Enter the tag.
                        </label>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("tag", {
                            ...noSpecialCharactersValidator,
                          })}
                          onKeyDown={restrictToAllowedChars}
                        />
                        {errors.tag && (
                          <ErrorMessage text={errors.tag.message} />
                        )}
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-12">
                  <div className="heading bg-transparent border-bottom-0">
                    <div className="content">
                      <h4>List of Agents</h4>
                      <p>You can see the list of agents in this ring group.</p>
                    </div>
                    <div className="buttonGroup">
                      {destination.length > 0 &&
                        (selectedAgentToEdit.length > 0 &&
                          selectedAgentToEdit.length != destination.length ? (
                          <button
                            type="button"
                            className="panelButton"
                            onClick={() => {
                              setBulkEditPopup(true);
                            }}
                          >
                            <span className="text">Edit</span>
                            <span className="icon">
                              <i className="fa-solid fa-pen"></i>
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="panelButton edit"
                            onClick={() => {
                              setSelectedAgentToEdit(destination);
                              setBulkEditPopup(true);
                            }}
                          >
                            <span className="text">Edit All</span>
                            <span className="icon">
                              <i className="fa-solid fa-pen"></i>
                            </span>
                          </button>
                        ))}
                      <button
                        type="button"
                        className="panelButton"
                        onClick={() => {
                          if (user.length !== destination.length)
                            setBulkAddPopUp(true);
                          else toast.warn("All agent selected");
                        }}
                      >
                        <span className="text">Add</span>
                        <span className="icon">
                          <i className="fa-solid fa-plus"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  {destination.length > 0 && (
                    <form className="row" style={{ padding: "0px 23px 20px" }}>
                      <div className="formRow col-xl-12">
                        {destination.map((item, index) => {
                          return (
                            <div className="col-12 d-flex justify-content-start mb-2">
                              <div
                                className="formLabel pe-2 d-flex justify-content-between"
                                style={
                                  index === 0
                                    ? { marginTop: 32, width: 50 }
                                    : { width: 50 }
                                }
                              >
                                <div>
                                  <input
                                    type="checkbox"
                                    onChange={() =>
                                      handleSelectUserToEdit(item)
                                    }
                                    checked={selectedAgentToEdit.some(
                                      (agent) =>
                                        agent.destination == item.destination
                                    )}
                                  ></input>
                                </div>
                                <label>{index + 1}.</label>
                              </div>
                              <div className="col-3 pe-2">
                                {index === 0 ? (
                                  <div className="formLabel">
                                    <label htmlFor="">
                                      Destinations{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                  </div>
                                ) : (
                                  ""
                                )}
                                <div className="position-relative">
                                  <select
                                    disabled
                                    type="text"
                                    name="destination"
                                    value={item.destination}
                                    onChange={(e) => {
                                      const selectedValue = e.target.value;
                                      if (selectedValue === "addUser") {
                                        navigate("/users-add");
                                      } else {
                                        handleDestinationChange(index, e);
                                      }
                                    }}
                                    className="formItem"
                                    placeholder="Destination"
                                  >
                                    <option value={""} disabled>
                                      Choose agent
                                    </option>

                                    {user &&
                                      user
                                        .filter((item1) => {
                                          return (
                                            item1.extension.extension ==
                                            destination[index]?.destination ||
                                            !destination.some(
                                              (
                                                destinationItem,
                                                destinationIndex
                                              ) =>
                                                destinationItem.destination ==
                                                item1.extension.extension &&
                                                destinationIndex != index
                                            )
                                          );
                                        })
                                        .map((item) => {
                                          return (
                                            <option
                                              value={item.extension?.extension}
                                              key={item.id}
                                            >
                                              {item.alias
                                                ? `${item?.alias} - ${item.extension?.extension}`
                                                : `${item?.name} - ${item.extension?.extension}`}
                                              {/* {item.name}(
                                            {item.extension?.extension}) */}
                                            </option>
                                          );
                                        })}
                                    <option
                                      value="addUser"
                                      className="addmusic"
                                      style={{ cursor: "pointer" }}
                                    >
                                      Add User
                                    </option>
                                  </select>
                                </div>
                              </div>
                              {watch("strategy") === "sequence" ? (
                                <div className="col-2 pe-2">
                                  {index === 0 ? (
                                    <div className="formLabel">
                                      <label htmlFor="">Priority</label>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <select
                                    className="formItem me-0"
                                    style={{ width: "100%" }}
                                    name="priority"
                                    id="selectFormRow"
                                    value={item.priority}
                                    onChange={(e) => {
                                      handleDestinationChange(index, e);
                                    }}
                                  >
                                    <option value="">Select Priority</option>
                                    {(() => {
                                      const numbers = [];
                                      for (
                                        let i = 1;
                                        i <= destination.length;
                                        i++
                                      ) {
                                        // Only show priority numbers that aren't used by other destinations
                                        const isPriorityUsed = destination.some(
                                          (dest, idx) =>
                                            idx !== index &&
                                            dest.priority === i.toString()
                                        );
                                        if (!isPriorityUsed) {
                                          numbers.push(
                                            <option key={i} value={i}>
                                              {i}
                                            </option>
                                          );
                                        }
                                      }
                                      return numbers;
                                    })()}
                                  </select>
                                </div>
                              ) : (
                                <div className="col-2 pe-2">
                                  {index === 0 ? (
                                    <div className="formLabel">
                                      <label htmlFor="">Delay</label>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <select
                                    className="formItem me-0"
                                    style={{ width: "100%" }}
                                    name="delay"
                                    id="selectFormRow"
                                    value={item.delay}
                                    onChange={(e) => {
                                      handleDestinationChange(index, e);
                                    }}
                                  >
                                    <option>Delay</option>
                                    {(() => {
                                      const numbers = [];
                                      for (let i = 0; i <= 100; i++) {
                                        if (i % 5 === 0) {
                                          numbers.push(
                                            <span key={i}>{i}</span>
                                          );
                                        }
                                      }
                                      return numbers.map((item) => {
                                        return <option>{item}</option>;
                                      });
                                    })()}
                                  </select>
                                </div>
                              )}

                              <div className="col-2 pe-2">
                                {index === 0 ? (
                                  <div className="formLabel">
                                    <label htmlFor="">Timeout</label>
                                  </div>
                                ) : (
                                  ""
                                )}
                                <select
                                  className="formItem me-0"
                                  style={{ width: "100%" }}
                                  name="timeOut"
                                  value={item.timeOut}
                                  onChange={(e) =>
                                    handleDestinationChange(index, e)
                                  }
                                  id="selectFormRow"
                                >
                                  <option>Timeout</option>
                                  {(() => {
                                    const numbers = [];
                                    for (let i = 0; i <= 100; i++) {
                                      if (i % 5 === 0) {
                                        numbers.push(<span key={i}>{i}</span>);
                                      }
                                    }
                                    return numbers.map((item) => {
                                      return <option>{item}</option>;
                                    });
                                  })()}
                                </select>
                              </div>
                              <div className="col-2 pe-2">
                                {index === 0 ? (
                                  <div className="formLabel">
                                    <label htmlFor="">Status</label>
                                  </div>
                                ) : (
                                  ""
                                )}
                                <select
                                  className="formItem me-0"
                                  style={{ width: "100%" }}
                                  value={item.status}
                                  onChange={(e) =>
                                    handleDestinationChange(index, e)
                                  }
                                  id="selectFormRow"
                                  name="status"
                                >
                                  <option className="status" value="active">
                                    True
                                  </option>
                                  <option value="inactive">False</option>
                                </select>
                              </div>
                              {destination.length === 1 ? (
                                ""
                              ) : (
                                <div
                                  className={`me-2 h-100 m${index === 0 ? "t" : "y"
                                    }-auto`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => deleteDestination(item.id)}
                                    className="tableButton delete"
                                  >
                                    <i className="fa-solid fa-trash"></i>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {errors.destinations && (
                          <ErrorMessage text={errors.destinations.message} />
                        )}

                        <label htmlFor="data" className="formItemDesc">
                          Add destinations and parameters to the ring group.
                        </label>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      </section>
      {showMusic && (
        <AddMusic
          show={showMusic}
          setShow={setShowMusic}
          setUploadedMusic={setUploadedMusic}
          setMusicRefresh={setMusicRefresh}
          musicRefresh={musicRefresh}
          listArray={["ringback"]}
        />
      )}
      {bulkAddPopUp ? (
        <div className="backdropContact">
          <div className="addNewContactPopup">
            <div className="row">
              <div className="col-12 heading mb-0">
                <i className="fa-light fa-user-plus" />
                <h5>Add People to the selected Ring Group</h5>
              </div>
              <div className="col-xl-12">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <input
                    type="text"
                    className="formItem"
                    placeholder="Search"
                    name="name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    className="tableButton popupIcon_btn ms-2"
                    onClick={() => navigate("/users-add")}
                  >
                    <i className="fa-solid fa-user-plus"></i>
                  </button>
                </div>
              </div>
              <div className="col-xl-12 mt-3">
                <div
                  className="tableContainer mt-0"
                  style={{ maxHeight: "calc(100vh - 400px)" }}
                >
                  <table>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Extension</th>
                        <th>
                          <input
                            type="checkbox"
                            onChange={handleSelectAll} // Call handler on change
                            checked={selectAll ? true : false} // Keep checkbox state in sync
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {user
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
                        .filter(
                          (user) =>
                            !destination.some(
                              (agent) =>
                                user.extension.extension == agent.destination
                            ) && user.usages === "pbx"
                        )
                        .map((item, index) => {
                          return (
                            <tr key={item.id || index}>
                              <td>{index + 1}</td>
                              <td>{item.name}</td>
                              <td>{item.extension.extension}</td>
                              <td>
                                <input
                                  type="checkbox"
                                  onChange={() => handleCheckboxChange(item)} // Call handler on change
                                  checked={bulkUploadSelectedAgents.some(
                                    (agent) => agent.name === item.name
                                  )} // Keep checkbox state in sync
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-xl-12 mt-2">
                <div className="d-flex justify-content-between">
                  <button
                    className="panelButton gray ms-0"
                    onClick={() => {
                      setBulkAddPopUp(false);
                      setBulkUploadSelectedAgents([]);
                      setSelectAll(false);
                    }}
                  >
                    <span className="text">Close</span>
                    <span className="icon">
                      <i className="fa-light fa-xmark"></i>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      handleBulkDestinationUpload(bulkUploadSelectedAgents);
                      setBulkAddPopUp(false);
                    }}
                    className="panelButton"
                  >
                    <span className="text">Done</span>
                    <span className="icon">
                      <i className="fa-solid fa-check" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {bulkEditPopup ? (
        <div className="addNewContactPopup">
          <div className="row">
            <div className="col-12 heading mb-0">
              <i className="fa-light fa-user-plus" />
              <h5>Edit People to the selected Queue</h5>
            </div>
            <div>
              <div className="d-flex justify-content-between mb-2">
                <h5
                  style={{
                    color: "var(--color-subtext)",
                    fontSize: 14,
                    marginBottom: 5,
                    marginTop: 5,
                  }}
                >
                  Affected user:{" "}
                </h5>
                <div className="searchBoxWrapper">
                  <input
                    className="searchBar"
                    type="text"
                    value={searchEditAllUser}
                    onChange={(e) => setSearchEditAllUser(e.target.value)}
                  />
                </div>
              </div>

              <ul>
                {selectedAgentToEdit
                  .map((item) => destination.find((user) => item.id == user.id))
                  .filter((item) =>
                    item.destination.includes(searchEditAllUser.trim())
                  )
                  .map((items) => (
                    <li>
                      <i className="fa-regular fa-user me-2" />
                      {items?.destination}
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col-xl-12">
              <div className="col-12 d-flex justify-content-between align-items-center"></div>
            </div>
            <div className="mt-3 d-flex">
              {watch("strategy") !== "sequence" && (
                <div className="col-4 pe-2">
                  <div className="formLabel">
                    <label htmlFor="">Delay</label>
                  </div>

                  <select
                    className="formItem me-0"
                    style={{ width: "100%" }}
                    name="delay"
                    id="selectFormRow"
                    value={settingsForBulkEdit.delay}
                    onChange={(e) => {
                      setSettingsForBulkEdit({
                        ...settingsForBulkEdit,
                        delay: e.target.value,
                      });
                    }}
                    defaultValue={0}
                  >
                    <option>Delay</option>
                    {(() => {
                      const numbers = [];
                      for (let i = 0; i <= 100; i++) {
                        if (i % 5 === 0) {
                          numbers.push(<span key={i}>{i}</span>);
                        }
                      }
                      return numbers.map((item) => {
                        return <option>{item}</option>;
                      });
                    })()}
                  </select>
                </div>
              )}
              <div className="col-4 pe-2">
                <div className="formLabel">
                  <label htmlFor="">Timeout</label>
                </div>

                <select
                  className="formItem me-0"
                  style={{ width: "100%" }}
                  name="timeOut"
                  value={settingsForBulkEdit.timeOut}
                  onChange={(e) => {
                    setSettingsForBulkEdit({
                      ...settingsForBulkEdit,
                      timeOut: e.target.value,
                    });
                  }}
                  id="selectFormRow"
                  defaultValue={0}
                >
                  <option>Timeout</option>
                  {(() => {
                    const numbers = [];
                    for (let i = 0; i <= 100; i++) {
                      if (i % 5 === 0) {
                        numbers.push(<span key={i}>{i}</span>);
                      }
                    }
                    return numbers.map((item) => {
                      return <option>{item}</option>;
                    });
                  })()}
                </select>
              </div>

              <div className="col-4 pe-0">
                <div className="formLabel">
                  <label htmlFor="">Status</label>
                </div>

                <select
                  className="formItem me-0"
                  style={{ width: "100%" }}
                  value={settingsForBulkEdit.status}
                  onChange={(e) => {
                    setSettingsForBulkEdit({
                      ...settingsForBulkEdit,
                      status: e.target.value,
                    });
                  }}
                  id="selectFormRow"
                  name="status"
                  defaultValue={"active"}
                >
                  <option className="status" value="active">
                    True
                  </option>
                  <option value="inactive">False</option>
                </select>
              </div>
            </div>
            <div className="col-xl-12 mt-2">
              <div className="d-flex justify-content-between">
                <button
                  className="panelButton gray ms-0"
                  onClick={() => {
                    setBulkEditPopup(false);
                    setSettingsForBulkEdit({
                      tier_level: "",
                      tier_position: "",
                      call_timeout: "",
                      reject_delay: "",
                      max_no_answer: "",
                      busy_delay: "",
                      no_answer_delay: "",
                      wrap_up_time: "",
                      reserve_agents: "",
                      truncate_agents_on_load: "",
                      truncate_tiers_on_load: "",
                    });
                    setSearchEditAllUser("");
                  }}
                >
                  <span className="text">Close</span>
                  <span className="icon">
                    <i className="fa-solid fa-caret-left" />
                  </span>
                </button>
                <button
                  className="panelButton me-0"
                  // onClick={() => handleBulkUpload(bulkUploadSelectedAgents)}
                  onClick={() => handleApplyEditSettings(settingsForBulkEdit)}
                >
                  <span className="text">Done</span>
                  <span className="icon">
                    <i className="fa-solid fa-check" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </main>
  );
};

export default RingGroupAdd;
