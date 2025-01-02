import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useNavigate, Link } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Tippy from "@tippyjs/react";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";

function DidListing({ page }) {
  const [did, setDid] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const didAll = useSelector((state) => state.didAll);
  const newAddDid = useSelector((state) => state.newAddDid);
  const dispatch = useDispatch();
  const [usagesPopup, setUsagesPopup] = useState(false);
  const [usages, setUsages] = useState("")
  const [id, setId] = useState('');
  const [refreshDid, setRefreshDid] = useState(0)
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    if (didAll) {
      // setLoading(false);
      if(page==="number"){
        setDid(didAll);
      }else if(page==="pbx"){
        setDid(didAll.filter((item) => item.usage === "pbx"));
      }else if(page==="dialer"){
        setDid(didAll.filter((item) => item.usage === "dialer"));
      }
      
      async function getData() {
        const apiData = await generalGetFunction(`/did/all`);
        if (apiData?.status) {
          setLoading(false);
          if(page==="number"){
            setDid(apiData.data);
          }else if(page==="pbx"){
            setDid(apiData.data.filter((item) => item.usages === "pbx"));
          }else if(page==="dialer"){
            setDid(apiData.data.filter((item) => item.usages === "dialer"));
          }
          dispatch({
            type: "SET_DIDALL",
            didAll: apiData.data,
          });
        } else {
          setLoading(false);
          navigate(-1);
        }
      }
      getData();
    } else {
      async function getData() {
        const apiData = await generalGetFunction(`/did/all`);
        if (apiData?.status) {
          setLoading(false);
          if(page==="number"){
            setDid(apiData.data);
          }else if(page==="pbx"){
            setDid(apiData.data.filter((item) => item.usages === "pbx"));
          }else if(page==="dialer"){
            setDid(apiData.data.filter((item) => item.usages === "dialer"));
          }
          dispatch({
            type: "SET_DIDALL",
            didAll: apiData.data,
          });
        } else {
          setLoading(false);
          navigate(-1);
        }
      }
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshDid, page]);

  const handleClick = async (id) => {
    setLoading(true);
    try {
      const apiData = await generalDeleteFunction(
        `/did/configure/destroy/${id}`
      );
      if (apiData?.status) {
        const newData = await generalGetFunction(`/did/all`);
        if (newData?.status) {
          setDid(newData.data);
        } else {
          navigate(-1);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function handleClickDefault(id) {
    setLoading(true);
    const parsedData = {
      id: id,
    };
    const apiData = await generalPostFunction(`/did/set-default`, parsedData);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      const newData = await generalGetFunction(`/did/all`);
      if (newData?.status) {
        setDid(newData.data);
      }
    } else {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (newAddDid) {
      const addedDid = did?.find((item) => item.id === newAddDid.id);
      if (addedDid) {
        navigate(`/did-config`, {
          state: addedDid,
        });
      }
    }
  }, [newAddDid, did]);

  async function handleUsagesEdit(id) {
    const parsedData = {
      usages: usages
    }
    const apiData = await generalPutFunction(`/did/update/${id}`, parsedData)
    if (apiData.status) {
      toast.success(apiData.message)
      setRefreshDid(refreshDid + 1)
    } else {
      toast.error(apiData.message)
    }
  }

  async function handleDelete(id) {
    setLoading(true)
    const apiData = await generalDeleteFunction(`/did/destroy/${id}`)
    if (apiData.status) {
      setLoading(false)
      toast.success(apiData.message)
      setRefreshDid(refreshDid + 1)
      setDeleteId('')
    } else {
      setLoading(false)
      // toast.error(apiData.message)
    }
  }
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Number Configuration" />

            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>All DID</h4>
                        <p>Add a new DID</p>
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
                        {page === "number" ?
                          <Link
                            to="/did-add"
                            effect="ripple"
                            className="panelButton"
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i class="fa-solid fa-plus"></i>
                            </span>
                          </Link>
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "25px 20px 0" }}
                  >
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>DID</th>
                            <th>E911</th>
                            <th>Cname</th>
                            <th>SMS</th>

                            {page === "pbx" ? <>
                              <th style={{ width: 80, textAlign: "center" }}>
                                Options
                              </th>
                              <th style={{ width: 135, textAlign: "center" }}>
                                Default Caller DID
                              </th>
                            </> : ""}
                            {page === "number" ?
                              <>
                                <th>Usages</th>
                                <th>Edit Usages</th>
                              </> : ""
                            }
                             <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <SkeletonTableLoader col={6} row={15} />
                          ) : (
                            <>
                              {did &&
                                did.map((item) => {
                                  return (
                                    <tr>
                                      <td style={{ cursor: "default" }}>
                                        {item.did}
                                      </td>
                                      <td style={{ cursor: "default" }}>
                                        {item?.e911}
                                      </td>
                                      <td style={{ cursor: "default" }}>
                                        {item?.cnam}
                                      </td>
                                      <td style={{ cursor: "default" }}>
                                        {item?.sms}
                                      </td>
                                      {page === "pbx" ? <>
                                        <td className="text-center">
                                          <div class="dropdown">
                                            <a class={`tableButton ${item.configuration !== null ? "" : "nottif"}`} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                              <i className="fa-solid fa-ellipsis-vertical" />
                                            </a>
                                            <ul class="dropdown-menu actionBtnDropdowns">
                                              <li className='dropdown-item'>
                                                <Tippy
                                                  content={
                                                    item.configuration !== null
                                                      ? "Update the configuration"
                                                      : "Not Configured! Click to configure"
                                                  }
                                                >
                                                  <a class="clearButton text-align-start"
                                                    onClick={() =>
                                                      navigate(`/did-config`, {
                                                        state: item,
                                                      })
                                                    }>
                                                    <i class={`fa-regular fa-${item.configuration !== null ? "gear" : "triangle-exclamation"} me-2`}></i> {item.configuration !== null ? "Update" : "Configure"}
                                                  </a>
                                                </Tippy>
                                              </li>
                                              {item.configuration !== null && (
                                                <li className='dropdown-item'>
                                                  <Tippy content="Reset configuration of this DID">
                                                    <a class="clearButton text-align-start"
                                                      onClick={() =>
                                                        handleClick(
                                                          item.configuration.id
                                                        )
                                                      }
                                                    ><i class="fa-regular fa-arrows-rotate me-2"></i> Reset
                                                    </a>
                                                  </Tippy>
                                                </li>
                                              )}
                                            </ul>
                                          </div>
                                        </td>
                                        <td style={{ cursor: "default" }}>
                                          <Tippy
                                            content={
                                              item.default_outbound === 1
                                                ? "This DID is set as default"
                                                : "Set this DID default"
                                            }
                                          >
                                            <button
                                              className={
                                                item.default_outbound === 1
                                                  ? "tableButton edit mx-auto"
                                                  : "tableButton empty mx-auto"
                                              }
                                              style={{ cursor: "pointer" }}
                                              onClick={() => {
                                                if (item.default_outbound === 0) {
                                                  handleClickDefault(item.id);
                                                }
                                              }}
                                            >
                                              <i class="fa-solid fa-headset"></i>
                                            </button>
                                          </Tippy>
                                        </td>
                                      </> : ""}
                                      {page === "number" ?
                                        <>
                                          <td style={{ cursor: "default" }}>
                                            {item.usages}
                                          </td>
                                          <td style={{ cursor: "default" }} onClick={() => { setUsagesPopup(true); setId(item.id) }}>
                                            <button className="tableButton edit">
                                              <i className="fa-solid fa-pen"></i>
                                            </button>
                                          </td>
                                        </>
                                        : ""}
                                         <td style={{ cursor: "default" }} onClick={()=>{setDeletePopup(true); setDeleteId(item.id)}}>
                                            DELETE
                                          </td>
                                    </tr>
                                  );
                                })}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {usagesPopup ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-circle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Confirmation!</h4>
                  <p>
                    Please select the options you want to assign to this DID
                  </p>
                  <select className="formItem" value={usages} onChange={(e) => { setUsages(e.target.value) }}>
                    <option value="">None</option>
                    <option value="pbx">PBX</option>
                    <option value="dialer">Dialer</option>
                  </select>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="panelButton m-0"
                      onClick={() => {
                        handleUsagesEdit(id);
                        setUsagesPopup(false);
                      }}
                    >
                      <span className="text">Lets Go!</span>
                      <span className="icon">
                        <i class="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setUsagesPopup(false);
                        setId("");
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon">
                        <i class="fa-solid fa-xmark"></i>
                      </span>
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
      {deletePopup ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-circle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Confirmation!</h4>
                  <p>
                    Are you sure! 
                    You want to delete this DID
                  </p>
                 
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="panelButton m-0"
                      onClick={() => {
                        handleDelete(deleteId);
                        setDeletePopup(false);
                      }}
                    >
                      <span className="text">Delete</span>
                      <span className="icon">
                        <i class="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setDeletePopup(false);
                        setDeleteId("");
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon">
                        <i class="fa-solid fa-xmark"></i>
                      </span>
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

export default DidListing;
