import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import { backToTop, generalGetFunction, generalPostFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { useSelector } from "react-redux";

/**
 * Function to add a new Access Control
 * This function is used to add a new Access Control
 * @return {JSX.Element} The JSX element for the add page
 */
function AccessControlAdd() {
  const navigate = useNavigate();
  const [ipAddress, setIpAddress] = useState([""]);
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([])
  const [name, setName] = useState("");
  const [status, setStatus] = useState("0");
  const [description, setDescription] = useState("");
  const [roleId, setRoleId] = useState();
  const [selectedGroupId, setSelectedGroupId] = useState();
  const [loading, setLoading] = useState(true);
  const account = useSelector((state) => state.account);

  useEffect(() => {
    async function fetchData() {
      const apidata = await generalGetFunction("/role/all")
      if (apidata.status) {
        setRoles(apidata.data);
        setLoading(false);
      } else {
        toast.error(apidata.message)
        setLoading(false);
      }
    }
    const fetchGroupData = async () => {
      try {
        const apidata = await generalGetFunction(
          `/groups/all`
        );
        if (apidata?.status) {
          setGroups(apidata.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("An error occurred while fetching group dashboard data:", error);
        setLoading(false);
      }
    }
    fetchData();
    fetchGroupData()
  }, []);

  /**
   * Function to handle form submission
   * This function is used to handle the form submission and create a new Access Control
   * @return {void}
   */
  async function handleSubmit() {
    if (name === "") {
      toast.error("Please enter name!")
    } else if (roleId === "") {
      toast.error("Please select role!")
    } else if(selectedGroupId === ""){
      toast.error("Please select group!")
    } else if (ipAddress[0] === "") {
      toast.error("Please enter IP Address!")
    } else {
      setLoading(true);
      const parsedData = {
        name: name,
        status: status,
        description: description,
        role_id: roleId,
        group_id: selectedGroupId,
        ip: ipAddress,
        account_id: account.account_id,
      }
      const apiData = await generalPostFunction("/store-ip-whitelists", parsedData)
      if (apiData.status) {
        toast.success(apiData.message);
        setLoading(false);
        navigate(-1)
      } else {
        // const values = Object.values(apiData?.errors)
        // values?.map((message) => {
        //   toast.error(message[0])
        // })
        // toast.error(apiData?.errors?.[0][0])
        setLoading(false);
      }
    }
  }
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
                            Access Control
                            <button className="clearButton">
                            </button>
                          </h4>
                          <p>You can see all list of Access Control</p>
                        </div>
                        <div className="buttonGroup">
                          <button type="button"
                            onClick={() => { navigate(-1); backToTop(); }}
                            className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>

                          <div
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
                            <label htmlFor="">Role*</label>
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
                        <div className="formRow col-xl-12 ">
                          <div className="formLabel">
                            <label htmlFor="">Group</label>
                          </div>
                          <div className="col-6">
                            {" "}
                            <select className="formItem" name="role_id" value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)}>
                              <option value="" disabled="" selected="">
                                Choose Group
                              </option>
                              {
                                groups?.map((item, index) => {
                                  return (
                                    <option key={index} value={item?.id}>{item?.group_name}</option>
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
                                <div className="formRow justify-content-start">
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
                                      value={item}
                                      onChange={(e) => {
                                        const newIpAddress = [...ipAddress];
                                        newIpAddress[index] = e.target.value;
                                        setIpAddress(newIpAddress);
                                      }}
                                    />
                                  </div>
                                  <div className="col-3 mt-4">
                                    {
                                      ipAddress.length > 1 &&
                                      <button type="button" className="tableButton delete mx-auto" onClick={() => { setIpAddress(ipAddress.filter((_, i) => i !== index)) }} >
                                        <i className="fa-solid fa-trash" />
                                      </button>
                                    }
                                  </div>
                                  {
                                    index === ipAddress.length - 1 &&
                                    <div className="col-3 mt-4" >
                                      <button type="button" className="panelButton" onClick={() => { if (ipAddress[ipAddress.length - 1] !== "") { setIpAddress([...ipAddress, ""]) } }}>
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
  );
}

export default AccessControlAdd;
