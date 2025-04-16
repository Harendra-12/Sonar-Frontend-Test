import React, { useEffect, useState } from 'react'
import { featureUnderdevelopment, generalGetFunction, generalPostFunction } from '../../GlobalFunction/globalFunction';
import EmptyPrompt from '../../Loader/EmptyPrompt';
import { useSelector } from 'react-redux';
import RechargeWalletPopup from '../Billing/RechargeWalletPopup';
import { toast } from 'react-toastify';

function SocialMediaStore() {
    const [loading, setLoading] = useState(false);
    const [allAddons, setAllAddons] = useState([]);
    const [selectedAddon, setSelectedAddon] = useState({});
    const accountBalance = useSelector((state) => state.accountBalance);
    const account = useSelector((state) => state.account);
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [purchasePopup, setPurchasePopup] = useState(false);
    const [rechargePopUp, setRechargePopUp] = useState(false);
    const [addonBuyPopup, setAddonBuyPopup] = useState(false);

    // Get All Addons
    const fetchAllAddons = async () => {
        setLoading(true);
        const response = await generalGetFunction('/addon/all');
        if (response.status) {
            setLoading(false);
            setAllAddons(response.data);
        }
    }

    useEffect(() => {
        fetchAllAddons();
    }, [])

    // Handle callBack for buying pop up
    function handleRechargePopup(value) {
        setRechargePopUp(value);
    }

    // Handle callBack for buying pop up
    function handleBuyPopUp(value) {
        setAddonBuyPopup(value);
    }

    // Handle Addon Purchase
    async function handlePayment() {
        setPurchasePopup(false);
        if (paymentMethod === "wallet") {
            const parsedData = {
                account_id: account.account_id,
                addon_id: selectedAddon.id,
                type: "wallet",
            };
            if (
                Number(accountBalance) <
                (parseFloat(selectedAddon.price) - parseFloat(selectedAddon.discount || 0)).toFixed(2)
            ) {
                toast.error("Wallet balance is low");
            } else {
                setLoading(true);
                setPurchasePopup(false);
                const apiData = await generalPostFunction("/addon/buy", parsedData);
                if (apiData.status) {
                    setLoading(false);
                    toast.success(apiData.message);
                    setSelectedAddon();
                } else {
                    setLoading(false);
                    toast.error(apiData.errors);
                }
            }
        } else {
            setAddonBuyPopup(true);
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="product-container row gy-3">
                        {/* Product 1 */}
                        {allAddons && allAddons.length > 0 ?
                            allAddons.map((item, index) => (
                                <div className='col-3'>
                                    <div className="product-cart">
                                        <div className="product-image">
                                            <img
                                                src={require(`../../assets/images/icons/addons/${item.name.toLowerCase()}.webp`)}
                                                alt="Click to Call"
                                            />
                                        </div>
                                        <div className="product-title hover mt-4">
                                            <p>
                                                {item.name}
                                            </p>
                                        </div>

                                        <div className="product-description">
                                            {item.tag_line}
                                        </div>
                                        <div className="d-flex align-items-center justify-content-center teext-color mb-3">
                                            <div>
                                                <span class="old_price">${parseFloat(item.price)}</span><span className="product-price me-2">${(parseFloat(item.price) - parseFloat(item.discount || 0)).toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="borders-left-small " />
                                            </div>
                                            <div>
                                                <div className="total-price-month ms-2 me-2">
                                                    <span>{item.billing_type}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="checkbox_wrapper" onClick={() => setSelectedAddon(item)}>
                                            <span className='cartSvg'>
                                                <i class="fa-solid fa-cart-shopping"></i>
                                            </span>
                                            <span>Buy Now</span>
                                        </button>
                                    </div>
                                </div>
                            )) :
                            <>
                                {loading ?
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
                                    </> :
                                    <EmptyPrompt generic={true} />
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
            {selectedAddon && Object.keys(selectedAddon).length > 0 &&
                <div className='backdropContact'>
                    <div className="addNewContactPopup">
                        <div className="row">
                            <div className="col-12 heading border-bottom-0 mb-0">
                                <i className="fa-light fa-user-plus mx-auto"></i>
                                <h5>Purchase Number</h5>
                                <p>
                                    You are about to purchase the selected number
                                </p>
                                <div className="border-bottom col-12" />
                            </div>

                            <div>
                                <div className="heading mb-2 px-0 py-1 bg-transparent border-bottom-0">
                                    <h5 className='mb-0'>Order Summary</h5>
                                </div>
                                <div className='d-flex justify-content-between border border-light-subtle rounded-3 p-2 mb-2'>
                                    <div className='d-flex justify-content-start align-items-center gap-2'>
                                        <div className='product_imgAdonsPopup'>
                                            <img
                                                src={require(`../../assets/images/icons/addons/${selectedAddon.name.toLowerCase()}.webp`)}
                                                alt="Click to Call"
                                            />
                                        </div>
                                        <div className='product_details'>
                                            <p className='mb-0 text-black fw-semibold'> {selectedAddon.name}</p>
                                            <p style={{ fontSize: 11 }} className='ellipsisText text-muted mb-0'>{selectedAddon.description}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="float-end text-black fw-medium">${(parseFloat(selectedAddon.price) - parseFloat(selectedAddon.discount || 0)).toFixed(2)}</span><br />

                                        <span class="old_price">${parseFloat(selectedAddon.price)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="heading mb-2 px-0 py-1 bg-transparent border-bottom-0">
                                <h5 className='mb-0'>Payment Method</h5>
                            </div>
                            <div className='getPopup checkout'>
                                <div className="wrapper ">
                                    <ul className='d-flex justify-content-start flex-column border border-light-subtle rounded-3 p-2'>
                                        <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                                            <li className="my-0 col mb-0 position-relative">
                                                <i
                                                    className="fa-duotone fa-wallet me-2"
                                                    style={{ color: "var(--ui-accent)" }}
                                                ></i>{" "}
                                                Wallet{" "}
                                                <span style={{ float: 'inline-end', fontSize: '14px' }}>${accountBalance}</span>
                                                <input
                                                    type="radio"
                                                    checked={
                                                        paymentMethod === "wallet" ? true : false
                                                    }
                                                    name="fav_language"
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setPaymentMethod("wallet");
                                                        }
                                                    }}
                                                ></input>{" "}
                                                <span className="checkmark"></span>
                                            </li>
                                            {Number((parseFloat(selectedAddon.price) - parseFloat(selectedAddon.discount || 0)).toFixed(2)) > Number(accountBalance) ? <div className="col-auto">
                                                <button className="tableButton edit" onClick={() => setRechargePopUp(true)}>
                                                    <i className="fa-solid fa-dollar-sign" />
                                                </button>
                                            </div> : ""
                                            }

                                        </div>
                                        <li className='my-0 w-100 position-relative'>
                                            <i
                                                className="fa-duotone fa-credit-card me-2"
                                                style={{ color: "var(--ui-accent)" }}
                                            ></i>{" "}
                                            Credit Card{" "}
                                            <input
                                                type="radio"
                                                checked={paymentMethod === "card" ? true : false}
                                                name="fav_language"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setPaymentMethod("card");
                                                    }
                                                }}
                                            ></input>{" "}
                                            <span className="checkmark"></span>
                                        </li>
                                    </ul>

                                </div>
                            </div>

                            <div className="col-xl-12 mt-4">
                                <div className="d-flex justify-content-between">
                                    <button
                                        className="panelButton gray ms-0"
                                        onClick={() => setSelectedAddon(null)}
                                    >
                                        <span className="text">Close</span>
                                        <span className="icon">
                                            <i className="fa-solid fa-caret-left"></i>
                                        </span>
                                    </button>
                                    <button
                                        className="panelButton"
                                        onClick={() => setPurchasePopup(true)}
                                    >
                                        <span className="text">Pay</span>
                                        <span className="icon">
                                            <i className="fa-solid fa-dollar-sign"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                rechargePopUp ? (
                    <div className="popup">
                        <div className="container h-100">
                            <div className="row h-100 justify-content-center align-items-center">
                                <RechargeWalletPopup
                                    closePopup={handleRechargePopup}
                                    rechargeType={"rechargeWallet"}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )
            }
            {
                addonBuyPopup ? (
                    <div className="popup">
                        <div className="container h-100">
                            <div className="row h-100 justify-content-center align-items-center">
                                <RechargeWalletPopup
                                    closePopup={handleBuyPopUp}
                                    rechargeType={"purchaseAddon"}
                                    selectedAddon={selectedAddon}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )
            }
            {
                purchasePopup ? (
                    <div className="popup">
                        <div className="container h-100">
                            <div className="row h-100 justify-content-center align-items-center">
                                <div className="row content col-xl-4 col-lg-5 col-md-5">
                                    <div className="col-2 px-0">
                                        <div className="iconWrapper">
                                            <i className="fa-duotone fa-triangle-exclamation"></i>
                                        </div>
                                    </div>
                                    <div className="col-10 ps-0">
                                        <h4>Warning!</h4>
                                        <p>
                                            Are you sure you want to purchase this addon?
                                        </p>
                                        <div className="mt-2 d-flex justify-content-between">
                                            <button
                                                className="panelButton m-0 float-end"
                                                onClick={() => featureUnderdevelopment()}
                                            >
                                                <span className="text">Confirm</span>
                                                <span className="icon"><i className="fa-solid fa-check" /></span>
                                            </button>
                                            <button
                                                className="panelButton gray m-0 float-end"
                                                onClick={() => {
                                                    setPurchasePopup(false);
                                                }}
                                            >
                                                <span className="text">Cancel</span>
                                                <span className="icon"><i className="fa-solid fa-xmark" /></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )
            }
        </>
    )
}

export default SocialMediaStore