import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { useSelector } from "react-redux";
import EmptyPrompt from "../Misc/EmptyPrompt";
import ContentLoader from "../Misc/ContentLoader";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";

const Extensions = () => {
  const navigate = useNavigate();
  const [extension, setExtension] = useState();
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const [onlineExtension, setOnlineExtension] = useState([0]);
  const [pageNumber, setPageNumber] = useState(1);
  const registerUser = useSelector((state) => state.registerUser);
  useEffect(() => {
    if (registerUser.length > 0) {
      setOnlineExtension(
        registerUser.map((item) => {
          return item.extension;
        })
      );
    } else {
      setOnlineExtension([0]);
    }
  }, [registerUser]);

  useEffect(() => {
    setLoading(true);
    async function getData() {
      if (account && account.account_id) {
        const apiData = await generalGetFunction(
          `/extensions?account=${account.account_id}&page=${pageNumber}`
        );
        if (apiData.status) {
          setLoading(false);
          setExtension(apiData.data);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate("/");
      }
    }
    getData();
  }, [account, navigate, pageNumber]);
  console.log("This is Extension list", extension);
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Extensions" />
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
                  <Link
                    to="/extensions-add"
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
            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Extensions</th>
                      <th>Domains</th>
                      <th>Effective CID Name</th>
                      <th>Outbound CID Name</th>
                      <th>Call Group</th>
                      <th>Call Screen</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Setting</th>
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
                    {extension &&
                      extension.data.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              <Link to="/extensions-edit" onClick={backToTop}>
                                {item.extension}
                              </Link>
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/extensions-edit?id=${item.id}`)
                              }
                            >
                              {item?.domain?.domain_name}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/extensions-edit?id=${item.id}`)
                              }
                            >
                              {item.effectiveCallerIdName}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/extensions-edit?id=${item.id}`)
                              }
                            >
                              {item.outbundCallerIdName}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/extensions-edit?id=${item.id}`)
                              }
                            >
                              {item.callgroup}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/extensions-edit?id=${item.id}`)
                              }
                            >
                              <label className={item.callScreen === 'Enable' ? "tableLabel success" : "tableLabel fail"}>{item.callScreen}</label>
                            </td>
                            {/* <td>1001</td> */}
                            <td
                              onClick={() =>
                                navigate(`/extensions-edit?id=${item.id}`)
                              }
                              className="ellipsis"
                              id="detailBox"
                            >
                              {item.description}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/extensions-edit?id=${item.id}`)
                              }
                            >
                              <span
                                className={
                                  onlineExtension.includes(item.extension)
                                    ? "extensionStatus online"
                                    : "extensionStatus"
                                }
                              ></span>
                            </td>
                            <td
                              onClick={() =>
                                navigate("/call-settings", {
                                  state: {
                                    id: item.id,
                                    extension: item.extension,
                                  },
                                })
                              }
                            >
                              <i className="fa-duotone fa-gear text-success"></i>
                            </td>
                          </tr>
                        );
                      })}
                    {extension && extension.data.length === 0 ? (
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
          {extension && extension.data.length > 0 ? (
            <PaginationComponent
              pageNumber={(e) => setPageNumber(e)}
              totalPage={extension.last_page}
              from={(pageNumber - 1) * extension.per_page + 1}
              to={extension.to}
              total={extension.total}
            />
          ) : (
            ""
          )}
        </div>
      </section>
    </main>
  );
};

export default Extensions;
