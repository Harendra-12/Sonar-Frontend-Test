import React, { useEffect, useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";
import { generalDeleteFunction } from "../../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

const Hangup = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [addNewTagPopUp, setAddNewTagPopUp] = useState(false);
  const [isReadonly, setIsreadonly] = useState(false);

  // added the default value for the node
  useEffect(() => {
    if (!data.value) {
      data.onUpdate({ value: "hangup" });
    }
  }, [data]);

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
      <div className="press-digits-node" style={{ backgroundColor: "#3A59D1" }}>
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

export default Hangup;
