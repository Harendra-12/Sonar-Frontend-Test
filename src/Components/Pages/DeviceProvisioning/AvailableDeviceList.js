import React, { useState } from 'react'
import CircularLoader from '../../Loader/CircularLoader'
import Header from '../../CommonComponents/Header'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function AvailableDeviceList() {
    const navigate = useNavigate();
    const [selectDeviceEdit, setSelectDeviceEdit] = useState();
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    {/* {loading ? (
                        <div colSpan={99}>
                            <CircularLoader />
                        </div>
                    ) : (
                        ""
                    )} */}
                    <div className="container-fluid px-0">
                        <Header title="Device Provisioning" />
                    </div>
                    <div className='col-xl-12'>
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>List of Devices</h4>
                                                <p>Here is a list of available devices</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    onClick={() => {
                                                        navigate(-1);
                                                        backToTop();
                                                    }}
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                >
                                                    <span className="text">Back</span>
                                                    <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                                                </button>
                                                <button
                                                    effect="ripple"
                                                    className="panelButton"
                                                >
                                                    <span className="text" >Add</span>
                                                    <span className="icon"><i class="fa-solid fa-plus"></i></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                                    <div className='row gx-5'>
                                        <div className='col-xl-6' style={{ borderRight: '1px solid var(--border-color)' }}>
                                            <div className='deviceProvision row align-items-center active'>
                                                <div className="formRow col-xl-6">
                                                    <div className="col-4">
                                                        <img src={require('../../assets/images/cisco.jpg')}></img>
                                                    </div>
                                                    <div className="formLabel ">
                                                        <label htmlFor=""><h5>Cisco Long Schlong</h5></label>
                                                        <label><p>Brand: Cisco</p></label>
                                                        <br />
                                                        <label>
                                                            <b style={{ fontSize: 12, color: "var(--formLabel)" }}>Available in account: 0</b>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className='col-xl-6'>
                                                    <div className='d-flex justify-content-end'>
                                                        <div class="my-auto position-relative mx-1">
                                                            <label class="switch">
                                                                <input type="checkbox" id="showAllCheck" checked={true} />
                                                                <span class="slider round" />
                                                            </label>
                                                        </div>
                                                        <button className="tableButton edit mx-2" onClick={() => setSelectDeviceEdit(true)}><i className="fa-solid fa-pencil"></i></button>
                                                        <button className="tableButton delete"><i className="fa-solid fa-trash"></i></button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='deviceProvision row align-items-center'>
                                                <div className="formRow col-xl-6">
                                                    <div className="col-4">
                                                        <img src={require('../../assets/images/cisco.jpg')}></img>
                                                    </div>
                                                    <div className="formLabel ">
                                                        <label htmlFor=""><h5>Cisco Long Schlong</h5></label>
                                                        <label><p>Brand: Cisco</p></label>
                                                        <br />
                                                        <label>
                                                            <b style={{ fontSize: 12, color: "var(--formLabel)" }}>Available in account: 0</b>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className='col-xl-6'>
                                                    <div className='d-flex justify-content-end'>
                                                        <div class="my-auto position-relative mx-1">
                                                            <label class="switch">
                                                                <input type="checkbox" id="showAllCheck" />
                                                                <span class="slider round" />
                                                            </label>
                                                        </div>
                                                        <button className="tableButton edit mx-2" onClick={() => setSelectDeviceEdit(true)}><i className="fa-solid fa-pencil"></i></button>
                                                        <button className="tableButton delete"><i className="fa-solid fa-trash"></i></button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='deviceProvision row align-items-center'>
                                                <div className="formRow col-xl-6">
                                                    <div className="col-4">
                                                        <img src={require('../../assets/images/cisco.jpg')}></img>
                                                    </div>
                                                    <div className="formLabel ">
                                                        <label htmlFor=""><h5>Cisco Long Schlong</h5></label>
                                                        <label><p>Brand: Cisco</p></label>
                                                        <br />
                                                        <label>
                                                            <b style={{ fontSize: 12, color: "var(--formLabel)" }}>Available in account: 0</b>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className='col-xl-6'>
                                                    <div className='d-flex justify-content-end'>
                                                        <div class="my-auto position-relative mx-1">
                                                            <label class="switch">
                                                                <input type="checkbox" id="showAllCheck" />
                                                                <span class="slider round" />
                                                            </label>
                                                        </div>
                                                        <button className="tableButton edit mx-2" onClick={() => setSelectDeviceEdit(true)}><i className="fa-solid fa-pencil"></i></button>
                                                        <button className="tableButton delete"><i className="fa-solid fa-trash"></i></button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {selectDeviceEdit && <div className='col-xl-6'>
                                            <form>
                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Device Name</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Please enter a name for this devices
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            className="formItem"
                                                        />
                                                        {/* {errors.address && (
                                                            <ErrorMessage text={errors.address.message} />
                                                        )} */}
                                                    </div>
                                                </div>
                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Select UUID Type</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Please enter a name for this devices
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <select className="formItem">
                                                            <option disabled={true}>UUID Type</option>
                                                            <option selected={true}>MAC Address</option>
                                                            <option>Serial Number</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Enter MAC Address</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Please enter the MAC address of the selected device
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            className="formItem"
                                                        />
                                                        {/* {errors.address && (
                                                            <ErrorMessage text={errors.address.message} />
                                                        )} */}
                                                    </div>
                                                </div>
                                                <div className="formRow">
                                                    <button className="panelButton ms-auto" onClick={() => setSelectDeviceEdit(false)}>
                                                        <span className="text" >Save</span>
                                                        <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>}
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

export default AvailableDeviceList