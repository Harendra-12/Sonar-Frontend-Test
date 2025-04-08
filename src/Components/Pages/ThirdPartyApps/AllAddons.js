import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { useNavigate } from 'react-router-dom';
import PromptFunctionPopup from '../../CommonComponents/PromptFunctionPopup';
import { backToTop, featureUnderdevelopment, generalDeleteFunction, generalGetFunction, generalPostFunction, generalPutFunction } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import CircularLoader from '../../Loader/CircularLoader';
import ErrorMessage from '../../CommonComponents/ErrorMessage';
import { useForm } from 'react-hook-form';
import { requiredValidator } from '../../validations/validation';

const AllAddons = () => {
    const navigate = useNavigate();
    const [allConfigData, setAllConfigData] = useState();
    const [loading, setLoading] = useState(false);
    const { confirm, ModalComponent } = PromptFunctionPopup();
    const [addonEditPopup, setAddonEditPopup] = useState(false);
    const [addonAddPopup, setAddonAddPopup] = useState(false);
    const [platform, setPlatform] = useState("");
    const [addonEditID, setAddonEditID] = useState("");

    const currentAddons = [
        { name: "WhatsApp", platform: "whatsapp" },
        { name: "Instagram", platform: "instagram" },
        { name: "Facebook", platform: "facebook" },
    ]

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
        setAddonEditID(id);
        setPlatform(platform);
        setAddonEditPopup(true);
    }

    const handleConfigAdd = async (platform) => {
        setPlatform(platform);
        setAddonAddPopup(true);
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
                                                        navigate(-1);
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
                                                    onClick={fetchAllConfig}
                                                    type="button"
                                                    effect="ripple"
                                                    className="panelButton"
                                                >
                                                    <span className="text">Refresh</span>
                                                    <span className="icon">
                                                        <i className={`fa-solid fa-arrows-rotate ${loading ? 'fa-spin' : ''}`}></i>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 formScroller" style={{ padding: '25px 23px' }}>
                                    <div className='tableHeader justify-content-end mb-3'>
                                        <div class="searchBox position-relative">
                                            <label>Search:</label>
                                            <input type="search" name="Search" class="formItem" onChange={() => featureUnderdevelopment()} />
                                        </div>
                                    </div>
                                    <>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="product-container row">
                                                    {/* Product 2 */}
                                                    {allConfigData && allConfigData.length > 0 ?
                                                        currentAddons.map((addon, index) => {
                                                            const configuredItem = allConfigData.find(config => config.platform === addon.platform);

                                                            return (
                                                                <div className='col-3' key={index}>
                                                                    <div className='product-cart'>
                                                                        <div className="product-image">
                                                                            <img
                                                                                src={require(`../../assets/images/icons/addons/${addon.platform}.webp`)}
                                                                                onError={(e) => e.target.src = require('../../assets/images/placeholder-image.webp')}
                                                                                alt={addon.platform}
                                                                            />
                                                                        </div>
                                                                        <div className='content_width'>
                                                                            <div className="product-title mt-4">
                                                                                <p style={{ textTransform: 'capitalize' }}>
                                                                                    {addon.platform} Integration
                                                                                </p>
                                                                            </div>
                                                                            <div className="product-description">
                                                                                <span className="text-smalls">
                                                                                    Integrate {addon.platform} in our platform and use it on-the-go
                                                                                </span>
                                                                            </div>
                                                                        </div>

                                                                        {configuredItem ? (
                                                                            <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                                                <button className="checkbox_wrapper edit" onClick={() => handleConfigEdit(configuredItem.id, addon.platform)}>
                                                                                    <span className='cartSvg addonsBtn'>
                                                                                        <i className="fa-solid fa-pencil"></i>
                                                                                    </span>
                                                                                    <span>Edit</span>
                                                                                </button>
                                                                                <button className="tableButton delete" onClick={() => handleDeleteConfig(configuredItem.id)}>
                                                                                    <i className="fa-solid fa-trash"></i>
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="mt-3">
                                                                                <button className="checkbox_wrapper" onClick={() => handleConfigAdd(addon.platform)}>
                                                                                    <span className='cartSvg addonsBtn'>
                                                                                        <i className="fa-solid fa-pencil"></i>
                                                                                    </span>
                                                                                    <span>Add</span>
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
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
                    {addonEditPopup &&
                        <div className='backdropContact'>
                            <div className='addNewContactPopup'>
                                <AddonEdit platform={platform} addonEditID={addonEditID} setAddonEditPopup={setAddonEditPopup} setLoading={setLoading} fetchAllConfig={fetchAllConfig} />
                            </div>
                        </div>
                    }
                    {addonAddPopup &&
                        <div className='backdropContact'>
                            <div className='addNewContactPopup'>
                                <AddonAdd platform={platform} setAddonAddPopup={setAddonAddPopup} setLoading={setLoading} fetchAllConfig={fetchAllConfig} />
                            </div>
                        </div>
                    }
                </section>
                <ModalComponent task={'delete'} reference={'addon configuration'} />

            </main>
        </>
    )
}

export default AllAddons

export function AddonAdd({ platform, setAddonAddPopup, setLoading, fetchAllConfig }) {
    const { register, formState: { errors }, reset, handleSubmit } = useForm();

    // Handle Config Setup
    const handleFormSubmit = handleSubmit(async (data) => {
        setLoading(true);
        const payload = { ...data };
        const apiData = await generalPostFunction("/social-platforms/store", payload);
        if (apiData?.status) {
            setLoading(false);
            reset();
            toast.success(apiData.message);
            setAddonAddPopup(false);
            fetchAllConfig();
        } else {
            setLoading(false);
            toast.error(apiData.message);
        }
    });

    return (
        <div className="row">
            <div className="col-12 heading">
                <i className={`fa-brands fa-${platform}`} />
                <h5 style={{ textTransform: 'capitalize' }}>{platform} Integration</h5>
                <p>
                    Integrate {platform} in our platform and use it on-the-go
                </p>
                <div className="border-bottom col-12" />
            </div>
            <div className="col-xl-12">
                <div className="formLabel">
                    <label htmlFor="">App ID</label>
                </div>
                <div className="col-12">
                    <input
                        type="text"
                        name="extension"
                        className="formItem"
                        defaultValue={""}
                        {...register("app_id", { ...requiredValidator, })}
                    />
                    {errors.app_id && (
                        <ErrorMessage text={errors.app_id.message} />
                    )}
                </div>
            </div>
            <div className="col-xl-12 mt-3">
                <div className="formLabel">
                    <label htmlFor="">App Token</label>
                </div>
                <div className="col-12">
                    <input
                        type="text"
                        name="extension"
                        className="formItem"
                        defaultValue={""}
                        {...register("app_token", {
                            ...requiredValidator,
                        })}
                    />
                    {errors.app_token && (
                        <ErrorMessage text={errors.app_token.message} />
                    )}
                </div>
            </div>
            <div className="col-xl-6 col-12 d-none">
                <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={platform}
                    {...register("platform")}
                />
            </div>
            <div className="col-xl-12 mt-4">
                <div className="d-flex justify-content-between">
                    <button
                        type="button"
                        effect="ripple"
                        className="panelButton gray ms-0"
                        onClick={() => setAddonAddPopup(false)}
                    >
                        <span className="text">Close</span>
                        <span className="icon">
                            <i className="fa-solid fa-xmark"></i>
                        </span>
                    </button>
                    <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                        onClick={handleFormSubmit}
                    >
                        <span className="text">Save</span>
                        <span className="icon">
                            <i className="fa-solid fa-floppy-disk"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export function AddonEdit({ platform, addonEditID, setAddonEditPopup, setLoading, fetchAllConfig }) {
    const { register, formState: { errors }, reset, handleSubmit } = useForm();

    useEffect(() => {
        async function getData() {
            if (addonEditID) {
                setLoading(true);
                try {
                    const apiData = await generalGetFunction(`/social-platforms/show/${addonEditID}`)
                    if (apiData.status) {
                        const { app_id, app_token } = apiData?.data;
                        reset({ app_id, app_token });
                        setLoading(false);
                    }
                } catch (err) {
                    console.log(err);
                    setLoading(true);
                }
            }
        }
        getData()
    }, [])

    // Handle WhatsApp Config Setup
    const handleFormSubmit = handleSubmit(async (data) => {
        setLoading(true);
        const payload = { ...data };
        const apiData = await generalPutFunction(`/social-platforms/${addonEditID}`, payload);
        if (apiData?.status) {
            setLoading(false);
            toast.success(apiData.message);
            setAddonEditPopup(false);
            fetchAllConfig();
        } else {
            setLoading(false);
            toast.error(apiData.message);
        }
    });

    return (
        <div className="row">
            <div className="col-12 heading">
                <i className={`fa-brands fa-${platform}`} />
                <h5 style={{ textTransform: 'capitalize' }}>{platform} Integration</h5>
                <p>
                    Integrate {platform} in our platform and use it on-the-go
                </p>
                <div className="border-bottom col-12" />
            </div>
            <div className="col-xl-12">
                <div className="formLabel">
                    <label htmlFor="">App ID</label>
                </div>
                <div className="col-12">
                    <input
                        type="text"
                        name="extension"
                        className="formItem"
                        defaultValue={""}
                        {...register("app_id", { ...requiredValidator, })}
                    />
                    {errors.app_id && (
                        <ErrorMessage text={errors.app_id.message} />
                    )}
                </div>
            </div>
            <div className="col-xl-12 mt-3">
                <div className="formLabel">
                    <label htmlFor="">App Token</label>
                </div>
                <div className="col-12">
                    <input
                        type="text"
                        name="extension"
                        className="formItem"
                        defaultValue={""}
                        {...register("app_token", {
                            ...requiredValidator,
                        })}
                    />
                    {errors.app_token && (
                        <ErrorMessage text={errors.app_token.message} />
                    )}
                </div>
            </div>
            <div className="col-xl-6 col-12 d-none">
                <input
                    type="text"
                    name="extension"
                    className="formItem"
                    value={platform}
                    {...register("platform")}
                />
            </div>
            <div className="col-xl-12 mt-4">
                <div className="d-flex justify-content-between">
                    <button
                        type="button"
                        effect="ripple"
                        className="panelButton gray ms-0"
                        onClick={() => setAddonEditPopup(false)}
                    >
                        <span className="text">Close</span>
                        <span className="icon">
                            <i className="fa-solid fa-xmark"></i>
                        </span>
                    </button>
                    <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                        onClick={handleFormSubmit}
                    >
                        <span className="text">Save</span>
                        <span className="icon">
                            <i className="fa-solid fa-floppy-disk"></i>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}