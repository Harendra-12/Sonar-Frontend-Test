import React, { useEffect, useState } from 'react'
import SkeletonFormLoader from '../../Loader/SkeletonFormLoader';
import { useNavigate } from 'react-router-dom';
import { backToTop, generalGetFunction } from '../../GlobalFunction/globalFunction';
import Header from '../../CommonComponents/Header';
import CustomDashboardManage from './CustomDashboardManage';

function CustomModule() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [customModule, setCustomModule] = useState([])
    const [refresh, setRefresh] = useState(0)
    const [selectedModule, setSelectedModule] = useState();
    const [addNewMod, setAddNewMod] = useState(false);
    const [popup, setPopup] = useState(false);

    // Update the latest custom module data
    useEffect(() => {
        setLoading(true)
        async function getData() {
            const apiData = await generalGetFunction("/usage/all")
            if (apiData.status) {
                setLoading(false)
                setCustomModule(apiData.data)
            } else {
                setLoading(false)
            }
        }
        getData()
    }, [refresh])
    return (
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
                                <div className='col-xl-6' style={{ borderRight: '1px solid var(--border-color)' }}>
                                    <div className='row gy-4'>
                                        {
                                            customModule?.map((item, index) => {
                                                return (
                                                    <div className='col-xl-4' key={index}>
                                                        <div className={`deviceProvision ${selectedModule?.id === item?.id ? 'active' : ''}`}
                                                            onClick={() => {
                                                                setSelectedModule(item)
                                                                setAddNewMod(false)
                                                                setPopup(true)
                                                            }}
                                                        >
                                                            <div className="itemWrapper a">
                                                                <div className="heading h-auto d-block">
                                                                    <h5>{item?.name}</h5>
                                                                    <p>{item?.model_type === "CallCenterQueue" ? item?.model?.queue_name : item?.model_type === "Ringgroup" ? item?.model?.name : `${item?.model?.did}-${item?.model?.tag}`}</p>
                                                                    <p>{item?.model_type}</p>
                                                                </div>
                                                                <div className="data-number2  h-auto">
                                                                    <div className="d-flex flex-wrap justify-content-between">
                                                                        {
                                                                            item.active ? <div className="col-4">
                                                                                <div className='add-active '>
                                                                                    <p>Active</p>
                                                                                </div>
                                                                            </div> : ""
                                                                        }
                                                                        {
                                                                            item.ringing ? <div className="col-4">
                                                                                <div className='add-active '>
                                                                                    <p>Ringing</p>
                                                                                </div>
                                                                            </div> : ""
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="data-number2  h-auto">
                                                                    <div className="d-flex flex-wrap justify-content-between">
                                                                        {
                                                                            item.total ? <div className="col-4">
                                                                                <div className='add-active '>
                                                                                    <p>Total</p>
                                                                                </div>
                                                                            </div> : ""
                                                                        }
                                                                        {
                                                                            item.missed ? <div className="col-4">
                                                                                <div className='add-active '>
                                                                                    <p>Missed</p>
                                                                                </div>
                                                                            </div> : ""
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        <div className='col-xl-4'>
                                            <div className={`deviceProvision ${addNewMod ? 'active' : ''}`}
                                                onClick={() => { setAddNewMod(true); setSelectedModule(""); setPopup(true) }}
                                            >
                                                <div className="itemWrapper a addNew">
                                                    <i className='fa-regular fa-plus'></i>
                                                    <p>Add New Module</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
            {
                popup ? <CustomDashboardManage addNewMod={addNewMod} setSelectedModule={setSelectedModule} setAddNewMod={setAddNewMod} selectedModule={selectedModule} setRefresh={setRefresh} refresh={refresh} setPopup={setPopup} /> : ""
            }

        </main>
    )
}

export default CustomModule
