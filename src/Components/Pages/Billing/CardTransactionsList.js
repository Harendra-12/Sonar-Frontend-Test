/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { useDispatch, useSelector } from "react-redux";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";

function CardTransactionsList() {
  const [transaction, setTransaction] = useState();
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();
  const allCardTransactions = useSelector((state) => state.allCardTransactions);
  const dispatch = useDispatch();
  const [refreshState, setRefreshState] = useState(false);

  useEffect(() => {
    if (allCardTransactions && !refreshState) {
      setTransaction(allCardTransactions);
      setLoading(false);
    } else {
      setLoading(true);
      async function getData() {
        const apiData = await generalGetFunction(
          `/payments/all?page=${pageNumber}`
        );
        if (apiData?.status) {
          setLoading(false);
          setTransaction(apiData.data);
          dispatch({
            type: "SET_ALLCARDTRANSACTIONS",
            allCardTransactions: apiData.data,
          });
          setRefreshState(false);
        } else {
          setLoading(false);
          navigate(-1);
          setRefreshState(false);
        }
      }
      getData();
    }
  }, [pageNumber, refreshState]);

  //   Handle download invoice
  const downloadImage = async (imageUrl, fileName) => {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };
  return (
    <main className="mainContent">
      <section id="phonePage">
            <Header title="Card Transactions" />
        <div className="container-fluid">
          <div className="row">

            <div className="overviewTableWrapper">
              <div className="overviewTableChild">
                <div className="d-flex flex-wrap">
                  <div className="col-12">
                    <div className="heading">
                      <div className="content">
                        <h4>Card Transactions</h4>
                        <p>
                          You can see list of all transactions made using your
                          card
                        </p>
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
                            <i className="fa-solid fa-caret-left"></i>
                          </span>
                        </button>
                        <button
                          effect="ripple"
                          className="panelButton"
                          // onClick={() => featureUnderdevelopment()}
                          onClick={() => setRefreshState(true)}
                        >
                          <span className="text">Refresh</span>
                          <span className="icon">
                            <i
                              className={`${loading
                                ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                : "fa-regular fa-arrows-rotate fs-5 "
                                } `}
                            ></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-12"
                    style={{ overflow: "auto", padding: "10px 20px 0" }}
                  >
                    <div className="tableContainer">
                      <table>
                        <thead>
                          <tr>
                            <th>Card Holder's Name</th>
                            <th>Card Number</th>
                            <th>Payment Date</th>
                            <th>Transaction ID</th>
                            <th>Transaction Amount</th>
                            <th>Description</th>
                            <th>Type</th>
                            <th>Download</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading ? (<SkeletonTableLoader col={8} row={15} />) :
                            (<>
                              {transaction &&
                                transaction?.data?.map((item) => {
                                  return (
                                    <tr>
                                      <td>{item?.payment_details?.name}</td>
                                      <td>{item?.payment_details?.card_number}</td>
                                      <td>
                                        {item?.transaction_date?.split(" ")[0]}
                                      </td>
                                      <td>{item?.transaction_id}</td>
                                      <td>
                                        <label
                                          className={
                                            item?.transaction_type === "credit"
                                              ? "tableLabel success"
                                              : "tableLabel fail"
                                          }
                                        >
                                          ${item?.amount_subtotal}
                                        </label>
                                      </td>
                                      <td>{item?.description}</td>
                                      <td>
                                        <i
                                          className={
                                            item?.transaction_type === "credit"
                                              ? "fa-duotone fa-circle-up text-success me-1"
                                              : "fa-duotone fa-circle-down text-danger me-1"
                                          }
                                        ></i>{" "}
                                        {item?.transaction_type === "credit"
                                          ? "Credit"
                                          : "Debit"}
                                      </td>
                                      <td>
                                        <button
                                          className="tableButton blue"
                                          onClick={() =>
                                            downloadImage(
                                              item.invoice_url,
                                              `${item.description}invoice`
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-download"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </>)}
                        </tbody>
                      </table>
                    </div>
                    <div className="tableHeader mb-3">
                      {transaction && transaction.data.length > 0 ? (
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={transaction.last_page}
                          from={(pageNumber - 1) * transaction.per_page + 1}
                          to={transaction.to}
                          total={transaction.total}
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
}

export default CardTransactionsList;
