import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Link, useNavigate } from "react-router-dom";
import ContentLoader from "../../Loader/ContentLoader";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import EmptyPrompt from "../../Loader/EmptyPrompt";

const MailSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mailSettings, setMailSettings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await generalGetFunction("/mail-setting/all");
      if (result.status) {
        setMailSettings(result.data);
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/");
      }
    };

    fetchData();
  }, []);

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
              <div className="col-xl-8 mt-3 mt-xl-0">
                <div className="d-flex justify-content-end flex-wrap gap-2">
                  <Link
                    to="/mail-settings-add"
                    // onClick={backToTop}
                    // onClick={handleAddUserValidation}
                    effect="ripple"
                    className="panelButton"
                  >
                    Add
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="mx-2 tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Host</th>
                      <th>Mail From</th>
                      <th>Mail From Name</th>
                      <th>Settings</th>
                      <th>Action</th>
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
                              <td>{data.username}</td>
                              <td>{data.host}</td>
                              <td>{data.mail_from}</td>
                              <td>{data.mail_from_name}</td>
                              <td>{data.settings}</td>
                              <td>
                                <Link
                                  to={`/mail-settings-edit/${data.id}`}
                                  effect="ripple"
                                  className="panelButton"
                                >
                                  Edit
                                </Link>
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
    </main>
  );
};

export default MailSettings;
