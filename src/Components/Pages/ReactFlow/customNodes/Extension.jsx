import React, { useEffect, useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";
import { useDispatch, useSelector } from "react-redux";

const Extension = ({ id, data }) => {
  const dispatch = useDispatch();

  const { setNodes } = useReactFlow();
  const [addNewTagPopUp, setAddNewTagPopUp] = useState(false);
  const [extension, setExtension] = useState([]);
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const extensionArr = useSelector((state) => state.extension);
  const [isReadonly, setIsreadonly] = useState(false);

  useEffect(() => {
    if (extensionRefresh > 0) {
      setExtension(extensionArr);
    } else {
      dispatch({
        type: "SET_EXTENSIONREFRESH",
        extensionRefresh: extensionRefresh + 1,
      });
    }
  }, [extensionArr, extensionRefresh]);

  const handleExtension = (event) => {
    const selectedValue = event.target.value;
    if (data.onUpdate) {
      data.onUpdate({ value: selectedValue });
    }
  };

  return (
    <>
      <div
        className="press-digits-node"
        style={{ backgroundColor: "#FF90BB", overflow: "auto" }}
      >
        <div className="node-header">
          <div className="node-title">
            ī<i className="fa-solid fa-phone-volume"></i>
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
          {extension.length < 1 && <p>No extension found</p>}
          {extension.length > 0 && (
            <div className="d-flex flex-column">
              <label htmlFor="extension">Choose a extension:</label>
              <select
                name="extension"
                id="extension"
                onChange={(e) => handleExtension(e)}
              >
                {extension.map((value, index) => (
                  <option value={value.extension} key={index}>
                    {value.extension}
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

export default Extension;
