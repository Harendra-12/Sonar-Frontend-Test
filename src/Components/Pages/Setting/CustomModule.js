import React, { useEffect, useState } from 'react'
import SkeletonFormLoader from '../../Loader/SkeletonFormLoader';
import { useNavigate } from 'react-router-dom';
import { backToTop, checkViewSidebar, generalGetFunction } from '../../GlobalFunction/globalFunction';
import Header from '../../CommonComponents/Header';
import CustomDashboardManage from './CustomDashboardManage';
import { useSelector } from 'react-redux';
import SkeletonTableLoader from '../../Loader/SkeletonTableLoader';

function CustomModule() {
    const account = useSelector((state) => state.account);
    const slugPermissions = useSelector((state) => state?.permissions);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [customModule, setCustomModule] = useState([])
    const [refresh, setRefresh] = useState(0)
    const [refreshState, setRefreshState] = useState(false)
    const [selectedModule, setSelectedModule] = useState();
    const [addNewMod, setAddNewMod] = useState(false);
    const [popup, setPopup] = useState(false);

    const getData = async (shouldLoad) => {
        if (shouldLoad) setLoading(true)
        const apiData = await generalGetFunction("/usage/all")
        if (apiData.status) {
            setLoading(false)
            setRefreshState(false)
            setCustomModule(apiData.data)
        } else {
            setLoading(false)
            setRefreshState(false)
        }
    }

    // Update the latest custom module data
    useEffect(() => {
        setRefreshState(true)
        const shouldLoad = true;
        getData(shouldLoad)
    }, [refresh])

    const handleRefreshBtnClicked = () => {
        setRefreshState(true);
        const shouldLoad = false;
        getData(shouldLoad)
    }
    return (
        <main className="mainContent">
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
                                            <h4>Select Modules {" "}
                                                <button
                                                    className="clearButton"
                                                    onClick={handleRefreshBtnClicked}
                                                    disabled={refreshState}
                                                >
                                                    <i
                                                        className={
                                                            refreshState
                                                                ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                                                : "fa-regular fa-arrows-rotate fs-5"
                                                        }
                                                    ></i>
                                                </button>
                                            </h4>
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
                                                <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
                                            </button>
                                            {checkViewSidebar(
                                                "Usage",
                                                slugPermissions,
                                                account?.sectionPermissions,
                                                account?.permissions,
                                                "add"
                                            ) &&
                                                <button
                                                    onClick={() => {
                                                        setAddNewMod(true); setSelectedModule(""); setPopup(true)
                                                    }}
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton"
                                                >
                                                    <span className="text">Add</span>
                                                    <span className="icon"><i className="fa-solid fa-plus"></i></span>
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12' style={{ overflow: 'auto', padding: '10px 20px 0px' }}>
                                    <div className='tableContainer'>
                                        <table>
                                            <thead>
                                                <th>Module Name</th>
                                                <th>Category Name</th>
                                                <th>Category</th>
                                                <th>Tag</th>
                                                <th>Active</th>
                                                <th>Ringing</th>
                                                <th>Missed</th>
                                                <th>Total</th>
                                                {checkViewSidebar("Usage", slugPermissions, account?.sectionPermissions, account?.permissions, "edit") && <th>Edit</th>}
                                            </thead>
                                            <tbody>
                                                {loading ? <SkeletonTableLoader col={9} row={10} /> :
                                                    <>
                                                        {
                                                            customModule?.map((item, index) => {
                                                                return (
                                                                    <tr>
                                                                        <td>{item?.name}</td>
                                                                        <td>{item?.model_type === "CallCenterQueue" ? item?.model?.queue_name : item?.model_type === "Ringgroup" ? item?.model?.name : `${item?.model?.did}`}</td>
                                                                        <td>{item?.model_type}</td>
                                                                        <td>{item?.model?.tag}</td>
                                                                        <td><i className={`fa-solid fa-${item?.active ? "check text-success" : "xmark text-danger"}`} /></td>
                                                                        <td><i className={`fa-solid fa-${item?.ringing ? "check text-success" : "xmark text-danger"}`} /></td>
                                                                        <td><i className={`fa-solid fa-${item?.missed ? "check text-success" : "xmark text-danger"}`} /></td>
                                                                        <td><i className={`fa-solid fa-${item?.total ? "check text-success" : "xmark text-danger"}`} /></td>
                                                                        {
                                                                            checkViewSidebar("Usage", slugPermissions, account?.permissions, "edit") ?
                                                                                <td><button className='tableButton edit' onClick={() => { setSelectedModule(item); setAddNewMod(false); setPopup(true) }}><i className="fa-solid fa-pen-to-square" /></button></td> : ""
                                                                        }
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </>}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {
                popup ? <CustomDashboardManage addNewMod={addNewMod} setSelectedModule={setSelectedModule} setAddNewMod={setAddNewMod} selectedModule={selectedModule} setRefresh={setRefresh} refresh={refresh} popup={popup} setPopup={setPopup} /> : ""
            }

        </main>
    )
}

export default CustomModule
