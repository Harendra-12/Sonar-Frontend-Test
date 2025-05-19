import React, { useEffect, useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";
import { useDispatch, useSelector } from "react-redux";
import { generalDeleteFunction } from "../../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

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
  }, [extensionArr, extensionRefresh, dispatch]);

  const handleExtension = (event) => {
    const selectedOption = event.target.selectedOptions[0];
    console.log("Selected option: ", selectedOption.dataset.extension);
    if (selectedOption.value && data.onUpdate) {
      data.onUpdate({
        value: selectedOption.dataset.extension,
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
      <div
        className="press-digits-node"
        style={{ backgroundColor: "#FF90BB", overflow: "auto" }}
      >
        <div className="node-header">
          <div className="node-title">
            <i className="fa-solid fa-phone-volume"></i>
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
              <label htmlFor="extension">Choose a extension:</label>{" "}
              <select
                name="extension"
                id="extension"
                defaultValue={data.value || ""}
                onChange={(e) => handleExtension(e)}
              >
                <option value="" disabled selected>
                  Select Extension
                </option>
                {extension.map((value, index) => (
                  <option
                    value={value.extension}
                    key={index}
                    data-extension={value.extension}
                  >
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
                <button className="panelButton me-0" onClick={handleDeleteNode}>
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
