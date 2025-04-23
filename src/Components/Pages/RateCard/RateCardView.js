import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../../CommonComponents/Header';
import { backToTop, featureUnderdevelopment, generalGetFunction } from '../../GlobalFunction/globalFunction';
import PaginationComponent from '../../CommonComponents/PaginationComponent';
import { set } from 'date-fns';
import EmptyPrompt from '../../Loader/EmptyPrompt';
import SkeletonTableLoader from '../../Loader/SkeletonTableLoader';
import { use } from 'react';

function RateCardView() {
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [userInput, setuserInput] = useState("");

    const [rateCardList, setRateCardList] = useState([]);
    const [loading, setLoading] = useState(false);
    const getRateCard = async () => {
        setLoading(true);
        try {
            const response = await generalGetFunction(`call-tariff/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${userInput}`);
            if (response.status) {
                setRateCardList(response.data);
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getRateCard();
    }, [pageNumber, itemsPerPage])

    // Debounce Search Function
    useEffect(() => {
        if (userInput !== "") {
            const delay = setTimeout(() => {
                getRateCard();
            }, 500);
            return () => clearTimeout(delay);
        }
    }, [userInput]);

    return (
        <main className="mainContent">
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Rate Card" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4>Rate Card</h4>
                                            </div>
                                            <div className="buttonGroup">
                                                <button
                                                    effect="ripple"
                                                    className="panelButton ms-0"
                                                    onClick={() => getRateCard()}
                                                >
                                                    <span className="text">Refresh</span>
                                                    <span className="icon">
                                                        <i className="fa-regular fa-arrows-rotate fs-5"></i>
                                                    </span>
                                                </button>
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
                                                    value={userInput}
                                                    onChange={(e) => setuserInput(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <nav className='tangoNavs mt-2'>
                                            <div className='nav nav-tabs' id="nav-tab" role="tablist">
                                                <button class="nav-link active" id="nav-in-tab" data-bs-toggle="tab" data-bs-target="#nav-in" type="button" role="tab">
                                                    Inbound
                                                </button>
                                                <button class="nav-link" id="nav-out-tab" data-bs-toggle="tab" data-bs-target="#nav-out" type="button" role="tab">
                                                    Outbound
                                                </button>
                                            </div>
                                        </nav>
                                        <div className='tab-content' id="nav-tabContent">
                                            <div className='tab-pane fade show active' id="nav-in" role="tabpanel">
                                                <div className="tableContainer">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Source</th>
                                                                <th>Destination</th>
                                                                {/* <th>Vendor Name</th> */}
                                                                <th>Country</th>
                                                                <th>Selling Billing Block</th>
                                                                {/* <th>Outbound Rate</th> */}
                                                                <th>Inbound Rate</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loading ?
                                                                <SkeletonTableLoader col={6} row={15} /> : (
                                                                    <>
                                                                        {rateCardList && rateCardList?.data?.length === 0 ? (
                                                                            <tr>
                                                                                <td colSpan={99}>
                                                                                    <EmptyPrompt name="Rate Card" />
                                                                                </td>
                                                                            </tr>
                                                                        ) : (
                                                                            rateCardList?.data?.map((item, index) => {
                                                                                return (
                                                                                    <tr>
                                                                                        <td>{index + 1}</td>
                                                                                        <td>{item.src}</td>
                                                                                        <td>{item.dest}</td>
                                                                                        {/* <td>{item.vendor_name}</td> */}
                                                                                        <td>{item.country}</td>
                                                                                        <td>{item.selling_billing_block}</td>
                                                                                        {/* <td>{item.out_rate}</td> */}
                                                                                        <td>{item.in_rate}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        )}
                                                                    </>
                                                                )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                            <div className='tab-pane fade' id="nav-out" role="tabpanel">
                                                <div className="tableContainer">
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Source</th>
                                                                <th>Destination</th>
                                                                <th>Vendor Name</th>
                                                                <th>Country</th>
                                                                <th>Selling Billing Block</th>
                                                                <th>Outbound Rate</th>
                                                                {/* <th>Inbound Rate</th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {loading ?
                                                                <SkeletonTableLoader col={7} row={15} /> : (
                                                                    <>
                                                                        {rateCardList && rateCardList?.data?.length === 0 ? (
                                                                            <tr>
                                                                                <td colSpan={99}>
                                                                                    <EmptyPrompt name="Rate Card" />
                                                                                </td>
                                                                            </tr>
                                                                        ) : (
                                                                            rateCardList?.data?.map((item, index) => {
                                                                                return (
                                                                                    <tr>
                                                                                        <td>{index + 1}</td>
                                                                                        <td>{item.src}</td>
                                                                                        <td>{item.dest}</td>
                                                                                        <td>{item.vendor_name}</td>
                                                                                        <td>{item.country}</td>
                                                                                        <td>{item.selling_billing_block}</td>
                                                                                        <td>{item.out_rate}</td>
                                                                                        {/* <td>{item.in_rate}</td> */}
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        )}
                                                                    </>
                                                                )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="tableHeader mb-3">
                                            {rateCardList && rateCardList?.data?.length > 0 &&
                                                <PaginationComponent
                                                    pageNumber={(e) => setPageNumber(e)}
                                                    totalPage={rateCardList.last_page}
                                                    from={rateCardList.from}
                                                    to={rateCardList.to}
                                                    total={rateCardList.total}
                                                />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default RateCardView