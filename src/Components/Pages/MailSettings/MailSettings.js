import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import ContentLoader from "../../Loader/ContentLoader";
import {
  backToTop,
  checkViewSidebar,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import MailSettingsAdd from "./MailSettingsAdd";
import MailSettingsEdit from "./MailSettingsEdit";
import { useNavigate } from "react-router-dom";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

const MailSettings = ({ style }) => {
  const navigate = useNavigate();
  const slugPermissions = useSelector((state) => state?.permissions);
  const [loading, setLoading] = useState(false);
  const [mailSettings, setMailSettings] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [deleteSettingsId, setDeleteSetingsId] = useState(null);
  const account = useSelector((state) => state.account);
  const [noPermission, setNoPermission] = useState(false);
  const [mailSettingAddToggle, setMailSettingAddToggle] = useState(false);
  const [mailSettingsEditToggle, setMailSettingsEditToggle] = useState(false);
  const [mailDataRefresh, setMailDataRefresh] = useState(0);
  const [refreshState, setRefreshState] = useState(false);
  const [selectedMailSettingToEdit, setSelectedMailSettingToEdit] =
    useState(null);

  const fetchData = async (shouldLoad) => {
    if (shouldLoad) setLoading(true);
    const result = await generalGetFunction("/mail-setting/all");
    if (result?.status) {
      setMailSettings(result.data);
      setLoading(false);
      setRefreshState(false)
    } else {
      setLoading(false);
      setRefreshState(false)
      if (result.response.status === 403) {
        setNoPermission(true);
      }
      // navigate("/");
    }
  };

  useEffect(() => {
    setRefreshState(true)
    const shouldLoad = true;
    fetchData(shouldLoad);
  }, [mailDataRefresh]);

  const handleSettingsDelete = async () => {
    setLoading(true);
    setOpenPopup(false);
    const apiData = await generalDeleteFunction(
      `/mail-setting/destroy/${deleteSettingsId}`
    );
    if (apiData.status) {
      setLoading(false);
      // setOpenPopup(false);
      setMailSettings([]);
      toast.success(apiData.message);
    } else {
      setLoading(false);
      // setOpenPopup(false);
      // toast.error(apiData.message);
    }
  };

  const handleEditMailSettings = (id) => {
    setMailSettingsEditToggle(true);
    setMailSettingAddToggle(false);
    setSelectedMailSettingToEdit(id);
  };

  const handleRefreshBtnClicked = () => {
    setRefreshState(true)
    const shouldLoad = false;
    fetchData(shouldLoad);
  }

  return (
    <>
      {mailSettingAddToggle ? (
        <MailSettingsAdd
          setMailSettingAddToggle={setMailSettingAddToggle}
          setMailDataRefresh={setMailDataRefresh}
        />
      ) : mailSettingsEditToggle ? (
        <MailSettingsEdit
          setMailSettingsEditToggle={setMailSettingsEditToggle}
          selectedMailSettingToEdit={selectedMailSettingToEdit}
          setSelectedMailSettingToEdit={setSelectedMailSettingToEdit}
          setMailDataRefresh={setMailDataRefresh}
        />
      ) : (
        <main className="mainContent">
          <section id="phonePage">
            <div className="container-fluid">
              <div className="row">
                <Header title="Mail Settings" />
                <div className="overviewTableWrapper">
                  <div className="overviewTableChild">
                    <div className="d-flex flex-wrap">
                      <div className="col-12">
                        <div className="heading">
                          <div className="content">
                            <h4>Mail Settings {" "}
                              <button
                                className="clearButton"
                                onClick={handleRefreshBtnClicked}
                                disabled={refreshState}
                              >
                                <i
                                  className={
                                    refreshState
                                      ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                      : "fa-regular fa-arrows-rotate fs-5"
                                  }
                                ></i>
                              </button>
                            </h4>
                            <p>You can configure your SMTP settings here</p>
                          </div>
                          <div className="buttonGroup">
                            <button
                              effect="ripple"
                              className="panelButton gray"
                              onClick={() => {
                                navigate(-1);
                                backToTop();
                              }}
                            >
                              <span className="text">Back</span>
                              <span className="icon">
                                <i className="fa-solid fa-caret-left"></i>
                              </span>
                            </button>
                            {mailSettings && !mailSettings.length > 0 && (
                              <>
                                {checkViewSidebar(
                                  "MailSetting",
                                  slugPermissions,
                                  account?.sectionPermissions,
                                  account?.permissions,
                                  "add"
                                ) && (
                                    <button
                                      effect="ripple"
                                      className="panelButton"
                                      onClick={() => {
                                        setMailSettingAddToggle(true);
                                      }}
                                    >
                                      <span className="text">Add</span>
                                      <span className="icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                  )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-12"
                        style={{ overflow: "auto", padding: "10px 10px" }}
                      >
                        <div className="mx-2 tableContainer">
                          {loading ? (
                            <ThreeDotedLoader />
                          ) :
                            <table>
                              <thead>
                                <tr>
                                  <th>Mail Driver</th>
                                  <th>Username</th>
                                  <th>Host</th>
                                  <th>Mail From</th>
                                  <th>Mail From Name</th>
                                  {checkViewSidebar("MailSetting", slugPermissions, account?.sectionPermissions, account?.permissions, "edit") && <th>Edit</th>}
                                  {checkViewSidebar("MailSetting", slugPermissions, account?.sectionPermissions, account?.permissions, "delete") && <th>Delete</th>}
                                </tr>
                              </thead>
                              <tbody>
                                {noPermission || !checkViewSidebar(
                                  "MailSetting",
                                  slugPermissions,
                                  account?.sectionPermissions,
                                  account?.permissions,
                                  "read"
                                ) ? (
                                  <tr>
                                    <td colSpan={99} className="text-center">You dont have any permission</td>
                                  </tr>
                                ) : (
                                  <>
                                    {mailSettings &&
                                      mailSettings.map((data, index) => (
                                        <tr key={index}>
                                          <td style={{ cursor: "default" }}>
                                            {data.mail_driver}
                                          </td>
                                          <td style={{ cursor: "default" }}>
                                            {data.mail_username}
                                          </td>
                                          <td style={{ cursor: "default" }}>
                                            {data.mail_host}
                                          </td>
                                          <td style={{ cursor: "default" }}>
                                            {data.mail_from_address}
                                          </td>
                                          <td style={{ cursor: "default" }}>
                                            {data.mail_from_name}
                                          </td>
                                          {checkViewSidebar("MailSetting", slugPermissions, account?.sectionPermissions, account?.permissions, "edit") && <td style={{ cursor: "default" }}>
                                            {" "}
                                            <button
                                              className="tableButton edit"
                                              // onClick={() =>
                                              //   navigate(
                                              //     // `/mail-settings-edit?id=${data.id}`
                                              //     `/mail-settings-edit`,
                                              //     {
                                              //       state: data.id,
                                              //     }
                                              //   )
                                              // }
                                              onClick={() =>
                                                handleEditMailSettings(
                                                  data.id
                                                )
                                              }
                                            >
                                              <i className="fa-solid fa-pencil"></i>
                                            </button>
                                          </td>}
                                          {checkViewSidebar("MailSetting", slugPermissions, account?.sectionPermissions, account?.permissions, "delete") && <td style={{ cursor: "default" }}>
                                            <button
                                              className="tableButton delete"
                                              onClick={() => {
                                                setOpenPopup(true);
                                                setDeleteSetingsId(data.id);
                                              }}
                                            >
                                              <i className="fa-solid fa-trash"></i>
                                            </button>
                                          </td>}
                                        </tr>
                                      ))}

                                    {mailSettings.length === 0 && (
                                      <td colSpan={99}>
                                        <EmptyPrompt
                                          name="Mail Settings"
                                          link="mail-settings-add"
                                        />
                                      </td>
                                    )}
                                  </>
                                )}
                              </tbody>
                            </table>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {openPopup && (
            <div className="popup">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div className="row content col-xl-4 col-md-5">
                    <div className="col-2 px-0">
                      <div className="iconWrapper">
                        <i className="fa-duotone fa-triangle-exclamation"></i>
                      </div>
                    </div>
                    <div className="col-10 ps-0">
                      <h4>Delete Mail Settings</h4>
                      Are you sure you want to delete this Mail Settings?
                      <br />
                      <br />
                      <div className="mt-2 d-flex justify-content-between">
                        <button
                          className="panelButton m-0"
                          onClick={handleSettingsDelete}
                        >
                          <span className="text">Confirm</span>
                          <span className="icon">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </button>
                        <button
                          className="panelButtonWhite m-0 float-end"
                          onClick={() => setOpenPopup(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </>
  );
};

export default MailSettings;
