import React from 'react'
import Header from '../../CommonComponents/Header'
import '../../assets/css/components/aiDashboard.css'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { hexToRgb } from '@mui/material';
import { height } from '@mui/system';

ChartJS.register(ArcElement, Tooltip, Legend);


export const data = {
  labels: ['Red', 'Blue', 'Yellow',],


  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 10],
      backgroundColor: [
        'rgba(255, 99, 133, 0.81)',
        'rgba(54, 163, 235, 0.81)',
        'rgba(255, 207, 86, 0.81)',

      ],

    },
  ],


};


function AIDashboard() {
  return (
    <>
      <main className="mainContent ">
        <section id="phonePage">
          <Header title="Reports" />
          <div className="container-fluid lightBG_ai">
            <div className="row mt-3">
              <div className='col-xxl-8'>
                <div className="row gx-xxl-3 gx-lg-2">
                  <div className="col-xl-4 col-lg-6 col-md-6 mb-3">

                    <div className="card small-widget overflow-hidden cardbg_gradient">
                      <div className="card-body primary"> <span className="text25">Calls analyzed </span>
                        <div className="textArea">
                          <p className=" fs-14 text-b mb-0" ><strong>27</strong> <span className='f-light fs-12'> by 9 Agents in last 7 days</span></p>
                        </div>
                        <div className="bg-gradient">
                          {/* <i className="fa-solid fa-headset "></i> */}
                          <img src={require('../../assets/images/customer-service.png')} alt='customer-service' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-6 mb-3">
                    <div className="card small-widget overflow-hidden cardbg_gradient2">
                      <div className="card-body success "> <span className="text25">is the average calls </span>
                        <div className="textArea">
                          <p className=" fs-14 text-b mb-0" ><strong>47</strong> <span className='f-light fs-12'> score in last 7 days</span></p>
                        </div>
                        <div className="bg-gradient">
                          {/* <i className="fa-solid fa-headset "></i> */}
                          <img src={require('../../assets/images/customer-care.png')} alt='customer-care' />
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-6 mb-3">
                    <div className="card small-widget overflow-hidden cardbg_gradient3">
                      <div className="card-body warning "> <span className="text25">Unique moments </span><div className="textArea">
                        <p className=" fs-14 text-b mb-0" ><strong>27</strong> <span className='f-light fs-12'> captured during coustomer interactions</span></p>
                      </div>
                        <div className="bg-gradient">
                          {/* <i className="fa-solid fa-headset "></i> */}
                          <img src={require('../../assets/images/phone.png')} alt='phone' />
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className='col-12'>
                    <div className='card border-0 shadow-none'>
                      <div className="card-header">
                        <div className="header-top">
                          <h5 className="m-0">Average Call Score</h5>
                        </div>
                      </div>
                      {/* <div className='card-header bg-transparent py-3' style={{ borderColor: 'var(--me-border1)' }}>
                        <h6 className='mb-0'></h6>
                      </div> */}
                      <div className='card-body py-4'>
                        <div style={{ width: '100%', height: '340px', position: 'relative', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Doughnut data={data} />
                        </div>
                      </div>
                    </div>

                    {/* <div className="card">
                      <div className="card-header ">
                        <div className="header-top">
                          <h5 className='mb-0'>Average Call Score</h5>
                        
                           <div style={{ width: '100%', height: '300px', position: 'relative', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <Doughnut data={data} />
                           </div>
                        </div>
                      </div>
                      <div className="card-body pt-0">
                        <div className="monthly-profit">
                          <div id="profitmonthly"></div>
                        </div>
                      </div>
                    </div> */}
                  </div>

                </div>
              </div>
              <div className='col-xxl-4'>

                <div className="schedule-card card">
                  <div className=" card-header">
                    <div className="header-top">
                      <h5 className="m-0">Sentiments Analytics</h5>
                    </div>
                  </div>
                  <div className=" card-body">
                    <ul className="schedule-list d-flex list-group">
                      <li className="primary list-group-item">
                        <div className="me-2"> <span className="avatar avatar-rounded bg-secondary-transparent"> <i className="fa-regular fa-face-worried text-primary"></i> </span> </div>
                        <div className=' flex-fill'>
                          <div className='d-flex justify-content-between align-items-center'>
                            <h6>
                              Maldives Trip</h6>
                            <p className='text-primary fw-bold'>50%</p>
                          </div>
                          <div className="progress re_progress" role="progressbar">
                            <div className="progress-bar bg-primary" style={{ width: '50%' }}></div>
                          </div>
                        </div>
                      </li>
                      <li className="warning list-group-item">
                        <div className="me-2"> <span className="avatar avatar-rounded bg-warning-transparent"> <i className="fa-regular fa-face-worried text-warning"></i> </span> </div>
                        <div className=' flex-fill'>
                          <div className='d-flex justify-content-between align-items-center'>
                            <h6>
                              Savings For Birthday</h6>
                            <p className='text-warning fw-bold'>90%</p>
                          </div>
                          <div className="progress re_progress" role="progressbar">
                            <div className="progress-bar bg-warning" style={{ width: '90%' }}></div>
                          </div>
                        </div>
                      </li>
                      <li className="success list-group-item">
                        <div className="me-2"> <span className="avatar avatar-rounded bg-success-transparent"> <i className="fa-regular fa-face-worried text-success"></i> </span> </div>
                        <div className=' flex-fill'>
                          <div className='d-flex justify-content-between align-items-center'>
                            <h6>
                              Join Guitar Class</h6>
                            <p className='text-success fw-bold'>40%</p>
                          </div>
                          <div className="progress re_progress" role="progressbar">
                            <div className="progress-bar bg-success" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card border-0 shadow-none mb-3">
                  <div className="card-header">
                    <div className="header-top">
                      <h5 className="m-0">Top 5 Moments</h5>
                    </div>
                  </div>
                  <div className='card-body '>
                    <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">Product Demo</span>
                    <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">Email Marketing</span>
                    <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">Problem Resolution</span>
                    <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">Meeting</span>
                    <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">Flexible schedule</span>
                  </div>
                </div>
                <div className="card border-0 shadow-none mb-3">
                  <div className="card-header">
                    <div className="header-top">
                      <h5 className="m-0">Top 5 Customs Moments</h5>
                    </div>
                  </div>
                  <div className='card-body '>
                    <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">Zoho</span>
                    <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">Sale</span>
                    <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">Hubspot</span>
                    <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">Package</span>
                    <span className="badge bg-secondary-subtle text-secondary secondary-badge-border me-1  ">Meeting</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <div className='card customAicard p-0 border-0 shadow-none'>
                  <div className="card-header">
                    <div className="header-top">
                      <h5 className="m-0">Agent Analytics</h5>
                    </div>
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
      </main >




    </>
  )
}

export default AIDashboard