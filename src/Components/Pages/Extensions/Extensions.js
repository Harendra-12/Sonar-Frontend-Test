/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  backToTop,
  checkViewSidebar,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import { useDispatch, useSelector } from "react-redux";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
const Extensions = () => {
  const navigate = useNavigate();
  const [extension, setExtension] = useState();
  const account = useSelector((state) => state.account);
  const [loading, setLoading] = useState(true);
  const [onlineExtension, setOnlineExtension] = useState([0]);
  const [pageNumber, setPageNumber] = useState(1);
  const registerUser = useSelector((state) => state.registerUser);
  const extensionByAccount = useSelector((state) => state.extensionByAccount);
  const [userList, setUserList] = useState([]);
  // const userList = useSelector((state) => state.allUser?.data) || [];
  const dispatch = useDispatch();
  const [noPermissionToRead, setNoPermissionToRead] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const showKeys = [
    "extension",
    "user",
    "effectiveCallerIdName",
    "outbundCallerIdName",
    "description",
  ];
  const slugPermissions = useSelector((state) => state?.permissions);
  // Geeting online extensions from socket and updating the state
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
  }, [registerUser]);

  // Trigger user api to get latest users
  useEffect(() => {
    async function getData() {
      const userApi = await generalGetFunction(
        `/user/search?account=${account.account_id}`
      );
      if (userApi?.status) {
        setUserList(userApi.data);
      }
    }
    getData();
  }, []);

  // Filtering users with extensions
  const userWithExtension = userList
    .filter((user) => user.extension && user.extension.extension) // Filter out null or undefined extensions
    .map((user) => ({
      name: user?.username,
      extension: user.extension.extension, // Access the nested extension value
    }));

  // Getting list of all users by various filters like page number, items per page and search keys
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
            `/extension/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`
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
                        <tbody>
                          {noPermissionToRead &&  checkViewSidebar(
                            "Extension",
                            slugPermissions,
                            account?.permissions,"read"
                          )? (
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
                                    extension?.data?.length > 0 &&
                                    (() => {
                                      // Filter showKeys to include only keys that exist in extension.data
                                      const validKeys = showKeys.filter((key) =>
                                        extension.data.some(
                                          (item) => key in item
                                        )
                                      );

                                      return (
                                        <table>
                                          <thead>
                                            <tr>
                                              {validKeys.map((key) => {
                                                let formattedKey = "";
                                                if (
                                                  key ===
                                                  "effectiveCallerIdName"
                                                ) {
                                                  formattedKey =
                                                    "Effective CID Name";
                                                } else if (
                                                  key === "outbundCallerIdName"
                                                ) {
                                                  formattedKey =
                                                    "Outbound CID Name";
                                                } else {
                                                  formattedKey = key
                                                    .replace(/[-_]/g, " ")
                                                    .toLowerCase()
                                                    .replace(/\b\w/g, (char) =>
                                                      char.toUpperCase()
                                                    );
                                                }
                                                return (
                                                  <th key={key}>
                                                    {formattedKey}
                                                  </th>
                                                );
                                              })}
                                              <th className="text-center">
                                                Status
                                              </th>
                                              {checkViewSidebar(
                                                "Extension",
                                                slugPermissions,
                                                account?.permissions,
                                                "edit"
                                              ) && (
                                                <th className="text-center">
                                                  Edit
                                                </th>
                                              )}
                                              <th className="text-center">
                                                Add Devices
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {extension.data.map(
                                              (item, index) => {
                                                const foundUser =
                                                  userWithExtension.find(
                                                    (value) =>
                                                      value.extension ===
                                                      item.extension
                                                  );

                                                return (
                                                  <tr key={index}>
                                                    {validKeys.map((key) => (
                                                      <td key={key}>
                                                        {key === "user"
                                                          ? foundUser
                                                            ? foundUser.name
                                                            : ""
                                                          : item[key]}
                                                      </td>
                                                    ))}
                                                    <td>
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
                                                    {checkViewSidebar(
                                                      "Extension",
                                                      slugPermissions,
                                                      account?.permissions,
                                                      "edit"
                                                    ) && (
                                                      <td
                                                        style={{
                                                          cursor: "default",
                                                        }}
                                                      >
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
                                                    )}
                                                    <td
                                                      style={{
                                                        cursor: "default",
                                                      }}
                                                    >
                                                      {/* {item.provisionings ? (
                                                        <button
                                                          className="tableButton edit mx-auto"
                                                          onClick={() =>
                                                            navigate(
                                                              `/device-provisioning-edit`,
                                                              {
                                                                state: {
                                                                  provisionings:
                                                                    item.provisionings,
                                                                  extension_id:
                                                                    item.id,
                                                                },
                                                              }
                                                            )
                                                          }
                                                        >
                                                          <i class="fa-solid fa-phone-office"></i>
                                                        </button>
                                                      ) : ( */}
                                                        <button
                                                          className="tableButton mx-auto"
                                                          onClick={() =>
                                                            navigate(
                                                              "/all-devices",
                                                              {
                                                                state: {
                                                                  extension:
                                                                    item.extension,
                                                                  id: item.id,
                                                                },
                                                              }
                                                            )
                                                          }
                                                        >
                                                          <i class="fa-solid fa-plus"></i>
                                                        </button>
                                                      {/* )} */}
                                                    </td>
                                                  </tr>
                                                );
                                              }
                                            )}
                                          </tbody>
                                        </table>
                                      );
                                    })()}
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
