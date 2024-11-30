import React from 'react'
import { backToTop } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import Header from '../../CommonComponents/Header';

function DeviceProvisioningNew() {
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
                                    <form action="#" className="tangoNavs mb-0 col-6">
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
                                                            <label><p>Price: $100</p></label>
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
                                                            <label><p>Price: $100</p></label>
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
                                                                <div className='clearColorButton' style={{ width: 'max-content' }}>Download Datasheet <i class="fa-solid fa-download"></i></div>
                                                            </div>
                                                            <div className='content' style={{ borderTop: '1px solid var(--border-color)' }}>
                                                                <div className='row'>
                                                                    <div className='col-7'>
                                                                        <div className="content">
                                                                            <h5 className='mb-0'>Select from your Account</h5>
                                                                            <p className='mb-0'>Available in your account: 0</p>
                                                                        </div>

                                                                    </div>
                                                                    <div className='col-5'>
                                                                        <div className="add-btns">
                                                                            <button className="change-btn-colors" >
                                                                                -
                                                                            </button>
                                                                            <div className="count-number" >
                                                                                0
                                                                            </div>
                                                                            <button className="change-btn-colors" >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='row'>
                                                                    <div className='col-7'>
                                                                    <div className="content">                                                                            
                                                                            <p className='mb-0'>Additional Purchase</p>
                                                                            <p className='purchase mb-0'>$256</p>
                                                                        </div>                                                                       
                                                                    </div>
                                                                    <div className='col-5'>
                                                                        <div className="add-btns">
                                                                            <button className="change-btn-colors" >
                                                                                -
                                                                            </button>
                                                                            <div className="count-number" >
                                                                                0
                                                                            </div>
                                                                            <button className="change-btn-colors" >
                                                                                +
                                                                            </button>
                                                                       </div>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
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