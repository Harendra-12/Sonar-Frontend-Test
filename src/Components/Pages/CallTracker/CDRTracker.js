import { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import PaginationComponent from '../../CommonComponents/PaginationComponent'
import EmptyPrompt from '../../Loader/EmptyPrompt'
import ThreeDotedLoader from '../../Loader/ThreeDotedLoader'
import { generalGetFunction } from '../../GlobalFunction/globalFunction'
import { toast } from 'react-toastify'

const CDRTracker = () => {
    const [refreshState, setRefreshState] = useState();
    const [loading, setLoading] = useState();
    const [searchValue, setSearchValue] = useState();
    const [allCdrReport, setAllCdrReport] = useState();

    // pagination states 
    const [pageNumber, setPageNumber] = useState();
    const [itemsPerPage, setItemsPerPage] = useState();

    const getRefresh = () => {

    }

    const getAllCDRReports = async (shouldLoad) => {
        if (shouldLoad)
            setLoading(true);
        const response = await generalGetFunction(`fportalcdr/all`);
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
    useEffect(() => {
        setRefreshState(true)
        const shouldLoad = false;
        getAllCDRReports(shouldLoad)
    }, [])

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
                                                    <button class="clearButton" onClick={getRefresh} disabled={refreshState}>
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
                                                        <th>Campaign Name</th>
                                                        <th>Disposition</th>
                                                        <th>Source</th>
                                                        <th>Destination</th>
                                                        <th>Duration</th>
                                                        <th>Hangup Cause</th>
                                                        <th>Switch Disposition</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loading ?
                                                        <ThreeDotedLoader />
                                                        :
                                                        allCdrReport?.data && allCdrReport?.data?.length > 0 ?
                                                            allCdrReport?.data?.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{item?.fportalcampaign?.campaign_name}</td>
                                                                    <td>{item?.disposition}</td>
                                                                    <td>{item?.src}</td>
                                                                    <td>{item?.dest}</td>
                                                                    <td>{item?.duration}</td>
                                                                    <td>{item?.hangup_cause}</td>
                                                                    <td>{item?.switch_disposition}</td>
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