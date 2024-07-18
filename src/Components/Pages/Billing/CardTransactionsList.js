import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import Header from "../../CommonComponents/Header";
import ContentLoader from "../Misc/ContentLoader";
import PaginationComponent from "../../CommonComponents/PaginationComponent";

function CardTransactionsList() {
  const [transaction, setTransaction] = useState();
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(
        `/payments/all?page=${pageNumber}`
      );
      if (apiData.status) {
        setLoading(false);
        setTransaction(apiData.data);
      } else {
        setLoading(false);
        navigate(-1);
      }
    }
    getData();
  }, [pageNumber]);
  console.log("This is page number", pageNumber);

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
  console.log("This is transition details", transaction);
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Card Transactions" />
            <div className="col-12" style={{ overflow: "auto" }}>
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
                    {transaction &&
                      transaction.data.map((item) => {
                        return (
                          <tr>
                            <td>{item.payment_details.name}</td>
                            <td>{item.payment_details.card_number}</td>
                            <td>{item.transaction_date.split(" ")[0]}</td>
                            <td>{item.transaction_id}</td>
                            <td>{item.amount_subtotal}</td>
                            <td>{item.description}</td>
                            <td>{item.transaction_type}</td>
                            <td
                              onClick={() =>
                                downloadImage(
                                  item.invoice_url,
                                  `${item.description}invoice`
                                )
                              }
                            >
                              <i className="fa-duotone fa-download text-success"></i>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {loading ? <ContentLoader /> : ""}
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
      </section>
    </main>
  );
}

export default CardTransactionsList;
