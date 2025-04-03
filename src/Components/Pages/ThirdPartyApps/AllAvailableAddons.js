import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { useNavigate } from 'react-router-dom';
import PromptFunctionPopup from '../../CommonComponents/PromptFunctionPopup';
import { backToTop, featureUnderdevelopment, generalDeleteFunction, generalGetFunction } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import CircularLoader from '../../Loader/CircularLoader';

const AllAvailableAddons = () => {
    const navigate = useNavigate();
    const [allConfigData, setAllConfigData] = useState();
    const [loading, setLoading] = useState(false);
    const { confirm, ModalComponent } = PromptFunctionPopup();

    // useEffect(() => {
    //     fetchAllConfig();
    // }, [])

    // const fetchAllConfig = async () => {
    //     setLoading(true);
    //     try {
    //         const apiCall = await generalGetFunction('/social-platforms/all');
    //         if (apiCall.status) {
    //             setAllConfigData(apiCall.data);
    //             setLoading(false);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //         setLoading(false);
    //     }
    // }

    const handleDeleteConfig = async (id) => {
        const userConfirmed = await confirm();
        if (userConfirmed) {
            setLoading(true);
            try {
                const apiCall = await generalDeleteFunction(`/social-platforms/${id}`);
                if (apiCall.status) {
                    setLoading(false);
                    toast.success("Config Deleted Successfully.");
                    // fetchAllConfig();
                }
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
    }

    // const handleConfigEdit = async (id, platform) => {
    //     if (platform.toLowerCase() === "instagram" || platform.toLowerCase() === "facebook") {
    //         navigate('/meta-config-edit', { state: { id: id, platform: platform } });
    //     } else if (platform.toLowerCase() === "whatsapp") {
    //         navigate('/whatsapp-config-edit', { state: { id: id } });
    //     }
    // }

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
                        <Header title="All Add Ons" />
                    </div>
                    <div className="col-xl-12" style={{ overflow: "auto" }}>
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>All Third Party Addons</h4>
                                                <p>List of all existing third party apps.</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    onClick={() => {
                                                        navigate('-1');
                                                        backToTop()
                                                    }}
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton gray"
                                                >
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 formScroller" style={{ padding: '25px 23px' }}>
                                    <>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="product-container row">
                                                    {/* Product 2 */}
                                                    <div className='col-3'>
                                                        <div className={`product-cart`}>
                                                            <div className="product-image">
                                                                <img
                                                                    src={`${require(`../../assets/images/icons/addons/whatsapp.webp`)}`}
                                                                    onError={require('../../assets/images/placeholder-image.webp')}
                                                                    alt="whatsapp"
                                                                />
                                                            </div>
                                                            <div className='content_width'>
                                                                <div className="product-title mt-4">
                                                                    <p style={{ textTransform: 'capitalize' }}>
                                                                        whatsapp Integration
                                                                    </p>
                                                                </div>
                                                                <div className="product-description">
                                                                    <span className="text-smalls">Integrate whatsapp in our platform and use it on-the-go</span>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                                <button class="checkbox_wrapper"
                                                                    onClick={() => navigate('/whatsapp-config')}
                                                                >
                                                                    <span className='cartSvg addonsBtn'>
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </span>
                                                                    <span>Configure</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-3'>
                                                        <div className={`product-cart`}>
                                                            <div className="product-image">
                                                                <img
                                                                    src={`${require(`../../assets/images/icons/addons/facebook.webp`)}`}
                                                                    onError={require('../../assets/images/placeholder-image.webp')}
                                                                    alt="facebook"
                                                                />
                                                            </div>
                                                            <div className='content_width'>
                                                                <div className="product-title mt-4">
                                                                    <p style={{ textTransform: 'capitalize' }}>
                                                                        facebook Integration
                                                                    </p>
                                                                </div>
                                                                <div className="product-description">
                                                                    <span className="text-smalls">Integrate facebook in our platform and use it on-the-go</span>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                                <button class="checkbox_wrapper"
                                                                    onClick={() => navigate('/meta-config')}
                                                                >
                                                                    <span className='cartSvg addonsBtn'>
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </span>
                                                                    <span>Configure</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-3'>
                                                        <div className={`product-cart`}>
                                                            <div className="product-image">
                                                                <img
                                                                    src={`${require(`../../assets/images/icons/addons/instagram.webp`)}`}
                                                                    onError={require('../../assets/images/placeholder-image.webp')}
                                                                    alt="instagram"
                                                                />
                                                            </div>
                                                            <div className='content_width'>
                                                                <div className="product-title mt-4">
                                                                    <p style={{ textTransform: 'capitalize' }}>
                                                                        instagram Integration
                                                                    </p>
                                                                </div>
                                                                <div className="product-description">
                                                                    <span className="text-smalls">Integrate instagram in our platform and use it on-the-go</span>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                                <button class="checkbox_wrapper"
                                                                    onClick={() => navigate('/meta-config')}
                                                                >
                                                                    <span className='cartSvg addonsBtn'>
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </span>
                                                                    <span>Configure</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Product 4 */}
                                                    <div className='col-3'>
                                                        <div className='product-cart'>
                                                            <div className="product-image">
                                                                <img
                                                                    src="https://upload.wikimedia.org/wikipedia/commons/6/60/Skype_logo_%282019%E2%80%93present%29.svg"
                                                                    alt="Click to Call"
                                                                    className="product-image"
                                                                />
                                                            </div>
                                                            <div className='content_width'>
                                                                <div className="product-title  mt-4">
                                                                    <p>
                                                                        Skype Integration
                                                                    </p>
                                                                </div>
                                                                <div className="product-description">
                                                                    <span className="text-smalls">Integrate skype in our platform and use it on-the-go</span>
                                                                </div>
                                                            </div>

                                                            <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                                <button class="checkbox_wrapper"
                                                                    onClick={() => featureUnderdevelopment()}
                                                                >
                                                                    <span className='cartSvg addonsBtn'>
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </span>
                                                                    <span>Configure</span>
                                                                </button>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ModalComponent />

            </main>
        </>
    )
}

export default AllAvailableAddons