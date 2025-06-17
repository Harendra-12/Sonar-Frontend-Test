import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const MailReply = ({ handleShowNewMail, handleListingClick, handleMailReplay }) => {

    const navigate = useNavigate();
    const [showResults, setShowResults] = React.useState(false)
    const onClick = () => setShowResults(true)

    return (
        <>
            <div className="read_message">
                <div className="card shadow-none rounded-3" style={{ borderColor: "var(--me-border1)", }}>
                    <div className="card-header" style={{ borderColor: "var(--me-border1)", }}>
                        <div className="d-flex align-items-center gap-3">
                            <button className="back_pev" onClick={handleListingClick}><i className="fa-solid fa-arrow-left"></i></button>
                            <div className='d-flex justify-content-between align-items-center w-100'>
                                <div className="d-flex align-items-center">
                                    {/* <div className="tableProfilePicHolder">
                                        <img
                                            src={require('../../../assets/images/placeholder-image.webp')}
                                        />
                                    </div> */}
                                    <div className="ms-3 ">
                                        <p className="text_dark mb-0">test250</p>
                                        <p className="mb-0 text_gray">To: nathan@themenate.com</p>
                                    </div>
                                </div>
                                <div className="dropdown">
                                    <button
                                        className="clearButton2"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="true"
                                    >
                                        <i className="fa-solid fa-ellipsis-vertical" />
                                    </button>
                                    <ul
                                        className="dropdown-menu light"
                                    >
                                        {/* {
                                            item.is_admin ? */}
                                        <li className='mailList_menu'>
                                            <button className="dropdown-item">
                                                <i className="fa-duotone fa-light fa-star me-2"></i> Starred
                                            </button>
                                        </li>

                                        <li className='mailList_menu'>
                                            <button className="dropdown-item text-danger" >
                                                <i className="fa-duotone fa-solid fa-trash me-2 "></i> Deleted
                                            </button>
                                        </li>

                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="mailBox_body p-3">
                        <div className="mail_header">
                            <p className="fs-20 fw-semibold mb-0 text_dark">History of planets are discovered yesterday.</p>
                            <div className="float-end"> <span className="me-2 fs-12 text_gray">April-19-2025,03:05PM</span> </div>
                        </div>

                        <div className="main-mail-content mb-4 mt-5">
                            <p className="fs-14 fw-semibold mb-4 text_dark">Hi, Json Taylor Greetings 🖐</p>
                            <p className="mb-2 fs-12 text_gray">Earth, our home, is the third planet from the sun. While scientists continue to hunt for clues of life beyond Earth, our home planet remains the only place in the universe where we've ever identified living organisms. .</p>
                            <p className="mb-2 fs-12 text_gray">Earth has a diameter of roughly 8,000 miles (13,000 kilometers) and is mostly round because gravity generally pulls matter into a ball. But the spin of our home planet causes it to be squashed at its poles and swollen at the equator, making the true shape of the Earth an "oblate spheroid.".</p>
                            <p className="mb-0 mt-4 text_dark"> <span className="d-block ">Regards,</span> <span className="d-block">Michael Jeremy</span> </p>
                            <div className="mail-attachments mb-4 mt-5">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="mb-0"> <span className="fs-14 fw-semibold text_dark"><i className="fa-solid fa-paperclip me-3"></i>Attachments (1.8mb):</span> </div>
                                    <div> <button type="button" className="btn btn-sm btn-success-light">Download All</button> </div>
                                </div>
                                <div className="mt-2 d-flex flex-wrap">
                                    <Link to="" className="mail-attachment border mb-1 text-decoration-none">
                                        <div className="attachment-icon">
                                            <img
                                                src={require('../../../assets/images/file.webp')}
                                            />
                                        </div>
                                        <div className="lh-1">
                                            <p className="mb-1 attachment-name text-truncate"> Earth_Archeology_2.21-4.pdf </p>
                                            <p className="mb-0 fs-11 text_gray"> 0.85MB </p>
                                        </div>
                                    </Link>
                                    <Link to="" className="mail-attachment ms-2 border mb-1 text-decoration-none">
                                        <div className="attachment-icon">
                                            <img
                                                src={require('../../../assets/images/jpg.webp')}
                                            />
                                        </div>
                                        <div className="lh-1">
                                            <p className="mb-1 attachment-name text-truncate"> Planets_Image.Jpeg </p>
                                            <p className="mb-0 fs-6 text_gray"> 457KB </p>
                                        </div>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mail-info-footer p-2 position-relative">
                        {showResults ? (
                            <div className="text_message">
                                <textarea
                                    type="text"
                                    name=""
                                    className="mail_input formItem "
                                    placeholder="Please enter your message"

                                />
                            </div>
                        ) : null}
                        <div className=" d-flex flex-wrap gap-2 align-items-center justify-content-between p-2 position-relative">

                            <div className="custom_fileWrap">

                                <label htmlFor="file" className="custom_file">
                                    <i className="fa-solid fa-paperclip"></i>
                                </label>
                                <input id="file" type="file" />
                            </div>

                            <div>
                                <button className="btn btn-info">
                                    <i className="fa-regular fa-share me-2"></i>Forward
                                </button>
                                <button className="btn btn-success ms-1" onClick={onClick}>
                                    <i className="fa-regular fa-reply-all me-2"></i>Reply All
                                </button>
                                {showResults ? (
                                    <button className="btn btn-primary ms-1" onClick={onClick}>
                                        <i className="fa-duotone fa-solid fa-paper-plane-top me-2"></i>Send
                                    </button>
                                ) : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MailReply