import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../Misc/ContentLoader";

function CallCenterQueue() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [callCenter, setCallCenter] = useState();
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction("/call-center-queues");
      if (apiData.status) {
        setLoading(false);
        setCallCenter(apiData.data);
      } else {
        setLoading(false);
      }
    }
    getData();
  }, []);
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Call Center" />
            <div
              className="d-flex flex-wrap px-xl-3 py-2 position-relative"
              style={{ zIndex: 1 }}
              id="detailsHeader"
            >
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
                  <Link
                    to="/cal-center-queue-add"
                    onClick={backToTop}
                    effect="ripple"
                    className="panelButton"
                  >
                    Add
                  </Link>
                  <div className="my-auto position-relative mx-3">
                    <label className="switch">
                      <input type="checkbox" id="showAllCheck" />
                      <span className="slider round" />
                    </label>
                    <span className="position-relative mx-1">Show All</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-12"
              style={{ overflow: "auto", position: "relative" }}
            >
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Queue Name</th>
                      <th>Extension</th>
                      <th>Strategy</th>
                      <th>Timeout Action</th>
                      <th>Prefix</th>
                      <th>Total Agents</th>
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
                    {callCenter &&
                      callCenter.map((item) => {
                        return (
                          <tr onClick={()=>navigate("/cal-center-queue-edit",{state:item})}>
                            <td>{item.queue_name}</td>
                            <td>{item.extension}</td>
                            <td>{item.strategy}</td>
                            <td>{item.queue_timeout_action}</td>
                            <td>{item.queue_cid_prefix}</td>
                            <td>{item.agents.length}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="sidePannel d-none">
              <div className="wrapper">
                <ul className="label">
                  <li>
                    Agent <span className="float-end">Status</span>
                  </li>
                </ul>
                <ul>
                  <li>
                    Name243 <span className="extensionStatus"></span>
                  </li>
                  <li>
                    Name <span className="extensionStatus"></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CallCenterQueue;
