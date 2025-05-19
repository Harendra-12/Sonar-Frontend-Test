import React from 'react'
import Header from '../../CommonComponents/Header'
import '../../assets/css/components/aiDashboard.css'

function AIDashboard() {
  return (
    <>
      <main className="mainContent ">
        <section id="phonePage">
          <Header title="Reports" />
          <div className="container-fluid ">
            <div className="row  my-3">
              <div className='col-xxl-8'>
                <div class="row gx-xxl-3 gx-lg-2">
                  <div class="col-xl-4 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                    {/* <div class="itemWrapper a d_card1">
                      <div class="heading h-auto">
                        <div class="d-flex flex-wrap justify-content-between align-items-center">
                          <div class="col-10">
                            <h5>calls analyzed</h5>
                          </div>
                          <div class="col-2"><i class="fa-solid fa-headset"></i></div>
                        </div>
                      </div>
                      <div class="data-number2">
                        <div class="d-flex flex-wrap justify-content-between align-items-center">
                          <div class="col-10">
                            <h5>27</h5>
                            <p>by 9 Agents in last 7 days</p>
                          </div>
                        </div>
                      </div>
                      <div class="d_chartImg"><img src="/static/media/d-chart1.9f0f46bd99b5a1d15636.png" alt="diagram" /></div>
                    </div> */}
                    <div class="card trending-card height-equal bg-1">
                      <div class="card-body activity-card">
                        <div class="appointment-table ">
                          <div class=" card-no-border bg-transparent">
                            <div class="header-top">
                              <div>
                                <span class="c-o-light mb-1">Total Users</span>
                                <div class="common-align">
                                  <h5 class="mb-1">863</h5>
                                 
                                </div>
                                   <p class="mb-0 f-light fs-12">If you are an artist then showcase your artwork and convert your art into NFT art.</p>
                              </div>
                              <div>
                                <div class="analytics-tread bg-light-primary">
                                 <i class="fa-solid fa-headset fs-4"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                         
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-4 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                    {/* <div class="itemWrapper b d_card2 position-relative">
                      <div class="heading h-auto">
                        <div class="d-flex flex-wrap justify-content-between align-items-center">
                          <div class="col-10">
                            <h5>is the average calls</h5>
                          </div>
                          <div class="col-2"><i class="fa-solid fa-timer"></i></div>
                        </div>
                      </div>
                      <div class="data-number2">
                        <div class="d-flex flex-wrap justify-content-between align-items-center">
                          <div class="col-10">
                            <h5>47</h5>
                            <p>score in last 7 days</p>
                          </div>
                        </div>
                      </div>
                      <div class="d_chartImg"><img src="/static/media/d-chart2.5cc2870bfcb2b417b2e2.png" alt="diagram" /></div>
                    </div> */}

                        <div class="card trending-card height-equal bg-2">
                      <div class="card-body activity-card">
                        <div class="appointment-table ">
                          <div class=" card-no-border bg-transparent">
                            <div class="header-top">
                              <div>
                                <span class="c-o-light mb-1">Total Users</span>
                                <div class="common-align">
                                  <h5 class="mb-1">863</h5>
                                 
                                </div>
                                   <p class="mb-0 f-light fs-12">If you are an artist then showcase your artwork and convert your art into NFT art.</p>
                              </div>
                              <div>
                                <div class="analytics-tread bg-light-primary">
                                 <i class="fa-solid fa-headset fs-4"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                         
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-4 col-lg-6 col-md-6 mb-xl-2 mb-lg-2 mb-md-2">
                    {/* <div class="itemWrapper c d_card3">
                      <div class="heading h-auto">
                        <div class="d-flex flex-wrap justify-content-between align-items-center">
                          <div class="col-10">
                            <h5>Unique moments</h5>
                          </div>
                          <div class="col-2"><i class="fa-solid fa-folder-open"></i></div>
                        </div>
                      </div>
                      <div class="data-number2">
                        <div class="d-flex flex-wrap justify-content-between align-items-center">
                          <div class="col-10">
                            <h5>27</h5>
                            <p>captured during coustomer interactions</p>
                          </div>
                        </div>
                      </div>
                      <div class="d_chartImg"><img src="/static/media/d-chart3.4814237d1439be144d9b.png" alt="diagram" /></div>
                    </div> */}

                        <div class="card trending-card height-equal bg-3">
                      <div class="card-body activity-card">
                        <div class="appointment-table ">
                          <div class=" card-no-border bg-transparent">
                            <div class="header-top">
                              <div>
                                <span class="c-o-light mb-1">Total Users</span>
                                <div class="common-align">
                                  <h5 class="mb-1">863</h5>
                                 
                                </div>
                                   <p class="mb-0 f-light fs-12">If you are an artist then showcase your artwork and convert your art into NFT art.</p>
                              </div>
                              <div>
                                <div class="analytics-tread bg-light-primary">
                                 <i class="fa-solid fa-headset fs-4"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                         
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-12'>
                    <div className='card border-0 shadow-none'>
                      <div className='card-header bg-transparent py-3' style={{ borderColor: 'var(--me-border1)' }}>
                        <h6 className='mb-0'>Average Call Score</h6>
                      </div>
                      <div className='card-body'>
                        <div className='circularProgressWrapper'>
                          <svg width="250" height="250" viewBox="0 0 250 250" className="circular-progress"
                          // style={{ '--progress': `${Math.round((accountDetails?.extensions?.filter((item) => item.user == null)?.length / accountDetails?.extensions?.length) * 100)}` }}
                          >
                            <circle className="bg"
                              cx="125" cy="125" r="115" fill="none" stroke="#ff8c4230" stroke-width="20"
                            ></circle>
                            <circle className="fg"
                              cx="125" cy="125" r="115" fill="none" stroke="#ff8c42" stroke-width="20"
                              stroke-dasharray="361.25 361.25"
                            ></circle>
                          </svg>
                          <div className='circularProgressContent'>
                            <div className="data-number">
                              {/* <label style={{ color: '#ff8c42' }}>{accountDetails?.extensions?.filter((item) => item.user == null)?.length}</label> <span>/ {accountDetails?.extensions?.length}</span> */}
                            </div>
                            <p>Total Available Extensions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className='col-xxl-4'>
                <div class="card customAicard p-0 mb-3">
                  <div class="card-header justify-content-between bg-transparent" style={{ borderColor: 'var(--me-border1)' }}>
                    <div class="card-title">Sentiments Analytics</div>
                  </div>
                  <div class="card-body">
                    <ul class="list-unstyled personal-goals-list mb-0">
                      <li>
                        <div class="d-flex align-items-center">
                          <div class="me-2"> <span class="avatar avatar-rounded bg-secondary-transparent"> <i class="fa-regular fa-face-worried"></i> </span> </div>
                          <div class="flex-fill">
                            <div class="d-flex align-items-center justify-content-between mb-2"> <span class="d-block fw-semibold">Maldives Trip</span> <span class="d-block text-info">80%</span> </div>
                            <div class="progress progress-animate progress-xs shadow-none" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100">
                              <div class="progress-bar progress-bar-striped bg-secondary" style={{ width: '80%' }}></div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div class="d-flex align-items-center">
                          <div class="me-2"> <span class="avatar avatar-rounded bg-warning-transparent"><i class="fa-regular fa-face-meh"></i> </span> </div>
                          <div class="flex-fill">
                            <div class="d-flex align-items-center justify-content-between mb-2"> <span class="d-block fw-semibold">Savings For Birthday</span> <span class="d-block text-warning">90%</span> </div>
                            <div class="progress progress-animate progress-xs shadow-none" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100">
                              <div class="progress-bar progress-bar-striped bg-warning" style={{ width: '90%' }}></div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div class="d-flex align-items-center">
                          <div class="me-2"> <span class="avatar avatar-rounded bg-success-transparent"><i class="fa-regular fa-face-smile"></i> </span> </div>
                          <div class="flex-fill">
                            <div class="d-flex align-items-center justify-content-between mb-2"> <span class="d-block fw-semibold">Join Guitar Class</span> <span class="d-block text-success">80%</span> </div>
                            <div class="progress progress-animate progress-xs shadow-none" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
                              <div class="progress-bar progress-bar-striped bg-success" style={{ width: '40%' }}></div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card border-0 shadow-none mb-3">
                  <div className='card-body'>
                    <h5>Top 5 Moments</h5>
                    <span className="badge badge-soft-secondary rounded-p
                    >Product Demo</span>
                    <span className="badge badge-soft-secondary rounded-pi
                    >Email marketing</span>
                    <span className="badge badge-soft-secondary rounded-pi
                    >Email marketing</span>
                    <span className="badge badge-soft-secondary rounded-pi
                    >Email marketing</span>
                  </div>
                </div>
                <div className="card border-0 shadow-none">
                  <div className='card-body'>
                    <h5>Top 5 Customs Moments</h5>
                    <span className="badge badge-soft-secondary rounded-p
                    >Product Demo</span>
                    <span className="badge badge-soft-secondary rounded-pi
                    >Email marketing</span>
                    <span className="badge badge-soft-secondary rounded-pi
                    >Email marketing</span>
                    <span className="badge badge-soft-secondary rounded-pi
                    >Email marketing</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <div className='card customAicard p-0 border-0 shadow-none'>
                  <div class="card-header justify-content-between bg-transparent" style={{ borderColor: 'var(--me-border1)' }}>
                    <div class="card-title">Agent Analytics</div>
                  </div>
                  <div className='card-body'>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Avg Call Score</th>
                            <th>Customer Sentiments</th>
                            <th>Customer Satisfaction</th>
                            <th>Top Moments</th>

                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="tableProfilePicHolder">
                                  {/* {item.profile_picture ? ( */}
                                  <img
                                    src={require('../../assets/images/placeholder-image.webp')}
                                  // onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                  />
                                  {/* ) : ( */}
                                  {/* <i className="fa-light fa-user" /> */}
                                  {/* )} */}
                                </div>
                                <div className="ms-2">Rajendro.sau</div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-soft-primary  rounded-pill"

                              >30</span>

                            </td>
                            <td>
                              <span className="badge badge-soft-primary  rounded-pill"

                              >30</span>
                            </td>
                            <td>   <span className="badge badge-soft-primary  rounded-pill"
                            >30</span></td>
                            <td>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                            </td>

                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="tableProfilePicHolder">
                                  {/* {item.profile_picture ? ( */}
                                  <img
                                    src={require('../../assets/images/placeholder-image.webp')}
                                  // onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                  />
                                  {/* ) : ( */}
                                  {/* <i className="fa-light fa-user" /> */}
                                  {/* )} */}
                                </div>
                                <div className="ms-2">Rajendro.sau</div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-soft-primary  rounded-pill"

                              >30</span>

                            </td>
                            <td>
                              <span className="badge badge-soft-primary  rounded-pill"
                              >30</span>
                            </td>
                            <td>   <span className="badge badge-soft-primary  rounded-pill"
                            >30</span></td>
                            <td>
                              <span className="badge badge-soft-secondary rounded-pill"
                              >Product Demo</span>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                            </td>

                          </tr>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="tableProfilePicHolder">
                                  {/* {item.profile_picture ? ( */}
                                  <img
                                    src={require('../../assets/images/placeholder-image.webp')}
                                  // onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                  />
                                  {/* ) : ( */}
                                  {/* <i className="fa-light fa-user" /> */}
                                  {/* )} */}
                                </div>
                                <div className="ms-2">Rajendro.sau</div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-soft-primary  rounded-pill"

                              >30</span>

                            </td>
                            <td>
                              <span className="badge badge-soft-primary  rounded-pill"

                              >30</span>
                            </td>
                            <td>   <span className="badge badge-soft-primary  rounded-pill"
                            >30</span></td>
                            <td>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                              <span className="badge badge-soft-secondary rounded-pill"

                              >Product Demo</span>
                            </td>

                          </tr>

                        </tbody>
                      </table>
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

export default AIDashboard