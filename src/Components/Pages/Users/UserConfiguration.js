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
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import CircularLoader from "../../Loader/CircularLoader";

/**
 * This component is used to configure the user settings and permissions.
 * It uses the UserEdit component to edit user settings and the permission
 * configuration component to edit the user's permissions.
 * The component also handles the back button click and the save button click.
 * When the user clicks the save button, the component sends a post request to the
 * assign-table-permissions API with the user details and the checked permissions.
 * If the request is successful then it will show a success toast message and otherwise
 * it will show an error toast message.
 */
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
  const [selectAll,setSelectAll]=useState(false)
  const[loading,setLoading]=useState(false)
  const location = useLocation();
  const locationState = location.state;

  useEffect(() => {
    const permissionData = async () => {
      try {
        const response = await generalGetFunction("/table-permission-all");
        setUserPermission(response?.data);
        const permissionData = permissionDataForAccordian(
          response?.data[Object.keys(response?.data)[0]]
        );
        // console.log({permissionData})
        setUserPermissionData(permissionData);
        setActiveUserPermission(Object.keys(response?.data)[0]);
        if (locationState.table_permissions.length > 0) {
          setCheckedUserPermissionData([...locationState.table_permissions]);
        }
      } catch (error) {}
    };
    permissionData();
  }, []);
/**
 * Function to set user permission data based on the selected accordion data.
 * This function will also reset the select all checkbox value to false.
 * @param {string} data
 */
  const handleSetUserPermissionData = (data) => {
    setSelectAll(false)
    // console.log(userPermission[data])
    const permissionData = permissionDataForAccordian(
     userPermission[data]
    );
    // console.log({permissionData})
    setUserPermissionData(permissionData);
    setActiveUserPermission(data);

  };
