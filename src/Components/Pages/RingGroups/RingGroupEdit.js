import React, { useEffect, useRef, useState } from "react";
// import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Loader/CircularLoader";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import {
  emailValidator,
  lengthValidator,
  nameValidator,
  numberValidator,
  requiredValidator,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";

const RingGroupEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const [extensions, setExtensions] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");
  const [destinationList, setDestinationList] = useState(false);
  const [destinationId, setDestinationId] = useState();
  const [filterExtension, setFilterExtension] = useState();
  const [allUser, setAllUser] = useState();
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const allUserArr = useSelector((state) => state.allUser);
  const {
    register,
    watch,
    setError,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    control,
  } = useForm();

  // Handle destination
  const [destination, setDestination] = useState([
    {
      id: 1,
      destination: "",
      delay: 0,
      timeOut: "30",
      prompt: "",
      status: "inactive",
    },
    {
      id: 2,
      destination: "",
      delay: 0,
      timeOut: "30",
      prompt: "",
      status: "inactive",
    },
    {
      id: 3,
      destination: "",
      delay: 0,
      timeOut: "30",
      prompt: "",
      status: "inactive",
    },
    {
      id: 4,
      destination: "",
      delay: 0,
      timeOut: "30",
      prompt: "",
      status: "inactive",
    },
  ]);
  useEffect(() => {
    if (account && account.id) {
      async function getData() {
        const ringData = await generalGetFunction(`/ringgroup/${value}`);
        const apiData = await generalGetFunction(
          `/extension/search?account=${account.account_id}`
        );
        const apidataUser = await generalGetFunction(
          `/user/search?account=${account.account_id}`
        );

        if (apiData.status) {
          setExtensions(apiData.data);
        } else {
          navigate("/");
        }
        if (apidataUser.status) {
          setUsers(apidataUser.data);
        } else {
          navigate("/");
        }

        if (ringData.status) {
          setLoading(false);

          let editData = ringData.data[0];

          const { ring_group_destination, followme, status } = editData;
          setDestination(
            ring_group_destination.map((item) => {
              return {
                destination: item.destination,
                delay: item.delay_order,
                prompt: item.prompt,
                timeOut: item.destination_timeout,
                status: item.status,
                id: item.id,
              };
            })
          );

          delete editData.ring_group_destination;
          delete editData.ring_group_timeout_app;
          delete editData.ring_group_timeout_data;

          const updatedEditData = {
            ...editData,
            ...{
              followme: followme == 1 ? true : false,
              status: status == "active" ? true : false,
            },
          };

          reset(updatedEditData);
        } else {
          setLoading(false);
          navigate("/");
        }
      }
      getData();
    } else {
      navigate("/");
    }
  }, [account, navigate, value]);

  // Get all users with valid extension
  useEffect(() => {
    if (allUserRefresh > 1) {
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
  }, [allUserArr]);

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

  // Function to handle changes in destination fields
  const handleDestinationChange = (index, event) => {
    const { name, value } = event.target;
    if (name === "destination") {
      setDestinationList(true);
      setFilterExtension(
        extensions.filter((item) => item.extension.includes(value))
      );
    }
    setDestinationId(index);
    const newDestination = [...destination];
    newDestination[index][name] = value;
    setDestination(newDestination);
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
        id: destination.length + 10000,
        destination: "",
        delay: 0,
        timeOut: "30",
        prompt: "",
        status: "inactive",
      },
    ]);
  };

  // Function to delete a destination
  async function deleteStudent(id) {
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
    const payLoad = {
      ...data,
      ...{
        account_id: account.account_id,
        followme: data.followme == "true" ? true : false,
        status: data.status == true ? "active" : "inactive",
        ring_group_destination: destination,
      },
    };
    setLoading(true);
    const apiData = await generalPutFunction(`/ringgroup/${value}`, payLoad);
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
    } else {
      setLoading(false);
      const errorMessage = Object.keys(apiData.errors);
      toast.error(apiData.errors[errorMessage[0]][0]);
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

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <div className="row justify-content-center" id="subPageHeader">
            <div className="col-xl-9 my-auto">
              <h4 className="my-auto">Ring Group Edit</h4>
              <p className="pt-2 mt-1 mb-0">
                A ring group is a set of destinations that can be called with a
                ring strategy.
              </p>
            </div>
            <div className="col-xl-3 ps-2">
              <div className="d-flex justify-content-end">
                <button
                  onClick={() => {
                    navigate(-1);
                    backToTop();
                  }}
                  type="button"
                  effect="ripple"
                  className="panelButton"
                  // onClick={() => { window.location = "/ring-groups" }}
                >
                  Back
                </button>
                <button
                  type="button"
                  effect="ripple"
                  className="panelButton"
                  onClick={handleFormSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-12" style={{ overflow: "auto" }}>
          {loading ? (
            <div colSpan={99}>
              <CircularLoader />
            </div>
          ) : (
            ""
          )}
          <div className="mx-2" id="detailsContent">
            <form className="row">
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Name</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("name", {
                      ...requiredValidator,
                      ...nameValidator,
                    })}
                  />
                  {errors.name && <ErrorMessage text={errors.name.message} />}
                  <label htmlFor="data" className="formItemDesc">
                    Enter a name.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
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
              </div>
              <div className="formRow col-xl-3">
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
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Strategy</label>
                </div>
                <div className="col-12">
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
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select the ring strategy.
                  </label>
                </div>
              </div>
              <div />
              <div className="formRow col-xl-10">
                {destination.map((item, index) => {
                  return (
                    <div className="col-12 d-flex justify-content-start">
                      <div
                        className="formLabel pe-2"
                        style={index === 0 ? { marginTop: 36 } : {}}
                      >
                        <label>{index + 1}.</label>
                      </div>
                      <div className="col-3 pe-2">
                        {index === 0 ? (
                          <div className="formLabel">
                            <label htmlFor="">Destinations</label>
                          </div>
                        ) : (
                          ""
                        )}
                        <div className="position-relative">
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
                              </ul>
                            </div>
                          ) : (
                            ""
                          )}
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
                          onChange={(e) => handleDestinationChange(index, e)}
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
                          onChange={(e) => handleDestinationChange(index, e)}
                          id="selectFormRow"
                          name="status"
                        >
                          <option className="status" value="active">
                            True
                          </option>
                          <option value="inactive">False</option>
                        </select>
                      </div>
                      {index === 0 ? (
                        ""
                      ) : (
                        <div className="col-auto h-100 my-auto">
                          <button
                            type="button"
                            onClick={() => deleteStudent(item.id)}
                            className="clearButton text-danger"
                          >
                            <i className="fa-duotone fa-trash"></i>
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
              <div className="formRow col-xl-2">
                <div className="formLabel d-none d-xl-block">
                  <label htmlFor=""></label>
                </div>
                <button
                  onClick={() => addNewDestination()}
                  className="panelButton ms-xl-5"
                  effect="ripple"
                  type="button"
                >
                  <i className="fa-duotone fa-circle-plus me-2"></i>Add More
                </button>
              </div>
              <div />
              <div className="formRow col-xl-3">
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
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Call Timeout</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("call_timeout", { ...requiredValidator })}
                  />
                  {errors.call_timeout && (
                    <ErrorMessage text={errors.call_timeout.message} />
                  )}
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="">Distinctive Ring</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("distinctive_ring")}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Select a sound for a distinctive ring.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Ring Back</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    {...register("ring_back", { ...requiredValidator })}
                    id="selectFormRow"
                  >
                    <option>us-ring</option>
                    <option value="uk-ring">uk-ring</option>
                    <option value="eu-ring">eu-ring</option>
                  </select>
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Defines what the caller will hear while the destination is
                    being called.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">User List</label>
                </div>
                <div className="col-12">
                  <select
                    className="formItem"
                    {...register("user", { ...requiredValidator })}
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
                      {...register("missed_call", { ...requiredValidator })}
                    >
                      <option value=""></option>
                      <option value="email">Email</option>
                    </select>
                    {errors.missed_call && (
                      <ErrorMessage text={errors.missed_call.message} />
                    )}
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
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Forward Toll Allow</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("toll_allow")}
                  />
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
                    {...register("context")}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the context.
                  </label>
                </div>
              </div>
              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Description</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("description")}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the description.
                  </label>
                </div>
              </div>

              <div className="formRow col-xl-3">
                <div className="formLabel">
                  <label htmlFor="selectFormRow">Greeting</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("greeting")}
                  />
                  <br />
                  <label htmlFor="data" className="formItemDesc">
                    Enter the Greeting.
                  </label>
                </div>
              </div>
              <div className="formRow  col-xl-3">
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
              </div>
            </form>
          </div>
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
};

export default RingGroupEdit;
