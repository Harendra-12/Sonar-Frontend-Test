import React, { useEffect, useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";
import { useDispatch, useSelector } from "react-redux";

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
    const selectedOption = callCenter.find(
      (item) => item.id === parseInt(selectedValue)
    );
    if (selectedOption && data.onUpdate) {
      data.onUpdate({
        value: selectedOption.extension,
        ivr_option_id: String(selectedOption.id),
      });
    }
  };

  return (
    <>
      <div className="press-digits-node" style={{ backgroundColor: "#3D365C" }}>
        <div className="node-header">
          <div className="node-title">
            <i className="fa-solid fa-users"></i>
            <input
              type="text"
              value={data.label}
              readOnly={isReadonly}
              onChange={(e) => data.onUpdate({ label: e.target.value })}
              onBlur={() => setIsreadonly(true)}
              className="bg-transparent border-none"
            />

            <i
              className="fa-solid fa-pen-to-square ms-3"
              style={{ cursor: "pointer" }}
              onClick={() => setIsreadonly(!isReadonly)}
            />
          </div>
          <button
            className="node-delete-btn"
            onClick={() => setAddNewTagPopUp(true)}
          >
            <i className="fa-solid fa-trash" />
          </button>
        </div>
        <p className="node-description">{data.description}</p>
        <div className="node-separator"></div>
        <div>
          {callCenter.length < 1 && <p>No callCenter found</p>}
          {callCenter.length > 1 && (
            <div className="d-flex flex-column">
              <label for="callCenter">Choose a callCenter:</label>{" "}
              <select
                name="callCenter"
                id="callCenter"
                onChange={(e) => handleCallCenter(e)}
              >
                <option value="" disabled selected>
                  Select Call Center
                </option>
                {callCenter.map((value, index) => (
                  <option
                    value={value.id}
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
              <i class="fa-solid fa-triangle-exclamation"></i>
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
                <button
                  className="panelButton me-0"
                  onClick={() => {
                    setAddNewTagPopUp(false);
                    setNodes((prevNodes) =>
                      prevNodes.filter((node) => node.id !== id)
                    );
                  }}
                >
                  <span className="text">Delete</span>
                  <span className="icon">
                    <i class="fa-solid fa-trash"></i>
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
