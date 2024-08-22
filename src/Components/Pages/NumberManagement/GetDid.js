import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../../Loader/CircularLoader";
import { useDispatch, useSelector } from "react-redux";
import RechargeWalletPopup from "../Billing/RechargeWalletPopup";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle TFN search
  const onSubmit = async (data) => {
    setLoading(true);
    const parsedData = {
      searchType: data.searchType,
      quantity: data.quantity,
      npa: data.npa,
      companyId: account.account_id,
    };
    const apiData = await generalPostFunction("/searchTfn", parsedData);
    setLoading(false);
    if (apiData.status) {
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
            <div className="col-12" id="subPageHeader">
              <div className="row px-xl-3 col-12">
                <div className="col-xl-6 my-auto">
                  <h4 className="my-auto">Get DID</h4>
                </div>
                <div className="col-xl-6 ps-2">
                  <div className="d-flex justify-content-end">
                    <button
                      effect="ripple"
                      className="panelButton"
                      onClick={() => {
                        navigate(-1);
                        backToTop();
                      }}
                    >
                      Back
                    </button>
                    <button effect="ripple" className="panelButton">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12 px-0">
              {/* {loading ?
                  <div colSpan={99}><CircularLoader /></div> : ""} */}
              <div className="mx-2" id="detailsContent">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row col-xl-9">
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="searchType">Search Type</label>
                      </div>
                      <div className="col-12">
                        <select
                          name="searchType"
                          className={`formItem ${errors.searchType ? "error" : ""
                            }`}
                          {...register("searchType", {
                            required: "Search Type is required",
                          })}
                        >
                          <option value="tollfree">Toll free</option>
                        </select>
                        {errors.searchType && (
                          <ErrorMessage text={errors.searchType.message} />
                        )}
                      </div>
                    </div>
                    <div className="formRow col-xl-4">
                      <div className="formLabel">
                        <label htmlFor="quantity">Quantity</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="number"
                          name="quantity"
                          className={`formItem ${errors.quantity ? "error" : ""
                            }`}
                          {...register("quantity", {
                            required: "Quantity is required",
                            max: {
                              value: 10,
                              message:
                                "Quantity must be less than or equal to 10",
                            },
                          })}
                        />
                        {errors.quantity && (
                          <ErrorMessage text={errors.quantity.message} />
                        )}
                      </div>
                    </div>
                    <div className="formRow col-xl-4">
                      <div className="formLabel">
                        <label htmlFor="npa">NPA</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="number"
                          name="npa"
                          className={`formItem ${errors.npa ? "error" : ""}`}
                          {...register("npa", {
                            required: "NPA is required",
                            minLength: {
                              value: 3,
                              message: "NPA must be 3 digits",
                            },
                            maxLength: {
                              value: 3,
                              message: "NPA must be 3 digits",
                            },
                          })}
                        />
                        {errors.npa && (
                          <ErrorMessage text={errors.npa.message} />
                        )}
                      </div>
                    </div>
                    <div className="formRow col-1">
                      <div className="col-12">
                        <div className="formLabel">
                          <label htmlFor=""></label>
                        </div>
                        <button
                          effect="ripple"
                          className="panelButton m-0"
                          type="submit"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                <div className="row mt-3 col-xl-12">
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
                                      <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() => addSelect(item)}
                                        className="float-end clearButton text-success fw-medium"
                                      >
                                        {selectedDid.includes(item) ? (
                                          <i class="fa-duotone fa-square-check text-info"></i>
                                        ) : (
                                          <i class="fa-duotone fa-square-plus"></i>
                                        )}{" "}
                                      </span>
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
                                    className="float-end clearButton text-danger fw-medium"
                                  >
                                    <i class="fa-duotone fa-trash"></i>
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
                    <div className="col-xl-3" style={{ marginTop: "-90px" }}>
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
