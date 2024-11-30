import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { featureUnderdevelopment, generalGetFunction } from '../../GlobalFunction/globalFunction';
import { useNavigate } from 'react-router-dom';

function Email() {
    const sessions = useSelector((state) => state.sessions);
    const account = useSelector((state) => state.account);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    async function logOut() {
        const apiData = await generalGetFunction("/logout");
        localStorage.clear();
        if (apiData?.data) {
            localStorage.clear();
            dispatch({
                action: "SET_ACCOUNT",
                account: null,
            });
            navigate("/");
        }
    }
    return (
        <>
            <main
                className="mainContentApp"
                style={{
                    marginRight:
                        sessions.length > 0 && Object.keys(sessions).length > 0
                            ? "250px"
                            : "0",
                }}
            >
                <section className="callPage">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12 ps-xl-0">
                                <div className="newHeader">
                                    <div className="col-auto" style={{ padding: '0 10px' }}>
                                        <h3 style={{ fontFamily: "Outfit", marginBottom: '0' }}>
                                            <button class="clearButton text-dark" ><i class="fa-solid fa-chevron-left fs-4"></i></button> E-Mail{" "}
                                            <button class="clearButton">
                                                <i
                                                    class="fa-regular fa-arrows-rotate fs-5"
                                                    style={{ color: "var(--webUtilGray)" }}
                                                    onClick={() => featureUnderdevelopment()}
                                                ></i>
                                            </button>
                                        </h3>
                                    </div>
                                    <div className="d-flex justify-content-end align-items-center">
                                        <div className="col-9">
                                            <input type="search" name="Search" placeholder="Search users, groups or chat" class="formItem fw-normal" style={{ backgroundColor: 'var(--searchBg)' }} onChange={() => featureUnderdevelopment()} />
                                        </div>
                                        <div className="col-auto mx-2">
                                            <button
                                                className="clearButton2 xl"
                                                effect="ripple"
                                                onClick={() => featureUnderdevelopment()}
                                            >
                                                <i className="fa-regular fa-bell" />
                                            </button>
                                        </div>
                                        <div className="col-auto">
                                            <div class="dropdown">
                                                <div className="myProfileWidget" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <div class="profileHolder" id="profileOnlineNav">
                                                        <img src="https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg" alt="profile" />
                                                    </div>
                                                    <div class="profileName">{account.username} <span className="status">Available</span></div>
                                                </div>
                                                <ul class="dropdown-menu" onClick={logOut}>
                                                    <li><div class="dropdown-item" style={{ cursor: 'pointer' }} >Logout</div></li>
                                                </ul>
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

export default Email