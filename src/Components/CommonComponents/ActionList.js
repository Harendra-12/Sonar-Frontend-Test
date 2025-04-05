/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

const ActionList = ({
  category,
  getDropdownValue,
  value,
  label = "",
  title = "Action",
  isDisabled = false,
  // label = "Set the action to perform when the max wait time is reached.",
}) => {
  console.log("category:", category);
  const dispatch = useDispatch();

  const [ringGroup, setRingGroup] = useState([]);
  const [extension, setExtension] = useState([]);
  const [callCenter, setCallCenter] = useState([]);
  const [aiAgents, setAiAgents] = useState([]);

  const [ivr, setIvr] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const callCenterArr = useSelector((state) => state.callCenter);
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const extensionArr = useSelector((state) => state.extension);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const ringGroupArr = useSelector((state) => state.ringGroup);
  const ivrRefresh = useSelector((state) => state.ivrRefresh);
  const ivrArr = useSelector((state) => state.ivr);
  const aiAgentsArr = useSelector((state) => state.aiAgents);
  const aiAgentsRefresh = useSelector((state) => state.aiAgentsRefresh);

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
    if (aiAgentsRefresh > 0) {
      setAiAgents(aiAgentsArr);
    } else {
      dispatch({
        type: "SET_AIAGENTSREFRESH",
        aiAgentsRefresh: aiAgentsRefresh + 1,
      });
    }
  }, [
    extensionArr,
    ringGroupArr,
    callCenterArr,
    ivrArr,
    ivrRefresh,
    aiAgentsArr,
    aiAgentsRefresh,
  ]);

  // Backup for predefault
  let labelValue = "";
  useEffect(() => {
    // Set default value if provided
    if (value) {
      if (category === "ivr") {
        labelValue = ivrArr.find((item) => `ivr_${item.id}` == value)?.ivr_name;
      } else if (category === "aiagent") {
        labelValue = aiAgentsArr.find(
          (item) => `aiagent_${item.ainumber}` == value
        )?.name;
      } else if (value.includes("ivr_")) {
        labelValue = ivrArr.find((item) => `ivr_${item.id}` == value)?.ivr_name;
      } else if (value.includes("aiagent_")) {
        labelValue = aiAgentsArr.find(
          (item) => `aiagent_${item.ainumber}` == value
        )?.name;
      } else {
        labelValue = value;
      }

      const defaultOption = { value: value, label: labelValue };
      setSelectedOption(defaultOption);
    } else {
      setSelectedOption("");
    }
  }, [value, category, ivrArr, aiAgentsArr]);

  const allOptions = [
    {
      label: "Extension",
      options: extension.map((item) => ({
        value: [item.extension, "extension"],
        label: item.extension,
      })),
    },
    {
      label: "Ring Group",
      options: ringGroup.map((item) => ({
        value: [item.extension, "ring_group"],
        label: item.extension,
      })),
    },
    {
      label: "Call Center",
      options: callCenter.map((item) => ({
        value: [item.extension, "call_center"],
        label: item.extension,
      })),
    },
    {
      label: "IVR",
      options: ivr?.map((item) => ({
        value: [`ivr_${String(item.id)}`, "ivr"],
        label: item.ivr_name,
      })),
    },
    {
      label: "AI Agent",
      options: aiAgents?.map((item) => ({
        value: [`aiagent_${String(item.ainumber)}`, "aiagent"],
        label: item.name,
      })),
    },
  ].filter(
    (option) =>
      category === undefined ||
      option.label.toLowerCase().replace(/\s+/g, "") ===
        category?.toLowerCase().replace(/\s+/g, "")
  );

  const allOptionsRef = useRef(allOptions);

  useEffect(() => {
    if (value) {
      const defaultOption = allOptionsRef.current
        // .flatMap((opt) => opt.options)
        .reduce((acc, opt) => acc.concat(opt.options), [])
        .find((option) => option?.value[0] === value);
      if (defaultOption) setSelectedOption(defaultOption);
    }
  }, [value]);

  useEffect(() => {
    allOptionsRef.current = allOptions;
  }, [allOptions]);

  // useEffect(() => {
  //   // Set default value if provided
  //   if (value && allOptions.length > 0) {
  //     const defaultOption = allOptions
  //       .flatMap((opt) => opt.options)
  //       .find((option) => option.value[0] === value);
  //     if (defaultOption) setSelectedOption(defaultOption);
  //   }
  // }, [value, allOptions]);

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // border: '1px solid var(--color4)',
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
    singleValue: (provided) => ({
      ...provided,
      color: "var(--form-input-text)",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
      color: "var(--form-input-text)",
    }),
    indicatorSeparator: (provided) => ({
      display: "none",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "32px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "var(--form-input-text)",
      "&:hover": {
        color: "var(--ui-accent)",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      paddingLeft: "15px",
      paddingTop: 0,
      paddingBottom: 0,
      backgroundColor: state.isSelected ? "transparent" : "transparent",
      "&:hover": {
        backgroundColor: "#0055cc",
        color: "#fff",
      },
      fontSize: "14px",
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

  return (
    <>
      {title ? (
        <div className="formLabel">
          <label htmlFor="">{title}</label>
        </div>
      ) : (
        ""
      )}
      <div className="col-12">
        <Select
          isDisabled={isDisabled}
          id="selectFormRow"
          onChange={(selectedOption) => {
            getDropdownValue(selectedOption.value);
            // setSelectedOption(selectedOption.value[0]);
            setSelectedOption(selectedOption);
          }}
          options={allOptions}
          isSearchable
          styles={customStyles}
          value={selectedOption}
        />
        {label ? (
          <label htmlFor="data" className="formItemDesc" style={{ margin: 0 }}>
            {label}
          </label>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default ActionList;
