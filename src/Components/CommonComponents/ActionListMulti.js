/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

const ActionListMulti = ({

  category,
  getDropdownValues,
  getSelectedTypes, // Callback to return the types to the parent
  values = [],
  label = "",
  title = "Multi-Select Action",
  isDisabled = false,
}) => {
  const dispatch = useDispatch();

  const [ringGroup, setRingGroup] = useState([]);
  const [extension, setExtension] = useState([]);
  const [callCenter, setCallCenter] = useState([]);
  const [ivr, setIvr] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  // const [selectedTypes, setSelectedTypes] = useState([]); // New state for types

  // Redux selectors for state
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const callCenterArr = useSelector((state) => state.callCenter);
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const extensionArr = useSelector((state) => state.extension);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const ringGroupArr = useSelector((state) => state.ringGroup);
  const ivrRefresh = useSelector((state) => state.ivrRefresh);
  const ivrArr = useSelector((state) => state.ivr);

  useEffect(() => {
    if (extensionRefresh > 0) {
      setExtension(extensionArr);
    } else {
      dispatch({
        type: "SET_EXTENSIONREFRESH",
        extensionRefresh: extensionRefresh + 1,
      });
    }
    if (ringGroupRefresh > 0) {
      setRingGroup(ringGroupArr);
    } else {
      dispatch({
        type: "SET_RINGGROUPREFRESH",
        ringGroupRefresh: ringGroupRefresh + 1,
      });
    }
    if (callCenterRefresh > 0) {
      setCallCenter(callCenterArr);
    } else {
      dispatch({
        type: "SET_CALLCENTERREFRESH",
        callCenterRefresh: callCenterRefresh + 1,
      });
    }
    if (ivrRefresh > 0) {
      setIvr(ivrArr);
    } else {
      dispatch({
        type: "SET_IVRREFRESH",
        ivrRefresh: ivrRefresh + 1,
      });
    }
  }, [extensionArr, ringGroupArr, callCenterArr, ivrArr, ivrRefresh]);

  const allOptions = [
    {
      label: "Extension",
      options: [
        { value: "all", label: "All" }, // Add "All" option
        ...extension.map((item) => ({
          value: [item.extension, "extension"],
          label: item.extension,
        })),
      ],
    },
    {
      label: "Ring Group",
      options: [
        { value: "all", label: "All" }, // Add "All" option
        ...ringGroup.map((item) => ({
          value: [item.extension, "ring_group"],
          label: item.extension,
        })),
      ],
    },
    {
      label: "Call Center",
      options: [
        { value: "all", label: "All" }, // Add "All" option
        ...callCenter.map((item) => ({
          value: [item.extension, "call_center"],
          label: item.extension,
        })),
      ],
    },
    {
      label: "IVR",
      options: [
        { value: "all", label: "All" }, // Add "All" option
        ...ivr?.map((item) => ({
          value: [String(item.id), "ivr"],
          label: item.ivr_name,
        })),
      ],
    },
  ].filter(
    (option) =>
      category === undefined ||
      option.label.toLowerCase() === category?.toLowerCase()
  );

  useEffect(() => {
    // Reset selectedOptions when category changes
    setSelectedOptions([]);
  }, [category]); // Watch category prop

  useEffect(() => {
    if (values.length > 0) {
      const defaultOptions = allOptions
        .reduce((acc, opt) => acc.concat(opt.options), [])
        .filter((option) => values.includes(option?.value[0]));
      setSelectedOptions(defaultOptions);
    }
  }, [values]);

  useEffect(() => {
    const types = Array.from(
      new Set(selectedOptions.map((option) => option.value[1]))
    );
    // setSelectedTypes(types);
    getSelectedTypes(types); // Send types to the parent component
  }, [selectedOptions]);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid var(--color4);",
      borderRadius: "3px",
      backgroundColor: "var(--ele-color)",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      minHeight: "35px",
      height: "35px",
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: "var(--ui-accent)",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "32px",
      padding: "0 6px",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "var(--ui-accent)",
      color: "#fff",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#fff",
      "&:hover": {
        backgroundColor: "#ff0000",
        color: "#fff",
      },
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
      color: "var(--form-input-text)",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "32px",
    }),
    option: (provided, state) => ({
      ...provided,
      paddingLeft: "15px",
      paddingTop: '2px',
      paddingBottom: '2px',
      backgroundColor: state.isSelected ? "transparent" : "transparent",
      "&:hover": {
        backgroundColor: "#0055cc",
        color: "#fff",
      },
      fontSize: "14px",
      borderBottom: '1px solid var(--border-color)'
    }),
    menu: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      backgroundColor: "var(--ele-color)",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
      maxHeight: "150px",
      overflowY: "auto",
      color: "var(--form-input-text)",
    }),
  };

  const handleChange = (selectedOptions) => {
    const values = selectedOptions.map((option) => option.value);
    if (values.includes("all")) {
      // If "All" is selected, select all options in the category
      const allCategoryOptions = allOptions
        .find((option) => option.label.toLowerCase() === category.toLowerCase())
        ?.options.filter((option) => option.value !== "all");
      getDropdownValues(allCategoryOptions.map((opt) => opt.value));
      setSelectedOptions(allCategoryOptions);
    } else {
      getDropdownValues(values);
      setSelectedOptions(selectedOptions);
    }
  };

  return (
    <>
      {title && (
        <div className="formLabel">
          <label htmlFor="">{title}</label>
        </div>
      )}
      <div className="col-12">
        <Select
          isMulti
          isDisabled={isDisabled}
          id="multiSelectFormRow"
          onChange={handleChange}
          options={allOptions.map((group) => ({
            ...group,
            options: group.options.filter(
              (option) =>
                !selectedOptions.some(
                  (selected) => selected.value[0] === option.value[0]
                )
            ),
          }))}
          isSearchable
          styles={customStyles}
          value={selectedOptions}
        />
        {label && (
          <label htmlFor="data" className="formItemDesc" style={{ margin: 0 }}>
            {label}
          </label>
        )}
      </div>
    </>
  );
};

