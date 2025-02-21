import React from 'react'
// import CircularLoader from '../../Loader/CircularLoader';
import Header from '../../CommonComponents/Header';
import Tippy from '@tippyjs/react';

function UserProfile() {
    
    return (
        <main className="mainContent">
            {/* {<CircularLoader />} */}
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="User Profile" />
                        {/* <div className="col-12 mt-3">
             <div className="row px-xl-3 py-2" id="detailsHeader">
              <div className="col-xl-2 col-4 d-flex align-items-center">
                <h4 className="my-auto">My Profile</h4>
              </div>
              <div className="col-xl-4 col-4 my-auto">
                <div className="position-relative searchBox">
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                  />
                </div>
              </div>
              <div className="col-xl-6 col-4 d-flex justify-content-end">
                <div className="mx-xl-3 my-auto">
                  <button className="getApp" effect="ripple">
                    Get Our App
                  </button>
                </div>
              </div>
            </div> 
          </div> */}
                    </div>
                    <div className="row" style={{
                        padding: "20px 10px",
                        // backgroundImage: "linear-gradient(0deg, white 0%, #3e8ef7 90%)"
                    }}
                    >
                        <div className="col-xl-12 pe-xl-0 mt-5">
                            <div className="profileView mt-2">
                                <div className="profileDetailsHolder p-0">
                                    <div className="baseDetails">
                                        <div className="col-xxl-5 col-xl-5">
                                            <div className="profilePicHolders">
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                                    alt="img"
                                                />
                                                <div className='mt-3'>
                                                <div className="content profileicons mt-1 d-flex align-items-center justify-content-start">
                                                    <span>
                                                        <i class="fa-regular me-3 fa-user"></i>
                                                    </span>
                                                    <h4 className="mb-0">
                                                        Rishabh Maurya <span className=''>(Rishu ) </span>
                                                    </h4>
                                                </div>
                                                <div className="content profileicons mt-1  d-flex align-items-center justify-content-start">
                                                    <span>
                                                        <i class="fa-regular me-3 fa-envelope"></i>
                                                    </span>
                                                    <p className="mb-0">
                                                        {" "}
                                                      rishabhmaurya@gmail.com
                                                    </p>
                                                </div>
                                                </div>

                                             
                                            </div>
                                        </div>
                                        <div className="col-xxl-5 col-xl-5">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="content w-100">

                                                        <div className="mt-2">
                                                            <div
                                                                className=" d-flex align-items-center justify-content-start"
                                                                style={{ height: "25px" }}
                                                            >
                                                                <h4 className=" me-2">Status :</h4>
                                                                <div className='assigned'>
                                                                   
                                                                    <p
                                                                        className="p-0 m-0 px-2 "

                                                                    >
                                                                        Enabled
                                                                    </p>
                                                                    <div> <i class="fa-solid fa-check"></i></div>
                                                                </div>
                                                                {/* <p
                                                                    className="imgwidth d-flex ms-2 me-2"
                                                                    style={{ minWidth: "75px" }}
                                                                >

                                                                    Enable
                                                                </p> */}


                                                           
                                                            </div>
                                                            <div
                                                                className=" d-flex align-items-center justify-content-start"
                                                                style={{ height: "25px" }}
                                                            >
                                                                <h4 className=" me-2">Role Type :</h4>
                                                                <div>
                                                                    <p
                                                                        className="imgwidth d-flex  ms-2 me-2"
                                                                        style={{ minWidth: "75px" }}
                                                                    >


                                                                        Agents
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className=" d-flex align-items-center justify-content-start "
                                                                style={{ height: "25px" }}
                                                            >
                                                                <h4 className=" me-2">TimeZone:</h4>

                                                                <p
                                                                    className=" ms-2 me-2"
                                                                    style={{ minWidth: "75px" }}
                                                                >
                                                                    17 February, 2025
                                                                </p>
                                                            </div>
                                                            {/* <div
                                                                className=" d-flex align-items-center justify-content-between "
                                                                style={{ height: "25px" }}
                                                            >
                                                                <h4 className=" me-2">Extension Assigned : </h4>

                                                                <p
                                                                    className=" ms-2 me-2"
                                                                    style={{ minWidth: "75px" }}
                                                                >
                                                                    ghdfg
                                                                </p>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-xxl-2 col-xl-2">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="content w-100">

                                                        <div className="mt-2">
                                                            <div
                                                                className=""
                                                                style={{ height: "25px" }}
                                                            >
                                                                <h4 className=" me-2">Extension </h4>
                                                                <div className='assigned mt-2'>
                                                                    {/* <div> <i class="fa-solid fa-check"></i></div> */}
                                                                    <p
                                                                        className="p-0 m-0 px-2 "

                                                                    >
                                                                       1001
                                                                    </p>
                                                                </div>

                                                            </div>


                                                            {/* <div
                                                                className=" d-flex align-items-center justify-content-between "
                                                                style={{ height: "25px" }}
                                                            >
                                                                <h4 className=" me-2">Extension Assigned : </h4>

                                                                <p
                                                                    className=" ms-2 me-2"
                                                                    style={{ minWidth: "75px" }}
                                                                >
                                                                    ghdfg
                                                                </p>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row" style={{
                        padding: "20px 10px",

                    }}
                    >
                        <div className="col-xl-3 mb-3 mb-xl-0">
                            <div className="itemWrapper a">
                                <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <div className="col-9">
                                            <h5>Handled Calls</h5>
                                            <p>27 August - 27 September, 2024</p>
                                            <p>

                                            </p>
                                        </div>
                                        <div className="col-3">
                                            <i className="fa-duotone fa-phone-office"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-number2">
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <div className="col-9">
                                            <h5> </h5>
                                            <p>
                                                Inbound /
                                                Outbound
                                            </p>
                                        </div>
                                        <div className="col-3">
                                            {/* <img
                                alt="dashboard"
                                src="assets/images/icons/diagram.png"
                              /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 mb-3 mb-xl-0">
                            <div className="itemWrapper a">
                                <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <div className="col-9">
                                            <h5>Handled Calls</h5>
                                            <p>27 August - 27 September, 2024</p>
                                            <p>

                                            </p>
                                        </div>
                                        <div className="col-3">
                                            <i className="fa-duotone fa-phone-office"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-number2">
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <div className="col-9">
                                            <h5> </h5>
                                            <p>
                                                Inbound /
                                                Outbound
                                            </p>
                                        </div>
                                        <div className="col-3">
                                            {/* <img
                                alt="dashboard"
                                src="assets/images/icons/diagram.png"
                              /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 mb-3 mb-xl-0">
                            <div className="itemWrapper a">
                                <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between" style={{ cursor: 'pointer' }}>
                                        <div className="col-9">
                                            <h5>Extensions</h5>
                                            <p>
                                                Total:
                                                Registered
                                            </p>
                                        </div>
                                        <div className="col-3">
                                            <Tippy content="Click to view extensions">
                                                <i class="fa-duotone fa-phone-office"></i>
                                            </Tippy>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-number2">
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <div className="col-12">
                                            <ul
                                                style={{
                                                    overflowY: "scroll",

                                                    paddingRight: 10,
                                                }}
                                            >

                                                <li

                                                >

                                                    <span
                                                        className=""
                                                    ></span>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 mb-3 mb-xl-0">
                            <div className="itemWrapper a">
                                <div className="heading">
                                    <div className="d-flex flex-wrap justify-content-between" style={{ cursor: 'pointer' }}>
                                        <div className="col-9">
                                            <h5>Extensions</h5>
                                            <p>
                                                Total:
                                                Registered
                                            </p>
                                        </div>
                                        <div className="col-3">
                                            <Tippy content="Click to view extensions">
                                                <i class="fa-duotone fa-phone-office"></i>
                                            </Tippy>
                                        </div>
                                    </div>
                                </div>
                                <div className="data-number2">
                                    <div className="d-flex flex-wrap justify-content-between">
                                        <div className="col-12">
                                            <ul
                                                style={{
                                                    overflowY: "scroll",

                                                    paddingRight: 10,
                                                }}
                                            >

                                                <li     >
                                                    <span
                                                        className=""
                                                    ></span>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
            </section>


        </main>
    )
}

export default UserProfile