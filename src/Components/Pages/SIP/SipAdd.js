import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { backToTop } from "../../GlobalFunction/globalFunction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SipAdd() {
  const navigate = useNavigate();
  const [sip, setSip] = useState({
    name: "",
    description: "",
    hostName: "",
    status: "",
    domain: "",
    alias: "",
    parse: "",
    settingName: "",
    settingValue: "",
    settingStatus: "",
    settingDescription: "",
  });

  // Handle destination
  const [setting, setSetting] = useState([
    {
      id: 1,
      name: "",
      value: 0,
      description: 30,
      status: "true",
    },
  ]);

  // Function to handle changes in destination fields
  const handleSettingChange = (index, event) => {
    const { name, value } = event.target;
    const newDestination = [...setting];
    newDestination[index][name] = value;
    setSetting(newDestination);
  };

  // Function to add a new destination field
  const addNewSetting = () => {
    setSetting([
      ...setting,
      {
        id: setting.length + 1,
        name: "",
        value: 0,
        description: 30,
        status: "true",
      },
    ]);
  };

  // Function to delete a destination
  const deleteSetting = (id) => {
    const updatedDestination = setting.filter((item) => item.id !== id);
    setSetting(updatedDestination);
  };

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-12" id="subPageHeader">
                <div className="row px-xl-3">
                  <div className="col-xl-4 my-auto">
                    <h4 className="my-auto">Sip Profile Add</h4>
                  </div>
                  <div className="col-xl-8 ps-2">
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                        onClick={() => {
                          navigate(-1);
                          backToTop();
                        }}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        effect="ripple"
                        className="panelButton"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-12" style={{ overflow: "auto" }}>
                <div className="mx-2" id="detailsContent">
                  <form action="#" className="row">
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Name</label>
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          value={sip.name}
                          onChange={(e) => {
                            setSip((prevState) => ({
                              ...prevState,
                              name: e.target.value,
                            }));
                          }}
                          className="formItem"
                          required="required"
                        />
                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Enter the Sip profile name here.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Description</label>
                        {/* {sip.description ? (
                        <label className="status missing">
                          Field missing
                        </label>
                      ) : (
                        ""
                      )} */}
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          value={sip.description}
                          onChange={(e) => {
                            setSip((prevState) => ({
                              ...prevState,
                              description: e.target.value,
                            }));
                          }}
                          className="formItem"
                          required="required"
                        />
                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Enter the description here.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Host Name</label>
                        {/* {gatewayState.passwordMissing ? (
                        <label className="status missing">
                          Field missing
                        </label>
                      ) : (
                        ""
                      )} */}
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          value={sip.hostName}
                          onChange={(e) => {
                            setSip((prevState) => ({
                              ...prevState,
                              hostName: e.target.value,
                            }));
                          }}
                          required="required"
                        />
                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Enter the Host Name here.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Status</label>
                        {/* {gatewayState.profileMissing ? (
                        <label className="status missing">
                          Field missing
                        </label>
                      ) : (
                        ""
                      )} */}
                      </div>
                      <div className="col-12">
                        <select
                          className="formItem"
                          value={sip.status}
                          onChange={(e) => {
                            setSip((prevState) => ({
                              ...prevState,
                              status: e.target.value,
                            }));
                          }}
                        >
                          <option>Choose Status</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Choose Status here.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Domain</label>
                        {/* {gatewayState.fromdomainMissing ? (
                        <label className="status missing">
                          Field missing
                        </label>
                      ) : (
                        ""
                      )} */}
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          value={sip.domain}
                          onChange={(e) => {
                            setSip((prevState) => ({
                              ...prevState,
                              domain: e.target.value,
                            }));
                          }}
                          required="required"
                        />
                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Enter the Domain Name here.
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Alias</label>
                        {/* {gatewayState.proxyMissing ? (
                        <label className="status missing">
                          Field missing
                        </label>
                      ) : (
                        ""
                      )} */}
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          value={sip.alias}
                          onChange={(e) => {
                            setSip((prevState) => ({
                              ...prevState,
                              alias: e.target.value,
                            }));
                          }}
                          required="required"
                        />
                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Enter the Alias Name Here
                        </label>
                      </div>
                    </div>
                    <div className="formRow col-xl-3">
                      <div className="formLabel">
                        <label htmlFor="">Parse</label>
                        {/* {gatewayState.realmMissing ? (
                        <label className="status missing">
                          Field missing
                        </label>
                      ) : (
                        ""
                      )} */}
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          name="extension"
                          className="formItem"
                          value={sip.parse}
                          onChange={(e) => {
                            setSip((prevState) => ({
                              ...prevState,
                              parse: e.target.value,
                            }));
                          }}
                          required="required"
                        />
                        <br />
                        <label htmlFor="data" className="formItemDesc">
                          Enter the Parse here.
                        </label>
                      </div>
                    </div>
                    <div className="col-xl-12">
                      {setting.map((item, index) => {
                        return (
                          <div key={index} className="row">
                            <div className="col-3 pe-2 formRow ">
                              <div className="formLabel">
                                <label htmlFor="">Setting Name</label>
                                {/* {gatewayState.expiryMissing ? (
                        <label className="status missing">
                          Field missing
                        </label>
                      ) : (
                        ""
                      )} */}
                              </div>
                              <div className="col-12">
                                <input
                                  type="name"
                                  name="extension"
                                  className="formItem"
                                  value={item.name}
                                  onChange={(e) => {
                                    handleSettingChange(index, e);
                                  }}
                                  required="required"
                                />
                                <br />
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the Setting Name here.
                                </label>
                              </div>
                            </div>
                            <div className="col-2 pe-2 formRow ">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Setting Value
                                </label>
                                {/* {gatewayState.registerMissing ? (
                        <label className="status missing">
                          Field missing
                        </label>
                      ) : (
                        ""
                      )} */}
                              </div>
                              <div className="col-12">
                                <input
                                  className="formItem"
                                  name="value"
                                  value={item.value}
                                  onChange={(e) => {
                                    handleSettingChange(index, e);
                                  }}
                                />
                                <label htmlFor="data" className="formItemDesc">
                                  Enter Seting value Here
                                </label>
                              </div>
                            </div>
                            <div className="col-3 pe-2 formRow ">
                              <div className="formLabel">
                                <label htmlFor="">Setting Description</label>
                                {/* {gatewayState.retryMissing ? (
                        <label className="status missing">
                          Field missing
                        </label>
                      ) : (
                        ""
                      )} */}
                              </div>
                              <div className="col-12">
                                <input
                                  type="text"
                                  name="description"
                                  className="formItem"
                                  value={item.description}
                                  onChange={(e) => {
                                    handleSettingChange(index, e);
                                  }}
                                  required="required"
                                />
                                <br />
                                <label htmlFor="data" className="formItemDesc">
                                  Enter the Setting description here.
                                </label>
                              </div>
                            </div>
                            <div className="col-2 pe-2 formRow ">
                              <div className="formLabel">
                                <label htmlFor="selectFormRow">
                                  Setting Status
                                </label>
                                {/* {gatewayState.profileMissing ? (
                        <label className="status missing">
                          Field missing
                        </label>
                      ) : (
                        ""
                      )} */}
                              </div>
                              <div className="col-12">
                                <select
                                  className="formItem w-100"
                                  name="status"
                                  value={item.status}
                                  onChange={(e) => {
                                    handleSettingChange(index, e);
                                  }}
                                >
                                  <option>Choose Profile</option>
                                  <option value="true">True</option>
                                  <option value="false">False</option>
                                </select>
                                <br />
                                <label htmlFor="data" className="formItemDesc">
                                  Choose Status here.
                                </label>
                              </div>
                            </div>
                            {index === 0 ? (
                              <div className="col-2 h-100 my-auto">
                                <button
                                  onClick={() => addNewSetting()}
                                  className="panelButton"
                                  effect="ripple"
                                  type="button"
                                >
                                  <i className="fa-duotone fa-circle-plus me-2"></i>Add More
                                </button>
                              </div>
                            ) : (
                              <div className="col-auto h-100 my-auto">
                                <button
                                  type="button"
                                  onClick={() => deleteSetting(item.id)}
                                  className="clearButton text-danger"
                                >
                                  <i className="fa-duotone fa-trash"></i>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {/* <div className="formRow col-xl-2">
                    <div className="formLabel d-none d-xl-block">
                      <label htmlFor=""></label>
                    </div>
                    <button
                      onClick={() => addNewSetting()}
                      className="panelButton ms-xl-5"
                      effect="ripple"
                      type="button"
                    >
                      <i className="fa-duotone fa-circle-plus me-2"></i>Add More
                    </button>
                  </div> */}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
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
    </>
  );
}

export default SipAdd;