export default ActionListMulti;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Select from "react-select";

// const ActionListMulti = ({
//   category,
//   getDropdownValues,
//   getSelectedTypes, // Callback to return the types to the parent
//   values = [],
//   label = "",
//   title = "Multi-Select Action",
//   isDisabled = false,
// }) => {
//   const dispatch = useDispatch();

//   const [ringGroup, setRingGroup] = useState([]);
//   const [extension, setExtension] = useState([]);
//   const [callCenter, setCallCenter] = useState([]);
//   const [ivr, setIvr] = useState([]);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [selectedTypes, setSelectedTypes] = useState([]); // New state for types

//   // Redux selectors for state
//   const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
//   const callCenterArr = useSelector((state) => state.callCenter);
//   const extensionRefresh = useSelector((state) => state.extensionRefresh);
//   const extensionArr = useSelector((state) => state.extension);
//   const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
//   const ringGroupArr = useSelector((state) => state.ringGroup);
//   const ivrRefresh = useSelector((state) => state.ivrRefresh);
//   const ivrArr = useSelector((state) => state.ivr);

//   useEffect(() => {
//     if (extensionRefresh > 0) {
//       setExtension(extensionArr);
//     } else {
//       dispatch({
//         type: "SET_EXTENSIONREFRESH",
//         extensionRefresh: extensionRefresh + 1,
//       });
//     }
//     if (ringGroupRefresh > 0) {
//       setRingGroup(ringGroupArr);
//     } else {
//       dispatch({
//         type: "SET_RINGGROUPREFRESH",
//         ringGroupRefresh: ringGroupRefresh + 1,
//       });
//     }
//     if (callCenterRefresh > 0) {
//       setCallCenter(callCenterArr);
//     } else {
//       dispatch({
//         type: "SET_CALLCENTERREFRESH",
//         callCenterRefresh: callCenterRefresh + 1,
//       });
//     }
//     if (ivrRefresh > 0) {
//       setIvr(ivrArr);
//     } else {
//       dispatch({
//         type: "SET_IVRREFRESH",
//         ivrRefresh: ivrRefresh + 1,
//       });
//     }
//   }, [extensionArr, ringGroupArr, callCenterArr, ivrArr, ivrRefresh]);

