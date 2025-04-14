/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  featureUnderdevelopment,
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
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [previousUsages, setPreviousUsages] = useState('')
  const account = useSelector((state) => state?.account);
  const slugPermissions = useSelector((state) => state?.permissions);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (didAll) {
      setLoading(true);
      if (page === "number") {
        setDid(didAll);
      } else if (page === "pbx") {
        setDid(didAll.filter((item) => item.usage === "pbx"));
      } else if (page === "dialer") {
        setDid(didAll.filter((item) => item.usage === "dialer"));
      }
      getData();
    } else {
      getData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshDid, page,searchQuery]);

  // Fetch ALL DID
  async function getData() {
    setLoading(true);
    const apiData = await generalGetFunction(`/did/all?search=${searchQuery}`);
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

  const handleClick = async (id) => {
    setLoading(true);
    try {
      const apiData = await generalDeleteFunction(
        `/did/configure/destroy/${id}`
      );
      if (apiData?.status) {
        setLoading(false);
        toast.success(apiData.message);
        setRefreshDid(refreshDid + 1);
        // const newData = await generalGetFunction(`/did/all`);
        // if (newData?.status) {
        //   setDid(newData.data);
        //   toast.success(apiData.message);
        //   setRefreshDid(refreshDid + 1);
        // } else {
        //   toast.error(apiData.message);
        //   // navigate(-1);
        // }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function handleClickDefault(id, action) {
    setLoading(true);
    const parsedData = {
      id: id,
    };
    const apiData = await generalPostFunction(`/did/set-default?${action ? action : ""}`, parsedData);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      setRefreshDid(refreshDid + 1)
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
      setUsages("")
      setPreviousUsages("")
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

  // Debounce Search Function
  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     getData();
  //   }, 500);

  //   return () => clearTimeout(delay);
  // }, [searchQuery]);

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
                        <h4>All DID
                          <button
                            className="clearButton"
                            onClick={() => setRefreshDid(refreshDid + 1)}
                            disabled={loading}
                          >
                            <i class={`fa-regular fa-arrows-rotate fs-5 ${loading ? "fa-spin" : ""}`}></i>
                          </button>
                        </h4>
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
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        {checkViewSidebar(
                          'DidConfigure',
                          slugPermissions,
                          account?.permissions, "add"
                        ) && <button
                          type="button"
                          className="panelButton"
                          onClick={() => {
                            if (page === "number") {
                              navigate("/did-add")
                            } else {
                              setAddNew(true);
                            }
                          }}
                        >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i className="fa-solid fa-plus"></i>
                            </span>
                          </button>}
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
                                                <i className="fa-solid fa-plus"></i>
                                              </button> */}
                                        <div className="mt-1">
                                          <button
                                            className="tableButton align-items-center justify-content-center"
                                            onClick={() => {
                                              handleUsagesEdit(item.id)
                                            }}
                                          >

                                            <i className="fa-solid fa-plus"></i>
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
                    style={{ overflow: "auto", padding: "10px 20px 0" }}
                  >
                    <div className="tableHeader">
                      <div className="showEntries">
                        <label>Show</label>
                        <select className="formItem" onChange={() => featureUnderdevelopment()}>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                        </select>
                        <label>entries</label>
                      </div>
                      <div className="searchBox position-relative">
                        <label>Search:</label>
                        <input type="search" name="Search" className="formItem" onChange={(e) => setSearchQuery(e.target.value)} />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>DID</th>
                            <th>E911</th>
                            <th>Cname</th>
                            <th>SMS</th>
                            {page === "pbx" ? <>
                            <th>Route</th>
                            </>:""}
                            {page === "number" ?
                              <>
                                <th>Usages</th>
                              </> : ""
                            }
                            <th style={{ textAlign: "center" }}>
                              WhatsApp DID
                            </th>
                            <th style={{ textAlign: "center" }}>
                              E-fax DID
                            </th>
                            <th style={{ textAlign: "center" }}>
                              SMS DID
                            </th>
                            {page === "pbx" ? <>
                              <th style={{ textAlign: "center" }}>
                                Default Caller DID
                              </th>
                            </> : ""}
                            <th style={{ textAlign: "center" }}>
                              Options
                            </th>
                            {/* <th>Delete</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <SkeletonTableLoader col={9} row={15} />
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
                                        <td style={{ cursor: "default" }}>
                                          {item?.configuration?.forward_to?item?.configuration?.forward_to:item?.configuration?.action}
                                        </td>
                                      </>:""}
                                      
                                      {page === "number" ?
                                        <>
                                          <td style={{ cursor: "default" }}>
                                            {item.usages}
                                          </td>
                                        </>
                                        : ""}
                                      <td style={{ cursor: "default" }}>
                                        <Tippy
                                          content={
                                            item.default_whatsapp === 1
                                              ? "This DID is set as default for WhatsApp"
                                              : item.is_secondary_whatsapp === 1 ? "This DID is set as secondary for WhatsApp"
                                                : "Set this DID default for WhatsApp"
                                          }
                                        >
                                          <div className="dropdown w-100">
                                            <button
                                              data-bs-toggle="dropdown"
                                              className={
                                                item.default_whatsapp === 1
                                                  ? "tableButton edit mx-auto"
                                                  : item.is_secondary_whatsapp === 1 ? "tableButton warning mx-auto"
                                                    : "tableButton empty mx-auto"
                                              }
                                              style={{ cursor: "pointer" }}

                                            >
                                              <i className="fa-brands fa-whatsapp"></i>
                                            </button>
                                            <ul className="dropdown-menu actionBtnDropdowns">
                                              <li className="dropdown-item">
                                                <button className="clearButton text-align-start"
                                                  onClick={() => {
                                                    if (item.default_whatsapp === 0) {
                                                      handleClickDefault(item.id, "default_whatsapp");
                                                    }
                                                  }}
                                                >
                                                  <i className="fa-brands fa-whatsapp me-2" /> Default
                                                </button>
                                              </li>
                                              <li className="dropdown-item">
                                                <button className="clearButton text-align-start"
                                                  onClick={() => {
                                                    if (item.is_secondary_whatsapp === 0) {
                                                      handleClickDefault(item.id, "is_secondary_whatsapp");
                                                    }
                                                  }}
                                                >
                                                  <i className="fa-brands fa-whatsapp me-2" /> Alternate
                                                </button>
                                              </li>
                                            </ul>
                                          </div>
                                        </Tippy>
                                      </td>
                                      <td style={{ cursor: "default" }}>
                                        <Tippy
                                          content={
                                            item.default_eFax === 1
                                              ? "This DID is set as default for E-fax"
                                              : item.is_secondary_eFax === 1 ? "This DID is set as secondary for E-fax"
                                                : "Set this DID default for E-fax"
                                          }
                                        >
                                          <div className="dropdown w-100">
                                            <button
                                              data-bs-toggle="dropdown"
                                              className={
                                                item.default_eFax === 1
                                                  ? "tableButton edit mx-auto"
                                                  : item.is_secondary_eFax === 1 ? "tableButton warning mx-auto"
                                                    : "tableButton empty mx-auto"
                                              }
                                              style={{ cursor: "pointer" }}

                                            >
                                              <i className="fa-solid fa-fax"></i>
                                            </button>
                                            <ul className="dropdown-menu actionBtnDropdowns">
                                              <li className="dropdown-item">
                                                <button className="clearButton text-align-start"
                                                  onClick={() => {
                                                    if (item.default_eFax === 0) {
                                                      handleClickDefault(item.id, "default_eFax");
                                                    }
                                                  }}
                                                >
                                                  <i className="fa-solid fa-fax me-2" /> Default
                                                </button>
                                              </li>
                                              <li className="dropdown-item">
                                                <button className="clearButton text-align-start"
                                                  onClick={() => {
                                                    if (item.is_secondary_eFax === 0) {
                                                      handleClickDefault(item.id, "is_secondary_eFax");
                                                    }
                                                  }}
                                                >
                                                  <i className="fa-solid fa-fax me-2" /> Alternate
                                                </button>
                                              </li>
                                            </ul>
                                          </div>
                                        </Tippy>
                                      </td>
                                      <td style={{ cursor: "default" }}>
                                        <Tippy
                                          content={
                                            item.default_sms === 1
                                              ? "This DID is set as default for SMS"
                                              : item.is_secondary_sms === 1 ? "This DID is set as secondary for SMS"
                                                : "Set this DID default for SMS"
                                          }
                                        >
                                          <div className="dropdown w-100">
                                            <button
                                              data-bs-toggle="dropdown"
                                              className={
                                                item.default_sms === 1
                                                  ? "tableButton edit mx-auto"
                                                  : item.is_secondary_sms === 1 ? "tableButton warning mx-auto"
                                                    : "tableButton empty mx-auto"
                                              }
                                              style={{ cursor: "pointer" }}

                                            >
                                              <i className="fa-solid fa-comment-sms"></i>
                                            </button>
                                            <ul className="dropdown-menu actionBtnDropdowns">
                                              <li className="dropdown-item">
                                                <button className="clearButton text-align-start"
                                                  onClick={() => {
                                                    if (item.default_sms === 0) {
                                                      handleClickDefault(item.id, "default_sms");
                                                    }
                                                  }}
                                                >
                                                  <i className="fa-solid fa-comment-sms me-2" /> Default
                                                </button>
                                              </li>
                                              <li className="dropdown-item">
                                                <button className="clearButton text-align-start"
                                                  onClick={() => {
                                                    if (item.is_secondary_sms === 0) {
                                                      handleClickDefault(item.id, "is_secondary_sms");
                                                    }
                                                  }}
                                                >
                                                  <i className="fa-solid fa-comment-sms me-2" /> Alternate
                                                </button>
                                              </li>
                                            </ul>
                                          </div>
                                        </Tippy>
                                      </td>
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
                                              <i className="fa-solid fa-headset"></i>
                                            </button>
                                          </Tippy>
                                        </td>
                                      </> : ""}
                                      <td className="text-center">
                                        <div className="dropdown">
                                          <button className={`tableButton`} href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="fa-solid fa-ellipsis-vertical" />
                                          </button>
                                          <ul className="dropdown-menu actionBtnDropdowns">
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
                                                    <div className="clearButton text-align-start"
                                                      onClick={() =>
                                                        navigate(`/did-config`, {
                                                          state: item,
                                                        })
                                                      }>
                                                      <i className={`fa-regular fa-${item.configuration !== null ? "gear" : "triangle-exclamation"} me-2`}></i> {item.configuration !== null ? "Update" : "Configure"}
                                                    </div>
                                                  </Tippy>
                                                </li>
                                                {item.configuration !== null && (
                                                  <li className='dropdown-item'>
                                                    <Tippy content="Reset configuration of this DID">
                                                      <div className="clearButton text-align-start"
                                                        onClick={() =>
                                                          handleClick(
                                                            item.configuration.id
                                                          )
                                                        }
                                                      ><i className="fa-regular fa-arrows-rotate me-2"></i> Reset
                                                      </div>
                                                    </Tippy>
                                                  </li>
                                                )}
                                              </>
                                              : page === "number" ?
                                                <>
                                                  <li className='dropdown-item'>
                                                    <Tippy content="Select the usage of this DID">
                                                      <div className="clearButton text-align-start"
                                                        onClick={() => { setPreviousUsages(item.usages); setUsagesPopup(true); setId(item.id); setUsages(item.usages) }
                                                        }
                                                      ><i className="fa-regular fa-gear me-2"></i> Set Usage
                                                      </div>
                                                    </Tippy>
                                                  </li>
                                                </> : ""}
                                            <li className='dropdown-item'>
                                              <Tippy
                                                content={"Delete the DID"}
                                              >
                                                <div className="clearButton text-align-start"
                                                  onClick={() => { setDeletePopup(true); setDeleteId(item.id) }
                                                  }>
                                                  <i className={`fa-regular fa-trash me-2`}></i> Delete
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
              <div className="row content col-xxl-4 col-xl-5 col-md-6">
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
                        if (previousUsages === usages) {
                          setUsagesPopup(false);
                        } else if (previousUsages === "" || !previousUsages) {
                          handleUsagesEdit(id);
                          setUsagesPopup(false);
                        } else {
                          setConfirmPopup(true);
                          setUsagesPopup(false);
                        }

                      }}
                    >
                      <span className="text">Lets Go!</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
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
                        <i className="fa-solid fa-xmark"></i>
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
              <div className="row content col-xl-4 col-md-5">
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
                        <i className="fa-solid fa-check"></i>
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
                        <i className="fa-solid fa-xmark"></i>
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
      {confirmPopup ? (
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
                    {`Are you sure!
                    You want to change usages from "${previousUsages}" to "${usages === "" ? "None" : usages}"`}
                  </p>

                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="panelButton m-0"
                      onClick={() => {
                        handleUsagesEdit(id);
                        setConfirmPopup(false);
                      }}
                    >
                      <span className="text">Let's Go!</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>
                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setConfirmPopup(false);
                        setUsages("");
                        setPreviousUsages("")
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon">
                        <i className="fa-solid fa-xmark"></i>
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
