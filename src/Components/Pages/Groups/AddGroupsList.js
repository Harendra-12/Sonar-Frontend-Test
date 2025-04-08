import React, { useEffect, useState } from "react";
import SkeletonFormLoader from "../../Loader/SkeletonFormLoader";
import Header from "../../CommonComponents/Header";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import { backToTop, generalGetFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";


export default function AddGroupsList() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [bulkAddPopUp, setBulkAddPopUp] = useState(false);
  const [bulkUploadSelectedAgents, setBulkUploadSelectedAgents] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectAll, setSelectAll] = useState(false);
    const [bulkEditPopup, setBulkEditPopup] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  //   console.log({errors})

  useEffect(() => {
    async function getUsers() {
      try {
        const users = await generalGetFunction("/user/all");
        console.log( users.data );
        setUsers(users?.data?.data);
      } catch (error) {}
    }
    getUsers();
  }, []);
 console.log({users})
  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <div className="mainContent">
      <div className="container-fluid px-0">
        <Header title="Ring Groups" />
      </div>
      <>
        {loading ? (
          <div>
            <SkeletonFormLoader />
          </div>
        ) : (
          <div className="overviewTableWrapper">
            <div className="overviewTableChild">
              <div
                className="d-flex flex-wrap"
                style={{ position: "sticky", top: "0", zIndex: "9" }}
              >
                <div className="col-12">
                  <div className="heading">
                    <div className="content">
                      <h4>Group Add</h4>
                      <p>
                        A group is a set of destinations that can be called with
                        a ring strategy.
                      </p>
                    </div>
                    <div className="buttonGroup">
                      <div className="d-flex align-items-center">
                        <button
                          onClick={() => {
                             Navigate(-1);
                                                        backToTop();
                          }}
                          type="button"
                          effect="ripple"
                          className="panelButton gray"
                        >
                          <span className="text">Back</span>
                          <span className="icon">
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          type="button"
                          effect="ripple"
                          className="panelButton"
                          onClick={handleFormSubmit}
                        >
                          <span className="text">Save</span>
                          <span className="icon">
                            <i className="fa-solid fa-floppy-disk"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
<div className="col-12 "  style={{
                    padding: "25px 23px",
                    borderBottom: "1px solid #ddd",
                  }}>
                       <form className="row mb-0">
                <div className=" col-xl-4 col-lg-4 col-12 col-md-6">
                  <div className="formRow">
                    <div className="formLabel">
                      <label htmlFor="">
                        Name <span className="text-danger">*</span>
                      </label>
                      <label htmlFor="data" className="formItemDesc">
                        Enter a name.
                      </label>
                    </div>
                    <div className="formInput">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        {...register("name", { required: true })}
                      />
                      {errors.name && (
                        <ErrorMessage text="This field is required" />
                      )}
                    </div>
                  </div>
                </div>
              </form>

                  </div>


           
              <div className="col-12">
        <div className="heading bg-transparent border-bottom-0">
          <div className="content">
            <h4>List of Agents</h4>
            <p>You can see the list of agents in this ring group.</p>
          </div>{" "}
          <button
            type="button"
            className="panelButton"
            onClick={() => {
              if (users?.length !== selectedUsers?.length) setBulkAddPopUp(true);
              else toast.warn("All Users selected");
            }}
          >
            <span className="text">Add</span>
            <span className="icon">
              <i className="fa-solid fa-plus"></i>
            </span>
          </button>
        </div>
        {selectedUsers.length > 0 && (
          <form className="row" style={{ padding: "0px 23px 20px" }}>
            <div className="formRow col-xl-12">
              {selectedUsers.map((item, index) => {
                return (
                  <div className="col-12 d-flex justify-content-start mb-2">
                    <div
                      className="formLabel pe-2 d-flex justify-content-between"
                      style={
                        index === 0
                          ? { marginTop: 32, width: 50 }
                          : { width: 50 }
                      }
                    >
                      <div>
                        {/* <input
                          type="checkbox"
                        //   onChange={() => handleSelectUserToEdit(item)}
                          checked={selectedAgentToEdit.some(
                            (agent) => agent.destination == item.destination
                          )}
                        ></input> */}
                      </div>
                      <label>{index + 1}.</label>
                    </div>
                    <div className="col-3 pe-2">
                      {index === 0 ? (
                        <div className="formLabel">
                          <label htmlFor="">
                            Destinations <span className="text-danger">*</span>
                          </label>
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="position-relative">
                        <select
                          disabled
                          type="text"
                          name="destination"
                          value={item?.destination}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            if (selectedValue === "addUser") {
                            //   navigate("/users-add");
                            } else {
                            //   handleDestinationChange(index, e);
                            }
                          }}
                          className="formItem"
                          placeholder="Destination"
                        >
                          <option value={""} disabled>
                            Choose agent
                          </option>

                          {users &&
                            users
                              .filter((item1) => {
                                return (
                                  item1?.extension?.extension ==
                                  selectedUsers[index]?.destination ||
                                  !selectedUsers.some(
                                    (destinationItem, destinationIndex) =>
                                      destinationItem?.destination ==
                                        item1?.extension?.extension &&
                                      destinationIndex != index
                                  )
                                );
                              })
                              .map((item) => {
                                return (
                                  <option
                                    value={item?.extension?.extension}
                                    key={item?.id}
                                  >
                                    {item.alias
                                      ? `${item?.alias} - ${item?.extension?.extension}`
                                      : `${item?.name} - ${item?.extension?.extension}`}
                                    {/* {item.name}(
                                                                                      {item.extension?.extension}) */}
                                  </option>
                                );
                              })}
                          <option
                            value="addUser"
                            className="addmusic"
                            style={{ cursor: "pointer" }}
                          >
                            Add User
                          </option>
                        </select>
                      </div>
                    </div>
                    {watch("strategy") === "sequence" ? (
                      <div className="col-2 pe-2">
                        {index === 0 ? (
                          <div className="formLabel">
                            <label htmlFor="">Priority</label>
                          </div>
                        ) : (
                          ""
                        )}
                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          name="priority"
                          id="selectFormRow"
                          value={item.priority}
                          onChange={(e) => {
                            // handleDestinationChange(index, e);
                          }}
                        >
                          <option value="">Select Priority</option>
                          {(() => {
                            const numbers = [];
                            for (let i = 1; i <=selectedUsers.length; i++) {
                              // Only show priority numbers that aren't used by other destinations
                              const isPriorityUsed = selectedUsers.some(
                                (dest, idx) =>
                                  idx !== index &&
                                  dest.priority === i.toString()
                              );
                              if (!isPriorityUsed) {
                                numbers.push(
                                  <option key={i} value={i}>
                                    {i}
                                  </option>
                                );
                              }
                            }
                            return numbers;
                          })()}
                        </select>
                      </div>
                    ) : (
                      <div className="col-2 pe-2">
                        {index === 0 ? (
                          <div className="formLabel">
                            <label htmlFor="">Delay</label>
                          </div>
                        ) : (
                          ""
                        )}
                        <select
                          className="formItem me-0"
                          style={{ width: "100%" }}
                          name="delay"
                          id="selectFormRow"
                          value={item.delay}
                          onChange={(e) => {
                            // handleDestinationChange(index, e);
                          }}
                        >
                          <option>Delay</option>
                          {(() => {
                            const numbers = [];
                            for (let i = 0; i <= 100; i++) {
                              if (i % 5 === 0) {
                                numbers.push(<span key={i}>{i}</span>);
                              }
                            }
                            return numbers.map((item) => {
                              return <option>{item}</option>;
                            });
                          })()}
                        </select>
                      </div>
                    )}

                    <div className="col-2 pe-2">
                      {index === 0 ? (
                        <div className="formLabel">
                          <label htmlFor="">Timeout</label>
                        </div>
                      ) : (
                        ""
                      )}
                      <select
                        className="formItem me-0"
                        style={{ width: "100%" }}
                        name="timeOut"
                        value={item.timeOut}
                        // onChange={(e) => handleDestinationChange(index, e)}
                        id="selectFormRow"
                      >
                        <option>Timeout</option>
                        {(() => {
                          const numbers = [];
                          for (let i = 0; i <= 100; i++) {
                            if (i % 5 === 0) {
                              numbers.push(<span key={i}>{i}</span>);
                            }
                          }
                          return numbers.map((item) => {
                            return <option>{item}</option>;
                          });
                        })()}
                      </select>
                    </div>
                    <div className="col-2 pe-2">
                      {index === 0 ? (
                        <div className="formLabel">
                          <label htmlFor="">Status</label>
                        </div>
                      ) : (
                        ""
                      )}
                      <select
                        className="formItem me-0"
                        style={{ width: "100%" }}
                        value={item.status}
                        // onChange={(e) => handleDestinationChange(index, e)}
                        id="selectFormRow"
                        name="status"
                      >
                        <option className="status" value="active">
                          True
                        </option>
                        <option value="inactive">False</option>
                      </select>
                    </div>
                    {selectedUsers.length === 1 ? (
                      ""
                    ) : (
                      <div
                        className={`me-2 h-100 m${
                          index === 0 ? "t" : "y"
                        }-auto`}
                      >
                        <button
                          type="button"
                        //   onClick={() => deleteDestination(item.id)}
                          className="tableButton delete"
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {errors.destinations && (
                <ErrorMessage text={errors.destinations.message} />
              )}

              <label htmlFor="data" className="formItemDesc">
                Add destinations and parameters to the ring group.
              </label>
            </div>
          </form>
        )}
      </div>
            </div>

          </div>
        )}
      </>
      {bulkAddPopUp ? (
        <div className="addNewContactPopup">
          <div className="row">
            <div className="col-12 heading mb-0">
              <i className="fa-light fa-user-plus" />
              <h5>Add People to the selected Ring Group</h5>
            </div>
            <div className="col-xl-12">
              <div className="col-12 d-flex justify-content-between align-items-center">
                <input
                  type="text"
                  className="formItem"
                  placeholder="Search"
                  name="name"
                  value={searchQuery}
                //   onChange={handleSearchChange}
                />
                <button
                  className="tableButton ms-2"
                //   onClick={() => navigate("/users-add")}
                >
                  <i className="fa-solid fa-user-plus"></i>
                </button>
              </div>
            </div>
            <div className="col-xl-12 mt-3">
              <div
                className="tableContainer mt-0"
                style={{ maxHeight: "calc(100vh - 400px)" }}
              >
                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Name</th>
                      <th>Extension</th>
                      <th>
                        <input
                          type="checkbox"
                        //   onChange={handleSelectAll} // Call handler on change
                          checked={selectAll ? true : false} // Keep checkbox state in sync
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.sort((a, b) => {
                        const aMatches =
                          a.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          (a?.extension?.extension || "")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase());
                        const bMatches =
                          b.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          (b?.extension?.extension || "")
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase());
                        // Sort: matching items come first
                        return bMatches - aMatches;
                      })
                      .filter(
                        (user) =>
                          !selectedUsers.some(
                            (agent) =>
                              user?.extension?.extension == agent?.destination
                          )
                      )
                      .map((item, index) => {
                        return (
                          <tr key={item.id || index}>
                            <td>{index + 1}</td>
                            <td>{item?.name}</td>
                            <td>{item?.extension?.extension}</td>
                            <td>
                              <input
                                type="checkbox"
                                // onChange={() => handleCheckboxChange(item)} // Call handler on change
                                checked={bulkUploadSelectedAgents.some(
                                  (agent) => agent?.name === item?.name
                                )} // Keep checkbox state in sync
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-xl-12 mt-2">
              <div className="d-flex justify-content-between">
                <button
                  className="panelButton gray ms-0"
                  onClick={() => {
                    setBulkAddPopUp(false);
                    setBulkUploadSelectedAgents([]);
                    // setSelectAll(false);
                  }}
                >
                  <span className="text">Close</span>
                  <span className="icon">
                    <i className="fa-light fa-xmark"></i>
                  </span>
                </button>
                <button
                  onClick={() => {
                    // handleBulkDestinationUpload(bulkUploadSelectedAgents);
                    setBulkAddPopUp(false);
                  }}
                  className="panelButton"
                >
                  <span className="text">Done</span>
                  <span className="icon">
                    <i className="fa-solid fa-check" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
