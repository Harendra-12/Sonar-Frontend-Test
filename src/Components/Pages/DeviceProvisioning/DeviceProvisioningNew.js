import React, { useState } from 'react'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import Header from '../../CommonComponents/Header';

function DeviceProvisioningNew() {
    const [isDeviceChosen, setIsDeviceChosen] = useState(false)
    const navigate = useNavigate();
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
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
                                                <h4>Select Device</h4>
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
                                                    <span className="text">Save</span>
                                                    <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                                    <div className='row gx-5'>
                                        <div className='col-xl-6' style={{ borderRight: '1px solid var(--border-color)' }}>
                                            <form className="tangoNavs mb-0">
                                                <nav>
                                                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                                        <button class="nav-link active" id="nav-desk-tab" data-bs-toggle="tab" data-bs-target="#nav-desk" type="button" role="tab" aria-controls="nav-desk" aria-selected="true">Desktop Phones</button>
                                                        <button class="nav-link" id="nav-soft-tab" data-bs-toggle="tab" data-bs-target="#nav-soft" type="button" role="tab" aria-controls="nav-soft" aria-selected="false">Soft Phone</button>
                                                    </div>
                                                </nav>
                                                <div class="tab-content" id="nav-tabContent">
                                                    <div class="tab-pane fade show active" id="nav-gen" role="tabpanel" aria-labelledby="nav-gen-tab" tabindex="0">
                                                        <div className="row col-12 mx-auto mb-0">
                                                            <div className="formRow col-xl-6 deviceProvision">
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
                                                            <div className="formRow col-xl-6 deviceProvision">
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
                                                            <div className='col-xl-12'>
                                                                <div className='deviceProvisionDetails' data-id="1">
                                                                    <div className='title'>
                                                                        Cisco Long Schlong
                                                                    </div>
                                                                    <div className='content'>
                                                                        <p>Esse dolore in consequat laborum ea aliquip occaecat esse. Enim in tempor ut irure aute. Duis labore nisi pariatur laboris est.</p>
                                                                        <ul>
                                                                            <li>Nisi sit sint minim culpa labore magna occaecat adipisicing excepteur non. Esse consectetur proident ex adipisicing sit Lorem veniam esse ea consectetur.</li>
                                                                            <li>Esse cillum fugiat eiusmod tempor do incididunt commodo magna aute ut irure.</li>
                                                                            <li>Magna amet aliquip anim consequat id sunt reprehenderit.</li>
                                                                            <li>Amet velit ullamco sit magna cillum nostrud labore irure sit. Pariatur sunt eiusmod reprehenderit ex tempor adipisicing ullamco culpa minim reprehenderit dolor.</li>
                                                                            <li>Deserunt anim officia aliquip enim aliqua.</li>
                                                                            <li>Et labore voluptate dolore enim eu aliquip occaecat amet est esse laborum deserunt incididunt eiusmod.</li>
                                                                        </ul>
                                                                        <div className='clearColorButton' style={{ width: 'max-content' }}>Download Datasheet <i class="ms-2 fa-solid fa-download"></i></div>
                                                                    </div>
                                                                    <div className='content' style={{ borderTop: '1px solid var(--border-color)' }}>
                                                                        <div className='row align-items-center'>
                                                                            <div className='col-7'>
                                                                                <div className="content">
                                                                                    <h5 className='mb-1'>Select from your Account</h5>
                                                                                    <p className='mb-0'>Available in your account: 0</p>
                                                                                </div>

                                                                            </div>
                                                                            <div className='col-5'>
                                                                                <div class="addButtonGroup ms-auto">
                                                                                    <button onClick={() => setIsDeviceChosen(false)}><i class="fa-light fa-minus"></i></button>
                                                                                    <div className='number'>0</div>
                                                                                    <button onClick={() => setIsDeviceChosen(true)}><i class="fa-light fa-plus"></i></button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {/* <div className='row'>
                                                                    <div className='col-7'>
                                                                        <div className="content">
                                                                            <p className='mb-0'>Additional Purchase</p>
                                                                            <p className='mb-0' style={{}}>$256</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-5'>
                                                                        <div class="add-btnss">
                                                                            <button class="change-btn-colorss radius-2 radius-4" >-</button>
                                                                            <div class="count-number" id="item-count">0</div>
                                                                            <button class="change-btn-colorss radius-1 radius-3" >+</button>
                                                                        </div>
                                                                    </div>
                                                                </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        {isDeviceChosen && <div className='col-xl-6'>
                                            <form className='row px-2 tangoNavs'>
                                                <nav>
                                                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                                        <button class="nav-link active" id="nav-desk-tab" data-bs-toggle="tab" data-bs-target="#nav-desk" type="button" role="tab" aria-controls="nav-desk" aria-selected="true">Configure Device</button>
                                                    </div>
                                                </nav>
                                                <div className="formRow col-xl-12">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Address</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Select a address
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            type="text"
                                                            className="formItem"
                                                        />

                                                        {/* {errors.address && (
                                                    <ErrorMessage text={errors.address.message} />
                                                )} */}
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-12">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Transport</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Select a transport
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <select
                                                            // value={watch().transport}
                                                            className="formItem"
                                                            name="transport "
                                                            id="selectFormRow"
                                                        // {...register("transport", {
                                                        //     ...requiredValidator,
                                                        // })}
                                                        >
                                                            <option disabled value="">
                                                                Chose a vendor
                                                            </option>
                                                            <option selected value="TCPpreferred">
                                                                TCP Preferred
                                                            </option>
                                                            <option value="UDPOnly">UDP Only</option>
                                                            <option value="TLS">TLS</option>
                                                            <option value="TCPOnly">TCP Only</option>
                                                        </select>
                                                        {/* {errors.transport && (
                                                            <ErrorMessage text={errors.transport.message} />
                                                        )} */}
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-12">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Port</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Select a port
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            type="text"
                                                            name="address"
                                                            className="formItem"
                                                            minLength="3"
                                                            maxLength="4"
                                                            placeholder="5070"
                                                        // {...register("port", {
                                                        //     ...requiredValidator,
                                                        //     ...numberValidator,
                                                        //     ...lengthValidator(3, 4),
                                                        // })}
                                                        // onKeyDown={restrictToNumbers}
                                                        />
                                                        {/* {errors.port && <ErrorMessage text={errors.port.message} />} */}
                                                    </div>
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

export default DeviceProvisioningNew