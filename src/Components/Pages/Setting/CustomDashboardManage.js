/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { checkViewSidebar, generalDeleteFunction, generalGetFunction, generalPostFunction, generalPutFunction } from '../../GlobalFunction/globalFunction';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CircularLoader from '../../Loader/CircularLoader';

function CustomDashboardManage({ addNewMod, selectedModule, setRefresh, refresh, setSelectedModule, setAddNewMod, setPopup }) {
    const account = useSelector((state) => state.account);
    const [ringgroup, setRingGroup] = useState([])
    const [callcenter, setCallCenter] = useState([])
    const [did, setDid] = useState([])
    const [loading, setLoading] = useState(true)
    const [customType, setCustomType] = useState('CallCenterQueue')
    const [customId, setCustomId] = useState('')
    const [name, setName] = useState('')
    const [feature, setFeature] = useState([])
    const [allUser, setAllUser] = useState([]);
    const [userId, setUserId] = useState("");
    const slugPermissions = useSelector((state) => state?.permissions);
    const [usages, setUsages] = useState("")
    const [selecetdUsages, setSelecetdUsages] = useState("");
    const [allGroups, setAllGroups] = useState([])
    const [allRoles, setAllRoles] = useState([])
    // const [selectedUser,setSelecteduser]=useState("")

    // Handel fetaure change
    function handleFeatureChange(value) {
        if (feature.includes(value)) {
            setFeature(feature?.filter((item) => item !== value))
        } else {
            setFeature((prev) => {
                return [...prev, value]
            })
        }
    }

    // fetching api to get all user data
    useEffect(() => {
        async function getAllUser() {
            const res = await generalGetFunction(`/agents?usages=pbx&allagents${account.usertype !== 'Company' || account.usertype !== 'SupreAdmin' ? '&section=Accounts' : ""}`);
            const groupData = await generalGetFunction("/groups/all")
            const roleData = await generalGetFunction("/role/all")
            if (res.status) {
                const data = res.data.map((item) => ({
                    name: item.name,
                    id: item.id,
                }));
                setAllUser(data);
                setUserId(selectedModule?.user_id)
            }
            if (groupData.status) {
                setAllGroups(groupData.data)
            }
            if (roleData.status) {
                setAllRoles(roleData.data)
            }

        }
        getAllUser()
    }, [])
    // Checking if the callcenter, ringgroup and did details is already available or not if not available then get it by api calling
    useEffect(() => {
        async function getData() {
            try {
                setLoading(true)
                const [ringGroupData, callcenterData, didData] = await Promise.all([
                    generalGetFunction(`/ringgroup?account=${account?.account_id}`),
                    generalGetFunction(`/call-center-queues/all`),
                    generalGetFunction("/did/all?all-dids"),
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

    // Handle select custom module data 
    useEffect(() => {
        function getData() {
            if (selectedModule) {
                setFeature([]);
                setCustomType(selectedModule?.model_type); setCustomId(selectedModule?.model?.id); setAddNewMod(false);
                setName(selectedModule?.name);
                setUsages(selectedModule?.usage_type); setSelecetdUsages(selectedModule?.usage_type === "group" ? selectedModule?.group_id : selectedModule?.role_id);
                if (selectedModule.missed) {
                    setFeature((prev) => {
                        return [...prev, "missed"]
                    })
                }
                if (selectedModule.total) {
                    setFeature((prev) => {
                        return [...prev, "total"]
                    })
                }
                if (selectedModule.ringing) {
                    setFeature((prev) => {
                        return [...prev, "ringing"]
                    })
                }
                if (selectedModule.active) {
                    setFeature((prev) => {
                        return [...prev, "active"]
                    })
                }
            }
        }
        if (addNewMod === false) {
            getData()
        }
    }, [selectedModule, addNewMod])

    // Add new custom filter
    async function addNewCustomFilter() {
        if (name === '') {
            toast.error("Please enter a name")
            return
        }
        if (usages !== "" && selecetdUsages === "") {
            toast.error("Please select group or role")
            return
        }
        if (customId === "") {
            toast.error("Please select a custom module")
            return
        }
        if (feature.length === 0) {
            toast.error("Please select at least one feature")
            return
        }
        setLoading(true)
        const apiData = await generalPostFunction("/usage/store", { model_type: customType, model_id: customId, user_id: userId, name: name, active: feature.includes("active"), ringing: feature.includes("ringing"), total: feature.includes("total"), missed: feature.includes("missed"), usage_type: usages, group_id: usages === "group" ? selecetdUsages : "", role_id: usages === "role" ? selecetdUsages : "" })
        if (apiData.status) {
            toast.success("Successfully created new custom filter")
            setLoading(false)
            setRefresh(refresh + 1)
            setPopup(false)
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
        if (usages !== "" && selecetdUsages === "") {
            toast.error("Please select group or role")
            return
        }
        if (customId === "") {
            toast.error("Please select a custom module")
            return
        }
        if (feature.length === 0) {
            toast.error("Please select at least one feature")
            return
        }
        setLoading(true)
        const apiData = await generalPutFunction(`/usage/${selectedModule?.id}`, { model_type: customType, model_id: customId, user_id: userId, name: name, active: feature.includes("active"), ringing: feature.includes("ringing"), total: feature.includes("total"), missed: feature.includes("missed"), usage_type: usages, group_id: usages === "group" ? selecetdUsages : "", role_id: usages === "role" ? selecetdUsages : "" })
        if (apiData.status) {
            toast.success(apiData.message)
            setLoading(false)
            setRefresh(refresh + 1)
            setPopup(false)
        } else {
            setLoading(false)
        }
    }

    // Remove custom filter
    async function removeCustomFilter() {
        setLoading(true)
        const apiData = await generalDeleteFunction(`/usage/${selectedModule?.id}`)
        if (apiData.status) {
            toast.success(apiData.message)
            setSelectedModule("")
            setCustomId("")
            setSelectedModule()
            setLoading(false)
            setRefresh(refresh + 1)
            setPopup(false)
        } else {
            toast.error(apiData.message)
            setLoading(false)
        }
    }
    return (
        <>
            {loading ? <CircularLoader /> :
                <main className="popup">
                    <section id="phonePage" className='d-flex align-items-center h-100'>
                        <div className='col-xxl-4 col-lg-6 m-auto'>
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild position-relative">
                                    <button className='clearButton2 position-absolute top-0 end-0' onClick={() => setPopup(false)}>
                                        <i className='fa-solid fa-xmark' />
                                    </button>
                                    <div className="col-12" style={{ padding: '25px 23px' }}>
                                        <div className='row gx-5'>
                                            {(selectedModule != null || addNewMod) && < div className='col-xl-12'>
                                                <form>
                                                    <div className="formRow">
                                                        <div className="formLabel" style={{ maxWidth: 'unset' }}>
                                                            <label className="text-dark">Module Name</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Set name for the custom module.
                                                            </label>
                                                        </div>
                                                        <div className="col-12">
                                                            <input className='formItem' value={name} onChange={(e) => { setName(e.target.value) }} />
                                                        </div>
                                                    </div>
                                                    <div className="formRow">
                                                        <div className="formLabel" style={{ maxWidth: 'unset' }}>
                                                            <label className="text-dark">Select Type</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Please select the type for which you want to enable the module.
                                                            </label>
                                                        </div>
                                                        <div className="col-12">
                                                            <select className='formItem' value={customType} onChange={(e) => { setCustomType(e.target.value); setCustomId("") }}>
                                                                <option value='CallCenterQueue'>Call Center</option>
                                                                <option value="Ringgroup">Ring Group</option>
                                                                <option value="DidDetail">Number</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="formRow">
                                                        <div className="formLabel" style={{ maxWidth: 'unset' }}>
                                                            <label className="text-dark">Select Module</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Please select the module for custom filter
                                                            </label>
                                                        </div>
                                                        <div className="col-12">
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
                                                        <div className="formLabel" style={{ maxWidth: 'unset' }}>
                                                            <label className="text-dark">Select Usages</label>
                                                            <label htmlFor="data" className="formItemDesc">
                                                                Please select the usages for which you want to
                                                                enable the module.
                                                            </label>
                                                        </div>
                                                        <div className='col-12'>
                                                            <div className='row mb-2'>
                                                                <div className={`col-${usages === "" ? 12 : 6}`}>
                                                                    <select
                                                                        className="formItem"
                                                                        value={usages}
                                                                        onChange={(e) => setUsages(e.target.value)}
                                                                    >
                                                                        <option value="">Select Usages</option>
                                                                        <option value="group">Group</option>
                                                                        <option value="role">Role</option>
                                                                    </select>
                                                                </div>
                                                                {
                                                                    usages !== "" &&
                                                                    <div className="col-6">
                                                                        <select
                                                                            className="formItem"
                                                                            value={selecetdUsages}
                                                                            onChange={(e) => {
                                                                                setSelecetdUsages(e.target.value);
                                                                            }}
                                                                        >
                                                                            <option>Select {usages}</option>
                                                                            {
                                                                                usages === "group" ?
                                                                                    <>
                                                                                        {
                                                                                            allGroups?.map((item, key) => {
                                                                                                return (
                                                                                                    <option key={key} value={item.id}>{item.group_name}</option>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </> : <>
                                                                                        {
                                                                                            allRoles?.map((item, key) => {
                                                                                                return (
                                                                                                    <option key={key} value={item.id}>{item.name}</option>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </>
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="formRow">
                                                        <div className="formLabel" style={{ maxWidth: 'unset' }}>
                                                            <label className="text-dark">Select Info</label>
                                                            <label className="formItemDesc">
                                                                Please select the info of the feature you want to display in the module.
                                                            </label>
                                                        </div>
                                                        <div className="col-12">
                                                            <div className='row'>
                                                                <div className='col-12'>
                                                                    <div className='d-flex align-items-center justify-content-between custom-font mt-1' onClick={() => handleFeatureChange("active")} style={{ cursor: "pointer" }}>
                                                                        <div>
                                                                            <p className='m-0 p-0'> Active calls </p>
                                                                        </div>
                                                                        <div> <input type="checkbox" checked={feature.includes("active")} />
                                                                        </div>
                                                                    </div>
                                                                    <div className='d-flex align-items-center justify-content-between custom-font mt-1' onClick={() => handleFeatureChange("ringing")} style={{ cursor: "pointer" }}>
                                                                        <div>
                                                                            <p className='m-0 p-0'>Ringing Calls</p>
                                                                        </div>
                                                                        <div> <input type="checkbox" checked={feature.includes("ringing")} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='col-12'>
                                                                    <div className='d-flex align-items-center justify-content-between custom-font mt-1' onClick={() => handleFeatureChange("missed")} style={{ cursor: "pointer" }}>
                                                                        <div>
                                                                            <p className='m-0 p-0'>Missed Calls </p>
                                                                        </div>
                                                                        <div> <input type="checkbox" checked={feature.includes("missed")} />
                                                                        </div>
                                                                    </div>
                                                                    <div className='d-flex align-items-center justify-content-between custom-font mt-1' onClick={() => handleFeatureChange("total")} style={{ cursor: "pointer" }}>
                                                                        <div>
                                                                            <p className='m-0 p-0'>Total Calls</p>
                                                                        </div>
                                                                        <div> <input type="checkbox" checked={feature.includes("total")} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="formRow">
                                                        {checkViewSidebar("Usage", slugPermissions, account?.permissions, "delete") ?
                                                            !addNewMod &&
                                                            <button type='button' className="panelButton delete ms-0" onClick={removeCustomFilter}>
                                                                <span className="text" >Delete</span>
                                                                <span className="icon"><i className="fa-solid fa-trash"></i></span>
                                                            </button>
                                                            : ""}
                                                        <button type='button' className="panelButton ms-auto" onClick={() => { addNewMod ? addNewCustomFilter() : updateCustomFilter() }}>
                                                            <span className="text" >{addNewCustomFilter ? "Save" : "Update"}</span>
                                                            <span className="icon"><i className="fa-solid fa-floppy-disk"></i></span>
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
                </main >
            }
        </>
    )
}

export default CustomDashboardManage