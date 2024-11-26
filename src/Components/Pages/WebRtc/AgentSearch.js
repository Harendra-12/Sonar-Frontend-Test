import React, { useEffect, useState } from "react";
import Select from "react-select";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import zIndex from "@mui/material/styles/zIndex";

const AgentSearch = ({ getDropdownValue, value, getAllAgents }) => {
  const [user, setUser] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction("/user-all");
      if (apiData?.status) {
        setUser(apiData.data.filter((item) => item.extension_id !== null));
        getAllAgents(apiData.data.filter((item) => item.extension_id !== null));
      }
    }
    getData();
  }, []);

  useEffect(() => {
    // Set default value if provided
    if (value) {
      const defaultOption = { value: value, label: value };
      setSelectedOption(defaultOption);
    }
  }, [value]);

  const allOptions = [
    {
      label: "User",
      options:
        user &&
        user?.map((item) => ({
          value: [item.extension.extension, item.id],
          label: `${item.username} - (${item.extension.extension})`,
        })),
    },
  ];
  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // border: '1px solid var(--color4)',
      border: "1px solid var(--color4);",
      backgroundColor: "var(--ele-color)",
      borderRadius: "5px",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      minHeight: "35px",
      padding: "0px 0 0 25px",
      background: `var(--searchBg) url(${require('../../assets/images/search_b.png')}) no-repeat 7px center / 17px 17px`,
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: "var(--ui-accent)",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "35px",
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
      color: "var(--color-subtext)",
    }),
    option: (provided, state) => ({
      ...provided,
      paddingLeft: "13px",
      paddingTop: 5,
      paddingBottom: 5,
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: state.isSelected ? "var(--ele-color)" : "var(--ele-color)",
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
      zIndex: 9
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      margin: 0,
      maxHeight: "200px",
      overflowY: "auto",
      backgroundColor: "var(--ele-color)",
    }),
  };

  return (
    <>
      {/* <div className="formLabel">
        <label htmlFor="">Agent Search</label>
      </div> */}
      <div className="col-12">
        <Select
          // className="formItem"
          placeholder="Select agent to start chat"
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
        {/* <br /> */}
        {/* <label htmlFor="data" className="formItemDesc" style={{ margin: 0 }}>
          Type agent name or extension
        </label> */}
      </div>
    </>
  );
};

export default AgentSearch;
