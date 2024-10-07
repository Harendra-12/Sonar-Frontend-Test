import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Link, useNavigate } from "react-router-dom";
import ContentLoader from "../../Loader/ContentLoader";
import {
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

const MailSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mailSettings, setMailSettings] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [deleteSettingsId, setDeleteSetingsId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await generalGetFunction("/mail-setting/all");
      if (result?.status) {
        setMailSettings(result.data);
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/");
      }
    };

    fetchData();
  }, []);

  const handleSettingsDelete = async () => {
    setLoading(true);

    const apiData = await generalDeleteFunction(
      `/mail-setting/destroy/${deleteSettingsId}`
    );
    if (apiData.status) {
      setLoading(false);
      setOpenPopup(false);
      setMailSettings([]);
      toast.success(apiData.message);
    } else {
      setLoading(false);
      setOpenPopup(false);
      // toast.error(apiData.message);
    }
  };

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Mail Settings" />
            <div className="d-flex flex-wrap px-xl-3 py-2" id="detailsHeader">
              <div className="col-xl-4 my-auto">
                <div className="position-relative searchBox"></div>
              </div>
              {mailSettings && !mailSettings.length > 0 && (
                <div className="col-xl-8 mt-3 mt-xl-0">
                  <div className="d-flex justify-content-end flex-wrap gap-2">
                    <Link
                      to="/mail-settings-add"
                      effect="ripple"
                      className="panelButton"
                    >
                      Add
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="mx-2 tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Mail Driver</th>
                      <th>Username</th>
                      <th>Host</th>
                      <th>Mail From</th>
                      <th>Mail From Name</th>
                      <th>Edit</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={99}>
                          <ContentLoader />
                        </td>
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
                              <td style={{ cursor: "default" }}>
                                {" "}
                                <button
                                  className="tableButton edit"
                                  onClick={() =>
                                    navigate(
                                      `/mail-settings-edit?id=${data.id}`
                                    )
                                  }
                                >
                                  <i class="fa-solid fa-pencil"></i>
                                </button>
                              </td>
                              <td style={{ cursor: "default" }}>
                                <button
                                  className="tableButton delete"
                                  onClick={() => {
                                    setOpenPopup(true);
                                    setDeleteSetingsId(data.id);
                                  }}
                                >
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                              </td>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {openPopup && (
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
                  <h4>Delete Mail Settings</h4>
                  Are you sure you want to delete this Mail Settings?
                  <br />
                  <br />
                  <div className="mt-2">
                    <button
                      className="panelButton m-0"
                      onClick={handleSettingsDelete}
                    >
                      Confirm
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
  );
};

export default MailSettings;
