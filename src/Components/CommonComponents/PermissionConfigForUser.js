import React, { useCallback, useEffect, useState } from 'react'
import { backToTop, generalGetFunction, generalPostFunction } from '../GlobalFunction/globalFunction';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import SkeletonTableLoader from '../Loader/SkeletonTableLoader';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { set } from 'react-hook-form';
import Tippy from '@tippyjs/react';

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
                          <div className='formLabel me-3'>
                            <label>
                              Select Class Type
                            </label>
                          </div>
                          <div className='row me-auto'>
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
                        setLoading={setLoading}
                        standalone={true}
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

export function PermissionConfigTable({ standalone, allRoleList, selectedGroup, selectedRole, allPermissions, loading, setLoading, setRolePermissionBridge, setUserPermissionBridge, existingUserData, isUserFilter }) {
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

    // Initialize with permissions for the selected role
    if (isUserFilter && selectedRole == existingUserData?.user_role?.role_id) {
      setRolePermissions(prev => ({
        ...prev,
        role_id: selectedRole || [],
        permissions: existingUserData?.permissions || [],
        tablePermissions: existingUserData?.tablePermissions || [],
        sectionPermissions: existingUserData?.sectionPermissions || []
      }));
    } else {
      setRolePermissions(prev => ({
        ...prev,
        role_id: selectedRole || [],
        permissions: allRoleList?.find((role) => role.id == selectedRole)?.permissions || [],
        tablePermissions: allRoleList?.find((role) => role.id == selectedRole)?.tablePermissions || [],
        sectionPermissions: allRoleList?.find((role) => role.id == selectedRole)?.sectionPermissions || []
      }));
    }
  }, [selectedRole, allRoleList, existingUserData]);

  const resetPermissionToInitialState = () => {
    // Initialize with permissions for the selected role
    if (isUserFilter && selectedRole == existingUserData?.user_role?.role_id) {
      setRolePermissions(prev => ({
        ...prev,
        role_id: selectedRole || [],
        permissions: existingUserData?.permissions || [],
        tablePermissions: existingUserData?.tablePermissions || [],
        sectionPermissions: existingUserData?.sectionPermissions || []
      }));
    } else {
      setRolePermissions(prev => ({
        ...prev,
        role_id: selectedRole || [],
        permissions: allRoleList?.find((role) => role.id == selectedRole)?.permissions || [],
        tablePermissions: allRoleList?.find((role) => role.id == selectedRole)?.tablePermissions || [],
        sectionPermissions: allRoleList?.find((role) => role.id == selectedRole)?.sectionPermissions || []
      }));
    }
  }

  // To update UserPermissions (Specially Edit)
  useEffect(() => {
    if (setUserPermissionBridge) {
      function getRemovedPermissions(original, modified) {
        return {
          role_id: selectedRole,
          permissions: (original.permissions || []).filter(x => !(modified.permissions || []).includes(x)),
          tablePermissions: (original.tablePermissions || []).filter(x => !(modified.tablePermissions || []).includes(x)),
          sectionPermissions: (original.sectionPermissions || []).filter(x => !(modified.sectionPermissions || []).includes(x))
        };
      }
      let originalArr = {
        role_id: selectedRole || [],
        permissions: allRoleList?.find((role) => role.id == selectedRole)?.permissions || [],
        tablePermissions: allRoleList?.find((role) => role.id == selectedRole)?.tablePermissions || [],
        sectionPermissions: allRoleList?.find((role) => role.id == selectedRole)?.sectionPermissions || []
      };
      setUserPermissionBridge(getRemovedPermissions(originalArr, rolePermissions));
    }
  }, [rolePermissions])

  // Instantly update rolePermissionBridge
  useEffect(() => {
    if (setRolePermissionBridge) {
      setRolePermissionBridge(rolePermissions);
    }
  }, [rolePermissions]);

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
      const isExpanded = modulePermissions.some((perm) => rolePermissions.sectionPermissions.includes(perm.id));
      // Expand / Collapse a Section depending on the permissions it has
      setExpandedSections(prev => ({ ...prev, [moduleName]: isExpanded }))
      if (Array.isArray(modulePermissions)) {
        for (const item of modulePermissions) {
          if (rolePermissions.sectionPermissions.includes(item.id)) {
            for (const subItem of item.permissions) {
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
    if (account.usertype !== 'Company' && !account.sectionPermissions.includes(modelId)) {
      toast.error("You don't have permission to perform this action", { toastId: "permission-error" });
      return;
    }
    if (permissions.length > 0 || tableRecords.length > 0) {
      const permissionIds = permissions.map(p => p.id);
      const tableRecordIds = tableRecords.map(r => r.id);
      if (account.usertype !== 'Company') {
        if (
          !permissionIds.every(id => account.permissions.includes(id)) ||
          !tableRecordIds.every(id => account.tablePermissions.includes(id))
        ) {
          toast.error("You don't have permission to perform this action", { toastId: "permission-error" });
          // return;
        }
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

        // Remove modelId from sectionPermissions
        newPermissions.sectionPermissions = newPermissions.sectionPermissions.filter(
          id => id !== modelId
        );
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


  const toggleSection = (sectionName, models) => {
    const permissionMatch = models.some(m => rolePermissions.sectionPermissions.includes(m.id));
    if (!permissionMatch) {
      setExpandedSections(prev => ({
        ...prev,
        [sectionName]: !prev[sectionName]
      }));
    } else {
      // Collapse the Section and deselect all the permissions
      models.forEach(model => {
        handleMasterToggle(
          model.id,
          model.module_section,
          model.permissions,
          model.table_records,
          false
        );
      });
      setTimeout(() => {
        setExpandedSections(prev => ({
          ...prev,
          [sectionName]: false
        }));
      }, 500)
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

  const handleSavePermissions = async () => {
    if (selectedRole == null) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);
    try {
      const response = await generalPostFunction('/assign-permission-role', rolePermissions);
      if (response.status) {
        toast.success("Permissions saved successfully");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className={`col-xl-12 ${standalone ? 'col-xxl-8' : ''} userPermission__contentBox`}>
      {Object.entries(permissionData).map(([sectionName, models]) => {
        const roleObj = allRoleList?.find((role) => role.id == selectedRole);
        const isSuperAdmin = account?.usertype === 'Company' || account?.usertype === 'SupreAdmin';

        // First filter models by section permissions
        const sectionFilteredModels = models.filter(model => {
          return isUserFilter
            ? roleObj?.sectionPermissions?.includes(model.id) && roleObj?.sections?.includes(model.section_id)
            : account?.sectionPermissions?.includes(model.id) && account?.sections?.includes(model.section_id);
        });

        // Then filter each model's table_records by table permissions
        const filteredModels = sectionFilteredModels.map(model => {
          const filteredTableRecords = isSuperAdmin
            ? model.table_records // Return all records for SuperAdmin
            : model.table_records?.filter(record => {
              return isUserFilter
                ? roleObj?.tablePermissions?.includes(record.id)
                : account?.tablePermissions?.includes(record.id);
            }) || [];

          const filteredPermissions = isSuperAdmin
            ? model.permissions // Return all permissions for SuperAdmin
            : model.permissions?.filter(permission => {
              return isUserFilter
                ? roleObj?.permissions?.includes(permission.id)
                : account?.permissions?.includes(permission.id);
            }) || [];

          // Return a new model object with filtered table records
          return {
            ...model,
            table_records: filteredTableRecords,
            permissions: filteredPermissions

          };
        })
        // .filter(model => model.table_records.length > 0); // Remove models with no permitted table records

        if (filteredModels.length === 0) return null;

        return (
          <div key={sectionName} className='permissionsConfigWrapper accordion' id="accordionMainParent">
            <div class="accordion-item">
              <div className="heading h-auto justify-content-between" style={{ flexDirection: 'row' }}>
                <button class="accordion-button mainSection" type="button" data-bs-toggle="collapse" data-bs-target={`#${sectionName}`} aria-expanded="false" aria-controls={sectionName}>
                  <div className='d-flex justify-content-between align-items-center w-100'>
                    <h5 className='m-0'>{sectionName}</h5>
                    <div class="cl-toggle-switch">
                      <label class="cl-switch">
                        <input
                          type="checkbox"
                          checked={!!expandedSections[sectionName]}
                          onChange={() => toggleSection(sectionName, filteredModels)}
                        />
                        <span></span>
                      </label>
                    </div>
                  </div>
                </button>
                {expandedSections[sectionName] && (
                  <>
                    <div className='d-flex ms-2'>
                      <Tippy content="Reset permissions to initial state">
                        <div onClick={resetPermissionToInitialState}>
                          <i className='fa-solid fa-arrows-rotate' />
                        </div>
                      </Tippy>
                      <div className="my-auto position-relative ms-3 me-1 d-flex">
                        <span className='me-2'>Master: </span>
                        <div class="cl-toggle-switch">
                          <label class="cl-switch">
                            <input
                              type="checkbox"
                              checked={filteredModels.every(model =>
                                model.permissions.every(p =>
                                  rolePermissions.permissions.includes(p.id)
                                ) &&
                                model.table_records.every(r =>
                                  rolePermissions.tablePermissions.includes(r.id)
                                )
                              )}
                              onChange={(e) => {
                                filteredModels.forEach(model => {
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
                <div id={sectionName} class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionMainParent">
                  <div class="accordion-body">
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
                            filteredModels.map(model => {
                              const allModelPermissionsChecked = model.permissions.every(
                                p => rolePermissions.permissions.includes(p.id)
                              );
                              const allActions = ["browse", "read", "edit", "add", "delete", "search"];


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
                                    {allActions.map(action => {
                                      const permission = model.permissions.find(p => p.action === action);

                                      if (permission) {
                                        return (
                                          <td key={permission.id}>
                                            <div className="my-auto position-relative mx-1">
                                              <div className="cl-toggle-switch">
                                                <label className="cl-switch">
                                                  <input
                                                    type="checkbox"
                                                    checked={
                                                      rolePermissions.sectionPermissions.includes(model.id) &&
                                                      rolePermissions.permissions.includes(permission.id)
                                                    }
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
                                        );
                                      } else {
                                        return <td id={`empty-${action}`}></td>;
                                      }
                                    })}
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
                                              <div className="bg-transparent border-0 accordion-item permission_accordionBody">
                                                <div className='d-flex justify-content-between align-items-center' style={{ backgroundColor: 'var(--ele-color)', borderRadius: '10px' }}>
                                                  <div className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#test-${rowKey}`} aria-expanded="true" aria-controls={`test-${rowKey}`}>
                                                    <h6 className='mb-0'>
                                                      Column Permissions - <b>{row.type.charAt(0).toUpperCase() + row.type.slice(1)}</b>
                                                    </h6>
                                                  </div>
                                                  <div className='pe-2'>
                                                    <div className="my-auto position-relative mx-1 d-flex">
                                                      <span className="me-2" style={{ color: 'var(--immortalBlack)' }}>Master: </span>
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
                                                <div className="accordion-collapse collapse" id={`test-${rowKey}`} aria-labelledby="headingOne" data-bs-parent={`#accordion-${rowKey}`}>
                                                  <div className="row" style={{ padding: '10px' }}>
                                                    {Array.from(new Set(model.table_records.map(r => r.column_name))).map(column => {
                                                      const columnRecords = model.table_records.filter(r => r.column_name === column);
                                                      const filteredColumnRecords = columnRecords.filter(record => record.action === row.type);

                                                      if (filteredColumnRecords.length === 0) return null;

                                                      return (
                                                        <div key={column} className="col-md-3 mb-3">
                                                          <div className="card">
                                                            <div className="card-body">
                                                              {filteredColumnRecords.map(record => (
                                                                <div key={record.id} className="d-flex justify-content-between gap-2">
                                                                  <div className='scroll_text'>
                                                                    <label className="text-capitalize">
                                                                      {column.replace(/_/g, ' ')}
                                                                    </label>
                                                                  </div>
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
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {standalone && <div className="mt-4">
        <button
          className="btn btn-primary"
          onClick={handleSavePermissions}
        >
          Save Permissions
        </button>
      </div>}
    </div>
  );
}