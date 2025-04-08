import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header';
import {
  backToTop,
  checkViewSidebar,
  generalDeleteFunction,
  generalGetFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { Link, useNavigate } from "react-router-dom";
import SkeletonTableLoader from '../../Loader/SkeletonTableLoader';
import { useDispatch, useSelector } from 'react-redux';
import EmptyPrompt from '../../Loader/EmptyPrompt';
import Tippy from '@tippyjs/react';
import { toast } from 'react-toastify';

export default function GroupsList() {
  const [refreshState, setRefreshState] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [groups,setGroups]=useState([])
  const account = useSelector((state) => state.account);
  const [noPermissionToRead, setNoPermissionToRead] = useState(false);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const [deleteId, setDeleteId] = useState("");
  const [popUp, setPopUp] = useState(false);
   const [error, setError] = useState("");


    // Getting groups data and also update user refresh to trigger user listing api call
    useEffect(() => {
      const getGroupDashboardData = async () => {
        if (account && account.id) {
          setLoading(true);
          const apidata = await generalGetFunction(
            `groups/all`
          );
          if (apidata?.status) {
            console.log(apidata.data)
            setGroups(apidata.data);
            setLoading(false);
          } else {
            if (apidata.response.status === 403) {
              setNoPermissionToRead(true);
            }
          }
        } else {
          navigate("/");
        }
      };
      if (searchValue.trim().length === 0) {
        getGroupDashboardData();
      } else {
        const timer = setTimeout(() => {
          getGroupDashboardData();
        }, 1000);
        return () => clearTimeout(timer);
      }

      if (refreshState === 0) {
        dispatch({
          type: "SET_ALLUSERREFRESH",
          allUserRefresh: allUserRefresh + 1,
        });
      }
    }, [pageNumber, refreshState, itemsPerPage, searchValue]);

     async function handleDelete(id) {
        setPopUp(false);
        setLoading(true);
        const apiData = await generalDeleteFunction(`destroy/${id}`);
        if (apiData?.status) {
          const newArray = groups?.data?.filter((item) => item.id !== id);
          setGroups({ ...groups, data: newArray });
          setLoading(false);
          toast.success(apiData.message);
          // dispatch({
          //   type: "SET_RINGGROUPREFRESH",
          //   ringGroupRefresh: ringGroupRefresh + 1,
          // });
          setDeleteId("");
        } else {
          setLoading(false);
          // toast.error(apiData.error);
          setDeleteId("");
        }
      }
    
  return (
    <div className="mainContent"> <section id="phonePage">
    <div className="container-fluid">
      <div className="row">
        <Header title="Groups" />
        <div className="overviewTableWrapper">
          <div className="overviewTableChild">
            <div className="d-flex flex-wrap">
              <div className="col-12">
                <div className="heading">
                  <div className="content">
                    <h4>
                      Group List
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
                    <p>You can see all list of groups</p>
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
                    {/* {checkViewSidebar(
                      "Ringgroup",
                      slugPermissions,
                      account?.permissions,
                      "add"
                    ) ? ( */}
                      <Link
                        to="/groups-add"
                        // onClick={backToTop}
                        // onClick={handleRingGroupAddValidation}
                        effect="ripple"
                        className="panelButton"
                      >
                        <span className="text">Add</span>
                        <span className="icon">
                          <i className="fa-solid fa-plus"></i>
                        </span>
                      </Link>
                    {/* ) : ( */}
                      {/* <button
                        disabled
                        // onClick={handleRingGroupAddValidation}
                        effect="ripple"
                        className="panelButton"
                        style={{ cursor: "not-allowed" }}
                      >
                        <span className="text">Add</span>
                        <span className="icon">
                          <i className="fa-solid fa-plus"></i>
                        </span>
                      </button> */}
                    {/* )} */}
                  </div>
                </div>
              </div>
              <div
                className="col-12"
                style={{ overflow: "auto", padding: "25px 20px 0" }}
              >
                {/* <div className="tableHeader">
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
                </div> */}
                <div className="tableContainer">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Members</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {noPermissionToRead &&
                        checkViewSidebar(
                          "Ringgroup",
                          slugPermissions,
                          account?.permissions,
                          "read"
                        ) ? ( */}
                        {/* <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>No Permission</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      ) : ( */}
                        <>
                          {loading ? (
                            <SkeletonTableLoader col={4} row={10} />
                          ) : (
                            <>
                           {groups &&
                                      groups?.map((item, index) => {
                                        return (
                                          <tr key={index}>
                                            <td>
                                              {item.group_name}
                                            </td>
                                            <td>
                                              <div className="hover-dropdown ">
                                                <div
                                                  style={{
                                                    color: "var(--ui-accent)",
                                                  }}
                                                  type="button"
                                                  data-bs-toggle="hover-dropdown "
                                                  aria-expanded="false"
                                                >
                                                  {/* {item.ring_group_destination.length} */}
                                                  <div className="avatar-container">
                                                    {item?.groupusers?.slice(0, 4).map((item, index) => {
                                                      return (
                                                        <Tippy key={index} content={item?.username}><i className="fa-light fa-user"></i></Tippy>
                                                      )
                                                    })}
                                                    {item?.groupusers
                                                    ?.length > 4 && <span>{item?.groupusers?.length-4}</span>}
                                                  </div>
                                                </div>
                                                <ul className="dropdown-menu light">
                                                  <li className="col-12">
                                                    <div className="dropdown-item fw-bold disabled">
                                                      Users
                                                    </div>
                                                  </li>
                                                  <div
                                                    style={{ columnCount: 1 }}
                                                  >
                                                    {item.groupusers.map(
                                                      (item, index) => (
                                                        <li>
                                                          <div className="dropdown-item" >
                                                            {item?.username}
                                                          </div>
                                                        </li>
                                                      )
                                                    )}
                                                  </div>
                                                  {/* {item.ring_group_destination.length > 6 && <li className="col-12">
                                                  <Link to="/agents" className="dropdown-item text-center text-primary">
                                                    Show More
                                                  </Link>
                                                </li>} */}
                                                </ul>
                                              </div>
                                            </td>
                                        
                                            {/* <td>(999) 999-9999, (999) 999-9999</td> */}
                                          
          
                                            <td>
                                              <button
                                                className="tableButton edit"
                                                // onClick={() =>
                                                //   navigate(
                                                //     `/ring-groups-edit?id=${item.id}`
                                                //   )
                                                // }
                                              >
                                                <i className="fa-solid fa-pencil" />
                                              </button>
                                            </td>
                                            <td>
                                              <button
                                                className="tableButton delete"
                                                onClick={() => {
                                                  setPopUp(true);
                                                  setDeleteId(item.id);
                                                }}
                                              >
                                                <i className="fa-solid fa-trash" />
                                              </button>
                                            </td>
                                            <div className="utilPopup"></div>
                                          </tr>
                                        );
                                      })}
                                    {groups &&
                                      groups?.data?.length === 0 ? (
                                      <td colSpan={99}>
                                        <EmptyPrompt
                                          name="Groups"
                                          link="groups-add"
                                        />
                                      </td>
                                    ) : (
                                      ""
                                    )}
                            </>
                          )}
                        </>
                      {/* )} */}
                    </tbody>
                  </table>
                </div>
                {popUp ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4 col-md-5">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-triangle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Warning!</h4>
                    <p>
                      {deleteId == ""
                        ? error
                        : "Are you sure you want to delete this group?"}
                    </p>
                    <div className="d-flex justify-content-between">
                      {deleteId !== ""  ? (
                        <button
                          disabled={loading}
                          className="panelButton m-0"
                          onClick={() => {
                            if (deleteId !== "") handleDelete(deleteId);
                            // else if (selectedRingGroup.id)
                            //   handleUpdateStatusRingGroup(selectedRingGroup.id);
                          }}
                        >
                          <span className="text">Confirm</span>
                          <span className="icon">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </button>
                      ) : (
                        <button
                          className="panelButton m-0"
                          // onClick={() => {
                          //   // setForce(true);
                          //   setPopUp(false);
                          //   navigate(`${redirectRoutes}`);
                          // }}
                        >
                          <span className="text">Lets Go!</span>
                          <span className="icon">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </button>
                      )}

                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setPopUp(false);
                          setDeleteId("");
                
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

                {/* <div className="tableHeader mb-3">
                  {ringGroup && ringGroup?.data?.length > 0 ? (
                    <PaginationComponent
                      pageNumber={(e) => setPageNumber(e)}
                      totalPage={ringGroup.last_page}
                      from={ringGroup.from}
                      to={ringGroup.to}
                      total={ringGroup.total}
                    />
                  ) : (
                    ""
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section></div>
  )
}
