/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
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
  const [addNew, setAddNew] = useState(false);
  console.log(didAll);


  useEffect(() => {
    if (didAll) {
      // setLoading(false);
      if (page === "number") {
        setDid(didAll);
      } else if (page === "pbx") {
        setDid(didAll.filter((item) => item.usage === "pbx"));
      } else if (page === "dialer") {
        setDid(didAll.filter((item) => item.usage === "dialer"));
      }

      async function getData() {
        const apiData = await generalGetFunction(`/did/all`);
        if (apiData?.status) {
          setLoading(false);
          if (page === "number") {
            setDid(apiData.data);
          } else if (page === "pbx") {
            setDid(apiData.data.filter((item) => item.usages === "pbx"));
          } else if (page === "dialer") {
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
          if (page === "number") {
            setDid(apiData.data);
          } else if (page === "pbx") {
            setDid(apiData.data.filter((item) => item.usages === "pbx"));
          } else if (page === "dialer") {
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
    setLoading(true)
    setAddNew(false)
    const parsedData = {
      usages: page === "pbx" ? "pbx" : page === "dialer" ? "dialer" : usages
    }
    const apiData = await generalPutFunction(`/did/update/${id}`, parsedData)
    if (apiData.status) {
      setLoading(false)
      toast.success(apiData.message)
      setRefreshDid(refreshDid + 1)
    } else {
      setLoading(false)
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
                        {!(page === "number") &&
                          <button
                            type="button"
                            class="panelButton"
                            onClick={() => {
                              setAddNew(true);
                            }}
                          >
                            <span class="text">Add</span>
                            <span class="icon">
                              <i class="fa-solid fa-plus"></i>
                            </span>
                          </button>
                        }
                      </div>
                    </div>
                  </div>

                  {addNew ? (
                    <div className="addNewContactPopup">
                      <div className="row">
                        <div className="col-12 heading border-0 bg-transparent mb-0">
                          <i className="fa-light fa-user-plus" />
                          <h5>Add new DID </h5>
                        </div>
                        <div className="col-xl-12 mt-3">
                            {didAll.filter((item) => item.usages === "" || !item.usages).length === 0 ? <tr><td colSpan={3}>All number is assign with other module please add new number</td></tr> :
                            <div
                            className="tableContainer mt-0"
                            style={{ maxHeight: "calc(100vh - 400px)" }}
                          >
                              <table>
                                <thead>
                                  <tr>
                                    <th>S.No</th>
                                    <th>Number</th>
                                    <th>
                                      Add DID
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {didAll.filter((item) => item.usages === "" || !item.usages).map((item, index) => {
                                    return (
                                      <tr>
                                        <td> {index + 1}</td>
                                        <td>{item.did}</td>
                                        {/* <button
                                                className="tableButton mx-auto"
                                                onClick={() =>
                                                  navigate(
                                                    "/device-provisioning-new",
                                                    {
                                                      state: {
                                                        extension: item.extension,
                                                        id: item.id,
                                                      },
                                                    }
                                                  )
                                                }
                                              >
                                                <i class="fa-solid fa-plus"></i>
                                              </button> */}
                                       <div className="text-center"> 
                                        <button
                                          className="tableButton align-items-center justify-content-center"
                                          onClick={() => {
                                            handleUsagesEdit(item.id)
                                          }}
                                        >
                                         
                                          <i class="fa-solid fa-plus"></i>
                                        </button>
                                        </div>
                                      </tr>
                                    )
                                  })}


                                </tbody>
                              </table>
                              </div>
                            }
                        </div>
                        <div className="col-xl-12 mt-2">
                          <div className="d-flex justify-content-between">
                            <button
                              className="panelButton gray ms-0"
                              onClick={() => setAddNew(false)}
                            >
                              <span className="text">Close</span>
                              <span className="icon">
                                <i className="fa-solid fa-caret-left" />
                              </span>
                            </button>
                            {/* <button
                              className="panelButton me-0"

                            >
                              <span className="text">Done</span>
                              <span className="icon">
                                <i className="fa-solid fa-check" />
                              </span>
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
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
                            {page === "number" ?
                              <>
                                <th>Usages</th>
                              </> : ""
                            }
                            {page === "pbx" ? <>
                              <th style={{ width: 135, textAlign: "center" }}>
                                Default Caller DID
                              </th>
                            </> : ""}
                            <th style={{ width: 80, textAlign: "center" }}>
                              Options
                            </th>
                            {/* <th>Delete</th> */}
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
                                      {page === "number" ?
                                        <>
                                          <td style={{ cursor: "default" }}>
                                            {item.usages}
                                          </td>
                                        </>
                                        : ""}
                                      {page === "pbx" ? <>
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
                                      <td className="text-center">
                                        <div class="dropdown">
                                          <div class={`tableButton`} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="fa-solid fa-ellipsis-vertical" />
                                          </div>
                                          <ul class="dropdown-menu actionBtnDropdowns">
                                            {page === "pbx" ?
                                              <>
                                                <li className='dropdown-item'>
                                                  <Tippy
                                                    content={
                                                      item.configuration !== null
                                                        ? "Update the configuration"
                                                        : "Not Configured! Click to configure"
                                                    }
                                                  >
                                                    <div class="clearButton text-align-start"
                                                      onClick={() =>
                                                        navigate(`/did-config`, {
                                                          state: item,
                                                        })
                                                      }>
                                                      <i class={`fa-regular fa-${item.configuration !== null ? "gear" : "triangle-exclamation"} me-2`}></i> {item.configuration !== null ? "Update" : "Configure"}
                                                    </div>
                                                  </Tippy>
                                                </li>
                                                {item.configuration !== null && (
                                                  <li className='dropdown-item'>
                                                    <Tippy content="Reset configuration of this DID">
                                                      <div class="clearButton text-align-start"
                                                        onClick={() =>
                                                          handleClick(
                                                            item.configuration.id
                                                          )
                                                        }
                                                      ><i class="fa-regular fa-arrows-rotate me-2"></i> Reset
                                                      </div>
                                                    </Tippy>
                                                  </li>
                                                )}
                                              </>
                                              : page === "number" ?
                                                <>
                                                  <li className='dropdown-item'>
                                                    <Tippy content="Select the usage of this DID">
                                                      <div class="clearButton text-align-start"
                                                        onClick={() => { setUsagesPopup(true); setId(item.id); setUsages(item.usages) }
                                                        }
                                                      ><i class="fa-regular fa-gear me-2"></i> Set Usage
                                                      </div>
                                                    </Tippy>
                                                  </li>
                                                </> : ""}
                                            <li className='dropdown-item'>
                                              <Tippy
                                                content={"Delete the DID"}
                                              >
                                                <div class="clearButton text-align-start"
                                                  onClick={() => { setDeletePopup(true); setDeleteId(item.id) }
                                                  }>
                                                  <i class={`fa-regular fa-trash me-2`}></i> Delete
                                                </div>
                                              </Tippy>
                                            </li>
                                          </ul>
                                        </div>
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
