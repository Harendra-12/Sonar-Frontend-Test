import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { useNavigate } from 'react-router-dom';
import PromptFunctionPopup from '../../CommonComponents/PromptFunctionPopup';
import { generalDeleteFunction, generalGetFunction } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';

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
                                                <h4> All AddOns</h4>
                                                <p>Edit user information and group membership.</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    // onClick={() => { Navigate('-1'); backToTop() }}
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
                                                <div className="product-container">
                                                    {/* Product 2 */}
                                                    {allConfigData && allConfigData.length > 0 ?
                                                        allConfigData.map((item, index) => {
                                                            return (
                                                                <div className='product-cart active'>
                                                                    <div className="product-image">
                                                                        <img
                                                                            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                                                            alt={item.platform}
                                                                        />
                                                                    </div>
                                                                    <div className='content_width'>
                                                                        <div className="product-title mt-4">
                                                                            <p style={{ textTransform: 'capitalize' }}>
                                                                                {item.platform} Integration
                                                                                <span className="text-smalls">Integrate {item.platform} in our platform and use it on-the-go</span>
                                                                            </p>
                                                                        </div>
                                                                        <div className="product-description">
                                                                            Make instant calls directly from the platform.
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex align-items-center justify-content-center mt-3 gap-2">
                                                                        <div class="checkbox_wrapper edit">
                                                                            <input type="checkbox" id="cbx-46" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />
                                                                            <label for="cbx-46" class="cbx">
                                                                                <span className='cartSvg addonsBtn'>
                                                                                    <i class="fa-solid fa-pencil"></i>
                                                                                </span>
                                                                                <span>Edit</span>
                                                                            </label>
                                                                        </div>
                                                                        <button className="tableButton delete"
                                                                        //  onClick={() => { setDeleteId(item.id); setPopu(true);
                                                                        //      setStatus(""); setSelectDeviceEdit(false) }}
                                                                        ><i className="fa-solid fa-trash"></i></button>
                                                                    </div>



                                                                </div>
                                                            )
                                                        }) : (
                                                            <div>
                                                                Loading
                                                            </div>
                                                        )
                                                    }

                                                    {/* Product 3 */}
                                                    <div className='product-cart'>
                                                        <div className="product-image">
                                                            <img
                                                                src="https://cyclr.com/wp-content/uploads/2022/03/ext-477.png"
                                                                alt="Click to Call"
                                                            // className="product-image"
                                                            />
                                                        </div>
                                                        <div className='content_width'>
                                                            <div className="product-title  mt-4">
                                                                <p>
                                                                    Messenger Integration
                                                                    <span className="text-smalls"> (facebook)</span>
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
                                                            <button className="tableButton delete"
                                                            //  onClick={() => { setDeleteId(item.id); setPopu(true);
                                                            //      setStatus(""); setSelectDeviceEdit(false) }}
                                                            ><i className="fa-solid fa-trash"></i></button>
                                                        </div>

                                                    </div>
                                                    {/* Product 4 */}
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

                                                    </div>
                                                    {/* Product 5 */}
                                                    <div className='product-cart'>
                                                        <div className="product-image">
                                                            <img
                                                                src="https://5.imimg.com/data5/SELLER/Default/2023/6/318550307/WD/YP/AO/6017711/teamviewer-software-solution-500x500.png"
                                                                alt="Click to Call"
                                                            // className="product-image"
                                                            />
                                                        </div>
                                                        <div className='content_width'>
                                                            <div className="product-title  mt-4">
                                                                <p>
                                                                    Team Collaboration
                                                                    <span className="text-smalls"> (facebook)</span>
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
                                                            <button className="tableButton delete"
                                                            //  onClick={() => { setDeleteId(item.id); setPopu(true);
                                                            //      setStatus(""); setSelectDeviceEdit(false) }}
                                                            ><i className="fa-solid fa-trash"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="offcanvas offcanvas-end offcanvas-custom"
                                            tabIndex={-1}
                                            id="offcanvasRight"
                                            aria-labelledby="offcanvasRightLabel"
                                        >
                                            <div className="offcanvas-header">
                                                <h5 className="offcanvas-title text-white fs-4" id="offcanvasRightLabel">
                                                    Click to call
                                                </h5>
                                                <button
                                                    type="button"
                                                    className="btn-close offcanvas_close"
                                                    data-bs-dismiss="offcanvas"
                                                    aria-label="Close" />
                                            </div>
                                            <div className="offcanvas-body">
                                                <div className="offcanvas-sider">
                                                    <div>
                                                        <img
                                                            src="https://www.ringcentral.com/content/dam/rc-www/en_us/images/content/office/voip-phone/devices/Unify_CP700-png-rendition.webp"
                                                            alt="" />
                                                    </div>
                                                </div>
                                                <div className="paragrap">
                                                    <div className="offcanvas-text-side">
                                                        <div className='d-flex align-items-center justify-content-between'>
                                                            <div>
                                                                <p className=' m-0 p-0 fs-5  fw-semibold'> Click to Call <span className="text-font-small"> (Poly CCX 700)</span></p>
                                                                <div className="test-number m-0 p-0">
                                                                    <p className="">$50.00 <span>$29/month</span></p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    effect="ripple"
                                                                    className="panelButton" >
                                                                    <span className="text fs-6">Buy</span>
                                                                    <span className="icon">
                                                                        <i className="fa-solid fa-cart-shopping"></i>
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="para-hading">
                                                        <h4 className='mb-3 '>
                                                            Description
                                                        </h4>
                                                        <p>
                                                            The Unify CP700 brings expanded interoperability, the power of
                                                            simplicity, as well as the high-quality audio you expect.
                                                        </p>
                                                    </div>
                                                    <div className="canvas_list">
                                                        <ul>
                                                            <li> Color graphical display, 6 line TFT (800*480 pixel), 5’’</li>
                                                            <li>
                                                                Notification LED (green, amber, red), visible from front and
                                                                behind
                                                            </li>
                                                            <li>
                                                                6 permanent free programmable and 6 free programmable favorites
                                                                with LED
                                                            </li>
                                                            <li>5-way navigation key</li>
                                                            <li>
                                                                7 fixed function keys: menu, presence, voicemail, hold, transfer,
                                                                conference, and redial
                                                            </li>
                                                        </ul>
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


            </main>
        </>
    )
}

export default AllAddons