//   const allOptions = [
//     {
//       label: "Extension",
//       options: extension.map((item) => ({
//         value: [item.extension, "extension"],
//         label: item.extension,
//       })),
//     },
//     {
//       label: "Ring Group",
//       options: ringGroup.map((item) => ({
//         value: [item.extension, "ring_group"],
//         label: item.extension,
//       })),
//     },
//     {
//       label: "Call Center",
//       options: callCenter.map((item) => ({
//         value: [item.extension, "call_center"],
//         label: item.extension,
//       })),
//     },
//     {
//       label: "IVR",
//       options: ivr?.map((item) => ({
//         value: [String(item.id), "ivr"],
//         label: item.ivr_name,
//       })),
//     },
//   ].filter(
//     (option) =>
//       category === undefined ||
//       option.label.toLowerCase() === category?.toLowerCase()
//   );

//   useEffect(() => {
//     // Reset selectedOptions when category changes
//     setSelectedOptions([]);
//   }, [category]); // Watch category prop

//   useEffect(() => {
//     if (values.length > 0) {
//       const defaultOptions = allOptions
//         .reduce((acc, opt) => acc.concat(opt.options), [])
//         .filter((option) => values.includes(option?.value[0]));
//       setSelectedOptions(defaultOptions);
//     }
//   }, [values]);

//   useEffect(() => {
//     const types = Array.from(
//       new Set(selectedOptions.map((option) => option.value[1]))
//     );
//     setSelectedTypes(types);
//     getSelectedTypes(types); // Send types to the parent component
//   }, [selectedOptions]);

//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       border: "1px solid var(--color4);",
//       borderRadius: "3px",
//       backgroundColor: "var(--ele-color)",
//       outline: "none",
//       fontSize: "14px",
//       width: "100%",
//       minHeight: "35px",
//       height: "35px",
//       boxShadow: state.isFocused ? "none" : provided.boxShadow,
//       "&:hover": {
//         borderColor: "var(--ui-accent)",
//       },
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       height: "32px",
//       padding: "0 6px",
//     }),
//     multiValue: (provided) => ({
//       ...provided,
//       backgroundColor: "var(--ui-accent)",
//       color: "#fff",
//     }),
//     multiValueLabel: (provided) => ({
//       ...provided,
//       color: "#fff",
//     }),
//     multiValueRemove: (provided) => ({
//       ...provided,
//       color: "#fff",
//       "&:hover": {
//         backgroundColor: "#ff0000",
//         color: "#fff",
//       },
//     }),
//     input: (provided) => ({
//       ...provided,
//       margin: "0",
//       color: "var(--form-input-text)",
//     }),
//     indicatorSeparator: () => ({ display: "none" }),
//     indicatorsContainer: (provided) => ({
//       ...provided,
//       height: "32px",
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       paddingLeft: "15px",
//       paddingTop: 0,
//       paddingBottom: 0,
//       backgroundColor: state.isSelected ? "transparent" : "transparent",
//       "&:hover": {
//         backgroundColor: "#0055cc",
//         color: "#fff",
//       },
//       fontSize: "14px",
//     }),
//     menu: (provided) => ({
//       ...provided,
//       margin: 0,
//       padding: 0,
//       backgroundColor: "var(--ele-color)",
//     }),
//     menuList: (provided) => ({
//       ...provided,
//       padding: 0,
//       margin: 0,
//       maxHeight: "150px",
//       overflowY: "auto",
//       color: "var(--form-input-text)",
//     }),
//   };

//   return (
//     <>
//       {title && (
//         <div className="formLabel">
//           <label htmlFor="">{title}</label>
//         </div>
//       )}
//       <div className="col-12">
//         <Select
//           isMulti
//           isDisabled={isDisabled}
//           id="multiSelectFormRow"
//           onChange={(selectedOptions) => {
//             const values = selectedOptions.map((option) => option.value);
//             getDropdownValues(values);
//             setSelectedOptions(selectedOptions);
//           }}
//           options={allOptions.map((group) => ({
//             ...group,
//             options: group.options.filter(
//               (option) =>
//                 !selectedOptions.some(
//                   (selected) => selected.value[0] === option.value[0]
//                 )
//             ),
//           }))}
//           isSearchable
//           styles={customStyles}
//           value={selectedOptions}
//         />
//         {label && (
//           <label htmlFor="data" className="formItemDesc" style={{ margin: 0 }}>
//             {label}
//           </label>
//         )}
//       </div>
//     </>
//   );
// };

// export default ActionListMulti;
