import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularLoader from "../Misc/CircularLoader";

function GetDid() {
  const navigate = useNavigate();
  const [did, setDid] = useState();
  const [selectedDid, setSelectedDid] = useState([]);
  const [searchType, setSearchType] = useState("tollfree");
  const [quantity, setQuantity] = useState("");
  const [npa, setNpa] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (quantity === "") {
      toast.error("Please enter quantity");
    } else if (quantity > 10) {
      toast.error("Please enetr quantity less than 10");
    } else if (npa === "") {
      toast.error("please enter a npa");
    } else if (String(npa).length !== 3) {
      toast.error("NPA must be 3 digit");
    } else {
      setLoading(true);
      const parsedData = {
        searchType: searchType,
        quantity: quantity,
        npa: npa,
      };
      const apiData = await generalPostFunction("/searchTfn", parsedData);
      if (apiData.status) {
        setLoading(false);
        setDid(apiData.data);
      } else {
        setLoading(false);
        setDid([]);
      }
    }
  }

  //   Add did to selected did when a user click on add button
  function addSelect(item) {
    if (selectedDid.includes(item)) {
      console.log("Previously available", selectedDid);
    } else {
      setSelectedDid([...selectedDid, item]);
    }
  }

  //   Remove did from selected when a user click on remove did
  function removeDid(item) {
    setSelectedDid(selectedDid.filter((item1) => item1 !== item));
  }

  useEffect(()=>{
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Camera access is available
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          console.log('Camera is available');
          // Do something if camera is available
        })
        .catch(function(error) {
          console.log('Error accessing camera:', error);
          // Do something if camera access is denied or unavailable
        });
    } else {
      console.log('Camera access is not supported');
      // Do something if camera access is not supported
    }
  },[])
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12" id="subPageHeader">
              <div className="row px-xl-3">
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
                <div className="row col-xl-9">
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Search Type</label>
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem w-100"
                        name=""
                        id="selectFormRow"
                      >
                        <option value="tollfree">Toll free</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Select the search type.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-4">
                    <div className="formLabel">
                      <label htmlFor="">Quantity</label>
                      {/* <label className="status missing">Field missing</label> */}
                    </div>
                    <div className="col-12">
                      <input
                        type="number"
                        name="extension"
                        className="formItem"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required="required"
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the quantity of TFN you want
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-4">
                    <div className="formLabel">
                      <label htmlFor="">NPA</label>
                      {/* <label className="status missing">Field missing</label> */}
                    </div>
                    <div className="col-12">
                      <input
                        type="number"
                        name="extension"
                        className="formItem"
                        value={npa}
                        onChange={(e) => setNpa(e.target.value)}
                        required="required"
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the starting digit
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-1">
                    <div className="formLabel">
                      <label htmlFor=""></label>
                    </div>
                    <div className="col-12">
                      <button
                        effect="ripple"
                        className="panelButton m-0"
                        onClick={handleSubmit}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
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
                                        {selectedDid.includes(item)?<i class="fa-duotone fa-square-check text-info"></i>:
                                        <i class="fa-duotone fa-square-plus"></i>}{" "}
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
                    <div className="col-xl-3" style={{ marginTop: '-120px' }}>
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
                              <input type="radio" name="fav_language"></input>{" "}
                              <span className="checkmark"></span>
                            </li>
                            <li>
                              <i
                                class="fa-duotone fa-credit-card me-2"
                                style={{ color: "var(--ui-accent)" }}
                              ></i>{" "}
                              Credit Card{" "}
                              <input type="radio" name="fav_language"></input>{" "}
                              <span className="checkmark"></span>
                            </li>
                          </ul>
                          <button className="payNow">
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
      {loading ? <CircularLoader /> : ""}
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
}

export default GetDid;
