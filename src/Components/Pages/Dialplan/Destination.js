/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";
import { useSelector } from "react-redux";
import Header from "../../CommonComponents/Header";
import EmptyPrompt from "../../Loader/EmptyPrompt";
function Destination() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState();
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState();
  const account = useSelector((state) => state.account);

  useEffect(() => {
    if (account && account.id) {
      async function getData() {
        const apiData = await generalGetFunction(
          `/dialplan/all?account_id=${account.account_id}`
        );
        // const domainData = await generalGetFunction(
        //   `/domain/search?account=${account.account_id}`
        // );
        if (apiData.status) {
          setDestination(apiData.data);
          setLoading(false);
        } else {
          navigate("/");
        }
        // if (domainData.status) {
        //   setDomain(
        //     domainData.data.map((item) => {
        //       return [item.id, item.domain_name];
        //     })
        //   );
        // } else {
        //   navigate("/");
        // }
      }
      getData();
    } else {
      navigate("/");
    }
  }, [account, navigate]);
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Destination" />
              <div className="d-flex flex-wrap px-xl-3 py-2" id="detailsHeader">
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
                    <Link
                      effect="ripple"
                      className="panelButton"
                      to="/destination-add"
                      onClick={() => backToTop()}
                    >
                      Add
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-12" style={{ overflow: "auto" }}>
                <div className="tableContainer">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>DID</th>
                        <th>Country Code</th>
                        <th>Destination</th>
                        <th>Context</th>
                        <th>Actions</th>
                        <th>Usage</th>
                        {/* <th>Domain</th> */}
                        <th>Status</th>
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
                      {destination &&
                        destination.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              onClick={() => {
                                navigate(`/destination-edit?id=${item.id}`, {
                                  state: { state: item },
                                });
                                window.scrollTo(0, 0);
                              }}
                            >
                              <td>{item.type}</td>
                              <td>{item?.did?.did}</td>
                              <td>{item.country_code}</td>
                              <td>{item.destination}</td>
                              <td>{item.context}</td>
                              <td>{item.dial_action}</td>
                              <td>{item.usage}</td>
                              {/* <td>{domain && domain.map((item2) => {
                              if (item2[0] == item.domain) {
                                return item2[1]
                              }
                            })}</td> */}
                              <td>
                                <label
                                  className={
                                    item.destination_status == 0
                                      ? "tableLabel fail"
                                      : "tableLabel success"
                                  }
                                >
                                  {" "}
                                  {item.destination_status == 0
                                    ? "false"
                                    : "true"}
                                </label>
                              </td>
                              <td className="ellipsis" id="detailBox">
                                {item.description}
                              </td>
                            </tr>
                          );
                        })}
                      {destination && destination.length === 0 ? (
                        <td colSpan={99}>
                          <EmptyPrompt name="Extension" link="extensions-add" />
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
    </>
  );
}

export default Destination;
