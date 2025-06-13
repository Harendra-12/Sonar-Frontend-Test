import React, { useEffect, useState } from 'react'
import Header from '../../../CommonComponents/Header'
import PaginationComponent from '../../../CommonComponents/PaginationComponent'
import Tippy from '@tippyjs/react'
import { followCursor } from 'tippy.js';
import { useNavigate } from 'react-router-dom'
import { checkViewSidebar, generalDeleteFunction, generalGetFunction, generalPostFunction } from '../../../GlobalFunction/globalFunction'
import { toast } from 'react-toastify'
import SkeletonTableLoader from '../../../Loader/SkeletonTableLoader'
import EmptyPrompt from '../../../Loader/EmptyPrompt'
import { useSelector } from 'react-redux'
import ThreeDotedLoader from '../../../Loader/ThreeDotedLoader';

function Campaigns() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [deleteId, setDeleteId] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [refreshState, setRefreshState] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([0]);
  const logonUser = useSelector((state) => state.loginUser);
  const registerUser = useSelector((state) => state.registerUser);
  const campaignDetails = useSelector((state) => state.campaignDetails);
  const account = useSelector((state) => state?.account);
  const slugPermissions = useSelector((state) => state?.permissions);
  const [currentLeadData, setCurrentLeadData] = useState({});

  const getCampaignData = async (shouldLoad) => {
    if (shouldLoad) setLoading(true);
    const getCampaign = await generalGetFunction("/campaign/all")
    if (getCampaign?.status) {
      setCampaign(getCampaign.data)
      setLoading(false);
      setRefreshState(false)
    } else {
      setLoading(false);
      setRefreshState(false)
    }
  }

  useEffect(() => {
    const shouldLoad = true;
    getCampaignData(shouldLoad);
  }, [refresh]);

  async function startCampaign(id) {
    generalGetFunction(`/campaign/start/${id}`).then((res) => {
      if (res.status) {
        toast.success(res.message);
      } else {
        toast.error(res.response.data.error);
      }
    }).catch((err) => {
      toast.error(err.response.data.message)
    })
    setRefresh(refresh + 1);
  }

  async function stopCampaign(id) {
    generalGetFunction(`/campaign/stop/${id}`).then((res) => {
      toast.success(res.message);
    }).catch((err) => {
      toast.error(err.response.data.message)
    })
    setRefresh(refresh + 1);
  }

  async function deleteCampaign(id) {
    setLoading(true);
    setDeleteId('');
    // Stop the campaign before deleting
    const stopCampaign = await generalGetFunction(`/campaign/stop/${id}`);
    if (stopCampaign?.status) {
      generalDeleteFunction(`/campaign/destroy/${id}`).then((res) => {
        setLoading(false)
        toast.success(res.message)
        setRefresh(refresh + 1)
      }).catch((err) => {
        setLoading(false)
        toast.error(err.response.data.message)
      })
    }
  }

  // Get list of online users
  useEffect(() => {
    if (logonUser && logonUser.length > 0) {
      setOnlineUsers(
        registerUser?.map((item) => {
          return item.extension;
        })
      );
    }
  }, [logonUser]);

  useEffect(() => {
    if (campaignDetails.campaign_status === "Completed") {
      setRefresh(refresh + 1)
    }
  }, [campaignDetails])

  const handleRefreshBtnClicked = () => {
    setRefreshState(true)
    const shouldLoad = false;
    getCampaignData(shouldLoad);
  }

  const handleSampleCsvDownload = () => {
    const data = [{
      phone_code: "91",
      phone_number: 8878982762,
      title: "Mr",
      first_name: "john",
      middle_initial: "D",
      last_name: "Doe",
      address1: "123 Elm Street",
      address2: "Suite 4",
      address3: "Building B",
      city: "New York",
      state: "NY",
      province: null,
      postal_code: "10001",
      country_code: 91,
      gender: "M",
      date_of_birth: null,
      alt_phone: "+919899999999",
      email: "john.doe@example.com"
    }]
    const headers = Object.keys(data[0]);
    const rows = data.map((obj) =>
      headers.map((header) => JSON.stringify(obj[header] || "")).join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "sample.csv";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <main className='mainContent'>
        <section className="campaignPage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Dialer" />
              <div className='overviewTableWrapper'>
                <div className='overviewTableChild'>
                  <div className='d-flex flex-wrap'>
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Campaigns {" "}
                            <button
                              className="clearButton"
                              onClick={handleRefreshBtnClicked}
                              disabled={refreshState}
                            >
                              <i
                                className={
                                  refreshState
                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    : "fa-regular fa-arrows-rotate fs-5"
                                }
                              ></i>
                            </button>
                          </h4>
                          <p>You can see the list of campaigns</p>
                        </div>
                        <div className="buttonGroup">
                          <button
                            className="panelButton static m-0 px-2"
                            onClick={handleSampleCsvDownload}
                          >
                            <span className="text">Sample CSV</span>
                          </button>
                          <button className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
                          </button>
                          <button className="panelButton" onClick={() => navigate("/campaign-create")}>
                            <span className="text">Create</span>
                            <span className="icon"><i className="fa-solid fa-plus"></i></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-12' style={{ overflow: 'auto', padding: '25px 20px 0px' }}>
                      <div className="tableHeader">
                        <div className="showEntries">
                          <label>Show</label>
                          <select className="formItem">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                          </select>
                          <label>entries</label>
                        </div>
                        {checkViewSidebar(
                          "Campaign",
                          slugPermissions,
                          account?.sectionPermissions,
                          account?.permissions,
                          "search") &&
                          <div className="searchBox">
                            <label>Search:</label>
                            <input type="search" className="formItem" value="" />
                          </div>
                        }
                      </div>
                      <div className='tableContainer'>
                        {loading ? <ThreeDotedLoader /> :
                          <table>
                            <thead>
                              <tr>
                                <th>Status</th>
                                <th>Name</th>
                                <th>Mode</th>
                                <th>Outbound Caller ID</th>
                                <th>Progress</th>
                                <th>Agents</th>
                                <th>Records</th>
                                {(checkViewSidebar("Campaign", slugPermissions, account?.sectionPermissions, account?.permissions, "edit") || checkViewSidebar("Campaign", slugPermissions, account?.sectionPermissions, account?.permissions, "delete")) && <th>Options</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {!checkViewSidebar(
                                "Campaign",
                                slugPermissions,
                                account?.sectionPermissions,
                                account?.permissions,
                                "read")
                                ?
                                <tr>
                                  <td colSpan={99}>You dont have any permission</td>
                                </tr>
                                : (
                                  <>
                                    {campaign?.data?.length > 0 ?
                                      campaign?.data.map((item, index) => {
                                        const campaignSocketData = campaignDetails?.campaign_id?.toString() === item?.id?.toString()
                                          ?
                                          {
                                            status: campaignDetails.campaign_status,
                                            untouched_leads: campaignDetails.campaign_result.untouched_leads,
                                            complete_records: campaignDetails.campaign_result.complete_records,
                                            failed_records: campaignDetails.campaign_result.failed_records,
                                            isCampaignLive: campaignDetails.campaign_status ? (campaignDetails.campaign_status === "Aborted" || campaignDetails.campaign_status === "Completed" ? false : true) : false
                                          } : null;

                                        if (campaignDetails?.campaign_id?.toString() === item?.id?.toString() && campaignDetails?.lead) {
                                          if (!currentLeadData || currentLeadData.id !== campaignDetails.lead.id) {
                                            setCurrentLeadData(campaignDetails.lead);
                                          }
                                        }
                                        // const currentLeadData = campaignDetails?.campaign_id?.toString() === item?.id?.toString() && campaignDetails?.lead
                                        // ?
                                        // {
                                        //   phone_number: campaignDetails.lead.phone_code + ' ' + campaignDetails.lead.phone_number,
                                        //   name: campaignDetails?.lead?.title + ' ' + campaignDetails?.lead?.first_name + ' ' + campaignDetails?.lead?.middle_initial + ' ' + campaignDetails?.lead?.last_name,
                                        //   city: campaignDetails?.lead?.city,
                                        //   email: campaignDetails?.lead?.email,
                                        // } : null;

                                        return (
                                          <>
                                            <tr key={index}>
                                              <td>
                                                {
                                                  currentLeadData && Object.keys(currentLeadData).length > 0 ?
                                                    <Tippy content={
                                                      <ul className="dropdown-menu-hover">
                                                        <li>
                                                          <div className='dropdown-item'>
                                                            <span>Name: <b>{currentLeadData?.title} {currentLeadData?.first_name} {currentLeadData?.middle_initial} {currentLeadData?.last_name}</b></span>
                                                          </div>
                                                        </li>
                                                        <li>
                                                          <div className='dropdown-item'>
                                                            <span>Phone Number: <b>{currentLeadData?.phone_code} {currentLeadData?.phone_number}</b></span>
                                                          </div>
                                                        </li>
                                                        <li>
                                                          <div className='dropdown-item'>
                                                            <span>City: <b>{currentLeadData?.city}</b></span>
                                                          </div>
                                                        </li>
                                                        <li>
                                                          <div className='dropdown-item'>
                                                            <span>Email: <b>{currentLeadData?.email}</b></span>
                                                          </div>
                                                        </li>
                                                      </ul>
                                                    } allowHTML={true}>
                                                      <div className="d-flex align-items-center justify-content-start ">
                                                        <div className="phone-call">
                                                          <i className={`fa-solid fa-${!campaignSocketData?.isCampaignLive || item.status === "Aborted" ? 'stop' : 'play'}`} />
                                                        </div>
                                                        <div>
                                                          <span className="ms-1 text-capitalize">{campaignSocketData?.status?.replace(/_/g, " ") || item.status}</span>
                                                        </div>
                                                      </div>
                                                    </Tippy> :
                                                    <div className="d-flex align-items-center justify-content-start ">
                                                      <div className="phone-call">
                                                        <i className={`fa-solid fa-${!campaignSocketData?.isCampaignLive || item.status === "Aborted" ? 'stop' : 'play'}`} />
                                                      </div>
                                                      <div>
                                                        <span className="ms-1 text-capitalize">{campaignSocketData?.status?.replace(/_/g, " ") || item.status}</span>
                                                      </div>
                                                    </div>
                                                }
                                              </td>
                                              <td><b>{item.title}</b></td>
                                              <td style={{ textTransform: 'capitalize' }}>{item?.dialer?.type}</td>
                                              <td>
                                                {item.did_business_numbers ?
                                                  <ul className='p-0 m-0 list-unstyled'>
                                                    {item.did_business_numbers.map((number, index) => (
                                                      <li>{number.did}</li>
                                                    ))}
                                                  </ul>
                                                  : "N/A"}
                                              </td>
                                              <td className="">
                                                <Tippy
                                                  content={
                                                    <div className="specialProgressWrapDetails">
                                                      <div className="d-flex align-items-center justify-content-start mb-1">
                                                        <p
                                                          style={{ fontSize: 12, fontWeight: 500, marginBottom: 0 }}
                                                        >
                                                          LEADS IN TOTAL
                                                        </p>
                                                        <span className="test-demos ms-2">{item?.total_leads || 0}</span>
                                                      </div>
                                                      <ul>
                                                        <li>
                                                          <p
                                                            style={{
                                                              color: "rgb(92, 92, 92)",
                                                              fontSize: 12,
                                                              fontWeight: 400
                                                            }}
                                                            className="p-0 m-0"
                                                          >
                                                            Successful Records
                                                          </p>
                                                          <div className="specialProgressWrap">
                                                            <div className="specialProgress">
                                                              <div className='segment success'
                                                                style={{ width: `${((parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.complete_records : item?.complete_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}
                                                              >
                                                              </div>
                                                              <div className='segment pending'
                                                                style={{ width: `${parseFloat(item?.total_leads) === 0 ? "100" : (100 - (parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.complete_records : item?.complete_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}
                                                              >
                                                              </div>
                                                            </div>
                                                            <div className="specialProgressText">
                                                              <p>{parseFloat(item?.total_leads) === 0 ? "0.00" : ((parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.complete_records : item?.complete_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%</p>
                                                              <span>{campaignSocketData?.isCampaignLive ? campaignSocketData.complete_records : item?.complete_records || 0}</span>
                                                            </div>
                                                          </div>
                                                        </li>
                                                        <li>
                                                          <p
                                                            style={{
                                                              color: "rgb(92, 92, 92)",
                                                              fontSize: 12,
                                                              fontWeight: 400
                                                            }}
                                                            className="p-0 m-0"
                                                          >
                                                            Failed records
                                                          </p>
                                                          <div className="specialProgressWrap">
                                                            <div className="specialProgress">
                                                              <div className='segment fail'
                                                                style={{ width: `${((parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.failed_records : item?.failed_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}
                                                              >
                                                              </div>
                                                              <div className='segment pending'
                                                                style={{ width: `${parseFloat(item?.total_leads) === 0 ? "100" : (100 - (parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.failed_records : item?.failed_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}>
                                                              </div>
                                                            </div>
                                                            <div className="specialProgressText">
                                                              <p>{parseFloat(item?.total_leads) === 0 ? "0.00" : ((parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.failed_records : item?.failed_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%</p>
                                                              <span>{campaignSocketData?.isCampaignLive ? campaignSocketData.failed_records : item?.failed_records || 0}</span>
                                                            </div>
                                                          </div>
                                                        </li>
                                                        <li>
                                                          <p
                                                            style={{
                                                              color: "rgb(92, 92, 92)",
                                                              fontSize: 12,
                                                              fontWeight: 400
                                                            }}
                                                            className="p-0 m-0"
                                                          >
                                                            Untouched records
                                                          </p>
                                                          <div className="specialProgressWrap">
                                                            <div className="specialProgress">
                                                              <div className='segment success'
                                                                style={{ width: `${((parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.untouched_leads : item?.untouched_leads || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}
                                                              >
                                                              </div>
                                                              <div className='segment pending'
                                                                style={{ width: `${parseFloat(item?.total_leads) === 0 ? "100" : (100 - (parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.untouched_leads : item?.untouched_leads || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}
                                                              >
                                                              </div>
                                                            </div>
                                                            <div className="specialProgressText">
                                                              <p>{parseFloat(item?.total_leads) === 0 ? "0.00" : ((parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.untouched_leads : item?.untouched_leads || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%</p>
                                                              <span>{campaignSocketData?.isCampaignLive ? campaignSocketData.untouched_leads : item?.untouched_leads || 0}</span>
                                                            </div>
                                                          </div>
                                                        </li>
                                                      </ul>
                                                    </div>
                                                  }
                                                  allowHTML={true}>
                                                  <div
                                                    className="specialProgressWrap"
                                                    style={{ cursor: "pointer" }}
                                                  >
                                                    <div className="specialProgress">
                                                      <div className='segment success' style={{ width: `${parseFloat(item?.total_leads) === 0 ? "0" : ((parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.complete_records : item?.complete_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}></div>
                                                      <div className='segment fail' style={{ width: `${parseFloat(item?.total_leads) === 0 ? "0" : ((parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.failed_records : item?.failed_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}></div>
                                                      <div className='segment pending' style={{ width: `${parseFloat(item?.total_leads) === 0 ? "100" : ((parseFloat(campaignSocketData?.isCampaignLive ? campaignSocketData.untouched_leads : item?.untouched_leads || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}></div>
                                                    </div>
                                                    <div className="specialProgressText">
                                                      <p>
                                                        {parseFloat(item?.total_leads) === 0 ? "0.00" :
                                                          ((parseFloat(item?.total_leads - (campaignSocketData?.isCampaignLive ? campaignSocketData.untouched_leads : item?.untouched_leads) || 0.00) / parseFloat(item?.total_leads || 0.00)) * 100).toFixed(2)}%
                                                      </p>
                                                      <span>{parseFloat(item?.total_leads - (campaignSocketData?.isCampaignLive ? campaignSocketData.untouched_leads : item?.untouched_leads)) || 0} of {item?.total_leads || 0}</span>
                                                    </div>
                                                  </div>
                                                </Tippy>
                                              </td>
                                              <td>
                                                {item.agents.length === 0 ? "N/A" :
                                                  <div style={{ width: "max-content" }}>
                                                    <Tippy content={
                                                      <ul className="dropdown-menu-hover"
                                                        style={{ columnCount: item.agents.length > 8 ? 2 : 1 }}
                                                      >
                                                        {item.agents?.map(
                                                          (item, index) => (
                                                            <li>
                                                              <div className="dropdown-item d-flex align-items-center" >
                                                                <span className="avatar-container">
                                                                  {
                                                                    item?.profile_picture ?
                                                                      <img
                                                                        alt="profile"
                                                                        src={item?.profile_picture}
                                                                        onError={(e) => e.target.src = require('../../../assets/images/placeholder-image.webp')}
                                                                      /> : <i className="fa-light fa-user"></i>}
                                                                </span>
                                                                <span className="ms-2">{item?.username}</span>
                                                                <span
                                                                  className={
                                                                    onlineUsers?.includes(item?.extension)
                                                                      ? "extensionStatus online ms-2"
                                                                      : "extensionStatus ms-2"
                                                                  }
                                                                ></span>
                                                              </div>
                                                            </li>
                                                          )
                                                        )}
                                                      </ul>
                                                    } allowHTML={true} placement="bottom" interactive={true} popperOptions={{ strategy: 'fixed' }} followCursor={true} plugins={[followCursor]}>
                                                      <div className="hover-dropdown">
                                                        <div className="avatar-container">
                                                          {item?.agents?.slice(0, 4).map((agent, index) => {
                                                            return (
                                                              <Tippy key={index} content={agent?.username}>
                                                                {agent?.profile_picture ? (
                                                                  <img
                                                                    src={agent?.profile_picture}
                                                                    onError={(e) => e.target.src = require('../../../assets/images/placeholder-image.webp')}
                                                                  />
                                                                ) : (
                                                                  <i className="fa-light fa-user"></i>
                                                                )}
                                                              </Tippy>
                                                            )
                                                          })}
                                                          {item?.agents?.length > 4 && <span>+2</span>}
                                                        </div>
                                                      </div>
                                                    </Tippy>
                                                  </div>
                                                }
                                              </td>
                                              <td>
                                                {item?.lead_files?.length > 0 ? <Tippy content={
                                                  <ul className="dropdown-menu light d-block position-static">
                                                    <li className="col-12">
                                                      <div className="dropdown-item fw-bold disabled">Leads</div>
                                                    </li>
                                                    <div style={{ columnCount: 1 }}>
                                                      {item?.lead_files?.map((lead, index) => {
                                                        return (
                                                          <li key={lead.id}>
                                                            <div className="dropdown-item d-flex">
                                                              {/* <div class="my-auto position-relative mx-1">
                                                                <div class="cl-toggle-switch">
                                                                  <label class="cl-switch">
                                                                    <input type="checkbox" id="showAllCheck" />
                                                                    <span></span>
                                                                  </label>
                                                                </div>
                                                              </div> */}
                                                              <div className='ms-2'>{lead?.name}</div>
                                                            </div>
                                                          </li>
                                                        )
                                                      })}
                                                    </div>
                                                  </ul>
                                                } allowHTML={true} interactive={true}>
                                                  <span>{item?.lead_files?.length} File(s)</span>
                                                </Tippy> : "No Files"}
                                              </td>
                                              {(checkViewSidebar("Campaign", slugPermissions, account?.sectionPermissions, account?.permissions, "edit") || checkViewSidebar("Campaign", slugPermissions, account?.sectionPermissions, account?.permissions, "delete")) ? 
                                              <td>
                                                <div className="dropdown">
                                                  <div className="tableButton" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i className="fa-solid fa-ellipsis-vertical" />
                                                  </div>
                                                  <ul className="dropdown-menu actionBtnDropdowns">
                                                    <li className='dropdown-item' onClick={() => stopCampaign(item.id)}><div className="clearButton text-align-start"><i className="fa-regular fa-circle-stop me-2"></i> Stop</div></li>
                                                    <li className='dropdown-item' onClick={() => startCampaign(item.id)}><div className="clearButton text-align-start"><i className="fa-regular fa-circle-play me-2"></i> Start</div></li>
                                                    {checkViewSidebar("Campaign", slugPermissions, account?.sectionPermissions, account?.permissions, "edit") && <li className='dropdown-item' onClick={() => navigate(`/campaign-edit?id=${item.id}`)}><div className="clearButton text-align-start"><i className="fa-regular fa-pen me-2"></i> Edit</div></li>}
                                                    <li className='dropdown-item' onClick={() => navigate(`/campaign-scheduler`)}><div className="clearButton text-align-start"><i className="fa-regular fa-clock me-2"></i> Schedule</div></li>
                                                    {checkViewSidebar("Campaign", slugPermissions, account?.sectionPermissions, account?.permissions, "delete") && <li className='dropdown-item' onClick={() => setDeleteId(item.id)}><div className="clearButton text-align-start"><i className="fa-regular fa-trash me-2"></i> Delete</div></li>}
                                                  </ul>
                                                </div>
                                              </td> : ""}
                                            </tr >
                                          </>
                                        )
                                      }) : <tr><td colSpan={99}><EmptyPrompt generic={true} /> </td></tr>}
                                  </>
                                )}
                            </tbody>
                          </table>
                        }
                      </div>
                      <div className="tableHeader mb-3">
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={campaign.last_page}
                          from={(pageNumber - 1) * campaign.per_page + 1}
                          to={campaign.to}
                          total={campaign.total}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {deleteId !== "" ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4 col-md-5">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-triangle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Warning!</h4>
                    <p>
                      Are you sure you want to delete this campaign?
                    </p>
                    <div className="mt-2 d-flex justify-content-between">
                      <button
                        className="panelButton m-0"
                        onClick={() => deleteCampaign(deleteId)}
                      >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => setDeleteId("")}
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
      </main >
    </>
  )
}

export default Campaigns