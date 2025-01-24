import React, { useEffect, useState } from 'react'
import { backToTop, generalPostFunction } from '../../GlobalFunction/globalFunction';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../CommonComponents/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ErrorMessage from '../../CommonComponents/ErrorMessage';
import { lengthValidator, numberValidator, requiredValidator, restrictToMacAddress, restrictToNumbers } from '../../validations/validation';
import CircularLoader from '../../Loader/CircularLoader';

function DeviceProvisioningNew() {
    const [isDeviceChosen, setIsDeviceChosen] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()

    const deviceProvisioningRefresh = useSelector(
        (state) => state.deviceProvisioningRefresh
    );
    const extensionData = location.state;

    const [loading, setLoading] = useState(true);
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        reset,
        setValue,
    } = useForm();

    const handleFormSubmit = handleSubmit(async (data) => {
        setLoading(true);
        data.address = extensionData.id;
        const apiData = await generalPostFunction("/provision/store", data);
        if (apiData.status) {
            setLoading(false);
            toast.success(apiData.message);
            // // after succesfully adding data need to recall the global function to update the global state
            dispatch({
                type: "SET_DEVICE_PROVISIONINGREFRESH",
                deviceProvisioningRefresh: deviceProvisioningRefresh + 1,
            });
            reset();
            navigate(-1);
        } else {
            setLoading(false);
        }
    });

    useEffect(() => {
        setValue("address", extensionData.id);
        setLoading(false);
    }, [extensionData]);
    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    {loading ? (
                        <div colSpan={99}>
                            <CircularLoader />
                        </div>
                    ) : (
                        ""
                    )}
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
                                                    onClick={handleFormSubmit}
                                                >
                                                    <span className="text" >Save</span>
                                                    <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                                    <div className='row gx-5'>
                                        <div className='col-xl-6' style={{ borderRight: '1px solid var(--border-color)' }}>
                                            <div className="tangoNavs mb-0">
                                                <nav>
                                                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                                        <button class="nav-link active" id="nav-desk-tab" data-bs-toggle="tab" data-bs-target="#nav-desk" type="button" role="tab" aria-controls="nav-desk" aria-selected="true">Desktop Phones</button>
                                                        <button class="nav-link" id="nav-soft-tab" data-bs-toggle="tab" data-bs-target="#nav-soft" type="button" role="tab" aria-controls="nav-soft" aria-selected="false">Soft Phone</button>
                                                    </div>
                                                </nav>
                                                <div class="tab-content" id="nav-tabContent">
                                                    <div class="tab-pane fade show active" id="nav-desk" role="tabpanel" aria-labelledby="nav-desk-tab" tabindex="0">
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
                                                                                    <button onClick={() => setIsDeviceChosen(null)}><i class="fa-light fa-minus"></i></button>
                                                                                    <div className='number'>0</div>
                                                                                    <button onClick={() => setIsDeviceChosen("hard")}><i class="fa-light fa-plus"></i></button>
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
                                                    <div class="tab-pane fade" id="nav-soft" role="tabpanel" aria-labelledby="nav-soft-tab" tabindex="0">
                                                        <div className="row col-12 mx-auto mb-0">
                                                            <div className="formRow col-xl-6 deviceProvision">
                                                                <div className="col-4">
                                                                    <img src={require('../../assets/images/eyebeam.png')}></img>
                                                                </div>
                                                                <div className="formLabel ">
                                                                    <label htmlFor=""><h5>EyeBeam</h5></label>
                                                                    <br />
                                                                    <label><p>Brand: EyeBeam</p></label>
                                                                    <br />
                                                                    <label>
                                                                        <b style={{ fontSize: 12, color: "var(--formLabel)" }}>Available in account: 0</b>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="formRow col-xl-6 deviceProvision">
                                                                <div className="col-4">
                                                                    <img src={require('../../assets/images/webrtc.png')}></img>
                                                                </div>
                                                                <div className="formLabel ">
                                                                    <label htmlFor=""><h5>WebRTC</h5></label>
                                                                    <br />
                                                                    <label><p>Brand: UcaaS</p></label>
                                                                    <br />
                                                                    <label>
                                                                        <b style={{ fontSize: 12, color: "var(--formLabel)" }}>Available in account: 0</b>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className='col-xl-12'>
                                                                <div className='deviceProvisionDetails' data-id="1">
                                                                    <div className='title'>
                                                                        EyeBeam
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
                                                                                    <button onClick={() => setIsDeviceChosen(null)}><i class="fa-light fa-minus"></i></button>
                                                                                    <div className='number'>0</div>
                                                                                    <button onClick={() => setIsDeviceChosen("soft")}><i class="fa-light fa-plus"></i></button>
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
                                            </div>
                                        </div>

                                        {isDeviceChosen === "hard" ? <div className='col-xl-6'>
                                            <form>
                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Address</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Select a address
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            value={extensionData.extension}
                                                            disabled
                                                            type="text"
                                                            name="address"
                                                            className="formItem"
                                                        />
                                                        {errors.address && (
                                                            <ErrorMessage text={errors.address.message} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Transport</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Select a transport
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <select
                                                            value={watch().transport}
                                                            className="formItem"
                                                            name="transport "
                                                            id="selectFormRow"
                                                            {...register("transport", {
                                                                ...requiredValidator,
                                                            })}
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
                                                        {errors.transport && (
                                                            <ErrorMessage text={errors.transport.message} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="formRow">
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
                                                            {...register("port", {
                                                                ...requiredValidator,
                                                                ...numberValidator,
                                                                ...lengthValidator(3, 4),
                                                            })}
                                                            onKeyDown={restrictToNumbers}
                                                        />
                                                        {errors.port && <ErrorMessage text={errors.port.message} />}
                                                    </div>
                                                </div>

                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Serial Number</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Enter serial number
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            type="text"
                                                            name="serial_number"
                                                            className="formItem"
                                                            placeholder="124abc"
                                                            {...register("serial_number", {
                                                                ...requiredValidator,
                                                            })}
                                                            onKeyDown={restrictToMacAddress}
                                                        />
                                                        {errors.serial_number && (
                                                            <ErrorMessage text={errors.serial_number.message} />
                                                        )}
                                                    </div>
                                                </div>
                                            </form>
                                        </div> : isDeviceChosen === "soft" ?
                                            <div className='col-xl-6'>
                                                <form>
                                                    <div className="formRow">
                                                        <div className="formLabel">
                                                            <label className="text-dark">User</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Please enter user
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <input
                                                                disabled
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
                                                            <label className="text-dark">Extension</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Select an Extension
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <select
                                                                className="formItem"
                                                                name="transport "
                                                                id="selectFormRow"
                                                            >
                                                                <option disabled value="">
                                                                    Chose an Extension
                                                                </option>
                                                                <option selected value="1000">
                                                                    1000
                                                                </option>
                                                                <option value="1001">1001</option>
                                                                <option value="1002">1002</option>
                                                                <option value="1003">1003</option>
                                                            </select>
                                                            {/* {errors.transport && (
                                                            <ErrorMessage text={errors.transport.message} />
                                                        )} */}
                                                        </div>
                                                    </div>

                                                    <div className="formRow">
                                                        <div className="formLabel">
                                                            <label className="text-dark">Password</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Enter password
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
                                                            />
                                                            {/* {errors.port && <ErrorMessage text={errors.port.message} />} */}
                                                        </div>
                                                    </div>

                                                    <div className="formRow">
                                                        <div className="formLabel">
                                                            <label className="text-dark">Domain</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Enter your domain ip
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <input
                                                                type="text"
                                                                name="serial_number"
                                                                className="formItem"
                                                                placeholder="124abc"
                                                            />
                                                            {/* {errors.serial_number && (
                                                                <ErrorMessage text={errors.serial_number.message} />
                                                            )} */}
                                                        </div>
                                                    </div>

                                                    <div className="formRow">
                                                        <div className="formLabel">
                                                            <label className="text-dark">SIP Server</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Enter your sip server
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <input
                                                                type="text"
                                                                name="serial_number"
                                                                className="formItem"
                                                                placeholder="124abc"
                                                            />
                                                            {/* {errors.serial_number && (
                                                                <ErrorMessage text={errors.serial_number.message} />
                                                            )} */}
                                                        </div>
                                                    </div>
                                                    <div className="formRow">
                                                        <div className="formLabel">
                                                            <label className="text-dark">SIP Proxy</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Enter your sip proxy
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <input
                                                                type="text"
                                                                name="serial_number"
                                                                className="formItem"
                                                                placeholder="124abc"
                                                            />
                                                            {/* {errors.serial_number && (
                                                                <ErrorMessage text={errors.serial_number.message} />
                                                            )} */}
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            : ""}
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