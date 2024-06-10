import React, { useEffect, useState } from "react";
import {
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../CommonComponents/Header";
import CircularLoader from "../Misc/CircularLoader";
import { useSelector } from "react-redux";

function Roles() {
  const account = useSelector((state)=>state.account)
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


  // Getting the role and permission information at the very initial state
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/roles`
      );
      const permissionData = await generalGetFunction("/permission");
      if (apiData.status) {
        setRole(apiData.data);
      }
      if (permissionData.status) {
        setDefaultPermission(permissionData.data);
      }
    }
    getData();
  }, [refresh]);

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
        if (apiData.status) {
          setLoading(false);
          setRefresh(refresh + 1);
          toast.success(apiData.message);
          setPopup(false);
          setSaveClick(false);
          setNewRole("");
          setAddRole(false);
        } else {
          setLoading(false);
          toast.error(apiData.message);
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
          toast.error(apiData.message);
        }
      }
    } else {
      setLoading(true);
      const apiData = await generalDeleteFunction(
        `/role/${role[deleteIndex].id}`
      );
      if (apiData.status) {
        setEditClick(false);
        setDeleteIndex();
        toast.success(apiData.success);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(apiData.message);
      }
    }
  }

  // Handel permission check box click
  const handleCheckboxChange = (id) => {
    if (selectedPermission.includes(id)) {
      setSelectedPermission(selectedPermission.filter((item) => item !== id));
    } else {
      setSelectedPermission([...selectedPermission, id]);
    }
  };

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
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
    } else {
      setLoading(false);
      toast.error(apiData.message);
    }
  }

  // Filter out permissions base on the availabe id's inside user section
  const filterPermissionById = (data, idArray) => {
    const result = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const filteredItems = data[key].filter(item => idArray?.includes(item.id));
        if (filteredItems.length > 0) {
          result[key] = filteredItems;
        }
      }
    }
    return result;
  };
  
  const filteredPermission = filterPermissionById(defaultPermission, account.role_permissions.permissions);
  return (
    <>
      <style>
        {`
      .formRow{
        padding: 0px 10px;
        border: none;
      }
      .formLabel{
        padding-left: 10px;
        font-size: 16px;
        color: #3c3c3c;
      }
      .masterSegment{
      position: sticky;
      top: 10px;
      }
      .approvalButton{
        position:absolute;
        top: 0;
        right: 0;
      }
      .approvalButton button {
        border-radius: 0;
        border-bottom-left-radius: 7px;
        border-top-right-radius: 7px;
      }
      `}
      </style>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Roles" />
              <div className="row masterList">
                <div className="col-xl-4 ">
                  <div className="masterSegment">
                    <h6>
                      <div className="row align-items-center">
                        <div className="col-auto">List of Roles </div>
                        {/* <div className="col pe-0">
                        <input type="search" name="Search" id="headerSearch" placeholder="Search a role" onChange={(e) => setSearchDomain(e.target.value)} />
                      </div> */}
                        <div className="col-auto ps-0 mt-1">
                          <button
                            className="clearButton"
                            style={{
                              width: "100%",
                              height: "100%",
                              fontSize: 22,
                            }}
                          >
                            <i
                              className="fa-duotone fa-circle-plus"
                              onClick={() => {
                                setAddRole(true);
                                setEditClick(false);
                              }}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </h6>
                    <ul>
                      {addRole ? (
                        <li>
                          <div className="col-8">
                          <input
                            type="text"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            placeholder="Add new Role"
                          ></input>
                          </div>
                          <div className="col-auto">
                          <button className="clearButton text-success">
                            <i
                              className="fa-duotone fa-circle-check"
                              onClick={() => {
                                setPopup(true);
                                setSaveClick(true);
                              }}
                            ></i>
                          </button>
                          <button className="clearButton text-danger">
                            <i
                              className="fa-duotone fa-trash"
                              onClick={() => {
                                setAddRole(false);
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
                            <li key={index} className={selectedRoleId===item.id?"active":""}>
                              <div className="col-8">
                                <input
                                  type="text"
                                  placeholder={item.name}
                                  onChange={(e) =>
                                    setUpdateRole(e.target.value)
                                  }
                                  disabled={editIndex === index ? false : true}
                                ></input>
                              </div>
                              <div className="col-auto">
                                <button className="clearButton text-success">
                                  {editIndex === index ? (
                                    <i
                                      className="fa-duotone fa-circle-check"
                                      onClick={() => {
                                        setPopup(true);
                                        setEditClick(true);
                                        setAddRole(false);
                                      }}
                                    ></i>
                                  ) : (
                                    <i
                                      className="fa-duotone fa-pen-to-square"
                                      onClick={() => {
                                        setEditIndex(index);
                                      }}
                                    ></i>
                                  )}
                                </button>
                                <button className="clearButton text-danger">
                                  <i
                                    className="fa-duotone fa-trash"
                                    onClick={() => {
                                      setPopup(true);
                                      setDeleteIndex(index);
                                      setEditClick(false);
                                      setAddRole(false);
                                    }}
                                  ></i>
                                </button>
                                <button className="clearButton text-primary">
                                  <i
                                    class="fa-duotone fa-sliders"
                                    onClick={() => {
                                      setSelectedRoleId(item.id);
                                      setSelectedRole(item.name);
                                      setSelectedPermission(
                                        item.permissions.map((item)=>{
                                          return(item.permission_id)
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
                  <div className="col-xl-8 pe-0">
                    <div className="profileView">
                      <div className="profileDetailsHolder position-relative">
                        <div className="col-xl-12">
                          <div class="headerCommon d-flex align-items-center">
                            <div class="col-5">
                              Permissions for{" "}
                              <span
                                style={{
                                  color: "var(--ui-accent)",
                                  fontWeight: 600,
                                }}
                              >
                                {selectedRole}
                              </span>
                            </div>
                            <div class="approvalButton">
                              {" "}
                              <button
                                class="float-end btn btn-success btn-sm"
                                onClick={handlePermissionSave}
                                style={{
                                  fontWeight: 600,
                                }}
                              >
                                <i class="fa-duotone fa-check-double"></i>{" "}
                                Save
                              </button>{" "}
                            </div>
                          
                          </div>
                        </div>
                        {filteredPermission &&
                          Object.keys(filteredPermission).map((item, key) => {
                            return (
                              <div className="permissionListWrapper" key={key}>
                                <div class="header d-flex align-items-center">
                                  <div class="col-5">{item}</div>
                                </div>
                                <div className="row px-2 pt-1 border-bottom">
                                  {filteredPermission[item].map(
                                    (innerItem, key) => {
                                      return (
                                        <div
                                          className="formRow col-xl-2 col-md-4 col-6"
                                          key={key}
                                        >
                                          <input
                                            type="checkbox"
                                            id={`permission-${innerItem.id}`}
                                            checked={selectedPermission.includes(
                                              innerItem.id
                                            )}
                                            onChange={() =>
                                              handleCheckboxChange(innerItem.id)
                                            }
                                          />
                                          <label className="formLabel">
                                            {innerItem.action}
                                          </label>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
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
                      <i className="fa-duotone fa-triangle-exclamation"></i>
                    </div>
                  </div>
                  <div className="col-10 ps-0">
                    <h4>Warning!</h4>
                    {saveClick ? (
                      <p>Are you sure you want to add this Role: {newRole}?</p>
                    ) : editClick ? (
                      <p>
                        Are you sure you want to change {role[editIndex].name}{" "}
                        to {updateRole}?
                      </p>
                    ) : (
                      <p>
                        Are you sure you want to delete this{" "}
                        {role[deleteIndex].name} ?
                      </p>
                    )}

                    <button
                      className="panelButton m-0"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="panelButtonWhite m-0 float-end"
                      onClick={() => {
                        setPopup(false);
                        setSaveClick(false);
                        setEditClick(false);
                        setEditIndex("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {loading ? <CircularLoader /> : ""}
        <ToastContainer
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
        />
      </main>
    </>
  );
}

export default Roles;
