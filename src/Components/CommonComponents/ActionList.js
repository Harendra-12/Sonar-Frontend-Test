import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

const ActionList = ({
  getDropdownValue,
  value,
  title = "Action",
  label = "Set the action to perform when the max wait time is reached.",
}) => {
  const dispatch = useDispatch();

  const [ringGroup, setRingGroup] = useState([]);
  const [extension, setExtension] = useState([]);
  const [callCenter, setCallCenter] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const callCenterRefresh = useSelector((state) => state.callCenterRefresh);
  const callCenterArr = useSelector((state) => state.callCenter);
  const extensionRefresh = useSelector((state) => state.extensionRefresh);
  const extensionArr = useSelector((state) => state.extension);
  const ringGroupRefresh = useSelector((state) => state.ringGroupRefresh);
  const ringGroupArr = useSelector((state) => state.ringGroup);

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
  }, [extensionArr, ringGroupArr, callCenterArr]);

  useEffect(() => {
    // Set default value if provided
    if (value) {
      const defaultOption = { value: value, label: value };
      setSelectedOption(defaultOption);
    }
  }, [value]);

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
  ];

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // border: '1px solid var(--color4)',
      border: "1px solid #ababab",
      borderRadius: "2px",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      minHeight: "32px",
      height: "32px",
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: "none",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "32px",
      padding: "0 6px",
    }),
    input: (provided) => ({
      ...provided,
      margin: "0",
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
      color: "#202020",
      "&:hover": {
        color: "#202020",
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
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
      maxHeight: "150px",
      overflowY: "auto",
    }),
  };

  return (
    <>
      <div className="formLabel">
        <label htmlFor="">{title}</label>
      </div>
      <div className="col-12">
        <Select
          // className="formItem"
          id="selectFormRow"
          onChange={(selectedOption) => {
            getDropdownValue(selectedOption.value);
            setSelectedOption(selectedOption.value[0]);
          }}
          options={allOptions}
          isSearchable
          styles={customStyles}
          value={selectedOption}
        />
        <br />
        <label htmlFor="data" className="formItemDesc" style={{ margin: 0 }}>
          {label}
        </label>
      </div>
    </>
  );
};

export default ActionList;
