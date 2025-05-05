import React, { useEffect, useRef, useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";

const PressDigits = ({ id, data }) => {
  // const { setNodes } = useReactFlow();
  const [fields, setFields] = useState([]);
  const textAreaRefs = useRef({}); // Store refs for each text area

  // initially set all the fields comes from data
  useEffect(() => {
    if (data.subNodes && data.subNodes.length > 0) {
      const initialFields = data.subNodes.map((item) => ({
        id: item.id,
        value: item.value || "",
      }));
      setFields(initialFields);
    }
  }, [data.subNodes]);

  // Add new field
  const addField = () => {
    if (fields.some((field) => field.value.trim() === "")) return;
    const newField = { id: new Date().getTime(), value: "" };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);

    // Update the parent node's data
    if (data.onUpdate) {
      data.onUpdate({ fields: updatedFields });
    }
  };

  // Delete a field
  const deleteField = (id) => {
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    delete textAreaRefs.current[id];

    // Update the parent node's data
    if (data.onUpdate) {
      data.onUpdate({ fields: updatedFields });
    }
  };

  // Handle value change
  const handleChange = (id, newValue) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, value: newValue } : field
    );
    setFields(updatedFields);

    // Update the parent node's data when field value changes
    if (data.onUpdate) {
      data.onUpdate({ fields: updatedFields });
    }
  };

  // Focus on the text area when the edit icon is clicked
  const focusTextArea = (id) => {
    if (textAreaRefs.current[id]) {
      textAreaRefs.current[id].focus(); // Programmatically focus
    }
  };

  return (
    <div
      className="press-digits-node"
      style={{
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        padding: "12px",
        width: "280px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "relative", // Important for handle positioning
      }}
    >
      {/* Node Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <i className="fa-solid fa-keyboard" style={{ marginRight: "8px" }} />
          <h3 style={{ margin: 0, fontSize: "16px" }}>{data.label}</h3>
        </div>
      </div>

      <p style={{ fontSize: "12px", color: "#6c757d", marginBottom: "12px" }}>
        {data.description}
      </p>

      <div
        style={{
          height: "1px",
          backgroundColor: "#dee2e6",
          marginBottom: "12px",
        }}
      ></div>

      {/* Input Fields Section */}
      <div style={{ backgroundColor: "#212529", borderRadius: "4px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px",
            borderBottom: "1px solid #495057",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              opacity: 0.6,
            }}
          >
            <i className="fa-solid fa-arrows-split-up-and-left"></i>
            Conditions
          </span>
          <button
            onClick={addField}
            style={{
              background: "none",
              border: "none",
              color: "#adb5bd",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        <div style={{ padding: "8px" }}>
          {fields.map((field) => (
            <div
              key={field.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
                position: "relative",
              }}
            >
              <input
                type="number"
                ref={(el) => (textAreaRefs.current[field.id] = el)}
                value={field.value}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder="Enter digit..."
                style={{
                  flex: 1,
                  minHeight: "32px",
                  padding: "4px 8px",
                  fontSize: "14px",
                  backgroundColor: "#343a40",
                  border: "1px solid #495057",
                  borderRadius: "4px",
                  color: "#f8f9fa",
                }}
              />

              <div style={{ display: "flex", marginLeft: "8px" }}>
                <button
                  onClick={() => focusTextArea(field.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#20c997",
                    cursor: "pointer",
                    marginRight: "4px",
                  }}
                >
                  <i
                    className="fa-solid fa-pencil"
                    style={{ fontSize: "14px" }}
                  ></i>
                </button>
                <button
                  onClick={() => deleteField(field.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff6b6b",
                    cursor: "pointer",
                  }}
                >
                  <i
                    className="fa-solid fa-trash"
                    style={{ fontSize: "14px" }}
                  ></i>
                </button>
              </div>

              {/* Source Handle - Fixed Positioning */}
              <div
                style={{
                  position: "absolute",
                  right: "-10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <CustomHandle
                  type="source"
                  position={Position.Right}
                  id={`source-${field.id}`}
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#4dabf7",
                    border: "2px solid white",
                    borderRadius: "50%",
                  }}
                  onClick={() => console.log("handles")}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Handle */}
      <CustomHandle
        type="target"
        position={Position.Left}
        // style={{
        //   width: "12px",
        //   height: "12px",
        //   backgroundColor: "#4dabf7",
        //   border: "2px solid white",
        //   borderRadius: "50%",
        //   left: "-6px",
        // }}
      />
    </div>
  );
};

export default PressDigits;
