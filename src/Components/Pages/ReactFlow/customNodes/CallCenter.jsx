import React, { useEffect, useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";
import { useDispatch, useSelector } from "react-redux";
import { generalDeleteFunction } from "../../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

const CallCenter = ({ id, data }) => {
  const dispatch = useDispatch();

  const { setNodes } = useReactFlow();
  const [addNewTagPopUp, setAddNewTagPopUp] = useState(false);
  const [callCenter, setCallCenter] = useState([]);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const callCenterArr = useSelector((state) => state.callCenter);
  const [isReadonly, setIsreadonly] = useState(false);

  useEffect(() => {
    if (callCenterRefresh > 0) {
      setCallCenter(callCenterArr);
    } else {
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    }
  }, [callCenterArr, callCenterRefresh]);
  const handleCallCenter = (event) => {
    const selectedValue = event.target.value;
    // const selectedOption = callCenter.find(
    //   (item) => item.id === parseInt(selectedValue)
    // );
    if (selectedValue && data.onUpdate) {
      data.onUpdate({
        value: selectedValue,
        // ivr_option_id: String(selectedOption.id),
      });
    }
  };

  // Delete node handler
  const handleDeleteNode = async () => {
    try {
      if (data?.main_id) {
        // If the node has a main_id, delete it from the backend first
        const apiData = await generalDeleteFunction(`/ivrnode/${data.main_id}`);
        if (!apiData?.status) {
          toast.error(apiData?.message || "Failed to delete node");

          return;
        }
      }

      // Remove the node from the flow
      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
      if (data.setInitialFlowDataRefresher) {
        data.setInitialFlowDataRefresher();
      }
    } catch (error) {
      toast.error("Error deleting node");
      console.error("Error deleting node:", error);
    } finally {
      setAddNewTagPopUp(false);
    }
  };

  return (
    <>
      <div className="press-digits-node" style={{ backgroundColor: "#3D365C" }}>
        <div className="node-header">
          <div className="node-title">
            <i className="fa-light fa-users"></i>
            <input
              type="text"
              value={data.label}
              readOnly={isReadonly}
              onChange={(e) => data.onUpdate({ label: e.target.value })}
              onBlur={() => setIsreadonly(true)}
              className="bg-transparent border-0"
            />

            <i
              className="fa-solid fa-pen-to-square ms-3"
              style={{ cursor: "pointer", opacity: '0.75', fontSize: 'initial' }}
              onClick={() => setIsreadonly(!isReadonly)}
            />
          </div>
          <button
            className="node-delete-btn"
            onClick={() => setAddNewTagPopUp(true)}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <p className="title">{data.description}</p>
        <div style={{ backgroundColor: '#212529', borderRadius: '10px', padding: '8px' }}>
          {callCenter.length < 1 && <p>No callCenter found</p>}
          {callCenter.length > 1 && (
            <div className="d-flex flex-column">
              <label htmlFor="callCenter" style={{ fontSize: "0.875rem", fontStyle: 'normal', fontWeight: '500', marginBottom: '5px' }}>Choose a Call Center:</label>{" "}
              <select
                name="callCenter"
                id="callCenter"
                defaultValue={data.value || ""}
                className="form-select"
                onChange={(e) => handleCallCenter(e)}
              >
                <option value="" disabled selected>
                  Select Call Center
                </option>
                {callCenter.map((value, index) => (
                  <option
                    value={value.extension}
                    key={index}
                    data-extension={value.extension}
                    data-name={value.queue_name}
                  >
                    {value?.queue_name} - {value?.extension}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <CustomHandle type="target" position={Position.Left} />
      {/* <CustomHandle type="source" position={Position.Right} /> */}

      {addNewTagPopUp && (
        <div className="addNewContactPopup">
          <div className="row">
            <div className="col-12 heading">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <h5>
                Are you sure you want to delete this node? This action cannot be
                reversed.
              </h5>
              <div className="border-bottom col-12" />
            </div>

            <div className="col-xl-12 mt-4">
              <div className="d-flex justify-content-between">
                <button
                  className="panelButton gray ms-0"
                  onClick={() => setAddNewTagPopUp(false)}
                >
                  <span className="text">Cancel</span>
                  <span className="icon">
                    <i className="fa-solid fa-caret-left"></i>
                  </span>
                </button>
                <button className="panelButton me-0" onClick={handleDeleteNode}>
                  <span className="text">Delete</span>
                  <span className="icon">
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CallCenter;
