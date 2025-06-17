import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backToTop, generalDeleteFunction, generalGetFunction, useDebounce } from "../../GlobalFunction/globalFunction";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";
import PromptFunctionPopup from "../../CommonComponents/PromptFunctionPopup";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

function FportalCampaign() {
  const navigate = useNavigate();

  const [allFCampaigns, setAllFCampaigns] = useState([]);
  const [CampaignDetailsData, setCampaignDetailsData] = useState()
  const [loading, setLoading] = useState(false);
  const [refreshState, setRefreshState] = useState(false)
  const [pageNumber, setPageNumber] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const { confirm, ModalComponent } = PromptFunctionPopup();
  const debouncedSearchTerm = useDebounce(searchValue, 1000);

  const getAllCampaigns = async (shouldRefresh) => {
    if (shouldRefresh)
      setLoading(true);
    const response = await generalGetFunction(`fcampaign/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`);
    if (response.status) {
      setAllFCampaigns(response.data?.data);
      setCampaignDetailsData(response?.data)
      setLoading(false);
      setRefreshState(false)
    } else {
      toast.error(response.message);
      setLoading(false);
      setRefreshState(false)
    }
  };

  // Initial data fetch
  useEffect(() => {
    setRefreshState(true)
    const shouldRefresh = true
    getAllCampaigns(shouldRefresh)
  }, [itemsPerPage, debouncedSearchTerm])

  // Handle Edit Buyer
  const handleConfigEdit = async (id) => {
    if (id) {
      navigate('/call-forwarding-campaign-edit', { state: { id: id } });
    }
  }

  // Handle Delete Buyer
  const handleDeleteConfig = async (id) => {
    const userConfirmed = await confirm();
    if (userConfirmed) {
      setLoading(true);
      setRefreshState(true)
      try {
        const apiCall = await generalDeleteFunction(`/fcampaign/${id}`);
        if (apiCall.status) {
          setLoading(false);
          setRefreshState(false)
          toast.success("Campaign Deleted Successfully.");
          const shouldRefresh = true
          getAllCampaigns(shouldRefresh)
        }
      } catch (err) {
        console.log(err);
        setRefreshState(false)
        setLoading(false);
      } finally {
        setRefreshState(false)
        setLoading(false);
      }
    }
  }

  const getRefresh = () => {
    setRefreshState(true)
    const shouldRefresh = false
    getAllCampaigns(shouldRefresh)
  }

  const activateFCampaign = async (id) => {
    const response = await generalGetFunction(`fcampaign/start/${id}`);
    if (response?.status) {
      toast?.success(response?.message)
      const shouldLoad = false
      getAllCampaigns(shouldLoad)
    } else {
      // toast.error(response.message);
    }
  }

  const inactivateFCampaign = async (id) => {
    const response = await generalGetFunction(`fcampaign/stop/${id}`);
    if (response?.status) {
      toast?.success(response?.message)
      const shouldLoad = false
      getAllCampaigns(shouldLoad)
    } else {
      // toast.error(response.message);
    }
  }

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Forwarding portal" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Forwarding portal
                          <button className="clearButton" onClick={getRefresh} disabled={refreshState}>
                            <i className={`fa-regular fa-arrows-rotate fs-5 ${refreshState ? 'fa-spin' : ''}`} />
                          </button>
                        </h4>
                        <p>You can see all list of Forwarding portal</p>
                      </div>
                      <div className="buttonGroup">
                        <button effect="ripple" className="panelButton gray">
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          onClick={() => navigate("/call-forwarding-campaign-create")}
                          effect="ripple"
                          className="panelButton"
                        >
                          <span className="text">Add</span>
                          <span className="icon">
                            <i className="fa-solid fa-plus"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "25px 20px 0px" }}
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
                            <th>Status</th>
                            <th>Name</th>
                            <th>Phone Code</th>
                            <th>PSTN No.</th>
                            <th>Agent</th>
                            {/* <th>Progress</th> */}
                            {/* <th>Edit</th>
                            <th>Delete</th> */}
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ?
                            //  <SkeletonTableLoader col={8} row={15} />
                            <ThreeDotedLoader />
                            :
                            allFCampaigns && allFCampaigns?.length > 0 ?
                              allFCampaigns?.map((campaign, index) => (
                                <tr key={index}>
                                  <td>
                                    <div className="d-flex align-items-center justify-content-start ">
                                      <div className="phone-call">
                                        <i className={`fa-solid fa-${campaign?.status == 'active' ? 'play' : 'pause'}`} />
                                      </div>
                                      <div>
                                        <span className="ms-1">{campaign?.status}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>{campaign?.campaign_name}</td>
                                  <td>{campaign?.country_prefix}</td>
                                  <td>{campaign?.pstn_number}</td>
                                  <td>{campaign?.agent_name}</td>
                                  {/* <td className="">
                                    <div
                                      className="specialProgressWrap"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div className="specialProgress">
                                        <div
                                          className="segment success"
                                          style={{ width: "85%" }}
                                        />
                                        <div
                                          className="segment fail"
                                          style={{ width: "5%" }}
                                        />
                                        <div
                                          className="segment pending"
                                          style={{ width: "10%" }}
                                        />
                                      </div>
                                      <div className="specialProgressText">
                                        <p>0.00%</p>
                                        <span>0 of 1000</span>
                                      </div> */}
                                  {/* <div className="specialProgressWrapDetails">
                                <div className="d-flex align-items-center justify-content-start mb-1">
                                  <p
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 500,
                                      marginBottom: 0
                                    }}
                                  >
                                    LEADS IN TOTAL
                                  </p>
                                  <span className="test-demos ms-2">1000</span>
                                </div>
                                <ul>
                                  <li>
                                    <p
                                      className="p-0 m-0"
                                      style={{
                                        color: "rgb(92, 92, 92)",
                                        fontSize: 12,
                                        fontWeight: 400
                                      }}
                                    >
                                      Completed records
                                    </p>
                                    <div className="specialProgressWrap">
                                      <div className="specialProgress">
                                        <div
                                          className="segment success"
                                          style={{ width: "85%" }}
                                        />
                                        <div
                                          className="segment fail"
                                          style={{ width: "5%" }}
                                        />
                                        <div
                                          className="segment pending"
                                          style={{ width: "10%" }}
                                        />
                                      </div>
                                      <div className="specialProgressText">
                                        <p>0.00%</p>
                                        <span>0</span>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <p
                                      className="p-0 m-0"
                                      style={{
                                        color: "rgb(92, 92, 92)",
                                        fontSize: 12,
                                        fontWeight: 400
                                      }}
                                    >
                                      Failed records
                                    </p>
                                    <div className="specialProgressWrap">
                                      <div className="specialProgress">
                                        <div
                                          className="segment success"
                                          style={{ width: "85%" }}
                                        />
                                        <div
                                          className="segment fail"
                                          style={{ width: "5%" }}
                                        />
                                        <div
                                          className="segment pending"
                                          style={{ width: "10%" }}
                                        />
                                      </div>
                                      <div className="specialProgressText">
                                        <p>0.00%</p>
                                        <span>0</span>
                                      </div>
                                    </div>
                                  </li>
                                  <li>
                                    <p
                                      className="p-0 m-0"
                                      style={{
                                        color: "rgb(92, 92, 92)",
                                        fontSize: 12,
                                        fontWeight: 400
                                      }}
                                    >
                                      Untouched records
                                    </p>
                                    <div className="specialProgressWrap">
                                      <div className="specialProgress">
                                        <div
                                          className="segment success"
                                          style={{ width: "85%" }}
                                        />
                                        <div
                                          className="segment fail"
                                          style={{ width: "5%" }}
                                        />
                                        <div
                                          className="segment pending"
                                          style={{ width: "10%" }}
                                        />
                                      </div>
                                      <div className="specialProgressText">
                                        <p>0.00%</p>
                                        <span>0</span>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div> */}
                                  {/* </div>
                                  </td> */}
                                  {/* <td><button className="tableButton edit" onClick={() => handleConfigEdit(campaign.id)}><i className='fa-solid fa-pen' /></button></td>
                                  <td><button className="tableButton delete" onClick={() => handleDeleteConfig(campaign.id)}><i className='fa-solid fa-trash' /></button></td> */}
                                  <td>
                                    <div className="dropdown">
                                      <div className="tableButton" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className="fa-solid fa-ellipsis-vertical" />
                                      </div>
                                      <ul className="dropdown-menu actionBtnDropdowns">
                                        <li className='dropdown-item' onClick={() => activateFCampaign(campaign?.id)}><div className="clearButton text-align-start"><i className="fa-regular fa-circle-play me-2"></i> Activate</div></li>
                                        <li className='dropdown-item' onClick={() => inactivateFCampaign(campaign?.id)}><div className="clearButton text-align-start"><i className="fa-regular fa-circle-stop me-2"></i> Inactivate</div></li>
                                        <li className='dropdown-item' onClick={() => handleConfigEdit(campaign?.id)}><div className="clearButton text-align-start"><i className="fa-regular fa-pen me-2"></i> Edit</div></li>
                                        <li className='dropdown-item' onClick={() => handleDeleteConfig(campaign?.id)}><div className="clearButton text-align-start"><i className="fa-regular fa-trash me-2"></i> Delete</div></li>
                                      </ul>
                                    </div>
                                  </td>
                                </tr>
                              )) : <tr><td colSpan={99}><EmptyPrompt generic={true} /></td></tr>
                          }
                        </tbody>
                      </table>
                    </div>
                    <div className="tableHeader mb-3">
                      <PaginationComponent
                        pageNumber={(e) => setPageNumber(e)}
                        totalPage={CampaignDetailsData?.last_page}
                        from={CampaignDetailsData?.from}
                        to={CampaignDetailsData?.to}
                        total={CampaignDetailsData?.total}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ModalComponent task={"delete"} reference={"Campaign"} />
      </section>
    </main>

  );
}

export default FportalCampaign;
