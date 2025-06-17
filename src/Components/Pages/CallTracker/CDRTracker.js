import { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import PaginationComponent from '../../CommonComponents/PaginationComponent'
import EmptyPrompt from '../../Loader/EmptyPrompt'
import ThreeDotedLoader from '../../Loader/ThreeDotedLoader'
import { generalGetFunction, isoToTimeFormat, isoToYYMMDDFormat, useDebounce } from '../../GlobalFunction/globalFunction'
import { toast } from 'react-toastify'
import { api_url } from '../../../urls'

const CDRTracker = () => {
    const [refreshState, setRefreshState] = useState();
    const [loading, setLoading] = useState();
    const [allCdrReport, setAllCdrReport] = useState();

    // pagination states 
    const [pageNumber, setPageNumber] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    const debouncedSearchTerm = useDebounce(searchValue, 1000);



    const getAllCDRReports = async (shouldLoad) => {
        if (shouldLoad)
            setLoading(true);
        const response = await generalGetFunction(api_url?.FPORTAL_ALL_CDR(pageNumber, itemsPerPage, searchValue));
        if (response.status) {
            setAllCdrReport(response?.data);
            setLoading(false);
            setRefreshState(false)
        } else {
            toast.error(response.message);
            setLoading(false);
            setRefreshState(false)
        }
    };

    // useEffect hooks are start here ----

    useEffect(() => {
        setRefreshState(true)
        const shouldLoad = true;
        getAllCDRReports(shouldLoad)
    }, [debouncedSearchTerm, itemsPerPage, pageNumber])

    // useEffect hooks are end here ----

    const getRefresh = () => {
        setRefreshState(true)
        const shouldRefresh = false
        getAllCDRReports(shouldRefresh)
    }

    return (
        <main className='mainContent'>
            <section id="phonePage">
                <div className="container-fluid">
                    <div className="row">
                        <Header title="Buyers" />
                        <div className="overviewTableWrapper">
                            <div className="overviewTableChild">
                                <div className="d-flex flex-wrap">
                                    <div className="col-12">
                                        <div className="heading">
                                            <div className="content">
                                                <h4> All Tracker CDR
                                                    <button
                                                        class="clearButton"
                                                        onClick={getRefresh}
                                                        disabled={refreshState}>
                                                        <i class={`fa-regular fa-arrows-rotate fs-5 ${refreshState ? 'fa-spin' : ''}`} /></button>
                                                </h4>
                                                <p>You can see all list of all Tracker CDR</p>
                                            </div>
                                            <div className="buttonGroup">
                                                <button className="panelButton gray">
                                                    <span className="text">Back</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-caret-left"></i>
                                                    </span>
                                                </button>
                                                {/* <button
                                                    onClick={() => Navigate("/buyer-add")}
                                                    className="panelButton"
                                                >
                                                    <span className="text">Add</span>
                                                    <span className="icon">
                                                        <i className="fa-solid fa-plus"></i>
                                                    </span>
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="col-12"
                                        style={{ overflow: "auto", padding: "10px 20px 0" }}
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
                                                        <th>#</th>
                                                        <th>Source Number</th>
                                                        <th>Caller Id</th>
                                                        <th>DID</th>
                                                        <th>Campaign Name</th>
                                                        <th>Buyer Name</th>
                                                        <th>Destination</th>
                                                        <th>Duration</th>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>Hangup Cause and Status</th>
                                                        <th>Switch Disposition</th>
                                                        <th>Dublicate</th>
                                                        <th>Block</th>
                                                        <th>Bills</th>
                                                    </tr>
                                                </thead>
                                                
                                                <tbody>
                                                    {loading ?
                                                        <ThreeDotedLoader />
                                                        :
                                                        allCdrReport?.data && allCdrReport?.data?.length > 0 ?
                                                            allCdrReport?.data?.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item?.src}</td>
                                                                    <td>{item?.src}</td>
                                                                    <td>{item?.did_num}</td>
                                                                    <td>{item?.fportalcampaign?.campaign_name}</td>
                                                                    <td>Buyer name</td>
                                                                    <td>{item?.dest}</td>
                                                                    <td>{item?.duration}</td>
                                                                    <td>{isoToYYMMDDFormat(item?.created_at)}</td>
                                                                    <td>{isoToTimeFormat(item?.created_at)}</td>
                                                                    <td>{item?.hangup_cause}</td>
                                                                    <td>{item?.switch_disposition}</td>
                                                                    <td>{item?.duplicated}</td>
                                                                    <td>block</td>
                                                                    <td>{item?.variable_billsec}</td>
                                                                    
                                                                    
                                                                </tr>
                                                            )) : <tr><td colSpan={99}><EmptyPrompt generic={true} /></td></tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="tableHeader mb-3">
                                            <PaginationComponent
                                                pageNumber={(e) => setPageNumber(e)}
                                                totalPage={allCdrReport?.last_page}
                                                from={allCdrReport?.from}
                                                to={allCdrReport?.to}
                                                total={allCdrReport?.total}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>        </main>
    )
}

export default CDRTracker