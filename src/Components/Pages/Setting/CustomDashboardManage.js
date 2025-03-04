import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { backToTop, generalDeleteFunction, generalGetFunction, generalPostFunction, generalPutFunction } from '../../GlobalFunction/globalFunction';
import Header from '../../CommonComponents/Header';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SkeletonFormLoader from '../../Loader/SkeletonFormLoader';

function CustomDashboardManage() {
    const navigate = useNavigate();
    const account = useSelector((state) => state.account);
    const [selectedModule, setSelectedModule] = useState();
    const [addNewMod, setAddNewMod] = useState(true);
    const [ringgroup, setRingGroup] = useState([])
    const [callcenter, setCallCenter] = useState([])
    const [did, setDid] = useState([])
    const [loading, setLoading] = useState(true)
    const [customType, setCustomType] = useState('CallCenterQueue')
    const [customId, setCustomId] = useState('')
    const [customModule, setCustomModule] = useState([])
    const [refresh, setRefresh] = useState(0)
    const [name, setName] = useState('')
    // Checking if the callcenter, ringgroup and did details is already available or not if not available then get it by api calling
    useEffect(() => {
        async function getData() {
            try {
                setLoading(true)
                const [ringGroupData, callcenterData, didData, customModuleData] = await Promise.all([
                    generalGetFunction(`/ringgroup?account=${account?.account_id}`),
                    generalGetFunction(`/call-center-queues/all`),
                    generalGetFunction("/did/all"),
                    generalGetFunction("/usage/all")
                ])

                if (ringGroupData.status) {
                    setRingGroup(ringGroupData.data)
                }
                if (callcenterData.status) {
                    setCallCenter(callcenterData.data)
                }
                if (didData.status) {
                    setDid(didData.data)
                }
                if (customModuleData.status) {
                    setCustomModule(customModuleData.data)
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }
        if (account?.account_id) {
            getData()
        }
    }, [account?.account_id])

    // Update the latest custom module data
    useEffect(() => {
        async function getData() {
            const apiData = await generalGetFunction("/usage/all")
            if (apiData.status) {
                setCustomModule(apiData.data)
            }
        }
        if (refresh > 0) {
            getData()
        }
    }, [refresh])

    // Add new custom filter
    async function addNewCustomFilter() {
        if (name === '') {
            toast.error("Please enter a name")
            return
        }
        if (customId === "") {
            toast.error("Please select a custom module")
            return
        }
        setLoading(true)
        const apiData = await generalPostFunction("usage/store", { model_type: customType, model_id: customId, name: name })
        if (apiData.status) {
            toast.success("Successfully created new custom filter")
            setLoading(false)
            setRefresh(refresh + 1)
        } else {
            toast.error(apiData.message)
            setLoading(false)
        }
    }

    // Update custom filter
    async function updateCustomFilter() {
        if (name === '') {
            toast.error("Please enter a name")
            return
        }
        setLoading(true)
        const apiData = await generalPutFunction(`/usage/${selectedModule}`, { model_type: customType, model_id: customId, name: name })
        if (apiData.status) {
            toast.success(apiData.message)
            setLoading(false)
            setRefresh(refresh + 1)
        } else {
            setLoading(false)
        }
    }


    // Remove custom filter
    async function removeCustomFilter() {
        setLoading(true)
        const apiData = await generalDeleteFunction(`/usage/${selectedModule}`)
        if (apiData.status) {
            toast.success(apiData.message)
            setSelectedModule("")
            setCustomId("")
            setSelectedModule("CallCenterQueue")
            setAddNewMod(true)
            setLoading(false)
            setRefresh(refresh + 1)
        } else {
            toast.error(apiData.message)
            setLoading(false)
        }
    }
    return (
        <>

            <main className="mainContent">
                {loading ? <SkeletonFormLoader col={5} row={10} /> :
                    <section id="phonePage">
                        <div className="container-fluid px-0">
                            <Header title="Custom Module Integration" />
                        </div>
                        <div className='col-xl-12'>
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Select Modules</h4>
                                                    <p>Select the modules you want to include in your dashboard</p>
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12" style={{ padding: '25px 23px' }}>
                                        <div className='row gx-5'>
                                            <div className='col-xl-6' style={{ borderRight: '1px solid var(--border-color)' }}>
                                                <div className='row gy-4'>
                                                    {
                                                        customModule?.map((item, index) => {
                                                            return (
                                                                <div className='col-xl-4' key={index}>
                                                                    <div className={`deviceProvision ${selectedModule === item?.id ? 'active' : ''}`} onClick={() => { setSelectedModule(item?.id); setCustomType(item?.model_type); setCustomId(item?.model?.id); setAddNewMod(false); setName(item?.name) }}>
                                                                        <div className="itemWrapper a">
                                                                            <div className="heading h-auto d-block">
                                                                                <h5>{item?.name}</h5>
                                                                                <p>{item?.model_type === "CallCenterQueue" ? item?.model?.queue_name : item?.model_type === "Ringgroup" ? item?.model?.name : `${item?.model?.did}-${item?.model?.tag}`}</p>
                                                                                <p>{item?.model_type}</p>
                                                                            </div>
                                                                            <div className="data-number2  h-auto">
                                                                                <div className="d-flex flex-wrap justify-content-between">
                                                                                    <div className="col-4">

                                                                                        <div className='add-active '>
                                                                                        <p>Active</p>
                                                                                        </div>
                                                                                      
                                                                                        {/* <h4>
                                                                                        28{" "}
                                                                                        <i
                                                                                            className="fa-solid fa-phone-volume ms-1"
                                                                                            style={{ color: "var(--funky-boy4)", fontSize: 17 }}
                                                                                        />
                                                                                    </h4> */}
                                                                                    </div>
                                                                                    <div className="col-4 text-center">
                                                                                    <div className='add-rings '>

                                                                                        <p>Ringing</p>
                                                                                        </div>
                                                                                        {/* <h4>
                                                                                        82{" "}
                                                                                        <i
                                                                                            className="fa-solid fa-bell-ring ms-1"
                                                                                            style={{ color: "rgb(1, 199, 142)", fontSize: 17 }}
                                                                                        />
                                                                                    </h4> */}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    <div className='col-xl-4'>
                                                        <div className={`deviceProvision ${addNewMod ? 'active' : ''}`} onClick={() => { setSelectedModule(); setAddNewMod(true); setCustomType("CallCenterQueue"); setCustomId(""); setName("") }}>
                                                            <div className="itemWrapper a addNew">
                                                                <i className='fa-regular fa-plus'></i>
                                                                <p>Add New Module</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {(selectedModule != null || addNewMod) && < div className='col-xl-6'>
                                                <form>
                                                    <div className="formRow">
                                                        <div className="formLabel">
                                                            <label className="text-dark">Module Name</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Set name for the custom module.
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <input className='formItem' value={name} onChange={(e) => { setName(e.target.value) }} />
                                                        </div>
                                                    </div>
                                                    <div className="formRow">
                                                        <div className="formLabel">
                                                            <label className="text-dark">Enter Name</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Please enter the name of the module.
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <input className='formItem' placeholder='Enter Module Name' />
                                                        </div>
                                                    </div>
                                                    <div className="formRow">
                                                        <div className="formLabel">
                                                            <label className="text-dark">Select Type</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Please select the type for which you want to enable the module.
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <select className='formItem' value={customType} onChange={(e) => { setCustomType(e.target.value); setCustomId("") }}>
                                                                <option value='CallCenterQueue'>Call Center</option>
                                                                <option value="Ringgroup">Ring Group</option>
                                                                <option value="DidDetail">DID</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="formRow">
                                                        <div className="formLabel">
                                                            <label className="text-dark">Select Module</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Please select the module for custom filter
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <select className="formItem" value={customId} onChange={(e) => { setCustomId(e.target.value) }}>
                                                                <option value={""} disabled>Please select one</option>
                                                                {
                                                                    customType === "CallCenterQueue" ?
                                                                        callcenter.map((item) => {
                                                                            return (
                                                                                <option value={item.id}>{item.queue_name}</option>
                                                                            )
                                                                        }) :
                                                                        customType === "Ringgroup" ?
                                                                            ringgroup.map((item) => {
                                                                                return (
                                                                                    <option value={item.id}>{item.name}</option>
                                                                                )
                                                                            })
                                                                            : customType === "DidDetail" ?
                                                                                did.map((item) => {
                                                                                    return (
                                                                                        <option value={item.id}>{item.did}</option>
                                                                                    )
                                                                                }) : ""
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="formRow">
                                                        <div className="formLabel">
                                                            <label className="text-dark">Select Info</label>
                                                            <label className="formItemDesc">
                                                                Please select the info of the feature you want to display in the module.
                                                            </label>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className='row'>
                                                                <div className='col-6'>
                                                                    <div className='formLabel'>
                                                                        <label className="formItemDesc">First Column</label>
                                                                    </div>
                                                                    <select className="formItem">
                                                                        <option>Active Calls</option>
                                                                        <option>Ringing Calls</option>
                                                                        <option>Missed Calls</option>
                                                                        <option>Total Calls</option>
                                                                    </select>
                                                                </div>
                                                                <div className='col-6'>
                                                                    <div className='formLabel'>
                                                                        <label className="formItemDesc">Second Column</label>
                                                                    </div>
                                                                    <select className="formItem">
                                                                        <option>Active Calls</option>
                                                                        <option>Ringing Calls</option>
                                                                        <option>Missed Calls</option>
                                                                        <option>Total Calls</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="formRow">
                                                        {!addNewMod &&
                                                            <button type='button' className="panelButton delete ms-0" onClick={removeCustomFilter}>
                                                                <span className="text" >Delete</span>
                                                                <span className="icon"><i class="fa-solid fa-trash"></i></span>
                                                            </button>
                                                        }
                                                        <button type='button' className="panelButton ms-auto" onClick={() => { addNewMod ? addNewCustomFilter() : updateCustomFilter() }}>
                                                            <span className="text" >{addNewCustomFilter ? "Save" : "Update"}</span>
                                                            <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                }
            </main >
        </>
    )
}

export default CustomDashboardManage