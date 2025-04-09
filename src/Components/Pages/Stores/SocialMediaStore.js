import React from 'react'

function SocialMediaStore() {
    return (
        <div className="row">
            <div className="col-md-12">
                <div className="product-container row gy-3">
                    {/* Product 1 */}
                    <div className='col-3'>
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

                            {/* Buy Now (Initially Hidden) */}
                            {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Buy Now </h4>
                                                    </div> */}

                            <div class="checkbox_wrapper">
                                <input type="checkbox" id="cbx-46" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />

                                <label for="cbx-46" class="cbx">
                                    <span className='cartSvg'>
                                        <i class="fa-solid fa-cart-shopping"></i>
                                    </span>
                                    <span>Buy Now</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Product 2 */}
                    <div className='col-3'>
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

                            {/* Buy Now (Initially Hidden) */}
                            {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Buy Now </h4>
                                                    </div> */}

                            <div class="checkbox_wrapper">
                                <input type="checkbox" id="cbx-47" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />

                                <label for="cbx-47" class="cbx">
                                    <span className='cartSvg'>
                                        <i class="fa-solid fa-cart-shopping"></i>
                                    </span>
                                    <span>Buy Now</span>
                                </label>

                            </div>



                        </div>
                    </div>
                    {/* Product 3 */}
                    <div className='col-3'>
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

                            {/* Buy Now (Initially Hidden) */}
                            {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Buy Now </h4>
                                                    </div> */}

                            <div class="checkbox_wrapper">
                                <input type="checkbox" id="cbx-48" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />

                                <label for="cbx-48" class="cbx">
                                    <span className='cartSvg'>
                                        <i class="fa-solid fa-cart-shopping"></i>
                                    </span>
                                    <span>Buy Now</span>
                                </label>
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

                            {/* Buy Now (Initially Hidden) */}
                            {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Buy Now </h4>
                                                    </div> */}
                            <div class="checkbox_wrapper">
                                <input type="checkbox" id="cbx-49" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />
                                <label for="cbx-49" class="cbx">
                                    <span className='cartSvg'>
                                        <i class="fa-solid fa-cart-shopping"></i>
                                    </span>
                                    <span>Buy Now</span>
                                </label>
                            </div>

                        </div>
                    </div>
                    {/* Product 5 */}
                    <div className='col-3'>
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

                            {/* Buy Now (Initially Hidden) */}
                            {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Buy Now </h4>
                                                    </div> */}
                            <div class="checkbox_wrapper">
                                <input type="checkbox" id="cbx-50" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />
                                <label for="cbx-50" class="cbx">
                                    <span className='cartSvg'>
                                        <i class="fa-solid fa-cart-shopping"></i>
                                    </span>
                                    <span>Buy Now</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Product 6 */}
                    <div className='col-3'>
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

                            {/* Buy Now (Initially Hidden) */}
                            {/* <div className="add-to-cart-container">
                                                        <div data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                                            <input className="checkbox" type="checkbox" />
                                                        </div>
                                                        <h4 className='mb-0 p-1'> Buy Now </h4>
                                                    </div> */}
                            <div class="checkbox_wrapper">
                                <input type="checkbox" id="cbx-51" class="inp-cbx" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" />
                                <label for="cbx-51" class="cbx">
                                    <span className='cartSvg'>
                                        <i class="fa-solid fa-cart-shopping"></i>
                                    </span>
                                    <span>Buy Now</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SocialMediaStore