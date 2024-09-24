import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

const AgentSearch = ({
  getDropdownValue,
  value,
}) => {
  const dispatch = useDispatch();

  const [user,setUser]=useState([])
 

  const [selectedOption, setSelectedOption] = useState(null);

  
  const allUser = useSelector((state)=>state.allUser)
  const userRefresh = useSelector((state)=>state.allUserRefresh)

  console.log("allUser",allUser);
  
  useEffect(() => {
    if (userRefresh > 0) {
        setUser(allUser?.data?.filter((item)=>item.extension_id !== null));
      } else {
        dispatch({
          type: "SET_ALLUSERREFRESH",
          allUserRefresh: userRefresh + 1,
        });
      }
  }, [ allUser,userRefresh]);

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
      options: user && user?.map((item) => ({
        value: item.extension.extension,
        label: `${item.username}(${item.extension.extension})`,
      })),
    }
  ];

  console.log("User list",user);
  

  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      // border: '1px solid var(--color4)',
      border: "1px solid var(--color4);",
      borderRadius: "5px",
      outline: "none",
      fontSize: "14px",
      width: "100%",
      minHeight: "32px",
      height: "32px",
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
        <br />
        {/* <label htmlFor="data" className="formItemDesc" style={{ margin: 0 }}>
          Type agent name or extension
        </label> */}
      </div>
    </>
  );
};

export default AgentSearch;
