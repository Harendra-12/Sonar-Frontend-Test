/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ActionList from "../../CommonComponents/ActionList";
import Header from "../../CommonComponents/Header";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
  generalPutFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

function IvrOptions() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const [loading, setLoading] = useState(false);
  const name = location.state?.name;
  const [options, setOptions] = useState([]);
  const [key, setKey] = useState("");
  const [action_name, setAction_type] = useState("extension");
  const [action_id, setAction_id] = useState("");
  const [editKey, setEditKey] = useState("");
  const [editAction_name, setEditAction_name] = useState("extension");
  const [editAction_id, setEditAction_id] = useState("");
  const [editId, setEditId] = useState();
  const [refresh, setRefresh] = useState(0);
  const [pstnval, setPstnval] = useState();
  const [editPstnval, setEditPstnval] = useState();

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/ivr-option/all?ivr_id=${id}`);
      if (apiData.status) {
        setOptions(apiData.data);
      }
    }
    if (id) {
      getData();
    } else {
      navigate(-1);
    }
  }, [setRefresh]);

  async function handleSubmit() {
    if (key === "") {
      toast.error("Please select a key");
    } else if (action_id === "" || !action_id) {
      toast.error("Please select an action");
    } else {
      setLoading(true);
      const payLoad = {
        option_key: key,
        action_name,
        action_id: action_name === "pstn" ? pstnval : action_id[0],
        ivr_id: id,
      };
      const apiData = await generalPostFunction("/ivr-option/store", payLoad);
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
        //   Now after adding data with api i want to add this to option array and reset the form
        setKey("");
        setAction_type("extension");
        setAction_id("");
        setEditKey("");
        setEditAction_name("extension");
        setEditAction_id("");
        setEditId();
        setOptions([...options, apiData.data]);
        setRefresh(refresh + 1);
      } else {
        setLoading(false);
      }
    }
  }

  async function deleteOption(id) {
    setLoading(true);
    const apiData = await generalDeleteFunction(`/ivr-option/destroy/${id}`);
    if (apiData.status) {
      setLoading(false);
      const newArray = options.filter((item) => item.id !== id);
      setOptions(newArray);
      toast.success(apiData.message);
    }
  }

  async function editOption(id) {
    setLoading(true);
    const payLoad = {
      option_key: editKey,
      action_name: editAction_name,
      //   action_id: editAction_id[0],
      action_id: editAction_name === "pstn" ? editPstnval : editAction_id[0],
      ivr_id: id,
    };
    const apiData = await generalPutFunction(
      `/ivr-option/update/${id}`,
      payLoad
    );
    if (apiData.status) {
      setLoading(false);
      toast.success(apiData.message);
    } else {
      setLoading(false);
    }
  }
  return (
    <>
      {loading ? (
        <div colSpan={99}>
          <CircularLoader />
        </div>
      ) : (
        ""
      )}
      <main className="mainContent">
        <div className="container-fluid px-0">
          <Header title={"IVR Options"} />
          {/* <div id="subPageHeader">
            <div className="col-xl-9 my-auto">
              <p className="mb-0">Option for selected IVR</p>
            </div>
            <div className="col-xl-3 ps-2">
              <div className="d-flex justify-content-end">
                <button
                  effect="ripple"
                  className="panelButton"
                  onClick={() => {
                    navigate(-1);
                    backToTop();
                  }}
                >
                  <span className="text">Back</span>
                  <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                </button>
                <button
                  onClick={handleSubmit}
                  effect="ripple"
                  className="panelButton"
                >
                  <span className="text">Save</span>
                  <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                </button>
              </div>
            </div>
          </div> */}
        </div>

        <div className="col-xl-12" style={{ overflow: "auto" }}>

          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div className="d-flex flex-wrap">
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>Options for IVR: {name}</h4>
                      <p>Option for selected IVR</p>
                    </div>
                    <div className="buttonGroup">
                      <button
                        onClick={() => {
                          navigate(-1);
                          backToTop();
                        }}
                        type="button"
                        effect="ripple"
                        className="panelButton gray"
                      >
                        <span className="text">Back</span>
                        <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                      </button>
                      <button
                        onClick={handleSubmit}
                        effect="ripple"
                        className="panelButton"
                      >
                        <span className="text">Save</span>
                        <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12" style={{ padding: '25px 23px', borderBottom: '1px solid #ddd' }}>
                <form>
                  {options?.map((item, index) => {
                    return (
                      <div className="col-12 formRow justify-content-start">
                        <div
                          className="formLabel pe-2"
                          style={
                            index === 0
                              ? { marginTop: 32, width: 30 }
                              : { width: 30 }
                          }
                        >
                          <label>{index + 1}.</label>
                        </div>
                        <div className="col-3 pe-2">
                          {index === 0 ? (
                            <div className="formLabel">
                              <label htmlFor="">Option Key</label>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="position-relative">
                            <select
                              disabled={editId === item.id ? false : true}
                              type="text"
                              name="destination"
                              value={editId === item.id ? editKey : item.option_key}
                              onChange={(e) => {
                                if (editId === item.id) {
                                  setEditKey(e.target.value);
                                }
                              }}
                              className="formItem"
                              placeholder="Destination"
                            >
                              <option value="">Choose Option key</option>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].filter(option => editId === item.id ? !options.find(opt => opt.option_key == option) : true).map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                              <option value={item.option_key}>{item.option_key}</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-3 pe-2">
                          {index === 0 ? (
                            <div className="formLabel">
                              <label htmlFor="">Action type</label>
                            </div>
                          ) : (
                            ""
                          )}
                          <select
                            disabled={editId === item.id ? false : true}
                            className="formItem me-0"
                            style={{ width: "100%" }}
                            name="delay"
                            id="selectFormRow"
                            value={
                              editId === item.id
                                ? editAction_name
                                : item.action_name
                            }
                            onChange={(e) => {
                              if (editId === item.id) {
                                setEditAction_name(e.target.value);
                                setEditAction_id();
                                if (e.target.value === "hangup") {
                                  setEditAction_id(["hangup", "hangup"]);
                                }
                                if (e.target.value === "backtoivr") {
                                  setEditAction_id(["backtoivr", "backtoivr"]);
                                }
                                if (e.target.value === "pstn") {
                                  setEditAction_id(["pstn", "pstn"]);
                                }
                              }
                            }}
                          >
                            <option value={"extension"}>Extension</option>
                            <option value={"ringgroup"}>Ring Group</option>
                            <option value={"queue"}>Call Center</option>
                            <option value="ivr">IVR</option>
                            <option value={"hangup"}>Hangup</option>
                            <option value={"backtoivr"}>Back to IVR</option>
                            <option value={"pstn"}>PSTN</option>
                          </select>
                        </div>
                        {item.action_name === "pstn" ||
                          (editId === item.id && editAction_name === "pstn") ? (
                          <div className="col-3 pe-2">
                            <PhoneInput
                              disabled={
                                editId === item.id
                                  ? editAction_name === "hangup" ||
                                    editAction_name === "backtoivr"
                                    ? true
                                    : false
                                  : true
                              }
                              placeholder="Enter phone number"
                              limitMaxLength={true}
                              value={item.action_id}
                              onChange={setEditPstnval}
                            />
                          </div>
                        ) : (
                          <div className="col-3 pe-2">
                            <ActionList
                              title={index == 0 ? "Action" : null}
                              isDisabled={
                                editId === item.id
                                  ? editAction_name === "hangup" ||
                                    editAction_name === "backtoivr"
                                    ? true
                                    : false
                                  : true
                              }
                              category={
                                editId === item.id
                                  ? editAction_name === "ringgroup"
                                    ? "ring group"
                                    : editAction_name === "queue"
                                      ? "call center"
                                      : editAction_name
                                  : item.action_name === "ringgroup"
                                    ? "ring group"
                                    : item.action_name === "queue"
                                      ? "call center"
                                      : item.action_name
                              }
                              label={null}
                              getDropdownValue={setEditAction_id}
                              value={
                                editId === item.id
                                  ? editAction_id?.[0]
                                  : item.action_id
                              }
                            />
                          </div>
                        )}
                        <div className={index === 0 ? "col-auto mt-auto me-2 h-100" : "col-auto me-2 h-100"}>
                          <button
                            type="button"
                            onClick={() => deleteOption(item.id)}
                            className="clearButton text-danger"
                          >
                            <i className="fa-duotone fa-trash"></i>
                          </button>
                        </div>

                        <div className={index === 0 ? "col-auto mt-auto" : "col-auto"}>
                          <button
                            onClick={() => {
                              if (editId === item.id) {
                                editOption(item.id);
                              } else {
                                setEditId(item.id);
                                setEditAction_id([
                                  item.action_id,
                                  item.action_name,
                                ]);
                                setEditAction_name(item.action_name);
                                setEditKey(item.option_key);
                              }
                            }}
                            className={`panelButton mb-auto ${editId === item.id ? "" : "gray"}`}
                            effect="ripple"
                            type="button"
                          >
                            <span className="text">{editId === item.id ? "Save" : "Update"}</span>
                            <span className="icon"><i class="fa-solid fa-floppy-disk"></i></span>
                          </button>
                        </div>
                        {index === 0 ? <div className="col-12 mb-2"></div> : ""}
                      </div>
                    );
                  })}
                  <div className="col-12 formRow justify-content-start">
                    <div className="formLabel pe-2" style={{ width: 30 }}>
                      <label>{options.length + 1}.</label>
                    </div>
                    <div className="col-3 pe-2">
                      <div className="position-relative">
                        <select
                          type="text"
                          name="destination"
                          value={key}
                          onChange={(e) => {
                            setKey(e.target.value);
                          }}
                          className="formItem"
                          placeholder="Destination"
                        >
                          <option value="">Choose Option key</option>

                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].filter(option => !options.find(opt => opt.option_key == option)).map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-2 pe-2">
                      <select
                        className="formItem me-0"
                        style={{ width: "100%" }}
                        name="delay"
                        id="selectFormRow"
                        value={action_name}
                        onChange={(e) => {
                          setAction_type(e.target.value);
                          setAction_id();
                          if (e.target.value === "hangup") {
                            setAction_id(["hangup", "hangup"]);
                          }
                          if (e.target.value === "backtoivr") {
                            setAction_id(["backtoivr", "backtoivr"]);
                          }
                          if (e.target.value === "pstn") {
                            setAction_id(["pstn", "pstn"]);
                          }
                        }}
                      >
                        <option value={"extension"}>Extension</option>
                        <option value={"ringgroup"}>Ring Group</option>
                        <option value={"queue"}>Call Center</option>
                        <option value="ivr">IVR</option>
                        <option value={"hangup"}>Hangup</option>
                        <option value={"backtoivr"}>Back to IVR</option>
                        <option value={"pstn"}>PSTN</option>
                      </select>
                    </div>
                    {action_name === "pstn" ? (
                      <div className="col-2 pe-2">
                        <PhoneInput
                          placeholder="Enter phone number"
                          limitMaxLength={true}
                          value={pstnval}
                          onChange={setPstnval}
                        />
                      </div>
                    ) : (
                      <div className="col-2 pe-2">
                        <ActionList
                          title={null}
                          isDisabled={
                            action_name === "hangup" || action_name === "backtoivr"
                              ? true
                              : false
                          }
                          category={
                            action_name === "ringgroup"
                              ? "ring group"
                              : action_name === "queue"
                                ? "call center"
                                : action_name
                          }
                          label={null}
                          getDropdownValue={setAction_id}
                          value={action_id?.[0]}
                        />
                      </div>
                    )}
                    <div className="col-auto">
                      <button
                        onClick={() => handleSubmit()}
                        className="panelButton mb-auto"
                        effect="ripple"
                        type="button"
                      >
                        <span className="text">Add</span>
                        <span className="icon"><i class="fa-solid fa-plus"></i></span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default IvrOptions;
