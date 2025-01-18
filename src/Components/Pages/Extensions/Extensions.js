import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  backToTop,
  featureUnderdevelopment,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import ContentLoader from "../../Loader/ContentLoader";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { toast } from "react-toastify";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";

const Extensions = () => {
  const navigate = useNavigate();
  const [extension, setExtension] = useState();
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const [onlineExtension, setOnlineExtension] = useState([0]);
  const [pageNumber, setPageNumber] = useState(1);
  const registerUser = useSelector((state) => state.registerUser);
  const allUserRefresh = useSelector((state) => state.allUserRefresh);
  const extensionByAccount = useSelector((state) => state.extensionByAccount);
  const userList = useSelector((state) => state.allUser?.data) || [];
  const dispatch = useDispatch();
  const [noPermissionToRead, setNoPermissionToRead] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (registerUser.length > 0) {
      setOnlineExtension(
        registerUser.map((item) => {
          if (item.account_id === account.account_id) {
            return item.extension;
          }
        })
      );
    } else {
      setOnlineExtension([0]);
    }
    // generalGetFunction("/freeswitch/checkActiveExtensionOnServer");
  }, [registerUser]);
  useEffect(() => {
    if (userList.length == 0) {
      dispatch({
        type: "SET_ALLUSERREFRESH",
        allUserRefresh: allUserRefresh + 1,
      });
    }
  }, []);

  const userWithExtension = userList
    .filter((user) => user.extension && user.extension.extension) // Filter out null or undefined extensions
    .map((user) => ({
      name: user.name,
      extension: user.extension.extension, // Access the nested extension value
    }));
  useEffect(() => {
    setLoading(true);
    if (extensionByAccount.data) {
      setExtension(extensionByAccount);
      if (pageNumber === 1 && itemsPerPage === 10) {
        setLoading(false);
      }
      // setLoading(false);
      async function getData() {
        if (account && account.account_id) {
          const apiData = await generalGetFunction(
            `/extension/all?page=${pageNumber}&row_per_page=${itemsPerPage}`
          );
          if (apiData?.status) {
            setExtension(apiData.data);
            dispatch({
              type: "SET_EXTENSIONBYACCOUNT",
              extensionByAccount: apiData.data,
            });
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
      if (searchValue.trim().length === 0) {
        getData();
      } else {
        const timer = setTimeout(() => {
          getData();
        }, 1000);
        return () => clearTimeout(timer);
      }
      getData();
    } else {
      async function getData() {
        setLoading(true);
        if (account && account.account_id) {
          const apiData = await generalGetFunction(
            `/extension/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`
          );
          if (apiData?.status) {
            setLoading(false);
            setExtension(apiData.data);
            dispatch({
              type: "SET_EXTENSIONBYACCOUNT",
              extensionByAccount: apiData.data,
            });
            setLoading(false);
          } else {
            if (apiData.response.status === 403) {
              setNoPermissionToRead(true);
            }
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      }
      if (searchValue.trim().length === 0) {
        getData();
      } else {
        const timer = setTimeout(() => {
          getData();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [navigate, pageNumber, account, itemsPerPage, searchValue]);

  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Extensions" />
            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Extension List</h4>
                        <p>You can see the list of extensions</p>
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
                            <i class="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <Link
                          // to="/extensions-add"
                          to="#"
                          onClick={() =>
                            window.open(
                              "https://ucaas.webvio.in:3001/",
                              "_blank"
                            )
                          }
                          effect="ripple"
                          className="panelButton"
                        >
                          <span className="text">Buy</span>
                          <span className="icon">
                            <i class="fa-solid fa-cart-shopping"></i>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "25px 20px 0" }}
                  >
                    <div className="tableHeader">
                      <div className="showEntries">
                        <label>Show</label>
                        <select
                          className="formItem"
                          value={itemsPerPage}
                          onChange={(e) => setItemsPerPage(e.target.value)}
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={30}>30</option>
                        </select>
                        <label>entries</label>
                      </div>
                      <div className="searchBox">
                        <label>Search:</label>
                        <input
                          type="text"
                          value={searchValue}
                          className="formItem"
                          onChange={(e) => setSearchValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Extensions</th>
                            <th>Name</th>
                            {/* <th>Domains</th> */}
                            <th>Effective CID Name</th>
                            <th>Outbound CID Name</th>
                            <th>Usage</th>
                            {/* <th>Call Screen</th> */}
                            <th>Description</th>
                            <th className="text-center">Status</th>
                            {/* <th className="text-center">Setting</th> */}
                            <th className="text-center">Edit</th>
                            <th className="text-center" style={{ width: 100 }}>
                              Add Devices
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {noPermissionToRead ? (
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>No Permissions</td>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          ) : (
                            <>
                              {loading ? (
                                <SkeletonTableLoader col={9} row={15} />
                              ) : (
                                <>
                                  {extension &&
                                    extension?.data?.map((item, index) => {
                                      const foundUser = userWithExtension.find(
                                        (value) =>
                                          value.extension === item.extension
                                      );

                                      return (
                                        <tr key={index}>
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/extensions-edit?id=${item.id}`
                                              )
                                            }
                                          >
                                            {item.extension}{" "}
                                          </td>
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/extensions-edit?id=${item.id}`
                                              )
                                            }
                                          >
                                            {foundUser ? `${foundUser.name}` : ""}
                                          </td>
                                          {/* <td
                              onClick={() =>
                                navigate(`/extensions-edit?id=${item.id}`)
                              }
                            >
                              {item?.domain?.domain_name}
                            </td> */}
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/extensions-edit?id=${item.id}`
                                              )
                                            }
                                          >
                                            {item.effectiveCallerIdName}
                                          </td>
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/extensions-edit?id=${item.id}`
                                              )
                                            }
                                          >
                                            {item.outbundCallerIdName}
                                          </td>
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/extensions-edit?id=${item.id}`
                                              )
                                            }
                                          >
                                            {item.usage}
                                          </td>
                                          {/* <td
                                        onClick={() =>
                                          navigate(
                                            `/extensions-edit?id=${item.id}`
                                          )
                                        }
                                      >
                                        {item.callScreen}
                                      </td> */}
                                          {/* <td>1001</td> */}
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/extensions-edit?id=${item.id}`
                                              )
                                            }
                                            className="ellipsis"
                                            id="detailBox"
                                          >
                                            {item.description}
                                          </td>
                                          <td
                                            onClick={() =>
                                              navigate(
                                                `/extensions-edit?id=${item.id}`
                                              )
                                            }
                                          >
                                            <span
                                              className={
                                                onlineExtension.includes(
                                                  item.extension
                                                )
                                                  ? "extensionStatus online mx-auto"
                                                  : "extensionStatus mx-auto"
                                              }
                                            ></span>
                                          </td>
                                          {/* <td style={{ cursor: "default" }}>
                                    <button
                                      class="tableButton mx-auto"
                                      onClick={() =>
                                        navigate("/call-settings", {
                                          state: {
                                            id: item.id,
                                            extension: item.extension,
                                          },
                                        })
                                      }
                                    >
                                      <i className="fa-duotone fa-gear"></i>
                                    </button>
                                  </td> */}
                                          <td style={{ cursor: "default" }}>
                                            {" "}
                                            <button
                                              className="tableButton edit mx-auto"
                                              onClick={() =>
                                                navigate(
                                                  `/extensions-edit?id=${item.id}`
                                                )
                                              }
                                            >
                                              <i class="fa-solid fa-pencil"></i>
                                            </button>
                                          </td>

                                          <td style={{ cursor: "default" }}>
                                            {item.provisionings ? (
                                              <button
                                                className="tableButton edit mx-auto"
                                                onClick={() =>
                                                  navigate(
                                                    `/device-provisioning-edit`,
                                                    {
                                                      state: {
                                                        provisionings:
                                                          item.provisionings,
                                                        extension_id: item.id,
                                                      },
                                                    }
                                                  )
                                                }
                                              >
                                                <i class="fa-solid fa-phone-office"></i>
                                              </button>
                                            ) : (
                                              <button
                                                className="tableButton mx-auto"
                                                onClick={() =>
                                                  navigate(
                                                    "/device-provisioning-new",
                                                    {
                                                      state: {
                                                        extension: item.extension,
                                                        id: item.id,
                                                      },
                                                    }
                                                  )
                                                }
                                              >
                                                <i class="fa-solid fa-plus"></i>
                                              </button>
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </>
                              )}

                            </>
                          )}

                          {extension && extension?.data?.length === 0 ? (
                            <td colSpan={99}>
                              <EmptyPrompt
                                name="Extension"
                                link="extensions-add"
                              />
                            </td>
                          ) : (
                            ""
                          )}
                        </tbody>
                      </table>
                    </div>
                    <div className="tableHeader mb-3">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Extensions;
