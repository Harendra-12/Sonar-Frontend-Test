import React, { useCallback, useEffect, useState } from 'react'
import { backToTop, generalGetFunction } from '../GlobalFunction/globalFunction';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import SkeletonTableLoader from '../Loader/SkeletonTableLoader';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

/**
 * PermissionConfigForUser is a React component that manages the configuration
 * of user permissions based on selected groups or roles. It utilizes a
 * `Header` component for displaying the page title and buttons for navigation
 * and refreshing the content. The component fetches and displays lists of
 * groups and roles, allowing the user to select one of each. It also renders
 * the `PermissionConfigTable` component, passing the selected group, role, 
 * and all permissions as props.
 *
 * State Variables:
 * - classType: Determines whether the user is selecting by group or role.
 * - allGroupList: Stores the list of all groups retrieved from the API.
 * - allRoleList: Stores the list of all roles retrieved from the API.
 * - selectedGroup: The currently selected group by the user.
 * - selectedRole: The currently selected role by the user.
 *
 * Effects:
 * - Fetches all groups and roles from the server when the component mounts
 *   or when the `classType` changes.
 *
 * Methods:
 * - getAllGroups: Retrieves all groups from the server and updates the state.
 * - getAllRoles: Retrieves all roles from the server and updates the state.
 */

