import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    backToTop,
    featureUnderdevelopment,
    generalDeleteFunction,
    generalGetFunction,
    generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import ContentLoader from "../../Loader/ContentLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { toast } from "react-toastify";

const CallBlocking = () => {
    const [callBlock, setCallBlock] = useState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [popUp, setPopUp] = useState(false);
    const account = useSelector((state) => state.account);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [deleteId, setDeleteId] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [type, setType] = useState("");
    const [number, setNumber] = useState("");
    const [deletePopup, setDeletePopup] = useState(false);

    useEffect(() => {
        const getRingGroupDashboardData = async () => {
            if (account && account.id) {
                const apidata = await generalGetFunction(
                    `/spam/all`
                );
                console.log(apidata);
                if (apidata?.status) {
                    setCallBlock(apidata.data);
                    setLoading(false);
                } else {
                    navigate("/");
                }
            } else {
                navigate("/");
            }
        };
        getRingGroupDashboardData();
    }, [pageNumber]);



    // Add number to block list
    async function addBlock() {

        if (type === "") {
            toast.error("Please enter type")
        } else if (number === "") {
            toast.error("Please enter number")
        } else if (number < 99999999 || number > 99999999999999) {
            toast.error("Please enter valid number")
        } else {
            setPopUp(false)
            setLoading(true)
            const parsedData = {
                type: type,
                number: number
            }
            const apidata = await generalPostFunction(
                `/spam/store`, parsedData
            );
            if (apidata.status) {
                setLoading(false)
                setType("")
                setNumber("")
                setCallBlock([...callBlock, apidata.data])
                toast.success("Number added to block list")
            } else {
                setLoading(false)
            }
        }


    }

    async function handleDelete(id) {
        setDeletePopup(false);
        setLoading(true);
        const apidata = await generalDeleteFunction(
            `/spam/destroy/${id}`
        );
        if (apidata.status) {
            setLoading(false);
            const newList = callBlock.filter((item) => item.id !== id);
            setCallBlock(newList);
            setDeleteId("");
            toast.success("Number removed from block list")
        } else {
            setLoading(false);
        }
    }

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Block List" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Block List</h4>
                                                <p>You can see all list of blocked numbers</p>
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
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <div
                                                    // to="/ring-groups-add"
                                                    onClick={() => setPopUp(true)}
                                                    effect="ripple"
                                                    className="panelButton"
                                                >
                                                    <span className="text">Add</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-plus"></i>
                                                    </span>
                                                </div>
                                                <div
                                                    // to="/ring-groups-add"
                                                    onClick={() => navigate('/call-blocking-add')}
                                                    effect="ripple"
                                                    className="panelButton"
                                                >
                                                    <span className="text">Boost</span>
                                                    <span className="icon">
                                                        <i class="fa-solid fa-rocket"></i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{ overflow: "auto", padding: "25px 20px 0" }}
                                    >
                                        <div className="tableHeader">
                                            <div className="showEntries">
                                                <label>Show</label>
                                                <select
                                                    className="formItem"
                                                    value={itemsPerPage}
                                                    onChange={(e) => {
                                                        setItemsPerPage(e.target.value);
                                                    }}
                                                >
                                                    <option value={10}>Max</option>
                                                </select>
                                                <label>entries</label>
                                            </div>
                                            <div className="searchBox">
                                                <label>Search:</label>
                                                <input type="search" className="formItem" onChange={() => featureUnderdevelopment()} />
                                            </div>
                                        </div>
                                        <div className="tableContainer">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Type</th>
                                                        <th>Number</th>
                                                        <th>Remove</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? (
                                                        <tr>
                                                            <td colSpan={99}>
                                                                <ContentLoader />
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        <>
                                                            {callBlock &&
                                                                callBlock?.map((item, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td
                                                                            >
                                                                                {item.type}
                                                                            </td>
                                                                            <td
                                                                            >
                                                                                {item.number}
                                                                            </td>
                                                                            <td>
                                                                                <button
                                                                                    className="tableButton delete"
                                                                                    onClick={() => {
                                                                                        // handleDelete(item.id)
                                                                                        setDeletePopup(true);
                                                                                        setDeleteId(item.id);
                                                                                    }}
                                                                                >
                                                                                    <i className="fa-solid fa-trash"></i>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            {callBlock && callBlock.length === 0 ? (
                                                                <td colSpan={99}>
                                                                    <EmptyPrompt
                                                                        name="Call Blocking"
                                                                        link="call-blocking"
                                                                    />
                                                                </td>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {popUp ? (
                <div className="backdropContact">
                    <div className="addNewContactPopup">
                        <div className="row">
                            <div className="col-12 heading">
                                <i class="fa-light fa-user-plus"></i>
                                <h5>Add number to block Lists</h5>
                                <p>Add number to block Lists so that it will not able to call you</p>
                                <div className="border-bottom col-12" />
                            </div>
                            <div class="col-xl-12">
                                <div class="formLabel">
                                    <label for="">Type</label>
                                </div>
                                <div class="col-12">
                                    <input
                                        type="text"
                                        class="formItem"
                                        placeholder="DID/PSTN..."
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div class="col-xl-12 mt-3">
                                <div class="formLabel">
                                    <label for="">Number</label>
                                </div>
                                <div class="col-12">
                                    <input
                                        type="number"
                                        class="formItem"
                                        placeholder="Number"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-xl-12 mt-4">
                                <div className="d-flex justify-content-between">
                                    <button
                                        disabled={loading}
                                        className="panelButton gray ms-0"
                                        onClick={() => setPopUp(false)}
                                    >
                                        <span className="text">Cancel</span>
                                        <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                                    </button>
                                    <button
                                        className="panelButton me-0"
                                        onClick={addBlock}
                                    >

                                        <span className="text">Save</span>
                                        <span className="icon"><i class="fa-solid fa-check"></i></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
            {deletePopup ? <div className="popup">
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
                                <p>Are you sure you want to remove this Contact from block list?</p>
                                <div className="mt-2 d-flex justify-content-between">
                                    <button
                                        className="panelButton m-0"
                                        onClick={() => handleDelete(deleteId)}
                                    >
                                        <span className="text">Confirm</span>
                                        <span className="icon">
                                            <i class="fa-solid fa-check"></i>
                                        </span>
                                    </button>

                                    <button
                                        className="panelButton gray m-0 float-end"
                                        onClick={() => {
                                            setDeletePopup(false);
                                            setDeleteId(null);
                                        }}
                                    >
                                        <span className="text">Cancel</span>
                                        <span className="icon">
                                            <i class="fa-solid fa-xmark"></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : ""}
        </main>
    );
};

export default CallBlocking;
