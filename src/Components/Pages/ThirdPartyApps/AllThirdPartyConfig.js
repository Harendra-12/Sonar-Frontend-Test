import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { backToTop, generalDeleteFunction, generalGetFunction } from '../../GlobalFunction/globalFunction';
import { Link, useNavigate } from 'react-router-dom';
import SkeletonTableLoader from '../../Loader/SkeletonTableLoader';
import PromptFunctionPopup from '../../CommonComponents/PromptFunctionPopup';
import { toast } from 'react-toastify';

function AllThirdPartyConfig() {
    const navigate = useNavigate();
    const [allConfigData, setAllConfigData] = useState();
    const [loading, setLoading] = useState(false);
    const { confirm, ModalComponent } = PromptFunctionPopup();

    useEffect(() => {
        fetchAllConfig();
    }, [])

    const fetchAllConfig = async () => {
        setLoading(true);
        try {
            const apiCall = await generalGetFunction('/social-platforms/all');
            if (apiCall.status) {
                setAllConfigData(apiCall.data);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    const handleDeleteConfig = async (id) => {
        const userConfirmed = await confirm();
        if (userConfirmed) {
            setLoading(true);
            try {
                const apiCall = await generalDeleteFunction(`/social-platforms/${id}`);
                if (apiCall.status) {
                    setLoading(false);
                    toast.success("Config Deleted Successfully.");
                    fetchAllConfig();
                }
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
    }

    const handleConfigEdit = async (id, platform) => {
        if (platform.toLowerCase() === "instagram" || platform.toLowerCase() === "facebook") {
            navigate('/meta-config-edit', { state: { id: id, platform: platform } });
        } else if (platform.toLowerCase() === "whatsapp") {
            navigate('/whatsapp-config-edit', { state: { id: id } });
        }
    }

    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Meta" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>All Third Party Apps</h4>
                                                    <p>List of all existing third party apps.</p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <button
                                                        effect="ripple"
                                                        className="panelButton gray"
                                                        onClick={() => {
                                                            navigate(-1);
                                                            backToTop();
                                                        }}
                                                    >
                                                        <span className="text">Back</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-caret-left"></i>
                                                        </span>
                                                    </button>
                                                    <div className="dropdown">
                                                        <button
                                                            type="button"
                                                            className="panelButton"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="true"
                                                        >
                                                            <span className="text">Add</span>
                                                            <span className="icon">
                                                                <i className="fa-solid fa-plus"></i>
                                                            </span>
                                                        </button>
                                                        <ul className="dropdown-menu actionBtnDropdowns">
                                                            <li className="dropdown-item">
                                                                <Link to="/meta-config" className="clearButton text-align-start">
                                                                    <i className="fa-brands fa-meta me-2" /> Meta
                                                                </Link>
                                                            </li>
                                                            <li className="dropdown-item">
                                                                <Link to="/whatsapp-config" className="clearButton text-align-start">
                                                                    <i className="fa-brands fa-whatsapp me-2" /> WhatsApp
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="col-12"
                                            style={{ overflow: "auto", padding: "25px 20px 0" }}
                                        >
                                            <div className="tableContainer">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Platform</th>
                                                            <th>App ID</th>
                                                            <th>Add. Info</th>
                                                            <th>Edit</th>
                                                            <th>Delete</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {loading ? <SkeletonTableLoader row={15} col={5} /> : (
                                                            <>
                                                                {allConfigData?.length > 0 ?
                                                                    allConfigData?.map((item, index) => {
                                                                        return (
                                                                            <tr key={item.id}>
                                                                                <td style={{ textTransform: 'capitalize' }}>{item.platform}</td>
                                                                                <td>{item.app_id}</td>
                                                                                <td>{item.additional_config || "N/A"}</td>
                                                                                <td>
                                                                                    <button className='tableButton edit' onClick={() => handleConfigEdit(item.id, item.platform)}>
                                                                                        <i className='fa-solid fa-pen' />
                                                                                    </button>
                                                                                </td>
                                                                                <td>
                                                                                    <button className='tableButton delete' onClick={() => handleDeleteConfig(item.id)}>
                                                                                        <i className='fa-solid fa-trash' />
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    }) :
                                                                    (
                                                                        <tr>
                                                                            <td colSpan={5} className='text-center'>No Data Found</td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            </>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ModalComponent task={"delete"} reference={"config"} />
            </main>
        </>
    )
}

export default AllThirdPartyConfig