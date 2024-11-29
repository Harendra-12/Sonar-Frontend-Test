import React, { useEffect, useState } from "react";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";

import Header from "../../CommonComponents/Header";
import CircularLoader from "../../Loader/CircularLoader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContentLoader from "../../Loader/ContentLoader";

function Roles() {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const rolesAndPermissionRefresh = useSelector(
    (state) => state.rolesAndPermissionRefresh
  );
  const roles = useSelector((state) => state.roles);
  const permissions = useSelector((state) => state.permissions);
  const [role, setRole] = useState();
  const [popup, setPopup] = useState(false);
  const [editClick, setEditClick] = useState(false);
  const [saveClick, setSaveClick] = useState(false);
  const [updateRole, setUpdateRole] = useState();
  const [editIndex, setEditIndex] = useState();
  const [newRole, setNewRole] = useState("");
  const [addRole, setAddRole] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState();
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState();
  const [selectedRole, setSelectedRole] = useState();
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [defaultPermission, setDefaultPermission] = useState();
  const navigate = useNavigate();

  // Getting the role and permission information at the very initial state
  // useEffect(() => {
  //   async function getData() {
  //     const apiData = await generalGetFunction(`/role/all`);
  //     const permissionData = await generalGetFunction("/permission");
  //     if (apiData.status) {
  //       setRole(apiData.data);
  //     }
  //     if (permissionData.status) {
  //       setDefaultPermission(permissionData.data);
  //     }
  //   }
  //   getData();
  // }, [refresh]);

  useEffect(() => {
    if (roles.length === 0) {
      setLoading(true);
    }
    dispatch({
      type: "SET_ROLES_PERMISSIONREFRESH",
      rolesAndPermissionRefresh: rolesAndPermissionRefresh + 1,
    });
  }, []);
  console.log("roles", roles);
  useEffect(() => {
    if (roles.length > 0) {
      setLoading(false);
    }
    setRole(roles);
    setDefaultPermission(permissions);
  }, [roles, permissions, rolesAndPermissionRefresh]);

  // Handle Role pop up confirm click
  async function handleSubmit() {
    setPopup(false);
    if (addRole) {
      if (newRole === "") {
        toast.error("Please enter new role");
      } else {
        setLoading(true);
        const parsedData = {
          name: newRole,
          // created_by:account.account_id
        };
        const apiData = await generalPostFunction("/role/store", parsedData);
        if (apiData?.status) {
          setLoading(false);
          // setRefresh(refresh + 1);
          dispatch({
            type: "SET_ROLES_PERMISSIONREFRESH",
            rolesAndPermissionRefresh: rolesAndPermissionRefresh + 1,
          });
          toast.success(apiData.message);
          setPopup(false);
          setSaveClick(false);
          setNewRole("");
          setAddRole(false);
        } else {
          setLoading(false);
          // const errorMessage = Object.keys(apiData.errors);
          // toast.error(apiData.errors[errorMessage[0]][0]);
        }
      }
    } else if (editClick) {
      if (updateRole === "") {
        toast.error("Please fill the role");
      } else {
        setLoading(true);
        const parsedData = {
          name: updateRole,
        };
        const apiData = await generalPutFunction(
          `/role/${role[editIndex].id}`,
          parsedData
        );
        if (apiData.status) {
          toast.success(apiData.message);
          setEditClick(false);
          setUpdateRole("");
          setLoading(false);
          setEditIndex();
        } else {
          setLoading(false);
          // const errorMessage = Object.keys(apiData.errors);
          // toast.error(apiData.errors[errorMessage[0]][0]);
        }
      }
    } else {
      setLoading(true);
      const apiData = await generalDeleteFunction(
        `/role/${role[deleteIndex].id}`
      );
      if (apiData?.status) {
        setEditClick(false);
        setDeleteIndex();
        toast.success(apiData.success);
        setLoading(false);
        dispatch({
          type: "SET_ROLES_PERMISSIONREFRESH",
          rolesAndPermissionRefresh: rolesAndPermissionRefresh + 1,
        });
      } else {
        setLoading(false);
        // const errorMessage = Object.keys(apiData.errors);
        // toast.error(apiData.errors[errorMessage[0]][0]);
      }
    }
  }

  // Handel permission check box click
  // const handleCheckboxChange = (id) => {
  //   if (selectedPermission.includes(id)) {
  //     setSelectedPermission(selectedPermission.filter((item) => item !== id));
  //   } else {
  //     setSelectedPermission([...selectedPermission, id]);
  //   }
  // };

  // Handle permission save click
  async function handlePermissionSave() {
    setLoading(true);
    const parsedData = {
      role_id: selectedRoleId,
      permissions: selectedPermission,
    };
    const apiData = await generalPostFunction(
      "/assign-permission-role",
      parsedData
    );
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      dispatch({
        type: "SET_ROLES_PERMISSIONREFRESH",
        rolesAndPermissionRefresh: rolesAndPermissionRefresh + 1,
      });
    } else {
      setLoading(false);
      // const errorMessage = Object.keys(apiData.errors);
      // toast.error(apiData.errors[errorMessage[0]][0]);
    }
  }

  // Filter out permissions base on the availabe id's inside user section
  const filterPermissionById = (data, idArray) => {
    const result = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const filteredItems = data[key].filter((item) =>
          idArray?.includes(item.id)
        );
        if (filteredItems.length > 0) {
          result[key] = filteredItems;
        }
      }
    }
    return result;
  };

  const filteredPermission = filterPermissionById(
    defaultPermission,
    account.permissions
  );

  // const [selectedPermission, setSelectedPermission] = useState([]);
  const [parentChecked, setParentChecked] = useState({});

  // Initialize parentChecked state
  useEffect(() => {
    const initialParentChecked = {};
    Object.keys(filteredPermission).forEach((item) => {
      initialParentChecked[item] = filteredPermission[item].every((innerItem) =>
        selectedPermission.includes(innerItem.id)
      );
    });
    setParentChecked(initialParentChecked);
  }, [selectedPermission]);

  // Handle permission check box click
  const handleCheckboxChange = (id) => {
    const newSelectedPermission = selectedPermission.includes(id)
      ? selectedPermission.filter((item) => item !== id)
      : [...selectedPermission, id];

    setSelectedPermission(newSelectedPermission);

    // Update parent checkbox state
    const updatedParentChecked = {};
    Object.keys(filteredPermission).forEach((item) => {
      updatedParentChecked[item] = filteredPermission[item].every((innerItem) =>
        newSelectedPermission.includes(innerItem.id)
      );
    });
    setParentChecked(updatedParentChecked);
  };

  const handleChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    // Regular expression to match only alphanumeric characters and spaces
    const validValue = value.replace(/[^a-zA-Z0-9\s]/g, "");

    // Update state with the filtered value
    setNewRole(validValue);
  };

  // Handle parent checkbox change
  const handleParentCheckboxChange = (item) => {
    const newParentChecked = !parentChecked[item];
    const newSelectedPermission = [...selectedPermission];

    filteredPermission[item].forEach((innerItem) => {
      const index = newSelectedPermission.indexOf(innerItem.id);
      if (newParentChecked) {
        if (index === -1) newSelectedPermission.push(innerItem.id);
      } else {
        if (index > -1) newSelectedPermission.splice(index, 1);
      }
    });

    setSelectedPermission(newSelectedPermission);
    setParentChecked({ ...parentChecked, [item]: newParentChecked });
  };
  return (
    <>
      <style>
        {`
      .masterSegment{
      position: sticky;
      top: 0px;
      }
      `}
      </style>

      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Roles" />
            </div>
          </div>
          <div className="col-xl-12">
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>List of Roles</h4>
                        <p>Edit existing user roles or add new ones.</p>
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
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        {account?.permissions?.includes(352) ? (
                          <button
                            onClick={() => {
                              setAddRole(true);
                              setEditClick(false);
                            }}
                            type="button"
                            effect="ripple"
                            className="panelButton"
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i class="fa-solid fa-plus"></i>
                            </span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            effect="ripple"
                            className="panelButton "
                            disabled
                            style={{ cursor: "not-allowed" }}
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i class="fa-solid fa-plus"></i>
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12" style={{ padding: "25px 23px" }}>
                  <div className="row masterList">
                    <div
                      className="col-xl-4 "
                      style={{ borderRight: "1px solid var(--border-color)" }}
                    >
                      <div className="masterSegment">
                        <ul>
                          {addRole ? (
                            <li>
                              <div className="col-xl-8 col-7">
                                <input
                                  type="text"
                                  value={newRole}
                                  // onChange={(e) => setNewRole(e.target.value)}
                                  onChange={handleChange}
                                  placeholder="Add new Role"
                                  //on enter press, add new role
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      setPopup(true);
                                      setSaveClick(true);
                                    }
                                  }}
                                ></input>
                              </div>
                              <div className="col-auto d-flex justify-content-end">
                                <button className="tableButton edit">
                                  <i
                                    className="fa-solid fa-check"
                                    onClick={() => {
                                      setPopup(true);
                                      setSaveClick(true);
                                    }}
                                  ></i>
                                </button>
                                <button className="tableButton delete ms-2">
                                  <i
                                    className="fa-solid fa-trash"
                                    onClick={() => {
                                      setAddRole(false);
                                      setNewRole("");
                                    }}
                                  ></i>
                                </button>
                              </div>
                            </li>
                          ) : (
                            ""
                          )}
                          {role &&
                            role.map((item, index) => {
                              return (
                                <li
                                  key={index}
                                  className={
                                    selectedRoleId === item.id ? "active" : ""
                                  }
                                >
                                  <div className="col-xl-8 col-7">
                                    <input
                                      type="text"
                                      placeholder={item.name}
                                      onChange={(e) =>
                                        setUpdateRole(e.target.value)
                                      }
                                      disabled={
                                        editIndex === index ? false : true
                                      }
                                    ></input>
                                  </div>
                                  <div className="col-auto d-flex justify-content-end">
                                    <button
                                      className={
                                        editIndex === index
                                          ? "tableButton edit"
                                          : "tableButton"
                                      }
                                    >
                                      {editIndex === index ? (
                                        <i
                                          className="fa-solid fa-check"
                                          onClick={() => {
                                            setPopup(true);
                                            setEditClick(true);
                                            setAddRole(false);
                                          }}
                                        ></i>
                                      ) : (
                                        <i
                                          className="fa-solid fa-pen-to-square"
                                          onClick={() => {
                                            setEditIndex(index);
                                          }}
                                        ></i>
                                      )}
                                    </button>
                                    <button className="tableButton delete mx-2">
                                      <i
                                        className="fa-solid fa-trash"
                                        onClick={() => {
                                          setPopup(true);
                                          setDeleteIndex(index);
                                          setEditClick(false);
                                          setAddRole(false);
                                        }}
                                      ></i>
                                    </button>
                                    <button className="tableButton">
                                      <i
                                        class="fa-solid fa-sliders"
                                        onClick={() => {
                                          setSelectedRoleId(item.id);
                                          setSelectedRole(item.name);
                                          setSelectedPermission(
                                            item.permissions?.map((item) => {
                                              return item.permission_id;
                                            })
                                          );
                                        }}
                                      ></i>
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                    {selectedRoleId && (
                      <div className="col-xl-8 pe-xl-0">
                        <div className="profileView p-0 pb-2 ">
                          <div className="profileDetailsHolder position-relative p-0 shadow-none border-0">
                            <div
                              className="col-xl-12"
                              style={{
                                position: "sticky",
                                top: 0,
                                backgroundColor: "var(--ele-color)",
                                zIndex: 9,
                              }}
                            >
                              <div class="headerCommon d-flex justify-content-between align-items-center pe-0">
                                <div class="col-5">
                                  Permissions for{" "}
                                  <span
                                    style={{
                                      color: "var(--ui-accent)",
                                      fontWeight: 600,
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {selectedRole}
                                  </span>
                                </div>

                                {selectedRole !== "Agent" && (
                                  <div className="col-auto text-end">
                                    <button
                                      className="panelButton ms-auto"
                                      onClick={handlePermissionSave}
                                    >
                                      <span className="text">Confirm</span>
                                      <span className="icon">
                                        <i class="fa-solid fa-check"></i>
                                      </span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            {selectedRole === "Agent" ? (
                              <div className="d-flex flex-column">
                                <span>
                                  This will apper only for agents (Agents will
                                  only access webrtc)
                                </span>
                                <div class="accordion permissionListWrapper">
                                  {filteredPermission &&
                                    Object.keys(filteredPermission).map(
                                      (item, key) => (
                                        <div
                                          className="accordion-item"
                                          key={key}
                                        >
                                          <h2
                                            class="accordion-header"
                                            id={`collapseHeading${key}`}
                                          >
                                            <button
                                              class="accordion-button collapsed"
                                              type="button"
                                              data-bs-toggle="collapse"
                                              data-bs-target={`#collapseRole${key}`}
                                              aria-expanded="true"
                                              aria-controls={`collapse${key}`}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={parentChecked[item]}
                                                onChange={() =>
                                                  handleParentCheckboxChange(
                                                    item
                                                  )
                                                }
                                              />

                                              <label>{item}</label>
                                            </button>
                                          </h2>
                                          {/* <div className="header d-flex align-items-center">
                                <div className="col-5">
                                  <input
                                    type="checkbox"
                                    checked={parentChecked[item]}
                                    onChange={() =>
                                      handleParentCheckboxChange(item)
                                    }
                                  />
                                  <label className="ms-2">{item}</label>
                                </div>
                              </div> */}
                                          <div
                                            id={`collapseRole${key}`}
                                            class="accordion-collapse collapse"
                                            aria-labelledby={`collapseHeading${key}`}
                                          >
                                            <div class="accordion-body">
                                              {filteredPermission[item].map(
                                                (innerItem, key) => (
                                                  <div
                                                    className="col-xl-2 col-md-4 col-6"
                                                    style={{ paddingLeft: 30 }}
                                                    key={key}
                                                  >
                                                    <input
                                                      type="checkbox"
                                                      id={`permission-${innerItem.id}`}
                                                      checked={selectedPermission.includes(
                                                        innerItem.id
                                                      )}
                                                      onChange={() =>
                                                        handleCheckboxChange(
                                                          innerItem.id
                                                        )
                                                      }
                                                    />
                                                    <label className="formLabel ms-2 text-capitalize">
                                                      {innerItem.action}
                                                    </label>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}
                                </div>
                              </div>
                            ) : (
                              <div class="accordion permissionListWrapper">
                                {filteredPermission &&
                                  Object.keys(filteredPermission).map(
                                    (item, key) => (
                                      <div className="accordion-item" key={key}>
                                        <h2
                                          class="accordion-header"
                                          id={`collapseHeading${key}`}
                                        >
                                          <button
                                            class="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapseRole${key}`}
                                            aria-expanded="true"
                                            aria-controls={`collapse${key}`}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={parentChecked[item]}
                                              onChange={() =>
                                                handleParentCheckboxChange(item)
                                              }
                                            />

                                            <label>{item}</label>
                                          </button>
                                        </h2>
                                        {/* <div className="header d-flex align-items-center">
                                <div className="col-5">
                                  <input
                                    type="checkbox"
                                    checked={parentChecked[item]}
                                    onChange={() =>
                                      handleParentCheckboxChange(item)
                                    }
                                  />
                                  <label className="ms-2">{item}</label>
                                </div>
                              </div> */}
                                        <div
                                          id={`collapseRole${key}`}
                                          class="accordion-collapse collapse"
                                          aria-labelledby={`collapseHeading${key}`}
                                        >
                                          <div class="accordion-body">
                                            {filteredPermission[item].map(
                                              (innerItem, key) => (
                                                <div
                                                  className="col-xl-2 col-md-4 col-6"
                                                  style={{ paddingLeft: 30 }}
                                                  key={key}
                                                >
                                                  <input
                                                    type="checkbox"
                                                    id={`permission-${innerItem.id}`}
                                                    checked={selectedPermission.includes(
                                                      innerItem.id
                                                    )}
                                                    onChange={() =>
                                                      handleCheckboxChange(
                                                        innerItem.id
                                                      )
                                                    }
                                                  />
                                                  <label className="formLabel ms-2 text-capitalize">
                                                    {innerItem.action}
                                                  </label>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {popup ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-circle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Warning!</h4>
                    {saveClick ? (
                      <p>
                        Are you sure you want to add this Role:{" "}
                        <b style={{ color: "var(--ui-accent)" }}>{newRole}</b>?
                      </p>
                    ) : editClick ? (
                      <p>
                        Are you sure you want to change{" "}
                        <b style={{ color: "var(--ui-accent)" }}>
                          {role[editIndex].name}
                        </b>{" "}
                        to{" "}
                        <b style={{ color: "var(--ui-accent)" }}>
                          {updateRole}
                        </b>
                        ?
                      </p>
                    ) : (
                      <p>
                        Are you sure you want to delete this{" "}
                        <b style={{ color: "var(--ui-accent)" }}>
                          {role[deleteIndex].name}
                        </b>{" "}
                        ?
                      </p>
                    )}

                    <div className="d-flex justify-content-between">
                      <button
                        className="panelButton m-0"
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        <span className="text">Confirm</span>
                        <span className="icon">
                          <i class="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setPopup(false);
                          setSaveClick(false);
                          setEditClick(false);
                          setEditIndex("");
                        }}
                      >
                        <span className="text">Cancel</span>
                        <span className="icon">
                          <i class="fa-solid fa-xmark"></i>
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
        {loading ? <CircularLoader /> : ""}
        {/* <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        /> */}
      </main>
    </>
  );
}

export default Roles;
