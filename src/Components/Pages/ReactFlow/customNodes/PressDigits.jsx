import React, { useEffect, useRef, useState } from "react";
import CustomHandle from "../CustomHandle";
import { Position, useReactFlow } from "@xyflow/react";

const PressDigits = ({ id, data }) => {
  const [fields, setFields] = useState([]);
  const textAreaRefs = useRef({});
  const [isReadonly, setIsreadonly] = useState(false);
  const { setEdges, getEdges } = useReactFlow();

  useEffect(() => {
    if (data.subNodes && data.subNodes.length > 0) {
      const initialFields = data.subNodes.map((item) => ({
        id: item.id,
        value: item.value || "",
      }));
      setFields(initialFields);
    }
  }, [data.subNodes]);

  const handleSelectChange = (id, newValue) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, value: newValue } : field
    );
    setFields(updatedFields);
    if (data.onUpdate) {
      data.onUpdate({ fields: updatedFields });
    }
  };

  const addField = () => {
    if (fields.some((field) => field.value.trim() === "")) return;
    const newField = { id: new Date().getTime(), value: "" };
    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    if (data.onUpdate) {
      data.onUpdate({ fields: updatedFields });
    }
  };

  const deleteField = (id) => {
    console.log("Deleteing field:", id);
    const updatedFields = fields.filter((field) => field.id !== id);
    setFields(updatedFields);
    delete textAreaRefs.current[id];
    if (data.onUpdate) {
      data.onUpdate({ fields: updatedFields });
    }

    // Remove any connected edges
    const sourceHandleId = `source-${id}`;
    // setEdges((edges) =>
    //   edges.filter(
    //     (edge) => !(edge.sourceHandle === sourceHandleId && edge.source === id)
    //   )
    // );
    setEdges((edges) => {
      return edges.filter((edge) => edge.sourceHandle !== sourceHandleId);
    });
  };

  // const deleteField = (id) => {
  //   // Remove the field
  //   const updatedFields = fields.filter((field) => field.id !== id);
  //   setFields(updatedFields);
  //   delete textAreaRefs.current[id];

  //   // Remove any connected edges
  //   const sourceHandleId = `source-${id}`;
  //   setEdges((edges) =>
  //     edges.filter(
  //       (edge) => !(edge.sourceHandle === sourceHandleId && edge.source === id)
  //     )
  //   );

  //   // Update parent data
  //   if (data.onUpdate) {
  //     data.onUpdate({ fields: updatedFields });
  //   }
  // };

  const handleChange = (id, newValue) => {
    const updatedFields = fields.map((field) =>
      field.id === id ? { ...field, value: newValue } : field
    );
    setFields(updatedFields);
    if (data.onUpdate) {
      data.onUpdate({ fields: updatedFields });
    }
  };

  const focusTextArea = (id) => {
    if (textAreaRefs.current[id]) {
      textAreaRefs.current[id].focus();
    }
  };

  return (
    <div
      style={{
        background: "#f8f9fa",
        borderRadius: "8px",
        padding: "12px",
        width: "280px",
        border: "1px solid #dee2e6",
        position: "relative",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <i className="fa-solid fa-keyboard" style={{ marginRight: "8px" }} />
        {/* <h3 style={{ margin: 0, fontSize: "16px" }}>{data.label}</h3> */}
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

      <p style={{ fontSize: "12px", color: "#6c757d", marginBottom: "12px" }}>
        {data.description}
      </p>

      <div
        style={{
          backgroundColor: "#212529",
          borderRadius: "4px",
          padding: "8px",
        }}
      >
        <div
          style={{
            marginBottom: "8px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#f8f9fa", fontSize: "14px" }}>
            Input Fields
          </span>
          <button
            onClick={addField}
            style={{
              background: "none",
              border: "none",
              color: "#20c997",
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-plus" />
          </button>
        </div>

        {fields.map((field) => (
          <div
            key={field.id}
            style={{
              position: "relative",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* <input
              type="text"
              ref={(el) => (textAreaRefs.current[field.id] = el)}
              value={field.value}
              onChange={(e) => {
                const value = e.target.value;
                // Only allow numbers and limit to 3 digits
                if (
                  value === "" ||
                  (/^\d+$/.test(value) && value.length <= 2)
                ) {
                  handleChange(field.id, value);
                }
              }}
              style={{
                flex: 1,
                background: "#343a40",
                border: "1px solid #495057",
                borderRadius: "4px",
                color: "#f8f9fa",
                padding: "6px",
                fontSize: "14px",
                width: "100%",
              }}
              placeholder="Enter digit..."
              inputMode="numeric"
              pattern="\d*"
            /> */}

            <div style={{ display: "flex", gap: "4px" }}>
              {/* <button
                onClick={() => focusTextArea(field.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#20c997",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <i className="fa-solid fa-pencil" />
              </button> */}
              <button
                onClick={() => deleteField(field.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff6b6b",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <i className="fa-solid fa-trash" />
              </button>
            </div>

            <select
              className="form-select"
              aria-label="Default select example"
              value={field.value}
              onChange={(e) => handleSelectChange(field.id, e.target.value)}
            >
              <option value="" disabled>
                select a digit
              </option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                .filter((digit) => {
                  return (
                    field.value === String(digit) || // keep current selection
                    !fields.some((f) => f.value === String(digit))
                  );
                })
                .map((digit) => (
                  <option key={digit} value={digit}>
                    {digit}
                  </option>
                ))}
            </select>

            <CustomHandle
              type="source"
              position={Position.Right}
              id={`source-${field.id}`}
              style={{
                right: "-22px",
                width: "14px",
                height: "14px",
                background: "#20c997",
                border: "2px solid white",
              }}
            />
          </div>
        ))}
      </div>

      <CustomHandle
        type="target"
        position={Position.Left}
        style={{
          left: "-22px",
          width: "14px",
          height: "14px",
          background: "#ff6b6b",
          border: "2px solid white",
        }}
      />
    </div>
  );
};

export default PressDigits;
