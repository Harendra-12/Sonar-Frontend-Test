import React, { useEffect, useState } from 'react'
import Header from '../../../CommonComponents/Header'
import PaginationComponent from '../../../CommonComponents/PaginationComponent'
import Tippy from '@tippyjs/react'
import { useNavigate } from 'react-router-dom'
import { generalGetFunction } from '../../../GlobalFunction/globalFunction'
import { toast } from 'react-toastify'

function Campaigns() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

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
  }, []);

  async function startCampaign(id) {
    generalGetFunction(`/campaign/start/${id}`).then((res) => {
      toast.success(res.message)
    }).catch((err) => {
      toast.error(err.response.data.message)
    })
  }

  async function stopCampaign(id) {
    generalGetFunction(`/campaign/stop/${id}`).then((res) => {
      toast.success(res.message)
    }).catch((err) => {
      toast.error(err.response.data.message)
    })
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
                    <div class="col-12">
                      <div class="heading">
                        <div class="content">
                          <h4>Campaigns</h4>
                          <p>You can see the list of campaigns</p>
                        </div>
                        <div class="buttonGroup">
                          <button class="panelButton gray">
                            <span class="text">Back</span>
                            <span class="icon"><i class="fa-solid fa-caret-left"></i></span>
                          </button>
                          <button class="panelButton" onClick={() => navigate("/campaign-create")}>
                            <span class="text">Create</span>
                            <span class="icon"><i class="fa-solid fa-plus"></i></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-12' style={{ overflow: 'auto', padding: '25px 20px 0px' }}>
                      <div class="tableHeader">
                        <div class="showEntries">
                          <label>Show</label>
                          <select class="formItem">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                          </select>
                          <label>entries</label>
                        </div>
                        <div class="searchBox">
                          <label>Search:</label>
                          <input type="text" class="formItem" value="" />
                        </div>
                      </div>
                      <div className='tableContainer'>
                        <table>
                          <thead>
                            <tr>
                              <th />
                              <th>Name</th>
                              <th>Mode</th>
                              <th>DID(s)</th>
                              <th>Gateway</th>
                              <th>Progress</th>
                              <th>Agents</th>
                              <th>Records</th>
                              <th />
                            </tr>
                          </thead>
                          <tbody>
                            {campaign?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="d-flex align-items-center justify-content-start ">
                                    <div className="phone-call">
                                      <i className="fa-solid fa-pause" />
                                    </div>
                                    <div>
                                      <span className="ms-1">Paused</span>
                                    </div>
                                  </div>
                                </td>
                                <td><b>{item.title}</b></td>
                                <td>{item?.dialer?.type}</td>
                                <td>{item.business_numbers ? JSON.parse(item.business_numbers).length : 0}</td>
                                <td>Gateway</td>
                                <td className="">
                                  <div
                                    className="specialProgressWrap"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <div className="specialProgress">
                                      <div className='segment success' style={{ width: '85%' }}></div>
                                      <div className='segment fail' style={{ width: '5%' }}></div>
                                      <div className='segment pending' style={{ width: '10%' }}></div>
                                    </div>
                                    <div className="specialProgressText">
                                      <p>0.00%</p>
                                      <span>0 of 1000</span>
                                    </div>
                                    <div className="specialProgressWrapDetails">
                                      <div className="d-flex align-items-center justify-content-start mb-1">
                                        <p
                                          style={{ fontSize: 12, fontWeight: 500, marginBottom: 0 }}
                                        >
                                          LEADS IN TOTAL
                                        </p>
                                        <span className="test-demos ms-2">1000</span>
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
                                              <div className='segment success' style={{ width: '85%' }}></div>
                                              <div className='segment fail' style={{ width: '5%' }}></div>
                                              <div className='segment pending' style={{ width: '10%' }}></div>
                                            </div>
                                            <div className="specialProgressText">
                                              <p>0.00%</p>
                                              <span>0</span>
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
                                              <div className='segment success' style={{ width: '85%' }}></div>
                                              <div className='segment fail' style={{ width: '5%' }}></div>
                                              <div className='segment pending' style={{ width: '10%' }}></div>
                                            </div>
                                            <div className="specialProgressText">
                                              <p>0.00%</p>
                                              <span>0</span>
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
                                              <div className='segment success' style={{ width: '85%' }}></div>
                                              <div className='segment fail' style={{ width: '5%' }}></div>
                                              <div className='segment pending' style={{ width: '10%' }}></div>
                                            </div>
                                            <div className="specialProgressText">
                                              <p>0.00%</p>
                                              <span>0</span>
                                            </div>
                                          </div>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <div className="avatar-container">
                                      {item.agents?.slice(0, 4).map((agent, index) => {
                                        return (
                                          <Tippy key={index} content={agent.user_id}><i class="fa-light fa-user"></i></Tippy>
                                        )
                                      })}

                                      {/* <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                         <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy>
                                                                         <Tippy content={"1001"}><i class="fa-light fa-user"></i></Tippy> */}
                                      {item.agents?.length > 4 && <span>+2</span>}

                                    </div>
                                  </div>
                                </td>
                                <td><span className='ellipsis'>Customerlist.xls</span></td>
                                <td>
                                  <div class="dropdown">
                                    <div class="tableButton" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                      <i className="fa-solid fa-ellipsis-vertical" />
                                    </div>
                                    <ul class="dropdown-menu actionBtnDropdowns">
                                      <li className='dropdown-item' onClick={() => stopCampaign(item.id)}><div class="clearButton text-align-start"><i class="fa-regular fa-circle-pause me-2"></i> Stop</div></li>
                                      <li className='dropdown-item' onClick={() => startCampaign(item.id)}><div class="clearButton text-align-start"><i class="fa-regular fa-circle-play me-2"></i> Start</div></li>
                                      <li className='dropdown-item' onClick={() => navigate(`/campaign-edit?id=${item.id}`)}><div class="clearButton text-align-start"><i class="fa-regular fa-circle-play me-2"></i> Edit</div></li>
                                    </ul>
                                  </div>
                                </td>
                              </tr>
                            ))}
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
      </main>
    </>
  )
}

export default Campaigns