import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Link, useNavigate } from "react-router-dom";
import { backToTop, checkViewSidebar, featureUnderdevelopment, generalDeleteFunction, generalGetFunction } from "../../GlobalFunction/globalFunction";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

function AccessControl() {
  const [accessControlList, setAccessControlList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [refreshState, setRefreshState] = useState(false);
  const slugPermissions = useSelector((state) => state?.permissions);
  const account = useSelector((state) => state.account);
  const navigate = useNavigate()

  const fetchData = async (shouldLoad) => {
    if (shouldLoad) {
      setLoading(true);
    }

    const apiData = await generalGetFunction("/ip-whitelists")
    if (apiData.status) {
      setAccessControlList(apiData.data)
      setLoading(false)
      setRefreshState(false)
    } else {
      setLoading(false)
      setRefreshState(false)
    }
  }

  useEffect(() => {
    const shouldLoad = true;
    setRefreshState(true)
    fetchData(shouldLoad)
  }, [])

  async function handleDelete(id) {
    setLoading(true);
    setDeletePopup(false);
    const apidata = await generalDeleteFunction(`/delete-all-ip-whitelists/${deleteId}`)
    if (apidata.status) {
      const newArray = accessControlList.filter((item) => item.id !== id);
      setAccessControlList(newArray);
      setDeleteId('');
      toast.success(apidata.message);
      setLoading(false);
    } else {
      setDeleteId('');
      toast.error(apidata.error);
      setLoading(false);
    }
  }

  const handleRefreshBtnClicked = () => {
    setRefreshState(true)
    const shouldLoad = false;
    fetchData(shouldLoad)
  }

  return (
    <>
      <div className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Access Control List" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Access Control {" "}
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
                          <p>You can see all list of access control</p>
                        </div>
                        <div className="buttonGroup">
                          <button
                            onClick={() => { navigate(-1); backToTop() }}
                            className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          {checkViewSidebar("AccessControlNode", slugPermissions, account?.permissions, "add") ? (<button
                            onClick={() => { navigate("/access-control-list-add"); backToTop() }}
                            className="panelButton"
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i className="fa-solid fa-plus"></i>
                            </span>
                          </button>) : (
                            <button
                              disabled
                              className="panelButton"
                              style={{ cursor: "not-allowed" }}
                            >
                              <span className="text">Add</span>
                              <span className="icon">
                                <i className="fa-solid fa-plus"></i>
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ overflow: "auto", padding: "10px 20px 0px" }}
                    >
                      <div className="tableContainer">
                        {loading ? (
                          // <SkeletonTableLoader col={5} row={15} />
                          <ThreeDotedLoader />
                        ) :
                          <table>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>List</th>
                                <th>Role</th>
                                {checkViewSidebar("AccessControl", slugPermissions, account?.sectionPermissions, account?.permissions, "edit") && <th className="text-center">Edit</th>}
                                {checkViewSidebar("AccessControl", slugPermissions, account?.sectionPermissions, account?.permissions, "delete") && <th className="text-center" >Delete</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {
                                checkViewSidebar("AccessControl", slugPermissions, account?.sectionPermissions, account?.permissions, "read") ?
                                  (
                                    <>
                                      {
                                        accessControlList.length > 0 ?
                                          <>
                                            {
                                              accessControlList.map((item, key) => {
                                                return (
                                                  <tr key={key}>
                                                    <td>{item.name}</td>
                                                    <td>
                                                      {item.description}
                                                    </td>
                                                    <td>{item?.role?.name}</td>
                                                    {checkViewSidebar("AccessControl", slugPermissions, account?.sectionPermissions, account?.permissions, "edit") &&
                                                      <td onClick={() => navigate(
                                                        `/access-control-list-edit?id=${item.id}`, { state: item }
                                                      )}>
                                                        <button className="tableButton edit mx-auto">
                                                          <i className="fa-solid fa-pencil" />
                                                        </button>
                                                      </td>}
                                                    {checkViewSidebar("AccessControl", slugPermissions, account?.sectionPermissions, account?.permissions, "delete") &&
                                                      <td onClick={() => { setDeletePopup(true); setDeleteId(item.id) }}>
                                                        <button className="tableButton delete mx-auto">
                                                          <i className="fa-solid fa-trash" />
                                                        </button>
                                                      </td>}
                                                  </tr>
                                                )
                                              })
                                            }
                                          </>
                                          : <td colSpan={99}>
                                            <EmptyPrompt
                                              name="Access Control List"
                                              link="access-control-list-add"
                                            />
                                          </td>
                                      }
                                    </>
                                  ) :
                                  <tr>
                                    <td colSpan={99} className="text-center">You dont have any permission</td>
                                  </tr>
                              }
                            </tbody>
                          </table>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {deletePopup ? (
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
                    Are you sure you want to delete this access control?
                  </p>
                  <div className="d-flex justify-content-between">

                    <button
                      disabled={loading}
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
                      onClick={() => setDeletePopup(false)}
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
    </>
  );
}

export default AccessControl;
