/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  useDebounce,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { toast } from "react-toastify";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";

const ClickToCallListing = () => {
  const [callBlock, setCallBlock] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const account = useSelector((state) => state.account);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [deletePopup, setDeletePopup] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchTerm = useDebounce(searchValue, 1000);  
  
  useEffect(() => {
    setLoading(true);
    const getRingGroupDashboardData = async () => {
      if (account && account.id) {
        const apidata = await generalGetFunction(
          `/click-to-call/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`
        );
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
  }, [pageNumber, itemsPerPage, debouncedSearchTerm]);

  async function handleDelete(id) {
    setDeletePopup(false);
    setLoading(true);
    const apidata = await generalDeleteFunction(`/click-to-call/destroy/${id}`);
    if (apidata.status) {
      setLoading(false);
      const newList = callBlock.data.filter((item) => item.id !== id);
      setCallBlock({ ...callBlock, data: newList });
      setDeleteId("");
      toast.success("Number removed from block list");
    } else {
      setLoading(false);
    }
  }

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Widget list" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Click to call widget List</h4>
                        <p>You can see all list of created widget</p>
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
                        <div
                          // to="/ring-groups-add"
                          effect="ripple"
                          className="panelButton"
                          onClick={() => navigate("/click-to-call-add")}
                        >
                          <span className="text">Add</span>
                          <span className="icon">
                            <i className="fa-solid fa-plus"></i>
                          </span>
                        </div>
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

                      <div className="searchBox">
                        <label>Search:</label>
                        <input
                          type="search"
                          className="formItem"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Company Name</th>
                            <th>Usage</th>
                            <th>Action</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (
                            <SkeletonTableLoader col={4} row={15} />
                          ) : (
                            <>
                              {callBlock &&
                                callBlock.data?.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td onClick={()=>navigate(`/click-to-call-edit?id=${item.id}`)}>{item.company_name}</td>
                                      <td onClick={()=>navigate(`/click-to-call-edit?id=${item.id}`)}>{item.usages}</td>
                                      <td onClick={()=>navigate(`/click-to-call-edit?id=${item.id}`)}>{item.action}</td>
                                      <td>
                                        <button
                                          className="tableButton delete"
                                          onClick={() => {
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
                    <div className="tableHeader mb-3">
                      {callBlock && callBlock?.data?.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={callBlock.last_page}
                          from={callBlock.from}
                          to={callBlock.to}
                          total={callBlock.total}
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {deletePopup ? (
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
                    Are you sure you want to remove this widget?
                  </p>
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={() => handleDelete(deleteId)}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
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
                        <i className="fa-solid fa-xmark"></i>
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
  );
};

export default ClickToCallListing;
