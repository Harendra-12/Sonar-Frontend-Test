import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPutFunction,
} from "../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../Loader/CircularLoader";
import { useForm } from "react-hook-form";
import { requiredValidator } from "../validations/validation";
import ErrorMessage from "../CommonComponents/ErrorMessage";
import Header from "../CommonComponents/Header";

const RingGroupSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const [extensions, setExtensions] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);
  const queryParams = new URLSearchParams(useLocation().search);
  const value = queryParams.get("id");
  const [successMessage, setSuccessMessage] = useState("");
  const [toastAfterSaveCounter, settoastAfterSaveCounter] = useState(0);
  const [prevDestinations, setprevDestinations] = useState([]);
  const [destinationList, setDestinationList] = useState(false);
  const [allUser, setAllUser] = useState();
  const [getAllDataRefresh, setGetAllDataRefresh] = useState(0);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const allUserArr = useSelector((state) => state.allUser);
  const {
    register,
    watch,
    setError,
    formState: { errors },
    handleSubmit,
    clearErrors,
    reset,
    setValue,
    control,
  } = useForm();

  const [destination, setDestination] = useState([
    {
      id: 1,
      destination: "",
      delay: 0,
      timeOut: "30",
      prompt: "",
      status: "inactive",
    },
  ]);

  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setSuccessMessage("");
    }
  }, [toastAfterSaveCounter]);

  useEffect(() => {
    if (account && account.id) {
      setLoading(true);
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
  
          const { ring_group_destination, followme, status, name } = editData; // Add 'name' here
          setprevDestinations(ring_group_destination);
          if (ring_group_destination.length > 0) {
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
          }
  
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
          
          // Manually set 'name' if needed
          setValue('name', name || ''); 
  
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

  const handleExtensionChange = (selectedOption) => {
    setValue("extension", selectedOption.value);
  };

  const checkPrevDestination = (id) => {
    const result = prevDestinations.filter((item) => item.id === id);
    return result.length > 0;
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
  }

  const destinationValidation = () => {
    return destination.every((item) => item.destination.trim() !== "");
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    if (!destinationValidation()) {
      setError("destinations", {
        type: "manual",
        message: "All fields are required",
      });
      return;
    }

    const updatedData = Object.keys(data).reduce((acc, key) => {
      if (data[key] !== initialData[key]) {
        acc[key] = data[key];
      }
      return acc;
    }, {});

    const payLoad = {
      ...updatedData,
      account_id: account.account_id,
      followme: data.followme === "true",
      status: data.status ? "active" : "inactive",
      destination: destination
        .map((item) => {
          const hasId = checkPrevDestination(item.id);

          if (item.destination.length > 0) {
            return {
              destination: item.destination,
              delay_order: item.delay,
              prompt: item.prompt,
              destination_timeout: item.timeOut,
              status: item.status,
              created_by: account.account_id,
              ...(hasId ? { id: item.id } : {}),
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null),
    };

    setLoading(true);
    const apiData = await generalPutFunction(`/ringgroup/${value}`, payLoad);
    if (apiData.status) {
      setLoading(false);
      setGetAllDataRefresh(getAllDataRefresh + 1);
      setSuccessMessage(apiData.message);
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
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Ring Group Edit" />
            <div className="row justify-content-center" id="subPageHeader">
              <div className="col-xl-9 my-auto">
                <p className="pt-2 mt-1 mb-0">
                  A ring group is a set of destinations that can be called with
                  a ring strategy.
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
            {loading && (
              <div colSpan={99}>
                <CircularLoader />
              </div>
            )}
            <div className="mx-2" style={{ width: "98%", margin: "0 auto" }}>
              <form onSubmit={handleFormSubmit} id="ringGroupForm">
              <form className="row">
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="selectFormRow">
                        Follow Me
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label htmlFor="">Status</label>
                      </div>
                      <select
                        className="formItem me-0"
                        style={{ width: "100%" }}
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
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="selectFormRow">
                        Strategy
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <select
                        className="formItem me-0"
                        style={{ width: "100%" }}
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
                </div>
                <div />
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="selectFormRow">
                        Ring Back
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label htmlFor="">Status</label>
                      </div>
                      <select
                        className="formItem me-0"
                        style={{ width: "100%" }}
                        {...register("ring_back", { ...requiredValidator })}
                        id="selectFormRow"
                      >
                        <option>us-ring</option>
                        <option value="uk-ring">uk-ring</option>
                        <option value="eu-ring">eu-ring</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Defines what the caller will hear while the destination
                        is being called.
                      </label>
                    </div>
                  </div>
                </div>
                <div className="formRow col-xl-12 px-xl-4">
                  <div className="col-12 d-flex justify-content-start">
                    <div className="formLabel pe-2 col-2">
                      <label className="text-dark" htmlFor="selectFormRow">
                        User List
                      </label>
                    </div>
                    <div className="col-2 pe-2">
                      <div className="formLabel">
                        <label htmlFor="">Status</label>
                      </div>
                      <select
                        className="formItem me-0"
                        style={{ width: "100%" }}
                        {...register("user")}
                        id="selectFormRow"
                      >
                        <option>Select User</option>
                        {users &&
                          users.map((item) => {
                            return (
                              <option value={item.username}>
                                {item.username}
                              </option>
                            );
                          })}
                      </select>
                      {errors.user && (
                        <ErrorMessage text={errors.user.message} />
                      )}
                      <label htmlFor="data" className="formItemDesc">
                        Define users assigned to this ring group.
                      </label>
                    </div>
                  </div>
                </div>
              </form>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default RingGroupSettings;
