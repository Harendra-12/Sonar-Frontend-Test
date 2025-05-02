import React, { useEffect, useState } from 'react'
import Header from '../../../CommonComponents/Header'
import PaginationComponent from '../../../CommonComponents/PaginationComponent'
import Tippy from '@tippyjs/react'
import { useNavigate } from 'react-router-dom'
import { generalDeleteFunction, generalGetFunction } from '../../../GlobalFunction/globalFunction'
import { toast } from 'react-toastify'
import SkeletonTableLoader from '../../../Loader/SkeletonTableLoader'
import EmptyPrompt from '../../../Loader/EmptyPrompt'
function Campaigns() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [deleteId, setDeleteId] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true);
    async function getCampaignData() {
      const getCampaign = await generalGetFunction("/campaign/all")
      if (getCampaign?.status) {
        setCampaign(getCampaign.data)
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
    getCampaignData();
  }, [refresh]);

  async function startCampaign(id) {
    generalGetFunction(`/campaign/start/${id}`).then((res) => {
      toast.success(res.message);
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
                          <h4>Campaigns</h4>
                          <p>You can see the list of campaigns</p>
                        </div>
                        <div className="buttonGroup">
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
                        <div className="searchBox">
                          <label>Search:</label>
                          <input type="search" className="formItem" value="" />
                        </div>
                      </div>
                      <div className='tableContainer'>
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
                              <th>Options</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <SkeletonTableLoader col={8} row={15} />
                            ) : (
                              <>
                                {campaign?.data?.length > 0 ?
                                  campaign?.data.map((item, index) => (
                                    <tr key={index}>
                                      <td>
                                        <div className="d-flex align-items-center justify-content-start ">
                                          <div className="phone-call">
                                            <i className={`fa-solid fa-${item.status === 'Active' ? 'play' : 'pause'}`} />
                                          </div>
                                          <div>
                                            <span className="ms-1">{item.status}</span>
                                          </div>
                                        </div>
                                      </td>
                                      <td><b>{item.title}</b></td>
                                      <td style={{ textTransform: 'capitalize' }}>{item?.dialer?.type}</td>
                                      <td>
                                        {item.did_business_numers ?
                                          <ul className='p-0 m-0 list-unstyled'>
                                            {item.did_business_numers.map((number, index) => (

                                              <li>{number.did}</li>

                                            ))}
                                          </ul>
                                          : 0}
                                      </td>
                                      <td className="">
                                        <Tippy content={
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
                                                  Completed records
                                                </p>
                                                <div className="specialProgressWrap">
                                                  <div className="specialProgress">
                                                    <div className='segment success'
                                                      style={{ width: `${((parseFloat(item?.complete_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}
                                                    >
                                                    </div>
                                                    <div className='segment pending'
                                                      style={{ width: `${parseFloat(item?.total_leads) === 0 ? "100" : (100 - (parseFloat(item?.complete_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}
                                                    >
                                                    </div>
                                                  </div>
                                                  <div className="specialProgressText">
                                                    <p>{parseFloat(item?.total_leads) === 0 ? "0.00" : ((parseFloat(item?.complete_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%</p>
                                                    <span>{item?.complete_records || 0}</span>
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
                                                    <div className='segment success'
                                                      style={{ width: `${((parseFloat(item?.failed_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}
                                                    >
                                                    </div>
                                                    <div className='segment pending'
                                                      style={{ width: `${parseFloat(item?.total_leads) === 0 ? "100" : (100 - (parseFloat(item?.failed_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}>
                                                    </div>
                                                  </div>
                                                  <div className="specialProgressText">
                                                    <p>{parseFloat(item?.total_leads) === 0 ? "0.00" : ((parseFloat(item?.failed_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%</p>
                                                    <span>{item?.failed_records || 0}</span>
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
                                                      style={{ width: `${((parseFloat(item?.untouched_leads || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}
                                                    >
                                                    </div>
                                                    <div className='segment pending'
                                                      style={{ width: `${parseFloat(item?.total_leads) === 0 ? "100" : (100 - (parseFloat(item?.untouched_leads || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}
                                                    >
                                                    </div>
                                                  </div>
                                                  <div className="specialProgressText">
                                                    <p>{parseFloat(item?.total_leads) === 0 ? "0.00" : ((parseFloat(item?.untouched_leads || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%</p>
                                                    <span>{item?.untouched_leads || 0}</span>
                                                  </div>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        } allowHTML={true}>
                                          <div
                                            className="specialProgressWrap"
                                            style={{ cursor: "pointer" }}
                                          >
                                            <div className="specialProgress">
                                              <div className='segment success' style={{ width: `${parseFloat(item?.total_leads) === 0 ? "0" : ((parseFloat(item?.complete_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}></div>
                                              <div className='segment fail' style={{ width: `${parseFloat(item?.total_leads) === 0 ? "0" : ((parseFloat(item?.failed_records || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}></div>
                                              <div className='segment pending' style={{ width: `${parseFloat(item?.total_leads) === 0 ? "100" : ((parseFloat(item?.untouched_leads || 0) / parseFloat(item?.total_leads || 0)) * 100).toFixed(2)}%` }}></div>
                                            </div>
                                            <div className="specialProgressText">
                                              <p>
                                                {parseFloat(item?.total_leads) === 0 ? "0.00" :
                                                  ((parseFloat(item?.complete_records || 0.00) / parseFloat(item?.total_leads || 0.00)) * 100).toFixed(2)}%
                                              </p>
                                              <span>{item?.complete_records || 0} of {item?.total_leads || 0}</span>
                                            </div>
                                          </div>
                                        </Tippy>
                                      </td>
                                      <td>
                                        {item.agents.length === 0 ? "N/A" :
                                          <div>
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
                                                            item.profile_picture ?
                                                              <img
                                                                alt="profile"
                                                                src={item.profile_picture}
                                                                onError={(e) => e.target.src = require('../../../assets/images/placeholder-image.webp')}
                                                              /> : <i className="fa-light fa-user"></i>}
                                                        </span>
                                                        <span className="ms-2">{item?.username}</span>
                                                      </div>
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            } allowHTML={true} placement="bottom" interactive={true} popperOptions={{ strategy: 'fixed' }}>
                                              <div className="hover-dropdown">
                                                <div className="avatar-container">
                                                  {item.agents?.slice(0, 4).map((agent, index) => {
                                                    return (
                                                      <Tippy key={index} content={agent.username}>
                                                        {agent.profile_picture ? (
                                                          <img
                                                            src={agent.profile_picture}
                                                            onError={(e) => e.target.src = require('../../../assets/images/placeholder-image.webp')}
                                                          />
                                                        ) : (
                                                          <i className="fa-light fa-user"></i>
                                                        )}
                                                      </Tippy>
                                                    )
                                                  })}
                                                  {item.agents?.length > 4 && <span>+2</span>}
                                                </div>
                                              </div>
                                            </Tippy>

                                          </div>
                                        }
                                      </td>
                                      <td>
                                        <Tippy content={
                                          <ul className="dropdown-menu light d-block">
                                            <li className="col-12">
                                              <div className="dropdown-item fw-bold disabled">Leads</div>
                                            </li>
                                            <div style={{ columnCount: 1 }}>
                                              <li>
                                                <div className="dropdown-item d-flex">
                                                  <div class="my-auto position-relative mx-1">
                                                    <div class="cl-toggle-switch">
                                                      <label class="cl-switch">
                                                        <input type="checkbox" id="showAllCheck" />
                                                        <span></span>
                                                      </label>
                                                    </div>
                                                  </div>
                                                  <div className='ms-2'>Lead Name</div>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="dropdown-item d-flex">
                                                  <div class="my-auto position-relative mx-1">
                                                    <div class="cl-toggle-switch">
                                                      <label class="cl-switch">
                                                        <input type="checkbox" id="showAllCheck" />
                                                        <span></span>
                                                      </label>
                                                    </div>
                                                  </div>
                                                  <div className='ms-2'>Lead Name</div>
                                                </div>
                                              </li>
                                              <li>
                                                <div className="dropdown-item d-flex">
                                                  <div class="my-auto position-relative mx-1">
                                                    <div class="cl-toggle-switch">
                                                      <label class="cl-switch">
                                                        <input type="checkbox" id="showAllCheck" />
                                                        <span></span>
                                                      </label>
                                                    </div>
                                                  </div>
                                                  <div className='ms-2'>Lead Name</div>
                                                </div>
                                              </li>
                                            </div>
                                          </ul>
                                        } allowHTML={true} interactive={true}>
                                          <span>5 Leads</span>
                                        </Tippy>
                                      </td>
                                      <td>
                                        <div className="dropdown">
                                          <div className="tableButton" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="fa-solid fa-ellipsis-vertical" />
                                          </div>
                                          <ul className="dropdown-menu actionBtnDropdowns">
                                            <li className='dropdown-item' onClick={() => stopCampaign(item.id)}><div className="clearButton text-align-start"><i className="fa-regular fa-circle-stop me-2"></i> Stop</div></li>
                                            <li className='dropdown-item' onClick={() => startCampaign(item.id)}><div className="clearButton text-align-start"><i className="fa-regular fa-circle-play me-2"></i> Start</div></li>
                                            <li className='dropdown-item' onClick={() => navigate(`/campaign-edit?id=${item.id}`)}><div className="clearButton text-align-start"><i className="fa-regular fa-pen me-2"></i> Edit</div></li>
                                            <li className='dropdown-item' onClick={() => navigate(`/campaign-scheduler`)}><div className="clearButton text-align-start"><i className="fa-regular fa-clock me-2"></i> Schedule</div></li>
                                            <li className='dropdown-item' onClick={() => setDeleteId(item.id)}><div className="clearButton text-align-start"><i className="fa-regular fa-trash me-2"></i> Delete</div></li>
                                          </ul>
                                        </div>
                                      </td>
                                    </tr>
                                  )) : <tr><td colSpan={99}><EmptyPrompt generic={true} /> </td></tr>}
                              </>
                            )}
                          </tbody>
                        </table>
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
      </main>
    </>
  )
}

export default Campaigns