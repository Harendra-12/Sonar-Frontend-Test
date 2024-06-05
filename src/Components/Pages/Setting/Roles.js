import React, { useEffect, useState } from 'react'
import { generalDeleteFunction, generalGetFunction, generalPostFunction, generalPutFunction } from '../../GlobalFunction/globalFunction'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../CommonComponents/Header";
import { useSelector } from 'react-redux';
import CircularLoader from '../Misc/CircularLoader';

function Roles() {
    const account = useSelector((state)=>state.account)
    const [role,setRole]=useState()
    const [popup,setPopup]=useState(false)
    const [editClick,setEditClick]=useState(false)
    const [saveClick,setSaveClick]=useState(false)
    const [updateRole,setUpdateRole]=useState()
    const [editIndex,setEditIndex]=useState()
    const [newRole,setNewRole]=useState("")
    const [addRole,setAddRole]=useState(false)
    const [deleteIndex,setDeleteIndex]=useState()
    const [refresh,setRefresh]=useState(0)
    const [loading,setLoading]=useState(false)
    useEffect(()=>{
        async function getData(){
            const apiData = await generalGetFunction(`/roles?acount_id=${account.account_id}`)
            if(apiData.status){
                setRole(apiData.data)
            }
        }
        getData()
    },[refresh])

    async function handleSubmit(){
        setPopup(false)
        if(addRole){
            if(newRole===""){
                toast.error("Please enter new role")
            }else{
                setLoading(true)
                const parsedData = {
                    name:newRole,
                    created_by:account.account_id
                }
                const apiData = await generalPostFunction("/role/store",parsedData)
                if(apiData.status){
                    setLoading(false)
                    setRefresh(refresh+1)
                    toast.success(apiData.message)
                    setPopup(false)
                    setSaveClick(false)
                    setNewRole("")
                    setAddRole(false)
                }else{
                    setLoading(false)
                    toast.error(apiData.message)
                }
            }
        }else if(editClick){
            if(updateRole===""){
                toast.error("Please fill the role")
            }else{
                setLoading(true)
                const parsedData = {
                    name:updateRole
                }
                const apiData = await generalPutFunction(`/role/${role[editIndex].id}`,parsedData)
                if(apiData.status){
                    toast.success(apiData.message);
                    setEditClick(false);
                    setUpdateRole("")
                    setLoading(false)
                    setEditIndex()
                }else{
                    setLoading(false)
                    toast.error(apiData.message)
                }
            }

        }else{
            setLoading(true)
            const apiData = await generalDeleteFunction(`/role/${role[deleteIndex].id}`)
            if(apiData.status){
                setEditClick(false)
                setDeleteIndex()
                toast.success(apiData.success)
                setLoading(false)
            }else{
                setLoading(false)
                toast.error(apiData.message)
            }
        }
    }
  return (
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
                      <div className="col-auto">
                        List of Roles{" "}
                      </div>
                      {/* <div className="col pe-0">
                        <input type="search" name="Search" id="headerSearch" placeholder="Search a role" onChange={(e) => setSearchDomain(e.target.value)} />
                      </div> */}
                      <div className="col-auto ps-0 mt-1">
                        <button className="clearButton" style={{ width: '100%', height: '100%', fontSize: 22 }}>
                          <i
                            className="fa-duotone fa-circle-plus"
                            onClick={() => {
                              setAddRole(true);
                              setEditClick(false)
                            }}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </h6>
                  <ul>
                    {addRole ? (
                      <li>
                        <input
                          type="text"
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          placeholder="Add new Role"
                        ></input>
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
                      </li>
                    ) : (
                      ""
                    )}
                    {role &&
                      role.map((item, index) => {
                        return (
                          <li key={index}>
                            <input
                              type="text"
                              placeholder={item.name}
                              onChange={(e) => setUpdateRole(e.target.value)}
                              disabled={
                                editIndex === index
                                  ? false
                                  : true
                              }
                            ></input>
                            <button className="clearButton text-success">
                              {editIndex === index  ? (
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
                                  setDeleteIndex(index)
                                  setEditClick(false);
                                  setAddRole(false)
                                }}
                              ></i>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
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
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Warning!</h4>
                  {saveClick ? (
                    <p>
                      Are you sure you want to add this Role: {newRole}?
                    </p>
                  ) : editClick ? (
                    <p>
                      Are you sure you want to change {role[editIndex].name}{" "}
                      to {updateRole}?
                    </p>
                  ): (
                    <p>
                      Are you sure you want to delete this {role[deleteIndex].name} ?
                    </p>
                  )}

                  <button className="panelButton m-0" onClick={()=>{handleSubmit()}} >
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
  )
}

export default Roles
