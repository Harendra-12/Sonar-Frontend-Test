import React, { useEffect, useRef, useState } from "react";
// import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RingGroupAdd = () => {
  const navigate = useNavigate();
  const account = useSelector((state) => state.account);
  const [extensions, setExtensions] = useState();
  const [users, setUsers] = useState();
  const [destinationList,setDestinationList]=useState(false)
  const [destinationId,setDestinationId]=useState()
  const [filterExtension,setFilterExtension]=useState()

  useEffect(() => {
    if (account && account.id) {
      async function getData() {
        const apiData = await generalGetFunction(
          `/extension/search?account=${account.account_id}`
        );
        const apidataUser = await generalGetFunction(
          `/user/search?account=${account.account_id}`
        );
        if (apiData.status) {
          setExtensions(apiData.data);
        } else {
          navigate("/");
        }
        if (apidataUser.status) {
          setUsers(apidataUser.data);
        } else {
          navigate("/");
        }
      }
      getData();
    } else {
      navigate("/");
    }
  }, [account, navigate]);

  const [group, setGroup] = useState({
    name: "",
    nameMissing: false,
    extension: "",
    extensionMissing: false,
    email: "",
    emailMissing: "",
    followMe: false,
    followMeMissing: false,
    strategy: "enterprise",
    strategyMissing: false,
    timeOutDestination: "",
    timeOutDestinationMissing: false,
    callTimeOut: "",
    callTimeOutMissing: false,
    distinctiveRing: "",
    distinctiveRingMissing: false,
    ringBack: "us-ring",
    ringBackMissing: false,
    user: "",
    userMissing: false,
    callForward: "false",
    callForwardMissing: false,
    missedCall: "",
    missedCallMissing: false,
    groupForward: "false",
    groupForwardMissing: false,
    tollAllow: "",
    tollAllowMissing: false,
    context: "",
    contextMissing: false,
    description: "",
    descriptionMissing: false,
    enabled: false,
    enabledMissing: false,
    forwardNumber: "",
    forwardNumberMissing: false,
    number: "",
    destinationMissing:false,
    greeting:"",
  });

  // Handle destination
  const [destination, setDestination] = useState([
    {
      id: 1,
      destination: "",
      delay: 0,
      timeOut: "30",
      prompt: "",
      status: "inactive",
    },
    {
      id: 2,
      destination: "",
      delay: 0,
      timeOut: "30",
      prompt: "",
      status: "inactive",
    },
    {
      id: 3,
      destination: "",
      delay: 0,
      timeOut: "30",
      prompt: "",
      status: "inactive",
    },
    {
      id: 4,
      destination: "",
      delay: 0,
      timeOut: "30",
      prompt: "",
      status: "inactive",
    },
  ]);

  // Function to handle changes in destination fields
  const handleDestinationChange = (index, event) => {
    const { name, value } = event.target;
    if(name==="destination"){
      setDestinationList(true)
      setFilterExtension(extensions.filter(item=>item.extension.includes(value)))
    }
    setDestinationId(index)
    const newDestination = [...destination];
    newDestination[index][name] = value;
    setDestination(newDestination);
  };

  // Handle list click
  const handlelistClick = (index,value) =>{
    const newDestination = [...destination];
    newDestination[index]["destination"] = value;
    setDestination(newDestination);
  }

  // Function to add a new destination field
  const addNewDestination = () => {
    setDestination([
      ...destination,
      {
        id: destination.length + 1,
        destination: "",
        delay: 0,
        timeOut: "30",
        prompt: "",
        status: "inactive",
      },
    ]);
  };

  // Function to delete a destination
  const deleteStudent = (id) => {
    const updatedDestination = destination.filter((item) => item.id !== id);
    setDestination(updatedDestination);
  };


  // Filter extension
  // function filterFunction (filter){
  //   setFilterExtension(extensions.filter(item=>item.extension===filter))
  // }
  async function handleSubmit() {
    if (group.name === "") {
      setGroup((prevState) => ({
        ...prevState,
        nameMissing: true,
      }));
    } else {
      setGroup((prevState) => ({
        ...prevState,
        nameMissing: false,
      }));
    }

    if (group.extension === "") {
      setGroup((prevState) => ({
        ...prevState,
        extensionMissing: true,
      }));
    } else {
      setGroup((prevState) => ({
        ...prevState,
        extensionMissing: false,
      }));
    }
    if (group.followMe === "") {
      setGroup((prevState) => ({
        ...prevState,
        followMeMissing: true,
      }));
    } else {
      setGroup((prevState) => ({
        ...prevState,
        followMeMissing: false,
      }));
    }
    if (group.timeOutDestination === "") {
      setGroup((prevState) => ({
        ...prevState,
        timeOutDestinationMissing: true,
      }));
    } else {
      setGroup((prevState) => ({
        ...prevState,
        timeOutDestinationMissing: false,
      }));
    }
    if (group.callTimeOut === "") {
      setGroup((prevState) => ({
        ...prevState,
        callTimeOutMissing: true,
      }));
    } else {
      setGroup((prevState) => ({
        ...prevState,
        callTimeOutMissing: false,
      }));
    }
    // if (group.distinctiveRing === "") {
    //   setGroup((prevState) => ({
    //     ...prevState,
    //     distinctiveRingMissing: true,
    //   }));
    // } else {
    //   setGroup((prevState) => ({
    //     ...prevState,
    //     distinctiveRingMissing: false,
    //   }));
    // }
    if (group.ringBack === "") {
      setGroup((prevState) => ({
        ...prevState,
        ringBackMissing: true,
      }));
    } else {
      setGroup((prevState) => ({
        ...prevState,
        ringBackMissing: false,
      }));
    }
    if (group.user === "") {
      setGroup((prevState) => ({
        ...prevState,
        userMissing: true,
      }));
    } else {
      setGroup((prevState) => ({
        ...prevState,
        userMissing: false,
      }));
    }
    // if (group.tollAllow === "") {
    //   setGroup((prevState) => ({
    //     ...prevState,
    //     tollAllowMissing: true,
    //   }));
    // } else {
    //   setGroup((prevState) => ({
    //     ...prevState,
    //     tollAllowMissing: false,
    //   }));
    // }
    // if (group.context === "") {
    //   setGroup((prevState) => ({
    //     ...prevState,
    //     contextMissing: true,
    //   }));
    // } else {
    //   setGroup((prevState) => ({
    //     ...prevState,
    //     contextMissing: false,
    //   }));
    // }
    // if (group.description === "") {
    //   setGroup((prevState) => ({
    //     ...prevState,
    //     descriptionMissing: true,
    //   }));
    // } else {
    //   setGroup((prevState) => ({
    //     ...prevState,
    //     descriptionMissing: false,
    //   }));
    // }

    if (group.missedCall === "email") {
      if (group.email !== "" && group.email.includes("@")) {
        setGroup((prevState) => ({
          ...prevState,
          missedCallMissing: false,
        }));
      } else {
        setGroup((prevState) => ({
          ...prevState,
          missedCallMissing: true,
        }));
      }
    } else {
      setGroup((prevState) => ({
        ...prevState,
        missedCallMissing: false,
      }));
    }

    if(destination[0].destination===""){
        setGroup((prevState) => ({
            ...prevState,
            destinationMissing: true,
          }));
    }else{
        setGroup((prevState) => ({
            ...prevState,
            destinationMissing: false,
          }));
    }

    if (group.groupForward === "true") {
      if (group.number === "") {
        setGroup((prevState) => ({
          ...prevState,
          groupForwardMissing: true,
        }));
      } else {
        setGroup((prevState) => ({
          ...prevState,
          groupForwardMissing: false,
        }));
      }
    } else {
      setGroup((prevState) => ({
        ...prevState,
        groupForwardMissing: false,
      }));
    }

    // || group.timeOutDestination === ""
    if (
      !(
        group.name === "" ||
        group.extension === "" ||
        group.followMe === "" ||
        group.callTimeOut === "" ||
        // group.distinctiveRing === "" ||
        // group.ringBack === "" ||
        group.user === "" ||
        // group.tollAllow === "" ||
        // group.context === "" ||
        // group.description === "" ||
        (group.missedCall === "email"
          ? !(group.email !== "" && group.email.includes("@"))
          : false) ||
        (group.groupForward === "true" ? group.number === "" : false) || destination[0].destination===""
      )
    ) {
      const parsedData = {
        account_id: account.account_id,
        name: group.name,
        extension: group.extension,
        timeout_destination: group.timeOutDestination,
        call_timeout: group.callTimeOut,
        distinctive_ring: group.distinctiveRing,
        ring_back: group.ringBack,
        followme: group.followMe==="true"?true:false,
        missed_call: group.missedCall,
        missed_destination: group.email,
        ring_group_forward: group.groupForward,
        ring_group_forward_destination: group.number,
        toll_allow: group.tollAllow,
        context: group.context,
        status: group.enabled?"active":"inactive",
        description: group.description,
        strategy: group.strategy,
        greeting:group.greeting,
        destination: destination
          .map((item) => {
            if (item.destination.length > 0) {
              return {
                destination: item.destination,
                delay_order: item.delay,
                prompt: item.prompt,
                destination_timeout:item.timeOut,
                status: item.status,
                created_by:account.account_id,
              };
            } else {
              return null;
            }
          })
          .filter((item) => item !== null),
      };
      const apiData = await generalPostFunction("/ringgroup/store", parsedData);
      if (apiData.status) {
        setGroup({
          name: "",
          nameMissing: false,
          extension: "",
          extensionMissing: false,
          email: "",
          emailMissing: "",
          followMe: false,
          followMeMissing: false,
          strategy: "enterprise",
          strategyMissing: false,
          timeOutDestination: "",
          timeOutDestinationMissing: false,
          callTimeOut: "",
          callTimeOutMissing: false,
          distinctiveRing: "",
          distinctiveRingMissing: false,
          ringBack: "us-ring",
          ringBackMissing: false,
          user: "",
          userMissing: false,
          callForward: "false",
          callForwardMissing: false,
          missedCall: "",
          missedCallMissing: false,
          groupForward: "false",
          groupForwardMissing: false,
          tollAllow: "",
          tollAllowMissing: false,
          context: "",
          contextMissing: false,
          description: "",
          descriptionMissing: false,
          enabled: false,
          enabledMissing: false,
          forwardNumber: "",
          forwardNumberMissing: false,
          number: "",
          destinationMissing:false,
          greeting:"",
        })
        toast.success(apiData.message);
      } else {
        toast.error(apiData.message);
      }
    }
  }

  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        console.log('Clicked outside the div');
        setDestinationList(false)
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12" id="subPageHeader">
              <div className="row px-xl-3">
                <div className="col-xl-9 my-auto">
                  <h4 className="my-auto">Ring Group Add</h4>
                  <p className="pt-2 mt-1 mb-0">
                    A ring group is a set of destinations that can be called
                    with a ring strategy.
                  </p>
                </div>
                <div className="col-xl-3 ps-2">
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        navigate(-1);
                        backToTop();
                      }}
                      type="button"
                      effect="ripple"
                      className="panelButton"
                      // onClick={() => { window.location = "/ring-groups" }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      effect="ripple"
                      className="panelButton"
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12" style={{ overflow: "auto" }}>
              <div className="mx-2" id="detailsContent">
                <form className="row">
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Name</label>
                      {group.nameMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        value={group.name}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            name: e.target.value,
                          }));
                        }}
                        required="required"
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter a name.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Extension</label>
                      {group.extensionMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-12">
                      <input
                        type="number"
                        name="extension"
                        className="formItem"
                        value={group.extension}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            extension: e.target.value,
                          }));
                        }}
                        required="required"
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the extension number.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Follow Me</label>
                      {group.followMeMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem"
                        value={group.followMe}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            followMe: e.target.value,
                          }));
                        }}
                        id="selectFormRow"
                      >
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Choose to follow a ring group destination's follow me.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Strategy</label>
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem"
                        value={group.strategy}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            strategy: e.target.value,
                          }));
                        }}
                        id="selectFormRow"
                      >
                       <option value="enterprise">Enterprise</option>
                        <option value="sequence">Sequence</option>
                        <option value="simultaneously">Simultaneous</option>
                        <option value="random">Random</option>
                        <option value="rollover">Rollover</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Select the ring strategy.
                      </label>
                    </div>
                  </div>
                  <div />
                  <div className="formRow col-xl-10">
                    {destination.map((item, index) => {
                      return (
                        <div className="col-12 d-flex justify-content-start">
                          <div
                            className="formLabel pe-2"
                            style={index === 0 ? { marginTop: 36 } : {}}
                          >
                            <label>{index + 1}.</label>
                          </div>
                          <div className="col-3 pe-2">
                            {index === 0 ? (
                              <div className="formLabel">
                                <label htmlFor="">Destinations</label>
                                {group.destinationMissing ? <label className='status missing'>field missing</label> : ""}
                              </div>
                            ) : (
                              ""
                            )}
                            <div className="position-relative">
                            <input
                              type="text"
                              name="destination"
                              className="formItem"
                              value={item.destination}
                              onChange={(e) =>
                                handleDestinationChange(index, e)
                              }
                              placeholder="Destination"
                            />
                            {destinationList && destinationId===index? <div ref={divRef} className="formCustomAutoComplete">
                              <ul>
                                {filterExtension && filterExtension.map((item)=>{
                                  return(
                                    <li value={item.extension}  onClick={(e)=>{handlelistClick(index,item.extension);setDestinationList(false)}}>{item.extension}</li>
                                  )
                                })}
                              </ul>
                            </div>:""}
                           
                            </div>
                          </div>
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
                                handleDestinationChange(index, e);
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
                              onChange={(e) =>
                                handleDestinationChange(index, e)
                              }
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
                                <label htmlFor="">Prompt</label>
                              </div>
                            ) : (
                              ""
                            )}
                            <select
                              className="formItem me-0"
                              style={{ width: "100%" }}
                              value={item.prompt}
                              onChange={(e) =>
                                handleDestinationChange(index, e)
                              }
                              id="selectFormRow"
                              name="prompt"
                            >
                              <option className="status">Prompt</option>
                              <option value="confirm">Confirm</option>
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
                              onChange={(e) =>
                                handleDestinationChange(index, e)
                              }
                              id="selectFormRow"
                              name="status"
                            >
                              <option className="status" value="active">
                                True
                              </option>
                              <option value="inactive">False</option>
                            </select>
                          </div>
                          {index === 0 ? (
                            ""
                          ) : (
                            <div className="col-auto h-100 my-auto">
                              <button
                                type="button"
                                onClick={() => deleteStudent(item.id)}
                                className="clearButton text-danger"
                              >
                                <i className="fa-duotone fa-trash"></i>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <label htmlFor="data" className="formItemDesc">
                      Add destinations and parameters to the ring group.
                    </label>
                  </div>
                  <div className="formRow col-xl-2">
                    <div className="formLabel d-none d-xl-block">
                      <label htmlFor=""></label>
                    </div>
                    <button
                      onClick={() => addNewDestination()}
                      className="panelButton ms-xl-5"
                      effect="ripple"
                      type="button"
                    >
                      <i className="fa-duotone fa-circle-plus me-2"></i>Add More
                    </button>
                  </div>
                  <div />
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Timeout Destination</label>
                      {group.timeOutDestinationMissing ? <label className='status missing'>field missing</label> : ""}
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem"
                        value={group.timeOutDestination}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            timeOutDestination: e.target.value,
                          }));
                        }}
                        id="selectFormRow"
                      >
                        <option value=""></option>
                        {extensions &&
                          extensions.map((item) => {
                            return (
                              <option value={item.extension}>
                                {item.extension}
                              </option>
                            );
                          })}
                      </select>{" "}
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Select the timeout destination for this ring group.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Call Timeout</label>
                      {group.callTimeOutMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        value={group.callTimeOut}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            callTimeOut: e.target.value,
                          }));
                        }}
                        required="required"
                      />
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="">Distinctive Ring</label>
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        value={group.distinctiveRing}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            distinctiveRing: e.target.value,
                          }));
                        }}
                        required="required"
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Select a sound for a distinctive ring.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Ring Back</label>
                      {group.ringBackMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem"
                        value={group.ringBack}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            ringBack: e.target.value,
                          }));
                        }}
                        id="selectFormRow"
                      >
                        <option>us-ring</option>
                        <option value="uk-ring">uk-ring</option>
                        <option value="eu-ring">eu-ring</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Defines what the caller will hear while the destination
                        is being called.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">User List</label>
                      {group.userMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem"
                        value={group.user}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            user: e.target.value,
                          }));
                        }}
                        id="selectFormRow"
                      >
                        <option>Select User</option>
                        {users &&
                          users.map((item) => {
                            return (
                              <option value={item.username}>
                                {item.username}
                              </option>
                            );
                          })}
                        {/* <option value="admin">admin</option>
                                                <option value="user1">User1</option>
                                                <option value="user2">User2</option> */}
                      </select>
                      {/* <button className="panelButton" effect="ripple" type="button">
                                                Add
                                            </button> */}
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Define users assigned to this ring group.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Call Forward </label>
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem"
                        value={group.callForward}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            callForward: e.target.value,
                          }));
                        }}
                        id="selectFormRow"
                      >
                        <option value="false">False</option>
                        <option value="true">True</option>
                      </select>
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Choose to follow a ring group destination's call
                        forward.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Missed Call</label>
                      {group.missedCallMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="row">
                      <div className="col-4 pe-1">
                        <select
                          className="formItem"
                          style={{ width: "100%" }}
                          name=""
                          id="selectFormRow"
                          value={group.missedCall}
                          onChange={(e) => {
                            setGroup((prevState) => ({
                              ...prevState,
                              missedCall: e.target.value,
                            }));
                          }}
                        >
                          <option value=""></option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                      <div className="col-8 ps-1">
                        {group.missedCall === "email" ? (
                          <input
                            className="col-12 formItem"
                            value={group.email}
                            onChange={(e) => {
                              setGroup((prevState) => ({
                                ...prevState,
                                email: e.target.value,
                              }));
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </div>
                      <label htmlFor="data" className="formItemDesc">
                        Select the notification type, and enter the appropriate
                        destination.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Ring Group Forward</label>
                      {group.groupForwardMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="col-12">
                      <select
                        className="formItem col-xl-3"
                        value={group.groupForward}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            groupForward: e.target.value,
                          }));
                        }}
                        id="selectFormRow"
                        style={{ width: "85px" }}
                      >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            number: e.target.value,
                          }));
                        }}
                        value={group.number}
                        placeholder="Number"
                        style={{ width: "60%" }}
                        disabled={group.groupForward === "false" ? true : false}
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Forward a called Ring Group to an alternate destination.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Forward Toll Allow</label>
                      {/* {group.tollAllowMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )} */}
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        value={group.tollAllow}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            tollAllow: e.target.value,
                          }));
                        }}
                        required="required"
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Ring group forwarding toll allow.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Context</label>
                      {/* {group.contextMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )} */}
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        value={group.context}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            context: e.target.value,
                          }));
                        }}
                        required="required"
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the context.
                      </label>
                    </div>
                  </div>
                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Description</label>
                      {/* {group.descriptionMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )} */}
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        value={group.description}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            description: e.target.value,
                          }));
                        }}
                        required="required"
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the description.
                      </label>
                    </div>
                  </div>



                  <div className="formRow col-xl-3">
                    <div className="formLabel">
                      <label htmlFor="selectFormRow">Greeting</label>
                      {/* {group.descriptionMissing ? (
                        <label className="status missing">field missing</label>
                      ) : (
                        ""
                      )} */}
                    </div>
                    <div className="col-12">
                      <input
                        type="text"
                        name="extension"
                        className="formItem"
                        value={group.greeting}
                        onChange={(e) => {
                          setGroup((prevState) => ({
                            ...prevState,
                            greeting: e.target.value,
                          }));
                        }}
                        required="required"
                      />
                      <br />
                      <label htmlFor="data" className="formItemDesc">
                        Enter the Greeting.
                      </label>
                    </div>
                  </div>
                  <div className="formRow  col-xl-3">
                    <div className="d-flex flex-wrap align-items-center">
                      <div className="formLabel">
                        <label htmlFor="selectFormRow">Enabled</label>
                        {/* {group.enabledMissing ? (
                          <label className="status missing">
                            field missing
                          </label>
                        ) : (
                          ""
                        )} */}
                      </div>
                      <div className="col-12">
                        <div className="my-auto position-relative mx-1">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={group.enabled}
                              onChange={(e) => {
                                setGroup((prevState) => ({
                                  ...prevState,
                                  enabled: e.target.checked,
                                }));
                              }}
                              id="showAllCheck"
                            />
                            <span className="slider round" />
                          </label>
                        </div>
                      </div>
                    </div>
                    <label htmlFor="data" className="formItemDesc">
                      Set the status of this ring group.
                    </label>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </main>
  );
};

export default RingGroupAdd;
