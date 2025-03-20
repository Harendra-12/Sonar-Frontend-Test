/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { toast } from "react-toastify";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useLocation, useNavigate } from "react-router-dom";
import UsersEdit from "./UsersEdit";

function UserConfiguration() {
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(true);
  const [userPermission, setUserPermission] = useState([]);
  const [userPermissionData, setUserPermissionData] = useState([]);
  const [activeUserPermission, setActiveUserPermission] = useState([]);
  const [usersDetails, setUsersDetails] = useState({
    user_id: "",
    role_id: "",
  });
  const [checkedUserPermissionData, setCheckedUserPermissionData] = useState(
    []
  );
  const location = useLocation();
  const locationState = location.state;

  useEffect(() => {
    const permissionData = async () => {
      try {
        const response = await generalGetFunction("/table-permission-all");
        setUserPermission(response?.data);
        setUserPermissionData(response?.data[Object.keys(response?.data)[0]]);
        setActiveUserPermission(Object.keys(response?.data)[0]);
        if (locationState.table_permissions.length > 0) {
          setCheckedUserPermissionData([...locationState.table_permissions])
        }
      } catch (error) {
      }
    };
    permissionData();
  }, []);
  const handleSetUserPermissionData = (data) => {
    setUserPermissionData(userPermission[data]);
    setActiveUserPermission(data);
  };
  const handlePermissionSave = async () => {
    const payload = {
      ...usersDetails,
      tb_permissions: checkedUserPermissionData,
    };
    try {
      const res = await generalPostFunction(
        "/assign-table-permissions ",
        payload
      );
      if (res?.status) {
        toast.success("Assigned Permissions Successfully");
      }
    } catch (error) {
    }
  };
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="User Configuration" />
          </div>
          <div className="col-xl-12" style={{ overflow: "auto" }}>
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>User Configuration</h4>
                        <p>
                          Edit the configuration of the user including settings
                          and permissions.
                        </p>
                      </div>
                      <div className="buttonGroup">
                        <button
                          onClick={() => {
                            navigate(-1);
                            backToTop();
                          }}
                          type="button"
                          effect="ripple"
                          className="panelButton gray"
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="col-12 formScroller"
                  style={{ padding: "25px 23px" }}
                >
                  <nav className="tangoNavs">
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="nav-user-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-user"
                        type="button"
                        role="tab"
                        aria-controls="nav-user"
                        aria-selected="true"
                      >
                        User Settings
                      </button>
                      <button
                        className="nav-link"
                        id="nav-exten-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-exten"
                        type="button"
                        role="tab"
                        aria-controls="nav-exten"
                        aria-selected="false"
                      >
                        Permissions Configuration
                      </button>
                    </div>
                  </nav>
                  <div
                    className="tab-content"
                    id="nav-tabContent"
                    style={{
                      border: "1px solid var(--border-color)",
                      borderTop: "none",
                      borderRadius: "0 0 5px 5px",
                    }}
                  >
                    <div
                      className="tab-pane fade show active"
                      id="nav-user"
                      role="tabpanel"
                      aria-labelledby="nav-user-tab"
                      tabindex="0"
                    >
                      <UsersEdit
                        page="marginleftAdjust"
                        setUsersDetails={setUsersDetails}
                      />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-exten"
                      role="tabpanel"
                      aria-labelledby="nav-exten-tab"
                      tabindex="0"
                    >
                      <main className="mainContent ms-0">
                        <section id="phonePage">
                          <div className="col-xl-12">
                            <div className="overviewTableWrapper">
                              <div className="overviewTableChild">
                                <div
                                  className="d-flex flex-wrap"
                                  style={{
                                    position: "sticky",
                                    top: "0",
                                    zIndex: "9",
                                  }}
                                >
                                  <div className="col-12">
                                    <div className="heading">
                                      <div className="content">
                                        <h4>Permissions Edit</h4>
                                        <p>
                                          Edit user's permission to view or edit
                                          pages.
                                        </p>
                                      </div>
                                      <div className="buttonGroup">
                                        <button
                                          onClick={() => {
                                            navigate(-1);
                                            backToTop();
                                          }}
                                          type="button"
                                          effect="ripple"
                                          className="panelButton gray"
                                        >
                                          <span className="text">Back</span>
                                          <span className="icon">
                                            <i className="fa-solid fa-caret-left"></i>
                                          </span>
                                        </button>
                                        <button
                                          type="button"
                                          effect="ripple"
                                          className="panelButton"
                                          onClick={() => handlePermissionSave()}
                                        >
                                          <span className="text">Save</span>
                                          <span className="icon">
                                            <i className="fa-solid fa-floppy-disk"></i>
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className="col-12"
                                  style={{ padding: "25px 23px" }}
                                >
                                  <div className="row gx-5">
                                    <div
                                      className="col-xl-6"
                                      style={{
                                        borderRight:
                                          "1px solid var(--border-color)",
                                      }}
                                    >
                                      <div className="header">
                                        <div
                                          className="col fw-bold"
                                          style={{ fontFamily: '"Noto Sans"' }}
                                        >
                                          Edit User Visibility of the following
                                          features!
                                        </div>
                                      </div>
                                      <div className="col-xl-12">
                                        {Object.keys(userPermission).map(
                                          (item) => {
                                            return (
                                              <div
                                                className="col-xl-12 pt-3"
                                                onClick={() =>
                                                  handleSetUserPermissionData(
                                                    item
                                                  )
                                                }
                                              >
                                                <div className="d-flex justify-content-center align-items-center">
                                                  <div
                                                    className={`savedCardWrapper col ${activeUserPermission ===
                                                      item
                                                      ? "active"
                                                      : ""
                                                      }`}
                                                  >
                                                    <div>
                                                      <label>{item}</label>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                    <div
                                      className="col-xl-6"
                                    >
                                      {isEditable && (
                                        <>
                                          <div className="header">
                                            <div
                                              className="col fw-bold"
                                              style={{
                                                fontFamily: '"Noto Sans"',
                                              }}
                                            >
                                              Choose what should be visible
                                            </div>
                                          </div>
                                          <div className="col-xl-12">
                                            <div className="row" style={{ height: '400px', overflowY: 'scroll' }}>
                                              {userPermissionData && userPermissionData.map(
                                                (item) => {
                                                  return (
                                                    <div
                                                      className="formRow col-6 pb-0"
                                                      key={item?.id}
                                                      style={{ minHeight: '15px' }}
                                                    >
                                                      <div className="formLabel" style={{ maxWidth: '90%' }}>
                                                        <label htmlFor="" style={{ whiteSpace: 'break-spaces', wordBreak: 'break-word', textTransform: 'capitalize' }}>
                                                          {item.column_name.replace(/[_-]/g, " ")} - <span className="fw-bold">{item?.action}</span>
                                                        </label>
                                                      </div>
                                                      <div className="col-auto">
                                                        <input
                                                          type="checkbox"
                                                          checked={checkedUserPermissionData.includes(
                                                            item?.id
                                                          )}
                                                          onChange={(e) => {
                                                            if (
                                                              e.target.checked
                                                            ) {
                                                              setCheckedUserPermissionData(
                                                                (pre) => [
                                                                  ...pre,
                                                                  item?.id,
                                                                ]
                                                              );
                                                            } else {
                                                              const newCheck =
                                                                checkedUserPermissionData.filter(
                                                                  (id) =>
                                                                    id !==
                                                                    item?.id
                                                                );
                                                              setCheckedUserPermissionData(
                                                                newCheck
                                                              );
                                                            }
                                                          }}
                                                        />
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </main>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default UserConfiguration;
