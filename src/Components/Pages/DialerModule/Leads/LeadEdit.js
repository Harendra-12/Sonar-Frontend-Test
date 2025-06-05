import React, { useEffect, useState } from 'react'
import Header from '../../../CommonComponents/Header'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { backToTop, generalDeleteFunction, generalGetFunction, generalPutFunction, generalPostFunction, checkViewSidebar, useDebounce } from '../../../GlobalFunction/globalFunction';
import PagePermissionForUser from '../../../CommonComponents/PermissionConfigForUser';
import PaginationComponent from '../../../CommonComponents/PaginationComponent';
import ThreeDotedLoader from '../../../Loader/ThreeDotedLoader';
import EmptyPrompt from '../../../Loader/EmptyPrompt';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { emailValidator, requiredValidator } from '../../../validations/validation';
import ErrorMessage from '../../../CommonComponents/ErrorMessage';
import PromptFunctionPopup from '../../../CommonComponents/PromptFunctionPopup';
import { useSelector } from 'react-redux';

function LeadEdit() {
    const navigate = useNavigate();
    const account = useSelector((state) => state.account);
    const slugPermissions = useSelector((state) => state?.permissions);
    const [popUp, setPopUp] = useState(false);
    const [leadAddPopup, setLeadAddPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshState, setRefreshState] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const locationState = useLocation();
    const [leadDetails, setLeadDetails] = useState([]);
    const [editLeadRow, setEditLeadRow] = useState({});
    const [countryCode, setCountryCode] = useState();
    const { confirm, ModalComponent } = PromptFunctionPopup();
    const debouncedSearchTerm = useDebounce(searchQuery, 1000);


    useEffect(() => {
        async function getData() {
            if (locationState.state.id) {
                setLoading(true);
                try {
                    const apiData = await generalGetFunction(`/lead-row/all?lead_files_id=${locationState.state.id}&page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchQuery}`)
                    if (apiData.status) {
                        setLeadDetails(apiData?.data);
                        setLoading(false);
                    }
                } catch (err) {
                    console.log(err);
                    setLoading(true);
                }
            }
        }
        getData();
    }, [refreshState, itemsPerPage, pageNumber, debouncedSearchTerm])

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

    // Delete Lead File
    const handleDeleteConfig = async (id) => {
        const userConfirmed = await confirm();
        if (userConfirmed) {
            setLoading(true);
            try {
                const apiCall = await generalDeleteFunction(`/lead-row/${id}`);
                if (apiCall.status) {
                    toast.success("Lead File Deleted Successfully.");
                    setRefreshState(refreshState + 1);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
    }


    const handleEditRow = (item) => {
        setPopUp(true);
        setEditLeadRow(item);
    }

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Lead Manage" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Lead Edit
                                                    <button
                                                        className="clearButton"
                                                        onClick={() => setRefreshState(refreshState + 1)}
                                                        disabled={loading}
                                                    >
                                                        <i
                                                            className={
                                                                loading
                                                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                                                    : "fa-regular fa-arrows-rotate fs-5"
                                                            }
                                                        ></i>
                                                    </button>
                                                </h4>
                                                <p>Manage the config of the lead</p>
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
                                                {checkViewSidebar(
                                                    "Lead",
                                                    slugPermissions,
                                                    account?.sectionPermissions,
                                                    account?.permissions,
                                                    "add"
                                                ) &&
                                                    <button
                                                        effect="ripple"
                                                        className="panelButton"
                                                        onClick={() => {
                                                            setLeadAddPopup(true);
                                                            backToTop();
                                                        }}
                                                    >
                                                        <span className="text">Add</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-plus"></i>
                                                        </span>
                                                    </button>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12" style={{ overflow: "auto", padding: "10px 20px 0" }}>
                                        <div className="tableHeader">
                                            <div className="showEntries">
                                                <label>Show</label>
                                                <select
                                                    className="formItem"
                                                    value={itemsPerPage}
                                                    onChange={(e) => setItemsPerPage(e.target.value)}
                                                >
                                                    <option value={10}>10</option>
                                                    <option value={20}>20</option>
                                                    <option value={30}>30</option>
                                                </select>
                                                <label>entries</label>
                                            </div>
                                            {checkViewSidebar(
                                                "Lead",
                                                slugPermissions,
                                                account?.sectionPermissions,
                                                account?.permissions,
                                                "search"
                                            ) && <div className="searchBox position-relative">
                                                    <label>Search:</label>
                                                    <input
                                                        type="search"
                                                        name="Search"
                                                        className="formItem"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                </div>}
                                        </div>
                                        <div className="tableContainer">
                                            {loading ? <ThreeDotedLoader /> :
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Id</th>
                                                            <th>First Name</th>
                                                            <th>Last Name</th>
                                                            <th>Country code</th>
                                                            <th>Phone Number</th>
                                                            <th>Email</th>
                                                            <th>Address</th>
                                                            <th>City</th>
                                                            <th>State</th>
                                                            <th>Zip Code</th>
                                                            <th>Gender</th>
                                                            {checkViewSidebar(
                                                                "Lead",
                                                                slugPermissions,
                                                                account?.sectionPermissions,
                                                                account?.permissions,
                                                                "edit"
                                                            ) && <th className='text-center'>Edit</th>}
                                                            {checkViewSidebar(
                                                                "Lead",
                                                                slugPermissions,
                                                                account?.sectionPermissions,
                                                                account?.permissions,
                                                                "delete"
                                                            ) && <th className='text-center'>Delete</th>}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {leadDetails && leadDetails?.data?.length > 0 ? leadDetails?.data?.map((item, index) => (
                                                            <tr key={item.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.first_name}</td>
                                                                <td>{item.last_name}</td>
                                                                <td>{item.country_code}</td>
                                                                <td>{item.phone_number}</td>
                                                                <td>{item.email}</td>
                                                                <td>{item.address1}</td>
                                                                <td>{item.city}</td>
                                                                <td>{item.state}</td>
                                                                <td>{item.postal_code}</td>
                                                                <td>{item.gender == "M" ? "Male" : item.gender == "F" ? "Female" : "Other"}</td>
                                                                {checkViewSidebar(
                                                                    "Lead",
                                                                    slugPermissions,
                                                                    account?.sectionPermissions,
                                                                    account?.permissions,
                                                                    "edit"
                                                                ) && <td>
                                                                        <button className="tableButton edit mx-auto" onClick={() => handleEditRow(item)}>
                                                                            <i className="fa-solid fa-pen"></i>
                                                                        </button>
                                                                    </td>
                                                                }
                                                                {checkViewSidebar(
                                                                    "Lead",
                                                                    slugPermissions,
                                                                    account?.sectionPermissions,
                                                                    account?.permissions,
                                                                    "delete"
                                                                ) && <td>
                                                                        <button className="tableButton delete mx-auto" onClick={() => handleDeleteConfig(item.id)}>
                                                                            <i className="fa-solid fa-trash"></i>
                                                                        </button>
                                                                    </td>
                                                                }
                                                            </tr>
                                                        )) : <tr><td colSpan={99}><EmptyPrompt generic={true} /></td></tr>}
                                                    </tbody>
                                                </table>
                                            }
                                        </div>
                                        <div className="tableHeader mb-3">
                                            <PaginationComponent
                                                pageNumber={(e) => setPageNumber(e)}
                                                totalPage={leadDetails?.total}
                                                from={leadDetails?.from}
                                                to={leadDetails?.to}
                                                total={leadDetails?.total}
                                            />
                                        </div>
                                    </div>
                                    {leadAddPopup && (
                                        <LeadRowAddPopup setPopUp={setLeadAddPopup} setRefreshState={setRefreshState} countryCode={countryCode} />
                                    )}
                                    {popUp && (
                                        <LeadRowEditPopup leadData={editLeadRow} setPopUp={setPopUp} setRefreshState={setRefreshState} countryCode={countryCode} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ModalComponent task={"delete"} reference={"Lead Row"} />
        </main >
    )
}

export default LeadEdit

export function LeadRowEditPopup({ leadData, setPopUp, setRefreshState, countryCode }) {
    const { register, formState: { errors }, reset, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    // Set the initial state for the form
    useEffect(() => {
        if (leadData) {
            reset({ ...leadData, country_code: leadData.country_code.replace("+", "") });
        }
    }, [])

    // Handle Lead Row Edit
    const handleFormSubmit = handleSubmit(async (data) => {
        setLoading(true);
        const payload = { ...data };
        const apiData = await generalPutFunction(`/lead-row/${leadData.id}`, payload);
        if (apiData?.status) {
            setLoading(false);
            toast.success(apiData.message);
            setPopUp(false);
            setRefreshState((prev) => prev + 1);
        } else {
            setLoading(false);
            toast.error(apiData.message);
        }
    });

    return (
        <div className="backdropContact">
            <div className="addNewContactPopup" style={{ width: '600px' }}>
                <div className="row">
                    <div className="col-12 heading mb-0">
                        <i className="fa-light fa-circle-exclamation"></i>
                        <h5 className='mb-0'>Lead Edit</h5>
                    </div>
                    <div className="col-12" style={{ padding: "0px 0px 10px" }}>
                        <form className="mb-0 d-flex flex-wrap">
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Title</label>
                                </div>
                                <div className="col-12">
                                    <select
                                        className="formItem "
                                        defaultValue={""}
                                        {...register("title", { ...requiredValidator })}
                                    >
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Mstr">Mstr</option>
                                        <option value="Miss">Miss</option>
                                    </select>
                                    {errors.title && (
                                        <ErrorMessage text={errors.title.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>First Name</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("first_name", { ...requiredValidator })}
                                    />
                                    {errors.first_name && (
                                        <ErrorMessage text={errors.first_name.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Middle Initial Name</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("middle_initial", { ...requiredValidator })}
                                    />
                                    {errors.middle_initial && (
                                        <ErrorMessage text={errors.middle_initial.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Last Name</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("last_name", { ...requiredValidator })}
                                    />
                                    {errors.last_name && (
                                        <ErrorMessage text={errors.last_name.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Gender</label>
                                </div>
                                <div className="col-12">
                                    <select
                                        className="formItem "
                                        defaultValue={""}
                                        {...register("gender", { ...requiredValidator })}
                                    >
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                    {errors.gender && (
                                        <ErrorMessage text={errors.gender.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Phone Number</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="number"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("phone_number", { ...requiredValidator })}
                                    />
                                    {errors.phone_number && (
                                        <ErrorMessage text={errors.phone_number.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Alt Phone Number</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("alt_phone", { ...requiredValidator })}
                                    />
                                    {errors.alt_phone && (
                                        <ErrorMessage text={errors.alt_phone.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Email</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="email"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("email", { ...requiredValidator, ...emailValidator })}
                                    />
                                    {errors.email && (
                                        <ErrorMessage text={errors.email.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Date Of Birth</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="date"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("date_of_birth", { ...requiredValidator })}
                                    />
                                    {errors.date_of_birth && (
                                        <ErrorMessage text={errors.date_of_birth.message} />
                                    )}
                                </div>
                            </div>

                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Address 1</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("address1", { ...requiredValidator })}
                                    />
                                    {errors.address1 && (
                                        <ErrorMessage text={errors.address1.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Address 2</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("address2", { ...requiredValidator })}
                                    />
                                    {errors.address2 && (
                                        <ErrorMessage text={errors.address2.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>City</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("city", { ...requiredValidator })}
                                    />
                                    {errors.city && (
                                        <ErrorMessage text={errors.city.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>State</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("state", { ...requiredValidator })}
                                    />
                                    {errors.state && (
                                        <ErrorMessage text={errors.state.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>State</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("province", { ...requiredValidator })}
                                    />
                                    {errors.province && (
                                        <ErrorMessage text={errors.province.message} />
                                    )}
                                </div>
                            </div>

                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Country code</label>
                                </div>
                                <div className="col-12">
                                    <select className='formItem' {...register("country_code", { ...requiredValidator })}>
                                        <option>Select Country</option>
                                        {countryCode.map((item, index) => (
                                            <option key={index} value={item.prefix_code}>{item.country} - {item.prefix_code}</option>
                                        ))}
                                    </select>
                                    {/* <input
                                        type="number"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("country_code", { ...requiredValidator })}
                                    /> */}
                                    {errors.country_code && (
                                        <ErrorMessage text={errors.country_code.message} />
                                    )}
                                </div>
                            </div>

                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Zip Code</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="number"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("postal_code", { ...requiredValidator })}
                                    />
                                    {errors.postal_code && (
                                        <ErrorMessage text={errors.postal_code.message} />
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button
                            className="panelButton m-0"
                            onClick={() => handleFormSubmit()}
                        >
                            <span className="text">Confirm</span>
                            <span className="icon">
                                <i className="fa-solid fa-check"></i>
                            </span>
                        </button>
                        <button
                            className="panelButton gray m-0 float-end"
                            onClick={() => setPopUp(false)}
                        >
                            <span className="text">Cancel</span>
                            <span className="icon">
                                <i className="fa-solid fa-xmark"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function LeadRowAddPopup({ setPopUp, setRefreshState, countryCode }) {
    const { register, formState: { errors }, reset, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);
    const locationState = useLocation();

    // Handle Lead Row Edit
    const handleFormSubmit = handleSubmit(async (data) => {
        setLoading(true);
        const payload = { ...data, lead_files_id: locationState.state.id, phone_code: data.country_code };
        const apiData = await generalPostFunction(`/lead-row/store`, payload);
        if (apiData?.status) {
            setLoading(false);
            toast.success(apiData.message);
            setPopUp(false);
            setRefreshState((prev) => prev + 1);
        } else {
            setLoading(false);
            toast.error(apiData.message);
        }
    });

    return (
        <div className="backdropContact">
            <div className="addNewContactPopup" style={{ width: '600px' }}>
                <div className="row">
                    <div className="col-12 heading mb-0">
                        <i className="fa-light fa-circle-exclamation"></i>
                        <h5 className='mb-0'>Lead Row Add</h5>
                    </div>
                    <div className="col-12" style={{ padding: "0px 0px 10px" }}>
                        <form className="mb-0 d-flex flex-wrap">
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Title</label>
                                </div>
                                <div className="col-12">
                                    <select
                                        className="formItem "
                                        defaultValue={""}
                                        {...register("title", { ...requiredValidator })}
                                    >
                                        <option value="Mr">Mr</option>
                                        <option value="Mrs">Mrs</option>
                                        <option value="Mstr">Mstr</option>
                                        <option value="Miss">Miss</option>
                                    </select>
                                    {errors.title && (
                                        <ErrorMessage text={errors.title.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>First Name</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("first_name", { ...requiredValidator })}
                                    />
                                    {errors.first_name && (
                                        <ErrorMessage text={errors.first_name.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Middle Initial Name</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("middle_initial", { ...requiredValidator })}
                                    />
                                    {errors.middle_initial && (
                                        <ErrorMessage text={errors.middle_initial.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Last Name</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("last_name", { ...requiredValidator })}
                                    />
                                    {errors.last_name && (
                                        <ErrorMessage text={errors.last_name.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Gender</label>
                                </div>
                                <div className="col-12">
                                    <select
                                        className="formItem "
                                        defaultValue={""}
                                        {...register("gender", { ...requiredValidator })}
                                    >
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                        <option value="O">Other</option>
                                    </select>
                                    {errors.gender && (
                                        <ErrorMessage text={errors.gender.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Phone Number</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="number"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("phone_number", { ...requiredValidator })}
                                    />
                                    {errors.phone_number && (
                                        <ErrorMessage text={errors.phone_number.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Alt Phone Number</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("alt_phone", { ...requiredValidator })}
                                    />
                                    {errors.alt_phone && (
                                        <ErrorMessage text={errors.alt_phone.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Email</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="email"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("email", { ...requiredValidator, ...emailValidator })}
                                    />
                                    {errors.email && (
                                        <ErrorMessage text={errors.email.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Date Of Birth</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="date"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("date_of_birth", { ...requiredValidator })}
                                    />
                                    {errors.date_of_birth && (
                                        <ErrorMessage text={errors.date_of_birth.message} />
                                    )}
                                </div>
                            </div>

                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Address 1</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("address1", { ...requiredValidator })}
                                    />
                                    {errors.address1 && (
                                        <ErrorMessage text={errors.address1.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Address 2</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("address2", { ...requiredValidator })}
                                    />
                                    {errors.address2 && (
                                        <ErrorMessage text={errors.address2.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>City</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("city", { ...requiredValidator })}
                                    />
                                    {errors.city && (
                                        <ErrorMessage text={errors.city.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>State</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("state", { ...requiredValidator })}
                                    />
                                    {errors.state && (
                                        <ErrorMessage text={errors.state.message} />
                                    )}
                                </div>
                            </div>
                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>State</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("province", { ...requiredValidator })}
                                    />
                                    {errors.province && (
                                        <ErrorMessage text={errors.province.message} />
                                    )}
                                </div>
                            </div>

                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Country code</label>
                                </div>
                                <div className="col-12">
                                    <select className='formItem' {...register("country_code", { ...requiredValidator })}>
                                        <option>Select Country</option>
                                        {countryCode.map((item, index) => (
                                            <option key={index} value={item.prefix_code}>{item.country} - {item.prefix_code}</option>
                                        ))}
                                    </select>
                                    {/* <input
                                        type="number"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("country_code", { ...requiredValidator })}
                                    /> */}
                                    {errors.country_code && (
                                        <ErrorMessage text={errors.country_code.message} />
                                    )}
                                </div>
                            </div>

                            <div className="formRow col-xl-4">
                                <div className="formLabel">
                                    <label>Zip Code</label>
                                </div>
                                <div className="col-12">
                                    <input
                                        type="number"
                                        className="formItem"
                                        defaultValue={""}
                                        {...register("postal_code", { ...requiredValidator })}
                                    />
                                    {errors.postal_code && (
                                        <ErrorMessage text={errors.postal_code.message} />
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button
                            className="panelButton m-0"
                            onClick={() => handleFormSubmit()}
                        >
                            <span className="text">Confirm</span>
                            <span className="icon">
                                <i className="fa-solid fa-check"></i>
                            </span>
                        </button>
                        <button
                            className="panelButton gray m-0 float-end"
                            onClick={() => setPopUp(false)}
                        >
                            <span className="text">Cancel</span>
                            <span className="icon">
                                <i className="fa-solid fa-xmark"></i>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}