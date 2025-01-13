import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPutFunction,
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

const RingGroupEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const [extensions, setExtensions] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");
  const [successMessage, setSuccessMessage] = useState("");
  const [toastAfterSaveCounter, settoastAfterSaveCounter] = useState(0);
  const [prevDestinations, setprevDestinations] = useState([]);
  const [destinationList, setDestinationList] = useState(false);
  const [destinationId, setDestinationId] = useState();
  const [filterExtension, setFilterExtension] = useState();
  const [allUser, setAllUser] = useState();
  const [getAllDataRefresh, setGetAllDataRefresh] = useState(0);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const allUserArr = useSelector((state) => state.allUser);
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
  const [settingsForBulkEdit, setSettingsForBulkEdit] = useState({
    delay: 0,
    timeOut: "0",
    status: "active",
  });
  const {
    register,
    watch,
    setError,
    formState: { errors },
    handleSubmit,
    clearErrors,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      status: true, // Set the default value for "status" to true
      timeout_destination: "",
      call_timeout: `${160}`,
    },
  });

  // Handle destination
  const [destination, setDestination] = useState([
    {
      // id: 1,
      id: Math.floor(Math.random() * 10000),
      destination: "",
      delay: 0,
      timeOut: "30",
      // prompt: "",
      status: "active",
    },
  ]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setSuccessMessage(""); // Clear success message after showing it
    }
  }, [toastAfterSaveCounter]);
  useEffect(() => {
    // async function getData() {
    // const userData = await generalGetFunction("/user/all");
    if (allUserRefresh > 0) {
      if (allUserArr.data.length === 0) {
        toast.error("Please create user first");
      } else {
        const filterUser = allUserArr.data.filter(
          (item) => item.extension_id !== null
        );
        if (filterUser.length > 0) {
          setUser(filterUser);
        } else {
          toast.error("No user found with assign extension");
        }
      }
    } else {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    }
    // }
    // getData();
  }, [allUserArr]);
  useEffect(() => {
    if (account && account.id) {
      setLoading(true);
      async function getData() {
        const ringData = await generalGetFunction(`/ringgroup/${value}`);
        // const apiData = await generalGetFunction(
        //   `/extension/search?account=${account.account_id}`
        // );
        const apidataUser = await generalGetFunction(
          `/user/search?account=${account.account_id}`
        );
        // const ringBack = await generalGetFunction("/sound/all?type=ringback");

        // if (apiData.status) {
        //   setExtensions(apiData.data);
        // } else {
        //   navigate("/");
        // }
        if (apidataUser?.status) {
          setUsers(apidataUser.data);
        } else {
          navigate("/");
        }
        if (ringData?.status) {
          setLoading(false);

          let editData = ringData.data[0];

          const { ring_group_destination, followme, status, call_timeout } =
            editData;
          setprevDestinations(ring_group_destination);
          if (ring_group_destination.length > 0) {
            setDestination(
              ring_group_destination.map((item) => {
                return {
                  destination: item.destination,
                  delay: item.delay_order,
                  // prompt: item.prompt,
                  timeOut: item.destination_timeout,
                  status: item.status,
                  id: item.id,
                };
              })
            );
          }

          delete editData.ring_group_destination;
          delete editData.ring_group_timeout_app;
          delete editData.ring_group_timeout_data;

          const updatedEditData = {
            ...editData,
            ...{
              followme: followme == 1 ? true : false,
              status: status == "active" ? true : false,
              recording_enabled:
                editData.recording_enabled === 1 ? true : false,
              call_timeout: call_timeout !== null ? call_timeout : "",
            },
          };
          if (updatedEditData.destination_type != "Disabled") {
            setShowTimeoutDestinationToggle(true);
            if (updatedEditData.destination_type == "PSTN") {
              setTimeoutDestPstnToggle(true);
            }
          }
          reset(updatedEditData);

          if (successMessage) {
            settoastAfterSaveCounter(toastAfterSaveCounter + 1);
          }
        } else {
          setLoading(false);
          navigate("/");
        }
      }
      getData();
    } else {
      navigate("/");
    }
  }, [account, navigate, value, getAllDataRefresh]);

  useEffect(() => {
    const getRingBackData = async () => {
      setLoading(true);
      const ringBack = await generalGetFunction("/sound/all?type=ringback");

      if (ringBack?.status) {
        setRingBack(ringBack.data);
        if (ringBack.data.length > 0 && uploadedMusic) {
          setValue("ring_back", uploadedMusic.id);
        }
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/");
      }
    };
    getRingBackData();
  }, [musicRefresh, getAllDataRefresh]);

  // Get all users with valid extension
  useEffect(() => {
    if (allUserRefresh > 0) {
      const filterUser = allUserArr.data.filter(
        (item) => item.extension_id !== null
      );
      if (filterUser.length > 0) {
        setAllUser(filterUser);
      } else {
        toast.error("No user found with assign extension");
      }
    } else {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    }

    if (extensionRefresh > 0) {
      setExtensions(extension);
    } else {
      dispatch({
        type: "SET_EXTENSIONREFRESH",
        extensionRefresh: extensionRefresh + 1,
      });
    }
  }, [allUserArr, extensions]);

  // useEffect(() => {
  //   if (extensionRefresh > 1) {
  //     setExtension(extensionArr);
  //   } else {
  //     dispatch({
  //       type: "SET_EXTENSIONREFRESH",
  //       extensionRefresh: extensionRefresh + 1,
  //     });
  //   }
  // }, [extensionArr]);

  // const extensionOptions = extension.map((item) => ({
  //   value: item.extension,
  //   label: item.extension,
  // }));

  // const handleExtensionChange = (selectedOption) => {
  //   setGroup((prevState) => ({
  //     ...prevState,
  //     extension: selectedOption ? selectedOption.value : "",
  //   }));
  // };

  const handleExtensionChange = (selectedOption) => {
    setValue("extension", selectedOption.value);
  };
  const actionListValue = (value) => {
    setValue("timeout_destination", value[0]);
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  // Function to handle changes in destination fields
  const handleDestinationChange = (index, event) => {
    const { name, value } = event.target;

    const allowedCharacters = /^[A-Za-z0-9\s]*$/;

    if (name === "destination" && !allowedCharacters.test(value)) {
      console.log("Invalid characters detected");
      return;
    }

    if (extensions && name === "destination") {
      setDestinationList(true);
      setFilterExtension(
        extensions.filter((item) => item.extension.includes(value))
      );
    }

    setDestinationId(index);
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
  if (destination.length === 0) {
    addNewDestination();
  }

  const validateAgents = () => {
    const allFieldsFilled = destination.every(
      (item) => item.destination.trim() !== ""
      //  && item.password.trim() !== ""
    );
    return allFieldsFilled;
  };
  const validateUniqueAgents = () => {
    const agentValues = destination.map((item) => item.destination);
    const uniqueValues = [...new Set(agentValues)];
    return agentValues.length === uniqueValues.length;
  };

  // Handle list click
  const handlelistClick = (index, value) => {
    const newDestination = [...destination];
    newDestination[index]["destination"] = value;
    setDestination(newDestination);
  };
  console.log(watch());
  // Function to add a new destination field
  const addNewDestination = () => {
    setDestination([
      ...destination,
      {
        // id: destination.length + 10000,
        id: Math.floor(Math.random() * 10000),
        destination: "",
        delay: 0,
        timeOut: "30",
        // prompt: "",
        status: "active",
      },
    ]);
  };

  // Function to delete a destination

  //check that to remove student from ui or to call api
  const checkPrevDestination = (id) => {
    const result = prevDestinations.filter((item, idx) => {
      return item.id == id;
    });
    if (result.length > 0) return true;
    return false;
  };
  async function deleteDestination(id) {
    if (checkPrevDestination(id)) {
      setLoading(true);
      const deleteGroup = await generalDeleteFunction(
        `/ringgroupdestination/${id}`
      );
      if (deleteGroup.status) {
        const updatedDestination = destination.filter((item) => item.id !== id);
        setDestination(updatedDestination);
        setLoading(false);
        toast.success(deleteGroup.message);
      } else {
        setLoading(false);
        toast.error(deleteGroup.message);
      }
    } else {
      setDestination(destination.filter((item) => item.id !== id));
    }
    if (destinationValidation) {
      clearErrors("destinations");
    }
  }

  const destinationValidation = () => {
    const allFilled = destination.every(
      (item) => item.destination.trim() !== ""
    );

    return allFilled;
  };

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
    // if (data.timeout_destination != "" && !data.call_timeout) {
    //   toast.error("Please Mention call timeout for timeout destination");
    //   return;
    // }
    const payLoad = {
      ...data,
      ...{
        account_id: account.account_id,
        recording_enabled: data.recording_enabled === "true" ? 1 : 0,
        followme: data.followme === "true" ? true : false,
        status: data.status == true ? "active" : "inactive",
        // call_timeout: data.call_timeout !== null ? call_timeout : "",
        destination: destination
          .map((item) => {
            // Call checkPrevDestination with the current item
            const hasId = checkPrevDestination(item.id);

            if (item.destination.length > 0) {
              // Return the object with or without 'id' based on hasId
              return {
                destination: item.destination,
                delay_order: item.delay,
                // prompt: item.prompt,
                destination_timeout: item.timeOut,
                status: item.status,
                created_by: account.account_id,
                ...(hasId ? { id: item.id } : {}), // Conditionally add 'id' field
              };
            } else {
              return null;
            }
          })
          .filter((item) => item !== null),
      },
    };
    setLoading(true);
    const apiData = await generalPutFunction(`/ringgroup/${value}`, payLoad);
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
      setGetAllDataRefresh(getAllDataRefresh + 1);
      setSuccessMessage(apiData.message);
      dispatch({
        type: "SET_RINGGROUPREFRESH",
        ringGroupRefresh: ringGroupRefresh + 1,
      });
      navigate("/ring-groups");
    } else {
      setLoading(false);
      // const errorMessage = Object.keys(apiData.errors);
      // toast.error(apiData.errors[errorMessage[0]][0]);
    }
  });

  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setDestinationList(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleAddMusic = () => {
    setValue("ring_back", "");
    setShowMusic(true);
  };
  function truncateString(str) {
    if (str.length > 8) {
      return str.substring(0, 8) + "...";
    }
    return str; // Return the string as is if it's 8 characters or less
  }

  const handleCheckboxChange = (item) => {
    setBulkUploadSelectedAgents((prevSelected) => {
      if (prevSelected.some((agent) => agent.name === item.name)) {
        // If the item is already in the array, remove it
        return prevSelected.filter((agent) => agent.name !== item.name);
      } else {
        // Otherwise, add the item
        return [...prevSelected, item];
      }
    });
  };
  const filteredUsers = user?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user?.extension?.extension || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );
  const availableUsers = filteredUsers?.filter(
    (user) =>
      !destination.some(
        (agent) => user.extension.extension == agent.destination
      )
  );
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
          {/* <div id="subPageHeader">
            <div className="col-xl-9">
              <p className="mb-0">
                A ring group is a set of destinations that can be called with a
                ring strategy.
              </p>
            </div>
            <div className="col-xl-3 ps-2">
              <div className="d-flex align-items-center justify-content-end">
                <div className="d-flex align-items-center">
                  <div className="formLabel py-0 me-2">
                    <label htmlFor="selectFormRow">Enabled</label>
                  </div>
                  <div className="my-auto position-relative mx-1">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={watch().status}
                        {...register("status")}
                        id="showAllCheck"
                      />
                      <span className="slider round" />
                    </label>
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
                  <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                </button>
                <button
                  type="button"
                  effect="ripple"
                  className="panelButton"
                  onClick={handleFormSubmit}
                >
                  <span className="text">Save</span>
                  <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                </button>
              </div>
            </div>
          </div> */}
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
                        <h4>Ring Group Edit</h4>
                        <p>
                          A ring group is a set of destinations that can be
                          called with a ring strategy.
                        </p>
                      </div>
                      <div className="buttonGroup">
                        <div className="d-flex align-items-center">
                          <div className="formLabel py-0 me-2">
                            <label htmlFor="selectFormRow">Enabled</label>
                          </div>
                          <div className="my-auto position-relative mx-1">
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={watch().status}
                                {...register("status")}
                                id="showAllCheck"
                              />
                              <span className="slider round" />
                            </label>
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
                            <i class="fa-solid fa-caret-left"></i>
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
                            <i class="fa-solid fa-floppy-disk"></i>
                          </span>
                        </button>
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
                        <label htmlFor="">Extension</label>
                        <label htmlFor="data" className="formItemDesc">
                          Enter a name.
                        </label>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("extension")}
                          disabled
                        />
                        {errors.extension && (
                          <ErrorMessage text={errors.extension.message} />
                        )}
                      </div>
                    </div>
                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Extension</label>
                </div>
                <div className="col-12">
                  <Controller
                    name="extension"
                    control={control}
                    defaultValue=""
                    rules={{ ...requiredValidator, ...numberValidator }}
                    render={({ field: { onChange, value, ...field } }) => {
                      const options = allUser
                        ? allUser.map((item) => ({
                            value: item.extension.extension,
                            label: `${item.name} (${item.extension.extension})`,
                          }))
                        : [];
                      const selectedOption =
                        options.find((option) => option.value === value) ||
                        null;
                      return (
                        <Select
                          {...field}
                          value={selectedOption}
                          onChange={(selectedOption) => {
                            onChange(selectedOption.value);
                            handleExtensionChange(selectedOption);
                          }}
                          options={options}
                          styles={customStyles}
                        />
                      );
                    }}
                  />
                  {errors.extension && (
                    <ErrorMessage text={errors.extension.message} />
                  )}
                  <label htmlFor="data" className="formItemDesc">
                    Enter the extension number.
                  </label>
                </div>
              </div> */}
                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Follow Me</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    {...register("followme")}
                    id="selectFormRow"
                  >
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Choose to follow a ring group destination's follow me.
                  </label>
                </div>
              </div> */}
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
                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Timeout Destination</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    {...register("timeout_destination", {
                      ...requiredValidator,
                    })}
                    id="selectFormRow"
                  >
                    <option value=""></option>
                    {extensions &&
                      extensions.map((item) => {
                        return (
                          <option value={item.extension}>
                            {item.extension}
                          </option>
                        );
                      })}
                  </select>{" "}
                  {errors.timeout_destination && (
                    <ErrorMessage text={errors.timeout_destination.message} />
                  )}
                  <label htmlFor="data" className="formItemDesc">
                    Select the timeout destination for this ring group.
                  </label>
                </div>
              </div> */}
                    {/* <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Timeout Destination</label>
                        <label htmlFor="data" className="formItemDesc">
                          Select the timeout destination for this ring group.
                        </label>
                      </div>
                      <div className="col-6">
                        <ActionList
                          title={null}
                          label={null}
                          getDropdownValue={actionListValue}
                          value={watch().timeout_destination}
                        />
                      </div>
                    </div> */}
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
                            className={`col-${showTimeoutDestinationToggle ? "5" : "12"
                              }`}
                          >
                            <select
                              className="formItem"
                              // onChange={(e) => {
                              //   if (e.target.value == "Extension") {
                              //     setTimeoutDestPstnToggle(false);
                              //     setShowTimeoutDestinationToggle(true);
                              //     if (watch().call_timeout == "") {
                              //       setValue("call_timeout", `${60}`);
                              //     }
                              //     setValue("timeout_destination", "");
                              //   } else if (e.target.value == "PSTN") {
                              //     setTimeoutDestPstnToggle(true);
                              //     setShowTimeoutDestinationToggle(true);
                              //     if (watch().call_timeout == "") {
                              //       setValue("call_timeout", `${60}`);
                              //     }
                              //     setValue("timeout_destination", "");
                              //   } else if (e.target.value == "Disabled") {
                              //     setTimeoutDestPstnToggle(true);
                              //     setShowTimeoutDestinationToggle(false);
                              //     setValue("timeout_destination", "");
                              //   }
                              // }}
                              // {...register("destination_type")}
                              {...register("destination_type", {
                                onChange: (e) => {
                                  const value = e.target.value;

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
                            <div className="col-7">
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
                        <label htmlFor="">Call Timeout</label>
                      </div>
                      <div className="col-6">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          {...register("call_timeout", {
                            ...noSpecialCharactersValidator,
                            ...(watch("call_timeout") !== "" &&
                              minValidator(
                                destination.reduce(
                                  (max, obj) => Math.max(max, obj.delay),
                                  0
                                )
                              )),
                          })}
                          onKeyDown={restrictToNumbers}
                        // {...register("call_timeout", {
                        //   ...requiredValidator,
                        //   ...noSpecialCharactersValidator,
                        //   ...minValidator(
                        //     destination.reduce(
                        //       (max, obj) => Math.max(max, obj.delay),
                        //       0
                        //     )
                        //   ),
                        // })}
                        />
                        {errors.call_timeout && (
                          <ErrorMessage text={errors.call_timeout.message} />
                        )}
                      </div>
                    </div>
                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Distinctive Ring</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("distinctive_ring", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.distinctive_ring && (
                    <ErrorMessage text={errors.distinctive_ring.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select a sound for a distinctive ring.
                  </label>
                </div>
              </div> */}
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
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (selectedValue === "add-music") {
                              handleAddMusic(); // Call your function here
                            }
                          }}
                        >
                          <option value="null">None</option>
                          {/* <option>us-ring</option>
                    <option value="uk-ring">uk-ring</option>
                    <option value="eu-ring">eu-ring</option> */}
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
                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">User List</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    {...register("user")}
                    id="selectFormRow"
                  >
                    <option>Select User</option>
                    {users &&
                      users.map((item) => {
                        return (
                          <option value={item.username}>{item.username}</option>
                        );
                      })}
                  </select>
                  {errors.user && <ErrorMessage text={errors.user.message} />}
                  <label htmlFor="data" className="formItemDesc">
                    Define users assigned to this ring group.
                  </label>
                </div>
              </div> */}

                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Missed Call</label>
                </div>
                <div className="row">
                  <div className="col-4 pe-1">
                    <select
                      className="formItem"
                      style={{ width: "100%" }}
                      name=""
                      id="selectFormRow"
                      {...register("missed_call")}
                    >
                      <option value="">Disabled</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                  <div className="col-8 ps-1">
                    {watch().missed_call === "email" && (
                      <div>
                        <input
                          className="col-12 formItem"
                          {...register("email", {
                            ...requiredValidator,
                            ...emailValidator,
                          })}
                        />
                        {errors.email && (
                          <ErrorMessage text={errors.email.message} />
                        )}
                      </div>
                    )}
                  </div>
                  <label htmlFor="data" className="formItemDesc">
                    Select the notification type, and enter the appropriate
                    destination.
                  </label>
                </div>
              </div> */}
                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Ring Group Forward</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem col-xl-3"
                    {...register("ring_group_forward", {
                      ...requiredValidator,
                    })}
                    id="selectFormRow"
                    style={{ width: "85px" }}
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                  {watch().ring_group_forward == "true" && (
                    <div className="d-flex flex-column">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        {...register("ring_group_forward_destination", {
                          ...requiredValidator,
                          ...numberValidator,
                          ...noSpecialCharactersValidator,
                        })}
                        placeholder="Number"
                        style={{ width: "60%" }}
                      />
                      {errors.ring_group_forward_destination && (
                        <ErrorMessage
                          text={errors.ring_group_forward_destination.message}
                        />
                      )}
                    </div>
                  )}
                  <label htmlFor="data" className="formItemDesc">
                    Forward a called Ring Group to an alternate destination.
                  </label>
                </div>
              </div> */}
                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Forward Toll Allow</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("toll_allow", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.toll_allow && (
                    <ErrorMessage text={errors.toll_allow.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Ring group forwarding toll allow.
                  </label>
                </div>
              </div> */}
                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Context</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("context", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.context && (
                    <ErrorMessage text={errors.context.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the context.
                  </label>
                </div>
              </div> */}
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

                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Greeting</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("greeting", {
                      ...noSpecialCharactersValidator,
                    })}
                  />
                  {errors.greeting && (
                    <ErrorMessage text={errors.greeting.message} />
                  )}
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the Greeting.
                  </label>
                </div>
              </div> */}
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Recording</label>
                      </div>
                      <div className="col-6">
                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          // value={watch().recording_enabled}
                          {...register("recording_enabled")}
                          id="selectFormRow"
                          name="recording_enabled"
                          defaultValue={"false"}
                        >
                          <option className="status" value="true">
                            True
                          </option>
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
                    {/* <div className="formRow  col-xl-3">
                <div className="d-flex flex-wrap align-items-center">
                  <div className="formLabel">
                    <label htmlFor="selectFormRow">Enabled</label>
                  </div>
                  <div className="col-12">
                    <div className="my-auto position-relative mx-1">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={watch().status}
                          {...register("status")}
                          id="showAllCheck"
                        />
                        <span className="slider round" />
                      </label>
                    </div>
                  </div>
                </div>
                <label htmlFor="data" className="formItemDesc">
                  Set the status of this ring group.
                </label>
              </div> */}
                  </form>
                </div>
                <div className="col-12">
                  <div className="heading bg-transparent border-bottom-0">
                    <div class="content">
                      <h4>List of Agents</h4>
                      <p>You can see the list of agents in this ring group.</p>
                    </div>
                    <div className="d-flex">
                      {selectedAgentToEdit.length > 0 &&
                        selectedAgentToEdit.length != destination.length ? (
                        <button
                          type="button"
                          class="panelButton ms-auto"
                          onClick={() => {
                            setBulkEditPopup(true);
                          }}
                        >
                          <span class="text">Edit</span>
                          <span class="icon">
                            <i class="fa-solid fa-pen"></i>
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          class="panelButton ms-auto"
                          onClick={() => {
                            setSelectedAgentToEdit(destination);
                            setBulkEditPopup(true);
                          }}
                        >
                          <span class="text">Edit All</span>
                          <span class="icon">
                            <i class="fa-solid fa-pen"></i>
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => setBulkAddPopUp(true)}
                        className="panelButton"
                      >
                        <span className="text">Add</span>
                        <span className="icon">
                          <i class="fa-solid fa-plus"></i>
                        </span>
                      </button>
                    </div>
                  </div>
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
                                  : { width: 30 }
                              }
                            >
                              <div>
                                <input
                                  type="checkbox"
                                  onChange={() => handleSelectUserToEdit(item)}
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
                              {/* <div className="position-relative">
                          <input
                            type="text"
                            name="destination"
                            className="formItem"
                            value={item.destination}
                            onChange={(e) => handleDestinationChange(index, e)}
                            placeholder="Destination"
                          />
                          {destinationList && destinationId === index ? (
                            <div
                              ref={divRef}
                              className="formCustomAutoComplete"
                            >
                              <ul>
                                {filterExtension &&
                                  filterExtension.map((item) => {
                                    return (
                                      <li
                                        value={item.extension}
                                        onClick={(e) => {
                                          handlelistClick(
                                            index,
                                            item.extension
                                          );
                                          setDestinationList(false);
                                        }}
                                      >
                                        {item.extension}
                                      </li>
                                    );
                                  })}
                                <Link
                                  to="/users-add"
                                  className="text-center border bg-info-subtle fs-6 fw-bold text-info"
                                >
                                  Add User
                                </Link>
                              </ul>
                            </div>
                          ) : (
                            ""
                          )}
                        </div> */}
                              <div className="position-relative">
                                <select
                                  type="text"
                                  name="destination"
                                  value={item.destination}
                                  disabled
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
                                  {/* {user &&
                              user.map((item) => {
                                return (
                                  <option
                                    value={item.extension?.extension}
                                    key={item.id}
                                  >
                                    {item.username}({item.extension?.extension})
                                  </option>
                                );
                              })} */}
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
                                              ? `${truncateString(
                                                item?.alias
                                              )} - ${item.extension?.extension
                                              }`
                                              : `${truncateString(
                                                item?.name
                                              )} - ${item.extension?.extension
                                              }`}
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
                            {/* <div className="col-2 pe-2">
                        {index === 0 ? (
                          <div className="formLabel">
                            <label htmlFor="">Prompt</label>
                          </div>
                        ) : (
                          ""
                        )}
                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          value={item.prompt}
                          onChange={(e) => handleDestinationChange(index, e)}
                          id="selectFormRow"
                          name="prompt"
                        >
                          <option className="status">Prompt</option>
                          <option value="confirm">Confirm</option>
                        </select>
                      </div> */}
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
                                className={`col-auto h-100 m${index === 0 ? "t" : "y"
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
                            {/* {index === 0 ? (
                              <div className="mt-auto">
                                <button
                                  onClick={() => addNewDestination()}
                                  className="panelButton mb-auto"
                                  effect="ripple"
                                  type="button"
                                >
                                  <span className="text">Add</span>
                                  <span className="icon">
                                    <i class="fa-solid fa-plus"></i>
                                  </span>
                                </button>
                              </div>
                            ) : (
                              ""
                            )} */}
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
        <div className="addNewContactPopup">
          <div className="row">
            <div className="col-12 heading mb-0">
              <i className="fa-light fa-user-plus" />
              <h5>Add People to the selected Ring Group</h5>
              {/* <p>
                Add people to yourqueue effortlessly, keeping your connections
                organized and efficient
              </p> */}
              {/* <div className="border-bottom col-12" /> */}
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
                  className="tableButton ms-2"
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
                    {/* {user
                    .filter(
                      (user) =>
                        // Filter logic: checks name or extension against search query
                        user.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        (user?.extension?.extension || "")
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )

                    .filter(
                      (user) =>
                        !destination.some(
                          (agent) =>
                            user.extension.extension == agent.destination
                        )
                    )
                    .map((item, index) => {
                      return (
                        <div key={index}>
                          <div className="row g-2">
                            <div className="col-2">
                              <span>{index + 1}</span>
                            </div>
                            <div className="col-5">
                              <span>{item.name}</span>
                            </div>
                            <div className="col-2">
                              <span>{item.extension.extension}</span>
                            </div>
                            <div className="col-3">
                              <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange(item)} // Call handler on change
                                checked={bulkUploadSelectedAgents.some(
                                  (agent) => agent.name === item.name
                                )} // Keep checkbox state in sync
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })} */}
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
                          )
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
                    <i class="fa-light fa-xmark"></i>
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
              Affected user:{" "}
              {selectedAgentToEdit
                .map((item) => destination.find((user) => item.id == user.id))
                .map((items) => items.destination)
                .join(", ")}
            </div>
            <div className="col-xl-12">
              <div className="col-12 d-flex justify-content-between align-items-center"></div>
            </div>
            <div className="mt-3 d-flex">
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

export default RingGroupEdit;
