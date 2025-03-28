import React,  { useState } from 'react'
import Header from '../../../CommonComponents/Header'
import { useNavigate } from 'react-router-dom';
import { backToTop } from '../../../GlobalFunction/globalFunction';

function LeadEdit() {
    const navigate = useNavigate();

    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    }
        return (
            <main className="mainContent">
                <section id="phonePage">
                    <div className="container-fluid">
                        <div className="row">
                            <Header title="Lead Manage" />
                            <div className="overviewTableWrapper">
                                <div className="overviewTableChild">
                                    <div className="d-flex flex-wrap">
                                        <div className="col-12">
                                            <div className="heading">
                                                <div className="content">
                                                    <h4>Lead Edit</h4>
                                                    <p>Manage the config of the lead</p>
                                                </div>
                                                <div className="buttonGroup">
                                                    <div className='d-flex align-items-center'>
                                                        <div className="formLabel py-0 me-2">
                                                            <label for="selectFormRow">Enabled</label>
                                                        </div>
                                                        <div className="my-auto position-relative mx-1">
                                                            <label className="switch">
                                                                <input
                                                                    type="checkbox"
                                                                    id="showAllCheck"
                                                                />
                                                                <span className="slider round" />
                                                            </label>
                                                        </div>
                                                    </div>
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
                                                        type="button"
                                                        className="panelButton"
                                                    >
                                                        <span className="text">Save</span>
                                                        <span className="icon">
                                                            <i className="fa-solid fa-floppy-disk"></i>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="col-12" style={{ padding: '25px 23px' }}>
                                            <form className="row mb-0">
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            First Name
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>

                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Last Name
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Phone Number
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="number"
                                                            className="formItem" />
                                                    </div>
                                                </div>

                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Address 1
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Address 2
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            City
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            State
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>

                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Country
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="text"
                                                            className="formItem" />
                                                    </div>
                                                </div>

                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Zip Code
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <input
                                                            type="number"
                                                            className="formItem" />
                                                    </div>
                                                </div>
                                                <div className="formRow col-xl-3">
                                                    <div className='formLabel'>
                                                        <label>
                                                            Gender
                                                        </label>
                                                    </div>
                                                    <div className='col-6'>
                                                        <select
                                                            name=""
                                                            id=""
                                                            className="formItem "
                                                        >
                                                            <option value="">Male</option>
                                                            <option value="">Female</option>
                                                            <option value="">Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </form>
                                            <div className='col-6'>
                                                <h3>
                                                    role and permission
                                                </h3>
                                                <div>
                                                    <div class="accordion" id="accordionExample">
                                                        <div class="accordion-item accordion-text ">
                                                            <h2 class="accordion-header" id="headingOnee">
                                                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOnee" aria-expanded="true" aria-controls="collapseOne">
                                                                    <div className='d-flex align-items-center justify-content-start'>
                                                                        <input type='checkbox' className='' />
                                                                        <label className='ms-2 rolebar'>Account</label>
                                                                    </div>
                                                                </button>
                                                            </h2>
                                                            <div id="collapseOnee" class="accordion-collapse collapse show" aria-labelledby="headingOnee" data-bs-parent="#accordionExample">
                                                                <div class="accordion-body">
                                                                    <div  className='m-3 collapse-card'>
                                                                        <p>

                                                                            <button className="btn btn-primary d-flex align-items-center justify-content-between w-100"
                                                                                type="button"
                                                                                onClick={handleToggle}
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target="#collapseExample"
                                                                                aria-expanded={isExpanded}
                                                                                aria-controls="collapseExample"> 
                                                                                User
                                                                                <div className='ms-3'><i className={`fas me-2 ${isExpanded ? "fa-plus" : "fa-minus"}`}></i></div>
                                                                            </button>
                                                                        </p>
                                                                        <div className="collapse collapse-border " id="collapseExample">
                                                                            <div class="card0 card-body0">
                                                                                <div className='accordion-text'>
                                                                                    <div className='d-flex align-items-center justify-content-between'>
                                                                                        <div className='d-flex align-items-center justify-content-start'>
                                                                                            <input type='checkbox' className='' />
                                                                                            <label class="formLabel ms-2 text-capitalize">VIEW</label>
                                                                                        </div>
                                                                                        <div className='d-flex align-items-center justify-content-start'>
                                                                                            <input type='checkbox' className='' />
                                                                                            <label class="formLabel ms-2 text-capitalize">Edit</label>
                                                                                        </div>
                                                                                        <div className='d-flex align-items-center justify-content-start'>
                                                                                            <input type='checkbox' className='' />
                                                                                            <label class="formLabel ms-2 text-capitalize">Delete</label>
                                                                                        </div>

                                                                                        <div className='d-flex align-items-center justify-content-start'>
                                                                                            <input type='checkbox' className='' />
                                                                                            <label class="formLabel ms-2 text-capitalize">Send</label>
                                                                                        </div>
                                                                                        <div className='d-flex align-items-center justify-content-start'>
                                                                                            <input type='checkbox' className='' />
                                                                                            <label class="formLabel ms-2 text-capitalize">Create</label>
                                                                                        </div>

                                                                                    </div>
                                                                                    <div></div>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div  className='m-3 collapse-card'> 
                                                                        <p >

                                                                            <button 
                                                                            className="btn btn-primary d-flex align-items-center justify-content-between w-100"
                                                                              type="button"
                                                                                onClick={handleToggle}
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target="#collapseExampleone"
                                                                                aria-expanded={isExpanded}
                                                                                aria-controls="collapseExampleone"> 
                                                                                Extension
                                                                                <div className='ms-3'><i className={`fas me-2 ${isExpanded ? "fa-plus" : "fa-minus"}`}></i></div>
                                                                            </button>
                                                                        </p>

                                                                        <div class="collapse collapse-border mb-2" id="collapseExampleone">
                                                                            <div class="card0 card-body0">
                                                                                <div className=''>
                                                                                    <div className='d-flex align-items-center justify-content-between'>
                                                                                        <div className='d-flex align-items-center justify-content-start'>
                                                                                            <input type='checkbox' className='' />
                                                                                            <label class="formLabel ms-2 text-capitalize">VIEW</label>
                                                                                        </div>
                                                                                        <div className='d-flex align-items-center justify-content-start'>
                                                                                            <input type='checkbox' className='' />
                                                                                            <label class="formLabel ms-2 text-capitalize">Edit</label>
                                                                                        </div>
                                                                                        <div className='d-flex align-items-center justify-content-start'>
                                                                                            <input type='checkbox' className='' />
                                                                                            <label class="formLabel ms-2 text-capitalize">Delete</label>
                                                                                        </div>

                                                                                        <div className='d-flex align-items-center justify-content-start'>
                                                                                            <input type='checkbox' className='' />
                                                                                            <label class="formLabel ms-2 text-capitalize">Send</label>
                                                                                        </div>
                                                                                        <div className='d-flex align-items-center justify-content-start'>
                                                                                            <input type='checkbox' className='' />
                                                                                            <label class="formLabel ms-2 text-capitalize">Create</label>
                                                                                        </div>

                                                                                    </div>
                                                                                    <div></div>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                        <div   className='m-3 collapse-card'>
                                                                            <p>

                                                                                <button className="btn btn-primary d-flex align-items-center justify-content-between w-100"
                                                                              type="button"
                                                                                onClick={handleToggle}
                                                                                data-bs-toggle="collapse"
                                                                                data-bs-target="#collapseExampletwo"
                                                                                aria-expanded={isExpanded}
                                                                                aria-controls="collapseExampletwo"> 
                                                                            Role And Permission
                                                                                <div className='ms-3'><i className={`fas me-2 ${isExpanded ? "fa-plus" : "fa-minus"}`}></i></div>
                                                                                </button>
                                                                            </p>

                                                                            <div class="collapse collapse-border" id="collapseExampletwo">
                                                                                <div class="card0 card-body0">
                                                                                    <div className='accordion-text'>
                                                                                        <div className='d-flex align-items-center justify-content-between'>
                                                                                            <div className='d-flex align-items-center justify-content-start'>
                                                                                                <input type='checkbox' className='' />
                                                                                                <label class="formLabel ms-2 text-capitalize">VIEW</label>
                                                                                            </div>
                                                                                            <div className='d-flex align-items-center justify-content-start'>
                                                                                                <input type='checkbox' className='' />
                                                                                                <label class="formLabel ms-2 text-capitalize">Edit</label>
                                                                                            </div>
                                                                                            <div className='d-flex align-items-center justify-content-start'>
                                                                                                <input type='checkbox' className='' />
                                                                                                <label class="formLabel ms-2 text-capitalize">Delete</label>
                                                                                            </div>

                                                                                            <div className='d-flex align-items-center justify-content-start'>
                                                                                                <input type='checkbox' className='' />
                                                                                                <label class="formLabel ms-2 text-capitalize">Send</label>
                                                                                            </div>
                                                                                            <div className='d-flex align-items-center justify-content-start'>
                                                                                                <input type='checkbox' className='' />
                                                                                                <label class="formLabel ms-2 text-capitalize">Create</label>
                                                                                            </div>

                                                                                        </div>
                                                                                        <div></div>

                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                              
                                                            </div>
                                                        </div>
                                                        <div class="accordion-item">
                                                            <h2 class="accordion-header" id="headingTwo">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                                    Accordion Item #2
                                                                </button>
                                                            </h2>
                                                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                                                <div class="accordion-body">
                                                                    <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="accordion-item">
                                                            <h2 class="accordion-header" id="headingThree">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                                    Accordion Item #3
                                                                </button>
                                                            </h2>
                                                            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                                                <div class="accordion-body">
                                                                    <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main >
        )
    }

    export default LeadEdit