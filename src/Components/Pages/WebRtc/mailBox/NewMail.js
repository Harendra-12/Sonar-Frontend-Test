import React from 'react'

const NewMail = ({ handleShowNewMail, handleListingClick, handleMailReplay }) => {
    return (
        <>
            <div className="read_message">
                <div className="card shadow-none rounded-3" style={{ borderColor: "var(--me-border1)", }}>
                    <div className="card-header" style={{ borderColor: "var(--me-border1)", }}>
                        <div className="d-flex align-items-center gap-3">
                            <button className="back_pev" onClick={handleListingClick}><i class="fa-solid fa-arrow-left"></i></button>
                            <div className='d-flex justify-content-between align-items-center w-100'>
                                <div className="d-flex align-items-center">
                                    {/* <div className="tableProfilePicHolder">
                                                <img
                                                    src={require('../../../assets/images/placeholder-image.webp')}
                                                />
                                            </div> */}
                                    <div className="ms-3 ">
                                        <p className="text_dark mb-0">Compose Mail</p>
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
                                                <i class="fa-duotone fa-light fa-star me-2"></i> Starred
                                            </button>
                                        </li>

                                        <li className='mailList_menu'>
                                            <button className="dropdown-item text-danger" >
                                                <i class="fa-duotone fa-solid fa-trash me-2 "></i> Deleted
                                            </button>
                                        </li>

                                    </ul>

                                </div>
                            </div>
                        </div>
                        <div className="mailBox_body p-3">

                            <form>
                                <div className="row ">
                                    <div className=" col-12">
                                        <div className="from-group">
                                            <label htmlFor="" className="from-label">Form</label>
                                            <select
                                                type="text"
                                                name="extension"
                                                className="formItem"
                                            >
                                                <option value={"test12@gmail.com"}>test12@gmail.com</option>
                                                <option value={"text22@gmail.com"}>text22@gmail.com</option>
                                                <option value={"test11@gmail.com"}>test11@gmail.com</option>
                                                <option value={"test15@gmail.com"}>test15@gmail.com</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className=" col-12">
                                        <div className="from-group">
                                            <label htmlFor="" className="from-label">To</label>
                                            <select
                                                type="text"
                                                name="extension"
                                                className="formItem"
                                            >
                                                <option value={"test12@gmail.com"}>test12@gmail.com</option>
                                                <option value={"text22@gmail.com"}>text22@gmail.com</option>
                                                <option value={"test11@gmail.com"}>test11@gmail.com</option>
                                                <option value={"test15@gmail.com"}>test15@gmail.com</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className=" col-12">
                                        <div className="from-group">
                                            <label htmlFor="" className="from-label">CC</label>
                                            <select
                                                type="text"
                                                name="extension"
                                                className="formItem"
                                            >
                                                <option value={"test12@gmail.com"}>test12@gmail.com</option>
                                                <option value={"text22@gmail.com"}>text22@gmail.com</option>
                                                <option value={"test11@gmail.com"}>test11@gmail.com</option>
                                                <option value={"test15@gmail.com"}>test15@gmail.com</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className=" col-12">
                                        <div className="from-group">
                                            <label htmlFor="" className="from-label">Subjects</label>
                                            <input type="text" name="subjects" class="formItem" value="" />
                                        </div>
                                    </div>
                                    <div className=" col-12">
                                        <div className="textBox position-relative">
                                            <textarea
                                                type="text"
                                                name=""
                                                rows={15}
                                                className="formItem h-auto"
                                                placeholder="Please enter your message"

                                            />
                                            <div className="footerSms">
                                                <div class="custom_fileWrap">
                                                    <label for="file" class="custom_file">
                                                        <i class="fa-solid fa-paperclip"></i>
                                                    </label>
                                                    <input id="file" type="file" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                  
                                </div>
                            </form>
                        </div>
                          <div className='mb-3'>
                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                className="panelButton m-0"
                                               
                                            >
                                                <span className="text">Send</span>
                                                <span className="icon">
                                                    <i className="fa-solid fa-check"></i>
                                                </span>
                                            </button>
                                            <button
                                                className="panelButton gray m-0 float-end"
                                               
                                            >
                                                <span className="text">Cancel</span>
                                                <span className="icon">
                                                    <i className="fa-solid fa-xmark"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewMail