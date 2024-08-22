import { Avatar, CircularProgress } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useState } from "react";
import { generalPostFunction } from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

function ConfigureStepDashboard({ account2 }) {
  console.log("This is account", account2);
  const account = useSelector((state) => state.account);
  const [configure, setConfigure] = useState(false);
  const [npx,setNpx] = useState("")
  const [didSearch, setDidSearch] = useState(true);
  const [didRawData, setDidRawData] = useState();
  const [purchingDid, setPurchingDid] = useState("");
  const [did, setDid] = useState("");
  const [purchaseComplete,setPurchaseComplete] = useState(false)
  const [searchingDid, setSearchingDid] = useState(false);

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

  async function searchDid(){
    if(npx.length < 3){
      toast.error("NPX must be  3 characters");
    }else{
      setSearchingDid(true)
      const parsedData = {
        searchType: "tollfree",
        quantity: "1",
        npa: Number(npx),
        companyId: account.account_id,
      };
      const apiData = await generalPostFunction("/searchTfn", parsedData);
      if(apiData.status){
        setSearchingDid(false)
        setDidRawData(apiData)
        setDid(apiData.data[0].id);
    }else{
      setSearchingDid(false)
      setDidRawData(apiData)
      setDid("No DID found with the given NPX")
    }
  }
   
  }

  async function takeDid(){
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
          dids: didRawData.data[0].id,
        },
      ],
    };
    const apiData = await generalPostFunction("/purchaseTfn", parsedData);
    if(apiData.status){
      setPurchingDid(false);
      setPurchaseComplete(true);
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
                <button className="payNow"
                  // onClick={configureAccount}
                  onClick={() => setConfigure(true)}
                >
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
                  <div class="coolinput">
                    <div className="coolSearch">
                      <label for="input" class="text">NPX:</label>
                      <input type="text" placeholder="Write here..." name="input" class="input" onChange={(e) => setNpx(e.target.value)} value={npx} />
                    </div>
                    <button onClick={() => {searchDid();setDid("")}}>
                      <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                  </div>
                </li>
              </ul>
              {searchingDid || did!=="" ? <ul className="borderMan" style={{ height: 'fit-content' }}>
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
                    {did==="No DID found with the given NPX"?
                    <div className="configProgressText did">
                      <p>{did}</p>
                    </div>:<div className="configProgressText did">
                      <p>Your DID is: <span>{did}</span></p>
                      <button onClick={takeDid} >
                        <i class="fa-solid fa-check"></i>
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
                      <button className="shuffle" onClick={()=>{searchDid();setDid("")}}><i class="fa-solid fa-rotate-reverse"></i></button>
                    </div>
                  }
                    
                  </li>
                )}
                {(purchingDid && did!=="")? <li>
                    <div
                      className={
                        "configProgress"
                      }
                    >
                     
                        <CircularProgress
                          size="35px"
                          sx={{ color: green[500] }}
                        />
                     
                    </div>
                    <div className="configProgressText">
                      <p>Purching Did</p>
                    </div>
                  </li>:""}
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
              </ul> : ""}
            </div>
          ) : (
            ""
          )}
          {purchaseComplete ? (
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