/**
 * Handle permission save button click.
 * This function will send a post request to the
 * assign-table-permissions API with the user details
 * and the checked permissions.
 * If the request is successful then it will show a
 * success toast message and otherwise it will show
 * an error toast message.
 */
  const handlePermissionSave = async () => {
    const payload = {
      ...usersDetails,
      tb_permissions: checkedUserPermissionData,
    };
    try {
      setLoading(true)
      const res = await generalPostFunction(
        "/assign-table-permissions ",
        payload
      );
      if (res?.status) {
        setLoading(false)
        toast.success("Assigned Permissions Successfully");
      }
    } catch (error) {
      setLoading(false)
    }
  };
  //  function to add permission data for Accordian
  function permissionDataForAccordian(data) {
    const resultMap = new Map();

    data.forEach((item) => {
      const key = `${item.tb_model}-${item.tb_name}-${item.column_name}`;

      if (!resultMap.has(key)) {
        resultMap.set(key, {
          column_name: item.column_name,
          tb_name: item.tb_name,
          tb_model: item.tb_model,
          all_action: [],
        });
      }

      const existingItem = resultMap.get(key);

      // Add all actions (including view) to all_action array
      existingItem.all_action.push({
        action: item.action,
        id: item.id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      });
    });

    return Array.from(resultMap.values());
  }
  return (
    <>
      {loading?<CircularLoader/>:<main className="mainContent">
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
                                                    className={`savedCardWrapper col ${
                                                      activeUserPermission ===
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
                                    <div className="col-xl-6">
                                      {isEditable && (
                                        <>
                                          <div className="profileView p-0">
                                            <div className="profileDetailsHolder position-relative p-0 shadow-none border-0">
                                              <div className="col-xl-12">
                                                <div className="headerCommon d-flex align-items-center">
                                                <div className="col d-flex justify-content-between">
                                                    Permissions for Role{" "}
                                                    <span
                                                      style={{
                                                        color:
                                                          "var(--ui-accent)",
                                                        fontWeight: 600,
                                                      }}
                                                
                                                    >
                                                      {/* {selectedRole} */}
                                                    
                                                      <div><span className="m-3">Select All</span><input type="checkbox" checked={selectAll} onChange={(e)=>{
                                                        if(e.target.checked){
                                                          setSelectAll(true)
                                                          userPermissionData.map((item)=>{
                                                           
                                                            setCheckedUserPermissionData(
                                                              (pre) => [
                                                                ...pre,
                                                                ...item?.all_action.map(
                                                                  (
                                                                    action
                                                                  ) =>
                                                                    action?.id
                                                                ),
                                                              ])
                                                          })
                                                        }else{
                                                          setSelectAll(false)
                                                          setCheckedUserPermissionData([])
                                                        }
                                                      }}/></div>
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="accordion permissionListWrapper" key={activeUserPermission}>
                                                {userPermissionData &&
                                                  userPermissionData.map(
                                                    (item, key) => (
                                                      <div className="accordion-item">
                                                        <h2
                                                          className="accordion-header"
                                                          id={`collapseHeading${key}`}
                                                        >
                                                          <button
                                                            className="accordion-button collapsed"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={`#collapseRole${key}`}
                                                            aria-expanded="true"
                                                            aria-controls={`collapse${key}`}
                                                          >
                                                            <input
                                                              type="checkbox"
                                                              checked={item?.all_action?.every(
                                                                (action) =>
                                                                  checkedUserPermissionData.includes(
                                                                    action?.id
                                                                  )
                                                              )}
                                                              onChange={(e) => {
                                                                if (
                                                                  e.target
                                                                    .checked
                                                                ) {
                                                                  setCheckedUserPermissionData(
                                                                    (pre) => [
                                                                      ...pre,
                                                                      ...item?.all_action.map(
                                                                        (
                                                                          action
                                                                        ) =>
                                                                          action?.id
                                                                      ),
                                                                    ]
                                                                  );
                                                                } else {
                                                                  setCheckedUserPermissionData(
                                                                    (prev) =>
                                                                      prev.filter(
                                                                        (id) =>
                                                                          !item?.all_action.some(
                                                                            (
                                                                              action
                                                                            ) =>
                                                                              action?.id ===
                                                                              id
                                                                          )
                                                                      )
                                                                  );
                                                                }
                                                              }}
                                                            />

                                                            <label>
                                                              {item.column_name.replace(
                                                                /[_-]/g,
                                                                " "
                                                              )}
                                                            </label>
                                                          </button>
                                                        </h2>
                                                        <div
                                                          id={`collapseRole${key}`}
                                                          className="accordion-collapse collapse"
                                                          aria-labelledby={`collapseHeading${key}`}
                                                        >
                                                          <div className="accordion-body justify-content-start">
                                                            {item?.all_action?.map(
                                                              (action) => {
                                                                return (
                                                                  <div className="col-xl-2 col-md-4 col-6" >
                                                                    <input
                                                                      type="checkbox"
                                                                      checked={checkedUserPermissionData.includes(
                                                                        action?.id
                                                                      )}
                                                                      onChange={(
                                                                        e
                                                                      ) => {
                                                                        if (
                                                                          e
                                                                            .target
                                                                            .checked
                                                                        ) {
                                                                          setCheckedUserPermissionData(
                                                                            (
                                                                              pre
                                                                            ) => [
                                                                              ...pre,
                                                                              action?.id,
                                                                            ]
                                                                          );
                                                                        } else {
                                                                          const newCheck =
                                                                            checkedUserPermissionData.filter(
                                                                              (
                                                                                id
                                                                              ) =>
                                                                                id !==
                                                                                action?.id
                                                                            );
                                                                          setCheckedUserPermissionData(
                                                                            newCheck
                                                                          );
                                                                        }
                                                                      }}
                                                                    />
                                                                    <label className="formLabel ms-2 text-capitalize">
                                                                      {
                                                                        action?.action
                                                                      }
                                                                    </label>
                                                                  </div>
                                                                );
                                                              }
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                              </div>
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
      </main>}
    </>
  );
}

export default UserConfiguration;
