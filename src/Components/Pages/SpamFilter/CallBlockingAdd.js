import React, { useEffect, useState } from "react";
import CircularLoader from "../../Loader/CircularLoader";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";

function CallBlockingAdd() {
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [pageNumber, setPageNumber] = useState(1);
  const [callDirection, setCallDirection] = useState("");
  const [callDestination, setCallDestination] = useState("");
  const [contentLoader, setContentLoader] = useState(false);
  const [cdr, setCdr] = useState();
  const [type, setType] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(1);
  const [debounceCallDestination, setDebounceCallDestination] = useState("");
  const [debounceCallDestinationFlag, setDebounceCallDestinationFlag] =
    useState("");
  const [selectedCdrToBlock, setSelectedCdrToBlock] = useState([]);
  async function addBlock() {
    if (type === "") {
      toast.error("Please enter type");
    } else if (number === "") {
      toast.error("Please enter number");
    } else if (number < 99999999 || number > 99999999999999) {
      toast.error("Please enter valid number");
    } else {
      setLoading(true);
      const parsedData = {
        type: type,
        number: number,
      };
      const apidata = await generalPostFunction(`/spam/store`, parsedData);
      if (apidata.status) {
        navigate("/call-blocking");
        setLoading(false);
        setType("");
        setNumber("");
        toast.success("Number added to block list");
      } else {
        setLoading(false);
      }
    }
  }
  useEffect(() => {
    let timer = setTimeout(() => {
      if (debounceCallDestination.length >= 3) {
        setCallDestination(debounceCallDestination);
      } else if (
        debounceCallDestination.length >= 0 &&
        debounceCallDestination.length < 3
      ) {
        setCallDestination("");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [debounceCallDestination]);
  const handleCallDestinationChange = (e) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue) && newValue.length <= 5) {
      setDebounceCallDestinationFlag(newValue);
      if (newValue.length >= 3) {
        setDebounceCallDestination(newValue);
        setPageNumber(1);
      } else {
        setDebounceCallDestination("");
      }
    }
  };
  useEffect(() => {
    setLoading(true);
    // build a dynamic url which include only the available params to make API call easy
    const buildUrl = (baseApiUrl, params) => {
      const queryParams = Object.entries(params)
        .filter(([key, value]) => value.length > 0)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      return queryParams ? `${baseApiUrl}&${queryParams}` : baseApiUrl;
    };
    const finalUrl = buildUrl(
      `/cdr?account=${account.account_id}&page=${pageNumber}`,
      {
        callDirection,

        destination: callDestination,
      }
    );

    async function getData() {
      if (account && account.account_id) {
        const apiData = await generalGetFunction(finalUrl);
        if (apiData?.status) {
          setLoading(false);
          setContentLoader(false);
          setCdr(apiData.data);
        } else {
          setLoading(false);
          setContentLoader(false);
        }
      } else {
        setLoading(false);
        setContentLoader(false);
        navigate("/");
      }
    }
    getData();
  }, [account, navigate, pageNumber, callDirection, callDestination, refresh]);

  const handleUpdateSelectedCdrToBlock = (item) => {
    setSelectedCdrToBlock([...selectedCdrToBlock, item]);
  };
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid px-0">
          <Header title="Call Blocking" />
        </div>
        <div className="col-xl-12">
          {/* {loading && loadings && (
                        <div colSpan={99}>
                            <CircularLoader />
                        </div>
                    )} */}
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>Call Blocking Advance</h4>
                      <p>Configure call blocking</p>
                    </div>
                    <div className="buttonGroup">
                      <div className="d-flex align-items-center">
                        <div className="formLabel py-0 me-2">
                          <label htmlFor="selectFormRow">Enabled</label>
                        </div>
                        <div className="my-auto position-relative mx-1">
                          <label className="switch">
                            <input type="checkbox" id="showAllCheck" />
                            <span className="slider round" />
                          </label>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          navigate(-1);
                          backToTop();
                        }}
                        type="button"
                        effect="ripple"
                        className="panelButton gray"
                      >
                        <span className="text">Back</span>
                        <span className="icon">
                          <i class="fa-solid fa-caret-left"></i>
                        </span>
                      </button>
                      <button
                        effect="ripple"
                        className="panelButton"
                        onClick={addBlock}
                      >
                        <span className="text">Save</span>
                        <span className="icon">
                          <i class="fa-solid fa-floppy-disk"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-12"
                style={{ padding: "25px 23px", borderBottom: "1px solid #ddd" }}
              >
                <form className="row col-12 mx-auto mb-0">
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Direction</label>
                      <label htmlFor="data" className="formItemDesc">
                        Select the direction of the calls to block
                      </label>
                    </div>
                    <div className="col-xl-6 col-12">
                      <select type="text" name="extension" className="formItem">
                        <option>Inbound</option>
                      </select>
                      {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Extension</label>
                      <label htmlFor="data" className="formItemDesc">
                        Select the extension to be affected.
                      </label>
                    </div>
                    <div className="col-xl-6 col-12">
                      <select type="text" name="extension" className="formItem">
                        <option>All</option>
                      </select>
                      {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Name</label>
                      <label htmlFor="data" className="formItemDesc">
                        Enter the Caller ID name to block
                      </label>
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                      />
                      {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Action</label>
                      <label htmlFor="data" className="formItemDesc">
                        Set an action for calls from this number
                      </label>
                    </div>
                    <div className="col-xl-6 col-12">
                      <select type="text" name="extension" className="formItem">
                        <option>Reject</option>
                        <option>Hold</option>
                        <option>Busy</option>
                        <option>Voicemail</option>
                      </select>
                      {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Description</label>
                      <label htmlFor="data" className="formItemDesc">
                        Enter the description
                      </label>
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                      />
                      {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">DID</label>
                      <label htmlFor="data" className="formItemDesc">
                        Enter the DID.
                      </label>
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                      />
                      {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Type</label>
                      <label htmlFor="data" className="formItemDesc">
                        Enter the number type.
                      </label>
                    </div>
                    <div className="col-xl-6 col-12">
                      <input
                        type="text"
                        class="formItem"
                        placeholder="DID/PSTN..."
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      />
                      {/* {errors.queue_name && (
                                                <ErrorMessage text={errors.queue_name.message} />
                                            )} */}
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-12" style={{ padding: "20px 23px" }}>
                <div className="tableHeader align-items-end mb-3">
                  <div className="showEntries">
                    <label>Show</label>
                    <select
                      className="formItem"
                      style={{ width: "max-content" }}
                    >
                      <option value={10}>Outbound</option>
                    </select>
                  </div>
                  <div className="showEntries align-items-end">
                    <div className="formRow border-0 pb-0">
                      <label className="formLabel text-start mb-0 w-100">
                        Call Destination
                      </label>
                      <input
                        type="text"
                        className="formItem"
                        value={debounceCallDestinationFlag}
                        // value={debounceCallDestination}
                        // onChange={(e) => {
                        //   setDebounceCallDestination(e.target.value);
                        //   setPageNumber(1);
                        // }}
                        onChange={handleCallDestinationChange}
                      />
                    </div>
                    <div className="formRow border-0 pb-0">
                      <label className="formLabel text-start mb-0 w-100">
                        Call Direction
                      </label>
                      <select
                        className="formItem"
                        onChange={(e) => {
                          setCallDirection(e.target.value);
                          setPageNumber(1);
                        }}
                        value={callDirection}
                      // onChange={(e) => setCallDirection(e.target.value), setPageNumber(1)}
                      >
                        <option value={""}>All Calls</option>
                        <option value={"inbound"}>Inbound Calls</option>
                        <option value={"outbound"}>Outbound Calls</option>
                        <option value={"missed"}>Missed Calls</option>
                        <option value={"internal"}>Internal Calls</option>
                      </select>
                    </div>
                    <select
                      className="formItem"
                      style={{ width: "max-content" }}
                    >
                      <option value={10}>All</option>
                    </select>
                    <select
                      className="formItem"
                      style={{ width: "max-content" }}
                    >
                      <option value={10}>Reject</option>
                    </select>
                    <button
                      effect="ripple"
                      className="panelButton delete ms-0"
                      style={{ height: "34px" }}
                    >
                      <span className="text">Block</span>
                      <span className="icon">
                        <i class="fa-solid fa-ban"></i>
                      </span>
                    </button>
                  </div>
                </div>
                <div className="tableContainer">
                  <table>
                    <thead>
                      <tr>
                        <th>Call Direction</th>
                        <th>Source</th>
                        <th>Destination</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <SkeletonTableLoader col={6} row={5} />
                      ) : (
                        cdr?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="d-flex align-items-center gap-2">
                                <input
                                  type="checkbox"
                                //   onClick={() => {}}
                                ></input>
                                {item["Call-Direction"]}
                              </td>
                              <td>{item["Caller-Caller-ID-Number"]}</td>
                              <td>{item["Caller-Callee-ID-Number"]}</td>
                              <td>
                                {" "}
                                {item["variable_start_stamp"].split(" ")[0]}
                              </td>
                              <td>
                                {" "}
                                {item["variable_start_stamp"].split(" ")[1]}
                              </td>
                              <td>{item["variable_billsec"]}</td>
                            </tr>
                          );
                        })
                      )}
                      {/* <tr>
                        <td>Queue Name</td>
                        <td>Extension</td>
                        <td>Strategy</td>
                        <td>Timeout Action</td>
                        <td>Prefix</td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
                <div className="tableHeader mb-3">
                  {!loading && cdr && cdr.data.length > 0 ? (
                    <PaginationComponent
                      pageNumber={(e) => setPageNumber(e)}
                      totalPage={cdr.last_page}
                      from={(pageNumber - 1) * cdr.per_page + 1}
                      to={cdr.to}
                      total={cdr.total}
                      defaultPage={pageNumber}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CallBlockingAdd;
