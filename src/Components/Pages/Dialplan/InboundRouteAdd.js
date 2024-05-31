import React, { useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function InboundRouteAdd() {
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [inboundRoute, setInboundRoute] = useState({
    name: "",
    nameMissing: false,
    destination: "",
    destinationMissing: false,
    action: "",
    other: "",
    prefix: "",
    status: "E",
  });

  const [extension, setExtension] = useState();
  const [ringGroup, setRingGroup] = useState();
  useEffect(() => {
    async function getData() {
      const apidata = await generalGetFunction(
        `/ringgroup?account=${account.account_id}`
      );
      const extensionData = await generalGetFunction(
        `/extension/search?account=${account.account_id}`
      );
      if (extensionData.status) {
        setExtension(extensionData.data);
        // console.log("This data comming from extensio0n",extensionData.data);
      }
      if (apidata.status) {
        setRingGroup(apidata.data);
        // console.log("This data is cooming from group",apidata);
      } else {
        navigate("/");
      }
    }
    getData();
  }, []);

  async function handleSubmit(){
    if(inboundRoute.name===""){
        setInboundRoute(prevState=>({
            ...prevState,
            nameMissing:true
        }))
    }else{
        setInboundRoute(prevState=>({
            ...prevState,
            nameMissing:false
        }))
    }

    if(inboundRoute.destination===""){
        setInboundRoute(prevState=>({
            ...prevState,
            destinationMissing:true
        }))
    }else{
        setInboundRoute(prevState=>({
            ...prevState,
            destinationMissing:false
        }))
    }

    if(inboundRoute.name !=="" && inboundRoute.destination!==""){
        const parsedData = {
            name:inboundRoute.name,
            destination_number:inboundRoute.destination,
            action:inboundRoute.action,
            type:inboundRoute.status,
            other:inboundRoute.other,
            caller_id_number_prefix:inboundRoute.prefix,
        }
        const apiData = await generalPostFunction(`/inbound/routing/store`,parsedData)
        if(apiData.status){
          setInboundRoute({
            name: "",
            nameMissing: false,
            destination: "",
            destinationMissing: false,
            action: "",
            other: "",
            prefix: "",
            status: "E",
          })
          toast.success(apiData.message)
        }else{
          toast.error(apiData.message)
        }
        
    }

  }
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12" id="subPageHeader">
                <div className="row px-xl-3">
                  <div className="col-6 my-auto">
                    <h4 className="my-auto">User Add</h4>
                  </div>
                  <div className="col-6 ps-2">
                    <div className="d-flex justify-content-end">
                      <button
                        effect="ripple"
                        className="panelButton"
                        onClick={() => {
                          navigate(-1);
                          backToTop();
                        }}
                      >
                        Back
                      </button>
                      <button effect="ripple" className="panelButton" onClick={handleSubmit}>
                        Save
                      </button>
                    </div>
                  </div>
                  <div className="col-12 my-1">
                    <p className="p-0 m-0">
                      Edit user information and group membership.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xl-12" style={{ overflow: "auto" }}>
                <div className="mx-2" id="detailsContent">
                  <form className="row">
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Name</label>
                        {inboundRoute.nameMissing ? (
                          <label className="status missing">
                            Field Missing
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          required="required"
                          value={inboundRoute.name}
                          onChange={(e)=>{
                            setInboundRoute(prevState=>({
                                ...prevState,
                                name:e.target.value
                            }))
                          }}
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Destination</label>
                        {inboundRoute.destinationMissing ? (
                          <label className="status missing">
                            Field Missing
                          </label>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-12">
                        <input
                          type="number"
                          name="extension"
                          className="formItem"
                          required="required"
                          value={inboundRoute.destination}
                          onChange={(e)=>{
                            setInboundRoute(prevState=>({
                                ...prevState,
                                destination:e.target.value
                            }))
                          }}
                        />
                        <br />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Actions</label>
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          id="selectFormRow"
                          value={inboundRoute.action}
                          onChange={(e) => {
                            setInboundRoute((prevState) => ({
                              ...prevState,
                              action: e.target.value,
                            }));
                          }}
                        >
                          <option value="" />
                          <optgroup label="Extension" disabled />
                          {extension &&
                            extension.map((item, key) => {
                              return (
                                <option key={key} value={item.extension}>
                                  {item.extension}
                                </option>
                              );
                            })}
                          <optgroup label="Ring Group" disabled />
                          {ringGroup &&
                            ringGroup.map((item, key) => {
                              return (
                                <option key={key} value={item.extension}>
                                  {item.extension}
                                </option>
                              );
                            })}
                        </select>

                        <br />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Other</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          required="required"
                          value={inboundRoute.other}
                          onChange={(e)=>{
                            setInboundRoute(prevState=>({
                                ...prevState,
                                other:e.target.name
                            }))
                          }}
                        />
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Prefix</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          required="required"
                          value={inboundRoute.prefix}
                          onChange={(e)=>{
                            setInboundRoute(prevState=>({
                                ...prevState,
                                prefix:e.target.name
                            }))
                          }}
                        />
                      </div>
                    </div>

                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Status</label>
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          name=""
                          value={inboundRoute.status}
                          onChange={(e) =>
                            setInboundRoute((prevState) => ({
                              ...prevState,
                              status: e.target.value,
                            }))
                          }
                        >
                          <option>Choose Status</option>
                          <option value="E">Enable</option>
                          <option value="D">Disable</option>
                        </select>
                        <br />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
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

export default InboundRouteAdd;
