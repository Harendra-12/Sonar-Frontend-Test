import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { generalGetFunction } from "../../GlobalFunction/globalFunction";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ContentLoader from "../Misc/ContentLoader";
import EmptyPrompt from "../Misc/EmptyPrompt";
import Header from "../../CommonComponents/Header";

function Gateway() {
  const navigate = useNavigate();
  const [gateway, setGateway] = useState();
  const account = useSelector((state) => state.account)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (account && account.id) {
      async function getData() {
        const apiData = await generalGetFunction(`/gateways?account=${account.account_id}`);
        if (apiData.status) {
          setGateway(apiData.data);
          setLoading(false);
        } else {
          navigate("/");
        }

      }
      getData();
    } else {
      navigate("/")
    }
  }, []);
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Gateways" />
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
                <div className="col-xl-8 mt-3 mt-xl-0">
                  <div className="d-flex justify-content-end flex-wrap gap-2">
                    {/* <button effect="ripple" className="panelButton">
                        Start
                      </button>
                      <button effect="ripple" className="panelButton">
                        Stop
                      </button> */}
                    <button effect="ripple" className="panelButton" onClick={() => window.location.reload()}>
                      Refresh
                    </button>
                    <Link
                      to="/gateway-add"
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
                        <th>Gateway</th>
                        <th>user name</th>
                        <th>Proxy</th>
                        <th>Register</th>
                        <th>Status</th>
                        <th>Realm</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? <tr><td colSpan={99}><ContentLoader /></td></tr> : ""}
                      {gateway &&
                        gateway.map((item, index) => {
                          return (
                            <tr key={index} onClick={() => navigate(`/gateway-edit?id=${item.id}`)}>
                              <td>{item.name}</td>
                              <td>{item.username}</td>
                              <td>{item.proxy}</td>
                              <td>{item.register}</td>
                              <td>
                                {item.status === "D" ? "Disable" : "Enable"}
                              </td>
                              <td>{item.realm}</td>
                              <td className="ellipsis" id="detailBox">
                                {item.description}
                              </td>
                            </tr>
                          );
                        })}

                      {gateway && gateway.length === 0 ? <tr><td colSpan={99}><EmptyPrompt name="Gateway" link="gateway-add" /></td></tr> : ""}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Gateway;
