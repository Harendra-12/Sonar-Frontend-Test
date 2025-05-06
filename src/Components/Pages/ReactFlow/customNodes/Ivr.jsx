import React, { useEffect, useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";
import { useDispatch, useSelector } from "react-redux";

const Ivr = ({ id, data }) => {
  const dispatch = useDispatch();

  const { setNodes } = useReactFlow();
  const [addNewTagPopUp, setAddNewTagPopUp] = useState(false);
  const [ivr, setIvr] = useState([]);
  const ivrRefresh = useSelector((state) => state.ivrRefresh);
  const ivrArr = useSelector((state) => state.ivr);
  const [isReadonly, setIsreadonly] = useState(false);

  useEffect(() => {
    if (ivrRefresh > 0) {
      setIvr(ivrArr);
    } else {
      dispatch({
        type: "SET_IVRREFRESH",
        ivrRefresh: ivrRefresh + 1,
      });
    }
  }, [ivrRefresh, ivrArr]);

  const handleIvr = (event) => {
    const selectedValue = event.target.value;
    if (data.onUpdate) {
      data.onUpdate({ value: selectedValue });
    }
  };

  return (
    <>
      <div className="press-digits-node" style={{ backgroundColor: "#F8B55F" }}>
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
          {ivr.length < 1 && <p>No ivr found</p>}
          {ivr.length > 0 && (
            <div className="d-flex flex-column">
              <label for="ivr">Choose a ivr:</label>
              <select name="ivr" id="ivr" onChange={(e) => handleIvr(e)}>
                {ivr.map((value, index) => (
                  <option value={`ivr_${String(value.id)}`} key={index}>
                    {value.ivr_name}
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

export default Ivr;
