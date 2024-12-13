import React, { useEffect, useState } from "react";
import SideNavbarApp from "./SideNavbarApp";
import { useDispatch, useSelector } from "react-redux";
import ActiveCallSidePanel from "./ActiveCallSidePanel";
import {
  featureUnderdevelopment,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import AddNewContactPopup from "./AddNewContactPopup";
import { toast } from "react-toastify";
import ContentLoader from "../../Loader/ContentLoader";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "../../CommonComponents/DarkModeToggle";

function AllContact({
  allContact,
  setAllContact,
  allContactLoading,
  setAllContactLoading,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessions = useSelector((state) => state.sessions);
  const addContactRefresh = useSelector((state) => state.addContactRefresh);
  // const [contact, setContact] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);
  const [selectedEditContact, setSelectedEditContact] = useState(null);
  const [editContactToggle, setEditContactToggle] = useState(false);
  const [addContactToggle, setAddContactToggle] = useState(false);
  const [groupedContacts, setGroupedContacts] = useState({});
  const [popUp, setPopUp] = useState(false);
  const account = useSelector((state) => state.account);
  const extension = account?.extension?.extension || "";
  // useEffect(() => {
  //   const getContact = async () => {
  //     const apiData = await generalGetFunction("/contact/all");
  //     if (apiData?.status) {
  //       setContact(apiData.data);
  //       setLoading(false);
  //     } else {
  //       setLoading(false);
  //     }
  //   };
  //   getContact();
  // }, [addContactRefresh]);

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

  async function logOut() {
    const apiData = await generalGetFunction("/logout");
    localStorage.clear();
    if (apiData?.data) {
      localStorage.clear();
      dispatch({
        action: "SET_ACCOUNT",
        account: null,
      });
      navigate("/");
    }
  }

  const handleContactRefresh = () => {
    setAllContactLoading(true);
    dispatch({
      type: "SET_ADDCONTACTREFRESH",
      addContactRefresh: addContactRefresh + 1,
    });
  };
  return (
    <>
      {/* <SideNavbarApp /> */}
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
          <div className="container-fluid">
            <div className="row" style={{ height: "100%" }}>
              <div className="col-12 ps-xl-0">
                <div className="newHeader">
                  <div className="col-auto" style={{ padding: "0 10px" }}>
                    <h3 style={{ fontFamily: "Outfit", marginBottom: "0" }}>
                      <button class="clearButton2 text-dark" onClick={() => featureUnderdevelopment()}>
                        <i class="fa-solid fa-chevron-left fs-4"></i>
                      </button>{" "}
                      Contact{" "}
                      <button
                        class="clearButton2"
                        onClick={() => handleContactRefresh()}
                        disabled={allContactLoading}
                      >
                        <i
                          class={
                            allContactLoading
                              ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                              : "fa-regular fa-arrows-rotate fs-5"
                          }
                          style={{ color: "var(--webUtilGray)" }}
                        ></i>
                      </button>
                    </h3>
                  </div>
                  <div className="d-flex justify-content-end align-items-center">
                    <div className="col-9">
                      <input
                        type="search"
                        name="Search"
                        placeholder="Search users, groups or chat"
                        class="formItem fw-normal"
                        style={{ backgroundColor: "var(--searchBg)" }}
                        onChange={() => featureUnderdevelopment()}
                      />
                    </div>
                    <div className="col-auto ms-2">
                      <button className="clearButton2 xl" effect="ripple" onClick={() => featureUnderdevelopment()}>
                        <i className="fa-regular fa-bell" />
                      </button>
                    </div>
                    <DarkModeToggle marginLeft={"2"} />
                    <div className="col-auto">
                      <div class="dropdown">
                        <div
                          className="myProfileWidget"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <div class="profileHolder" id="profileOnlineNav">
                            <img
                              src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg"
                              alt="profile"
                            />
                          </div>
                          <div class="profileName">
                            {account.username}{" "}
                            <span className="status">Available</span>
                          </div>
                        </div>
                        <ul class="dropdown-menu">
                          <li onClick={logOut}>
                            <div
                              class="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Logout
                            </div>
                          </li>
                          <li onClick={() => navigate("/my-profile")}>
                            <div
                              class="dropdown-item"
                              style={{ cursor: "pointer" }}
                            >
                              Profile
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 allCallHistory">
                <div className="col-auto" style={{ padding: "0 10px" }}>
                  <h5 className="viewingAs">
                    Viewing As:
                    <span>
                      {account && extension ? (
                        <span>
                          {account.username} - {account && extension}
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
                  <nav className="mt-3">
                    <div
                      className="nav nav-tabs"
                      style={{ borderBottom: "1px solid var(--border-color)" }}
                    >
                      {/* <button
                        className="tabLink active"
                        effect="ripple"
                        data-category="all"
                      >
                        All
                      </button>
                      <button
                        className="tabLink"
                        effect="ripple"
                        data-category="company"
                      >
                        Company
                      </button>
                      <button
                        className="tabLink"
                        effect="ripple"
                        data-category="myContacts"
                      >
                        My Contacts
                      </button> */}
                    </div>
                  </nav>
                  <div className="tab-content">
                    <div
                      className="callList"
                      style={{ height: "calc(100vh - 215px)" }}
                    >
                      {allContactLoading ? (
                        <div colSpan={99}>
                          <ContentLoader />
                        </div>
                      ) : (
                        Object.keys(groupedContacts)
                          .sort()
                          .map((initial) => (
                            <div key={initial}>
                              <div className="dateHeader">
                                <p>{initial}</p>
                              </div>
                              {groupedContacts[initial].map((contact) => (
                                <div className="callListItem" key={contact.id}>
                                  <div className="row justify-content-between">
                                    <div className="col-xl-7 col-xxl-6 d-flex">
                                      <div className="profileHolder">
                                        <i className="fa-light fa-user fs-5" />
                                      </div>
                                      <div className="my-auto ms-2 ms-xl-3">
                                        <h4>{contact.name}</h4>
                                        <h5 className="mt-2">{contact.did}</h5>
                                      </div>
                                    </div>
                                    <div className="col-10 col-xl-4 col-xxl-5">
                                      <div className="contactTags">
                                        <span data-id="2">Office</span>
                                      </div>
                                    </div>
                                    <div className="col-auto text-end d-flex justify-content-center align-items-center">
                                      <i
                                        className="fa-sharp fa-thin fa-star"
                                        style={{ fontSize: 18 }}
                                      />
                                    </div>
                                  </div>
                                  <div className="contactPopup">
                                    <button
                                      onClick={() => featureUnderdevelopment()}
                                    >
                                      <i className="fa-light fa-phone" />
                                    </button>
                                    <button
                                      onClick={() => featureUnderdevelopment()}
                                    >
                                      <i className="fa-light fa-message" />
                                    </button>
                                    <button
                                      onClick={() => featureUnderdevelopment()}
                                    >
                                      <i className="fa-light fa-star" />
                                    </button>
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
                          ))
                      )}
                    </div>
                    {/* <div className="callList">
                      <div className="text-center callListItem">
                        <h5 className="fw-semibold">A</h5>
                      </div>

                      <div className="contactListItem favourite selected">
                        <div className="row justify-content-between">
                          <div className="col-xl-7 col-xxl-6 d-flex">
                            <div className="profileHolder" id="profileOnline">
                              <i className="fa-light fa-user fs-5" />
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                              <h4>AUSER XYZ</h4>
                              <h5>
                                69/A, XYZ Street, Saint Petersburg, Russia
                              </h5>
                            </div>
                          </div>
                          <div className="col-10 col-xl-4 col-xxl-5">
                            <h4>
                              <span>Office</span>
                            </h4>
                            <h5>1 (999) 999-9999</h5>
                            <h6
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i className="fa-regular fa-xmark me-1" /> 550
                            </h6>
                          </div>
                          <div className="col-auto text-end d-flex justify-content-center align-items-center">
                            <i
                              className="fa-sharp fa-thin fa-star"
                              style={{ fontSize: 18 }}
                            />
                          </div>
                        </div>
                        <div className="contactPopup">
                          <button>
                            <i className="fa-light fa-phone" />
                          </button>
                          <button>
                            <i className="fa-light fa-message" />
                          </button>
                          <button>
                            <i className="fa-light fa-star" />
                          </button>
                          <button>
                            <i className="fa-light fa-trash" />
                          </button>
                        </div>
                      </div>
                    
                      <div className="contactListItem">
                        <div className="row justify-content-between">
                          <div className="col-xl-7 col-xxl-6 d-flex">
                            <div className="profileHolder" id="profileOnline">
                              <i className="fa-light fa-user fs-5" />
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                              <h4>AUSER XYZ</h4>
                              <h5>
                                69/A, XYZ Street, Saint Petersburg, Russia
                              </h5>
                            </div>
                          </div>
                          <div className="col-10 col-xl-4 col-xxl-5">
                            <h4>
                              <span>Office</span>
                            </h4>
                            <h5>1 (999) 999-9999</h5>
                            <h6
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i className="fa-regular fa-xmark me-1" /> 10
                            </h6>
                          </div>
                          <div className="col-auto text-end d-flex justify-content-center align-items-center">
                            <i
                              className="fa-sharp fa-thin fa-star"
                              style={{ fontSize: 18 }}
                            />
                          </div>
                        </div>
                        <div className="contactPopup">
                          <button>
                            <i className="fa-light fa-phone" />
                          </button>
                          <button>
                            <i className="fa-light fa-message" />
                          </button>
                          <button>
                            <i className="fa-light fa-star" />
                          </button>
                          <button>
                            <i className="fa-light fa-trash" />
                          </button>
                        </div>
                      </div>
                   
                      <div className="text-center callListItem">
                        <h5 className="fw-semibold">C</h5>
                      </div>
                      
                      <div className="contactListItem">
                        <div className="row justify-content-between">
                          <div className="col-xl-7 col-xxl-6 d-flex">
                            <div className="profileHolder" id="profileOnline">
                              <i className="fa-light fa-user fs-5" />
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                              <h4>CUSER XYZ</h4>
                              <h5>
                                69/A, XYZ Street, Saint Petersburg, Russia
                              </h5>
                            </div>
                          </div>
                          <div className="col-10 col-xl-4 col-xxl-5">
                            <h4>
                              <span>Office</span>
                            </h4>
                            <h5>1 (999) 999-9999</h5>
                            <h6
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i className="fa-regular fa-xmark me-1" /> 650
                            </h6>
                          </div>
                          <div className="col-auto text-end d-flex justify-content-center align-items-center">
                            <i
                              className="fa-sharp fa-thin fa-star"
                              style={{ fontSize: 18 }}
                            />
                          </div>
                        </div>
                        <div className="contactPopup">
                          <button>
                            <i className="fa-light fa-phone" />
                          </button>
                          <button>
                            <i className="fa-light fa-message" />
                          </button>
                          <button>
                            <i className="fa-light fa-star" />
                          </button>
                          <button>
                            <i className="fa-light fa-trash" />
                          </button>
                        </div>
                      </div>
               
                      <div className="contactListItem">
                        <div className="row justify-content-between">
                          <div className="col-xl-7 col-xxl-6 d-flex">
                            <div className="profileHolder" id="profileBusy">
                              <img src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg" />
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                              <h4>CUSER XYZ</h4>
                              <h5>
                                69/A, XYZ Street, Saint Petersburg, Russia
                              </h5>
                            </div>
                          </div>
                          <div className="col-10 col-xl-4 col-xxl-5">
                            <h4>
                              <span>Office</span>
                            </h4>
                            <h5>1 (999) 999-9999</h5>
                            <h6
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i className="fa-regular fa-xmark me-1" /> 150
                            </h6>
                          </div>
                          <div className="col-auto text-end d-flex justify-content-center align-items-center">
                            <i
                              className="fa-sharp fa-thin fa-star"
                              style={{ fontSize: 18 }}
                            />
                          </div>
                        </div>
                        <div className="contactPopup">
                          <button>
                            <i className="fa-light fa-phone" />
                          </button>
                          <button>
                            <i className="fa-light fa-message" />
                          </button>
                          <button>
                            <i className="fa-light fa-star" />
                          </button>
                          <button>
                            <i className="fa-light fa-trash" />
                          </button>
                        </div>
                      </div>
             
                      <div className="text-center callListItem">
                        <h5 className="fw-semibold">D</h5>
                      </div>
                    
                      <div className="contactListItem">
                        <div className="row justify-content-between">
                          <div className="col-xl-7 col-xxl-6 d-flex">
                            <div className="profileHolder" id="profileOffline">
                              <i className="fa-light fa-user fs-5" />
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                              <h4>DUSER XYZ</h4>
                              <h5>
                                69/A, XYZ Street, Saint Petersburg, Russia
                              </h5>
                            </div>
                          </div>
                          <div className="col-10 col-xl-4 col-xxl-5">
                            <h4>
                              <span>Office</span>
                            </h4>
                            <h5>1 (999) 999-9999</h5>
                            <h6
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i className="fa-regular fa-xmark me-1" /> 50
                            </h6>
                          </div>
                          <div className="col-auto text-end d-flex justify-content-center align-items-center">
                            <i
                              className="fa-sharp fa-thin fa-star"
                              style={{ fontSize: 18 }}
                            />
                          </div>
                        </div>
                        <div className="contactPopup">
                          <button>
                            <i className="fa-light fa-phone" />
                          </button>
                          <button>
                            <i className="fa-light fa-message" />
                          </button>
                          <button>
                            <i className="fa-light fa-star" />
                          </button>
                          <button>
                            <i className="fa-light fa-trash" />
                          </button>
                        </div>
                      </div>
                   
              
                      <div className="contactListItem  myContacts">
                        <div className="row justify-content-between">
                          <div className="col-xl-7 col-xxl-6 d-flex">
                            <div className="profileHolder" id="profileBusy">
                              <i className="fa-light fa-user fs-5" />
                            </div>
                            <div className="my-auto ms-2 ms-xl-3">
                              <h4>DUSER XYZ</h4>
                              <h5>
                                69/A, XYZ Street, Saint Petersburg, Russia
                              </h5>
                            </div>
                          </div>
                          <div className="col-10 col-xl-4 col-xxl-5">
                            <h4>
                              <span>Office</span>
                            </h4>
                            <h5>1 (999) 999-9999</h5>
                            <h6
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <i className="fa-regular fa-xmark me-1" /> 20
                            </h6>
                          </div>
                          <div className="col-auto text-end d-flex justify-content-center align-items-center">
                            <i
                              className="fa-sharp fa-thin fa-star"
                              style={{ fontSize: 18 }}
                            />
                          </div>
                        </div>
                        <div className="contactPopup">
                          <button>
                            <i className="fa-light fa-phone" />
                          </button>
                          <button>
                            <i className="fa-light fa-message" />
                          </button>
                          <button>
                            <i className="fa-light fa-star" />
                          </button>
                          <button>
                            <i className="fa-light fa-trash" />
                          </button>
                        </div>
                      </div>
                 
                    </div> */}
                  </div>
                </div>
              </div>
              {/* <div className="col-xl-6">
                <section id="contactView">
                  <div
                    className="row justify-content-between"
                    style={{ height: "100%" }}
                  >
                    <div className="col-12 mx-auto position-relative b text-center">
                      <div className="profileInfoHolder">
                        <div className="profileHolder">
                          <i className="fa-light fa-user fs-3" />
                        </div>
                        <h4>1 (999) 999-9999</h4>
                        <h5>USER XYZ</h5>
                        <div className="d-flex justify-content-center align-items-center mt-3">
                          <button className="appPanelButton" effect="ripple">
                            <i className="fa-light fa-message-dots" />
                          </button>
                          <button className="appPanelButton" effect="ripple">
                            <i className="fa-light fa-phone" />
                          </button>
                          <button className="appPanelButton" effect="ripple">
                            <i className="fa-light fa-video" />
                          </button>
                          <button className="appPanelButton" effect="ripple">
                            <i className="fa-light fa-trash" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12 mx-auto mt-3">
                      <div className="row contact-detail-list">
                        <div className="col-12 col-xl-4">
                          <div className="d-flex contactItem">
                            <div className="d-flex justify-content-between">
                              <i className="fa-regular fa-user" />
                            </div>
                            <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                              <div className="box">
                                <h6>Title:</h6>
                              </div>
                              <div className="box">
                                <h5>"Test1"</h5>
                              </div>
                              <div className="box">
                                <h6>Name:</h6>
                              </div>
                              <div className="box">
                                <h5>Ramnaresh Chaurasiya</h5>
                              </div>
                              <div className="box">
                                <h6>Type:</h6>
                              </div>
                              <div className="box">
                                <h5>User</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-xl-4">
                          <div className="d-flex contactItem">
                            <div className="d-flex justify-content-between">
                              <i className="fa-regular fa-hashtag" />
                            </div>
                            <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                              <div className="box">
                                <h6>Label:</h6>
                              </div>
                              <div className="box">
                                <h5>Demo Text</h5>
                              </div>
                              <div className="box">
                                <h6>Label:</h6>
                              </div>
                              <div className="box">
                                <h5>Demo Text</h5>
                              </div>
                              <div className="box">
                                <h6>Label:</h6>
                              </div>
                              <div className="box">
                                <h5>Demo Text</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-xl-4">
                          <div className="d-flex contactItem">
                            <div className="d-flex justify-content-between">
                              <i className="fa-regular fa-envelope" />
                            </div>
                            <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                              <div className="box">
                                <h6>Label:</h6>
                              </div>
                              <div className="box contact-email-box">
                                riddhee.gupta@gmail.com
                              </div>
                              <div className="box">
                                <h6>Desc:</h6>
                              </div>
                              <div className="box">
                                <h5>
                                  Magna ea fugiat ullamco sunt aliquip consequat
                                  commodo culpa eiusmod irure.
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-xl-4">
                          <div className="d-flex contactItem">
                            <div className="d-flex justify-content-between">
                              <i className="fa-regular fa-location-dot" />
                            </div>
                            <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                              <div className="box">
                                <h6>Work:</h6>
                              </div>
                              <div className="box">
                                <h5>
                                  Carretera A San Jacinto, Tarija, 664856,
                                  Bolivia
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-xl-4">
                          <div className="d-flex contactItem">
                            <div className="d-flex justify-content-between">
                              <i className="fa-regular fa-link" />
                            </div>
                            <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                              <div className="box">
                                <h6>Work:</h6>
                              </div>
                              <div className="box">
                                <h5>https://xyz.com</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-xl-4">
                          <div className="d-flex contactItem">
                            <div className="d-flex justify-content-between">
                              <i className="fa-regular fa-notes" />
                            </div>
                            <div className="content ms-xxl-3 col-xl-12 col-xxl-10">
                              <div className="box">
                                <h6 />
                              </div>
                              <div className="box">
                                <h5 />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div> */}
            </div>
          </div>
        </section>
      </main>

      {addContactToggle && (
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
              <div className="row content col-xl-4">
                <div className="col-2 px-0">
                  <div className="iconWrapper">
                    <i className="fa-duotone fa-triangle-exclamation"></i>
                  </div>
                </div>
                <div className="col-10 ps-0">
                  <h4>Warning!</h4>
                  <p>Are you sure you want to delete this Contact?</p>
                  <div className="mt-2 d-flex justify-content-between">
                    <button
                      className="panelButton m-0"
                      onClick={() => deleteContactByIt(selectedDeleteId)}
                    >
                      <span className="text">Confirm</span>
                      <span className="icon">
                        <i class="fa-solid fa-check"></i>
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
                        <i class="fa-solid fa-xmark"></i>
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
