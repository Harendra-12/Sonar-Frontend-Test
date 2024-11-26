import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";
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
    borderRadius: "3px",
    outline: "none",
    fontSize: "14px",
    width: "100%",
    minHeight: "34px",
    height: "auto",
    boxShadow: state.isFocused ? "none" : provided.boxShadow,
    "&:hover": {
      borderColor: "none",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "auto",
    padding: "0 3px",
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
function GetDid() {
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const accountDetailsRefresh = useSelector(
    (state) => state.accountDetailsRefresh
  );
  const dispatch = useDispatch();
  const [did, setDid] = useState();
  const [selectedDid, setSelectedDid] = useState([]);
  const [searchType, setSearchType] = useState("tollfree");
  const [quantity, setQuantity] = useState("");
  const [npa, setNpa] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [didBuyPopUP, setDidBuyPopUp] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState([
    {
      label: "Voice",
      value: "voice",
    },
  ]);
  const {
    register,
    handleSubmit,
    formState: { errors },
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
      searchType: data.searchType,
      quantity: data.quantity,
      npa: data.npa,
      companyId: account.account_id,
      usage: usagePayload,
    };
    const apiData = await generalPostFunction("/searchTfn", parsedData);
    setLoading(false);
    if (apiData?.status) {
      setDid(apiData.data);
    } else {
      setDid([]);
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
        const apiData = await generalPostFunction("/purchaseTfn", parsedData);
        if (apiData.status) {
          setLoading(false);
          toast.success(apiData.message);
          dispatch({
            type: "SET_ACCOUNTDETAILSREFRESH",
            accountDetailsRefresh: accountDetailsRefresh + 1,
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
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <Header title="Get DID" />

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
                <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                  <form onSubmit={handleSubmit(onSubmit)} className="mb-0">
                    <div className="row col-xl-12">
                      <div className="formRow col-xl-2">
                        <div className="formLabel">
                          <label htmlFor="searchType">Search Type</label>
                        </div>
                        <div className="col-12">
                          <select
                            name="searchType"
                            className={`formItem ${errors.searchType ? "error" : ""
                              }`}
                            {...register("searchType", { ...requiredValidator })}
                          >
                            <option value="tollfree">Toll free</option>
                          </select>
                          {errors.searchType && (
                            <ErrorMessage text={errors.searchType.message} />
                          )}
                          <label htmlFor="data" className="formItemDesc">Select the type of DID</label>
                        </div>
                      </div>
                      <div className="formRow col-xl-2">
                        <div className="formLabel d-flex justify-content-between" style={{ width: '100%' }}>
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

                          <label htmlFor="data" className="formItemDesc">Input the quantity</label>
                        </div>
                      </div>
                      <div className="formRow col-xl-auto">
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
                          <label htmlFor="data" className="formItemDesc">
                            Set how the Destination will be used
                          </label>
                        </div>
                      </div>
                      <div className="formRow col-xl-2">
                        <div className="formLabel d-flex justify-content-between" style={{ width: '100%' }}>
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

                          <label htmlFor="data" className="formItemDesc">Input the NPA for the DID</label>
                        </div>
                      </div>
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
                            <span className="icon"><i class="fa-solid fa-magnifying-glass"></i></span>
                          </button>
                          <label htmlFor="data" className="formItemDesc"></label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="mx-2">
              <div className="row mt-3 col-xl-12 px-3">
                {did && (
                  <div className="col-xl-5">
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
                                      className={selectedDid.includes(item) ? "tableButton edit float-end" : "tableButton float-end"}
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
                  <div className="col-xl-4">
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
                                <span className="float-end">
                                  ${item.price}
                                </span>
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
                              checked={
                                paymentMethod === "card" ? true : false
                              }
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
                        <button className="payNow" onClick={handlePayment}>
                          Pay Now{" "}
                          <i class="fa-sharp fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>


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
