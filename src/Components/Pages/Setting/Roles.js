/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  backToTop,
  generalDeleteFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import Header from "../../CommonComponents/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";

function Roles() {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);
  const rolesRefresh = useSelector((state) => state.rolesRefresh);
  const permissionRefresh = useSelector((state) => state.permissionRefresh);
  const roles = useSelector((state) => state.roles);
  const permissions = useSelector((state) => state.permissions);
  const [role, setRole] = useState();
  const [popup, setPopup] = useState(false);
  const [submitPopup, setSubmitPopup] = useState(false);
  const [editClick, setEditClick] = useState(false);
  const [saveClick, setSaveClick] = useState(false);
  const [updateRole, setUpdateRole] = useState();
  const [editIndex, setEditIndex] = useState();
  const [newRole, setNewRole] = useState("");
  const [addRole, setAddRole] = useState(false);
  const [addRolePopup, setAddRolePopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState();
  const [selectedIsDefault, setSelectedIsDefault] = useState(null);
  const [selectedRole, setSelectedRole] = useState();
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [defaultPermission, setDefaultPermission] = useState();
  const [parentChecked, setParentChecked] = useState({});
  //  add new role state
  const [addNewRolePermissions, setAddNewRolePermissions] = useState(null);
  const [addNewRoleParentChecked, setAddNewRoleParentChecked] = useState({});
  const [addSelectedRoleId, setAddSelectedRoleId] = useState("");
  const [newAddedRoleId, setNewAddedRoleId] = useState(null);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // Getting roles and permission data from redux by trigger its api calling by changing its refresh value
  useEffect(() => {
    if (roles.length === 0) {
      setLoading(true);
    }
    dispatch({
      type: "SET_ROLES_REFRESH",
      rolesRefresh: rolesRefresh + 1,
    });
    dispatch({
      type: "SET_PERMISSION_REFRESH",
      permissionRefresh: permissionRefresh + 1,
    });
    if (roles.length > 0) {
      setLoading(false);
      setSelectedRoleId(roles[0]?.id);
      setSelectedRole(roles[0]?.name);
      setSelectedIsDefault(roles[0]?.is_default);
      setSelectedPermission(
        roles[0]?.permissions?.map((item) => {
          return item.permission_id;
        })
      );
    } else {
      setLoading(true);
    }
  }, []);

  // Handle roles select and set default permission
  useEffect(() => {
    if (roles.length > 0) {
      setLoading(false);
      setSelectedRoleId(roles[0]?.id);
      setSelectedIsDefault(roles[0]?.is_default);
      setSelectedRole(roles[0]?.name);
      setSelectedPermission(
        roles[0]?.permissions?.map((item) => {
          return item.permission_id;
        })
      );
    }
    setRole(roles);
    setDefaultPermission(permissions);
  }, [roles, permissions, rolesRefresh, permissionRefresh]);

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
        const initialParentChecked = {};
        Object.keys(filteredPermission).forEach((item) => {
          initialParentChecked[item] = filteredPermission[item].every(
            (innerItem) => addNewRolePermissions.includes(innerItem.id)
          );
        });
        setAddNewRoleParentChecked(initialParentChecked);
        if (apiData?.status) {
          setLoading(false);
          // setRefresh(refresh + 1);
          dispatch({
            type: "SET_ROLES_REFRESH",
            rolesRefresh: rolesRefresh + 1,
          });
          setNewAddedRoleId(apiData.data.id);
          toast.success(apiData.message);
          setSubmitPopup(true);
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
          type: "SET_ROLES_REFRESH",
          rolesRefresh: rolesRefresh + 1,
        });
        setSelectedRole();
        setSelectedRoleId();
      } else {
        setLoading(false);
        // const errorMessage = Object.keys(apiData.errors);
        // toast.error(apiData.errors[errorMessage[0]][0]);
      }
    }
  }

  // Handle permission save click
  async function handlePermissionSave(isNewRole) {
    setLoading(true);
    if (isNewRole) {
      setSubmitPopup(false);
    }

    const parsedData = isNewRole
      ? {
        role_id: newAddedRoleId,
        permissions: addNewRolePermissions,
      }
      : {
        role_id: selectedRoleId,
        permissions: selectedPermission,
      };
    try {
      const apiData = await generalPostFunction(
        "/assign-permission-role",
        parsedData
      );

      if (apiData?.status) {
        toast.success(apiData.message);
        dispatch({
          type: "SET_ROLES_REFRESH",
          rolesRefresh: rolesRefresh + 1,
        });
        if (isNewRole) {
          setAddNewRoleParentChecked({});
          setAddNewRolePermissions([]);
        }
      } else {
        // const errorMessage = Object.keys(apiData.errors);
        // toast.error(apiData.errors[errorMessage[0]][0]);
      }
    } catch (error) {
      // Handle any potential errors here
      console.error("An error occurred while saving permissions:", error);
      // toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
  const handleSubmitCheckboxChange = (id) => {
    const newSelectedPermission = addNewRolePermissions.includes(id)
      ? addNewRolePermissions.filter((item) => item !== id)
      : [...addNewRolePermissions, id];
    setAddNewRolePermissions(newSelectedPermission);
    // Update parent checkbox state
    const updatedParentChecked = {};
    Object.keys(filteredPermission).forEach((item) => {
      updatedParentChecked[item] = filteredPermission[item].every((innerItem) =>
        newSelectedPermission.includes(innerItem.id)
      );
    });
    setAddNewRoleParentChecked(updatedParentChecked);
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
  const handleSubmitParentCheckboxChange = (item) => {
    const newParentChecked = !addNewRoleParentChecked[item];
    const newSelectedPermission = [...addNewRolePermissions];
    filteredPermission[item].forEach((innerItem) => {
      const index = newSelectedPermission.indexOf(innerItem.id);
      if (newParentChecked) {
        if (index === -1) newSelectedPermission.push(innerItem.id);
      } else {
        if (index > -1) newSelectedPermission.splice(index, 1);
      }
    });
    setAddNewRolePermissions(newSelectedPermission);
    setAddNewRoleParentChecked({
      ...addNewRoleParentChecked,
      [item]: newParentChecked,
    });
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
            {loading ? (
              <SkeletonFormLoader />
            ) : (
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
                                setAddRolePopup(true);
                                setEditClick(false);
                                setAddSelectedRoleId("");
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
                            {/* {addRole ? (
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
                            )} */}
                            {role &&
                              role.map((item, index) => {
                                return (
                                  <li
                                    key={index}
                                    onClick={() => {
                                      setSelectedRoleId(item.id);
                                      setSelectedRole(item.name);
                                      setSelectedIsDefault(
                                        () => item?.is_default
                                      );
                                      setSelectedPermission(
                                        item?.permissions?.map((item) => {
                                          return item.permission_id;
                                        })
                                      );
                                    }}
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
                                        ref={(el) =>
                                          (inputRefs.current[index] = el)
                                        }
                                      ></input>
                                    </div>
                                    <div className="col-auto d-flex justify-content-end" >
                                      {item.is_default === 0 ? (
                                        <div className="d-flex justify-content-end">
                                          <button
                                            className={
                                              editIndex === index
                                                ? "tableButton edit"
                                                : "tableButton"
                                            }
                                          >
                                            {editIndex === index ? (
                                              <Tippy content="Save Updated Role title">
                                                <i
                                                  className="fa-solid fa-check"
                                                  onClick={() => {
                                                    setPopup(true);
                                                    setEditClick(true);
                                                    setAddRole(false);
                                                  }}
                                                ></i>
                                              </Tippy>
                                            ) : (
                                              <Tippy content="Edit Role title">
                                                <i
                                                  className="fa-solid fa-pen-to-square"
                                                  onClick={() => {
                                                    setTimeout(() => {
                                                      inputRefs.current[
                                                        index
                                                      ]?.focus(); // Focus on the specific input
                                                    }, 0);
                                                    setEditIndex(index);
                                                    setSelectedRoleId(item.id);
                                                    setSelectedRole(item.name);
                                                    setSelectedPermission(
                                                      item?.permissions?.map(
                                                        (item) => {
                                                          return item.permission_id;
                                                        }
                                                      )
                                                    );
                                                  }}
                                                ></i>
                                              </Tippy>
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
                                                setSelectedRoleId(item.id);
                                                setSelectedRole(item.name);
                                                setSelectedPermission(
                                                  item.permissions?.map(
                                                    (item) => {
                                                      return item.permission_id;
                                                    }
                                                  )
                                                );
                                              }}
                                            ></i>
                                          </button>
                                        </div>
                                      ) : (
                                        <></>
                                      )}
                                      <button className="tableButton">
                                        <i
                                          class="fa-solid fa-sliders"
                                          onClick={() => {
                                            setSelectedRoleId(item.id);
                                            setSelectedRole(item.name);
                                            setSelectedIsDefault(
                                              () => item?.is_default
                                            );
                                            setSelectedPermission(
                                              item?.permissions?.map((item) => {
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
                                  {selectedIsDefault === 1 ? (
                                    <></>
                                  ) : (
                                    <>
                                      {" "}
                                      <div className="col-auto text-end">
                                        <button
                                          className="panelButton ms-auto"
                                          onClick={() =>
                                            handlePermissionSave(false)
                                          }
                                        >
                                          <span className="text">Confirm</span>
                                          <span className="icon">
                                            <i class="fa-solid fa-check"></i>
                                          </span>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              {selectedRole === "Agent" ? (
                                <div className="d-flex flex-column">
                                  <span>
                                    This will apper only for agents (Agents will
                                    only access webrtc)
                                  </span>
                                  <div class="accordion permissionListWrapper h-auto">
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
                                            <div
                                              id={`collapseRole${key}`}
                                              class="accordion-collapse collapse"
                                              aria-labelledby={`collapseHeading${key}`}
                                            >
                                              <div class="accordion-body">
                                                {filteredPermission[item].map(
                                                  (innerItem, key) => (
                                                    <div
                                                      className="col-xxl col-auto col-md-4 col-6"
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
                                <div class="accordion permissionListWrapper h-auto">
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
                                          <div
                                            id={`collapseRole${key}`}
                                            class="accordion-collapse collapse"
                                            aria-labelledby={`collapseHeading${key}`}
                                          >
                                            <div class="accordion-body">
                                              {filteredPermission[item].map(
                                                (innerItem, key) => (
                                                  <div
                                                    className="col-xxl col-auto col-md-4 col-6"
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
            )}
          </div>
        </section>
        {/*  Add new role */}
        {popup ? (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xxl-4 col-xl-5 col-xl-5 col-md-5">
                  <div className="col-2 px-0">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-circle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">

                    {saveClick ? (
                      <div >
                        <h4>
                          Choose template permission!
                        </h4>
                        <p className="mt-1 mb-0">You need to choose a template from the list below</p>
                        <div className="mt-2 mb-3">
                          <select
                            className="col-8 formItem"
                            value={addSelectedRoleId || ""}
                            name=""
                            onChange={(e) => {
                              const roleName = roles.find(
                                (item) => item.id == e.target.value
                              );
                              const selectedFilteredPermission =
                                roleName?.permissions?.map((item) => {
                                  return item.permission_id;
                                });
                              setAddNewRolePermissions(
                                selectedFilteredPermission
                              );
                              setAddSelectedRoleId(e.target.value);
                            }}
                          >
                            <option value="" disabled>
                              Please Select Template
                            </option>
                            {roles.map((item, key) => {
                              return (
                                <option value={item.id} key={key}>
                                  {item.name}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        {/* <div className="mt-3">
                          <p>
                            Are you sure you want to add this Role:{" "}
                            <b style={{ color: "var(--ui-accent)" }}>{newRole}</b>
                            ?
                          </p>
                        </div> */}
                      </div>
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
                      <>
                        <h4>Confirmation</h4>
                        <p className="mt-1">
                          Are you sure you want to delete this role:{" "}
                          <b style={{ color: "var(--ui-accent)" }}>
                            {role[deleteIndex].name}
                          </b>{" "}
                          ?
                        </p>
                      </>
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
        {/* set permissions of new role */}
        {submitPopup ? (
          <div className="addNewContactPopup profileDetailsHolder">
            <div className="row">
              <div className="col-12 heading mb-0">
                <i className="fa-light fa-user-plus" />
                <h5>Select Permissions for this Role</h5>
              </div>
              <div>
                <div class="accordion permissionListWrapper ">
                  {selectedRole === "Agent" ? (
                    <div className="d-flex flex-column">
                      <span>
                        This will apper only for agents (Agents will only
                        access webrtc)
                      </span>
                      <div class="accordion permissionListWrapper ">
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
                                      checked={
                                        addNewRoleParentChecked[item]
                                      }
                                      onChange={() =>
                                        handleSubmitParentCheckboxChange(
                                          item
                                        )
                                      }
                                    />

                                    <label>{item}</label>
                                  </button>
                                </h2>
                                <div
                                  id={`collapseRole${key}`}
                                  class="accordion-collapse collapse"
                                  aria-labelledby={`collapseHeading${key}`}
                                >
                                  <div class="accordion-body">
                                    {filteredPermission[item].map(
                                      (innerItem, key) => (
                                        <div
                                          className="col-6"
                                          key={key}
                                        >
                                          <input
                                            type="checkbox"
                                            id={`permission-${innerItem.id}`}
                                            checked={addNewRolePermissions?.includes(
                                              innerItem.id
                                            )}
                                            onChange={() =>
                                              handleSubmitCheckboxChange(
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
                    <div class="accordion permissionListWrapper h-auto">
                      {filteredPermission &&
                        Object.keys(filteredPermission).map((item, key) => (
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
                                  checked={addNewRoleParentChecked[item]}
                                  onChange={() =>
                                    handleSubmitParentCheckboxChange(item)
                                  }
                                />

                                <label>{item}</label>
                              </button>
                            </h2>
                            <div
                              id={`collapseRole${key}`}
                              class="accordion-collapse collapse"
                              aria-labelledby={`collapseHeading${key}`}
                            >
                              <div class="accordion-body">
                                {filteredPermission[item].map(
                                  (innerItem, key) => (
                                    <div
                                      className="col-xxl col-auto col-md-4 col-6"
                                      key={key}
                                    >
                                      <input
                                        type="checkbox"
                                        id={`permission-${innerItem.id}`}
                                        checked={addNewRolePermissions.includes(
                                          innerItem.id
                                        )}
                                        onChange={() =>
                                          handleSubmitCheckboxChange(
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
                        ))}
                    </div>
                  )}
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <button
                    className="panelButton m-0"
                    onClick={() => {
                      handlePermissionSave(true);
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
                      setSubmitPopup(false);
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
        ) : (
          ""
        )}

        {addRole ? addRolePopup && (
          <>
            <div className="popup">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className="row content col-xxl-4 col-xl-5 col-md-5">
                    <div className="col-2 px-0">
                      <div className="iconWrapper">
                        <i className="fa-duotone fa-circle-exclamation"></i>
                      </div>
                    </div>
                    <div className="col-10 ps-0">
                      <div >
                        <h4>
                          Please type the name of new role below
                        </h4>
                      </div>
                      <div className="my-2">
                        <input
                          type="text"
                          value={newRole}
                          className="formItem"
                          // onChange={(e) => setNewRole(e.target.value)}
                          onChange={handleChange}
                          placeholder="Add new Role"
                          //on enter press, add new role
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              setPopup(true);
                              setSaveClick(true);
                              setAddRolePopup(false);
                            }
                          }}
                        ></input>
                      </div>
                      <div className="d-flex justify-content-between">
                        <button
                          className="panelButton m-0"
                          onClick={() => {
                            setPopup(true);
                            setSaveClick(true);
                            setAddRolePopup(false);
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
                            setAddRole(false);
                            setNewRole("");
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
          </>
        ) : (
          ""
        )}
      </main>
    </>
  );
}

export default Roles;
