import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import '../../assets/css/components/getDid.css'
import { backToTop, generalGetFunction, generalPostFunction } from '../../GlobalFunction/globalFunction';
import CircularLoader from '../../Loader/CircularLoader';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ErrorMessage from '../../CommonComponents/ErrorMessage';
import { lengthValidator, noSpecialCharactersValidator, requiredValidator, restrictToNumbers } from '../../validations/validation';
import Tippy from '@tippyjs/react';
import EmptyPrompt from '../../Loader/EmptyPrompt';
import { toast } from 'react-toastify';
import RechargeWalletPopup from '../Billing/RechargeWalletPopup';

const NewGetDid = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const account = useSelector((state) => state.account);
    const accountDetails = useSelector((state) => state.accountDetails);
    const accountDetailsRefresh = useSelector((state) => state.accountDetailsRefresh);
    const accountBalance = useSelector((state) => state.accountBalance);


    const [countryCode, setCountryCode] = useState();
    const [loading, setLoading] = useState();
    const [did, setDid] = useState();
    const [selectedDid, setSelectedDid] = useState();
    const [didBuyPopUP, setDidBuyPopUp] = useState(false);
    const [rechargePopUp, setRechargePopUp] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("wallet");

    const [selectedUsage, setSelectedUsage] = useState([
        {
            label: "Voice",
            value: "voice",
        },
    ]);
    const option = [
        {
            label: "Voice",
            value: "voice",
        },
        {
            label: "Text",
            value: "text",
        },
        {
            label: "Fax",
            value: "fax",
        },
        {
            label: "Emergency",
            value: "emergency",
        },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        reset
    } = useForm();

    useEffect(() => {
        fetchAllCountry();
    }, [])

    // Fetch all countries
    const fetchAllCountry = async () => {
        setLoading(true);
        if (!countryCode) {
            try {
                const apiData = await generalGetFunction("/available-countries");
                if (apiData?.status) {
                    setCountryCode(apiData.data);
                    setLoading(false);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    // Handle All Country Call & Basic API Call @ Page Start
    const searchInitApiCall = () => {
        setValue('searchType', "tollfree");
        setValue('quantity', 10);
        setValue('searchBy', "npa");
    }

    useEffect(() => {
        searchInitApiCall();

        const timer = setTimeout(() => {
            if (watch().country) {
                handleSubmit(onSubmit)();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, [watch().country])

    // Handle TFN search
    const onSubmit = async (data) => {
        setLoading(true);
        const usagePayload = option.reduce((acc, curr) => {
            acc[curr.label] = 0;
            return acc;
        }, {});

        selectedUsage.forEach((item) => {
            usagePayload[item.label] = 1;
        });

        const parsedData = {
            ...data,
            // searchType: data.searchType,
            // quantity: data.quantity,
            // npa: data.npa,
            companyId: account.account_id,
            usage: usagePayload,
        };
        const apiData = await generalPostFunction("/search-number", parsedData);
        setLoading(false);
        if (apiData?.status) {
            setDid(apiData.data);
        } else {
            setDid([]);
            // toast.error(apiData.message)
        }
    };

    // LOGIC TO HANDLE CHECKBOXES
    const handleChangeUsage = (e) => {
        const nonRemovable = { label: "Voice", value: "voice" };
        const { name, checked } = e.target;
        const updatedValue = { label: name, value: name.toLowerCase() }

        setSelectedUsage((prev) => {
            let newSelection = prev.filter((item) => item.value != updatedValue.value);
            if (checked) {
                newSelection = [...newSelection, updatedValue]
            }
            return [nonRemovable, ...newSelection.filter((item) => item.value !== "voice")];
        })
    };

    // Handle payment
    async function handlePayment() {
        setPopUp(false);
        if (paymentMethod === "wallet") {
            const parsedData = {
                companyId: account.account_id,
                // vendorId: selectedDid[0].vendorId,
                didQty: selectedDid.length,
                type: "wallet",
                didType: "random",
                // rate: Number(selectedDid[0].price) * selectedDid.length,
                accountId: selectedDid.find((item) => (item.vendorAccountId))?.vendorAccountId,
                dids: selectedDid.map((item) => {
                    return {
                        did: !item.id ? item.phone_number : item.id,
                        vendorId: item.vendorId
                    }
                }),
            };
            if (
                Number(accountDetails?.balance?.amount) <
                // Number(selectedDid[0].price) * selectedDid.length
                Number(selectedDid.price)
            ) {
                toast.error("Wallet balance is low");
            } else {
                setLoading(true);
                setPopUp(false);
                const apiData = await generalPostFunction("/purchaseTfn", parsedData);
                if (apiData.status) {
                    setLoading(false);
                    toast.success(apiData.message);
                    // dispatch({
                    //   type: "SET_NEWADDDID",
                    //   newAddDid: apiData.data,2
                    // });
                    dispatch({
                        type: "SET_ACCOUNTDETAILSREFRESH",
                        accountDetailsRefresh: accountDetailsRefresh + 1,
                    });
                    setDid();
                    setSelectedDid([]);
                    navigate("/did-listing");

                } else {
                    setLoading(false);
                    // const errorMessage = Object.keys(apiData.errors);
                    // toast.error(apiData.errors[errorMessage[0]][0]);
                    toast.error(apiData.errors);
                }
            }
        } else {
            setDidBuyPopUp(true);
        }
    }

    // Handle callBack for buying pop up
    function handleBuyPopUp(value) {
        setDidBuyPopUp(value);
    }

    // Handle callBack for buying pop up
    function handleRechargePopup(value) {
        setRechargePopUp(value);
    }

    return (
        <>
            {loading && <CircularLoader />}
            <main className='mainContent'>
                <section >
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <Header title="DID Management" />
                        </div>
                        <div className='card mt-4 shadow-sm border-0'>
                            <div className="heading card-header d-flex justify-content-between align-items-center gap-2 bg-transparent border-light-subtle">
                                <div className="content">
                                    <h4>Buy A Number</h4>
                                    <p className='mb-0'>You can purchase a DID here</p>
                                </div>
                                <div className="buttonGroup">
                                    <button
                                        effect="ripple"
                                        className="panelButton gray"
                                        onClick={() => {
                                            watch().country ? reset({ country: "" }) :
                                                navigate(-1);
                                            backToTop();
                                        }}
                                    >
                                        <span className="text">Back</span>
                                        <span className="icon">
                                            <i className="fa-solid fa-caret-left"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className='card-body'>
                                {watch().country ? (
                                    <>
                                        <form onSubmit={handleSubmit(onSubmit)} className={`mb-0 row`}>
                                            <div className="formRow col-1">
                                                <div className="formLabel">
                                                    <label htmlFor="searchType">Search Type</label>
                                                </div>
                                                <div className="col-12">
                                                    <select
                                                        name="searchType"
                                                        className={`formItem ${errors.searchType ? "error" : ""
                                                            }`}
                                                        {...register("searchType", {
                                                            ...requiredValidator,
                                                        })}
                                                        defaultValue={"tollfree"}
                                                    >
                                                        <option value="tollfree">Toll free</option>
                                                        <option value="domestic">Domestic</option>
                                                    </select>
                                                    {errors.searchType && (
                                                        <ErrorMessage text={errors.searchType.message} />
                                                    )}
                                                    <label htmlFor="data" className="formItemDesc text-start">
                                                        Select the type of DID
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={`formRow col-1`}>
                                                <div
                                                    className="formLabel d-flex justify-content-between"
                                                    style={{ width: "100%" }}
                                                >
                                                    <label htmlFor="quantity">Quantity</label>
                                                    {errors.quantity && (
                                                        <ErrorMessage text={errors.quantity.message} />
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <input
                                                        type="number"
                                                        name="quantity"
                                                        className={`formItem ${errors.quantity ? "error" : ""
                                                            }`}
                                                        {...register("quantity", {
                                                            ...requiredValidator,
                                                            ...lengthValidator(1, 10),
                                                            ...noSpecialCharactersValidator,
                                                        })}
                                                        onKeyDown={restrictToNumbers}
                                                        style={{ color: 'transparent' }}
                                                        onFocus={(e) => e.target.style.color = 'var(--form-input-text)'}
                                                    />
                                                    <label htmlFor="data" className="formItemDesc text-start">
                                                        Input the quantity
                                                    </label>
                                                </div>
                                            </div>
                                            <div className={`formRow`} style={{ width: '335px' }}>
                                                <div className="formLabel">
                                                    <label htmlFor="">Usage</label>
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-flex justify-content-between flex-wrap">
                                                        <div className="checkbox-wrapper-4">
                                                            <input className="inp-cbx" id="Voice" name="Voice" type="checkbox" defaultChecked={true} onChange={handleChangeUsage} disabled={true} />
                                                            <label className="cbx" for="Voice">
                                                                <span>
                                                                    <svg width="12px" height="10px">
                                                                    </svg>
                                                                </span>
                                                                <span className="checkBoxLabel">Voice</span>
                                                            </label>
                                                            <svg className="inline-svg">
                                                                <symbol id="check-4" viewBox="0 0 12 10">
                                                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                                                </symbol>
                                                            </svg>
                                                        </div>
                                                        <div className="checkbox-wrapper-4">
                                                            <input className="inp-cbx" id="Text" name="Text" type="checkbox" onChange={handleChangeUsage} />
                                                            <label className="cbx" for="Text">
                                                                <span>
                                                                    <svg width="12px" height="10px">
                                                                    </svg>
                                                                </span>
                                                                <span className="checkBoxLabel">Text</span>
                                                            </label>
                                                            <svg className="inline-svg">
                                                                <symbol id="check-4" viewBox="0 0 12 10">
                                                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                                                </symbol>
                                                            </svg>
                                                        </div>
                                                        <div className="checkbox-wrapper-4">
                                                            <input className="inp-cbx" id="Fax" name="Fax" type="checkbox" onChange={handleChangeUsage} />
                                                            <label className="cbx" for="Fax">
                                                                <span>
                                                                    <svg width="12px" height="10px">
                                                                    </svg>
                                                                </span>
                                                                <span className="checkBoxLabel">Fax</span>
                                                            </label>
                                                            <svg className="inline-svg">
                                                                <symbol id="check-4" viewBox="0 0 12 10">
                                                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                                                </symbol>
                                                            </svg>
                                                        </div>
                                                        <div className="checkbox-wrapper-4">
                                                            <input className="inp-cbx" id="Emergency" name="Emergency" type="checkbox" onChange={handleChangeUsage} />
                                                            <label className="cbx" for="Emergency">
                                                                <span>
                                                                    <svg width="12px" height="10px">
                                                                    </svg>
                                                                </span>
                                                                <span className="checkBoxLabel">Emergency</span>
                                                            </label>
                                                            <svg className="inline-svg">
                                                                <symbol id="check-4" viewBox="0 0 12 10">
                                                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                                                                </symbol>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <label htmlFor="data" className="formItemDesc text-start">
                                                        Set how the Destination will be used
                                                    </label>
                                                </div>
                                            </div>
                                            {
                                                watch().searchType === "domestic" ? <>
                                                    <div className={`formRow col-2`}>
                                                        <div className="formLabel">
                                                            <label htmlFor="searchBy">Search By</label>
                                                        </div>
                                                        <div className="col-12">
                                                            <select
                                                                name="searchBy"
                                                                className={`formItem ${errors.searchBy ? "error" : ""
                                                                    }`}
                                                                {...register("searchBy", {
                                                                    ...requiredValidator,
                                                                })}
                                                                defaultValue={"npa"}
                                                            >
                                                                <option value="npa">First 3 Digit (Area Code)</option>
                                                                <option value="npanxx">First 6 Digits (Area + Exchange Code)</option>
                                                                <option value="ratecenter">Rate Center</option>
                                                            </select>
                                                            {errors.searchBy && (
                                                                <ErrorMessage text={errors.searchBy.message} />
                                                            )}
                                                            <label htmlFor="data" className="formItemDesc text-start">
                                                                Select the type of domestic DID
                                                            </label>
                                                        </div>
                                                    </div>
                                                </> : ""
                                            }
                                            {
                                                (watch().searchBy === "npa" || watch().searchBy === "npanxx" || watch().searchType === "tollfree" || !watch().searchBy) && <>
                                                    <div className={`formRow col-1`}>
                                                        <div className="col-12">
                                                            <div
                                                                className="formLabel"
                                                                style={{ maxWidth: "100%" }}
                                                            >
                                                                <label htmlFor="npa">First 3 Digits</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <input
                                                                type="number"
                                                                name="npa"
                                                                className={`formItem ${errors.npa ? "error" : ""}`}
                                                                {...register("npa", {
                                                                    ...(watch("searchBy") === "npanxx" ? requiredValidator : {}),
                                                                    ...lengthValidator(3, 3),
                                                                    ...noSpecialCharactersValidator,
                                                                })}
                                                            />
                                                            <label htmlFor="data" className="formItemDesc text-start">
                                                                {/* Input the first 3 digits (NPA - Area Code) of the DID */}
                                                            </label>
                                                            {errors.npa && (
                                                                <ErrorMessage text={errors.npa.message} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            }

                                            {
                                                (watch().searchBy === "npanxx" && watch().searchType === "domestic") && <>
                                                    <div className={`formRow col-1`}>
                                                        <div className="col-12">
                                                            <div
                                                                className="formLabel"
                                                                style={{ maxWidth: "100%" }}
                                                            >
                                                                <label htmlFor="nxx">Next 3 Digits</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <input
                                                                type="number"
                                                                name="nxx"
                                                                className={`formItem ${errors.nxx ? "error" : ""}`}
                                                                {...register("nxx", {
                                                                    ...requiredValidator,
                                                                    ...lengthValidator(3, 3),
                                                                    ...noSpecialCharactersValidator,
                                                                })}
                                                            />
                                                            <label htmlFor="data" className="formItemDesc text-start">
                                                                {/* Input the next 3 digits (NXX - Exchange Code) of a DID */}
                                                            </label>
                                                            {errors.nxx && (
                                                                <ErrorMessage text={errors.nxx.message} />
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            }

                                            {
                                                (watch().searchBy === "ratecenter" && watch().searchType === "domestic") && <>
                                                    <div className={`formRow col-1`}>
                                                        <div
                                                            className="formLabel d-flex justify-content-between"
                                                            style={{ width: "100%" }}
                                                        >
                                                            <label htmlFor="rateCenter">Rate Center</label>
                                                            {errors.rateCenter && (
                                                                <ErrorMessage text={errors.rateCenter.message} />
                                                            )}
                                                        </div>
                                                        <div className="col-12">
                                                            <input
                                                                type="string"
                                                                name="rateCenter"
                                                                className={`formItem ${errors.rateCenter ? "error" : ""}`}
                                                                {...register("rateCenter", {
                                                                    // ...requiredValidator
                                                                })}
                                                            />
                                                            <label htmlFor="data" className="formItemDesc text-start">
                                                                {/* Input the rate center for the DID */}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className={`formRow col-1`}>
                                                        <div
                                                            className="formLabel d-flex justify-content-between"
                                                            style={{ width: "100%" }}
                                                        >
                                                            <label htmlFor="state">State</label>
                                                            {errors.state && (
                                                                <ErrorMessage text={errors.state.message} />
                                                            )}
                                                        </div>
                                                        <div className="col-12">
                                                            <input
                                                                type="state"
                                                                name="state"
                                                                className={`formItem ${errors.state ? "error" : ""}`}
                                                                {...register("state", {
                                                                    ...requiredValidator
                                                                })}
                                                            />
                                                            <label htmlFor="data" className="formItemDesc text-start">
                                                                {/* Input the state for the DID */}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className={`formRow col-1`}>
                                                        <div className="formLabel">
                                                            <label htmlFor="contiguous">Contiguous</label>
                                                        </div>
                                                        <div className="col-12">
                                                            <select
                                                                name="contiguous"
                                                                className={`formItem ${errors.contiguous ? "error" : ""
                                                                    }`}
                                                                {...register("contiguous", {
                                                                    ...requiredValidator,
                                                                })}
                                                                defaultValue={1}
                                                            >
                                                                <option value={1}>True</option>
                                                                <option value={0}>False</option>
                                                            </select>
                                                            {errors.contiguous && (
                                                                <ErrorMessage text={errors.contiguous.message} />
                                                            )}
                                                            <label htmlFor="data" className="formItemDesc text-start">
                                                                {/* Select the type of domestic DID */}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </>
                                            }

                                            <div className="formRow col">
                                                <div className="col-2">
                                                    <button
                                                        effect="ripple"
                                                        className="panelButton m-0"
                                                        type="submit"
                                                    >
                                                        <span className="text">Search</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-magnifying-glass"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                        <div className='border border-light-subtle rounded-3 p-3 mb-3'>
                                            {/* <h4 className='card_title'>Top countries</h4> */}
                                            <div className='country_card_group numberListGroup'>
                                                {did && did.length > 0 ?
                                                    did.map((item, index) => (
                                                        <div className='card country_box' key={index} onClick={() => setSelectedDid(item)}>
                                                            <div className='card-body flex-row gap-3 justify-content-start w-100'>
                                                                <div className='avatar_img mb-0'>
                                                                    <img src={`https://flagsapi.com/${watch().country}/flat/64.png`} alt='logout' style={{ width: 'auto' }} />
                                                                </div>
                                                                <div className='card_details'>
                                                                    <p className='country_name text-start'>{item.friendly_name ? item.friendly_name : item.didSummary}</p>
                                                                    <div className='d-flex justify-content-center align-content-center gap-2'>
                                                                        {
                                                                            selectedUsage.map((item, key) => {
                                                                                if (item.label === "Voice") {
                                                                                    return (
                                                                                        <Tippy content="Voice Call is activated for this DID">
                                                                                            <button className="text-center badge badge-soft-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                                                                <i class="fa-solid fa-phone"></i>
                                                                                            </button>
                                                                                        </Tippy>
                                                                                    )
                                                                                } else if (item.label === "Text") {
                                                                                    return (
                                                                                        <Tippy content="SMS is activated for this DID">
                                                                                            <button className="text-center badge  badge-soft-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                                                                <i class="fa-regular fa-comments"></i>
                                                                                            </button>
                                                                                        </Tippy>
                                                                                    )
                                                                                } else if (item.label === "Fax") {
                                                                                    return (
                                                                                        <Tippy content="Fax is activated for this DID">
                                                                                            <button className="text-center badge  badge-soft-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                                                                <i class="fa-solid fa-fax"></i>
                                                                                            </button>
                                                                                        </Tippy>
                                                                                    )
                                                                                } else if (item.label === "Emergency") {
                                                                                    return (
                                                                                        <Tippy content="Emergency / e911 is activated for this DID">
                                                                                            <button className="text-center badge  badge-soft-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                                                                <i class="fa-regular fa-light-emergency-on"></i>
                                                                                            </button>
                                                                                        </Tippy>
                                                                                    )
                                                                                }
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                    ) : (
                                                        <EmptyPrompt generic={true} />
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className='border border-light-subtle rounded-3 p-3'>
                                        <h4 className='card_title'>All countries</h4>
                                        <div className='country_card_group'>
                                            {countryCode && countryCode.length > 0 &&
                                                countryCode.map((item, index) => (
                                                    <div key={index} className='card country_box' onClick={() => setValue('country', item.country_code)}>
                                                        <div className='card-body'>
                                                            <div className='avatar_img'>
                                                                <img src={`https://flagsapi.com/${item?.country_code}/flat/64.png`} alt='logout' style={{ width: 'auto' }} />
                                                            </div>
                                                            <div className='card_details'>
                                                                <p className='country_name'>{item?.country}</p>
                                                                <div className="text-center badge rounded-pill badge-soft-primary bg-transparent d-inline-flex justify-content-center align-items-center">
                                                                    <p className="text-center mb-0">{item?.prefix_code}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            {selectedDid && <>
                <div className='backdropContact'>
                    <div className="addNewContactPopup">
                        <div className="row">
                            <div className="col-12 heading">
                                <i className="fa-light fa-user-plus"></i>
                                <h5>Purchase Number</h5>
                                <p>
                                    You are about to purchase the selected number
                                </p>
                                <div className="border-bottom col-12" />
                            </div>

                            <div>
                                <div className="heading mb-2 px-0 py-1 bg-transparent">
                                    <h5 className='mb-0'>Order Summary</h5>
                                </div>
                                <div className='d-flex justify-content-between border border-light-subtle rounded-3 p-2 mb-2'>
                                    <div>
                                        {selectedDid.friendly_name ? selectedDid.friendly_name : selectedDid.didSummary}
                                    </div>
                                    <div>
                                        <span className="float-end">${selectedDid.price}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="heading mb-2 px-0 py-1 bg-transparent">
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
                                            {Number(selectedDid.price) > Number(accountBalance) ? <div className="col-auto">
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
                                        onClick={() => setSelectedDid(null)}
                                    >
                                        <span className="text">Close</span>
                                        <span className="icon">
                                            <i className="fa-solid fa-caret-left"></i>
                                        </span>
                                    </button>
                                    <button
                                        className="panelButton"
                                        // onClick={handlePayment}
                                        onClick={() => setPopUp(true)}
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
            </>}
            {
                didBuyPopUP ? (
                    <div className="popup">
                        <div className="container h-100">
                            <div className="row h-100 justify-content-center align-items-center">
                                <RechargeWalletPopup
                                    closePopup={handleBuyPopUp}
                                    rechargeType={"buyDid"}
                                    selectedDid={selectedDid}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )
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
                popUp ? (
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
                                            Are you sure you want to purchase{" "}
                                            {selectedDid?.length > 1 ? "these" : "this"} DID?
                                        </p>
                                        <div className="mt-2 d-flex justify-content-between">
                                            <button
                                                className="panelButton m-0 float-end"
                                                onClick={() => handlePayment()}
                                            >
                                                <span className="text">Confirm</span>
                                                <span className="icon"><i className="fa-solid fa-check" /></span>
                                            </button>
                                            <button
                                                className="panelButton gray m-0 float-end"
                                                onClick={() => {
                                                    setPopUp(false);
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

export default NewGetDid