/* eslint-disable no-unused-vars */
import { CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useState } from "react";
import {
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ConfigureStepDashboard({ account2 }) {
  const account = useSelector((state) => state.account);
  const accountDetails = useSelector((state) => state.accountDetails);
  const [configure, setConfigure] = useState(false);
  const [npx, setNpx] = useState("");
  const [didSearch, setDidSearch] = useState(true);
  const [didRawData, setDidRawData] = useState();
  const [purchingDid, setPurchingDid] = useState("");
  const [did, setDid] = useState("");
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [searchingDid, setSearchingDid] = useState(false);
  const [configuringExtension, setConfiguringExtension] = useState(false);
  const [configuringRole, setConfiguringRole] = useState(false);
  const [configuredPurchase, setConfiguredPurchase] = useState(false);
  const [configuredExtension, setConfiguredExtension] = useState(false);
  const [configuredRole, setConfiguredRole] = useState(false);
  const availableUsers = accountDetails?.extensions?.length || 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function searchDid() {
    if (npx.length < 3) {
      toast.error("NPX must be  3 characters");
    } else {
      setSearchingDid(true);
      const parsedData = {
        searchType: "tollfree",
        quantity: "1",
        npa: Number(npx),
        companyId: account.account_id,
        country: "US"
      };
      const apiData = await generalPostFunction("/search-number", parsedData);
      if (apiData.status) {
        setSearchingDid(false);
        setDidRawData(apiData);
        setDid(apiData.data[0].id);
      } else {
        setSearchingDid(false);
        setDidRawData(apiData);
        setDid("No DID found with the given NPX");
      }
    }
  }

  async function takeDid() {
    setPurchingDid(true);
    const parsedData = {
      companyId: account.account_id,
      vendorId: didRawData.data[0].vendorId,
      didQty: 1,
      type: "configure",
      didType: "random",
      rate: Number(didRawData.data[0].price),
      accountId: didRawData.data[0].vendorAccountId,
      dids: [
        {
          did: didRawData.data[0].id,
          vendorId: didRawData.data[0].vendorId,
        },
      ],
    };
    const apiData = await generalPostFunction("/purchaseTfn", parsedData);
    if (apiData.status) {
      setConfiguredPurchase(true);

      setConfiguringExtension(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setConfiguredExtension(true);

      setConfiguringRole(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setConfiguredRole(true);

      setPurchaseComplete(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const profile = await generalGetFunction("/user");
      if (profile?.status) {
        dispatch({
          type: "SET_ACCOUNT",
          account: profile.data,
        });
        dispatch({
          type: "SET_BILLINGLISTREFRESH",
          billingListRefresh: 1,
        });
        dispatch({
          type: "SET_CARDLISTREFRESH",
          cardListRefresh: 1,
        });
        localStorage.setItem("account", JSON.stringify(profile.data));
        const accountData = await generalGetFunction(
          `/account/${profile.data.account_id}`
        );
        if (accountData?.status) {
          dispatch({
            type: "SET_ACCOUNTDETAILS",
            accountDetails: accountData.data,
          });
          localStorage.setItem(
            "accountDetails",
            JSON.stringify(accountData.data)
          );
          navigate("/did-listing");
        } else {
          setPurchingDid(false);
          toast.error("Server error !");
        }
      } else {
        setPurchingDid(false);
        toast.error("unauthorized access!");
      }
    }
  }

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
            <div className="profileView">
              <div className="profileDetailsHolder shadow-none position-relative">
                <div className="contentFinal">
                  <h2>
                    Congratulations<span>!</span>
                  </h2>
                  <p>
                    You are at the final step of getting access to <b>Angel PBX</b>,
                    please <span>configure your account</span> to proceed further.
                  </p>

                  {account2.company_status === "5" ? (
                    ""
                  ) : (
                    <div className="col-xl-2 col-lg-3 col-md-4 mx-auto">
                      <button
                        className="payNow"
                        // onClick={configureAccount}
                        onClick={() => setConfigure(true)}
                      >
                        Configure Now{" "}
                        <i className="ms-1 fa-duotone fa-circle-arrow-right"></i>
                      </button>
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6"></div>
                  <div className="col-md-6"></div>


                  {configure ? (

                    <div className="configProgressWrapper">
                      <ul>
                        <li>
                          <p className="text-center">
                            Please write first 3 digits of the number which you want in
                            DID.
                          </p>
                        </li>
                        <li>
                          <div className="coolinput">
                            <div className="coolSearch">
                              <label htmlFor="input" className="text">
                                NPX:
                              </label>
                              <input
                                type="text"
                                placeholder="Write here..."
                                name="input"
                                className="input"
                                onChange={(e) => setNpx(e.target.value)}
                                maxLength={3}
                                value={npx}
                              />
                            </div>
                            <button
                              onClick={() => {
                                searchDid();
                                setDid("");
                              }}
                            >
                              <i className="fa-solid fa-magnifying-glass"></i>
                            </button>
                          </div>
                        </li>
                      </ul>
                      {searchingDid || did !== "" ? (
                        <ul className="borderMan" style={{ height: "fit-content" }}>
                          {did === "" ? (
                            <li>
                              <div
                                className={
                                  didSearch === ""
                                    ? "configProgress pending "
                                    : didSearch === true
                                      ? "configProgress"
                                      : "configProgress success"
                                }
                              >
                                {didSearch === "" ? (
                                  <i className="fa-duotone fa-check"></i>
                                ) : didSearch === true ? (
                                  <CircularProgress
                                    size="35px"
                                    sx={{ color: green[500] }}
                                  />
                                ) : (
                                  <i className="fa-duotone fa-check"></i>
                                )}
                              </div>
                              <div className="configProgressText">
                                <p>Searching for available DID</p>
                              </div>
                            </li>
                          ) : (
                            <li>
                              {did === "No DID found with the given NPX" ? (
                                <div className="configProgressText did">
                                  <p>{did}</p>
                                </div>
                              ) : (
                                <div className="configProgressText did">
                                  <p>
                                    Your DID is: <span>{did}</span>
                                  </p>
                                  <button onClick={takeDid}>
                                    <i className="fa-solid fa-check"></i>
                                    {/* {false ? <div className="selectDidOpt">
                          <div className="d-flex">
                            <input type="checkbox" defaultChecked={'checked'} /> <span>Voice</span>
                          </div>
                          <div className="d-flex">
                            <input type="checkbox" /> <span>SMS</span>
                          </div>
                          <div className="d-flex">
                            <input type="checkbox" /> <span>Fax</span>
                          </div>
                          <div className="d-flex">
                            <input type="checkbox" /> <span>e911</span>
                          </div>
                        </div> : ""} */}
                                  </button>
                                  <button
                                    className="shuffle"
                                    onClick={() => {
                                      searchDid();
                                      setDid("");
                                    }}
                                  >
                                    <i className="fa-solid fa-rotate-reverse"></i>
                                  </button>
                                </div>
                              )}
                            </li>
                          )}
                          {purchingDid && did !== "" && (
                            <li>
                              <div className={"configProgress"}>
                                {configuredPurchase === true ? (
                                  <i className="fad fa-check-circle text-success"></i>
                                ) : (
                                  <CircularProgress
                                    size="35px"
                                    sx={{ color: green[500] }}
                                  />
                                )}
                              </div>
                              <div className="configProgressText">
                                <p>Purchasing Did</p>
                              </div>
                            </li>
                          )}
                          {configuringExtension && did !== "" && (
                            <li>
                              <div className={"configProgress"}>
                                {configuredExtension === true ? (
                                  <i className="fad fa-check-circle text-success"></i>
                                ) : (
                                  <CircularProgress
                                    size="35px"
                                    sx={{ color: green[500] }}
                                  />
                                )}
                              </div>
                              <div className="configProgressText">
                                <p>Configuring Extensions...</p>
                              </div>
                            </li>
                          )}
                          {configuringRole && did !== "" && (
                            <li>
                              <div className={"configProgress"}>
                                {configuredRole === true ? (
                                  <i className="fad fa-check-circle text-success"></i>
                                ) : (
                                  <CircularProgress
                                    size="35px"
                                    sx={{ color: green[500] }}
                                  />
                                )}
                              </div>
                              <div className="configProgressText">
                                <p>Configuring Roles</p>
                              </div>
                            </li>
                          )}
                          {/* <li>
                        <div className={acquiringDid==="" ? 'configProgress pending ' : acquiringDid===true? "configProgress": "configProgress success"}>
                            {acquiringDid===""  ? <i className="fa-duotone fa-check"></i> : acquiringDid===true ?<CircularProgress size="35px" sx={{ color: green[500], }} />: <i className="fa-duotone fa-check"></i>}
                        </div>
                        <div className='configProgressText'>
                            <p>Acquiring your DID</p>
                        </div>
                    </li> */}
                          {/* <li>
                  <div
                    className={
                      purchingDid === ""
                        ? "configProgress pending "
                        : purchingDid === true
                          ? "configProgress"
                          : "configProgress success"
                    }
                  >
                    {purchingDid === "" ? (
                      <i className="fa-duotone fa-check"></i>
                    ) : purchingDid === true ? (
                      <CircularProgress
                        size="35px"
                        sx={{ color: green[500] }}
                      />
                    ) : (
                      <i className="fa-duotone fa-check"></i>
                    )}
                  </div>
                  <div className="configProgressText">
                    <p>Purching your DID</p>
                  </div>
                </li> */}
                        </ul>
                      ) : (
                        ""
                      )}
                    </div>

                  ) : (
                    ""
                  )}
                  {purchaseComplete ? (
                    <div className="contentFinal">
                      <p>Your did configured successfully </p>
                      <p>
                        Further configuration is under process, you will notified
                        whenever it is done!{" "}
                      </p>
                      <p>
                        Further support you can reach us at pbx@gmail.com or call us at
                        0000000000
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
}

export default ConfigureStepDashboard;
