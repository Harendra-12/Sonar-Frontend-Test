import React, { useEffect, useRef, useState } from "react";
// import { Link } from 'react-router-dom'
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import {
  emailValidator,
  lengthValidator,
  minValidator,
  nameNumberValidator,
  nameValidator,
  noSpecialCharactersValidator,
  numberValidator,
  requiredValidator,
  restrictToAllowedChars,
  restrictToNumbers,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import CircularLoader from "../../Loader/CircularLoader";
import Header from "../../CommonComponents/Header";
import ActionList from "../../CommonComponents/ActionList";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import AddMusic from "../../CommonComponents/AddMusic";

const RingGroupAdd = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const [extensions, setExtensions] = useState();
  const [users, setUsers] = useState();
  const [destinationList, setDestinationList] = useState(false);
  const [loading, setLoading] = useState(true);
  const [destinationId, setDestinationId] = useState();
  const [filterExtension, setFilterExtension] = useState();
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  // const [allUser, setAllUser] = useState();
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const allUserArr = useSelector((state) => state.allUser);
  const [ringBack, setRingBack] = useState();
  const [user, setUser] = useState();
  const extension = useSelector((state) => state.extension);
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const [timeoutDestPstnToggle, setTimeoutDestPstnToggle] = useState(false);
  // const [popUp, setPopUp] = useState(true);
  const [showMusic, setShowMusic] = useState(false);
  const [uploadedMusic, setUploadedMusic] = useState();
  const [musicRefresh, setMusicRefresh] = useState(0);
  const [showTimeoutDestinationToggle, setShowTimeoutDestinationToggle] =
    useState(false);
  const [bulkAddPopUp, setBulkAddPopUp] = useState(false);
  const [bulkUploadSelectedAgents, setBulkUploadSelectedAgents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const {
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      status: true, // Set the default value for "status" to true
      timeout_destination: "",
      call_timeout: `${160}`,
    },
  });
  useEffect(() => {
    if (account && account.id) {
      async function getData() {
        // const apiData = await generalGetFunction(
        //   `/extension/search?account=${account.account_id}`
        // );
        setLoading(true);
        const apidataUser = await generalGetFunction(
          `/user/search?account=${account.account_id}`
        );
        const ringBack = await generalGetFunction("/sound/all?type=ringback");
        setLoading(false);
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
  console.log(watch());
  // Get all users with valid extension
  useEffect(() => {
    if (allUserRefresh > 0) {
      const filterUser = allUserArr.data.filter(
        (item) => item.extension_id !== null
      );
      if (filterUser.length > 0) {
        // setAllUser(filterUser);
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
  }, [allUserArr, extension]);

  // Handle destination
  const [destination, setDestination] = useState([
    // {
    //   id: Math.floor(Math.random() * 10000),
    //   destination: "",
    //   delay: 0,
    //   timeOut: "30",
    //   // prompt: "",
    //   status: "active",
    // },
    // {
    //   id: 2,
    //   destination: "",
    //   delay: 0,
    //   timeOut: "30",
    //   prompt: "",
    //   status: "inactive",
    // },
    // {
    //   id: 3,
    //   destination: "",
    //   delay: 0,
    //   timeOut: "30",
    //   prompt: "",
    //   status: "inactive",
    // },
    // {
    //   id: 4,
    //   destination: "",
    //   delay: 0,
    //   timeOut: "30",
    //   prompt: "",
    //   status: "inactive",
    // },
  ]);

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
  // if (destination.length === 0) {
  //   addNewDestination();
  // }

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

  // Function to add a new destination field
  const addNewDestination = () => {
    setDestination([
      ...destination,
      {
        // id: destination.length + 1,
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
  const deleteDestination = (id) => {
    const updatedDestination = destination.filter((item) => item.id !== id);
    setDestination(updatedDestination);
    if (destinationValidation) {
      clearErrors("destinations");
    }
  };

  const destinationValidation = () => {
    const allFilled = destination.every(
      (item) => item.destination.trim() !== ""
    );
    return allFilled;
  };

  const handleExtensionChange = (selectedOption) => {
    setValue("extension", selectedOption.value);
  };

  const actionListValue = (value) => {
    setValue("timeout_destination", value[0]);
  };

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // border: '1px solid var(--color4)',
      border: "1px solid #ababab",
      borderRadius: "2px",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      minHeight: "32px",
      height: "32px",
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: "none",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "32px",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
    }),
    indicatorSeparator: (provided) => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "32px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#202020",
      "&:hover": {
        color: "#202020",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      paddingLeft: "15px",
      paddingTop: 0,
      paddingBottom: 0,
      // backgroundColor: state.isSelected ? "transparent" : "transparent",
      "&:hover": {
        backgroundColor: "#0055cc",
        color: "#fff",
      },
      fontSize: "14px",
    }),
    menu: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
      maxHeight: "150px",
      overflowY: "auto",
    }),
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
    if (data.timeout_destination != "" && !data.call_timeout) {
      toast.error("Please Mention call timeout for timeout destination");
      return;
    }
    setLoading(true);
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
                delay_order: item.delay,
                // prompt: item.prompt,
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
          // id: 1,
          id: Math.floor(Math.random() * 10000),
          destination: "",
          delay: 0,
          timeOut: "30",
          // prompt: "",
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
    console.log(item, bulkUploadSelectedAgents);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
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
  console.log(destination, user, availableUsers, bulkUploadSelectedAgents);
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

                    {/* <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Extension</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("extension", {
                      ...requiredValidator,
                      ...lengthValidator(3, 25),
                    })}
                  />
                  {errors.extension && <ErrorMessage text={errors.extension.message} />}
                  <label htmlFor="data" className="formItemDesc">
                    Enter a extension.
                  </label>
                </div>
              </div> */}

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
                    {...register("followme", { ...requiredValidator })}
                    defaultValue={false}
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
                    defaultValue={""}
                    {...register("timeout_destination", {
                      ...requiredValidator,
                    })}
                    id="selectFormRow"
                  >
                    <option value="" disabled>
                      Select
                    </option>
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
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label>Timeout Destination</label>
                        <label className="formItemDesc">
                          Select the timeout destination for this ring group.
                        </label>
                      </div>
                      <div className="col-6">
                        <div className="row">
                          <div className="col-5">
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
                                disabled
                                placeholder="None"
                                className="formItem"
                                {...register("timeout_destination", {
                                  ...numberValidator,
                                })}
                              ></input>
                            )}
                          </div>
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
                          // defaultValue={"null"}
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
                    defaultValue={""}
                    id="selectFormRow"
                  >
                    <option value="" disabled>
                      Select User
                    </option>
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
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Call Forward </label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    {...register("callForward", { ...requiredValidator })}
                    id="selectFormRow"
                  >
                    <option value="false">False</option>
                    <option value="true">True</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Choose to follow a ring group destination's call forward.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
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
              </div>
              <div className="formRow col-xl-3">
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
                    <option value="false">Disabled</option>
                    <option value="true">Enabled</option>
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

                  <br />
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
              </div>
              <div className="formRow col-xl-3">
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
                  <div class="heading bg-transparent border-bottom-0">
                    <div class="content">
                      <h4>List of Agents</h4>
                      <p>You can see the list of agents in this ring group.</p>
                    </div>
                    <div class="buttonGroup">
                      <button
                        type="button"
                        class="panelButton"
                        onClick={() => {
                          if (user.length !== destination.length)
                            setBulkAddPopUp(true);
                          else toast.warn("All agent selected");
                        }}
                      >
                        <span class="text">Add</span>
                        <span class="icon">
                          <i class="fa-solid fa-plus"></i>
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
                                className="formLabel pe-2"
                                style={
                                  index === 0
                                    ? { marginTop: 32, width: 30 }
                                    : { width: 30 }
                                }
                              >
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
                                                ? truncateString(item?.alias)
                                                : truncateString(item?.name)}
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
                                  className={`me-2 h-100 m${
                                    index === 0 ? "t" : "y"
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
                  )}
                </div>
              </div>
            </div>
          )}
        </>
        {/* {popUp ? (
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
                    <p>
                      No Extension is currently asigned! Please add an extension
                      first!
                    </p>
                    <button
                      className="panelButton m-0"
                      onClick={() => {
                        // setForce(true);
                        setPopUp(false);
                        navigate("/extensions-add");
                      }}
                    >
                      Lets Go!
                    </button>
                    <button
                      className="panelButtonWhite m-0 float-end"
                      onClick={() => setPopUp(false)}
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
        )} */}
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
    </main>
  );
};

export default RingGroupAdd;
