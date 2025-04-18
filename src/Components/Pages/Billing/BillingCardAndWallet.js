import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { backToTop, formatTimeWithAMPM, generalGetFunction } from '../../GlobalFunction/globalFunction';
import PaginationComponent from '../../CommonComponents/PaginationComponent';
import SkeletonTableLoader from '../../Loader/SkeletonTableLoader';
import EmptyPrompt from '../../Loader/EmptyPrompt';

const BillingCardAndWallet = () => {
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const navigate = useNavigate();
    const allCardTransactions = useSelector((state) => state.allCardTransactions);
    const allWaletTransactions = useSelector((state) => state.allWaletTransactions);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!allCardTransactions && !allWaletTransactions) {
            getAllPaymentsData();
            getWalletTransacData();
        }
    }, [pageNumber]);

    // Get All Payment Logs
    async function getAllPaymentsData() {
        setLoading(true);
        const apiData = await generalGetFunction(`/payments/all?page=${pageNumber}`);
        if (apiData?.status) {
            setLoading(false);
            dispatch({
                type: "SET_ALLCARDTRANSACTIONS",
                allCardTransactions: apiData.data,
            });
        } else {
            setLoading(false);
            navigate(-1);
        }
    }

    // Get All Wallet Transactions
    async function getWalletTransacData() {
        setLoading(true);
        const apiData = await generalGetFunction(
            `/transaction/wallet?page=${pageNumber}`
        );
        if (apiData?.status) {
            setLoading(false);
            dispatch({
                type: "SET_ALLWALLETTRANSACTIONS",
                allWaletTransactions: apiData.data,
            });
        } else {
            setLoading(false);
            navigate(-1);
        }
    }

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

    const handleRefresh = () => {
        getAllPaymentsData();
        getWalletTransacData();
    }

    return (
        <>
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Transactions" />

                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>All Transactions</h4>
                                                    <p>
                                                        You can see list of all transactions made using your
                                                        card & wallet
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
                                                        onClick={handleRefresh}
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
                                                            <th>Transaction ID</th>
                                                            <th>Transaction Type</th>
                                                            <th>Amount</th>
                                                            <th>Wallet Balance</th>
                                                            <th>Date</th>
                                                            <th>Time</th>
                                                            <th>Description</th>
                                                            <th className='text-center'>Download</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {loading ? <SkeletonTableLoader row={10} col={8} /> :
                                                            allCardTransactions && allCardTransactions?.data?.length > 0 ?
                                                                allCardTransactions.data.map((item, index) => {
                                                                    const walletChange = allWaletTransactions?.data?.filter((transac) => transac.payment_gateway_transaction_id === item.transaction_id);

                                                                    const getWalletTransac = () => {
                                                                        if (walletChange?.length > 0) {
                                                                            return {
                                                                                amount: walletChange[0]?.amount,
                                                                                type: walletChange[0]?.transaction_type
                                                                            }
                                                                        }
                                                                    }
                                                                    const walletTransac = getWalletTransac();

                                                                    const maskCard = () => {
                                                                        const cardNumber = item.payment_details.card_number;
                                                                        const last4 = cardNumber.slice(-4);
                                                                        const masked = last4.padStart(cardNumber.length, '*');
                                                                        return masked;
                                                                    }

                                                                    return (
                                                                        <tr key={index}>
                                                                            <td>{item?.transaction_id}</td>
                                                                            <td>
                                                                                <button class="badge badge-subtle badge-border border-0">
                                                                                    <i class="fa-duotone fa-regular fa-circle-dot"></i> <span className='ms-1 text-capitalize'>{item?.payment_method_options}</span>
                                                                                    <div className='card_info'>
                                                                                        <ul>
                                                                                            <li className='mb-1 '><span className=' text-muted '>Card Name : </span>{item?.payment_details?.fullname}</li>
                                                                                            <li className=''><span className=' text-muted '>Card Number : </span>{item?.payment_details?.card_number ? maskCard(item?.payment_details?.card_number) : ""}</li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </button>
                                                                            </td>
                                                                            <td>${item?.amount_total}</td>
                                                                            <td>{walletTransac && <span className={`badge badge-border text-${walletTransac?.type === 'credit' ? 'success' : 'danger'} bg-${walletTransac?.type === 'credit' ? 'success' : 'danger'}-subtle text-center`}>{walletTransac?.type === 'credit' ? '+' : '-'}{" "}{walletTransac?.amount || 'N/A'}</span>}</td>
                                                                            <td>{item?.transaction_date.split(" ")[0]}</td>
                                                                            <td>{formatTimeWithAMPM(item?.transaction_date?.split(" ")[1])}</td>
                                                                            <td>{item?.description}</td>
                                                                            <td className='text-center'>
                                                                                <button className='tableButton' onClick={() => downloadImage(item.invoice_url, `${item.description}invoice`)}>
                                                                                    <i class="fa-regular fa-download"></i>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                }) : <tr>
                                                                    <td colSpan={99}><EmptyPrompt generic={true} /></td>
                                                                </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="tableHeader mb-3">
                                                {allCardTransactions && allCardTransactions.data.length > 0 ? (
                                                    <PaginationComponent
                                                        pageNumber={(e) => setPageNumber(e)}
                                                        totalPage={allCardTransactions.last_page}
                                                        from={(pageNumber - 1) * allCardTransactions.per_page + 1}
                                                        to={allCardTransactions.to}
                                                        total={allCardTransactions.total}
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
        </>
    )
}

export default BillingCardAndWallet