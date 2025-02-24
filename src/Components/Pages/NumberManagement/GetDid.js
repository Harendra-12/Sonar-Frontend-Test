import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { useDispatch, useSelector } from "react-redux";
import RechargeWalletPopup from "../Billing/RechargeWalletPopup";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import Header from "../../CommonComponents/Header";
import Select from "react-select";
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
// Custom styles for react-select
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    // border: '1px solid var(--color4)',
    border: "1px solid var(--color4)",
    backgroundColor: "var(--ele-color)",
    borderRadius: "3px",
    outline: "none",
    fontSize: "14px",
    width: "100%",
    minHeight: "34px",
    height: "32px",
    boxShadow: state.isFocused ? "none" : provided.boxShadow,
    "&:hover": {
      borderColor: "var(--ui-accent)",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "auto",
    padding: "0 3px",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--form-input-text)",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "var(--border-color)",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "var(--form-input-text)",
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
    height: "30px",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "var(--form-input-text)",
  }),
  option: (provided, state) => ({
    ...provided,
    paddingLeft: "15px",
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: state.isSelected ? "var(--ele-color)" : "var(--ele-color)",
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
    backgroundColor: "var(--ele-color)",
  }),
};
function GetDid() {
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const updateBalance = useSelector((state) => state.updateBalance);
  const accountDetails = useSelector((state) => state.accountDetails);
  const accountDetailsRefresh = useSelector(
    (state) => state.accountDetailsRefresh
  );
  const dispatch = useDispatch();
  const [did, setDid] = useState();
  const [selectedDid, setSelectedDid] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [didBuyPopUP, setDidBuyPopUp] = useState(false);
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
      toast.error(apiData.message)
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

  const handleChangeUsage = (newValue) => {
    const nonRemovable = { label: "Voice", value: "voice" };

    const updatedValue = newValue.filter((option) => option.value !== "voice");
    setSelectedUsage([...updatedValue, nonRemovable]);
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
          dispatch({
            type: "SET_UPDATEBALANCE",
            updateBalance: updateBalance + 1,
          });
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
  console.log(watch());
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
                        <h4>Get DID</h4>
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
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12" style={{ padding: "25px 23px" }}>
                  <div className="row">
                    <div className="col-xl-4  mx-auto">
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
                      <div className="col-3">
                        <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                          <form onSubmit={handleSubmit(onSubmit)} className="mb-0">
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
                            <div className="formRow col-12">
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
                            <div className="formRow col-12">
                              <div className="formLabel">
                                <label htmlFor="">Usage</label>
                              </div>
                              <div className="col-12">
                                <Select
                                  options={option}
                                  styles={customStyles}
                                  isMulti
                                  value={selectedUsage}
                                  onChange={handleChangeUsage}
                                  classNamePrefix="select"
                                  placeholder="Select usage..."
                                />
                                <label htmlFor="data" className="formItemDesc text-start">
                                  Set how the Destination will be used
                                </label>
                              </div>
                            </div>
                            {
                              watch().searchType === "domestic" ? <>
                                <div className="formRow col-12">
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
                                      <option value="npa">NPA</option>
                                      <option value="npanxx">NPANXX</option>
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
                                <div className="formRow col-12">
                                  <div
                                    className="formLabel d-flex justify-content-between"
                                    style={{ width: "100%" }}
                                  >
                                    <label htmlFor="npa">NPA</label>
                                    {errors.npa && (
                                      <ErrorMessage text={errors.npa.message} />
                                    )}
                                  </div>
                                  <div className="col-12">
                                    <input
                                      type="number"
                                      name="npa"
                                      className={`formItem ${errors.npa ? "error" : ""}`}
                                      {...register("npa", {
                                        ...requiredValidator,
                                        ...lengthValidator(3, 3),
                                        ...noSpecialCharactersValidator,
                                      })}
                                    />
                                    <label htmlFor="data" className="formItemDesc text-start">
                                      Input the NPA for the DID
                                    </label>
                                  </div>
                                </div>
                              </>
                            }

                            {
                              (watch().searchBy === "npanxx" && watch().searchType === "domestic") && <>
                                <div className="formRow col-12">
                                  <div
                                    className="formLabel d-flex justify-content-between"
                                    style={{ width: "100%" }}
                                  >
                                    <label htmlFor="nxx">NXX</label>
                                    {errors.nxx && (
                                      <ErrorMessage text={errors.nxx.message} />
                                    )}
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
                                      Input the nxx for the DID
                                    </label>
                                  </div>
                                </div>
                              </>
                            }


                            {
                              (watch().searchBy === "ratecenter" && watch().searchType === "domestic") && <>
                                <div className="formRow col-12">
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
                                      Input the rateCenter for the DID
                                    </label>
                                  </div>
                                </div>
                                <div className="formRow col-12">
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
                                <div className="formRow col-12">
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
                                    <i class="fa-solid fa-magnifying-glass"></i>
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
                                                <div class="d-flex align-items-center" style={{ color: "var(--ui-accent)" }}>
                                                  <i class="fa-solid m-1 fa-phone"></i>
                                                  <i class="fa-regular m-1 fa-comments"></i>
                                                  <i class="fa-solid m-1 fa-fax"></i>
                                                  <i class="fa-regular m-1 fa-light-emergency-on"></i>
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
                                                    <i class="fa-solid fa-xmark"></i>
                                                  ) : (
                                                    <i class="fa-solid fa-plus"></i>
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
                                <div className="heading mb-3 px-0 bg-transparent">
                                  <h5>Order Summary</h5>
                                </div>
                                <div className="wrapper">
                                  <ul>
                                    {selectedDid.map((item) => {
                                      return (
                                        <li>
                                          {item.didSummary}{" "}
                                          <span className="float-end">${item.price}</span>
                                        </li>
                                      );
                                    })}
                                    <li className="border-black">
                                      <b>Total: </b>{" "}
                                      <span className="float-end">
                                        <b>
                                          $
                                          {selectedDid.reduce((total, item) => {
                                            const price = parseFloat(item.price) || 0;
                                            return total + price;
                                          }, 0)}
                                        </b>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>

                              <div className="searchList checkout mt-3 shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                <div className="heading mb-3 px-0 bg-transparent">
                                  <h5>Payment Method</h5>
                                </div>
                                <div className="wrapper">
                                  <ul>
                                    <li>
                                      <i
                                        class="fa-duotone fa-wallet me-2"
                                        style={{ color: "var(--ui-accent)" }}
                                      ></i>{" "}
                                      Wallet{" "}
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
                                    <li>
                                      <i
                                        class="fa-duotone fa-credit-card me-2"
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
                                    <span class="text">Pay Now</span>
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

            {/* <div className="mx-2">
              <div className="row mt-3 col-xl-12 px-3">
                {did && (
                  <div className="col-xl-5 mb-3 mb-xl-0">
                    <div className="searchList">
                      <div className="heading">
                        <h5>Available DID</h5>
                      </div>

                      <div className="wrapper">
                        {did.length === 0 ? (
                          <ul>
                            <li>No TFN Available</li>
                          </ul>
                        ) : (
                          <>
                            <ul>
                              {did.map((item) => {
                                return (
                                  <li>
                                    {item.didSummary}{" "}
                                    <button
                                      style={{ cursor: "pointer" }}
                                      onClick={() => addSelect(item)}
                                      className={
                                        selectedDid.includes(item)
                                          ? "tableButton edit float-end"
                                          : "tableButton float-end"
                                      }
                                    >
                                      {selectedDid.includes(item) ? (
                                        <i class="fa-solid fa-check text-info"></i>
                                      ) : (
                                        <i class="fa-solid fa-plus"></i>
                                      )}{" "}
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {selectedDid.length === 0 ? (
                  ""
                ) : (
                  <div className="col-xl-4 mb-3 mb-xl-0">
                    <div className="searchList">
                      <div className="heading">
                        <h5>Added DID</h5>
                      </div>
                      <div className="wrapper">
                        <ul>
                          {selectedDid.map((item) => {
                            return (
                              <li>
                                {item.didSummary}{" "}
                                <span
                                  style={{ cursor: "pointer" }}
                                  onClick={() => removeDid(item)}
                                  className="float-end tableButton delete"
                                >
                                  <i class="fa-solid fa-trash"></i>
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                {selectedDid.length === 0 ? (
                  ""
                ) : (
                  <div className="col-xl-3">
                    <div className="searchList cart">
                      <div className="heading">
                        <h5>Order Summary</h5>
                      </div>
                      <div className="wrapper">
                        <ul>
                          {selectedDid.map((item) => {
                            return (
                              <li>
                                {item.didSummary}{" "}
                                <span className="float-end">${item.price}</span>
                              </li>
                            );
                          })}
                          <li className="border-black">
                            <b>Total: </b>{" "}
                            <span className="float-end">
                              <b>
                                $
                                {selectedDid.reduce((total, item) => {
                                  const price = parseFloat(item.price) || 0;
                                  return total + price;
                                }, 0)}
                              </b>
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="searchList checkout mt-3">
                      <div className="heading">
                        <h5>Payment Method</h5>
                      </div>
                      <div className="wrapper">
                        <ul>
                          <li>
                            <i
                              class="fa-duotone fa-wallet me-2"
                              style={{ color: "var(--ui-accent)" }}
                            ></i>{" "}
                            Wallet{" "}
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
                          <li>
                            <i
                              class="fa-duotone fa-credit-card me-2"
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
                          <span class="text">Pay Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div> */}

            {/* <div
              className="d-flex flex-wrap justify-content-end px-xl-3 py-2 position-relative"
              style={{ zIndex: 1 }}
              id="detailsHeader"
            >
              <div className="col-xl-8 pt-3 pt-xl-0">
                <div className="d-flex justify-content-end">
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={() => {
                      navigate(-1);
                      backToTop();
                    }}
                  >
                    <span className="text">Back</span>
                    <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                  </button>
                </div>
              </div>
            </div> */}
            <div className="col-xl-12 px-0">
              {/* {loading ?
                  <div colSpan={99}><CircularLoader /></div> : ""} */}
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
                      <span class="text">Confirm</span>
                      <span class="icon"><i className="fa-solid fa-check" /></span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setPopUp(false);
                      }}
                    >
                      <span class="text">Cancel</span>
                      <span class="icon"><i className="fa-solid fa-xmark" /></span>
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
      {/* <ToastContainer
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
      /> */}
    </main>
  );
}

export default GetDid;
