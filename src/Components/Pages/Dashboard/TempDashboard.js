import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useDispatch, useSelector } from "react-redux";
// import CircularLoader from "../Misc/CircularLoader";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import ConfigureStepDashboard from "./ConfigureStepDashboard"
import Account from "./Account";
import Payment from "./Payment";
import Document from "./Document";

function TempDashboard() {
  const dispatch = useDispatch();
  const [statusClick, setStatusClick] = useState("account")
  const [refreshDetails, setRefreshDetails] = useState(1)

  const navigate = useNavigate();
  const [account, setAccount] = useState(
    useSelector((state) => state.tempAccount)
  );
  function handleRefresh(value) {
    setRefreshDetails(value)
  }
  console.log("This is refresh data",refreshDetails);
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/account/${account.id}`);
      if (apiData.status) {
        setAccount(apiData.data);
        dispatch({
          type: "SET_TEMPACCOUNT",
          tempAccount: apiData.data,
        });
        if (Number(apiData.data.company_status) === 1 || Number(apiData.data.company_status) === 2) {
          setStatusClick("payment")
        } else if (Number(apiData.data.company_status) === 3 || Number(apiData.data.company_status) === 4) {
          setStatusClick("document")
        } else {
          setStatusClick("configure")
        }
        localStorage.setItem("tempAccount", JSON.stringify(apiData.data));
        if (Number(apiData.data.company_status) > 5) {
          navigate("/dashboard");
        }
      }
    }
    getData();
  }, [account?.id, dispatch, navigate, refreshDetails]);

  useEffect(()=>{
    if(refreshDetails>1){
      setStatusClick("payment")
    }
  },[refreshDetails])

  // Callback handle for differnt tab
  function handleCallBack(value){
    setStatusClick(value)
  }

  return (
    <>
      <style>
        {`
      .formRow{
        border: none;
      }
      .formItem{
        margin: 0px 5px 0px 0px;
        color: #000;
      }
      .formLabel{
        padding: 0px 0px 5px;
      }
      .wrapper{
        padding: 10px 10px 0 ;
      }
      .wrapper ul{
        padding: 0;
        list-style: none;
        margin-bottom: 0;
      }

      .wrapper ul li{
        padding-bottom: 5px;
        margin-bottom: 7px;
        border-bottom: 1px solid #ddd;
      }

      .wrapper ul label{
        font-size: 14px;
        color: #5e5e5e;
        font-weight: 500;
        font-family: Roboto;
      }

      .wrapper ul .details{
        float: inline-end;
        color: #000;
        font-size: 14px;
        font-weight: 600;
        font-family: Roboto;
      }

      .qLinkContent .iconWrapper2{
          width: 35px;
          border-radius: 50%;
          height: 35px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--ui-accent);
          color: #fff;
      }

      .profileDetailsHolder .imgWrapper{
        width: 100px;
        height: 130px;
        margin: auto;
        padding-top: 20px;
      }
      .profileDetailsHolder .imgWrapper img{
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .profileDetailsHolder h5 {
        color: var(--color-subtext);
        font-weight: 400;
      }
        .getApp,.clearColorButton{
        display:none;
        }
      .profileDetailsHolder a {text-decoration: none}
      `}
      </style>
      <div className="mainContent">
        <div className="col-12">
          <Header title="New User Details" />
          <div className="d-flex flex-wrap">
            <div className="col-xl-12">
              <div className="profileView">
                <div className="profileDetailsHolder position-relative">
                  <div
                    className="baseDetails row align-items-center mt-3"
                    style={{ padding: "30px 10px 55px" }}
                  >
                    <div className="col-xl-8 px-0 mx-auto position-relative">
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Animated striped example"
                        aria-valuenow="50"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                          style={{
                            width: `${Number(account.company_status) === 1
                              ? "40"
                              : Number(account.company_status) === 2
                                ? "55"
                                : Number(account.company_status) === 3
                                  ?  "65" : Number(account.company_status) === 4 ?
                                   "85" : "100"
                              }%`,
                          }}
                        ></div>
                      </div>
                      <div className="progressStepWrapper">
                        <div className="stepWrapper col-3 success" onClick={() => setStatusClick("account")}>
                          {/* <div className="status">Verified</div> */}
                          <div className="step">
                            <Tippy content="Your Account is verified">
                              <i className="fa-sharp fa-solid fa-check"></i>
                            </Tippy>
                          </div>
                          <label>Accounts</label>
                        </div>
                        <div
                          onClick={() => setStatusClick("payment")}
                          className={`stepWrapper col-3 ${Number(account.company_status) > 1
                            ? "success"
                            : "pending"
                            }`}
                        >
                          {/* <div className="status">
                            {" "}
                            {Number(account.company_status) === 1
                              ? "Under Process"
                              : "Verified"}
                          </div> */}
                          <div className="step">
                            {Number(account.company_status) > 1 ? (
                              <Tippy content="Your payment is verified">
                                <i className="fa-sharp fa-solid fa-check"></i>
                              </Tippy>
                            ) : (
                              <Tippy content="Your payment is under verification">
                                <i className="fa-sharp fa-solid fa-credit-card fa-fade"></i>
                              </Tippy>
                            )}
                          </div>
                          <label>Payment</label>
                        </div>
                        <div
                          onClick={() => { if (Number(account.company_status) > 1) { setStatusClick("document") } }}
                          className={`stepWrapper col-3 ${Number(account.company_status) === 3
                            ? "pending"
                            : Number(account.company_status) > 3
                              ? "success"
                              : ""
                            }`}
                        >
                          <div className="step ">
                            {
                              Number(account.company_status) < 3 ? (
                                <Tippy content="Document not uploaded">
                                  <i className="fa-sharp fa-solid fa-file-contract"></i>
                                </Tippy>
                              ) :

                                Number(account.company_status) > 3 ? (
                                  <Tippy content="Your Document is verified">
                                    <i className="fa-sharp fa-solid fa-check"></i>
                                  </Tippy>
                                ) : (
                                  <Tippy content="Your Document is under verification">
                                    <i className="fa-sharp fa-solid fa-file-contract fa-fade"></i>
                                  </Tippy>
                                )}
                          </div>
                          <label>Documents</label>
                        </div>
                        <div
                          onClick={() => { if (Number(account.company_status) >= 4) { setStatusClick("config") } }}
                          className={`stepWrapper col-3 ${Number(account.company_status) === 4
                            ? "pending"
                            : Number(account.company_status) > 4
                              ? "success"
                              : ""
                            }`}
                        >
                          <div className="step">
                            {Number(account.company_status) >= 4 ? (
                              <Tippy content="Your Account is being configured">
                                <i className="fa-sharp fa-solid fa-gear fa-spin"></i>
                              </Tippy>
                            ) :
                              Number(account.company_status) > 5 ? (
                                <Tippy content="Your Account is configured successfully">
                                  <i className="fa-sharp fa-solid fa-check"></i>
                                </Tippy>
                              ) :
                                (
                                  <Tippy content="Your Account will be configured">
                                    <i className="fa-sharp fa-solid fa-gear"></i>
                                  </Tippy>
                                )}
                          </div>
                          <label>Configure Account</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12">
              {statusClick === "account" ? <Account account={account} companyStatus={account.company_status} nextPage={handleCallBack} /> : statusClick === "payment" ? <Payment account={account} companyStatus={account.company_status} nextPage={handleCallBack} /> : statusClick === "document" ? <Document account={account} refreshCallback={handleRefresh} refresh={refreshDetails} companyStatus={account.company_status} nextPage={handleCallBack} /> : <ConfigureStepDashboard account2={account} companyStatus={account.company_status} nextPage={handleCallBack} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TempDashboard;
