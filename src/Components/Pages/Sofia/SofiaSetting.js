import React, { useEffect, useState } from "react";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { Link, useNavigate } from "react-router-dom";
import ContentLoader from "../Misc/ContentLoader";
import EmptyPrompt from "../Misc/EmptyPrompt";
import Header from "../../CommonComponents/Header";

function SofiaSetting() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sofia, setSofia] = useState();
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction("sofia-global-settings");
      if (apiData.status) {
        setLoading(false);
        setSofia(apiData.data);
      } else {
        setLoading(false);
        navigate("/");
      }
    }
    getData();
  }, [navigate]);
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Sofia Global Setting" />
            <div className="row px-xl-3 py-2" id="detailsHeader">
              <div className="col-xl-4 my-auto">
                <div className="position-relative searchBox">
                  <input
                    type="search"
                    name="Search"
                    id="headerSearch"
                    placeholder="Search"
                  />
                </div>
              </div>
              <div className="col-xl-8 pt-3 pt-xl-0">
                <div className="d-flex justify-content-end">
                  <button
                    onClick={() => window.location.reload()}
                    effect="ripple"
                    className="panelButton"
                  >
                    Refresh
                  </button>
                  <Link
                    to="/sofia-add-setting"
                    onClick={backToTop}
                    effect="ripple"
                    className="panelButton"
                  >
                    Add
                  </Link>
                  <div className="my-auto position-relative mx-3">
                    <label className="switch">
                      <input
                        type="checkbox"
                        id="showAllCheck"
                      // onchange="toggleDomain()"
                      />
                      <span className="slider round" />
                    </label>
                    <span className="position-relative mx-1">Show All</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Value</th>
                      <th>Enabled</th>
                      <th>Description</th>
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
                      ""
                    )}
                    {sofia &&
                      sofia.map((item, index) => {
                        return (
                          <tr
                            key={index}
                            onClick={() =>
                              navigate(`/sofia-edit-setting?id=${item.id}`)
                            }
                          >
                            <td>{item.name}</td>
                            <td>{item.value}</td>
                            <td>
                              <label className={item.enabled == 1 ? "tableLabel success" : "tableLabel fail"}>{item.enabled == 1 ? "True" : "False"}</label>
                            </td>
                            <td>{item.description}</td>
                          </tr>
                        );
                      })}
                    {sofia && sofia.length === 0 ? (
                      <td colSpan={99}>
                        <EmptyPrompt
                          name="Sofia Setting"
                          link="extensions-add"
                        />
                      </td>
                    ) : (
                      ""
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
}

export default SofiaSetting;
