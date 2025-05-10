import React, { useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const Pstn = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [addNewTagPopUp, setAddNewTagPopUp] = useState(false);
  const [pstnval, setPstnval] = useState();
  const [isReadonly, setIsreadonly] = useState(false);

  const handlePstn = (event) => {
    const selectedValue = event;
    setPstnval(selectedValue);
    if (data.onUpdate) {
      data.onUpdate({ value: selectedValue });
    }
  };

  return (
    <>
      <div className="press-digits-node" style={{ backgroundColor: "#670D2F" }}>
        <div className="node-header">
          <div className="node-title">
            <i className="fa-solid fa-earth-americas"></i>
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
        <div className="col-12">
          <PhoneInput
            placeholder="Enter phone number"
            limitMaxLength={true}
            value={pstnval}
            onChange={(e) => handlePstn(e)}
          />
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

export default Pstn;
