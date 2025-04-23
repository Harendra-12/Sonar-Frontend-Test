import React, { useEffect } from 'react'
import CircularLoader from '../../Loader/CircularLoader';
import Header from '../../CommonComponents/Header';
import { toast } from 'react-toastify';
import { generalDeleteFunction, generalGetFunction, generalPutFunction } from '../../GlobalFunction/globalFunction';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AccessControlEdit() {
      const navigate = useNavigate();
      const location=useLocation();
      const [ipAddress, setIpAddress] = React.useState([]);
      const [roles, setRoles] = React.useState([]);
      const [name, setName] = React.useState("");
      const [status, setStatus] = React.useState(null);
      const [description, setDescription] = React.useState("");
      const [roleId, setRoleId] = React.useState(null);
      const [loading, setLoading] = React.useState(true);
      const account = useSelector((state) => state.account);
     


      useEffect(() => {
          async function fetchData() {
            const apidata = await generalGetFunction("/role/all")
            const res = await generalGetFunction(`ip-whitelist/${location.state.id}`)
            if (apidata?.status&&res?.status) {
              setRoles(apidata.data);
              setRoleId(res?.data?.role_id)
              setIpAddress(res?.data?.ips)
              setDescription(res?.data?.description);
              setStatus(res?.data?.status);
              setName(res?.data?.name)
              setLoading(false);
            }else{
              toast.error(apidata?.message)
              toast.error(res?.message)
              setLoading(false);
            }
          }
          fetchData();
        }, []);
      

       async function handleSubmit() {
          if(name === "") {
            toast.error("Please enter name")
          }else if(roleId === "") {
            toast.error("Please select group")
          }else if(ipAddress[0] === "") {
            toast.error("Please enter IP Address")
          }else{
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
              navigate(-1)
            } else {
              // toast.error(apiData.message);
              setLoading(false);
            }
          }
        }

        const handleDeleteIp=async(index,id)=>{
         if(id){
          try {
           setLoading(true)
            const res=await generalDeleteFunction(`delete-ip-whitelists/${id}`)
            if(res.status){
              setLoading(false)
              toast.success(res?.message)            
              setIpAddress(ipAddress.filter((_, i) => i !== index))
            }else{
              setLoading(false)
              // toast.error(res.message)
            }
            
          } catch (error) {
            setLoading(false)
            toast.error(error)
          }
         }else{
          setIpAddress(ipAddress.filter((_, i) => i !== index))
         }

        }
        // console.log({ipAddress})
  return (
    <>
    <div className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Access List" />
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
                      borderBottom: "1px solid rgb(221, 221, 221)",
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
                        <div className="col-6">
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
                        <div className="col-6">
                          <select className="formItem" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="0" >Disable</option>
                            <option value="1">Enable</option>
                          </select>
                        </div>
                      </div>
                      <div className="formRow col-xl-12 ">
                        <div className="formLabel">
                          <label htmlFor="">Description</label>
                        </div>
                        <div className="col-6">
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
                          <label htmlFor="">Group*</label>
                        </div>
                        <div className="col-6">
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
                              <div className="formRow">
                                <div className="col-6" >
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
                                    value={item?.ip_address||""}
                                    onChange={(e) => {
                                      let newIpAddress;
                                      if(item.id){
                                         item.ip_address=e.target.value;
                                         newIpAddress=[...ipAddress];
                                      }else{
                                       newIpAddress = [...ipAddress];
                                      newIpAddress[index] = { ip_address:e.target.value};
                                      }
                                      setIpAddress(newIpAddress)
                                    }}
                                  />
                                </div>
                                <div className="col-3 mt-4">
                                  {
                                    ipAddress.length > 1 &&
                                    <button type="button" className="tableButton delete mx-auto" onClick={() => { handleDeleteIp(index,item.id) }} >
                                      <i className="fa-solid fa-trash" />
                                    </button>
                                  }
                                </div>
                                {
                                  index === ipAddress.length - 1 &&
                                  <div className="col-3 mt-4" >
                                    <button type="button" className="panelButton" onClick={() => { 
                                      setIpAddress([...ipAddress, ""]) }}>
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
