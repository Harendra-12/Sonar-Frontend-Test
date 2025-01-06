import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header';
import { useNavigate } from 'react-router-dom';
import { backToTop, generalDeleteFunction, generalGetFunction } from '../../GlobalFunction/globalFunction';
import SkeletonTableLoader from '../../Loader/SkeletonTableLoader';
import { toast } from 'react-toastify';

function Meeting() {
    const [refreshState, setRefreshState] = useState(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [conference, setConference] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [searchValue, setSearchValue] = useState('');
    const [popUp, setPopUp] = useState(false);
    const [deleteId, setDeleteId] = useState('');

    useEffect(() => {
        async function getData() {
            setLoading(true);
            const apiData = await generalGetFunction("/conference/all");
            if (apiData?.status) {
                setLoading(false);
                setConference(apiData.data);
            } else {
                setLoading(false);
            }
        }
        getData()
    }, [refreshState])

    async function handleDelete() {
        setLoading(true);
        const apiData = await generalDeleteFunction(`/conference/${deleteId}`)
        if (apiData.status) {
            setLoading(false);
            setRefreshState(refreshState + 1)
            setDeleteId('');
            toast.success(apiData.message);
        } else {
            setLoading(false);
            setDeleteId('');
        }
    }
    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Meeting Rooms" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Meeting Rooms
                                                    <button className="clearButton" onClick={() => setRefreshState(refreshState + 1)} disabled={loading}>
                                                        <i className={
                                                            loading
                                                                ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                                                : "fa-regular fa-arrows-rotate fs-5"
                                                        }></i>
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
                                                        <i class="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="panelButton disabled"
                                                    title="You do not have permission to add"
                                                    onClick={() => navigate("/meeting-add")}
                                                >
                                                    <span className="text">Create</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-plus"></i>
                                                    </span>
                                                </button>
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
                                                    type="text"
                                                    name="Search"
                                                    placeholder="Search"
                                                    value={searchValue}
                                                    className="formItem"
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="tableContainer">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Conference Name</th>
                                                        <th>Max. Members</th>
                                                        <th>Conference ID</th>
                                                        <th>Moderator Pin</th>
                                                        <th>Joining Pin</th>
                                                        <th>Meeting link</th>
                                                        <th>Delete</th>
                                                        {/* <th>Action</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ? (
                                                        <SkeletonTableLoader col={7} row={15} />
                                                    ) : (
                                                        <>
                                                            {conference &&
                                                                conference?.data?.map((item) => {
                                                                    return (
                                                                        <tr>
                                                                            <td>{item.conf_name}</td>
                                                                            <td>{item.conf_max_members}</td>
                                                                            <td>{item.conf_ext}</td>
                                                                            <td>{item.moderator_pin}</td>
                                                                            <td>{item.participate_pin}</td>
                                                                            <td>{item.conf_url}</td>
                                                                            <td>
                                                                                <div
                                                                                    className="tableButton delete"
                                                                                    onClick={() => {
                                                                                        setDeleteId(item.id);
                                                                                        setPopUp(true);
                                                                                    }}
                                                                                >
                                                                                    <i class="fa-solid fa-trash"></i>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}{" "}
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

                                        Are you sure you want to delete this Meeting?
                                    </p>
                                    <div className="d-flex justify-content-between">

                                        <button
                                            disabled={loading}
                                            className="panelButton m-0"
                                            onClick={() => {
                                                handleDelete()
                                                setPopUp(false);
                                            }}
                                        >
                                            <span className="text">Confirm</span>
                                            <span className="icon">
                                                <i class="fa-solid fa-check"></i>
                                            </span>
                                        </button>

                                        <button
                                            className="panelButton gray m-0 float-end"
                                            onClick={() => {
                                                setPopUp(false);
                                                setDeleteId("");
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
                </div>
            ) : (
                ""
            )}
        </main>
    )
}

export default Meeting
