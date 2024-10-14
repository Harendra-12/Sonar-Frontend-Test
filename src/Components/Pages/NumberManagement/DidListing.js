import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useNavigate, Link } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function DidListing() {
  const [did, setDid] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const didAll = useSelector((state) => state.didAll);
  const dispatch = useDispatch();
  useEffect(() => {
    if (didAll) {
      setLoading(false);
      setDid(didAll);
      async function getData() {
        const apiData = await generalGetFunction(`/did/all`);
        if (apiData?.status) {
          setLoading(false);
          setDid(apiData.data);
          dispatch({
            type: "SET_DIDALL",
            didAll: apiData.data,
          });
        } else {
          setLoading(false);
          navigate(-1);
        }
      }
      getData();
    } else {
      async function getData() {
        const apiData = await generalGetFunction(`/did/all`);
        if (apiData?.status) {
          setLoading(false);
          setDid(apiData.data);
          dispatch({
            type: "SET_DIDALL",
            didAll: apiData.data,
          });
        } else {
          setLoading(false);
          navigate(-1);
        }
      }
      getData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = async (id) => {
    setLoading(true);
    try {
      const apiData = await generalDeleteFunction(
        `/did/configure/destroy/${id}`
      );
      if (apiData?.status) {
        const newData = await generalGetFunction(`/did/all`);
        if (newData?.status) {
          setDid(newData.data);
        } else {
          navigate(-1);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  async function handleClickDefault(id) {
    setLoading(true);
    const parsedData = {
      id: id
    }
    const apiData = await generalPostFunction(`/did/set-default`, parsedData);
    if (apiData?.status) {
      setLoading(false);
      toast.success(apiData.message);
      const newData = await generalGetFunction(`/did/all`);
      if (newData?.status) {
        setDid(newData.data);
      }
    } else {
      setLoading(false);
    }
  }
  console.log("This is transition details", did);
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="All DID" />
            <div
              className="d-flex flex-wrap justify-content-end px-xl-3 py-2 position-relative"
              style={{ zIndex: 1 }}
              id="detailsHeader"
            >
              <div className="col-xl-8 pt-3 pt-xl-0">
                <div className="d-flex justify-content-end">
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={() => {
                      navigate(-1);
                      backToTop();
                    }}
                  >
                    <span className="text">Back</span>
                    <span className="icon"><i class="fa-solid fa-caret-left"></i></span>
                  </button>
                  <Link to="/did-add" effect="ripple" className="panelButton">
                    <span className="text">Add</span>
                    <span className="icon"><i class="fa-solid fa-plus"></i></span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="tableContainer">
                {loading ? (
                  <ContentLoader />
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>DID</th>
                        <th>E911</th>
                        <th>Cname</th>
                        <th>SMS</th>
                        <th style={{ width: 150 }}>Configure</th>
                        <th style={{ width: 150 }}>Reset Configuration</th>
                        <th>Set for default calls</th>
                      </tr>
                    </thead>
                    <tbody>
                      {did &&
                        did.map((item) => {
                          return (
                            <tr>
                              <td style={{ cursor: "default" }}>{item.did}</td>
                              <td style={{ cursor: "default" }}>
                                {item?.e911}
                              </td>
                              <td style={{ cursor: "default" }}>
                                {item?.cnam}
                              </td>
                              <td style={{ cursor: "default" }}>{item?.sms}</td>
                              <td style={{ cursor: "default" }}>
                                <button
                                  onClick={() =>
                                    navigate(`/did-config`, { state: item })
                                  }
                                  className={item.configuration !== null ? "tableButton" : "tableButton warning"}
                                >
                                  <i className={item.configuration !== null ? "fa-solid fa-gear text-success" : "fa-solid fa-triangle-exclamation"}></i>
                                </button>
                                {/* <label
                                  className={item.configuration !== null ? "tableLabel success" : "tableLabel pending"}
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    navigate(`/did-config`, { state: item })
                                  }
                                >
                                  {item.configuration !== null
                                    ? "Update"
                                    : "Configure"}
                                </label> */}
                              </td>
                              <td style={{ cursor: "default" }}>
                                {" "}
                                {item.configuration !== null && (
                                  <button
                                    className="tableButton delete"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handleClick(item.configuration.id)
                                    }
                                  >
                                    <i class="fa-solid fa-arrows-rotate"></i>
                                  </button>
                                )}
                              </td>
                              <td style={{ cursor: "default" }}>
                                <label
                                  className={item.default_outbound === 1 ? "tableLabel success" : "tableLabel pending"}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (item.default_outbound === 0) {
                                      handleClickDefault(item.id)
                                    }
                                  }}
                                >
                                  {item.default_outbound === 0
                                    ? "Make Default"
                                    : "Default"}
                                </label>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default DidListing;
