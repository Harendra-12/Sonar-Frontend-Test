import React, { useEffect, useState } from 'react'
import CircularLoader from '../../Loader/CircularLoader';
import Header from '../../CommonComponents/Header';
import { toast } from 'react-toastify';
import { generalDeleteFunction, generalGetFunction, generalPutFunction } from '../../GlobalFunction/globalFunction';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AccessControlEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ipAddress, setIpAddress] = useState([]);
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);
  const [description, setDescription] = useState("");
  const [roleId, setRoleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const account = useSelector((state) => state.account)
  const [deletePopup, setDeletePopup] = useState(false);
  const [index, setIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null)



  useEffect(() => {
    async function fetchData() {
      const apidata = await generalGetFunction("/role/all")
      const res = await generalGetFunction(`ip-whitelist/${location.state.id}`)
      if (apidata?.status && res?.status) {
        setRoles(apidata.data);
        setRoleId(res?.data?.role_id)
        setIpAddress(res?.data?.ips)
        setDescription(res?.data?.description);
        setStatus(res?.data?.status);
        setName(res?.data?.name)
        setLoading(false);
      } else {
        toast.error(apidata?.message)
        toast.error(res?.message)
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  async function handleSubmit() {
    if (name === "") {
      toast.error("Please enter name")
    } else if (roleId === "") {
      toast.error("Please select group")
    } else if (ipAddress[0] === "") {
      toast.error("Please enter IP Address")
    } else {
      setLoading(true);
      const parsedData = {
        name: name,
        status: status,
        description: description,
        role_id: roleId,
        data_ip: ipAddress,
        account_id: account.account_id,
      }
      const apiData = await generalPutFunction(`update-ip-whitelists/${location.state.id}`, parsedData)
      if (apiData.status) {
        toast.success(apiData.message);
        setLoading(false);
        // navigate(-1)
      } else {
        // toast.error(apiData.message);
        setLoading(false);
      }
    }
  }

  const handleDeleteIp = async (index, id) => {
    if (id) {
      try {
        setLoading(true)
        const res = await generalDeleteFunction(`delete-ip-whitelists/${id}`)
        if (res.status) {
          setLoading(false)
          toast.success(res?.message)
          setIpAddress(ipAddress.filter((_, i) => i !== index))
        } else {
          setLoading(false)
          // toast.error(res.message)   
        }

      } catch (error) {
        setLoading(false)
        toast.error(error)
      }
      setDeletePopup(false)
    } else {
      setIpAddress(ipAddress.filter((_, i) => i !== index))
      setDeletePopup(false)
    }

  }
  // console.log({ipAddress})
  return (
    <>
      {deletePopup ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-xl-4 col-md-5">
                <div className="col-12 ">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-12 ">
                  <h4 className='text-orange text-center'>Warning!</h4>
                  <p className='text-center'>
                    Are you sure you want to delete this access control?
                  </p>
                  <div className="d-flex justify-content-center gap-2 mt-3">

                    <button
                      disabled={loading}
                      className="panelButton m-0"
                      onClick={() => handleDeleteIp(index, deleteId)}
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
      <div className="mainContent">
        <section id="phonePage">
          <Header title="Access List" />
          <div className="container-fluid">
            <div className="row">
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Access Control Edit
                            <button className="clearButton">
                            </button>
                          </h4>
                          <p>You can edit list of Access Control</p>
                        </div>
                        <div className="buttonGroup">
                          <button type="button" onClick={() => navigate(-1)} effect="ripple" className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>

                          <div
                            effect="ripple"
                            className="panelButton"
                            onClick={handleSubmit}
                          >
                            <span className="text">Save</span>
                            <span className="icon">
                              <i className="fa-solid fa-floppy-disk"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-xl-6"
                      style={{
                        padding: "25px 23px",
                        // borderBottom: "1px solid rgb(221, 221, 221)",
                      }}
                    >
                      <form className="row mb-0">
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="">
                              Name <span className="text-danger">*</span>
                            </label>
                            <label htmlFor="data" className="formItemDesc">
                              Enter a name.
                            </label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <input
                              type="text"
                              name="name"
                              className="formItem"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="formRow col-xl-12 ">
                          <div className="formLabel">
                            <label htmlFor="">Status</label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <select
                              className="formItem" name="status"
                              value={status}
                              onChange={(e) => {
                                const status = e?.target?.value === "true" ? true : false
                                setStatus(status)
                              }
                              }>
                              <option value={false} >Disable</option>
                              <option value={true}>Enable</option>
                            </select>
                          </div>
                        </div>
                        <div className="formRow col-xl-12 ">
                          <div className="formLabel">
                            <label htmlFor="">Description</label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            <input
                              type="text"
                              name="description"
                              className="formItem"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="formRow col-xl-12 ">
                          <div className="formLabel">
                            <label htmlFor="">Role*</label>
                          </div>
                          <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                            {" "}
                            <select className="formItem" name="role_id" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                              <option value="" disabled="" selected="">
                                Choose Type
                              </option>
                              {
                                roles.map((item, index) => {
                                  return (
                                    <option key={index} value={item.id}>{item.name}</option>
                                  )
                                })
                              }
                            </select>
                          </div>
                        </div>
                        <div className="formRow col-xl-12">
                          <div className="formLabel">
                            <label htmlFor="selectFormRow">IP Address</label>
                            <label htmlFor="data" className="formItemDesc">
                              Add IP address or CIDR range.
                            </label>
                          </div>
                        </div>
                        {
                          ipAddress.map((item, index) => {
                            return (
                              <div className=" col-xl-12" key={index}>
                                <div className="formRow justify-content-start align-items-end ">
                                  <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 col-10 mb-2" >
                                    {
                                      index === 0 &&
                                      <div className="formLabel">
                                        <label className="formItemDesc">
                                          IP Address
                                        </label>
                                      </div>
                                    }
                                    <input
                                      type="text"
                                      name="stick_agent_expires"
                                      className="formItem"
                                      value={item?.ip_address || ""}
                                      onChange={(e) => {
                                        let newIpAddress;
                                        if (item.id) {
                                          item.ip_address = e.target.value;
                                          newIpAddress = [...ipAddress];
                                        } else {
                                          newIpAddress = [...ipAddress];
                                          newIpAddress[index] = { ip_address: e.target.value };
                                        }
                                        setIpAddress(newIpAddress)
                                      }}
                                    />
                                  </div>
                                  <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 col-2 mb-2">
                                    {
                                      ipAddress.length > 1 &&
                                      <button type="button" className="tableButton delete mx-3" onClick={() => {
                                        setDeletePopup(true)
                                        setDeleteId(item?.id)
                                        setIndex(index)
                                      }} >
                                        <i className="fa-solid fa-trash" />
                                      </button>
                                    }
                                  </div>
                                  {
                                    index === ipAddress.length - 1 &&
                                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12 " >
                                      <button type="button" className="panelButton ms-0" onClick={() => {
                                        setIpAddress([...ipAddress, ""])
                                      }}>
                                        <span className="text">Add</span>
                                        <span className="icon">
                                          <i className="fa-solid fa-plus"></i>
                                        </span>
                                      </button>
                                    </div>
                                  }
                                </div>
                              </div>
                            )
                          })
                        }
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {
        loading && <CircularLoader />
      }
    </>
  )
}
