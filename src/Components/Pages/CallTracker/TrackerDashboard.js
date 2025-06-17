import React, { useEffect, useState } from 'react'
import GraphChart from '../../CommonComponents/GraphChart'
import Header from '../../CommonComponents/Header'
import PaginationComponent from '../../CommonComponents/PaginationComponent'
import { featureUnderdevelopment, generalGetFunction, handleCsvDownload, useDebounce } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import { api_url } from '../../../urls';
import ThreeDotedLoader from '../../Loader/ThreeDotedLoader';

function TrackerDashboard() {
    const [refreshState, setRefreshState] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cdrReportDetails, setCdrReportDetails] = useState();
    const [campaignDidDetails, setCampaignDidDetails] = useState();
    const [callPerHourData, setCallPerHourData] = useState();
    const [graphFilterHour, setGraphFilterHour] = useState("1");

    // pagination states 
    const [pageNumber, setPageNumber] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    const debouncedSearchTerm = useDebounce(searchValue, 1000);

    const handleApiFun = async (shouldLoad, setState, url) => {
        if (shouldLoad)
            setLoading(true);
        const response = await generalGetFunction(url);
        if (response.status) {
            setState(response?.data);
            setLoading(false);
            setRefreshState(false)
        } else {
            toast.error(response.message);
            setLoading(false);
            setRefreshState(false)
        }
    }

    const fetchCallPerHourGraph = (shouldLoad) => {
        handleApiFun(
            shouldLoad,
            setCallPerHourData,
            api_url?.FCAMPAIGN_CDR_GRAPH_REPORT(graphFilterHour, "2025-06-12 13:18:08", "2025-06-13 13:18:08")
        )
    }

    const fetchCampaignDidListing = (shouldLoad) => {
        handleApiFun(
            shouldLoad,
            setCampaignDidDetails,
            api_url?.FCAMPAIGN_DID_LISTING(
                pageNumber,
                itemsPerPage,
                searchValue
            )
        )
    }

    const fetchCdrReport = (shouldLoad) => {
        handleApiFun(
            shouldLoad,
            setCdrReportDetails,
            api_url?.fcampaign_cdr_report
        )
    }

    // useEffect hooks are start here ----
    useEffect(() => {
        setRefreshState(true)
        const shouldLoad = true;
        fetchCdrReport(shouldLoad);
        fetchCallPerHourGraph(shouldLoad)
    }, [])

    useEffect(() => {
        const shouldLoad = false;
        fetchCallPerHourGraph(shouldLoad)
    }, [graphFilterHour])

    useEffect(() => {
        setRefreshState(true)
        const shouldLoad = true;
        fetchCampaignDidListing(shouldLoad);
    }, [itemsPerPage, pageNumber, debouncedSearchTerm])
    // useEffect hooks are end here ----

    const handleRefreshBtnClicked = () => {
        setRefreshState(true)
        const shouldLoad = false;
        fetchCampaignDidListing(shouldLoad)
    }

    const handleExportClick = () => {
        const csvData = campaignDidDetails?.data?.map((item, index) => ({
            id: index,
            DID: item?.did,
            "Feature Tag": item?.tag,
            "Total Call": item?.total_calls ?? 0,
            "Ring Time": item?.ring_time ?? 0,
            "Talk Time": item?.talk_time ?? 0,
            "Total Time": item?.total_time ?? 0
        }))
        handleCsvDownload(csvData)
    }

    return (
        <>
            <main className='mainContent'>
                <section id="phonePage">
                    <Header title="Tracker Dashboard" />
                    <section className="py-2">
                        <div className="container-fluid">
                            <div className='col-xl-12'>
                                <div className="row mt-3">
                                    <div className='col-xxl-4 col-xl-6 mb-3'>
                                        <div className='row g-3'>
                                            <div className="col-md-6 col-sm-6 col-12 ">
                                                <div className="itemWrapper a">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>{cdrReportDetails?.total_calls}</h3>
                                                                <p>Total Calls</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-square-check" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-12 ">
                                                <div className="itemWrapper b">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>{cdrReportDetails?.total_duration}</h3>
                                                                <p>Total Call Duration</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-user-check" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-12 ">
                                                <div className="itemWrapper c">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>45</h3>
                                                                <p>Active Calls</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-phone-arrow-down-left" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-12 ">
                                                <div className="itemWrapper d">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>10</h3>
                                                                <p>Calls On Queue</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-phone-volume" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-12 ">
                                                <div className="itemWrapper a">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>$0.46</h3>
                                                                <p>Cost Per Call</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-clock-rotate-left" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6 col-sm-6 col-12 ">
                                                <div className="itemWrapper b">
                                                    <div className='heading h-auto'>
                                                        <div className="d-flex flex-wrap justify-content-between">
                                                            <div className='col-9'>
                                                                <h3 style={{ fontWeight: 900 }}>7 <span style={{ fontSize: '15px', fontWeight: '500' }}>seconds</span></h3>
                                                                <p>Avg. Response Time</p>
                                                            </div>
                                                            <div className='col-3'>
                                                                <i className="fa-solid fa-phone-slash" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xxl-3 col-xl-6 mb-3'>
                                        <div className="itemWrapper a">
                                            <div className='heading h-auto'>
                                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                    <div className='col-auto'>
                                                        <h5 className="d-flex">Total Call Per Hour
                                                            <div class="my-auto position-relative ms-3">
                                                                <div class="cl-toggle-switch">
                                                                    <label class="cl-switch">
                                                                        <input type="checkbox"
                                                                            onChange={() => featureUnderdevelopment()}
                                                                            id="showAllCheck"
                                                                        />
                                                                        <span></span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </h5>
                                                    </div>
                                                    <div className="col-auto">
                                                        <ul class="chart_tabs" >
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphTimeFilter"
                                                                    value="1"
                                                                    checked={graphFilterHour === '1'}
                                                                    onChange={(e) => setGraphFilterHour(e.target.value)}
                                                                />
                                                                <button class="nav-link">1 Hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphTimeFilter" value="3"
                                                                    checked={graphFilterHour === '3'}
                                                                    onChange={(e) => setGraphFilterHour(e.target.value)}
                                                                />
                                                                <button class="nav-link">3 Hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphTimeFilter" value="6"
                                                                    checked={graphFilterHour === '6'}
                                                                    onChange={(e) => setGraphFilterHour(e.target.value)}
                                                                />
                                                                <button class="nav-link">6 Hr</button>
                                                            </li>
                                                            <li class="nav-item">
                                                                <input class="nav-link" type="radio" name="graphTimeFilter" value="12"
                                                                    checked={graphFilterHour === '12'}
                                                                    onChange={(e) => setGraphFilterHour(e.target.value)}
                                                                />
                                                                <button class="nav-link">12 Hr</button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='d-flex flex-wrap justify-content-between mt-1'>
                                                <GraphChart
                                                    height={'240px'}
                                                    label1={"Total Call"}
                                                    label2={"Call Cost"}
                                                    fields={callPerHourData?.data?.map((item) => item?.interval?.start?.split(" ")[1]?.slice(0, 5))}
                                                    percentage={[callPerHourData?.data?.map((item) => item?.total), callPerHourData?.data?.map((item) => item?.call_cost)]}
                                                    colors={["#f18f01", "#36A2EB"]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-xxl-5 col-xl-12 mb-3'>
                                        <div className='itemWrapper a'>
                                            <div className="row g-3">
                                                <div className='col-12'>
                                                    <div className="">
                                                        <div className='heading h-auto'>
                                                            <h5>Total Call Volume</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6">
                                                    <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                                        <div className='heading h-auto'>
                                                            <h5>Total Calls Completed</h5>
                                                        </div>

                                                        <div className='data-number2 h-auto'>
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className='col-4'>
                                                                    <p>Today</p>
                                                                    <h4>
                                                                        {cdrReportDetails?.today_calls_answered}
                                                                        {/* <i
                                                                            className="fa-solid fa-arrow-trend-up"
                                                                            style={{ color: '#01c78e' }}
                                                                        /> */}
                                                                    </h4>
                                                                </div>
                                                                <div className='col-4 text-center'>
                                                                    <p>This Week</p>
                                                                    <h4>
                                                                        {cdrReportDetails?.week_calls_answered}
                                                                        {/* <i
                                                                            className="fa-solid fa-arrow-trend-up"
                                                                            style={{ color: '#01c78e' }}
                                                                        /> */}
                                                                    </h4>
                                                                </div>
                                                                <div className='col-4 text-end'>
                                                                    <p>This Month</p>
                                                                    <h4>
                                                                        {cdrReportDetails?.month_calls_answered}
                                                                        {/* <i
                                                                            className="fa-solid fa-arrow-trend-down"
                                                                            style={{ color: '#dd2e2f' }}
                                                                        /> */}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-xl-6">
                                                    <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                                        <div className='heading h-auto'>
                                                            <h5>Calls Abandoned</h5>
                                                        </div>

                                                        <div className='data-number2 h-auto'>
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className='col-4'>
                                                                    <p>Today</p>
                                                                    <h4>{cdrReportDetails?.today_calls_abandoned}</h4>
                                                                </div>
                                                                <div className='col-4 text-center'>
                                                                    <p>This Week</p>
                                                                    <h4>{cdrReportDetails?.week_calls_abandoned}</h4>
                                                                </div>
                                                                <div className='col-4 text-end'>
                                                                    <p>This Month</p>
                                                                    <h4>{cdrReportDetails?.month_calls_abandoned}</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6">
                                                    <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                                        <div className='heading h-auto'>
                                                            <h5>Call not Answer</h5>
                                                        </div>

                                                        <div className='data-number2 h-auto'>
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className='col-4'>
                                                                    <p>Today</p>
                                                                    <h4>{cdrReportDetails?.today_calls_not_answered}</h4>
                                                                </div>
                                                                <div className='col-4 text-center'>
                                                                    <p>This Week</p>
                                                                    <h4>{cdrReportDetails?.week_calls_not_answered}</h4>
                                                                </div>
                                                                <div className='col-4 text-end'>
                                                                    <p>This Month</p>
                                                                    <h4>{cdrReportDetails?.month_calls_not_answered}</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6">
                                                    <div className="itemWrapper a shadow-none" style={{ border: '1px solid var(--border-color)' }}>
                                                        <div className='heading h-auto'>
                                                            <h5>Repeat Calls</h5>
                                                        </div>

                                                        <div className='data-number2 h-auto'>
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                                <div className='col-4'>
                                                                    <p>Today</p>
                                                                    <h4>18</h4>
                                                                </div>
                                                                <div className='col-4 text-center'>
                                                                    <p>This Week</p>
                                                                    <h4>43</h4>
                                                                </div>
                                                                <div className='col-4 text-end'>
                                                                    <p>This Month</p>
                                                                    <h4>965</h4>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-xl-12'>
                                <div className='overviewTableWrapper px-0 pt-0'>
                                    <div className='overviewTableChild'>
                                        <div className='d-flex flex-wrap'>
                                            <div className='col-12'>
                                                <div className='heading'>
                                                    <div className="content">
                                                        <h4>Vendor Call Analytics {" "}
                                                            <button
                                                                className="clearButton"
                                                                onClick={handleRefreshBtnClicked}
                                                                disabled={refreshState}
                                                            >
                                                                <i
                                                                    className={
                                                                        refreshState
                                                                            ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                                                            : "fa-regular fa-arrows-rotate fs-5"
                                                                    }
                                                                ></i>
                                                            </button>
                                                        </h4>
                                                        <p>You can see a brief analysis of all the vendors</p>
                                                    </div>
                                                    <div className='buttonGroup'>
                                                        {/* <button effect="ripple" className="panelButton gray">
                                                            <span className="text">Back</span>
                                                            <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
                                                        </button> */}
                                                        {/* <button effect="ripple" className="panelButton">
                                                            <span className="text">Refresh</span>
                                                            <span className="icon"><i className="fa-solid fa-arrows-rotate"></i></span>
                                                        </button> */}
                                                        {/* <button
                                                            effect="ripple"
                                                            className="panelButton"
                                                            onClick={handleExportClick}
                                                        >
                                                            <span className="text">Export</span>
                                                            <span className="icon"><i className="fa-solid fa-file-csv"></i></span>
                                                        </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12" style={{ overflow: 'auto', padding: '25px 20px 0px' }}>
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
                                                            <option value="10">10</option>
                                                            <option value="20">20</option>
                                                            <option value="30">30</option>
                                                        </select>
                                                        <label>entries</label>
                                                    </div>
                                                    <div className="searchBox position-relative">
                                                        <label>Search:</label>
                                                        <input
                                                            type="text"
                                                            name="Search"
                                                            placeholder="Search"
                                                            className="formItem"
                                                            value={searchValue}
                                                            onChange={(event) => setSearchValue(event?.target?.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="tableContainer" style={{ height: '30vh' }}>
                                                    <table>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>DID</th>
                                                                <th>Feature Tag</th>
                                                                <th>Total Calls</th>
                                                                <th>Ring Time</th>
                                                                <th>Talk Time</th>
                                                                <th>Total Time</th>
                                                                {/* <th>Conversions</th> */}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="">
                                                            {loading ?
                                                                <ThreeDotedLoader />
                                                                :
                                                                campaignDidDetails?.data?.length > 0 && campaignDidDetails?.data?.map((item, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{item?.did}</td>
                                                                        <td>{item?.tag}</td>
                                                                        <td>{item?.total_calls}</td>
                                                                        <td>{item?.ring_time}</td>
                                                                        <td>{item?.talk_time}</td>
                                                                        <td>{item?.total_time}</td>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className='tableHeader mb-3'>
                                                    <PaginationComponent
                                                        pageNumber={(e) => setPageNumber(e)}
                                                        totalPage={cdrReportDetails?.last_page}
                                                        from={cdrReportDetails?.from}
                                                        to={cdrReportDetails?.to}
                                                        total={cdrReportDetails?.total}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
            </main>
        </>
    )
}

export default TrackerDashboard