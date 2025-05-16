import React, { useEffect, useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";
import { useDispatch, useSelector } from "react-redux";

const RingGroup = ({ id, data }) => {
  const dispatch = useDispatch();

  const { setNodes } = useReactFlow();
  const [addNewTagPopUp, setAddNewTagPopUp] = useState(false);
  const [ringGroup, setRingGroup] = useState([]);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const ringGroupArr = useSelector((state) => state.ringGroup);
  const [isReadonly, setIsreadonly] = useState(false);

  useEffect(() => {
    if (ringGroupRefresh > 0) {
      setRingGroup(ringGroupArr);
    } else {
      dispatch({
        type: "SET_RINGGROUPREFRESH",
        ringGroupRefresh: ringGroupRefresh + 1,
      });
    }
  }, [ringGroupArr, ringGroupRefresh]);
  const handleRingGroup = (event) => {
    const selectedValue = event.target.value;
    const selectedOption = ringGroup.find(
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
      <div className="press-digits-node" style={{ backgroundColor: "#8ACCD5" }}>
        <div className="node-header">
          <div className="node-title">
            <i className="fa-solid fa-headset"></i>
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
          {ringGroup.length < 1 && <p>No ringGroup found</p>}
          {ringGroup.length > 0 && (
            <div className="d-flex flex-column">
              <label for="ringGroup">Choose a ringGroup:</label>{" "}
              <select
                name="ringGroup"
                id="ringGroup"
                onChange={(e) => handleRingGroup(e)}
              >
                <option value="" disabled selected>
                  Select Ring Group
                </option>
                {ringGroup.map((value, index) => (
                  <option
                    value={value.id}
                    key={index}
                    data-extension={value.extension}
                    data-name={value.name}
                  >
                    {value?.name} - {value?.extension}
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

export default RingGroup;
