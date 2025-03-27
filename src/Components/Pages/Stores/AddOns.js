import React from 'react'
import Header from '../../CommonComponents/Header';
import { backToTop } from '../../GlobalFunction/globalFunction';
import { Navigate } from 'react-router-dom';


function AddOns() {
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid px-0">
                    <Header title="Add Ons" />
                </div>
                <div className="col-xl-12" style={{ overflow: "auto" }}>
                    <div className="overviewTableWrapper">
                        <div className="overviewTableChild">
                            <div className="d-flex flex-wrap">
                                <div className="col-12">
                                    <div className="heading">
                                        <div className="content">
                                            <h4>AddOns</h4>
                                            <p>Edit user information and group membership.</p>
                                        </div>
                                        <div className="buttonGroup">
                                            <button
                                                onClick={() => { Navigate('-1'); backToTop() }}
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
                                                {/* Product 1 */}
                                                <div className="product-cart">
                                                    <div className="product-image">
                                                        <img
                                                            src="https://www.ringcentral.com/content/dam/rc-www/en_us/images/content/office/voip-phone/devices/Unify_CP700-png-rendition.webp"
                                                            alt="Click to Call"
                                                        // className="product-image"
                                                        />
                                                    </div>
                                                    <div className="product-title hover mt-4">
                                                        <p>
                                                            Click to Call <span className="text-smalls">(Poly CCX 700)</span>
                                                        </p>
                                                    </div>

                                                    <div className="product-description">
                                                        Make instant calls directly from the platform.
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center teext-color mb-3">
                                                        <div>
                                                            <div className="product-price me-2">$50.00</div>
                                                        </div>
                                                        <div>
                                                            <span className="borders-left-small " />
                                                        </div>
                                                        <div>
                                                            <div className="total-price-month ms-2 me-2">
                                                                <span> $29/month</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Add to Cart (Initially Hidden) */}
                                                    {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Add to cart </h4>
                                                    </div> */}

                                                    <div class="checkbox_wrapper">
                                                        <input type="checkbox" id="cbx-46" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />

                                                        <label for="cbx-46" class="cbx">
                                                            <span className='cartSvg'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" fill="currentColor" class="bi bi-cart-fill thumbs-up-solid" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>


                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart thumbs-up-regular" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>

                                                            </span>
                                                            <span>Add to Cart</span>
                                                        </label>

                                                    </div>



                                                </div>


                                                {/* Product 2 */}
                                                <div className='product-cart'>
                                                    <div className="product-image">
                                                        <img
                                                            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                                                            alt="Click to Call"
                                                        // className="product-image" 
                                                        />
                                                    </div>
                                                    <div className="product-title mt-4">
                                                        <p>
                                                            WhatsApp Integration
                                                            <span className="text-smalls"> (Messenger)</span>
                                                        </p>
                                                    </div>
                                                    <div className="product-description">
                                                        Make instant calls directly from the platform.
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center teext-color mb-3">
                                                        <div>
                                                            <div className="product-price me-2">$50.00</div>
                                                        </div>
                                                        <div>
                                                            <span className="borders-left-small " />
                                                        </div>
                                                        <div>
                                                            <div className="total-price-month ms-2 me-2">
                                                                <span> $29/month</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Add to Cart (Initially Hidden) */}
                                                    {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Add to cart </h4>
                                                    </div> */}

                                                    <div class="checkbox_wrapper">
                                                        <input type="checkbox" id="cbx-47" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />

                                                        <label for="cbx-47" class="cbx">
                                                            <span className='cartSvg'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" fill="currentColor" class="bi bi-cart-fill thumbs-up-solid" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>


                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart thumbs-up-regular" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>

                                                            </span>
                                                            <span>Add to Cart</span>
                                                        </label>

                                                    </div>



                                                </div>
                                                {/* Product 3 */}
                                                <div className='product-cart'>
                                                    <div className="product-image">
                                                        <img
                                                            src="https://cyclr.com/wp-content/uploads/2022/03/ext-477.png"
                                                            alt="Click to Call"
                                                        // className="product-image"
                                                        />
                                                    </div>
                                                    <div className="product-title  mt-4">
                                                        <p>
                                                            Messenger Integration
                                                            <span className="text-smalls"> (facebook)</span>
                                                        </p>
                                                    </div>
                                                    <div className="product-description">
                                                        Make instant calls directly from the platform.
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center teext-color mb-3">
                                                        <div>
                                                            <div className="product-price me-2">$50.00</div>
                                                        </div>
                                                        <div>
                                                            <span className="borders-left-small " />
                                                        </div>
                                                        <div>
                                                            <div className="total-price-month ms-2 me-2">
                                                                <span> $29/month</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Add to Cart (Initially Hidden) */}
                                                    {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Add to cart </h4>
                                                    </div> */}

                                                    <div class="checkbox_wrapper">
                                                        <input type="checkbox" id="cbx-48" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />

                                                        <label for="cbx-48" class="cbx">
                                                            <span className='cartSvg'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" fill="currentColor" class="bi bi-cart-fill thumbs-up-solid" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>


                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart thumbs-up-regular" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>

                                                            </span>
                                                            <span>Add to Cart</span>
                                                        </label>

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
                                                    <div className="product-title  mt-4">
                                                        <p>
                                                            Skype Integration<span className="text-smalls"> (facebook)</span>
                                                        </p>
                                                    </div>
                                                    <div className="product-description">
                                                        Make instant calls directly from the platform.
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center teext-color mb-3">
                                                        <div>
                                                            <div className="product-price me-2">$50.00</div>
                                                        </div>
                                                        <div>
                                                            <span className="borders-left-small " />
                                                        </div>
                                                        <div>
                                                            <div className="total-price-month ms-2 me-2">
                                                                <span> $29/month</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Add to Cart (Initially Hidden) */}
                                                    {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Add to cart </h4>
                                                    </div> */}
                                                    <div class="checkbox_wrapper">
                                                        <input type="checkbox" id="cbx-49" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />

                                                        <label for="cbx-49" class="cbx">
                                                            <span className='cartSvg'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" fill="currentColor" class="bi bi-cart-fill thumbs-up-solid" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart thumbs-up-regular" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>
                                                            </span>
                                                            <span>Add to Cart</span>
                                                        </label>
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
                                                    <div className="product-title  mt-4">
                                                        <p>
                                                            Team Collaboration
                                                            <span className="text-smalls"> (facebook)</span>
                                                        </p>
                                                    </div>
                                                    <div className="product-description">
                                                        Make instant calls directly from the platform.
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center teext-color mb-3">
                                                        <div>
                                                            <div className="product-price me-2">$50.00</div>
                                                        </div>
                                                        <div>
                                                            <span className="borders-left-small " />
                                                        </div>
                                                        <div>
                                                            <div className="total-price-month ms-2 me-2">
                                                                <span> $29/month</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Add to Cart (Initially Hidden) */}
                                                    {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Add to cart </h4>
                                                    </div> */}
                                                    <div class="checkbox_wrapper">
                                                        <input type="checkbox" id="cbx-50" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />

                                                        <label for="cbx-50" class="cbx">
                                                            <span className='cartSvg'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" fill="currentColor" class="bi bi-cart-fill thumbs-up-solid" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>


                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart thumbs-up-regular" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>

                                                            </span>
                                                            <span>Add to Cart</span>
                                                        </label>

                                                    </div>

                                                </div>
                                                {/* Product 6 */}
                                                <div className='product-cart'>
                                                    <div className="product-image">
                                                        <img
                                                            src="https://www.koolmetrix.gr/wp-content/uploads/2019/05/rtanalytics.png"
                                                            alt="Click to Call"
                                                        // className="product-image"
                                                        />
                                                    </div>

                                                    <div className="product-title  mt-4">
                                                        <p>
                                                            Real-Time Reporting
                                                            <span className="text-smalls"> (facebook)</span>
                                                        </p>
                                                    </div>
                                                    <div className="product-description">
                                                        Make instant calls directly from the platform.
                                                    </div>
                                                    <div className="d-flex align-items-center justify-content-center teext-color mb-3">
                                                        <div>
                                                            <div className="product-price me-2">$50.00</div>
                                                        </div>
                                                        <div>
                                                            <span className="borders-left-small " />
                                                        </div>
                                                        <div>
                                                            <div className="total-price-month ms-2 me-2">
                                                                <span> $29/month</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Add to Cart (Initially Hidden) */}
                                                    {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Add to cart </h4>
                                                    </div> */}
                                                    <div class="checkbox_wrapper">
                                                        <input type="checkbox" id="cbx-51" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />

                                                        <label for="cbx-51" class="cbx">
                                                            <span className='cartSvg'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" fill="currentColor" class="bi bi-cart-fill thumbs-up-solid" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>


                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart thumbs-up-regular" viewBox="0 0 16 16">
                                                                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                                </svg>

                                                            </span>
                                                            <span>Add to Cart</span>
                                                        </label>

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
                {/* {popUp ? (
<div className="popup">
<div className="container h-100">
  <div className="row h-100 justify-content-center align-items-center">
    <div className="row content col-xl-4">
      <div className="col-2 px-0">
        <div className="iconWrapper">
          <i className="fa-duotone fa-triangle-exclamation"></i>
        </div>
      </div>
      <div className="col-10 ps-0">
        <h4>Warning!</h4>
        <p>
          No Extension is currently asigned! Please add an
          extension first!
        </p>
        <button
          className="panelButton m-0"
          onClick={() => {
            // setForce(true);
            setPopUp(false);
            navigate("/extensions-add");
          }}
        >
          Lets Go!
        </button>
        <button
          className="panelButtonWhite m-0 float-end"
          onClick={() => setPopUp(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>
</div>
) : (
""
)} */}
            </section>

            {/* <ToastContainer
position="bottom-right"
autoClose={false}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/> */}
        </main>
    )
}

export default AddOns