import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { Link, useNavigate } from "react-router-dom";
import {
  backToTop,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";

function WalletTransactionsList() {
  const [transaction, setTransaction] = useState();
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/transaction/wallet?page=${pageNumber}`);
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
            <Header title="Wallet Transactions" />
            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>Descriptor</th>
                      <th>Transaction Type</th>
                      <th>Payment Date</th>
                      <th>Transaction ID</th>
                      <th>Transaction Amount</th>
                      <th>Download</th>
                    </tr>
                  </thead>
                  <tbody>

                        {transaction && transaction.data.map((item)=>{
                            return(
                                <tr>
                                <td>{item.descriptor}</td>
                                <td>{item.transaction_type}</td>
                                <td>{item.created_at.split("T")[0]}</td>
                                <td>{item.payment_gateway_transaction_id}</td>
                                <td>${item.amount}</td>
                                <td  onClick={() =>
                                              downloadImage(
                                                item.invoice_url,
                                                `${item.descriptor}invoice`
                                              )
                                            }>
                                  <i className="fa-duotone fa-download text-success"></i>
                                </td>
                              </tr>
                            )
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

export default WalletTransactionsList;
