import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { useNavigate } from 'react-router-dom';
import PromptFunctionPopup from '../../CommonComponents/PromptFunctionPopup';
import { backToTop, generalDeleteFunction, generalGetFunction } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import CircularLoader from '../../Loader/CircularLoader';

const AllAddons = () => {
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
                                                <button
                                                    onClick={() => {
                                                        navigate('/all-available-addons');
                                                        backToTop();
                                                    }}
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton"
                                                >
                                                    <span className="text">Add</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-plus"></i>
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
                                                    {allConfigData && allConfigData.length > 0 ?
                                                        allConfigData.map((item, index) => {
                                                            return (
                                                                <>
                                                                    <div className='col-3'>
                                                                        <div className={`product-cart`}>
                                                                            <div className="product-image">
                                                                                <img
                                                                                    src={`${require(`../../assets/images/icons/addons/${item?.platform}.webp`)}`}
                                                                                    onError={require('../../assets/images/placeholder-image.webp')}
                                                                                    alt={item.platform}
                                                                                />
                                                                            </div>
                                                                            <div className='content_width'>
                                                                                <div className="product-title mt-4">
                                                                                    <p style={{ textTransform: 'capitalize' }}>
                                                                                        {item.platform} Integration
                                                                                    </p>
                                                                                </div>
                                                                                <div className="product-description">
                                                                                    <span className="text-smalls">Integrate {item.platform} in our platform and use it on-the-go</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                                                <button class="checkbox_wrapper edit"
                                                                                    onClick={() => handleConfigEdit(item.id, item.platform)}
                                                                                >
                                                                                    <span className='cartSvg addonsBtn'>
                                                                                        <i class="fa-solid fa-pencil"></i>
                                                                                    </span>
                                                                                    <span>Edit</span>
                                                                                </button>
                                                                                <button className="tableButton delete" onClick={() => handleDeleteConfig(item.id)}>
                                                                                    <i className="fa-solid fa-trash">                                                                            </i>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )
                                                        }) : (
                                                            <>
                                                                <div className='col-3'>
                                                                    <div className={`product-cart`}>
                                                                        <div className="product-image skeleton" ></div>
                                                                        <div className='content_width'>
                                                                            <div className="product-title mt-4">
                                                                                <p style={{ textTransform: 'capitalize' }}>
                                                                                    <div className='skeleton skeleton-formLabel mx-auto' />
                                                                                </p>
                                                                            </div>
                                                                            <div className="product-description mt-2">
                                                                                <div className='skeleton skeleton-formLabel-small' />
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                                            <div className='skeleton skeleton-button'></div>
                                                                            <div className='skeleton skeleton-button'></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='col-3'>
                                                                    <div className={`product-cart`}>
                                                                        <div className="product-image skeleton" ></div>
                                                                        <div className='content_width'>
                                                                            <div className="product-title mt-4">
                                                                                <p style={{ textTransform: 'capitalize' }}>
                                                                                    <div className='skeleton skeleton-formLabel mx-auto' />
                                                                                </p>
                                                                            </div>
                                                                            <div className="product-description mt-2">
                                                                                <div className='skeleton skeleton-formLabel-small' />
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                                            <div className='skeleton skeleton-button'></div>
                                                                            <div className='skeleton skeleton-button'></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='col-3'>
                                                                    <div className={`product-cart`}>
                                                                        <div className="product-image skeleton" ></div>
                                                                        <div className='content_width'>
                                                                            <div className="product-title mt-4">
                                                                                <p style={{ textTransform: 'capitalize' }}>
                                                                                    <div className='skeleton skeleton-formLabel mx-auto' />
                                                                                </p>
                                                                            </div>
                                                                            <div className="product-description mt-2">
                                                                                <div className='skeleton skeleton-formLabel-small' />
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                                            <div className='skeleton skeleton-button'></div>
                                                                            <div className='skeleton skeleton-button'></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                    {/* Product 4 */}
                                                    {/* <div className='product-cart'>
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
                                                                    Skype Integration<span className="text-smalls"> (facebook)</span>
                                                                </p>
                                                            </div>
                                                            <div className="product-description">
                                                                Make instant calls directly from the platform.
                                                            </div>
                                                        </div>

                                                        <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                            <div class="checkbox_wrapper">
                                                                <input type="checkbox" id="cbx-48" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />

                                                                <label for="cbx-48" class="cbx">
                                                                    <span className='cartSvg addonsBtn'>
                                                                        <i class="fa-solid fa-pencil"></i>
                                                                    </span>
                                                                    <span>config</span>
                                                                </label>

                                                            </div>
                                                            <button className="tableButton delete">
                                                                <i className="fa-solid fa-trash"></i>
                                                            </button>
                                                        </div>

                                                    </div> */}
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

export default AllAddons