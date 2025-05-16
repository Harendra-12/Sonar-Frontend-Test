/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";

const AgentSearch = ({
  getDropdownValue,
  value,
  getAllAgents,
  extensionFromCdrMessage,
  setExtensionFromCdrMessage,
}) => {
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
  useEffect(() => {
    if (extensionFromCdrMessage && allOptions?.length > 0) {
      const selectedUser = allOptions[0].options?.filter((item) => {
        return item.value[0] == extensionFromCdrMessage;
      });

      if (selectedUser.length > 0) {
        getDropdownValue([...selectedUser[0].value, "singleChat", selectedUser[0]?.name, selectedUser?.email]);
        setSelectedOption(selectedUser[0].value[0]);
        setExtensionFromCdrMessage();
      }
    }
  }, [extensionFromCdrMessage, allOptions]);
  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // border: '1px solid var(--color4)',
      border: "1px solid transparent",
      backgroundColor: "var(--ele-color)",
      borderRadius: "8px",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      minHeight: "40px",
      padding: "0px 0 0 25px",
      background: `var(--searchBg) url(${require("../../assets/images/search_b.png")}) no-repeat 7px center / 17px 17px`,
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: "var(--ui-accent)",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "40px",
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
      height: "40px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "var(--color-subtext)",
    }),
    option: (provided, state) => ({
      ...provided,
      paddingLeft: "13px",
      paddingTop: 2,
      paddingBottom: 2,
      borderBottom: "1px solid var(--border-color)",
      backgroundColor: state.isSelected
        ? "var(--ele-color)"
        : "var(--ele-color)",
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
      zIndex: 9,
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
      <div className="">
        <Select
          // className="formItem"
          placeholder="Select agent to start chat"
          id="selectFormRow"
          onChange={(selectedOption) => {
            const userDetails = user?.find((data) => data?.id == selectedOption?.value[1])
            getDropdownValue([...selectedOption.value, "singleChat", userDetails?.username, userDetails?.email, userDetails?.profile_picture]);
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
