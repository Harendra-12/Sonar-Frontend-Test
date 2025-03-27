/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { useDispatch, useSelector } from "react-redux";
import RechargeWalletPopup from "../Billing/RechargeWalletPopup";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";
import {
  lengthValidator,
  noSpecialCharactersValidator,
  requiredValidator,
  restrictToNumbers,
} from "../../validations/validation";

const option = [
  {
    label: "Voice",
    value: "voice",
  },
  {
    label: "Text",
    value: "text",
  },
  {
    label: "Fax",
    value: "fax",
  },
  {
    label: "Emergency",
    value: "emergency",
  },
];
function GetDid() {
  const accountBalance = useSelector((state) => state.accountBalance)
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const accountDetailsRefresh = useSelector((state) => state.accountDetailsRefresh);
  const dispatch = useDispatch();
  const [did, setDid] = useState();
  const [selectedDid, setSelectedDid] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [availableCountries, setAvailableCountries] = useState([]);
  const [didBuyPopUP, setDidBuyPopUp] = useState(false);
  const [rechargePopUp, setRechargePopUp] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState([
    {
      label: "Voice",
      value: "voice",
    },
  ]);
  const [popUp, setPopUp] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  // Handle TFN search
  const onSubmit = async (data) => {
    setLoading(true);
    const usagePayload = option.reduce((acc, curr) => {
      acc[curr.label] = 0;
      return acc;
    }, {});

    selectedUsage.forEach((item) => {
      usagePayload[item.label] = 1;
    });

    const parsedData = {
      ...data,
      // searchType: data.searchType,
      // quantity: data.quantity,
      // npa: data.npa,
      companyId: account.account_id,
      usage: usagePayload,
    };
    const apiData = await generalPostFunction("/search-number", parsedData);
    setLoading(false);
    if (apiData?.status) {
      setDid(apiData.data);
    } else {
      setDid([]);
      // toast.error(apiData.message)
    }
  };

  //   Add did to selected did when a user click on add button
  function addSelect(item) {
    if (selectedDid.includes(item)) {
    } else {
      setSelectedDid([...selectedDid, item]);
    }
  }

  //   Remove did from selected when a user click on remove did
  function removeDid(item) {
    setSelectedDid(selectedDid.filter((item1) => item1 !== item));
  }

  // OLD LOGIC TO HANDLE SELECT BOX
  // const handleChangeUsage = (newValue) => {
  //   const nonRemovable = { label: "Voice", value: "voice" };

  //   const updatedValue = newValue.filter((option) => option.value !== "voice");
  //   setSelectedUsage([...updatedValue, nonRemovable]);
  // };

  // LOGIC TO HANDLE CHECKBOXES
  const handleChangeUsage = (e) => {
    const nonRemovable = { label: "Voice", value: "voice" };
    const { name, checked } = e.target;
    const updatedValue = { label: name, value: name.toLowerCase() }

    setSelectedUsage((prev) => {
      let newSelection = prev.filter((item) => item.value != updatedValue.value);
      if (checked) {
        newSelection = [...newSelection, updatedValue]
      }
      return [nonRemovable, ...newSelection.filter((item) => item.value !== "voice")];
    })
  };

  // Handle payment
  async function handlePayment() {
    if (paymentMethod === "wallet") {
      const parsedData = {
        companyId: account.account_id,
        vendorId: selectedDid[0].vendorId,
        didQty: selectedDid.length,
        type: "wallet",
        didType: "random",
        rate: Number(selectedDid[0].price) * selectedDid.length,
        accountId: selectedDid[0].vendorAccountId,
        dids: selectedDid.map((item) => {
          return {
            dids: item.id,
          };
        }),
      };
      if (
        Number(accountDetails?.balance?.amount) <
        Number(selectedDid[0].price) * selectedDid.length
      ) {
        toast.error("Wallet balance is low");
      } else {
        setLoading(true);
        setPopUp(false);
        const apiData = await generalPostFunction("/purchaseTfn", parsedData);
        if (apiData.status) {
          setLoading(false);
          toast.success(apiData.message);
          // dispatch({
          //   type: "SET_NEWADDDID",
          //   newAddDid: apiData.data,2
          // });
          dispatch({
            type: "SET_ACCOUNTDETAILSREFRESH",
            accountDetailsRefresh: accountDetailsRefresh + 1,
          });
          setDid();
          setSelectedDid([]);
          navigate("/did-listing");

        } else {
          setLoading(false);
          // const errorMessage = Object.keys(apiData.errors);
          // toast.error(apiData.errors[errorMessage[0]][0]);
          toast.error(apiData.errors);
        }
      }
    } else {
      setDidBuyPopUp(true);
    }
  }

  // Handle callBack for buying pop up
  function handleBuyPopUp(value) {
    setDidBuyPopUp(value);
  }

  // Handle callBack for buying pop up
  function handleRechargePopup(value) {
    setRechargePopUp(value);
  }
  const totalPrice = selectedDid.reduce((total, item) => {
    const price = parseFloat(item.price) || 0; // Convert price string to a number
    return total + price;
  }, 0);

  // Handle All Country Call
  useEffect(() => {
    fetchAllCountry();
  }, [])

  const fetchAllCountry = async () => {
    try {
      const apiData = await generalGetFunction("/available-countries");
      if (apiData?.status) {
        setAvailableCountries(apiData.data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <Header title="DID Management" />

            <div className="overviewTableWrapper pb-2">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Buy A Number</h4>
                        <p>You can purchase a DID here</p>
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12" style={{ padding: "5px 23px 25px" }}>
                  <div className="row">
                    <div className={`formRow col-3`}>
                      <div
                        className="formLabel d-flex justify-content-between"
                        style={{ width: "100%" }}
                      >
                        <label htmlFor="quantity">Country</label>
                        {errors.quantity && (
                          <ErrorMessage text={errors.quantity.message} />
                        )}
                      </div>
                      <div className="col-12">
                        <select className="formItem" defaultValue="US">
                          {availableCountries.length > 0 ? availableCountries.map((item, key) => {
                            return (
                              <option key={key} value={item?.country_code}>
                                <div>
                                  <label>{item?.country} - {item?.country_code}</label>
                                </div>
                              </option>
                            )
                          }) : (
                            <option>No Country Found!</option>
                          )}
                        </select>
                        <label htmlFor="data" className="formItemDesc text-start">
                          Input your preferred country
                        </label>
                      </div>
                    </div>
                    <div />

                    <div className="col-xl-4  mx-auto mt-2">
                      <div className={watch().searchType === "domestic" ? "itemWrapper local-calls a active" : "itemWrapper local-calls a"} onClick={() => setValue('searchType', "domestic")} style={{ cursor: 'pointer' }}>
                        <div className="heading  d-flex justify-content-center align-items-center h-auto">
                          <div className="float-none">
                            <div>
                              <i className="fa-solid fa-phone-flip" />
                              <h5>Local Call</h5>
                              <p>Local voice, fax and application messaging services</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4  mx-auto">
                      <div className={watch().searchType === "tollfree" ? "itemWrapper local-calls a active" : "itemWrapper local-calls a"} onClick={() => setValue('searchType', "tollfree")} style={{ cursor: 'pointer' }}>
                        <div className="heading  d-flex justify-content-center align-items-center h-auto">
                          <div className="float-none">
                            <div>
                              <i className="fa-solid fa-phone-volume" />
                              <h5>Toll Free</h5>
                              <p>Business voice , fax and application messaging services</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4  mx-auto">
                      <div className="itemWrapper local-calls a" style={{ cursor: 'not-allowed' }}>
                        <div className="heading  d-flex justify-content-center align-items-center h-auto">
                          <div className="float-none">
                            <div>
                              <i className="fa-regular fa-comment-dots" />
                              <h5>Shortcode</h5>
                              <p>Enterprising , messaging and Exclusive Ownership</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {(watch().searchType === "tollfree" || watch().searchType === "domestic") && (
                    <div className="row mt-4">
                      <div className={`col-${did ? '3' : '12'}`}>
                        <div className="itemWrapper a" style={{ border: '1px solid var(--border-color)', boxShadow: 'none' }}>
                          <form onSubmit={handleSubmit(onSubmit)} className={`mb-0 ${did ? '' : 'row'}`}>
                            <div className="formRow col-12 d-none">
                              <div className="formLabel">
                                <label htmlFor="searchType">Search Type</label>
                              </div>
                              <div className="col-12">
                                <select
                                  name="searchType"
                                  className={`formItem ${errors.searchType ? "error" : ""
                                    }`}
                                  {...register("searchType", {
                                    ...requiredValidator,
                                  })}
                                  defaultValue={"tollfree"}
                                >
                                  <option value="tollfree">Toll free</option>
                                  <option value="domestic">Domestic</option>
                                </select>
                                {errors.searchType && (
                                  <ErrorMessage text={errors.searchType.message} />
                                )}
                                <label htmlFor="data" className="formItemDesc text-start">
                                  Select the type of DID
                                </label>
                              </div>
                            </div>
                            <div className={`formRow col-${did ? '12' : '2'}`}>
                              <div
                                className="formLabel d-flex justify-content-between"
                                style={{ width: "100%" }}
                              >
                                <label htmlFor="quantity">Quantity</label>
                                {errors.quantity && (
                                  <ErrorMessage text={errors.quantity.message} />
                                )}
                              </div>
                              <div className="col-12">
                                <input
                                  type="number"
                                  name="quantity"
                                  className={`formItem ${errors.quantity ? "error" : ""
                                    }`}
                                  {...register("quantity", {
                                    ...requiredValidator,
                                    ...lengthValidator(1, 10),
                                    ...noSpecialCharactersValidator,
                                  })}
                                  onKeyDown={restrictToNumbers}
                                />
                                <label htmlFor="data" className="formItemDesc text-start">
                                  Input the quantity
                                </label>
                              </div>
                            </div>
                            <div className={`formRow col-${did ? '12' : '3'}`}>
                              <div className="formLabel">
                                <label htmlFor="">Usage</label>
                              </div>
                              <div className="col-12">
                                {/* <Select
                                  options={option}
                                  styles={customStyles}
                                  isMulti
                                  value={selectedUsage}
                                  onChange={handleChangeUsage}
                                  classNamePrefix="select"
                                  placeholder="Select usage..."
                                /> */}
                                <div className="d-flex justify-content-between flex-wrap">
                                  <div className="checkbox-wrapper-4">
                                    <input className="inp-cbx" id="Voice" name="Voice" type="checkbox" defaultChecked={true} onChange={handleChangeUsage} disabled={true} />
                                    <label className="cbx" for="Voice">
                                      <span>
                                        <svg width="12px" height="10px">
                                        </svg>
                                      </span>
                                      <span className="checkBoxLabel">Voice</span>
                                    </label>
                                    <svg className="inline-svg">
                                      <symbol id="check-4" viewBox="0 0 12 10">
                                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                      </symbol>
                                    </svg>
                                  </div>
                                  <div className="checkbox-wrapper-4">
                                    <input className="inp-cbx" id="Text" name="Text" type="checkbox" onChange={handleChangeUsage} />
                                    <label className="cbx" for="Text">
                                      <span>
                                        <svg width="12px" height="10px">
                                        </svg>
                                      </span>
                                      <span className="checkBoxLabel">Text</span>
                                    </label>
                                    <svg className="inline-svg">
                                      <symbol id="check-4" viewBox="0 0 12 10">
                                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                      </symbol>
                                    </svg>
                                  </div>
                                  <div className="checkbox-wrapper-4">
                                    <input className="inp-cbx" id="Fax" name="Fax" type="checkbox" onChange={handleChangeUsage} />
                                    <label className="cbx" for="Fax">
                                      <span>
                                        <svg width="12px" height="10px">
                                        </svg>
                                      </span>
                                      <span className="checkBoxLabel">Fax</span>
                                    </label>
                                    <svg className="inline-svg">
                                      <symbol id="check-4" viewBox="0 0 12 10">
                                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                      </symbol>
                                    </svg>
                                  </div>
                                  <div className="checkbox-wrapper-4">
                                    <input className="inp-cbx" id="Emergency" name="Emergency" type="checkbox" onChange={handleChangeUsage} />
                                    <label className="cbx" for="Emergency">
                                      <span>
                                        <svg width="12px" height="10px">
                                        </svg>
                                      </span>
                                      <span className="checkBoxLabel">Emergency</span>
                                    </label>
                                    <svg className="inline-svg">
                                      <symbol id="check-4" viewBox="0 0 12 10">
                                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                      </symbol>
                                    </svg>
                                  </div>
                                </div>
                                <label htmlFor="data" className="formItemDesc text-start">
                                  Set how the Destination will be used
                                </label>
                              </div>
                            </div>
                            <div />
                            {
                              watch().searchType === "domestic" ? <>
                                <div className={`formRow col-${did ? '12' : '3'}`}>
                                  <div className="formLabel">
                                    <label htmlFor="searchBy">Search By</label>
                                  </div>
                                  <div className="col-12">
                                    <select
                                      name="searchBy"
                                      className={`formItem ${errors.searchBy ? "error" : ""
                                        }`}
                                      {...register("searchBy", {
                                        ...requiredValidator,
                                      })}
                                      defaultValue={"npa"}
                                    >
                                      <option value="npa">First 3 Digit (Area Code)</option>
                                      <option value="npanxx">First 6 Digits (Area + Exchange Code)</option>
                                      <option value="ratecenter">Rate Center</option>
                                    </select>
                                    {errors.searchBy && (
                                      <ErrorMessage text={errors.searchBy.message} />
                                    )}
                                    <label htmlFor="data" className="formItemDesc text-start">
                                      Select the type of domestic DID
                                    </label>
                                  </div>
                                </div>
                              </> : ""
                            }
                            {
                              (watch().searchBy === "npa" || watch().searchBy === "npanxx" || watch().searchType === "tollfree" || !watch().searchBy) && <>
                                <div className={`formRow col-${did ? '12' : '3'}`}>
                                  <div className="col-12">
                                    <div
                                      className="formLabel d-flex justify-content-between"
                                      style={{ maxWidth: "100%" }}
                                    >
                                      <label htmlFor="npa">First 3 Digits</label>
                                      {errors.npa && (
                                        <ErrorMessage text={errors.npa.message} />
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <input
                                      type="number"
                                      name="npa"
                                      className={`formItem ${errors.npa ? "error" : ""}`}
                                      {...register("npa", {
                                        ...(watch("searchBy") === "npanxx" ? requiredValidator : {}),
                                        ...lengthValidator(3, 3),
                                        ...noSpecialCharactersValidator,
                                      })}
                                    />
                                    <label htmlFor="data" className="formItemDesc text-start">
                                      Input the first 3 digits (NPA - Area Code) of the DID
                                    </label>
                                  </div>
                                </div>
                              </>
                            }

                            {
                              (watch().searchBy === "npanxx" && watch().searchType === "domestic") && <>
                                <div className={`formRow col-${did ? '12' : '3'}`}>
                                  <div className="col-12">
                                    <div
                                      className="formLabel d-flex justify-content-between"
                                      style={{ maxWidth: "100%" }}
                                    >
                                      <label htmlFor="nxx">Next 3 Digits</label>
                                      {errors.nxx && (
                                        <ErrorMessage text={errors.nxx.message} />
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <input
                                      type="number"
                                      name="nxx"
                                      className={`formItem ${errors.nxx ? "error" : ""}`}
                                      {...register("nxx", {
                                        ...requiredValidator,
                                        ...lengthValidator(3, 3),
                                        ...noSpecialCharactersValidator,
                                      })}
                                    />
                                    <label htmlFor="data" className="formItemDesc text-start">
                                      Input the next 3 digits (NXX - Exchange Code) of a DID
                                    </label>
                                  </div>
                                </div>
                              </>
                            }


                            {
                              (watch().searchBy === "ratecenter" && watch().searchType === "domestic") && <>
                                <div className={`formRow col-${did ? '12' : '2'}`}>
                                  <div
                                    className="formLabel d-flex justify-content-between"
                                    style={{ width: "100%" }}
                                  >
                                    <label htmlFor="rateCenter">Rate Center</label>
                                    {errors.rateCenter && (
                                      <ErrorMessage text={errors.rateCenter.message} />
                                    )}
                                  </div>
                                  <div className="col-12">
                                    <input
                                      type="string"
                                      name="rateCenter"
                                      className={`formItem ${errors.rateCenter ? "error" : ""}`}
                                      {...register("rateCenter", {
                                        // ...requiredValidator
                                      })}
                                    />
                                    <label htmlFor="data" className="formItemDesc text-start">
                                      Input the rate center for the DID
                                    </label>
                                  </div>
                                </div>
                                <div className={`formRow col-${did ? '12' : '2'}`}>
                                  <div
                                    className="formLabel d-flex justify-content-between"
                                    style={{ width: "100%" }}
                                  >
                                    <label htmlFor="state">State</label>
                                    {errors.state && (
                                      <ErrorMessage text={errors.state.message} />
                                    )}
                                  </div>
                                  <div className="col-12">
                                    <input
                                      type="state"
                                      name="state"
                                      className={`formItem ${errors.state ? "error" : ""}`}
                                      {...register("state", {
                                        ...requiredValidator
                                      })}
                                    />
                                    <label htmlFor="data" className="formItemDesc text-start">
                                      Input the state for the DID
                                    </label>
                                  </div>
                                </div>
                                <div className={`formRow col-${did ? '12' : '2'}`}>
                                  <div className="formLabel">
                                    <label htmlFor="contiguous">Contiguous</label>
                                  </div>
                                  <div className="col-12">
                                    <select
                                      name="contiguous"
                                      className={`formItem ${errors.contiguous ? "error" : ""
                                        }`}
                                      {...register("contiguous", {
                                        ...requiredValidator,
                                      })}
                                      defaultValue={1}
                                    >
                                      <option value={1}>True</option>
                                      <option value={0}>False</option>
                                    </select>
                                    {errors.contiguous && (
                                      <ErrorMessage text={errors.contiguous.message} />
                                    )}
                                    <label htmlFor="data" className="formItemDesc text-start">
                                      Select the type of domestic DID
                                    </label>
                                  </div>
                                </div>
                              </>
                            }

                            <div className="formRow col">
                              <div className="col-12">
                                <div className="formLabel">
                                  <label htmlFor=""></label>
                                </div>
                                <button
                                  effect="ripple"
                                  className="panelButton m-0"
                                  type="submit"
                                >
                                  <span className="text">Search</span>
                                  <span className="icon">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                  </span>
                                </button>
                                <label
                                  htmlFor="data"
                                  className="formItemDesc text-start"
                                ></label>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="col-9">
                        <div className="row">
                          <div className={`col-${selectedDid.length === 0 ? '12' : '9'}`}>
                            {did && (
                              <div className="tableContainer mt-0" style={{ borderRadius: '10px' }}>
                                <table>
                                  <thead>
                                    <tr>
                                      <th>Number</th>
                                      <th>Capabilities</th>
                                      <th>Cost</th>
                                      <th style={{ width: '100px' }}>Add To Cart</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {did.length === 0 ? (
                                      <tr>
                                        <td colSpan={99}>No TFN Available</td>
                                      </tr>
                                    ) : (
                                      <>
                                        {did.map((item) => {

                                          return (
                                            <tr>
                                              <td>{item.didSummary}</td>
                                              <td>
                                                <div className="d-flex align-items-center" style={{ color: "var(--ui-accent)" }}>
                                                  {
                                                    selectedUsage.map((item, key) => {
                                                      if (item.label === "Voice") {
                                                        return (
                                                          <i className="fa-solid m-1 fa-phone" key={key}></i>
                                                        )
                                                      } else if (item.label === "Text") {
                                                        return (
                                                          <i className="fa-regular m-1 fa-comments" key={key}></i>
                                                        )
                                                      } else if (item.label === "Fax") {
                                                        return (
                                                          <i className="fa-solid m-1 fa-fax" key={key}></i>
                                                        )
                                                      } else if (item.label === "Emergency") {
                                                        return (
                                                          <i className="fa-regular m-1 fa-light-emergency-on" key={key}></i>
                                                        )
                                                      }
                                                    })
                                                  }
                                                </div>
                                              </td>
                                              <td>{item.price} - {item.currency}</td>
                                              <td>
                                                <button
                                                  style={{ cursor: "pointer" }}
                                                  onClick={() => selectedDid.includes(item) ? removeDid(item) : addSelect(item)}
                                                  className={
                                                    selectedDid.includes(item)
                                                      ? "tableButton delete float-end"
                                                      : "tableButton float-end"
                                                  }
                                                >
                                                  {selectedDid.includes(item) ? (
                                                    <i className="fa-solid fa-xmark"></i>
                                                  ) : (
                                                    <i className="fa-solid fa-plus"></i>
                                                  )}{" "}
                                                </button>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                          {selectedDid.length === 0 ? (
                            ""
                          ) : (
                            <div className="col-3">
                              <div className="searchList cart shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                <div className="heading mb-2 px-0 py-1 bg-transparent">
                                  <h5>Order Summary</h5>
                                </div>
                                <div className="wrapper">
                                  <ul style={{ maxHeight: '225px', overflowY: 'auto' }}>
                                    {selectedDid.map((item) => {
                                      return (
                                        <li>
                                          {item.didSummary}{" "}
                                          <span className="float-end">${item.price}</span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                  <ul>
                                    <li className="border-black text-dark" style={{ fontSize: 14, paddingTop: '3px', borderTop: '1px solid var(--border-color)' }}>
                                      <b>Total: </b>{" "}
                                      <span className="float-end">
                                        <b>
                                          $
                                          {totalPrice}
                                        </b>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="searchList checkout mt-3 shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                <div className="heading mb-2 px-0 py-1 bg-transparent">
                                  <h5>Payment Method</h5>
                                </div>
                                <div className="wrapper">
                                  <ul>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                      <li className="me-2 col mb-0">
                                        <i
                                          className="fa-duotone fa-wallet me-2"
                                          style={{ color: "var(--ui-accent)" }}
                                        ></i>{" "}
                                        Wallet{" "}
                                        <span style={{ float: 'inline-end', fontSize: '14px' }}>${accountBalance}</span>
                                        <input
                                          type="radio"
                                          checked={
                                            paymentMethod === "wallet" ? true : false
                                          }
                                          name="fav_language"
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setPaymentMethod("wallet");
                                            }
                                          }}
                                        ></input>{" "}
                                        <span className="checkmark"></span>
                                      </li>
                                      {totalPrice > Number(accountBalance) ? <div className="col-auto">
                                        <button className="tableButton edit" onClick={() => setRechargePopUp(true)}>
                                          <i className="fa-solid fa-dollar-sign" />
                                        </button>
                                      </div> : ""
                                      }

                                    </div>
                                    <li>
                                      <i
                                        className="fa-duotone fa-credit-card me-2"
                                        style={{ color: "var(--ui-accent)" }}
                                      ></i>{" "}
                                      Credit Card{" "}
                                      <input
                                        type="radio"
                                        checked={paymentMethod === "card" ? true : false}
                                        name="fav_language"
                                        onChange={(e) => {
                                          if (e.target.checked) {
                                            setPaymentMethod("card");
                                          }
                                        }}
                                      ></input>{" "}
                                      <span className="checkmark"></span>
                                    </li>
                                  </ul>
                                  <button
                                    className="panelButton static"
                                    // onClick={handlePayment}
                                    onClick={() => setPopUp(true)}
                                  >
                                    <span className="text">Pay Now</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {didBuyPopUP ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <RechargeWalletPopup
                closePopup={handleBuyPopUp}
                rechargeType={"buyDid"}
                selectedDid={selectedDid}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {rechargePopUp ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <RechargeWalletPopup
                closePopup={handleRechargePopup}
                rechargeType={"rechargeWallet"}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {loading ? <CircularLoader /> : ""}
      {popUp ? (
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
                    Are you sure you want to purchase{" "}
                    {selectedDid?.length > 1 ? "these" : "this"} DID?
                  </p>
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="panelButton m-0 float-end"
                      onClick={() => handlePayment()}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon"><i className="fa-solid fa-check" /></span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setPopUp(false);
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon"><i className="fa-solid fa-xmark" /></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </main>
  );
}

export default GetDid;
