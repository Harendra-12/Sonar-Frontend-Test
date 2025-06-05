import React, { useEffect, useState } from 'react'
import Header from '../../../CommonComponents/Header'
import PaginationComponent from '../../../CommonComponents/PaginationComponent'
import { backToTop, generalDeleteFunction, generalGetFunction, generalPutFunction } from '../../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ActionType } from '../../../Redux/reduxActionType';
import ThreeDotedLoader from '../../../Loader/ThreeDotedLoader';
import PromptFunctionPopup from '../../../CommonComponents/PromptFunctionPopup';
import { toast } from 'react-toastify';
import { set } from 'date-fns';
import { useForm } from 'react-hook-form';
import { requiredValidator } from '../../../validations/validation';
import ErrorMessage from '../../../CommonComponents/ErrorMessage';
import CircularLoader from '../../../Loader/CircularLoader';

function Leads() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [refreshState, setRefreshState] = useState(0)
    const [leadsList, setLeadsList] = useState();
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { confirm, ModalComponent } = PromptFunctionPopup();
    const [leadEditPopup, setLeadEditPopup] = useState(false);
    const [leadEditData, setLeadEditData] = useState();

    // Get All Lead Files
    const getLead = async () => {
        setLoading(true);
        try {
            const res = await generalGetFunction(`/lead-file/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchQuery}`);
            if (res?.status) {
                dispatch({
                    type: "SET_ALL_LEADS_FILE_LIST",
                    payload: res.data
                })
                setLeadsList(res?.data);
            }
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        getLead()
    }, [pageNumber, itemsPerPage, searchQuery, refreshState])


    // Download Lead File
    const downloadImage = async (imageUrl, fileName) => {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading the image:", error);
        }
    };

    // Delete Lead File
    const handleDeleteConfig = async (id) => {
        const userConfirmed = await confirm();
        if (userConfirmed) {
            setLoading(true);
            try {
                const apiCall = await generalDeleteFunction(`/lead-file/${id}`);
                if (apiCall.status) {
                    setLoading(false);
                    toast.success("Lead File Deleted Successfully.");
                    setRefreshState(refreshState + 1);
                }
            } catch (err) {
                console.log(err);
                setLoading(false);
            }
        }
    }

    const handleEditConfig = (data) => {
        setLeadEditPopup(true);
        setLeadEditData(data);
    }

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Leads" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Leads {" "}
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
                                                <button
                                                    type="button"
                                                    className="panelButton"
                                                    onClick={() => navigate('/lead-add')}
                                                >
                                                    <span className="text">Add</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-plus"></i>
                                                    </span>
                                                </button>
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
                                            <div className="searchBox position-relative">
                                                <label>Search:</label>
                                                <input
                                                    type="search"
                                                    name="Search"
                                                    className="formItem"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="tableContainer">
                                            {loading ? <ThreeDotedLoader /> :
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Id</th>
                                                            <th>Lead Name</th>
                                                            <th>Lead Description</th>
                                                            <th>Status</th>
                                                            <th>Rows</th>
                                                            <th style={{ textAlign: "center" }}>Download</th>
                                                            <th style={{ textAlign: "center" }}>Edit</th>
                                                            <th style={{ textAlign: "center" }}>Delete</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            leadsList?.data?.map((data, index) => {
                                                                return (
                                                                    <tr key={data.id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{data?.name}</td>
                                                                        <td>{data?.description}</td>
                                                                        <td>{data?.status}</td>
                                                                        <td>{data?.lead_rows_count}</td>
                                                                        <td>
                                                                            <button className='tableButton mx-auto' onClick={() => downloadImage(data.file_url, `${data.description}`)}>
                                                                                <i class="fa-regular fa-download"></i>
                                                                            </button>
                                                                        </td>
                                                                        <td>
                                                                            <button className="tableButton edit mx-auto" onClick={() => handleEditConfig(data)}>
                                                                                <i className="fa-solid fa-pen"></i>
                                                                            </button>
                                                                        </td>
                                                                        <td>
                                                                            <button className="tableButton delete mx-auto" onClick={() => handleDeleteConfig(data.id)}>
                                                                                <i className="fa-solid fa-trash"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            }
                                        </div>
                                        <div className="tableHeader mb-3">
                                            <PaginationComponent
                                                pageNumber={(e) => setPageNumber(e)}
                                                totalPage={leadsList?.total}
                                                from={leadsList?.from}
                                                to={leadsList?.to}
                                                total={leadsList?.total}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {leadEditPopup && (
                <LeadEditPopup leadData={leadEditData} setLeadEditPopup={setLeadEditPopup} setRefreshState={setRefreshState} />
            )}

            <ModalComponent task={"delete"} reference={"Lead File"} />
        </main>
    )
}

export default Leads

export function LeadEditPopup({ leadData, setLeadEditPopup, setRefreshState }) {
    const { register, formState: { errors }, reset, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getData() {
            if (leadData) {
                setLoading(true);
                try {
                    const apiData = await generalGetFunction(`/lead-file/${leadData.id}`)
                    if (apiData.status) {
                        reset(apiData);
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
        const apiData = await generalPutFunction(`/lead-file/${leadData.id}`, payload);
        if (apiData?.status) {
            setLoading(false);
            toast.success(apiData.message);
            setLeadEditPopup(false);
            setRefreshState((prev) => prev + 1);
        } else {
            setLoading(false);
            toast.error(apiData.message);
        }
    });

    return (
        <>
            {loading && <CircularLoader />}
            <div className='addNewContactPopup'>
                <button class="clearButton2 xl" style={{ position: "absolute", top: "10px", right: "10px" }} onClick={() => setLeadEditPopup(false)}>
                    <i class="fa-light fa-xmark"></i>
                </button>
                <div className='row'>
                    <div class="col-12 heading mb-0">
                        <i class="fa-light fa-magnifying-glass"></i>
                        <h5>Lead File Edit</h5>
                    </div>
                    <form>
                        <div className='row'>
                            <div className='formRow'>
                                <label class="formLabel text-start mb-0 w-100">Title</label>
                                <input className='formItem' defaultValue={""} {...register("name", { ...requiredValidator, })} />
                                {errors.name && (
                                    <ErrorMessage text={errors.name.message} />
                                )}
                            </div>
                            <div className='formRow'>
                                <label class="formLabel text-start mb-0 w-100">Description</label>
                                <input className='formItem' defaultValue={""} {...register("description", { ...requiredValidator, })} />
                                {errors.description && (
                                    <ErrorMessage text={errors.description.message} />
                                )}
                            </div>
                        </div>
                    </form>
                    <div class="col-xl-12 mt-3">
                        <button class="panelButton mx-auto" onClick={handleFormSubmit}>
                            <span class="text">Save</span>
                            <span class="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}