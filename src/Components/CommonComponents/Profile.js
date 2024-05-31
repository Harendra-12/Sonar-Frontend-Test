import React from 'react'
import { Link } from 'react-router-dom'

const Profile = () => {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="row px-xl-3 py-2" id="detailsHeader">
                                <div className="col-xl-2 col-4 d-flex align-items-center">
                                    {/* <span className="me-3"><button className="clearButton d-flex align-items-center" onclick="togglePhoneSidenav()"><i className="fa-light fa-bars fs-5"></i></button></span> */}
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
                                        <button
                                            className="getApp"
                                            effect="ripple"
                                        >
                                            Get Our App
                                        </button>
                                    </div>
                                    {/* <div className="profileHolder">
                                        <img
                                            src={require("../../assets/images/profilepic.png")}
                                            alt="img"
                                        />
                                    </div> */}
                                </div>
                                {/* <div className="mt-4" /> */}
                                {/* <div className="col-xl-4 my-auto">
                                    <div className="position-relative searchBox">
                                        <input
                                            type="search"
                                            name="Search"
                                            id="headerSearch"
                                            placeholder="Search"
                                        />
                                    </div>
                                </div> */}
                                {/* <div className="col-xl-8 pt-3 pt-xl-0">
                                    <div className="d-flex justify-content-end">
                                        <button
                                            effect="ripple"
                                            className="panelButton"
                                        >
                                            Back
                                        </button>
                                        <button
                                            effect="ripple"
                                            className="panelButton"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            effect="ripple"
                                            className="panelButton"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className='col-xl-9'>
                            <div className='profileView mt-3'>
                                <div className='profileDetailsHolder'>
                                    <div className='baseDetails row'>
                                        <div className='col-auto my-auto'>
                                            <div className='profilePicHolder'>
                                                <img
                                                    src="https://www.webviotechnologies.com/images/fabicon/apple-icon-120x120.webp"
                                                    alt="img"
                                                />
                                            </div>
                                        </div>
                                        <div className='content col-xl-6 col-8 my-auto pe-0'>
                                            <h5>Webvio Technologies</h5>
                                            <p><span><i className="fa-duotone fa-globe"></i></span> www.webviotechnologies.com</p>
                                            <p><span><i className="fa-duotone fa-location-dot"></i></span> Unit No 302, 3rd Floor, Ecospace Business Park Block-4A</p>
                                        </div>
                                        <div className='content ms-xl-auto col-xl-auto my-xl-auto mt-2'>
                                            {/* <p><a target="_blank" href='#'><span><i className="fa-brands fa-square-x-twitter" style={{ color: '#000' }}></i></span> X <span style={{ fontSize: '11px' }}>(Twitter)</span></a></p>
                                            <p><a target='_black' href="#"><span><i className="fa-brands fa-linkedin" style={{ color: '#0077B5' }}></i></span> LinkedIn</a></p>
                                            <p><a target='_black' href="#"><span><i className="fa-brands fa-square-facebook" style={{ color: '#4267B2' }}></i></span> Facebook</a></p>
                                            <p><a target='_black' href="#"><span><i className="fa-brands fa-instagram" style={{ color: '#E1306C' }}></i></span> Instagram</a></p> */}
                                            <div className='d-flex justify-content-between gap-2'>
                                                <div>
                                                    <p className='fw-light'>Country:</p>
                                                    <p className='fw-light'>Language:</p>
                                                    <p className='fw-light'>TimeZone:</p>
                                                </div>
                                                <div className='text-end'>
                                                    <p><img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png" width={20}  alt="img"/>&nbsp;&nbsp;+91 (IN)</p>
                                                    <p><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/255px-Flag_of_the_United_Kingdom_%281-2%29.svg.png" width={20} height={12}  alt="img"/>&nbsp;&nbsp;English</p>
                                                    <p>+5:30 GMT</p>
                                                </div>
                                            </div>
                                            {/* <p><span className='me-2'>Country:</span> <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png" width={20} />&nbsp;&nbsp;+91 (IN)</p>
                                            <p><span className='me-2'>Language:</span> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/255px-Flag_of_the_United_Kingdom_%281-2%29.svg.png" width={20} height={12} />&nbsp;&nbsp;English</p>
                                            <p><span className='me-2'>TimeZone:</span> +5:30 GMT</p> */}
                                        </div>
                                        <div className='summaryDetails'>
                                            <div className='content ms-0'>
                                                <h5>Summary</h5>
                                                <p>We are the leading expertise in rendering the best of the BPO services and also aid you in creating the innovative and the unique service, to alleviate the net rate of the productivity of your firm. Get all-encompassing digital services at the most affordable rates to ensure a steady business growth and high ROI. We have invested long hours and brilliant minds to amp up our digital marketing service game. We have ensured that our understanding of market and trends are infallible with thorough studies, assessments and hands-on experience.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='profileView mt-2'>
                                <div className='profileDetailsHolder'>
                                    <div className='header'>Account Details</div>
                                    <div className='row' style={{ padding: 5 }}>
                                        <div className="formRow col-xl-4">
                                            <div className="formLabel">
                                                <label htmlFor="data">Profile Name</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value={'WebvioTechnologies'}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-4">
                                            <div className="formLabel">
                                                <label htmlFor="data">Email</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value={'info@webviotechnologies.com'}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-4">
                                            <div className="formLabel">
                                                <label htmlFor="data">Password</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value={'webvio@password'}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-4">
                                            <div className="formLabel">
                                                <label htmlFor="data">Country Code</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value={'+91 (IN)'}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-4">
                                            <div className="formLabel">
                                                <label htmlFor="data">Phone Number</label>
                                            </div>
                                            <div className="col-12">
                                                <input
                                                    type="text"
                                                    className="formItem"
                                                    value={'(+91) 999-999-9999'}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="formRow col-xl-4">
                                            <div className="formLabel">
                                                <label htmlFor="data">Two Factor Authentication</label>
                                            </div>
                                            <div className="col-12">
                                                <select className="formItem" name="" id="selectFormRow" disabled defaultValue={1}>
                                                    <option value={1}>
                                                        Enabled
                                                    </option>
                                                    <option value={2}>Disabled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-3'>
                            <div className='profileView mt-3' style={{ height: '100%' }}>
                                <div className='profileDetailsHolder' style={{ position: 'sticky', top: 0 }}>
                                    <div className='qLinkContent'>
                                        <h5>Quick Links</h5>
                                        <p>Store</p>
                                        <ul>
                                            <li><Link>Buy Extensions</Link></li>
                                            <li><Link>Increase Users</Link></li>
                                            <li><Link>Explore Modules</Link></li>
                                        </ul>
                                        <p>How to UcaaS</p>
                                        <ul>
                                            <li><Link>Setup Guide</Link></li>
                                            <li><Link>Documentation</Link></li>
                                        </ul>
                                        <p>Connect With us</p>
                                        <ul>
                                            <li><Link>Know about us!</Link></li>
                                            <li><Link>Connect with us!</Link></li>
                                        </ul>
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

export default Profile