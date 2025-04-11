import React, { useEffect, useState } from 'react'
import { backToTop, generalGetFunction } from '../GlobalFunction/globalFunction';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

function PermissionConfigForUser() {
  const navigate = useNavigate();

  const [classType, setClassType] = useState("");
  const [allGroupList, setAllGroupList] = useState([]);
  const [allRoleList, setAllRoleList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    getAllGroups();
    getAllRoles();
  }, [classType])

  const getAllGroups = async () => {
    try {
      const response = await generalGetFunction('groups/all');
      if (response.status) {
        setAllGroupList(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const getAllRoles = async () => {
    try {
      const response = await generalGetFunction('role/all');
      if (response.status) {
        setAllRoleList(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Global Permissions" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>Permissions</h4>
                        </div>
                        <div className="buttonGroup">
                          <button
                            effect="ripple"
                            className="panelButton ms-0"
                          >
                            <span className="text">Refresh</span>
                            <span className="icon">
                              <i className="fa-regular fa-arrows-rotate fs-5"></i>
                            </span>
                          </button>
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
                        </div>
                      </div>
                    </div>
                    <div className='col-12' style={{ padding: '25px 23px' }}>
                      <div className="row mb-0">
                        <div className="formRow col-xl-3">
                          <div className='formLabel'>
                            <label>
                              Select Class Type
                            </label>
                          </div>
                          <div className='col-6'>
                            <div className='row'>
                              <div className='col-6'>
                                <select className='formItem' onChange={(e) => setClassType(e.target.value)} defaultValue={"group"}>
                                  <option value={"group"}>Group</option>
                                  <option value={"role"}>Role</option>
                                </select>
                              </div>
                              {classType === "group" ? (
                                <div className='col-6'>
                                  <select className='formItem' onChange={(e) => setSelectedGroup(e.target.value)}>
                                    <option value={""}>Select Group</option>
                                    {allGroupList?.map((item, index) => (
                                      <option key={index} value={item.id}>{item.group_name}</option>
                                    ))}
                                  </select>
                                </div>
                              ) : (
                                <div className='col-6'>
                                  <select className='formItem' onChange={(e) => setSelectedRole(e.target.value)}>
                                    <option value={""}>Select Role</option>
                                    {allRoleList.map((item, index) => {
                                      return (
                                        <option key={index} value={item.id}>{item.name}</option>
                                      )
                                    })}
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <PermissionConfigTable selectedGroup={selectedGroup} selectedRole={selectedRole} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default PermissionConfigForUser

export function PermissionConfigTable({ selectedGroup, selectedRole }) {
  return (
    <div className='col-xl-12 col-xxl-8'>
      <div className='itemWrapper a shadow-none px-0 permissionsConfigWrapper'>
        <div className="heading h-auto justify-content-start">
          <h5 class="me-3">Accounts</h5>
          <div class="my-auto position-relative mx-1">
            <label class="switch">
              <input type="checkbox" id="showAllCheck" name="utilities" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        <div className='tableContainer h-auto' style={{ minHeight: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Page Name</th>
                <th>Utilities</th>
                <th>View</th>
                <th>Add</th>
                <th className='text-center'>Edit</th>
                <th className='text-center'>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Users</td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="utilities" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="view" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="add" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="edit" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="delete" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Extensions</td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="utilities" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="view" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="add" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="edit" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="delete" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Roles And Permissions</td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="utilities" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="view" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="add" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="edit" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="delete" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className='itemWrapper a shadow-none px-0 permissionsConfigWrapper'>
        <div className="heading h-auto justify-content-start">
          <h5 className='me-3'>Number Management</h5>
          <div class="my-auto position-relative mx-1">
            <label class="switch">
              <input type="checkbox" id="showAllCheck" name="utilities" />
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        <div className='tableContainer h-auto' style={{ minHeight: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Page Name</th>
                <th>Utilities</th>
                <th>View</th>
                <th>Add</th>
                <th className='text-center'>Edit</th>
                <th className='text-center'>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Users</td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="utilities" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="view" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="add" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="edit" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="delete" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
              </tr>
              <tr className='collapse'>
                <td colSpan={99}>
                  <div className='row'>
                    <div className='col-3 offset-3'>
                      <ul>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Username</p>
                          <input type='checkbox' />
                        </li>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Extension</p>
                          <input type='checkbox' />
                        </li>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Role</p>
                          <input type='checkbox' />
                        </li>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Usage</p>
                          <input type='checkbox' />
                        </li>
                      </ul>
                    </div>
                    <div className='col-3'>
                      <ul>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Username</p>
                          <input type='checkbox' />
                        </li>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Extension</p>
                          <input type='checkbox' />
                        </li>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Role</p>
                          <input type='checkbox' />
                        </li>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Usage</p>
                          <input type='checkbox' />
                        </li>
                      </ul>
                    </div>
                    <div className='col-3'>
                      <ul>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Username</p>
                          <input type='checkbox' />
                        </li>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Extension</p>
                          <input type='checkbox' />
                        </li>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Role</p>
                          <input type='checkbox' />
                        </li>
                        <li className='d-flex align-items-center justify-content-between'>
                          <p>Usage</p>
                          <input type='checkbox' />
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Extensions</td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="utilities" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="view" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="add" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="edit" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="delete" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Roles And Permissions</td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="utilities" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="view" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="add" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="edit" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <div class="my-auto position-relative mx-1">
                    <label class="switch">
                      <input type="checkbox" id="showAllCheck" name="delete" />
                      <span class="slider round"></span>
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}