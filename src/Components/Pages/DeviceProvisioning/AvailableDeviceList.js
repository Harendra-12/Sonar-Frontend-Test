import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { backToTop, generalDeleteFunction, generalGetFunction, generalPutFunction } from '../../GlobalFunction/globalFunction';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CircularLoader from '../../Loader/CircularLoader';
import ContentLoader from '../../Loader/ContentLoader';
import SkeletonFormLoader from '../../Loader/SkeletonFormLoader';

function AvailableDeviceList() {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.state.id
    const extension = location.state.extension
    const [allDevices, setAllDevices] = useState([]);
    const [provesionDevice, setProvesionDevice] = useState([]);
    const [selectDeviceEdit, setSelectDeviceEdit] = useState();
    const [selectedDdeviceIs, setSelectedDdeviceIs] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedModel, setSelectedModel] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0)
    const [popup, setPopu] = useState(false);
    const [deleteId, setDeleteId] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        async function getData() {
            try {
                const [allDeviceData, provesionDeviceData] = await Promise.all([
                    generalGetFunction('/available-devices'),
                    generalGetFunction(`/provision/all`)
                ])
                if (allDeviceData.status) {
                    setAllDevices(allDeviceData.data);
                }
                if (provesionDeviceData.status) {
                    setProvesionDevice(provesionDeviceData.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }
        getData();
    }, [refresh]);

    async function updateDevice() {
        if (selectedModel === "") {
            toast.error("Please select a model")
            return
        }
        if (serialNumber === "") {
            toast.error("Please enter a serial number")
            return
        }
        const parsedData = {
            model_id: selectedModel,
            serial_number: serialNumber,
            brand_id: selectedBrand,
            status: status
        }
        setLoading(true)
        const apiData = await generalPutFunction(`/provision/update/${selectedDdeviceIs}`, parsedData);
        if (apiData.status) {
            toast.success(apiData.message)
            setRefresh(refresh + 1)
            setLoading(false)
            setPopu(false)
        } else {
            setLoading(false)
            setPopu(false)
        }
    }
    async function deleteDevice() {
        setLoading(true)
        const apiData = await generalDeleteFunction(`/provision/destroy/${deleteId}`);
        if (apiData.status) {
            toast.success(apiData.message)
            setRefresh(refresh + 1)
            setLoading(false)
            setDeleteId('')
            setPopu(false)
        } else {
            setLoading(false)
            setPopu(false)
        }
    }
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
                                                    onClick={() => {
                                                        navigate('/device-provisioning-new', {
                                                            state: {
                                                                id: id,
                                                                extension: extension,
                                                            },
                                                        });
                                                        backToTop();
                                                    }}
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
                                            {
                                                provesionDevice.length > 0 ? (
                                                    provesionDevice.map((item, index) => {
                                                        return (
                                                            <div className={`deviceProvision row align-items-center ${selectedDdeviceIs === item.id ? 'active' : ""} `} key={index} onClick={() => { setSelectedDdeviceIs(item.id); setSelectedBrand(item.brand_id); setSelectedModel(item.model_id); setSerialNumber(item.serial_number); setStatus(item.status) }}>
                                                                <div className="formRow col-xl-6">
                                                                    <div className="col-4">
                                                                        <img src={require('../../assets/images/cisco.jpg')} alt=""></img>
                                                                    </div>
                                                                    <div className="formLabel ">
                                                                        <label htmlFor=""><h5>{allDevices.filter((device) => device.id === item.brand_id)[0]?.name}</h5></label>
                                                                        <p>Brand: {allDevices.filter((device) => device.id === item.brand_id)[0]?.name}</p>
                                                                        <br />
                                                                        <label>
                                                                            {/* <b style={{ fontSize: 12, color: "var(--formLabel)" }}>Available in account: 0</b> */}
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className='col-xl-6'>
                                                                    <div className='d-flex justify-content-end'>
                                                                        <div class="my-auto position-relative mx-1">
                                                                            <label class="switch">
                                                                                <input type="checkbox" id="showAllCheck" checked={item.status === "active" ? true : false} onChange={() => {
                                                                                    setStatus(item.status === "active" ? "inactive" : "active"); setDeleteId(""); setPopu(true)
                                                                                }} />
                                                                                <span class="slider round" />
                                                                            </label>
                                                                        </div>
                                                                        <button className="tableButton edit mx-2" onClick={() => setSelectDeviceEdit(true)}><i className="fa-solid fa-pencil"></i></button>
                                                                        <button className="tableButton delete" onClick={() => { setDeleteId(item.id); setPopu(true); setStatus("") }}><i className="fa-solid fa-trash"></i></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                ) : "You do not configure any device yet"
                                            }

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
                                                            value={allDevices.filter((device) => device.id === selectedBrand)[0]?.name}
                                                            disabled
                                                        />
                                                        {/* {errors.address && (
                                                            <ErrorMessage text={errors.address.message} />
                                                        )} */}
                                                    </div>
                                                </div>
                                                <div className="formRow">
                                                    <div className="formLabel">
                                                        <label className="text-dark">Select Model</label>
                                                        <label htmlFor="data" className="formItemDesc">
                                                            Please select the model for this devices
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <select className="formItem" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                                                            {
                                                                allDevices.filter((device) => device.id === selectedBrand)[0].models?.map((item, index) => {
                                                                    return (
                                                                        <option value={item.id} key={index}>{item.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
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
                                                            name="address"
                                                            className="formItem"
                                                            value={serialNumber}
                                                            onChange={(e) => setSerialNumber(e.target.value)}
                                                        />
                                                        {/* {errors.address && (
                                                            <ErrorMessage text={errors.address.message} />
                                                        )} */}
                                                    </div>
                                                </div>
                                                <div className="formRow">
                                                    <button className="panelButton ms-auto" onClick={() => updateDevice()} type='button'>
                                                        <span className="text" >Update</span>
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
                {popup ? (
                    <div className="popup">
                        <div className="container h-100">
                            <div className="row h-100 justify-content-center align-items-center">
                                <div className="row content col-xl-4 col-md-5">
                                    <div className="col-2 px-0">
                                        <div className="iconWrapper">
                                            <i className="fa-duotone fa-triangle-exclamation"></i>
                                        </div>
                                    </div>
                                    <div className="col-10 ps-0">
                                        <h4>Warning!</h4>
                                        <p>
                                            {deleteId
                                                ? "Are you sure you want to delete this Device?"
                                                : "Are you sure you want to change its status?"}
                                        </p>
                                        <div className="d-flex justify-content-between">
                                            <button
                                                disabled={loading}
                                                className="panelButton m-0"
                                                onClick={() => {
                                                    if (deleteId) {
                                                        deleteDevice();
                                                    } else {
                                                        updateDevice()
                                                    }
                                                }}
                                            >
                                                <span className="text">
                                                    Confirm
                                                </span>
                                                <span className="icon">
                                                    <i class="fa-solid fa-check"></i>
                                                </span>
                                            </button>
                                            <button
                                                className="panelButton gray m-0 float-end"
                                                onClick={() => {
                                                    setPopu(false);
                                                    setDeleteId("");
                                                    setStatus("")
                                                }}
                                            >
                                                <span className="text">Cancel</span>
                                                <span className="icon">
                                                    <i class="fa-solid fa-xmark"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    " "
                )}

            </main>
            {loading ? (
                <div colSpan={99}>
                    <CircularLoader />
                </div>
            ) : (
                ""
            )}
        </>
    )
}

export default AvailableDeviceList