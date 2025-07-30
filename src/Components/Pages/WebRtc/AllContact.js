import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkViewSidebar,
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
  logout
} from "../../GlobalFunction/globalFunction";
import AddNewContactPopup from "./AddNewContactPopup";
import { toast } from "react-toastify";
import ContentLoader from "../../Loader/ContentLoader";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";
import { useSIPProvider } from "modify-react-sipjs";
import LogOutPopUp from "./LogOutPopUp";
import HeaderApp from "./HeaderApp";

function AllContact({
  allContact,
  setAllContact,
  allContactLoading,
  setAllContactLoading,
  isMicOn,
  isVideoOn,
  isTransfer,
  transferableSessionId,
  setSelectedModule,
}) {
  const dispatch = useDispatch();
  const sessions = useSelector((state) => state.sessions);
  const addContactRefresh = useSelector((state) => state.addContactRefresh);
  const { sessionManager, connectStatus } = useSIPProvider()
  const globalSession = useSelector((state) => state.sessions);
  // const [contact, setContact] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedEditContact, setSelectedEditContact] = useState(null);
  const [editContactToggle, setEditContactToggle] = useState(false);
  const [addContactToggle, setAddContactToggle] = useState(false);
  const [groupedContacts, setGroupedContacts] = useState({});
  const [popUp, setPopUp] = useState(false);
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  const allCallCenterIds = useSelector((state) => state.allCallCenterIds);
  const [allLogOut, setAllLogOut] = useState(false);
  const slugPermissions = useSelector((state) => state?.permissions);
  const [loadMore, setLoadMore] = useState(false);

  const groupContactsByInitial = (contacts) => {
    return contacts.reduce((acc, contact) => {
      const initial = contact.name[0].toUpperCase();
      if (!acc[initial]) {
        acc[initial] = [];
      }
      acc[initial].push(contact);
      return acc;
    }, {});
  };

  useEffect(() => {
    const grouped = groupContactsByInitial(allContact);
    setGroupedContacts(grouped);
  }, [allContact]);

  const deleteContactByIt = async (id) => {
    setPopUp(false);
    setAllContactLoading(true);
    const apiData = await generalDeleteFunction(`/contact/destroy/${id}`);

    if (apiData?.status) {
      const updatedContact = allContact?.filter((contact) => contact.id !== id);
      setAllContact(updatedContact);
      setAllContactLoading(false);
      toast.success(apiData.message);
    } else {
      setAllContactLoading(false);
    }
  };

  const handleEditContact = async (contactId) => {
    setAllContactLoading(true);
    // setSelectedEditContact(contact);
    const apiData = await generalGetFunction(`/contact/show/${contactId}`);
    if (apiData.status) {
      setEditContactToggle(true);
      setAddContactToggle(true);
      setSelectedEditContact(apiData.data);
      setAllContactLoading(false);
    } else {
      setAllContactLoading(false);
    }
  };

  const handleContactRefresh = () => {
    setAllContactLoading(true);
    dispatch({
      type: "SET_ADDCONTACTREFRESH",
      addContactRefresh: addContactRefresh + 1,
    });
  };
  // Function to handle logout
  const handleLogOut = async () => {
    setLoading(true);
    try {
      const apiResponses = await logout(
        allCallCenterIds,
        dispatch,
        sessionManager
      );
    } catch (error) {
      console.error("Unexpected error in handleLogOut:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(mode = "audio", destNumber) {
    if (!isMicOn) {
      toast.warn("Please turn on microphone");
      return;
    }
    if (mode === "video") {
      if (!isVideoOn) {
        toast.warn("Please turn on camera");
        return;
      }
    }

    if (extension == "") {
      toast.error("No extension assigned to your account");
      return;
    }
    if (destNumber == extension) {
      toast.error("You cannot call yourself");
      return;
    }

    if (connectStatus !== "CONNECTED") {
      toast.error("You are not connected with server");
      return;
    }

    if (destNumber.length > 3) {
      dispatch({
        type: "SET_MINIMIZE",
        minimize: false,
      });
      // hideDialpad(false);
      // e.preventDefault();
      const apiData = await sessionManager?.call(
        `sip:${destNumber}@${account.domain.domain_name}`,
        {
          earlyMedia: true,
          inviteWithSdp: true,
          sessionDescriptionHandlerOptions: {
            constraints: {
              audio: true,
              video: mode === "video" ? true : false,
            },
          },
        },
        {
          media: {
            audio: true,
            video:
              mode === "audio"
                ? true
                : {
                  mandatory: {
                    minWidth: 1280,
                    minHeight: 720,
                    minFrameRate: 30,
                  },
                  optional: [{ facingMode: "user" }],
                },
          },
        }
      )

      const sdh = apiData.sessionDescriptionHandler;

      // Check if remoteMediaStream is available
      if (sdh && sdh._remoteMediaStream) {
        const remoteStream = sdh._remoteMediaStream;

        // Listen for tracks being added to the remote stream
        remoteStream.onaddtrack = () => {
          playRemoteStream(remoteStream);
        };

        // If tracks are already present, attach immediately
        if (remoteStream.getTracks().length > 0) {
          playRemoteStream(remoteStream);
        }
      }

      // Function to play the remote stream
      function playRemoteStream(stream) {
        const audioElement = document.createElement("audio");
        audioElement.srcObject = stream;
        audioElement.autoplay = true;

        audioElement.play().catch((e) => {
          console.error("Error playing early media stream:", e);
        });
      }

      setSelectedModule("onGoingCall");
      dispatch({
        type: "SET_SESSIONS",
        sessions: [
          ...globalSession,
          {
            id: apiData._id,
            destination: destNumber,
            state: "Established",
            mode: mode,
            isTransfer: isTransfer,
            transferableSessionId: transferableSessionId,
          },
        ],
      });
      dispatch({
        type: "SET_VIDEOCALL",
        videoCall: mode === "video" ? true : false,
      });
      dispatch({
        type: "SET_CALLPROGRESSID",
        callProgressId: apiData._id,
      });
      dispatch({
        type: "SET_CALLPROGRESSDESTINATION",
        callProgressDestination: destNumber,
      });
      dispatch({
        type: "SET_CALLPROGRESS",
        callProgress: mode === "video" ? false : true,
      });
    } else {
      console.log(destNumber)
      toast.error("Please enter a valid number");
    }
  }
  return (
    <>
      {/* <SideNavbarApp /> */}
      {/* {loading ? <CircularLoader /> : ""} */}
      {allLogOut && (
        <LogOutPopUp setAllLogOut={setAllLogOut} handleLogOut={handleLogOut} />
      )}
      <main
        className="mainContentApp"
        style={{
          marginRight:
            sessions.length > 0 && Object.keys(sessions).length > 0
              ? "250px"
              : "0",
        }}
      >
        <section className="callPage">
          <div className="ps-xl-0 stickyHeader">
            <HeaderApp title={"Contact"} loading={allContactLoading} setLoading={setAllContactLoading} refreshApi={() => handleContactRefresh()} />
          </div>
          <div className="container-fluid">
            <div className="row webrtc_newMessageUi" style={{ height: "100%" }}>

              <div className="allCallHistory pb-0 col-12 col-xl-4 col-lg-4 col-xxl-3 py-3 px-0 rounded-3 calcsHeight">
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <h5 className="viewingAs">
                    Viewing As:
                    <span>
                      {account && extension ? (
                        <span>
                          {account?.username} - {account && extension}
                        </span>
                      ) : (
                        <span className="text-danger">
                          No Extension Assigned
                        </span>
                      )}
                    </span>
                  </h5>
                </div>
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <button
                    className="clearColorButton dark"
                    onClick={() => setAddContactToggle(true)}
                  >
                    <i className="fa-light fa-user-plus" /> Add Contact
                  </button>
                </div>
                <div className="col-12 mt-3" style={{ padding: "0 10px" }}>
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                  />
                </div>

                <div className="col-12">
                  <div className="tab-content">
                    <div
                      className="callList"
                      style={{ height: "calc(100vh - 215px)" }}
                    >
                      {!checkViewSidebar(
                        "Contact",
                        slugPermissions,
                        account?.sectionPermissions,
                        account?.permissions,
                        "read") ? <div>You dont have permission to view this section!</div> :
                        // allContactLoading ? (
                        //   <div colSpan={99}>
                        //     <ContentLoader />
                        //   </div>
                        // ) : 
                        (
                          Object.keys(groupedContacts).length > 0 ?
                            Object.keys(groupedContacts)
                              .sort()
                              .map((initial) => (
                                <div key={initial}>
                                  <div className="dateHeader">
                                    <p>{initial}</p>
                                  </div>
                                  {groupedContacts[initial].map((contact) => (
                                    <div className="callListItem wertc_iconBox border-bottom-0 border-end-0" key={contact.id}>
                                      <div className="row justify-content-between">
                                        <div className="col-xl-7 col-xxl-5 d-flex">
                                          <div className="profileHolder">
                                            <i className="fa-light fa-user fs-5" />
                                          </div>
                                          <div className="my-auto ms-2 ms-xl-3">
                                            <h4>{contact.name}</h4>
                                            <h5 className="mt-2">{contact.did}</h5>
                                          </div>
                                        </div>
                                        {/* <div className="col-10 col-xl-4 col-xxl-5">
                                        <div className="contactTags">
                                          <span data-id="2">Office</span>
                                        </div>
                                      </div> */}
                                        {/* <div className="col-2 text-end d-flex justify-content-center align-items-center">
                                        <i
                                          className="fa-sharp fa-thin fa-star"
                                          style={{ fontSize: 18 }}
                                        />
                                      </div> */}
                                      </div>
                                      <div className="contactPopup">
                                        <button
                                          onClick={() => {
                                            onSubmit("audio", contact.did);
                                          }}
                                        >
                                          <i className="fa-light fa-phone" />
                                        </button>
                                        {/* <button
                                        onClick={() => featureUnderdevelopment()}
                                      >
                                        <i className="fa-light fa-message" />
                                      </button>
                                      <button
                                        onClick={() => featureUnderdevelopment()}
                                      >
                                        <i className="fa-light fa-star" />
                                      </button> */}
                                        <button
                                          onClick={() => {
                                            handleEditContact(contact.id);
                                          }}
                                        >
                                          <i className="fa-light fa-pen-to-square" />
                                        </button>
                                        <button
                                          onClick={() => {
                                            // deleteContactByIt(contact.id)
                                            setPopUp(true);
                                            setSelectedDeleteId(contact.id);
                                          }}
                                        >
                                          <i className="fa-light fa-trash" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )) :
                            <div className="startAJob">
                              <div className="text-center mt-3">
                                <img
                                  src={require("../../assets/images/empty-box.png")}
                                  alt="Empty"
                                ></img>
                                <div>
                                  <h5>
                                    No{" "}
                                    <span>
                                      <b>
                                        Contacts
                                      </b>
                                    </span>{" "}
                                    Saved
                                  </h5>
                                  <h5>
                                    Please save a <b>contact</b> to see them here.
                                  </h5>
                                </div>
                              </div>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {addContactToggle && !allContactLoading && (
        <AddNewContactPopup
          setAddContactToggle={setAddContactToggle}
          editContactToggle={editContactToggle}
          setEditContactToggle={setEditContactToggle}
          selectedEditContact={selectedEditContact}
          setLoading={setAllContactLoading}
          setSelectedEditContact={setSelectedEditContact}
          loading={allContactLoading}
        />
      )}
      {popUp ? (
        <div className="popup">
          <div className="container h-100">
            <div className="row h-100 justify-content-center align-items-center">
              <div className="row content col-4">
                <div className="col-2 px-0 mb-2">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-12">
                  <h4 className="text-orange text-center">Warning!</h4>
                  <p className="text-center">Are you sure you want to delete this Contact?</p>
                  <div className="mt-4 d-flex justify-content-center align-items-center gap-2">
                    <button
                      className="panelButton m-0"
                      onClick={() => deleteContactByIt(selectedDeleteId)}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i className="fa-solid fa-check"></i>
                      </span>
                    </button>

                    <button
                      className="panelButton gray m-0 float-end"
                      onClick={() => {
                        setPopUp(false);
                        setSelectedDeleteId(null);
                      }}
                    >
                      <span className="text">Cancel</span>
                      <span className="icon">
                        <i className="fa-solid fa-xmark"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default AllContact;
