import React from 'react'
import { Link } from 'react-router-dom'

const MailReply = () => {

    const [showResults, setShowResults] = React.useState(false)
    const onClick = () => setShowResults(true)

    return (
        <>
            <div className="read_message">
                <div className="card shadow-none rounded-3">
                    <div className="card-header">
                        <div className="d-flex align-items-center gap-3">
                            <button className="back_pev"><i class="fa-solid fa-arrow-left"></i></button>
                            <div className='d-flex justify-content-between align-items-center w-100'>
                                <div className="d-flex align-items-center">
                                    <div className="tableProfilePicHolder">
                                        <img
                                            src={require('../../../assets/images/placeholder-image.webp')}
                                        />
                                    </div>
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
                                                <li>
                                                    <button className="dropdown-item">
                                                  <i class="fa-duotone fa-light fa-star me-2"></i> Starred
                                                    </button>
                                                </li>
                                                
                                                <li>
                                                    <button className="dropdown-item" >
                                                   <i class="fa-duotone fa-solid fa-trash me-2"></i> Deleted
                                                    </button>
                                                </li>
                                       
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="mailBox_body p-3">
                        <div className="mail_header">
                            <p class="fs-20 fw-semibold mb-0 text_dark">History of planets are discovered yesterday.</p>
                            <div class="float-end"> <span class="me-2 fs-12 text-muted">April-19-2025,03:05PM</span> </div>
                        </div>

                        <div class="main-mail-content mb-4 mt-5">
                            <p class="fs-14 fw-semibold mb-4 text_dark">Hi, Json Taylor Greetings 🖐</p>
                            <p class="mb-2 fs-12 text_gray">Earth, our home, is the third planet from the sun. While scientists continue to hunt for clues of life beyond Earth, our home planet remains the only place in the universe where we've ever identified living organisms. .</p>
                            <p class="mb-2 fs-12 text_gray">Earth has a diameter of roughly 8,000 miles (13,000 kilometers) and is mostly round because gravity generally pulls matter into a ball. But the spin of our home planet causes it to be squashed at its poles and swollen at the equator, making the true shape of the Earth an "oblate spheroid.".</p>
                            <p class="mb-0 mt-4 text_dark"> <span class="d-block ">Regards,</span> <span class="d-block">Michael Jeremy</span> </p>
                            <div class="mail-attachments mb-4 mt-5">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="mb-0"> <span class="fs-14 fw-semibold text_dark"><i class="fa-solid fa-paperclip me-3"></i>Attachments (1.8mb):</span> </div>
                                    <div> <button type="button" class="btn btn-sm btn-success-light">Download All</button> </div>
                                </div>
                                <div class="mt-2 d-flex flex-wrap">
                                    <Link to="" class="mail-attachment border mb-1 text-decoration-none">
                                        <div class="attachment-icon">
                                            <img
                                                src={require('../../../assets/images/file.webp')}
                                            />
                                        </div>
                                        <div class="lh-1">
                                            <p class="mb-1 attachment-name text-truncate"> Earth_Archeology_2.21-4.pdf </p>
                                            <p class="mb-0 fs-11 text_gray"> 0.85MB </p>
                                        </div>
                                    </Link>
                                    <Link to="" class="mail-attachment ms-2 border mb-1 text-decoration-none">
                                        <div class="attachment-icon">
                                            <img
                                                src={require('../../../assets/images/jpg.webp')}
                                            />
                                        </div>
                                        <div class="lh-1">
                                            <p class="mb-1 attachment-name text-truncate"> Planets_Image.Jpeg </p>
                                            <p class="mb-0 fs-6 text_gray"> 457KB </p>
                                        </div>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mail-info-footer p-2 position-relative">
                        {showResults ? (
                            <div className="text_message">
                                <textarea
                                    type="text"
                                    name=""
                                    className="mail_input"
                                    placeholder="Please enter your message"

                                />
                            </div>
                        ) : null}
                        <div class="mail-info-footer d-flex flex-wrap gap-2 align-items-center justify-content-between p-2 position-relative">

                            <div>
                                <button class="btn btn-icon btn-light" >
                                    <i class="fa-solid fa-paperclip"></i>
                                </button>

                            </div>
                            <div>
                                <button class="btn btn-secondary">
                                    <i class="fa-regular fa-share me-2"></i>Forward
                                </button>
                                <button class="btn btn-danger ms-1" onClick={onClick}>
                                    <i class="fa-regular fa-reply-all me-2"></i>Reply All
                                </button>
                                {showResults ? (
                                    <button class="btn btn-success ms-1" onClick={onClick}>
                                        <i class="fa-duotone fa-solid fa-paper-plane-top me-2"></i>Send
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