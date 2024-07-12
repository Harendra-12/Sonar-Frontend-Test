import { Avatar, CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useState } from "react";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";

function ConfigureStepDashboard({ account2 }) {
  console.log("This is account", account2);
  const account = useSelector((state) => state.account);
  const [configure, setConfigure] = useState(false);
  const [didSearch, setDidSearch] = useState(true);
  const [purchingDid, setPurchingDid] = useState("");
  const [did, setDid] = useState("");

  async function configureAccount() {
    setConfigure(true);
    const parsedData = {
      searchType: "tollfree",
      quantity: "1",
      npa: "855",
      companyId: account.account_id,
    };
    const apiData = await generalPostFunction("/searchTfn", parsedData);
    if (apiData.status) {
      setDidSearch(false);
      setPurchingDid(true);
      const parsedData2 = {
        companyId: account.account_id,
        vendorId: apiData.data[0].vendorId,
        didQty: 1,
        type: "configure",
        didType: "random",
        rate: Number(apiData.data[0].price),
        accountId: apiData.data[0].vendorAccountId,
        dids: [
          {
            dids: apiData.data[0].id,
          },
        ],
      };
      const apiData2 = await generalPostFunction("/purchaseTfn", parsedData2);
      if (apiData2.status) {
        setPurchingDid(false);
        setDid(apiData.data[0].id);
      }
    }
  }
  return (
    <div>
      <div className="profileView">
        <div className="profileDetailsHolder position-relative">
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
              <div className="col-xl-2 mx-auto">
                <button className="payNow" onClick={configureAccount}>
                  Configure Now{" "}
                  <i className="ms-1 fa-duotone fa-circle-arrow-right"></i>
                </button>
              </div>
            )}
          </div>
          {configure ? (
            <div className="configProgressWrapper">
              <ul>
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
                {/* <li>
                                <div className={acquiringDid==="" ? 'configProgress pending ' : acquiringDid===true? "configProgress": "configProgress success"}>
                                    {acquiringDid===""  ? <i className="fa-duotone fa-check"></i> : acquiringDid===true ?<CircularProgress size="35px" sx={{ color: green[500], }} />: <i className="fa-duotone fa-check"></i>}
                                </div>
                                <div className='configProgressText'>
                                    <p>Acquiring your DID</p>
                                </div>
                            </li> */}
                <li>
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
                </li>
                {did === "" ? (
                  ""
                ) : (
                  <li>
                    <div className="configProgressText">
                      <p>Your DID is:{did}</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            ""
          )}
          {did !== "" || account2.company_status === "5" ? (
            <div className="contentFinal">
              <p>Your did configured succesfully </p>
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
  );
}

export default ConfigureStepDashboard;
