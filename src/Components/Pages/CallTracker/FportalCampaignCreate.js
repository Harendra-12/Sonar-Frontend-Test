import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";
import { backToTop, generalGetFunction, generalPostFunction, useDebounce } from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";
import { rangeValidator, requiredValidator } from "../../validations/validation";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import Tippy from "@tippyjs/react";
import { useSelector } from "react-redux";
import AddMusic from "../../CommonComponents/AddMusic";

function FportalCampaignCreate() {
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const account = state?.account;
  const [loading, setLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState([]);
  const [did, setDid] = useState([]);
  const [isActiveHour, setIsActiveHour] = useState(false);
  const [allBuyersNumbers, setAllBuyersNumbers] = useState([])
  const [originalAllNumber, setOriginalAllNumber] = useState([])
  const [allBuyers, setAllBuyers] = useState([]);
  const [allTrunk, setAllTrunk] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [holdMusic, setHoldMusic] = useState()
  const [showMusic, setShowMusic] = useState(false);
  const [uploadedMusic, setUploadedMusic] = useState();
  const [musicRefresh, setMusicRefresh] = useState(0);
  const [schedulerInfo, setSchedulerInfo] = useState([
    {
      name: 'Sunday',
      recurring_day: 'Sunday',
      status: false,
      start_time: '',
      end_time: '',
      full_day: false,
    },
    {
      name: 'Monday',
      recurring_day: 'Monday',
      status: false,
      start_time: '',
      end_time: '',
      full_day: false,
    },
    {
      name: 'Tuesday',
      recurring_day: 'Tuesday',
      status: false,
      start_time: '',
      end_time: '',
      full_day: false,
    },
    {
      name: 'Wednesday',
      recurring_day: 'Wednesday',
      status: false,
      start_time: '',
      end_time: '',
      full_day: false,
    },
    {
      name: 'Thursday',
      recurring_day: 'Thursday',
      status: false,
      start_time: '',
      end_time: '',
      full_day: false,
    },
    {
      name: 'Friday',
      recurring_day: 'Friday',
      status: false,
      start_time: '',
      end_time: '',
      full_day: false,
    },
    {
      name: 'Saturday',
      recurring_day: 'Saturday',
      status: false,
      start_time: '',
      end_time: '',
      full_day: false,
    },
  ]);

  const [bulkAddPopUp, setBulkAddPopUp] = useState(false);
  const [selectedBuyers, setSelectedBuyers] = useState([]);
  const [bulkAddBuyersList, setBulkAddBuyersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const debouncedSearchTerm = useDebounce(searchQuery, 1000);


  const [campaignId, setCampaignId] = useState('');
  const [selectedDids, setSelectedDids] = useState([]);
  const [stepSelector, setStepSelector] = useState(1);
  const [completedStep, setCompletedStep] = useState(0);

  const [trunks, setTrunks] = useState([]);


  const {
    register,
    setError: setErr,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
    watch,
  } = useForm();

  // const getAllBuyers = async () => {
  //   // setLoading(true);
  //   const response = await generalGetFunction('buyer/all');
  //   if (response.status) {
  //     setAllBuyers(response.data);
  //     // setLoading(false);
  //   } else {
  //     toast.error(response.message);
  //     // setLoading(false);
  //   }
  // };

  // const getAllTrunk = async () => {
  //   // setLoading(true);
  //   const response = await generalGetFunction('fportaltrunk/all');
  //   if (response.status) {
  //     setTrunks(response.data);
  //     // setLoading(false);
  //   } else {
  //     toast.error(response.message);
  //     // setLoading(false);
  //   }
  // };

  // async function getDidData() {
  //   // setLoading(true);
  //   try {
  //     const getDid = await generalGetFunction("did/all?all-dids");
  //     if (getDid?.status) {
  //       setDid(getDid.data.filter((item) => item.usages === "tracker"));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching DID data:", error);
  //   }
  // }

  // // Initial data fetch
  // useEffect(() => {
  //   getAllBuyers();
  //   getAllTrunk();
  //   getDidData();
  // }, [])

  // const {
  //   register: registerStep1,
  //   handleSubmit: handleSubmitStep1,
  //   setValue: setValueStep1,
  //   watch: watchStep1,
  //   formState: { errors: errorsStep1 },
  // } = useForm();

  // const {
  //   register: registerStep2,
  //   handleSubmit: handleSubmitStep2,
  //   watch: watchStep2,
  //   formState: { errors: errorsStep2 },
  // } = useForm();

  // const handleFormSubmitStepOne = handleSubmitStep1(async (data) => {
  //   setLoading(true);

  //   const phoneNumber = parsePhoneNumber(data.pstn_number);
  //   const parsedNumber = phoneNumber?.nationalNumber;

  //   const payload = { ...data, country_prefix: phoneNumber?.countryCallingCode, pstn_number: parsedNumber };
  //   const apiData = await generalPostFunction("/fcampaign/store", payload);
  //   if (apiData?.status) {

  //     toast.success(apiData.message);
  //     setCampaignId(apiData.data.id);
  //     setCompletedStep(1);
  //     setStepSelector(2);

  //   } else {
  //     setLoading(false);
  //     toast.error(apiData?.message || apiData?.error);
  //   }
  // })

  // const handleFormSubmitStepTwo = handleSubmitStep2(async (data) => {
  //   setLoading(true);
  //   const payload = { ...data, fportal_campaign_id: campaignId, dids: selectedDids };
  //   const apiData = await generalPostFunction("/fportal/store", payload);
  //   if (apiData?.status) {
  //     setLoading(false);
  //     toast.success(apiData.message);
  //     setCompletedStep(1);
  //     navigate('/call-forwarding-campaign');
  //   } else {
  //     setLoading(false);
  //     toast.error(apiData?.message || apiData?.error);
  //   }
  // })

  // const toggleSelect = (values) => {
  //   setSelectedDids(values)
  // }

  // const allDidOptions = did.map((item) => ({
  //   value: item.id,
  //   label: item.did,
  // }))


  const toggleSelect = (values) => {
    setSelectedItems(values)
  }

  const getDidData = async () => {
    const getDid = await generalGetFunction("did/all?all-dids")
    if (getDid?.status) {
      setDid(getDid?.data?.filter((item) => item?.usages === "tracker" && item?.fportal_id == null))
    }
  }

  const getAllBuyers = async () => {
    const res = await generalGetFunction(`buyer/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchQuery}`);
    if (res?.status) {
      setAllBuyers(res?.data?.data)
    }
  }

  const getElasticTrunk = async () => {
    const res = await generalGetFunction("/fportaltrunk/all");
    if (res?.status) {
      setAllTrunk(res?.data?.data)
    }
  }

  const getAllSounds = async () => {
    if (account && account.id) {
      setLoading(true);
      const holdMusic = await generalGetFunction("/sound/all?type=hold");
      setLoading(false);
      if (holdMusic?.status) {
        setHoldMusic(holdMusic.data);
        if (holdMusic.data.length > 0 && uploadedMusic) {
          setValue("hold_music", uploadedMusic.id);
        }
      } else {
        // navigate("/");
      }
    }
  }

  const fetchAllBuyerNumber = async () => {
    const response = await generalGetFunction(`buyernumbers/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchQuery}`);
    // setLoading(true)
    if (response.status) {
      const updatedArr = response?.data?.data?.filter(
        item => !bulkAddBuyersList?.some(data => data?.buyer_number_id === item?.id)
      );
      const updatedObj = {
        ...response?.data,
        data: updatedArr
      }
      setOriginalAllNumber(response?.data)
      setAllBuyersNumbers(updatedObj);
      setLoading(false);
    } else {
      toast.error(response.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (account && account.id) {
      getAllSounds()
    } else {
      setLoading(false);
      navigate("/");
    }
  }, [account, musicRefresh])

  useEffect(() => {
    getDidData()
    getAllBuyers()
    getElasticTrunk()
    getAllSounds()
    fetchAllBuyerNumber()
  }, [])

  useEffect(() => {
    fetchAllBuyerNumber()
  }, [itemsPerPage, debouncedSearchTerm, pageNumber])

  const allDidOptions = did.map((item) => ({
    value: item.id,
    label: item.did,
  }))

  const allBuyersOption = allBuyers?.map((item) => ({
    value: item?.id,
    label: `${item?.name} - ${item?.phone_code}${item?.phone_number}`
  }))

  const allTrunkOptios = allTrunk?.map((item) => ({
    value: item?.id,
    label: item?.description
  }))

  const formatDateTime = (input) => {
    if (!input?.includes('T') && !input?.includes(':')) {
      input += 'T00:00:00';
    } else if (!input?.includes(':00')) {
      input += ':00';
    }

    const date = new Date(input);
    if (isNaN(date)) {
      console.error('Invalid date:', input);
      return '';
    }

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');
    const seconds = `${date.getSeconds()}`.padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const convertTimeToDateTime = (timeStr, timeOffsetHours = -7, full_day, isStartDate) => {
    if (full_day) {
      return isStartDate ? "00:00:00" : "23:59:59";
    }

    if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) {
      console.error("Invalid timeStr provided:", timeStr);
      return null;
    }

    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error("Invalid time components in timeStr:", timeStr);
      return null;
    }

    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setHours(date.getHours() + timeOffsetHours);

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };


  const handleFormSubmit = handleSubmit(async (data) => {
    const startDate = formatDateTime(data?.start_date)
    const endDate = formatDateTime(data?.end_date)
    delete data?.start_date
    delete data?.end_date
    setLoading(true);
    const payload = {
      ...data,
      record: data?.record == "false" ? false : true,
      sticky_agent_enable: data?.sticky_agent_enable == "false" ? false : true,
      buyers: bulkAddBuyersList?.map((item) => ({
        buyer_name: item?.buyer_name,
        buyer_number: item?.buyer_number,
        buyer_number_id: item?.buyer_number_id,
        buyer_status: item?.buyer_status ? item?.buyer_status == "disable" ? "disable" : "enable" : "disable",
        daily_call_limit: item?.daily_call_limit,
        live_call_limit: item?.live_call_limit,
        monthly_call_limit: item?.monthly_call_limit,
        priority: item?.priority,
        total_send_call: item?.total_send_call
      })),
      dids: selectedItems,
      active_hours: isActiveHour ? "1" : "0",
      ...(isActiveHour && {
        schedulars: (schedulerInfo?.filter(data => data?.status === true) || []).length > 0
          ? schedulerInfo
            ?.filter(data => data?.status === true)
            ?.map(item => ({
              end_time: convertTimeToDateTime(item?.end_time, "", item?.full_day, false),
              full_day: item?.full_day ? "1" : "0",
              name: item?.name,
              recurring_day: item?.recurring_day,
              start_time: convertTimeToDateTime(item?.start_time, "", item?.full_day, true),
              status: item?.status,
              start_date: startDate,
              end_date: endDate,
            }))
          : (startDate && endDate
            ? [{
              end_time: convertTimeToDateTime("", "", true, false),
              full_day: "0",
              name: "",
              recurring_day: "",
              start_time: convertTimeToDateTime("", "", true, true),
              status: false,
              start_date: startDate,
              end_date: endDate
            }]
            : [])
      }),
    };
    const apiData = await generalPostFunction("/fcampaign/store", payload);
    if (apiData?.status) {
      setLoading(false);
      navigate('/call-forwarding-campaign');
      toast.success(apiData.message);
    } else {
      setLoading(false);
    }
  });

  const handleCheckboxChange = (item) => {
    setSelectedBuyers((prevSelected) => {
      if (
        prevSelected.some(
          (buyer) => buyer.id == item.id
        )
      ) {
        // If the item is already in the array, remove it
        return prevSelected.filter(
          (buyer) => buyer.id != item.id
        );
      } else {
        // Otherwise, add the item
        return [...prevSelected, item];
      }
    });
  };

  const handleSelectAll = () => {
    const newSelectAllState = !selectAll; // Toggle Select All state
    setSelectAll(newSelectAllState);

    if (newSelectAllState) {
      // Add all visible users to bulkUploadSelectedAgents
      allBuyers.forEach((item) => {
        if (
          !selectedBuyers.some(
            (buyer) => buyer.id == item.id
          )
        ) {
          handleCheckboxChange(item);
        }
      });
    } else {
      // Remove all visible users from bulkUploadSelectedAgents
      allBuyers.filter((item) => bulkAddBuyersList.every(buyer => buyer.id !== item.id)).forEach((item) => {
        if (
          selectedBuyers.some(
            (buyer) => buyer.id == item.id
          )
        ) {
          handleCheckboxChange(item);
        }
      });
    }
  };

  const handleBulkAddBuyersList = () => {
    if (selectedBuyers && selectedBuyers.length > 0) {
      const arr = selectedBuyers.map((item) => ({
        id: item?.id,
        name: item?.name,
        priority: item?.priority,
        monthly_call_limit: item?.monthly_call_limit ?? 0,
        daily_call_limit: item?.daily_call_limit ?? 0,
        live_call_limit: item?.live_call_limit ?? 1,
        total_send_call: item?.total_send_call ?? 0,
        buyer_status: item?.buyer_status,
        buyer_number_id: item?.id,
        buyer_name: item?.buyer?.name,
        buyer_number: item?.phone_number
      }))
      setBulkAddBuyersList(arr);
      setSelectAll(false)
    }
  }

  const deleteItemFromBulk = (id) => {
    const updatedArr = bulkAddBuyersList.filter((item) => item.buyer_number_id !== id);
    setBulkAddBuyersList(updatedArr);

    const updatedBuyerSelect = () =>
      selectedBuyers.map((buyer) => {
        if (id === buyer.id) {
          const arr = selectedBuyers.filter((item) => item.id != id);
          setSelectedBuyers(arr);
        }
      });
    updatedBuyerSelect();
  }

  const handleBuyerEdit = () => {

  }

  return (
    <main className="mainContent">
      {loading && <CircularLoader />}
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Forwarding portal" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Forwarding portal</h4>
                        <p>You can see all list of Forwarding portal</p>
                      </div>
                      <div className="buttonGroup">
                        <button className="panelButton gray" onClick={() => { navigate(-1); backToTop(); }}>
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button type="button" className="panelButton" onClick={handleFormSubmit}>
                          <span className="text">Save</span>
                          <span className="icon">
                            <i className="fa-solid fa-floppy-disk"></i>
                          </span>
                        </button>
                        {/* previous code ==================== start here */}
                        {/* <button
                          type="button"
                          className="panelButton"
                          onClick={() => {
                            if (completedStep === 0) {
                              handleFormSubmitStepOne();
                            } else if (completedStep === 1) {
                              handleFormSubmitStepTwo();
                            }
                          }}
                        >
                          <span className="text" >{completedStep === 1 ? 'Save' : 'Next'}</span>
                          <span className="icon">
                            <i className={`fa-solid fa-${completedStep === 1 ? 'floppy-disk' : 'caret-right'}`}></i>
                          </span>
                        </button> */}
                        {/* preview code ==================== end here */}
                      </div>
                    </div>
                  </div>
                  {/* preview code ==================== start here */}
                  {/* <div className="col-12" style={{ padding: '25px 23px' }}>
                    <div className="row">
                      <div className="col-xl-2 col-3">
                        <div className='someTempDialerDesign'>
                          <ul>
                            <li className={stepSelector === 1 && 'active'} onClick={() => setStepSelector(1)}>
                              <div className={completedStep > 0 ? 'numberHolder completed' : "numberHolder"}>
                                1
                              </div>
                              <div className='textHolder'>
                                <h3>General Settings</h3>
                              </div>
                            </li>
                            <li className={stepSelector === 2 && 'active'} onClick={() => {
                              setStepSelector(2)
                            }}>
                              <div className={completedStep > 1 ? 'numberHolder completed' : "numberHolder"}>
                                2
                              </div>
                              <div className='textHolder'>
                                <h3>Dialer Settings</h3>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {stepSelector === 1 && <>
                        <div className="col-xl-8 col-9" style={{ borderLeft: '1px solid var(--border-color)', padding: '0 30px' }}>
                          <form className="row mb-0">
                            <div className="formRow">
                              <div className='formLabel'>
                                <label>
                                  Campaign Name
                                </label>
                              </div>
                              <div className='col-6'>
                                <input
                                  type="text"
                                  className="formItem"
                                  {...registerStep1("campaign_name", {
                                    ...requiredValidator,
                                  })}
                                />
                                {errorsStep1.campaign_name && (
                                  <ErrorMessage text={errorsStep1.campaign_name.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow">
                              <div className='formLabel'>
                                <label>
                                  Buyer
                                </label>
                              </div>
                              <div className='col-6'>
                                <select className="formItem" {...registerStep1("buyer_id", { ...requiredValidator, })}>
                                  <option>Choose Buyer</option>
                                  {
                                    allBuyers && allBuyers.length > 0 ? allBuyers.map((buyer) => (
                                      <option key={buyer.id} value={buyer.id}>{buyer.name}</option>
                                    )) : null
                                  }
                                </select>
                                {errorsStep1.buyer_id && (
                                  <ErrorMessage text={errorsStep1.buyer_id.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow">
                              <div className='formLabel'>
                                <label>
                                  Agent Name
                                </label>
                              </div>
                              <div className='col-6'>
                                <input
                                  type="text"
                                  className="formItem"
                                  {...registerStep1("agent_name", {
                                    ...requiredValidator,
                                  })}
                                />
                                {errorsStep1.agent_name && (
                                  <ErrorMessage text={errorsStep1.agent_name.message} />
                                )}
                              </div>
                            </div>

                            <div className="formRow">
                              <div className="formLabel">
                                <label>
                                  PSTN number{" "}
                                  <span className="text-danger">*</span>
                                </label>
                              </div>
                              <div className="col-6">
                                <input type="text"
                                  className="formItem d-none"
                                  {...registerStep1("pstn_number", { ...requiredValidator })}
                                />
                                <PhoneInput
                                  defaultCountry="US"
                                  placeholder="Enter phone number"
                                  limitMaxLength={true}
                                  value={watchStep1("pstn_number")}
                                  onChange={(value) => setValueStep1("pstn_number", value)}
                                />
                                {errorsStep1.pstn_number && (
                                  <ErrorMessage text={errorsStep1.pstn_number.message} />
                                )}
                              </div>
                            </div>

                            <div className="formRow">
                              <div className='formLabel'>
                                <label>
                                  Total Send Call
                                </label>
                              </div>
                              <div className='col-6'>
                                <input
                                  type="text"
                                  className="formItem"
                                  {...registerStep1("total_send_call", {
                                    ...requiredValidator, ...numberValidator,
                                  })}
                                />
                                {errorsStep1.total_send_call && (
                                  <ErrorMessage text={errorsStep1.total_send_call.message} />
                                )}
                              </div>
                            </div>
                          </form>
                        </div>
                      </>}
                      {stepSelector === 2 && <>
                        <div className='col-xl-9 col-9' style={{ borderLeft: '1px solid var(--border-color)', padding: '0 30px' }}>
                          <form className="row mb-0" onSubmit={handleFormSubmitStepTwo}>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label className='fw-bold' style={{ fontSize: 'initial' }}>
                                  Forward Type
                                </label>
                              </div>
                              <div className='col-6'>
                                <select defaultValue={"pstn"} className='formItem'
                                  {...registerStep2("forward_type", {
                                    ...requiredValidator,
                                  })}
                                >
                                  <option value="pstn">PSTN</option>
                                  <option value="trunk">Trunk</option>
                                </select>
                                {errorsStep2.forward_type && (
                                  <ErrorMessage text={errorsStep2.forward_type.message} />
                                )}
                              </div>
                            </div>
                            <div></div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>Forwarding Portal Name</label>
                              </div>
                              <div className='col-6'>
                                <input type='text' className='formItem'
                                  {...registerStep2("f_name", {
                                    ...requiredValidator,
                                  })} />
                                {errorsStep2.f_name && (
                                  <ErrorMessage text={errorsStep2.f_name.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Active Hours
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'
                                  {...registerStep2("active_hours", {
                                    ...requiredValidator,
                                    ...numberValidator,
                                  })} />
                                {errorsStep2.active_hours && (
                                  <ErrorMessage text={errorsStep2.active_hours.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Start Day
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("start_day", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.start_day && (
                                  <ErrorMessage text={errorsStep2.start_day.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  End Day
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("end_day", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.end_day && (
                                  <ErrorMessage text={errorsStep2.end_day.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Monthly Call Limit
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'
                                  {...registerStep2("monthly_call_limit", {
                                    ...requiredValidator,
                                    ...numberValidator,
                                  })} />
                                {errorsStep2.monthly_call_limit && (
                                  <ErrorMessage text={errorsStep2.monthly_call_limit.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Daily Call Limit
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("daily_call_limit", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.daily_call_limit && (
                                  <ErrorMessage text={errorsStep2.daily_call_limit.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Live Call Limit
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("live_call_limit", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.live_call_limit && (
                                  <ErrorMessage text={errorsStep2.live_call_limit.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Priority
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("priority", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.priority && (
                                  <ErrorMessage text={errorsStep2.priority.message} />
                                )}
                              </div>
                            </div>
                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Total Send Call
                                </label>
                              </div>
                              <div className='col-6'>
                                <input type='number' className='formItem'  {...registerStep2("total_send_call", {
                                  ...requiredValidator,
                                  ...numberValidator,
                                })} />
                                {errorsStep2.total_send_call && (
                                  <ErrorMessage text={errorsStep2.total_send_call.message} />
                                )}
                              </div>
                            </div>

                            <div className="formRow col-xl-6 col-12">
                              <div className='formLabel'>
                                <label>
                                  Outbound Caller ID
                                </label>
                              </div>
                              <div className='col-6'>
                                <Select
                                  onChange={(selectedOptions) => {
                                    const values = (selectedOptions || []).map((option) => option.value)
                                    toggleSelect(values)
                                  }}
                                  isMulti
                                  value={allDidOptions.filter(option => selectedDids.includes(option.value))}
                                  options={allDidOptions}
                                  isSearchable
                                  styles={customStyles}
                                />
                              </div>
                            </div>

                            {watchStep2().forward_type == 'trunk' &&
                              <div className="formRow col-xl-6 col-12">
                                <div className='formLabel'>
                                  <label>
                                    Total Send Call
                                  </label>
                                </div>
                                <div className='col-6'>
                                  <select className='formItem' {...registerStep2("trunk_id", { ...requiredValidator, })}>
                                    <option value=''>Select Trunk</option>
                                    {trunks.map((trunk) => (
                                      <option key={trunk.id} value={trunk.id}>
                                        {trunk.description}
                                      </option>
                                    ))}

                                  </select>
                                  {errorsStep2.total_send_call && (
                                    <ErrorMessage text={errorsStep2.total_send_call.message} />
                                  )}
                                </div>
                              </div>
                            }
                          </form>
                        </div>
                      </>}
                    </div>
                  </div> */}
                  {/* previous code ==================== end here */}
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "10px 20px" }}
                  >
                    <div className="row">
                      <div className="col-12" style={{ padding: '0 30px' }}>
                        <form className="row mb-0">
                          <div className="formRow col-xl-3">
                            <div className='formLabel'>
                              <label>
                                Campaign Name  <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className='col-6'>
                              <input
                                type="text"
                                className="formItem"
                                {...register("campaign_name", {
                                  ...requiredValidator,
                                })}
                              />
                              {errors.campaign_name && (
                                <ErrorMessage text={errors.campaign_name.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className='formLabel'>
                              <label>
                                Source
                              </label>
                            </div>
                            <div className='col-6'>
                              <input
                                type="text"
                                className="formItem"
                                {...register("source")}
                              />
                              {errors.source && (
                                <ErrorMessage text={errors.source.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className='formLabel'>
                              <label>
                                Tag <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className='col-6'>
                              <input
                                type="text"
                                className="formItem"
                                {...register("agent_name", {
                                  ...requiredValidator,
                                })}
                              />
                              {errors.agent_name && (
                                <ErrorMessage text={errors.agent_name.message} />
                              )}
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className='formLabel'>
                              <label>
                                Originate Timeout <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className='col-6'>
                              <input
                                type="number"
                                className="formItem"
                                defaultValue={60}
                                {...register("originate_timeout", {
                                  ...requiredValidator,
                                })}
                              />
                              {errors.originate_timeout && (
                                <ErrorMessage text={errors.originate_timeout.message} />
                              )}
                            </div>
                          </div>
                          {/* <div className="col-6">
                            <div className="formRow">
                              <div className='formLabel'>
                                <label>
                                  Status
                                </label>
                              </div>
                              <div className='col-6'>
                                <div className="cl-toggle-switch">
                                  <label className="cl-switch">
                                    <input type="checkbox"
                                      checked={isStatus}
                                      id="showAllCheck"
                                      onChange={() => setIsStatus(prev => !prev)}
                                    />
                                    <span></span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div> */}
                          <div className="formRow col-xl-3">
                            <div className='formLabel'>
                              <label>
                                Forward Type <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className='col-6'>
                              <select defaultValue={"pstn"} className='formItem'
                                {...register("forward_type")}
                              >
                                <option value="pstn">PSTN</option>
                                <option value="trunk">Trunk</option>
                              </select>
                              {errors.forward_type && (
                                <ErrorMessage text={errors.forward_type.message} />
                              )}
                            </div>
                          </div>
                          {
                            watch()?.forward_type === "trunk" &&
                            <div className="formRow col-xl-3">
                              <div className='formLabel'>
                                <label>
                                  Trunk
                                </label>
                              </div>
                              <div className='col-6'>
                                <select
                                  className='formItem'
                                  {...register("trunk_id")}
                                >
                                  {allTrunkOptios?.map((data) => (
                                    <>
                                      <option value={data?.value}>{data?.label}</option>
                                    </>


                                  ))}
                                </select>
                                {errors.trunk_id && (
                                  <ErrorMessage text={errors.trunk_id.message} />
                                )}
                              </div>
                            </div>
                          }


                          {/* <div className="formRow">
                            <div className='formLabel'>
                              <label>
                                Buyer
                              </label>
                            </div>
                            <div className='col-6'>
                              <Select
                                onChange={(selectedOptions) => {
                                  const values = (selectedOptions || []).map((option) => option.value)
                                  setSelectedItemForBuyer(values)
                                }}
                                value={allBuyersOption.filter(option => selectedItemForBuyer?.includes(option.value))}
                                isMulti
                                options={allBuyersOption}
                                isSearchable
                                styles={customStyles}
                              />
                            </div>
                          </div> */}
                          <div className="formRow col-xl-3">
                            <div className='formLabel'>
                              <label>
                                Inbound Assigned Did  <span className="text-danger">*</span>
                              </label>
                            </div>
                            <div className='col-6'>
                              <Select
                                onChange={(selectedOptions) => {
                                  const values = (selectedOptions || []).map((option) => option.value)
                                  toggleSelect(values)
                                }}
                                value={allDidOptions.filter(option => selectedItems.includes(option.value))}
                                isMulti
                                options={allDidOptions}
                                isSearchable
                                styles={customStyles}
                                required={true}
                              />
                            </div>
                          </div>

                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Sticky Agent</label>
                              <label htmlFor="data" className="formItemDesc">
                                Select the status of Sticky Agent
                              </label>
                            </div>
                            <div className="col-6">
                              <div className="row gx-2">
                                <div
                                  className={`col-${watch().sticky_agent_enable == "true" ||
                                    watch().sticky_agent_enable == 1
                                    ? "3"
                                    : "12"
                                    }`}
                                >
                                  {watch().sticky_agent_enable === "true" ||
                                    watch().sticky_agent_enable === 1 ? (
                                    <div className="formLabel">
                                      <label className="formItemDesc">Status</label>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  <select
                                    className="formItem"
                                    name=""
                                    defaultValue={false}
                                    id="selectFormRow"
                                    {...register("sticky_agent_enable")}
                                  >
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                  </select>
                                </div>

                                {(watch().sticky_agent_enable == true ||
                                  watch().sticky_agent_enable == "true") && (
                                    <div className="col-3">
                                      <div className="formLabel">
                                        <Tippy content="Check the duration of sticky agent">
                                          <label className="formItemDesc">
                                            Duration{" "}
                                          </label>
                                        </Tippy>
                                      </div>
                                      <input
                                        type="number"
                                        name="forward_to"
                                        className="formItem"
                                        {...register(
                                          "stick_agent_expires",
                                          rangeValidator(1, 99), {
                                          requiredValidator
                                        }
                                        )}
                                      />
                                      {errors.stick_agent_expires && (
                                        <ErrorMessage
                                          text={errors.stick_agent_expires.message}
                                        />
                                      )}
                                    </div>
                                  )}
                                {(watch().sticky_agent_enable == true ||
                                  watch().sticky_agent_enable == "true") && (
                                    <div className="col-3">
                                      <div className="formLabel">
                                        <label className="formItemDesc">
                                          Agent Type
                                        </label>
                                      </div>
                                      <select
                                        className="formItem"
                                        name=""
                                        id="selectFormRow"
                                        {...register("stick_agent_type")}
                                      >
                                        <option selected="" value="last_spoken">
                                          Last Spoken
                                        </option>
                                        <option value="longest_time">
                                          Longest Time
                                        </option>
                                      </select>
                                    </div>
                                  )}
                                {(watch().sticky_agent_enable == true ||
                                  watch().sticky_agent_enable == "true") && (
                                    <div className="col-3">
                                      <div className="formLabel">
                                        <Tippy content="Timout for the sticky agent and return to normal routing">
                                          <label className="formItemDesc">
                                            Timeout(Sec.){" "}
                                          </label>
                                        </Tippy>
                                      </div>
                                      <input
                                        type="number"
                                        name="forward_to"
                                        className="formItem"
                                        {...register(
                                          "sticky_agent_timeout",
                                          rangeValidator(1, 99), {
                                          requiredValidator
                                        }
                                        )}
                                      />
                                      {errors.stick_agent_expires && (
                                        <ErrorMessage
                                          text={errors.stick_agent_expires.message}
                                        />
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Spam Filter</label>
                              <label htmlFor="data" className="formItemDesc">
                                Select the type of Spam Filter
                              </label>
                            </div>
                            <div className="col-6">
                              <div className="row">
                                <div
                                  className={`col-${watch().spam_filter_type === "3"
                                    ? "4 pe-1 ms-auto"
                                    : "12"
                                    }`}
                                >
                                  {watch().spam_filter_type != "1" && (
                                    <div className="formLabel">
                                      <label>Type</label>
                                    </div>
                                  )}
                                  <select
                                    className="formItem"
                                    name=""
                                    defaultValue="1"
                                    id="selectFormRow"
                                    {...register("spam_filter_type")}
                                  >
                                    <option value="1">Disable</option>
                                    <option value="2">Call Screening</option>
                                    <option value="3">DTMF Input</option>
                                  </select>
                                </div>
                                {watch().spam_filter_type === "3" && (
                                  <>
                                    <div className="col-4 px-1">
                                      <div className="formLabel">
                                        <label htmlFor="selectFormRow">
                                          Retries
                                        </label>
                                      </div>
                                      <select
                                        className="formItem"
                                        name=""
                                        id="selectFormRow"
                                        {...register("dtmf_retries")}
                                      >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                      </select>
                                    </div>
                                    <div className="col-4 ps-1">
                                      <div className="formLabel">
                                        <Tippy content="Input in Days, Max 5">
                                          <label>
                                            Length{" "}
                                            <span
                                              style={{
                                                color: "var(--color-subtext)",
                                              }}
                                            ></span>
                                          </label>
                                        </Tippy>
                                      </div>
                                      <select
                                        className="formItem"
                                        name=""
                                        defaultValue="false"
                                        id="selectFormRow"
                                        {...register("dtmf_length")}
                                      >
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                      </select>
                                    </div>
                                    <div className="col-6 pe-1">
                                      <div className="formLabel">
                                        <label>
                                          DTMF type{" "}
                                          <span
                                            style={{
                                              color: "var(--color-subtext)",
                                            }}
                                          ></span>
                                        </label>
                                      </div>
                                      <select
                                        className="formItem"
                                        name=""
                                        defaultValue="false"
                                        id="selectFormRow"
                                        {...register("dtmf_type")}
                                      >
                                        <option value="random_digit">
                                          Random Digit
                                        </option>
                                        <option value="last_caller_id_digit">
                                          Caller last digit
                                        </option>
                                      </select>
                                    </div>
                                    <div className="col-6 ps-1">
                                      <div className="formLabel">
                                        <label htmlFor="selectFormRow">
                                          Retry File
                                        </label>
                                      </div>
                                      <select
                                        className="formItem"
                                        name=""
                                        id="selectFormRow"
                                        {...register("dtmf_retry_file_sound")}
                                      >
                                        <option value={""}>None</option>
                                        {holdMusic &&
                                          holdMusic.map((ring) => {
                                            return (
                                              <option
                                                key={ring.id}
                                                value={ring.id}
                                              >
                                                {ring.name}
                                              </option>
                                            );
                                          })}
                                      </select>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="formRow col-xl-3">
                            <div className="formLabel">
                              <label htmlFor="selectFormRow">Record</label>
                              <label htmlFor="data" className="formItemDesc">
                                Save the recording.
                              </label>
                            </div>
                            <div className="col-6">
                              <select
                                className="formItem"
                                name=""
                                id="selectFormRow"
                                {...register("record")}
                                defaultValue={"false"}
                              >
                                <option selected="" value="true">
                                  True
                                </option>
                                <option value="false">False</option>
                              </select>
                            </div>
                          </div>


                          <div className="formRow col-xl-3">
                            <div className='formLabel'>
                              <label>
                                Scheduler
                              </label>
                            </div>
                            <div className="col-6">
                              <div className="cl-toggle-switch">
                                <label className="cl-switch">
                                  <input type="checkbox"
                                    checked={isActiveHour}
                                    id="showAllCheck"
                                    onChange={() => setIsActiveHour(prev => !prev)}
                                  />
                                  <span></span>
                                </label>
                              </div>
                            </div>
                          </div>
                          {
                            isActiveHour &&
                            <div className="formRow d-block col-xl-3">
                              <div className="formLabel">
                                <label className="fw-bold" style={{ fontSize: 'initial' }}>Set Targeted Date & Time</label>
                              </div>
                              <div className="row">
                                <div className="col-12">
                                  <div className="formRow">
                                    <div className='formLabel'>
                                      <label>
                                        Start Date
                                      </label>
                                    </div>
                                    <div className='col-6'>
                                      <div className='row gx-2'>
                                        <div className='col-12'>
                                          <input
                                            type="date"
                                            className="formItem"
                                            {...register("start_date")}
                                          />
                                          {errors.trunk_id && (
                                            <ErrorMessage text={errors.trunk_id.message} />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-12">
                                  <div className="formRow">
                                    <div className='formLabel'>
                                      <label>
                                        End Date
                                      </label>
                                    </div>
                                    <div className='col-6'>
                                      <div className='row gx-2'>
                                        <div className='col-12'>
                                          <input
                                            type="date"
                                            className="formItem"
                                            {...register("end_date")}
                                          />
                                          {errors.trunk_id && (
                                            <ErrorMessage text={errors.trunk_id.message} />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: 'fit-content', marginTop: '10px' }}>
                                <div className="timeTableWrapper col-auto">
                                  <div className="col-12">
                                    <div className="wrapper">
                                      <div className="item" style={{ width: '95px' }}>
                                        <input type="checkbox"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Sunday' ? { ...day, status: e.target.checked } : day
                                            ));
                                          }} />
                                        <label className="ms-2 fw-bold">Sunday</label>
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Sunday' ? { ...day, start_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Sunday' ? { ...day, end_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <div className="my-auto position-relative mx-1">
                                          <div className="cl-toggle-switch">
                                            <label className="cl-switch">
                                              <input type="checkbox" id="showAllCheck"
                                                onChange={(e) => {
                                                  setSchedulerInfo(prevState => prevState.map(day =>
                                                    day.recurring_day === 'Sunday' ? { ...day, full_day: e.target.checked } : day
                                                  ));
                                                }} />
                                              <span></span>
                                            </label>
                                          </div>
                                        </div>
                                        <label className="ms-1">Full day</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="wrapper">
                                      <div className="item" style={{ width: '95px' }}>
                                        <input type="checkbox"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Monday' ? { ...day, status: e.target.checked } : day
                                            ));
                                          }} />
                                        <label className="ms-2 fw-bold">Monday</label>
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Monday' ? { ...day, start_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Monday' ? { ...day, end_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <div className="my-auto position-relative mx-1">
                                          <div className="cl-toggle-switch">
                                            <label className="cl-switch">
                                              <input type="checkbox" id="showAllCheck"
                                                onChange={(e) => {
                                                  setSchedulerInfo(prevState => prevState.map(day =>
                                                    day.recurring_day === 'Monday' ? { ...day, full_day: e.target.checked } : day
                                                  ));
                                                }} />
                                              <span></span>
                                            </label>
                                          </div>
                                        </div>
                                        <label className="ms-1">Full day</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="wrapper">
                                      <div className="item" style={{ width: '95px' }}>
                                        <input type="checkbox"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Tuesday' ? { ...day, status: e.target.checked } : day
                                            ));
                                          }} />
                                        <label className="ms-2 fw-bold">Tuesday</label>
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Tuesday' ? { ...day, start_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Tuesday' ? { ...day, end_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <div className="my-auto position-relative mx-1">
                                          <div className="cl-toggle-switch">
                                            <label className="cl-switch">
                                              <input type="checkbox" id="showAllCheck"
                                                onChange={(e) => {
                                                  setSchedulerInfo(prevState => prevState.map(day =>
                                                    day.recurring_day === 'Tuesday' ? { ...day, full_day: e.target.checked } : day
                                                  ));
                                                }} />
                                              <span></span>
                                            </label>
                                          </div>
                                        </div>
                                        <label className="ms-1">Full day</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="wrapper">
                                      <div className="item" style={{ width: '95px' }}>
                                        <input type="checkbox"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Wednesday' ? { ...day, status: e.target.checked } : day
                                            ));
                                          }} />
                                        <label className="ms-2 fw-bold">Wednesday</label>
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Wednesday' ? { ...day, start_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Wednesday' ? { ...day, end_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <div className="my-auto position-relative mx-1">
                                          <div className="cl-toggle-switch">
                                            <label className="cl-switch">
                                              <input type="checkbox" id="showAllCheck"
                                                onChange={(e) => {
                                                  setSchedulerInfo(prevState => prevState.map(day =>
                                                    day.recurring_day === 'Wednesday' ? { ...day, full_day: e.target.checked } : day
                                                  ));
                                                }} />
                                              <span></span>
                                            </label>
                                          </div>
                                        </div>
                                        <label className="ms-1">Full day</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="wrapper">
                                      <div className="item" style={{ width: '95px' }}>
                                        <input type="checkbox"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Thursday' ? { ...day, status: e.target.checked } : day
                                            ));
                                          }} />
                                        <label className="ms-2 fw-bold">Thursday</label>
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Thursday' ? { ...day, start_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Thursday' ? { ...day, end_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <div className="my-auto position-relative mx-1">
                                          <div className="cl-toggle-switch">
                                            <label className="cl-switch">
                                              <input type="checkbox" id="showAllCheck"
                                                onChange={(e) => {
                                                  setSchedulerInfo(prevState => prevState.map(day =>
                                                    day.recurring_day === 'Thursday' ? { ...day, full_day: e.target.checked } : day
                                                  ));
                                                }} />
                                              <span></span>
                                            </label>
                                          </div>
                                        </div>
                                        <label className="ms-1">Full day</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="wrapper">
                                      <div className="item" style={{ width: '95px' }}>
                                        <input type="checkbox"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Friday' ? { ...day, status: e.target.checked } : day
                                            ));
                                          }} />
                                        <label className="ms-2 fw-bold">Friday</label>
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Friday' ? { ...day, start_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Friday' ? { ...day, end_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <div className="my-auto position-relative mx-1">
                                          <div className="cl-toggle-switch">
                                            <label className="cl-switch">
                                              <input type="checkbox" id="showAllCheck"
                                                onChange={(e) => {
                                                  setSchedulerInfo(prevState => prevState.map(day =>
                                                    day.recurring_day === 'Friday' ? { ...day, full_day: e.target.checked } : day
                                                  ));
                                                }} />
                                              <span></span>
                                            </label>
                                          </div>
                                        </div>
                                        <label className="ms-1">Full day</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="wrapper mb-0">
                                      <div className="item" style={{ width: '95px' }}>
                                        <input type="checkbox"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Saturday' ? { ...day, status: e.target.checked } : day
                                            ));
                                          }} />
                                        <label className="ms-2 fw-bold">Saturday</label>
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Saturday' ? { ...day, start_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <input type="time" className="formItem"
                                          onChange={(e) => {
                                            setSchedulerInfo(prevState => prevState.map(day =>
                                              day.recurring_day === 'Saturday' ? { ...day, end_time: e.target.value } : day
                                            ));
                                          }} />
                                      </div>
                                      <div className="item">
                                        <div className="my-auto position-relative mx-1">
                                          <div className="cl-toggle-switch">
                                            <label className="cl-switch">
                                              <input type="checkbox" id="showAllCheck"
                                                onChange={(e) => {
                                                  setSchedulerInfo(prevState => prevState.map(day =>
                                                    day.recurring_day === 'Saturday' ? { ...day, full_day: e.target.checked } : day
                                                  ));
                                                }} />
                                              <span></span>
                                            </label>
                                          </div>
                                        </div>
                                        <label className="ms-1">Full day</label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          }

                          <div className="col-12 mt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                            <div className="heading bg-transparent border-bottom-0 px-0 pb-0">
                              <div className="content">
                                <h4>List of Buyers <span className="text-danger">*</span></h4>
                                <p>You can see the list of agents in this ring group.</p>
                              </div>
                              <div className="buttonGroup">
                                <button
                                  type="button"
                                  className="panelButton"
                                  onClick={() => {
                                    if (allBuyers.length !== bulkAddBuyersList.length)
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
                            {bulkAddBuyersList && bulkAddBuyersList?.length > 0 ? bulkAddBuyersList?.map((buyer, index) => {
                              return (
                                <div className="row">
                                  <div className="formRow col">
                                    {index === 0 && <div className='formLabel'>
                                      <label>
                                        Buyer Name <span className="text-danger">*</span>
                                      </label>
                                    </div>}
                                    <div className='col-12'>
                                      <input
                                        type="text"
                                        className="formItem"
                                        value={buyer?.buyer_name}
                                        disabled={true}
                                      />
                                    </div>
                                  </div>
                                  <div className="formRow col">
                                    {index === 0 && <div className='formLabel'>
                                      <label>
                                        Buyer Number <span className="text-danger">*</span>
                                      </label>
                                    </div>}
                                    <div className='col-12'>
                                      <input
                                        type="text"
                                        className="formItem"
                                        value={buyer?.buyer_number}
                                        disabled={true}
                                      />
                                    </div>
                                  </div>
                                  <div className="formRow col">
                                    {index === 0 && <div className='formLabel'>
                                      <label>
                                        Priority <span className="text-danger">*</span>
                                      </label>
                                    </div>}
                                    <div className='col-12'>
                                      <select
                                        className="formItem"
                                        defaultValue={-1}
                                        onChange={(e) => {
                                          setBulkAddBuyersList(prevState => prevState.map(item =>
                                            item.id == buyer.id ? { ...item, priority: e.target.value } : item
                                          ));
                                        }}
                                      >
                                        <option value={-1}>None</option>
                                        {originalAllNumber?.data?.length > 0 && originalAllNumber?.data?.map((buyer, index) => (
                                          <option value={index + 1}>{index + 1}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <div className="formRow col">
                                    {index === 0 && <div className='formLabel'>
                                      <label>
                                        Monthly Call Limit
                                      </label>
                                    </div>}
                                    <div className='col-12'>
                                      <input
                                        type="number"
                                        className="formItem"
                                        value={buyer?.monthly_call_limit}
                                        onChange={(e) => {
                                          setBulkAddBuyersList(prevState => prevState.map(item =>
                                            item.id == buyer.id ? { ...item, monthly_call_limit: e.target.value } : item
                                          ));
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="formRow col">
                                    {index === 0 && <div className='formLabel'>
                                      <label>
                                        Daily Call Limit
                                      </label>
                                    </div>}
                                    <div className='col-12'>
                                      <input
                                        type="number"
                                        className="formItem"
                                        value={buyer?.daily_call_limit}
                                        onChange={(e) => {
                                          setBulkAddBuyersList(prevState => prevState.map(item =>
                                            item.id == buyer.id ? { ...item, daily_call_limit: e.target.value } : item
                                          ));
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="formRow col">
                                    {index === 0 && <div className='formLabel'>
                                      <label>
                                        Live Call Limit <span className="text-danger">*</span>
                                      </label>
                                    </div>}
                                    <div className='col-12'>
                                      <input
                                        type="number"
                                        className="formItem"
                                        value={buyer?.live_call_limit}
                                        onChange={(e) => {
                                          setBulkAddBuyersList(prevState => prevState.map(item =>
                                            item.id == buyer.id ? { ...item, live_call_limit: e.target.value } : item
                                          ));
                                        }}
                                      />
                                    </div>
                                  </div>
                                  {/* <div className="formRow col">
                                    {index === 0 && <div className='formLabel'>
                                      <label>
                                        Total Send Call
                                      </label>
                                    </div>}
                                    <div className='col-12'>
                                      <input
                                        type="number"
                                        className="formItem"
                                        onChange={(e) => {
                                          setBulkAddBuyersList(prevState => prevState.map(item =>
                                            item.id == buyer.id ? { ...item, total_send_call: e.target.value } : item
                                          ));
                                        }}
                                      />
                                    </div>
                                  </div> */}
                                  <div className="formRow col">
                                    {index === 0 && <div className='formLabel'>
                                      <label>
                                        Buyer Status
                                      </label>
                                    </div>}
                                    <div className="col-12">
                                      <div class="cl-toggle-switch">
                                        <label class="cl-switch">
                                          <input type="checkbox"
                                            id="showAllCheck"
                                            checked={buyer?.buyer_status == 'enable' ? true : false ?? false}
                                            onChange={(e) => {
                                              setBulkAddBuyersList(prevState =>
                                                prevState.map(item =>
                                                  item.id == buyer.id
                                                    ? { ...item, buyer_status: e.target.checked ? 'enable' : 'disable' }
                                                    : item
                                                ));
                                            }}
                                          />
                                          <span></span>
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  {/* <div className={`formRow col ${index === 0 && 'mt-auto'}`}>
                                    <button
                                      type="button"
                                      onClick={() => handleBuyerEdit(buyer.id)}
                                      className="tableButton edit"
                                    >
                                      <i className="fa-solid fa-pencil"></i>
                                    </button>
                                  </div> */}
                                  {bulkAddBuyersList.length === 1 ? (
                                    ""
                                  ) : (
                                    <div className={`formRow col ${index === 0 && 'mt-auto'}`}>
                                      <button
                                        type="button"
                                        onClick={() => deleteItemFromBulk(buyer.buyer_number_id)}
                                        className="tableButton delete"
                                      >
                                        <i className="fa-solid fa-trash"></i>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )
                            }) : ""}
                          </div>
                        </form>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {bulkAddPopUp &&
        <div className="backdropContact">
          <div className="addNewContactPopup w-auto">
            <div className="row">
              <div className="col-12 heading mb-0">
                <i className="fa-light fa-user-plus" />
                <h5>Add Buyers to the selected Campaign</h5>
              </div>
              <div className="col-xl-12">
                <div className="tableHeader">
                  <div className="showEntries">
                    <label>Show</label>
                    <select
                      className="formItem"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(e.target.value);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                    </select>
                    <label>entries</label>
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <input
                    type="text"
                    className="formItem"
                    placeholder="Search"
                    name="name"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event?.target?.value)}
                  />
                  <button
                    className="tableButton popupIcon_btn ms-2"
                    onClick={() => navigate("/buyer-add")}
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
                        <th>Buyer</th>
                        <th>Tag</th>
                        <th>Phone Number</th>
                        <th>
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectAll ? true : false}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allBuyersNumbers?.data?.sort((a, b) => {
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
                      }).filter((item) => bulkAddBuyersList.every(buyer => buyer.id !== item.id))
                        .map((item, index) => {
                          return (
                            <tr key={item.id || index}>
                              <td>{index + 1}</td>
                              <td>{item?.buyer?.name}</td>
                              <td>{item?.name}</td>
                              <td>{item?.phone_number}</td>
                              <td>
                                <input
                                  type="checkbox"
                                  onChange={() => handleCheckboxChange(item)}
                                  checked={selectedBuyers.some(
                                    (buyer) => buyer.id === item.id
                                  )}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="tableHeader mb-3">
                  <PaginationComponent
                    pageNumber={(e) => setPageNumber(e)}
                    totalPage={allBuyersNumbers?.last_page}
                    from={allBuyersNumbers?.from}
                    to={allBuyersNumbers?.to}
                    total={allBuyersNumbers?.total}
                  />
                </div>
              </div>

              <div className="col-xl-12 mt-2">
                <div className="d-flex justify-content-between">
                  <button
                    className="panelButton gray ms-0"
                    onClick={() => {
                      setBulkAddPopUp(false);
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
                      handleBulkAddBuyersList(bulkAddBuyersList);
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
      }
      {showMusic && (
        <AddMusic
          show={showMusic}
          setShow={setShowMusic}
          setUploadedMusic={setUploadedMusic}
          setMusicRefresh={setMusicRefresh}
          musicRefresh={musicRefresh}
          listArray={["hold"]}
        />
      )}
    </main>
  );
}

export default FportalCampaignCreate;

// Custom styles for react-select
export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    // border: '1px solid var(--color4)',
    border: "1px solid var(--color4);",
    borderRadius: "3px",
    backgroundColor: "var(--ele-color)",
    outline: "none",
    fontSize: "14px",
    width: "100%",
    minHeight: "35px",
    height: "35px",
    boxShadow: state.isFocused ? "none" : provided.boxShadow,
    "&:hover": {
      borderColor: "var(--ui-accent)",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "32px",
    padding: "0 6px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--form-input-text)",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0",
    color: "var(--form-input-text)",
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
    color: "var(--form-input-text)",
    "&:hover": {
      color: "var(--ui-accent)",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    paddingTop: '2px',
    paddingBottom: '2px',
    backgroundColor: state.isSelected ? "var(--ui-accent)" : "transparent",
    "&:hover": {
      backgroundColor: "#0055cc",
      color: "#fff",
    },
    fontSize: "14px",
    borderBottom: '1px solid var(--border-color)'
  }),
  menu: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    backgroundColor: "var(--ele-color)",
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    margin: 0,
    maxHeight: "150px",
    overflowY: "auto",
    color: "var(--form-input-text)",
  }),
};