function PermissionConfigForUser() {
  const navigate = useNavigate();

  const [classType, setClassType] = useState("");
  const [allGroupList, setAllGroupList] = useState([]);
  const [allRoleList, setAllRoleList] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false)
  const [refreshState, setRefreshState] = useState(false);
  const permissions = useSelector((state) => state.permissions);

  useEffect(() => {
    setRefreshState(true)
    const shouldLoad = true
    getAllGroups(shouldLoad);
    getAllRoles(shouldLoad);
  }, [classType])

  const getAllGroups = async (shouldLoad) => {
    try {
      if (shouldLoad) setLoading(true)
      const response = await generalGetFunction('groups/all');
      if (response.status) {
        setAllGroupList(response.data);
        setLoading(false)
        setRefreshState(false)
      }
    } catch (err) {
      console.log(err);
      setLoading(false)
      setRefreshState(false)
    }
  }
  const getAllRoles = async (shouldLoad) => {
    try {
      if (shouldLoad) setLoading(true)
      const response = await generalGetFunction('role/all');
      if (response.status) {
        setAllRoleList(response.data);
        setLoading(false)
        setRefreshState(false)
      }
    } catch (err) {
      console.log(err);
      setLoading(false)
      setRefreshState(false)
    }
  }

  const handleRefreshBtnClicked = () => {
    setRefreshState(true)
    const shouldLoad = false
    getAllGroups(shouldLoad);
    getAllRoles(shouldLoad);
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
                          <h4>Permissions {" "}
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
                        </div>
                      </div>
                    </div>
                    <div className='col-12' style={{ padding: '25px 23px' }}>
                      <div className="row mb-0">
                        <div className="formRow col-xl-3 col-lg-12">
                          <div className='formLabel'>
                            <label>
                              Select Class Type
                            </label>
                          </div>
                          <div className='row'>
                            <div className='col-xl-12 col-lg-12'>
                              <div className='row'>
                                <div className='col-6'>
                                  <select className='formItem' onChange={(e) => setClassType(e.target.value)} defaultValue={"role"} disabled={true}>
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
                      </div>
                      <PermissionConfigTable
                        allRoleList={allRoleList}
                        selectedGroup={selectedGroup}
                        selectedRole={selectedRole}
                        allPermissions={permissions}
                        loading={loading}
                      />
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

export function PermissionConfigTable({ allRoleList, selectedGroup, selectedRole, allPermissions, loading }) {
  const [showOnlyViewPermissions, setShowOnlyViewPermissions] = useState(false);
  const [permissionData, setPermissionData] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({
    role_id: selectedRole,
    permissions: [],
    tablePermissions: [],
    sectionPermissions: []
  });
  const account = useSelector((state) => state.account);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    // Fetch all Permission Data
    setPermissionData(allPermissions);

    // Initialize with empty permissions for the selected role
    setRolePermissions(prev => ({
      ...prev,
      role_id: selectedRole || [],
      permissions: allRoleList?.find((role) => role.id == selectedRole)?.permissions || [],
      tablePermissions: allRoleList?.find((role) => role.id == selectedRole)?.tablePermissions || [],
      sectionPermissions: allRoleList?.find((role) => role.id == selectedRole)?.sectionPermissions || []
    }));
  }, [selectedRole, allRoleList]);

  const resetPermissionToInitialState = () => {
    setRolePermissions(prev => ({
      role_id: selectedRole || [],
      permissions: allRoleList?.find((role) => role.id == selectedRole)?.permissions || [],
      tablePermissions: allRoleList?.find((role) => role.id == selectedRole)?.tablePermissions || [],
      sectionPermissions: allRoleList?.find((role) => role.id == selectedRole)?.sectionPermissions || []
    }));
  }

  const toggleRowExpand = (permission, section, model, type, bool) => {
    if (!account.sectionPermissions.includes(section) || !account.permissions.includes(permission)) {
      return;
    }

    setExpandedRows(prev => {
      const exists = prev.some(
        item => item.section === section && item.model === model && item.type === type
      );

      if (bool) {
        // Expand: Add row if it doesn't exist
        if (!exists) {
          return [...prev, { section, model, type }];
        }
        return prev; // No change if already expanded
      } else {
        // Collapse: Remove row if it exists
        if (exists) {
          return prev.filter(
            item => !(item.section === section && item.model === model && item.type === type)
          );
        }
        return prev; // No change if already collapsed
      }
    });
  };

  useEffect(() => {
    const savedPermissions = [];
    for (const moduleName in permissionData) {
      const modulePermissions = permissionData[moduleName];
      if (Array.isArray(modulePermissions)) {
        for (const item of modulePermissions) {
          for (const subItem of item.permissions) {
            if (rolePermissions.sectionPermissions.includes(item.id)) {
              if (rolePermissions.permissions.includes(subItem.id) && (subItem.action == "read" || subItem.action == "edit") && savedPermissions.findIndex(item => item.id == subItem.id) == -1) {
                const newArr = { ...subItem, section: item.id, type: subItem.action == "read" ? "view" : "edit" };
                savedPermissions.push(newArr);
              }
            }
          }
        }
      }
    }
    setExpandedRows(savedPermissions)
  }, [rolePermissions])

  const togglePermission = (type, id, checked) => {
    if (account.usertype !== 'Company' && !account[type].includes(id)) {
      toast.error("You don't have permission to perform this action", { toastId: "permission-error" });
      return;
    }

    setRolePermissions(prev => {
      const newPermissions = { ...prev };

      if (checked) {
        // Add permission if not already present
        if (!newPermissions[type].includes(id)) {
          newPermissions[type] = [...newPermissions[type], id];
        }
      } else {
        // Remove permission
        newPermissions[type] = newPermissions[type].filter(item => item !== id);
      }

      return newPermissions;
    });
  };

  const handleMasterToggle = (modelId, sectionId, permissions, tableRecords, checked) => {
    if (!account.sectionPermissions.includes(modelId)) {
      toast.error("You don't have permission to perform this action", { toastId: "permission-error" });
      return;
    }
    if (permissions.length > 0 || tableRecords.length > 0) {
      const permissionIds = permissions.map(p => p.id);
      const tableRecordIds = tableRecords.map(r => r.id);
      if (!permissionIds.every(id => account.permissions.includes(id)) ||
        !tableRecordIds.every(id => account.permissions.includes(id))) {
        toast.error("You don't have permission to perform this action", { toastId: "permission-error" });
        // return;
      }
    }

    setRolePermissions(prev => {
      const newPermissions = { ...prev };

      if (checked) {
        // Add all permissions for this model
        newPermissions.permissions = [
          ...new Set([...newPermissions.permissions, ...permissions.map(p => p.id)])
        ];

        // Add table permissions if any
        if (tableRecords && tableRecords.length > 0) {
          newPermissions.tablePermissions = [
            ...new Set([...newPermissions.tablePermissions, ...tableRecords.map(r => r.id)])
          ];
        }

        // Add section permission
        if (!newPermissions.sectionPermissions.includes(modelId)) {
          newPermissions.sectionPermissions = [...newPermissions.sectionPermissions, modelId];
        }
      } else {
        // Remove all permissions for this model
        newPermissions.permissions = newPermissions.permissions.filter(
          id => !permissions.map(p => p.id).includes(id)
        );

        // Remove table permissions
        if (tableRecords && tableRecords.length > 0) {
          newPermissions.tablePermissions = newPermissions.tablePermissions.filter(
            id => !tableRecords.map(r => r.id).includes(id)
          );
        }

        // Remove section permission if no other models in this section are selected
        const otherModelsInSection = Object.values(permissionData)
          .flat()
          .filter(m => m.module_section === sectionId && m.id !== modelId);

        const hasOtherPermissions = otherModelsInSection.some(m =>
          newPermissions.permissions.some(id =>
            m.permissions.map(p => p.id).includes(id)
          )
        );

        if (!hasOtherPermissions) {
          newPermissions.sectionPermissions = newPermissions.sectionPermissions.filter(
            id => id !== modelId
          );
        }
      }

      return newPermissions;
    });
  };

  const handlePermissionToggle = (permissionId, modelId, sectionId, checked) => {
    togglePermission('permissions', permissionId, checked);

    // Ensure section permission is added when any permission is checked
    if (checked) {
      togglePermission('sectionPermissions', modelId, true);
    } else {
      // Check if we should remove the section permission
      const model = Object.values(permissionData)
        .flat()
        .find(m => m.id == modelId);

      const hasOtherPermissions = model.permissions.some(
        p => p.id !== permissionId && rolePermissions.permissions.includes(p.id)
      );

      if (!hasOtherPermissions) {
        togglePermission('sectionPermissions', modelId, false);
      }
    }
  };

  const handleColumnToggle = (recordId, modelId, sectionId, checked) => {
    togglePermission('tablePermissions', recordId, checked);

    // Ensure section permission is added when any column permission is checked
    if (checked) {
      togglePermission('sectionPermissions', modelId, true);
    }
  };

  if (!permissionData) {
    return <div>Loading permissions...</div>;
  }

  console.log(rolePermissions);

  const toggleSection = (sectionName, models) => {
    const permissionMatch = models.some(m => rolePermissions.sectionPermissions.includes(m.id));

    if (!permissionMatch) {
      setExpandedSections(prev => ({
        ...prev,
        [sectionName]: !prev[sectionName]
      }));
    }
  };

  const toggleAllColumnPermissions = (model, checked, rowKey) => {
    setRolePermissions(prev => {
      const newPermissions = { ...prev };
      const filteredRecords = model.table_records.filter(record =>
        rowKey.includes('view') ? record.action === 'view' : record.action === 'edit'
      );

      if (filteredRecords.length === 0) {
        console.warn(`No records found`);
      }

      const recordIds = filteredRecords.map(r => r.id);

      if (checked) {
        newPermissions.tablePermissions = [
          ...new Set([...newPermissions.tablePermissions, ...recordIds])
        ];
      } else {
        newPermissions.tablePermissions = newPermissions.tablePermissions.filter(
          id => !recordIds.includes(id)
        );
      }

      return newPermissions;
    });
  };


  return (
    <div className='col-xl-12 col-xxl-8'>
      {Object.entries(permissionData).map(([sectionName, models]) => (
        <div key={sectionName} className='itemWrapper d shadow-none border-0 px-0 permissionsConfigWrapper'>
          <div className="heading h-auto justify-content-between">
            <div className='d-flex'>
              <h5 className='me-3'>{sectionName}</h5>
              <div class="cl-toggle-switch">
                <label class="cl-switch">
                  <input
                    type="checkbox"
                    checked={!!expandedSections[sectionName]}
                    onChange={() => toggleSection(sectionName, models)}
                  />
                  <span></span>
                </label>
              </div>
            </div>
            {expandedSections[sectionName] && (
              <>
                <div className='d-flex'>
                  <div onClick={resetPermissionToInitialState}>
                    <i className='fa-solid fa-trash' />
                  </div>
                  <div className="my-auto position-relative ms-3 me-1 d-flex">
                    <span className='me-2'>Master: </span>
                    <div class="cl-toggle-switch">
                      <label class="cl-switch">
                        <input
                          type="checkbox"
                          checked={models.every(model =>
                            model.permissions.every(p =>
                              rolePermissions.permissions.includes(p.id)
                            ) &&
                            model.table_records.every(r =>
                              rolePermissions.tablePermissions.includes(r.id)
                            )
                          )}
                          onChange={(e) => {
                            models.forEach(model => {
                              handleMasterToggle(
                                model.id,
                                model.module_section,
                                model.permissions,
                                model.table_records,
                                e.target.checked
                              );
                            });
                          }}
                        />
                        <span></span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {expandedSections[sectionName] && (
            <div className='tableContainer h-auto' style={{ minHeight: 'auto' }}>
              <table className="w-100">
                <thead>
                  <tr>
                    <th>Page Name</th>
                    <th>Browse</th>
                    <th>Read</th>
                    <th>Edit</th>
                    <th>Add</th>
                    <th>Delete</th>
                    <th>Search</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ?
                    <SkeletonTableLoader col={7} row={10} /> :
                    models.map(model => {
                      const allModelPermissionsChecked = model.permissions.every(
                        p => rolePermissions.permissions.includes(p.id)
                      );

                      return (
                        <React.Fragment key={model.id}>
                          <tr>
                            <td>
                              <div className="d-flex align-items-center">
                                {/* {model.table_records.length > 0 && (
                              <button
                                className="btn btn-sm btn-link me-2"
                                onClick={() => toggleRowExpand(sectionName, model.model, true)}
                              >
                                {expandedRows[`${sectionName}-${model.model}`] ? '−' : '+'}
                              </button>
                            )} */}
                                {model.slug}
                              </div>
                            </td>
                            {model.permissions.map(permission => (
                              <td key={permission.id}>
                                <div className="my-auto position-relative mx-1">
                                  <div class="cl-toggle-switch">
                                    <label class="cl-switch">
                                      <input
                                        type="checkbox"
                                        checked={rolePermissions.sectionPermissions.includes(model.id) && rolePermissions.permissions.includes(permission.id)}
                                        onChange={(e) => {
                                          handlePermissionToggle(
                                            permission.id,
                                            model.id,
                                            model.module_section,
                                            e.target.checked
                                          );
                                          if (permission.action === "read" || permission.action === "edit") {
                                            const type = permission.action === "read" ? "view" : "edit";
                                            if (e.target.checked) {
                                              toggleRowExpand(permission.id, model.id, model.model, type, true);
                                            } else {
                                              toggleRowExpand(permission.id, model.id, model.model, type, false);
                                              // Untoggle all column permissions for this type
                                              toggleAllColumnPermissions(model, false, type);
                                            }
                                          }
                                        }}
                                      />
                                      <span></span>
                                    </label>
                                  </div>
                                </div>
                              </td>
                            ))}
                          </tr>
                          {model.table_records.length > 0 &&
                            expandedRows
                              .filter(row => row.section === model.id && row.model === model.model)
                              .map((row, index) => {
                                const rowKey = `${model.id}-${model.model}-${row.type}-${index}`;
                                const checkedState = model.table_records
                                  .filter(record => record.action === row.type)
                                  .every(r => rolePermissions.tablePermissions.includes(r.id));

                                return (
                                  <tr key={rowKey}>
                                    <td colSpan={7} className="accordion" id={`accordion-${rowKey}`}>
                                      <div className="bg-transparent border-0 accordion-item">
                                        <div className='d-flex justify-content-between align-items-center mb-2 border-bottom'>
                                          <div className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#test-${rowKey}`} aria-expanded="true" aria-controls={`test-${rowKey}`}>
                                            <h6>
                                              Column Permissions - <b>{row.type.charAt(0).toUpperCase() + row.type.slice(1)}</b>
                                            </h6>
                                          </div>
                                          <div className='pe-2'>
                                            <div className="my-auto position-relative mx-1 d-flex">
                                              <span className="me-2">Master: </span>
                                              <input
                                                type="checkbox"
                                                checked={checkedState}
                                                onChange={(e) => {
                                                  toggleAllColumnPermissions(model, e.target.checked, row.type)
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="row accordion-collapse collapse" id={`test-${rowKey}`} aria-labelledby="headingOne" data-bs-parent={`#accordion-${rowKey}`}>
                                          {Array.from(new Set(model.table_records.map(r => r.column_name))).map(column => {
                                            const columnRecords = model.table_records.filter(r => r.column_name === column);
                                            const filteredColumnRecords = columnRecords.filter(record => record.action === row.type);

                                            if (filteredColumnRecords.length === 0) return null;

                                            return (
                                              <div key={column} className="col-md-3 mb-3">
                                                <div className="card">
                                                  <div className="card-body">
                                                    {filteredColumnRecords.map(record => (
                                                      <div key={record.id} className="d-flex justify-content-between">
                                                        <label className="text-capitalize">
                                                          {column.replace(/_/g, ' ')}
                                                        </label>
                                                        <div className="cl-toggle-switch">
                                                          <label className="cl-switch">
                                                            <input
                                                              type="checkbox"
                                                              checked={rolePermissions.tablePermissions.includes(record.id)}
                                                              onChange={(e) =>
                                                                handleColumnToggle(
                                                                  record.id,
                                                                  model.id,
                                                                  model.module_section,
                                                                  e.target.checked
                                                                )
                                                              }
                                                            />
                                                            <span></span>
                                                          </label>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}

      <div className="mt-4">
        <button
          className="btn btn-primary"
          onClick={() => console.log('Permissions to save:', rolePermissions)}
        >
          Save Permissions
        </button>
        <pre className="mt-3 bg_light p-3">
          {JSON.stringify(rolePermissions, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export const DemoData = {
  "status": true,
  "data": {
    "Accounts": [
      {
        "id": 1,
        "model": "User",
        "slug": "User",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 655,
            "model": "User",
            "slug": "User",
            "action": "browse"
          },
          {
            "id": 656,
            "model": "User",
            "slug": "User",
            "action": "read"
          },
          {
            "id": 657,
            "model": "User",
            "slug": "User",
            "action": "edit"
          },
          {
            "id": 658,
            "model": "User",
            "slug": "User",
            "action": "add"
          },
          {
            "id": 659,
            "model": "User",
            "slug": "User",
            "action": "delete"
          },
          {
            "id": 660,
            "model": "User",
            "slug": "User",
            "action": "search"
          }
        ],
        "table_records": [
          {
            "id": 1793,
            "tb_model": "User",
            "column_name": "id",
            "action": "view"
          },
          {
            "id": 1794,
            "tb_model": "User",
            "column_name": "id",
            "action": "edit"
          },
          {
            "id": 1795,
            "tb_model": "User",
            "column_name": "name",
            "action": "view"
          },
          {
            "id": 1796,
            "tb_model": "User",
            "column_name": "name",
            "action": "edit"
          },
          {
            "id": 1797,
            "tb_model": "User",
            "column_name": "alias",
            "action": "view"
          },
          {
            "id": 1798,
            "tb_model": "User",
            "column_name": "alias",
            "action": "edit"
          },
          {
            "id": 1799,
            "tb_model": "User",
            "column_name": "profile_picture",
            "action": "view"
          },
          {
            "id": 1800,
            "tb_model": "User",
            "column_name": "profile_picture",
            "action": "edit"
          },
          {
            "id": 1801,
            "tb_model": "User",
            "column_name": "email",
            "action": "view"
          },
          {
            "id": 1802,
            "tb_model": "User",
            "column_name": "email",
            "action": "edit"
          },
          {
            "id": 1803,
            "tb_model": "User",
            "column_name": "email_verified_at",
            "action": "view"
          },
          {
            "id": 1804,
            "tb_model": "User",
            "column_name": "email_verified_at",
            "action": "edit"
          },
          {
            "id": 1805,
            "tb_model": "User",
            "column_name": "username",
            "action": "view"
          },
          {
            "id": 1806,
            "tb_model": "User",
            "column_name": "username",
            "action": "edit"
          },
          {
            "id": 1807,
            "tb_model": "User",
            "column_name": "password",
            "action": "view"
          },
          {
            "id": 1808,
            "tb_model": "User",
            "column_name": "password",
            "action": "edit"
          },
          {
            "id": 1809,
            "tb_model": "User",
            "column_name": "contact",
            "action": "view"
          },
          {
            "id": 1810,
            "tb_model": "User",
            "column_name": "contact",
            "action": "edit"
          },
          {
            "id": 1811,
            "tb_model": "User",
            "column_name": "usages",
            "action": "view"
          },
          {
            "id": 1812,
            "tb_model": "User",
            "column_name": "usages",
            "action": "edit"
          },
          {
            "id": 1813,
            "tb_model": "User",
            "column_name": "group_id",
            "action": "view"
          },
          {
            "id": 1814,
            "tb_model": "User",
            "column_name": "group_id",
            "action": "edit"
          },
          {
            "id": 1815,
            "tb_model": "User",
            "column_name": "domain_id",
            "action": "view"
          },
          {
            "id": 1816,
            "tb_model": "User",
            "column_name": "domain_id",
            "action": "edit"
          },
          {
            "id": 1817,
            "tb_model": "User",
            "column_name": "apiKey",
            "action": "view"
          },
          {
            "id": 1818,
            "tb_model": "User",
            "column_name": "apiKey",
            "action": "edit"
          },
          {
            "id": 1819,
            "tb_model": "User",
            "column_name": "account_id",
            "action": "view"
          },
          {
            "id": 1820,
            "tb_model": "User",
            "column_name": "account_id",
            "action": "edit"
          },
          {
            "id": 1821,
            "tb_model": "User",
            "column_name": "timezone_id",
            "action": "view"
          },
          {
            "id": 1822,
            "tb_model": "User",
            "column_name": "timezone_id",
            "action": "edit"
          },
          {
            "id": 1823,
            "tb_model": "User",
            "column_name": "language",
            "action": "view"
          },
          {
            "id": 1824,
            "tb_model": "User",
            "column_name": "language",
            "action": "edit"
          },
          {
            "id": 1825,
            "tb_model": "User",
            "column_name": "status",
            "action": "view"
          },
          {
            "id": 1826,
            "tb_model": "User",
            "column_name": "status",
            "action": "edit"
          },
          {
            "id": 1827,
            "tb_model": "User",
            "column_name": "usertype",
            "action": "view"
          },
          {
            "id": 1828,
            "tb_model": "User",
            "column_name": "usertype",
            "action": "edit"
          },
          {
            "id": 1829,
            "tb_model": "User",
            "column_name": "extension_id",
            "action": "view"
          },
          {
            "id": 1830,
            "tb_model": "User",
            "column_name": "extension_id",
            "action": "edit"
          },
          {
            "id": 1831,
            "tb_model": "User",
            "column_name": "socket_session_id",
            "action": "view"
          },
          {
            "id": 1832,
            "tb_model": "User",
            "column_name": "socket_session_id",
            "action": "edit"
          },
          {
            "id": 1833,
            "tb_model": "User",
            "column_name": "socket_status",
            "action": "view"
          },
          {
            "id": 1834,
            "tb_model": "User",
            "column_name": "socket_status",
            "action": "edit"
          },
          {
            "id": 1835,
            "tb_model": "User",
            "column_name": "approved_by",
            "action": "view"
          },
          {
            "id": 1836,
            "tb_model": "User",
            "column_name": "approved_by",
            "action": "edit"
          },
          {
            "id": 1837,
            "tb_model": "User",
            "column_name": "firebase_token",
            "action": "view"
          },
          {
            "id": 1838,
            "tb_model": "User",
            "column_name": "firebase_token",
            "action": "edit"
          },
          {
            "id": 1839,
            "tb_model": "User",
            "column_name": "created_by",
            "action": "view"
          },
          {
            "id": 1840,
            "tb_model": "User",
            "column_name": "created_by",
            "action": "edit"
          },
          {
            "id": 1841,
            "tb_model": "User",
            "column_name": "remember_token",
            "action": "view"
          },
          {
            "id": 1842,
            "tb_model": "User",
            "column_name": "remember_token",
            "action": "edit"
          },
          {
            "id": 1843,
            "tb_model": "User",
            "column_name": "deleted_at",
            "action": "view"
          },
          {
            "id": 1844,
            "tb_model": "User",
            "column_name": "deleted_at",
            "action": "edit"
          },
          {
            "id": 1845,
            "tb_model": "User",
            "column_name": "created_at",
            "action": "view"
          },
          {
            "id": 1846,
            "tb_model": "User",
            "column_name": "created_at",
            "action": "edit"
          },
          {
            "id": 1847,
            "tb_model": "User",
            "column_name": "updated_at",
            "action": "view"
          },
          {
            "id": 1848,
            "tb_model": "User",
            "column_name": "updated_at",
            "action": "edit"
          }
        ]
      },
      {
        "id": 2,
        "model": "Extension",
        "slug": "Extension",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 295,
            "model": "Extension",
            "slug": "Extension",
            "action": "browse"
          },
          {
            "id": 296,
            "model": "Extension",
            "slug": "Extension",
            "action": "read"
          },
          {
            "id": 297,
            "model": "Extension",
            "slug": "Extension",
            "action": "edit"
          },
          {
            "id": 298,
            "model": "Extension",
            "slug": "Extension",
            "action": "add"
          },
          {
            "id": 299,
            "model": "Extension",
            "slug": "Extension",
            "action": "delete"
          },
          {
            "id": 300,
            "model": "Extension",
            "slug": "Extension",
            "action": "search"
          }
        ],
        "table_records": [
          {
            "id": 107,
            "tb_model": "Extension",
            "column_name": "id",
            "action": "view"
          },
          {
            "id": 108,
            "tb_model": "Extension",
            "column_name": "id",
            "action": "edit"
          },
          {
            "id": 109,
            "tb_model": "Extension",
            "column_name": "account_id",
            "action": "view"
          },
          {
            "id": 110,
            "tb_model": "Extension",
            "column_name": "account_id",
            "action": "edit"
          },
          {
            "id": 111,
            "tb_model": "Extension",
            "column_name": "domain",
            "action": "view"
          },
          {
            "id": 112,
            "tb_model": "Extension",
            "column_name": "domain",
            "action": "edit"
          },
          {
            "id": 113,
            "tb_model": "Extension",
            "column_name": "extension",
            "action": "view"
          },
          {
            "id": 114,
            "tb_model": "Extension",
            "column_name": "extension",
            "action": "edit"
          },
          {
            "id": 115,
            "tb_model": "Extension",
            "column_name": "password",
            "action": "view"
          },
          {
            "id": 116,
            "tb_model": "Extension",
            "column_name": "password",
            "action": "edit"
          },
          {
            "id": 117,
            "tb_model": "Extension",
            "column_name": "voicemail_password",
            "action": "view"
          },
          {
            "id": 118,
            "tb_model": "Extension",
            "column_name": "voicemail_password",
            "action": "edit"
          },
          {
            "id": 119,
            "tb_model": "Extension",
            "column_name": "user",
            "action": "view"
          },
          {
            "id": 120,
            "tb_model": "Extension",
            "column_name": "user",
            "action": "edit"
          },
          {
            "id": 121,
            "tb_model": "Extension",
            "column_name": "range",
            "action": "view"
          },
          {
            "id": 122,
            "tb_model": "Extension",
            "column_name": "range",
            "action": "edit"
          },
          {
            "id": 123,
            "tb_model": "Extension",
            "column_name": "account_code",
            "action": "view"
          },
          {
            "id": 124,
            "tb_model": "Extension",
            "column_name": "account_code",
            "action": "edit"
          },
          {
            "id": 125,
            "tb_model": "Extension",
            "column_name": "effectiveCallerIdName",
            "action": "view"
          },
          {
            "id": 126,
            "tb_model": "Extension",
            "column_name": "effectiveCallerIdName",
            "action": "edit"
          },
          {
            "id": 127,
            "tb_model": "Extension",
            "column_name": "effectiveCallerIdNumber",
            "action": "view"
          },
          {
            "id": 128,
            "tb_model": "Extension",
            "column_name": "effectiveCallerIdNumber",
            "action": "edit"
          },
          {
            "id": 129,
            "tb_model": "Extension",
            "column_name": "outbundCallerIdName",
            "action": "view"
          },
          {
            "id": 130,
            "tb_model": "Extension",
            "column_name": "outbundCallerIdName",
            "action": "edit"
          },
          {
            "id": 131,
            "tb_model": "Extension",
            "column_name": "outbundCallerIdNumber",
            "action": "view"
          },
          {
            "id": 132,
            "tb_model": "Extension",
            "column_name": "outbundCallerIdNumber",
            "action": "edit"
          },
          {
            "id": 133,
            "tb_model": "Extension",
            "column_name": "emergencyCallerIdName",
            "action": "view"
          },
          {
            "id": 134,
            "tb_model": "Extension",
            "column_name": "emergencyCallerIdName",
            "action": "edit"
          },
          {
            "id": 135,
            "tb_model": "Extension",
            "column_name": "emergencyCallerIdNumber",
            "action": "view"
          },
          {
            "id": 136,
            "tb_model": "Extension",
            "column_name": "emergencyCallerIdNumber",
            "action": "edit"
          },
          {
            "id": 137,
            "tb_model": "Extension",
            "column_name": "directoryFullname",
            "action": "view"
          },
          {
            "id": 138,
            "tb_model": "Extension",
            "column_name": "directoryFullname",
            "action": "edit"
          },
          {
            "id": 139,
            "tb_model": "Extension",
            "column_name": "directoryVisible",
            "action": "view"
          },
          {
            "id": 140,
            "tb_model": "Extension",
            "column_name": "directoryVisible",
            "action": "edit"
          },
          {
            "id": 141,
            "tb_model": "Extension",
            "column_name": "directoryExtensionVisible",
            "action": "view"
          },
          {
            "id": 142,
            "tb_model": "Extension",
            "column_name": "directoryExtensionVisible",
            "action": "edit"
          },
          {
            "id": 143,
            "tb_model": "Extension",
            "column_name": "maxRegistration",
            "action": "view"
          },
          {
            "id": 144,
            "tb_model": "Extension",
            "column_name": "maxRegistration",
            "action": "edit"
          },
          {
            "id": 145,
            "tb_model": "Extension",
            "column_name": "limitMax",
            "action": "view"
          },
          {
            "id": 146,
            "tb_model": "Extension",
            "column_name": "limitMax",
            "action": "edit"
          },
          {
            "id": 147,
            "tb_model": "Extension",
            "column_name": "limitDestinations",
            "action": "view"
          },
          {
            "id": 148,
            "tb_model": "Extension",
            "column_name": "limitDestinations",
            "action": "edit"
          },
          {
            "id": 149,
            "tb_model": "Extension",
            "column_name": "voicemailEnabled",
            "action": "view"
          },
          {
            "id": 150,
            "tb_model": "Extension",
            "column_name": "voicemailEnabled",
            "action": "edit"
          },
          {
            "id": 151,
            "tb_model": "Extension",
            "column_name": "voiceEmailTo",
            "action": "view"
          },
          {
            "id": 152,
            "tb_model": "Extension",
            "column_name": "voiceEmailTo",
            "action": "edit"
          },
          {
            "id": 153,
            "tb_model": "Extension",
            "column_name": "voiceMailFile",
            "action": "view"
          },
          {
            "id": 154,
            "tb_model": "Extension",
            "column_name": "voiceMailFile",
            "action": "edit"
          },
          {
            "id": 155,
            "tb_model": "Extension",
            "column_name": "voiceMailkeepFile",
            "action": "view"
          },
          {
            "id": 156,
            "tb_model": "Extension",
            "column_name": "voiceMailkeepFile",
            "action": "edit"
          },
          {
            "id": 157,
            "tb_model": "Extension",
            "column_name": "missedCall",
            "action": "view"
          },
          {
            "id": 158,
            "tb_model": "Extension",
            "column_name": "missedCall",
            "action": "edit"
          },
          {
            "id": 159,
            "tb_model": "Extension",
            "column_name": "tollAllowValue",
            "action": "view"
          },
          {
            "id": 160,
            "tb_model": "Extension",
            "column_name": "tollAllowValue",
            "action": "edit"
          },
          {
            "id": 161,
            "tb_model": "Extension",
            "column_name": "callTimeOut",
            "action": "view"
          },
          {
            "id": 162,
            "tb_model": "Extension",
            "column_name": "callTimeOut",
            "action": "edit"
          },
          {
            "id": 163,
            "tb_model": "Extension",
            "column_name": "callgroup",
            "action": "view"
          },
          {
            "id": 164,
            "tb_model": "Extension",
            "column_name": "callgroup",
            "action": "edit"
          },
          {
            "id": 165,
            "tb_model": "Extension",
            "column_name": "callScreen",
            "action": "view"
          },
          {
            "id": 166,
            "tb_model": "Extension",
            "column_name": "callScreen",
            "action": "edit"
          },
          {
            "id": 167,
            "tb_model": "Extension",
            "column_name": "record",
            "action": "view"
          },
          {
            "id": 168,
            "tb_model": "Extension",
            "column_name": "record",
            "action": "edit"
          },
          {
            "id": 169,
            "tb_model": "Extension",
            "column_name": "description",
            "action": "view"
          },
          {
            "id": 170,
            "tb_model": "Extension",
            "column_name": "description",
            "action": "edit"
          },
          {
            "id": 171,
            "tb_model": "Extension",
            "column_name": "callforward",
            "action": "view"
          },
          {
            "id": 172,
            "tb_model": "Extension",
            "column_name": "callforward",
            "action": "edit"
          },
          {
            "id": 173,
            "tb_model": "Extension",
            "column_name": "callforwardTo",
            "action": "view"
          },
          {
            "id": 174,
            "tb_model": "Extension",
            "column_name": "callforwardTo",
            "action": "edit"
          },
          {
            "id": 175,
            "tb_model": "Extension",
            "column_name": "onbusy",
            "action": "view"
          },
          {
            "id": 176,
            "tb_model": "Extension",
            "column_name": "onbusy",
            "action": "edit"
          },
          {
            "id": 177,
            "tb_model": "Extension",
            "column_name": "onbusyTo",
            "action": "view"
          },
          {
            "id": 178,
            "tb_model": "Extension",
            "column_name": "onbusyTo",
            "action": "edit"
          },
          {
            "id": 179,
            "tb_model": "Extension",
            "column_name": "noanswer",
            "action": "view"
          },
          {
            "id": 180,
            "tb_model": "Extension",
            "column_name": "noanswer",
            "action": "edit"
          },
          {
            "id": 181,
            "tb_model": "Extension",
            "column_name": "noanswerTo",
            "action": "view"
          },
          {
            "id": 182,
            "tb_model": "Extension",
            "column_name": "noanswerTo",
            "action": "edit"
          },
          {
            "id": 183,
            "tb_model": "Extension",
            "column_name": "notregistered",
            "action": "view"
          },
          {
            "id": 184,
            "tb_model": "Extension",
            "column_name": "notregistered",
            "action": "edit"
          },
          {
            "id": 185,
            "tb_model": "Extension",
            "column_name": "notregisteredTo",
            "action": "view"
          },
          {
            "id": 186,
            "tb_model": "Extension",
            "column_name": "notregisteredTo",
            "action": "edit"
          },
          {
            "id": 187,
            "tb_model": "Extension",
            "column_name": "dnd",
            "action": "view"
          },
          {
            "id": 188,
            "tb_model": "Extension",
            "column_name": "dnd",
            "action": "edit"
          },
          {
            "id": 189,
            "tb_model": "Extension",
            "column_name": "followme",
            "action": "view"
          },
          {
            "id": 190,
            "tb_model": "Extension",
            "column_name": "followme",
            "action": "edit"
          },
          {
            "id": 191,
            "tb_model": "Extension",
            "column_name": "ignorebusy",
            "action": "view"
          },
          {
            "id": 192,
            "tb_model": "Extension",
            "column_name": "ignorebusy",
            "action": "edit"
          },
          {
            "id": 193,
            "tb_model": "Extension",
            "column_name": "blockIncomingStatus",
            "action": "view"
          },
          {
            "id": 194,
            "tb_model": "Extension",
            "column_name": "blockIncomingStatus",
            "action": "edit"
          },
          {
            "id": 195,
            "tb_model": "Extension",
            "column_name": "blockOutGoingStatus",
            "action": "view"
          },
          {
            "id": 196,
            "tb_model": "Extension",
            "column_name": "blockOutGoingStatus",
            "action": "edit"
          },
          {
            "id": 197,
            "tb_model": "Extension",
            "column_name": "created_by",
            "action": "view"
          },
          {
            "id": 198,
            "tb_model": "Extension",
            "column_name": "created_by",
            "action": "edit"
          },
          {
            "id": 199,
            "tb_model": "Extension",
            "column_name": "sofia_status",
            "action": "view"
          },
          {
            "id": 200,
            "tb_model": "Extension",
            "column_name": "sofia_status",
            "action": "edit"
          },
          {
            "id": 201,
            "tb_model": "Extension",
            "column_name": "cidr",
            "action": "view"
          },
          {
            "id": 202,
            "tb_model": "Extension",
            "column_name": "cidr",
            "action": "edit"
          },
          {
            "id": 203,
            "tb_model": "Extension",
            "column_name": "moh_sound",
            "action": "view"
          },
          {
            "id": 204,
            "tb_model": "Extension",
            "column_name": "moh_sound",
            "action": "edit"
          },
          {
            "id": 205,
            "tb_model": "Extension",
            "column_name": "forward",
            "action": "view"
          },
          {
            "id": 206,
            "tb_model": "Extension",
            "column_name": "forward",
            "action": "edit"
          },
          {
            "id": 207,
            "tb_model": "Extension",
            "column_name": "forward_to",
            "action": "view"
          },
          {
            "id": 208,
            "tb_model": "Extension",
            "column_name": "forward_to",
            "action": "edit"
          },
          {
            "id": 209,
            "tb_model": "Extension",
            "column_name": "deleted_at",
            "action": "view"
          },
          {
            "id": 210,
            "tb_model": "Extension",
            "column_name": "deleted_at",
            "action": "edit"
          },
          {
            "id": 211,
            "tb_model": "Extension",
            "column_name": "created_at",
            "action": "view"
          },
          {
            "id": 212,
            "tb_model": "Extension",
            "column_name": "created_at",
            "action": "edit"
          },
          {
            "id": 213,
            "tb_model": "Extension",
            "column_name": "updated_at",
            "action": "view"
          },
          {
            "id": 214,
            "tb_model": "Extension",
            "column_name": "updated_at",
            "action": "edit"
          }
        ]
      },
      {
        "id": 3,
        "model": "RolePermission",
        "slug": "Role Permission",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 529,
            "model": "RolePermission",
            "slug": "Role Permission",
            "action": "browse"
          },
          {
            "id": 530,
            "model": "RolePermission",
            "slug": "Role Permission",
            "action": "read"
          },
          {
            "id": 531,
            "model": "RolePermission",
            "slug": "Role Permission",
            "action": "edit"
          },
          {
            "id": 532,
            "model": "RolePermission",
            "slug": "Role Permission",
            "action": "add"
          },
          {
            "id": 533,
            "model": "RolePermission",
            "slug": "Role Permission",
            "action": "delete"
          },
          {
            "id": 534,
            "model": "RolePermission",
            "slug": "Role Permission",
            "action": "search"
          }
        ],
        "table_records": [
          {
            "id": 1527,
            "tb_model": "RolePermission",
            "column_name": "id",
            "action": "view"
          },
          {
            "id": 1528,
            "tb_model": "RolePermission",
            "column_name": "id",
            "action": "edit"
          },
          {
            "id": 1529,
            "tb_model": "RolePermission",
            "column_name": "role_id",
            "action": "view"
          },
          {
            "id": 1530,
            "tb_model": "RolePermission",
            "column_name": "role_id",
            "action": "edit"
          },
          {
            "id": 1531,
            "tb_model": "RolePermission",
            "column_name": "permission_id",
            "action": "view"
          },
          {
            "id": 1532,
            "tb_model": "RolePermission",
            "column_name": "permission_id",
            "action": "edit"
          },
          {
            "id": 1533,
            "tb_model": "RolePermission",
            "column_name": "created_at",
            "action": "view"
          },
          {
            "id": 1534,
            "tb_model": "RolePermission",
            "column_name": "created_at",
            "action": "edit"
          },
          {
            "id": 1535,
            "tb_model": "RolePermission",
            "column_name": "updated_at",
            "action": "view"
          },
          {
            "id": 1536,
            "tb_model": "RolePermission",
            "column_name": "updated_at",
            "action": "edit"
          }
        ]
      },
      {
        "id": 4,
        "model": "Role",
        "slug": "Role",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 517,
            "model": "Role",
            "slug": "Role",
            "action": "browse"
          },
          {
            "id": 518,
            "model": "Role",
            "slug": "Role",
            "action": "read"
          },
          {
            "id": 519,
            "model": "Role",
            "slug": "Role",
            "action": "edit"
          },
          {
            "id": 520,
            "model": "Role",
            "slug": "Role",
            "action": "add"
          },
          {
            "id": 521,
            "model": "Role",
            "slug": "Role",
            "action": "delete"
          },
          {
            "id": 522,
            "model": "Role",
            "slug": "Role",
            "action": "search"
          }
        ],
        "table_records": [
          {
            "id": 1509,
            "tb_model": "Role",
            "column_name": "id",
            "action": "view"
          },
          {
            "id": 1510,
            "tb_model": "Role",
            "column_name": "id",
            "action": "edit"
          },
          {
            "id": 1511,
            "tb_model": "Role",
            "column_name": "name",
            "action": "view"
          },
          {
            "id": 1512,
            "tb_model": "Role",
            "column_name": "name",
            "action": "edit"
          },
          {
            "id": 1513,
            "tb_model": "Role",
            "column_name": "account_id",
            "action": "view"
          },
          {
            "id": 1514,
            "tb_model": "Role",
            "column_name": "account_id",
            "action": "edit"
          },
          {
            "id": 1515,
            "tb_model": "Role",
            "column_name": "created_by",
            "action": "view"
          },
          {
            "id": 1516,
            "tb_model": "Role",
            "column_name": "created_by",
            "action": "edit"
          },
          {
            "id": 1517,
            "tb_model": "Role",
            "column_name": "is_default",
            "action": "view"
          },
          {
            "id": 1518,
            "tb_model": "Role",
            "column_name": "is_default",
            "action": "edit"
          },
          {
            "id": 1519,
            "tb_model": "Role",
            "column_name": "role_type",
            "action": "view"
          },
          {
            "id": 1520,
            "tb_model": "Role",
            "column_name": "role_type",
            "action": "edit"
          },
          {
            "id": 1521,
            "tb_model": "Role",
            "column_name": "deleted_at",
            "action": "view"
          },
          {
            "id": 1522,
            "tb_model": "Role",
            "column_name": "deleted_at",
            "action": "edit"
          },
          {
            "id": 1523,
            "tb_model": "Role",
            "column_name": "created_at",
            "action": "view"
          },
          {
            "id": 1524,
            "tb_model": "Role",
            "column_name": "created_at",
            "action": "edit"
          },
          {
            "id": 1525,
            "tb_model": "Role",
            "column_name": "updated_at",
            "action": "view"
          },
          {
            "id": 1526,
            "tb_model": "Role",
            "column_name": "updated_at",
            "action": "edit"
          }
        ]
      },
      {
        "id": 5,
        "model": "Permission",
        "slug": "Permission",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 463,
            "model": "Permission",
            "slug": "Permission",
            "action": "browse"
          },
          {
            "id": 464,
            "model": "Permission",
            "slug": "Permission",
            "action": "read"
          },
          {
            "id": 465,
            "model": "Permission",
            "slug": "Permission",
            "action": "edit"
          },
          {
            "id": 466,
            "model": "Permission",
            "slug": "Permission",
            "action": "add"
          },
          {
            "id": 467,
            "model": "Permission",
            "slug": "Permission",
            "action": "delete"
          },
          {
            "id": 468,
            "model": "Permission",
            "slug": "Permission",
            "action": "search"
          }
        ],
        "table_records": [
          {
            "id": 1315,
            "tb_model": "Permission",
            "column_name": "id",
            "action": "view"
          },
          {
            "id": 1316,
            "tb_model": "Permission",
            "column_name": "id",
            "action": "edit"
          },
          {
            "id": 1317,
            "tb_model": "Permission",
            "column_name": "model",
            "action": "view"
          },
          {
            "id": 1318,
            "tb_model": "Permission",
            "column_name": "model",
            "action": "edit"
          },
          {
            "id": 1319,
            "tb_model": "Permission",
            "column_name": "type",
            "action": "view"
          },
          {
            "id": 1320,
            "tb_model": "Permission",
            "column_name": "type",
            "action": "edit"
          },
          {
            "id": 1321,
            "tb_model": "Permission",
            "column_name": "action",
            "action": "view"
          },
          {
            "id": 1322,
            "tb_model": "Permission",
            "column_name": "action",
            "action": "edit"
          },
          {
            "id": 1323,
            "tb_model": "Permission",
            "column_name": "slug",
            "action": "view"
          },
          {
            "id": 1324,
            "tb_model": "Permission",
            "column_name": "slug",
            "action": "edit"
          },
          {
            "id": 1325,
            "tb_model": "Permission",
            "column_name": "created_at",
            "action": "view"
          },
          {
            "id": 1326,
            "tb_model": "Permission",
            "column_name": "created_at",
            "action": "edit"
          },
          {
            "id": 1327,
            "tb_model": "Permission",
            "column_name": "updated_at",
            "action": "view"
          },
          {
            "id": 1328,
            "tb_model": "Permission",
            "column_name": "updated_at",
            "action": "edit"
          }
        ]
      },
      {
        "id": 6,
        "model": "UserPermission",
        "slug": "User Permission",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 667,
            "model": "UserPermission",
            "slug": "User Permission",
            "action": "browse"
          },
          {
            "id": 668,
            "model": "UserPermission",
            "slug": "User Permission",
            "action": "read"
          },
          {
            "id": 669,
            "model": "UserPermission",
            "slug": "User Permission",
            "action": "edit"
          },
          {
            "id": 670,
            "model": "UserPermission",
            "slug": "User Permission",
            "action": "add"
          },
          {
            "id": 671,
            "model": "UserPermission",
            "slug": "User Permission",
            "action": "delete"
          },
          {
            "id": 672,
            "model": "UserPermission",
            "slug": "User Permission",
            "action": "search"
          }
        ],
        "table_records": [
          {
            "id": 1849,
            "tb_model": "UserPermission",
            "column_name": "id",
            "action": "view"
          },
          {
            "id": 1850,
            "tb_model": "UserPermission",
            "column_name": "id",
            "action": "edit"
          },
          {
            "id": 1851,
            "tb_model": "UserPermission",
            "column_name": "user_id",
            "action": "view"
          },
          {
            "id": 1852,
            "tb_model": "UserPermission",
            "column_name": "user_id",
            "action": "edit"
          },
          {
            "id": 1853,
            "tb_model": "UserPermission",
            "column_name": "permission_id",
            "action": "view"
          },
          {
            "id": 1854,
            "tb_model": "UserPermission",
            "column_name": "permission_id",
            "action": "edit"
          },
          {
            "id": 1855,
            "tb_model": "UserPermission",
            "column_name": "created_at",
            "action": "view"
          },
          {
            "id": 1856,
            "tb_model": "UserPermission",
            "column_name": "created_at",
            "action": "edit"
          },
          {
            "id": 1857,
            "tb_model": "UserPermission",
            "column_name": "updated_at",
            "action": "view"
          },
          {
            "id": 1858,
            "tb_model": "UserPermission",
            "column_name": "updated_at",
            "action": "edit"
          }
        ]
      },
      {
        "id": 7,
        "model": "UserRole",
        "slug": "User Role",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 673,
            "model": "UserRole",
            "slug": "User Role",
            "action": "browse"
          },
          {
            "id": 674,
            "model": "UserRole",
            "slug": "User Role",
            "action": "read"
          },
          {
            "id": 675,
            "model": "UserRole",
            "slug": "User Role",
            "action": "edit"
          },
          {
            "id": 676,
            "model": "UserRole",
            "slug": "User Role",
            "action": "add"
          },
          {
            "id": 677,
            "model": "UserRole",
            "slug": "User Role",
            "action": "delete"
          },
          {
            "id": 678,
            "model": "UserRole",
            "slug": "User Role",
            "action": "search"
          }
        ],
        "table_records": [
          {
            "id": 1859,
            "tb_model": "UserRole",
            "column_name": "id",
            "action": "view"
          },
          {
            "id": 1860,
            "tb_model": "UserRole",
            "column_name": "id",
            "action": "edit"
          },
          {
            "id": 1861,
            "tb_model": "UserRole",
            "column_name": "user_id",
            "action": "view"
          },
          {
            "id": 1862,
            "tb_model": "UserRole",
            "column_name": "user_id",
            "action": "edit"
          },
          {
            "id": 1863,
            "tb_model": "UserRole",
            "column_name": "role_id",
            "action": "view"
          },
          {
            "id": 1864,
            "tb_model": "UserRole",
            "column_name": "role_id",
            "action": "edit"
          },
          {
            "id": 1865,
            "tb_model": "UserRole",
            "column_name": "created_at",
            "action": "view"
          },
          {
            "id": 1866,
            "tb_model": "UserRole",
            "column_name": "created_at",
            "action": "edit"
          },
          {
            "id": 1867,
            "tb_model": "UserRole",
            "column_name": "updated_at",
            "action": "view"
          },
          {
            "id": 1868,
            "tb_model": "UserRole",
            "column_name": "updated_at",
            "action": "edit"
          }
        ]
      },
      {
        "id": 8,
        "model": "UserModuleAccess",
        "slug": "User Module Access",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 661,
            "model": "UserModuleAccess",
            "slug": "User Module Access",
            "action": "browse"
          },
          {
            "id": 662,
            "model": "UserModuleAccess",
            "slug": "User Module Access",
            "action": "read"
          },
          {
            "id": 663,
            "model": "UserModuleAccess",
            "slug": "User Module Access",
            "action": "edit"
          },
          {
            "id": 664,
            "model": "UserModuleAccess",
            "slug": "User Module Access",
            "action": "add"
          },
          {
            "id": 665,
            "model": "UserModuleAccess",
            "slug": "User Module Access",
            "action": "delete"
          },
          {
            "id": 666,
            "model": "UserModuleAccess",
            "slug": "User Module Access",
            "action": "search"
          }
        ],
        "table_records": []
      },
      {
        "id": 9,
        "model": "ModuleAccess",
        "slug": "Module Access",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 415,
            "model": "ModuleAccess",
            "slug": "Module Access",
            "action": "browse"
          },
          {
            "id": 416,
            "model": "ModuleAccess",
            "slug": "Module Access",
            "action": "read"
          },
          {
            "id": 417,
            "model": "ModuleAccess",
            "slug": "Module Access",
            "action": "edit"
          },
          {
            "id": 418,
            "model": "ModuleAccess",
            "slug": "Module Access",
            "action": "add"
          },
          {
            "id": 419,
            "model": "ModuleAccess",
            "slug": "Module Access",
            "action": "delete"
          },
          {
            "id": 420,
            "model": "ModuleAccess",
            "slug": "Module Access",
            "action": "search"
          }
        ],
        "table_records": []
      },
      {
        "id": 10,
        "model": "ModuleSection",
        "slug": "Module Section",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 421,
            "model": "ModuleSection",
            "slug": "Module Section",
            "action": "browse"
          },
          {
            "id": 422,
            "model": "ModuleSection",
            "slug": "Module Section",
            "action": "read"
          },
          {
            "id": 423,
            "model": "ModuleSection",
            "slug": "Module Section",
            "action": "edit"
          },
          {
            "id": 424,
            "model": "ModuleSection",
            "slug": "Module Section",
            "action": "add"
          },
          {
            "id": 425,
            "model": "ModuleSection",
            "slug": "Module Section",
            "action": "delete"
          },
          {
            "id": 426,
            "model": "ModuleSection",
            "slug": "Module Section",
            "action": "search"
          }
        ],
        "table_records": []
      },
      {
        "id": 11,
        "model": "RoleModuleAccess",
        "slug": "Role Module Access",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 523,
            "model": "RoleModuleAccess",
            "slug": "Role Module Access",
            "action": "browse"
          },
          {
            "id": 524,
            "model": "RoleModuleAccess",
            "slug": "Role Module Access",
            "action": "read"
          },
          {
            "id": 525,
            "model": "RoleModuleAccess",
            "slug": "Role Module Access",
            "action": "edit"
          },
          {
            "id": 526,
            "model": "RoleModuleAccess",
            "slug": "Role Module Access",
            "action": "add"
          },
          {
            "id": 527,
            "model": "RoleModuleAccess",
            "slug": "Role Module Access",
            "action": "delete"
          },
          {
            "id": 528,
            "model": "RoleModuleAccess",
            "slug": "Role Module Access",
            "action": "search"
          }
        ],
        "table_records": []
      },
      {
        "id": 12,
        "model": "RoleTablePermission",
        "slug": "Role Table Permission",
        "module_section": "Accounts",
        "permissions": [
          {
            "id": 535,
            "model": "RoleTablePermission",
            "slug": "Role Table Permission",
            "action": "browse"
          },
          {
            "id": 536,
            "model": "RoleTablePermission",
            "slug": "Role Table Permission",
            "action": "read"
          },
          {
            "id": 537,
            "model": "RoleTablePermission",
            "slug": "Role Table Permission",
            "action": "edit"
          },
          {
            "id": 538,
            "model": "RoleTablePermission",
            "slug": "Role Table Permission",
            "action": "add"
          },
          {
            "id": 539,
            "model": "RoleTablePermission",
            "slug": "Role Table Permission",
            "action": "delete"
          },
          {
            "id": 540,
            "model": "RoleTablePermission",
            "slug": "Role Table Permission",
            "action": "search"
          }
        ],
        "table_records": []
      }
    ],
    "Number Management": [
      {
        "id": 35,
        "model": "DidDetail",
        "slug": "Number Configration",
        "module_section": "Number Management",
        "permissions": [
          {
            "id": 241,
            "model": "DidDetail",
            "slug": "Did Detail",
            "action": "browse"
          },
          {
            "id": 242,
            "model": "DidDetail",
            "slug": "Did Detail",
            "action": "read"
          },
          {
            "id": 243,
            "model": "DidDetail",
            "slug": "Did Detail",
            "action": "edit"
          },
          {
            "id": 244,
            "model": "DidDetail",
            "slug": "Did Detail",
            "action": "add"
          },
          {
            "id": 245,
            "model": "DidDetail",
            "slug": "Did Detail",
            "action": "delete"
          },
          {
            "id": 246,
            "model": "DidDetail",
            "slug": "Did Detail",
            "action": "search"
          }
        ],
        "table_records": [
          {
            "id": 779,
            "tb_model": "DidDetail",
            "column_name": "id",
            "action": "view"
          },
          {
            "id": 780,
            "tb_model": "DidDetail",
            "column_name": "id",
            "action": "edit"
          },
          {
            "id": 781,
            "tb_model": "DidDetail",
            "column_name": "account_id",
            "action": "view"
          },
          {
            "id": 782,
            "tb_model": "DidDetail",
            "column_name": "account_id",
            "action": "edit"
          },
          {
            "id": 783,
            "tb_model": "DidDetail",
            "column_name": "orderid",
            "action": "view"
          },
          {
            "id": 784,
            "tb_model": "DidDetail",
            "column_name": "orderid",
            "action": "edit"
          },
          {
            "id": 785,
            "tb_model": "DidDetail",
            "column_name": "did_vendor_id",
            "action": "view"
          },
          {
            "id": 786,
            "tb_model": "DidDetail",
            "column_name": "did_vendor_id",
            "action": "edit"
          },
          {
            "id": 787,
            "tb_model": "DidDetail",
            "column_name": "domain",
            "action": "view"
          },
          {
            "id": 788,
            "tb_model": "DidDetail",
            "column_name": "domain",
            "action": "edit"
          },
          {
            "id": 789,
            "tb_model": "DidDetail",
            "column_name": "did",
            "action": "view"
          },
          {
            "id": 790,
            "tb_model": "DidDetail",
            "column_name": "did",
            "action": "edit"
          },
          {
            "id": 791,
            "tb_model": "DidDetail",
            "column_name": "usages",
            "action": "view"
          },
          {
            "id": 792,
            "tb_model": "DidDetail",
            "column_name": "usages",
            "action": "edit"
          },
          {
            "id": 793,
            "tb_model": "DidDetail",
            "column_name": "cnam",
            "action": "view"
          },
          {
            "id": 794,
            "tb_model": "DidDetail",
            "column_name": "cnam",
            "action": "edit"
          },
          {
            "id": 795,
            "tb_model": "DidDetail",
            "column_name": "sms",
            "action": "view"
          },
          {
            "id": 796,
            "tb_model": "DidDetail",
            "column_name": "sms",
            "action": "edit"
          },
          {
            "id": 797,
            "tb_model": "DidDetail",
            "column_name": "e911",
            "action": "view"
          },
          {
            "id": 798,
            "tb_model": "DidDetail",
            "column_name": "e911",
            "action": "edit"
          },
          {
            "id": 799,
            "tb_model": "DidDetail",
            "column_name": "tollfreePrefix",
            "action": "view"
          },
          {
            "id": 800,
            "tb_model": "DidDetail",
            "column_name": "tollfreePrefix",
            "action": "edit"
          },
          {
            "id": 801,
            "tb_model": "DidDetail",
            "column_name": "npanxx",
            "action": "view"
          },
          {
            "id": 802,
            "tb_model": "DidDetail",
            "column_name": "npanxx",
            "action": "edit"
          },
          {
            "id": 803,
            "tb_model": "DidDetail",
            "column_name": "ratecenter",
            "action": "view"
          },
          {
            "id": 804,
            "tb_model": "DidDetail",
            "column_name": "ratecenter",
            "action": "edit"
          },
          {
            "id": 805,
            "tb_model": "DidDetail",
            "column_name": "thinqTier",
            "action": "view"
          },
          {
            "id": 806,
            "tb_model": "DidDetail",
            "column_name": "thinqTier",
            "action": "edit"
          },
          {
            "id": 807,
            "tb_model": "DidDetail",
            "column_name": "currency",
            "action": "view"
          },
          {
            "id": 808,
            "tb_model": "DidDetail",
            "column_name": "currency",
            "action": "edit"
          },
          {
            "id": 809,
            "tb_model": "DidDetail",
            "column_name": "price",
            "action": "view"
          },
          {
            "id": 810,
            "tb_model": "DidDetail",
            "column_name": "price",
            "action": "edit"
          },
          {
            "id": 811,
            "tb_model": "DidDetail",
            "column_name": "default_outbound",
            "action": "view"
          },
          {
            "id": 812,
            "tb_model": "DidDetail",
            "column_name": "default_outbound",
            "action": "edit"
          },
          {
            "id": 813,
            "tb_model": "DidDetail",
            "column_name": "created_by",
            "action": "view"
          },
          {
            "id": 814,
            "tb_model": "DidDetail",
            "column_name": "created_by",
            "action": "edit"
          },
          {
            "id": 815,
            "tb_model": "DidDetail",
            "column_name": "created_at",
            "action": "view"
          },
          {
            "id": 816,
            "tb_model": "DidDetail",
            "column_name": "created_at",
            "action": "edit"
          },
          {
            "id": 817,
            "tb_model": "DidDetail",
            "column_name": "updated_at",
            "action": "view"
          },
          {
            "id": 818,
            "tb_model": "DidDetail",
            "column_name": "updated_at",
            "action": "edit"
          }
        ]
      },
      {
        "id": 36,
        "model": "DidConfigure",
        "slug": "Did Configure",
        "module_section": "Number Management",
        "permissions": [
          {
            "id": 235,
            "model": "DidConfigure",
            "slug": "Did Configure",
            "action": "browse"
          },
          {
            "id": 236,
            "model": "DidConfigure",
            "slug": "Did Configure",
            "action": "read"
          },
          {
            "id": 237,
            "model": "DidConfigure",
            "slug": "Did Configure",
            "action": "edit"
          },
          {
            "id": 238,
            "model": "DidConfigure",
            "slug": "Did Configure",
            "action": "add"
          },
          {
            "id": 239,
            "model": "DidConfigure",
            "slug": "Did Configure",
            "action": "delete"
          },
          {
            "id": 240,
            "model": "DidConfigure",
            "slug": "Did Configure",
            "action": "search"
          }
        ],
        "table_records": [
          {
            "id": 739,
            "tb_model": "DidConfigure",
            "column_name": "id",
            "action": "view"
          },
          {
            "id": 740,
            "tb_model": "DidConfigure",
            "column_name": "id",
            "action": "edit"
          },
          {
            "id": 741,
            "tb_model": "DidConfigure",
            "column_name": "did_id",
            "action": "view"
          },
          {
            "id": 742,
            "tb_model": "DidConfigure",
            "column_name": "did_id",
            "action": "edit"
          },
          {
            "id": 743,
            "tb_model": "DidConfigure",
            "column_name": "usages",
            "action": "view"
          },
          {
            "id": 744,
            "tb_model": "DidConfigure",
            "column_name": "usages",
            "action": "edit"
          },
          {
            "id": 745,
            "tb_model": "DidConfigure",
            "column_name": "action",
            "action": "view"
          },
          {
            "id": 746,
            "tb_model": "DidConfigure",
            "column_name": "action",
            "action": "edit"
          },
          {
            "id": 747,
            "tb_model": "DidConfigure",
            "column_name": "forward",
            "action": "view"
          },
          {
            "id": 748,
            "tb_model": "DidConfigure",
            "column_name": "forward",
            "action": "edit"
          },
          {
            "id": 749,
            "tb_model": "DidConfigure",
            "column_name": "forward_to",
            "action": "view"
          },
          {
            "id": 750,
            "tb_model": "DidConfigure",
            "column_name": "forward_to",
            "action": "edit"
          },
          {
            "id": 751,
            "tb_model": "DidConfigure",
            "column_name": "record",
            "action": "view"
          },
          {
            "id": 752,
            "tb_model": "DidConfigure",
            "column_name": "record",
            "action": "edit"
          },
          {
            "id": 753,
            "tb_model": "DidConfigure",
            "column_name": "hold_music",
            "action": "view"
          },
          {
            "id": 754,
            "tb_model": "DidConfigure",
            "column_name": "hold_music",
            "action": "edit"
          },
          {
            "id": 755,
            "tb_model": "DidConfigure",
            "column_name": "stick_agent_type",
            "action": "view"
          },
          {
            "id": 756,
            "tb_model": "DidConfigure",
            "column_name": "stick_agent_type",
            "action": "edit"
          },
          {
            "id": 757,
            "tb_model": "DidConfigure",
            "column_name": "stick_agent_expires",
            "action": "view"
          },
          {
            "id": 758,
            "tb_model": "DidConfigure",
            "column_name": "stick_agent_expires",
            "action": "edit"
          },
          {
            "id": 759,
            "tb_model": "DidConfigure",
            "column_name": "sticky_agent_enable",
            "action": "view"
          },
          {
            "id": 760,
            "tb_model": "DidConfigure",
            "column_name": "sticky_agent_enable",
            "action": "edit"
          },
          {
            "id": 761,
            "tb_model": "DidConfigure",
            "column_name": "spam_filter_type",
            "action": "view"
          },
          {
            "id": 762,
            "tb_model": "DidConfigure",
            "column_name": "spam_filter_type",
            "action": "edit"
          },
          {
            "id": 763,
            "tb_model": "DidConfigure",
            "column_name": "dtmf_type",
            "action": "view"
          },
          {
            "id": 764,
            "tb_model": "DidConfigure",
            "column_name": "dtmf_type",
            "action": "edit"
          },
          {
            "id": 765,
            "tb_model": "DidConfigure",
            "column_name": "dtmf_length",
            "action": "view"
          },
          {
            "id": 766,
            "tb_model": "DidConfigure",
            "column_name": "dtmf_length",
            "action": "edit"
          },
          {
            "id": 767,
            "tb_model": "DidConfigure",
            "column_name": "dtmf_retries",
            "action": "view"
          },
          {
            "id": 768,
            "tb_model": "DidConfigure",
            "column_name": "dtmf_retries",
            "action": "edit"
          },
          {
            "id": 769,
            "tb_model": "DidConfigure",
            "column_name": "dtmf_retry_file_sound",
            "action": "view"
          },
          {
            "id": 770,
            "tb_model": "DidConfigure",
            "column_name": "dtmf_retry_file_sound",
            "action": "edit"
          },
          {
            "id": 771,
            "tb_model": "DidConfigure",
            "column_name": "status",
            "action": "view"
          },
          {
            "id": 772,
            "tb_model": "DidConfigure",
            "column_name": "status",
            "action": "edit"
          },
          {
            "id": 773,
            "tb_model": "DidConfigure",
            "column_name": "tag",
            "action": "view"
          },
          {
            "id": 774,
            "tb_model": "DidConfigure",
            "column_name": "tag",
            "action": "edit"
          },
          {
            "id": 775,
            "tb_model": "DidConfigure",
            "column_name": "created_at",
            "action": "view"
          },
          {
            "id": 776,
            "tb_model": "DidConfigure",
            "column_name": "created_at",
            "action": "edit"
          },
          {
            "id": 777,
            "tb_model": "DidConfigure",
            "column_name": "updated_at",
            "action": "view"
          },
          {
            "id": 778,
            "tb_model": "DidConfigure",
            "column_name": "updated_at",
            "action": "edit"
          }
        ]
      },
      {
        "id": 37,
        "model": "Port",
        "slug": "Port",
        "module_section": "Number Management",
        "permissions": [
          {
            "id": 469,
            "model": "Port",
            "slug": "Port",
            "action": "browse"
          },
          {
            "id": 470,
            "model": "Port",
            "slug": "Port",
            "action": "read"
          },
          {
            "id": 471,
            "model": "Port",
            "slug": "Port",
            "action": "edit"
          },
          {
            "id": 472,
            "model": "Port",
            "slug": "Port",
            "action": "add"
          },
          {
            "id": 473,
            "model": "Port",
            "slug": "Port",
            "action": "delete"
          },
          {
            "id": 474,
            "model": "Port",
            "slug": "Port",
            "action": "search"
          }
        ],
        "table_records": [
          {
            "id": 1329,
            "tb_model": "Port",
            "column_name": "id",
            "action": "view"
          },
          {
            "id": 1330,
            "tb_model": "Port",
            "column_name": "id",
            "action": "edit"
          },
          {
            "id": 1331,
            "tb_model": "Port",
            "column_name": "account_id",
            "action": "view"
          },
          {
            "id": 1332,
            "tb_model": "Port",
            "column_name": "account_id",
            "action": "edit"
          },
          {
            "id": 1333,
            "tb_model": "Port",
            "column_name": "fullname",
            "action": "view"
          },
          {
            "id": 1334,
            "tb_model": "Port",
            "column_name": "fullname",
            "action": "edit"
          },
          {
            "id": 1335,
            "tb_model": "Port",
            "column_name": "company_name",
            "action": "view"
          },
          {
            "id": 1336,
            "tb_model": "Port",
            "column_name": "company_name",
            "action": "edit"
          },
          {
            "id": 1337,
            "tb_model": "Port",
            "column_name": "billing_address",
            "action": "view"
          },
          {
            "id": 1338,
            "tb_model": "Port",
            "column_name": "billing_address",
            "action": "edit"
          },
          {
            "id": 1339,
            "tb_model": "Port",
            "column_name": "pin",
            "action": "view"
          },
          {
            "id": 1340,
            "tb_model": "Port",
            "column_name": "pin",
            "action": "edit"
          },
          {
            "id": 1341,
            "tb_model": "Port",
            "column_name": "carrier",
            "action": "view"
          },
          {
            "id": 1342,
            "tb_model": "Port",
            "column_name": "carrier",
            "action": "edit"
          },
          {
            "id": 1343,
            "tb_model": "Port",
            "column_name": "account_number",
            "action": "view"
          },
          {
            "id": 1344,
            "tb_model": "Port",
            "column_name": "account_number",
            "action": "edit"
          },
          {
            "id": 1345,
            "tb_model": "Port",
            "column_name": "phone_number",
            "action": "view"
          },
          {
            "id": 1346,
            "tb_model": "Port",
            "column_name": "phone_number",
            "action": "edit"
          },
          {
            "id": 1347,
            "tb_model": "Port",
            "column_name": "created_at",
            "action": "view"
          },
          {
            "id": 1348,
            "tb_model": "Port",
            "column_name": "created_at",
            "action": "edit"
          },
          {
            "id": 1349,
            "tb_model": "Port",
            "column_name": "updated_at",
            "action": "view"
          },
          {
            "id": 1350,
            "tb_model": "Port",
            "column_name": "updated_at",
            "action": "edit"
          }
        ]
      }
    ],
  },
  "message": "Successfully fetched all permissions"
}