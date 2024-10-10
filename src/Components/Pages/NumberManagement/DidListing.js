import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import { useNavigate, Link } from "react-router-dom";
import {
  backToTop,
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";
import { useDispatch, useSelector } from "react-redux";

function DidListing() {
  const [did, setDid] = useState();
  const [loading, setLoading] = useState(true);
  // const [pageNumber, setPageNumber] = useState(1);
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
                    Back
                  </button>
                  <Link to="/did-add" effect="ripple" className="panelButton">
                    Add
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
                        {/* <th>Payment Date</th>
                        <th>Transaction Amount</th> */}
                        <th>E911</th>
                        <th>Cname</th>
                        <th>SMS</th>
                        <th style={{ width: 150 }}>Configure</th>
                        <th style={{ width: 150 }}>Reset Configuration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {did &&
                        did.map((item) => {
                          return (
                            <tr>
                              <td style={{ cursor: "default" }}>{item.did}</td>
                              {/* <td style={{ cursor: "default" }}>{item.created_at.split("T")[0]}</td>
                              <td style={{ cursor: "default" }}>${item.price}</td> */}
                              <td style={{ cursor: "default" }}>
                                {item?.e911}
                              </td>
                              <td style={{ cursor: "default" }}>
                                {item?.cnam}
                              </td>
                              <td style={{ cursor: "default" }}>{item?.sms}</td>
                              {/* <td onClick={() => navigate(item.dialplan?"/destination-edit":"/destination-add",{ state: { state: item.dialplan ? item.dialplan : item, did: item.did } })}>Configure</td> */}
                              {/* <td onClick={()=>navigate(`/did-config?did_id=${item.did}`)}>Configure</td> */}
                              <td style={{ cursor: "default" }}>
                                <label
                                  className={item.configuration !== null ? "tableLabel success" : "tableLabel pending"}
                                  style={{ cursor: "pointer" }}
                                  onClick={() =>
                                    navigate(`/did-config`, { state: item })
                                  }
                                >
                                  {item.configuration !== null
                                    ? "Update"
                                    : "Configure"}
                                </label>
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
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* {did && did.data.length > 0 ? (
            <PaginationComponent
              pageNumber={(e) => setPageNumber(e)}
              totalPage={did.last_page}
              from={(pageNumber - 1) * did.per_page + 1}
              to={did.to}
              total={did.total}
            />
          ) : (
            ""
          )} */}
        </div>
      </section>
    </main>
  );
}

export default DidListing;
