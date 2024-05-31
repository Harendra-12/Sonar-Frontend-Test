import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { Link } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../Misc/ContentLoader";

function InboundRoute() {
  const [loading, setLoading] = useState(true);
  const [inboundRoute, setInboundRoute] = useState();
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/inbound/routings`);
    }
  }, []);
  getData();
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="row px-xl-3 py-2" id="detailsHeader">
                  <Header title="Inbound Rotes" />
                  <div className="mt-4" />
                  <div className="col-xl-4 my-auto">
                    <div className="position-relative searchBox">
                      <input
                        type="search"
                        name="Search"
                        id="headerSearch"
                        placeholder="Search"
                        style={{ paddingRight: 100 }}
                      />
                    </div>
                  </div>
                  <div className="col-xl-8 mt-3 mt-xl-0">
                    <div className="d-flex justify-content-end flex-wrap gap-2">
                      <Link
                        to="/users-add"
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
              </div>

              <div className="col-12" style={{ overflow: "auto" }}>
                <div className="mx-2 tableContainer">
                  <table>
                    <thead>
                      <tr>
                        <th>Username (Extension)</th>
                        <th>Account ID</th>
                        <th>Domain</th>
                        <th>Online</th>
                        <th>On Call</th>
                        <th>Status</th>
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
                          {user &&
                            filterUser.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    onClick={() =>
                                      navigate(`/users-edit?id=${item.id}`)
                                    }
                                  >
                                    {item.username} ({item.extension?.extension}
                                    )
                                  </td>
                                  <td
                                    onClick={() =>
                                      navigate(`/users-edit?id=${item.id}`)
                                    }
                                  >
                                    {item.account_id}
                                  </td>
                                  <td
                                    onClick={() =>
                                      navigate(`/users-edit?id=${item.id}`)
                                    }
                                  >
                                    {item?.domain?.domain_name}
                                  </td>
                                  <td
                                    onClick={() =>
                                      navigate(`/users-edit?id=${item.id}`)
                                    }
                                  >
                                    <span
                                      className={
                                        onlineUser.includes(item.id)
                                          ? "extensionStatus online"
                                          : "extensionStatus"
                                      }
                                    ></span>
                                  </td>
                                  <td
                                    onClick={() =>
                                      navigate(`/users-edit?id=${item.id}`)
                                    }
                                  >
                                    True
                                  </td>
                                  <td
                                    onClick={() =>
                                      handleStatusChange(item.id, item.status)
                                    }
                                  >
                                    {item.status === "E"
                                      ? "Enabled"
                                      : "Disabled"}
                                  </td>
                                </tr>
                              );
                            })}
                        </>
                      )}

                      {user && user.length === 0 ? (
                        <td colSpan={99}>
                          <EmptyPrompt name="User" link="users-add" />
                        </td>
                      ) : (
                        ""
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {user && user.data.length > 0 ? (
              <PaginationComponent
              pageNumber={(e) => setPageNumber(e)}
              totalPage={user.last_page}
              from={(pageNumber - 1) * user.per_page + 1}
              to={user.to}
              total={user.total}
            />
            ) : (
              ""
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default InboundRoute;
