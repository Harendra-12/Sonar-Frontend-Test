/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { backToTop, featureUnderdevelopment, generalGetFunction, generalPostFunction } from '../../GlobalFunction/globalFunction';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../CommonComponents/Header';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ErrorMessage from '../../CommonComponents/ErrorMessage';
import { requiredValidator } from '../../validations/validation';
import CircularLoader from '../../Loader/CircularLoader';

function DeviceProvisioningNew() {
    const [isDeviceChosen, setIsDeviceChosen] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const [modelId, setModelId] = useState('')
    const [brandId, setBrandId] = useState('')
    const [allDevices, setAllDevices] = useState([])
    const deviceProvisioningRefresh = useSelector(
        (state) => state.deviceProvisioningRefresh
    );
    const extensionId = location.state.id;
    const extension = location.state.extension

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
        data.address = extensionId;
        data.brand_id = brandId;
        data.model_id = modelId;
        const apiData = await generalPostFunction("/provision/store", data);
        if (apiData.status) {
            setLoading(false);
            toast.success(apiData.message);
            reset();
            navigate(-1);
        } else {
            setLoading(false);
        }
    });

    useEffect(() => {
        setValue("address", extensionId);
        async function getData() {
            const apiData = await generalGetFunction("/available-devices")
            if (apiData.status) {
                setAllDevices(apiData.data)
                setLoading(false)
            } else {
                toast.error(apiData.error)
                setLoading(false)
            }
        }
        getData()
    }, [extensionId]);

    function handelModelSelect(id) {
        if (modelId === "" || brandId !== id) {
            toast.error("Please select a model")
        } else {
            setBrandId(id)
            setIsDeviceChosen(true)
        }
    }
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
                                <div className="col-12" style={{ padding: '25px 23px' }}>
                                    <div className='row gx-5'>
                                        <div className='col-xl-6 pe-0' style={{ borderRight: '1px solid var(--border-color)' }}>
                                            <div className="tangoNavs mb-0">
                                                <nav>
                                                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                                        <button class="nav-link active" id="nav-desk-tab" data-bs-toggle="tab" data-bs-target="#nav-desk" type="button" role="tab" aria-controls="nav-desk" aria-selected="true">Desktop Phones</button>
                                                        <button onClick={featureUnderdevelopment} class="nav-link" type="button" role="tab" aria-controls="nav-soft" aria-selected="false">Soft Phone</button>
                                                    </div>
                                                </nav>
                                                <div class="tab-content" id="nav-tabContent">
                                                    <div class="tab-pane fade show active" id="nav-desk" role="tabpanel" aria-labelledby="nav-desk-tab" tabindex="0">
                                                        <div className="row col-12 mx-auto mb-0">
                                                            {
                                                                allDevices.map((device, index) => {
                                                                    return (
                                                                        <div className="formRow col-xl-6 deviceProvision flex-nowrap" key={index}>
                                                                            <div className="col-4">
                                                                                <img src={require('../../assets/images/cisco.jpg')} alt=""></img>
                                                                            </div>
                                                                            <div className='col-8'>
                                                                                <div className="formLabel ">
                                                                                    <label htmlFor=""><h5>{device.slug}</h5></label>
                                                                                    {/* <p>Brand: {device.slug}</p> */}
                                                                                    <div className='col-12'>
                                                                                        <label className=''>
                                                                                            Select Model:
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className='row mt-2 align-items-center'>
                                                                                        <div className="col pe-0">
                                                                                            <select
                                                                                                className="formItem" defaultValue={""} onChange={(e) => { setModelId(e.target.value); setBrandId(device.id) }}>
                                                                                                <option value="" disabled>
                                                                                                    Device
                                                                                                </option>
                                                                                                {
                                                                                                    device.models.map((model, index) => {
                                                                                                        return (
                                                                                                            <option key={index} value={model.id}>{model.name}</option>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </select>
                                                                                        </div>
                                                                                        <div className="col-auto" onClick={() => { handelModelSelect(device.id); backToTop() }}>
                                                                                            <button className='tableButton'>
                                                                                                <i class="fa-solid fa-plus"></i>
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {/* <div className='col-xl-12'>
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
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                    <div class="tab-pane fade" id="nav-soft" role="tabpanel" aria-labelledby="nav-soft-tab" tabindex="0">
                                                        <div className="row col-12 mx-auto mb-0">
                                                            <div className="formRow col-xl-6 deviceProvision">
                                                                <div className="col-4">
                                                                    <img src={require('../../assets/images/eyebeam.png')} alt=""></img>
                                                                </div>
                                                                <div className="formLabel ">
                                                                    <label htmlFor=""><h5>EyeBeam</h5></label>
                                                                    <br />
                                                                    <label><p>Brand: EyeBeam</p></label>
                                                                    <div className='row align-items-center mt-2'>
                                                                        <div className="col pe-0">
                                                                            <select
                                                                                className="formItem">
                                                                                <option value="" disabled>
                                                                                    Device
                                                                                </option>
                                                                                <option>Premium </option>
                                                                                <option>Double</option>
                                                                                <option>Signal</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            <button className='tableButton'>
                                                                                <i class="fa-solid fa-plus"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="formRow col-xl-6 deviceProvision">
                                                                <div className="col-4">
                                                                    <img src={require('../../assets/images/webrtc.png')} alt=""></img>
                                                                </div>
                                                                <div className="formLabel ">
                                                                    <label htmlFor=""><h5>WebRTC</h5></label>
                                                                    <br />
                                                                    <label><p>Brand: UcaaS</p></label>
                                                                    <div className='row align-items-center mt-2'>
                                                                        <div className="col pe-0">
                                                                            <select
                                                                                className="formItem">
                                                                                <option value="" disabled>
                                                                                    Device
                                                                                </option>
                                                                                <option>Premium </option>
                                                                                <option>Double</option>
                                                                                <option>Signal</option>
                                                                                <option>None</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="col-auto">
                                                                            <button className='tableButton'>
                                                                                <i class="fa-solid fa-plus"></i>
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

                                        {isDeviceChosen ? <div className='col-xl-6'>
                                            <form>
                                                {/* <div className="formRow">
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
                                                </div> */}

                                                {/* <div className="formRow">
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
                                                </div> */}


                                            </form>

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
                                                            value={allDevices.filter((device) => device.id === brandId)[0].slug}
                                                            disabled
                                                        />
                                                        {/* {errors.address && (
                                                            <ErrorMessage text={errors.address.message} />
                                                        )} */}
                                                    </div>
                                                </div>
                                                {/* <div className="formRow">
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
                                                </div> */}
                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Enter Serial Number</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Please enter the Serial Number of the selected device
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <input
                                                            type="text"
                                                            {...register("serial_number", {
                                                                ...requiredValidator,
                                                            })}
                                                            name="serial_number"
                                                            className="formItem"
                                                        />
                                                    </div>
                                                    {errors.serial_number && (
                                                        <ErrorMessage text={errors.serial_number.message} />
                                                    )}
                                                </div>
                                                <div className="formRow">
                                                    <button className="panelButton ms-auto" type="button" onClick={handleFormSubmit}>
                                                        <span className="text" >Save</span>
                                                        <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                                    </button>
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
                                                                name=""
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
                                                                name="serial_numbers"
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
                                                                name="serial_numbers"
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