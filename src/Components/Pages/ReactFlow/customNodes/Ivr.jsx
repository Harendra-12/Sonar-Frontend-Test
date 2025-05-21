import React, { useEffect, useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";
import { useDispatch, useSelector } from "react-redux";
import { generalDeleteFunction } from "../../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";

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
    if (selectedValue && data.onUpdate) {
      data.onUpdate({
        value: `ivr_${selectedValue}`,
        // ivr_option_id: String(selectedValue),
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
      <div className="press-digits-node" style={{ backgroundColor: "#259ea9" }}>
        <div className="node-header">
          <div className="node-title">
            <i class="fa-light fa-microphone-stand"></i>
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
          {ivr.length < 1 && <p>No ivr found</p>}
          {ivr.length > 0 && (
            <div className="d-flex flex-column">
              <label style={{ fontSize: "0.875rem", fontStyle: 'normal', fontWeight: '500', marginBottom: '5px' }}>Choose a IVR:</label>{" "}
              <select
                name="ivr"
                id="ivr"
                defaultValue={data.value.split("_")[1] || ""}
                onChange={(e) => handleIvr(e)}
                className="form-select"
              >
                <option value="" disabled selected>
                  Select IVR
                </option>
                {ivr.map((value, index) => (
                  <option
                    value={value.id}
                    key={index}
                    data-name={value.ivr_name}
                  >
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

export default Ivr;
