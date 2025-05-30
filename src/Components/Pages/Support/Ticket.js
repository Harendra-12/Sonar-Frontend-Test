import React, { useEffect, useState } from 'react'
import Header from '../../CommonComponents/Header'
import { useNavigate } from 'react-router-dom'
import ThreeDotedLoader from '../../Loader/ThreeDotedLoader';
import { featureUnderdevelopment, generalDeleteFunction, generalGetFunction, generalPostFunction, generalPutFunction } from '../../GlobalFunction/globalFunction';
import { toast } from 'react-toastify';
import PromptFunctionPopup from '../../CommonComponents/PromptFunctionPopup';
import PaginationComponent from '../../CommonComponents/PaginationComponent';
import EmptyPrompt from '../../Loader/EmptyPrompt';
import { useSelector } from 'react-redux';
import ErrorMessage from '../../CommonComponents/ErrorMessage';
import { useForm } from 'react-hook-form';
import { requiredValidator } from '../../validations/validation';
import CircularLoader from '../../Loader/CircularLoader';


function Ticket() {
  const navigate = useNavigate();
  const [createTicketPopup, setCreateTicketPopup] = useState(false);
  const [refreshState, setRefreshState] = useState(false);
  const [allTickets, setAllTickets] = useState([]);
  const [allClosedTickets, setAllClosedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { confirm, ModalComponent } = PromptFunctionPopup();
  const [pageNumber, setPageNumber] = useState();
  const accountDetails = useSelector((state) => state.accountDetails);

  useEffect(() => {
    getAllTickets();
    getAllClosedTickets();
  }, [])

  const getAllTickets = async () => {
    setLoading(true);
    try {
      const apiCall = await generalGetFunction('/ticket/all');
      if (apiCall.status) {
        setAllTickets(apiCall.data);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(apiCall.message);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const handleCloseTicket = async (id) => {
    const userConfirmed = await confirm();
    if (userConfirmed) {
      setLoading(true);
      try {
        const apiCall = await generalPutFunction(`/ticket/update-status/${id}`);
        if (apiCall.status) {
          setLoading(false);
          toast.success(apiCall.message);
          getAllTickets();
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  const getAllClosedTickets = async () => {
    setLoading(true);
    try {
      const apiCall = await generalGetFunction('/ticket/closed-ticket');
      if (apiCall.status) {
        setAllClosedTickets(apiCall.data);
        setLoading(false);
      } else {
        setLoading(false);
        toast.error(apiCall.message);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const refreshApiCall = () => {
    getAllTickets();
    getAllClosedTickets();
  }

  return (
    <>
      <main className='mainContent'>
        <section className="campaignPage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Dialer" />
              <div className='overviewTableWrapper'>
                <div className='overviewTableChild'>
                  <div className='d-flex flex-wrap'>
                    <div className="col-12">
                      <div className="heading mb-0">
                        <div className="content">
                          <h4>Ticket {" "}
                            <button
                              className="clearButton"
                              onClick={refreshApiCall}
                            >
                              <i
                                className={
                                  loading
                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    : "fa-regular fa-arrows-rotate fs-5"
                                }
                              ></i>
                            </button>
                          </h4>
                          <p>You can Create ticket of users </p>
                        </div>
                        <div className="buttonGroup">
                          <button className="panelButton gray" >
                            <span className="text">Back</span>
                            <span className="icon"><i className="fa-solid fa-caret-left"></i></span>
                          </button>
                          <button className="panelButton" onClick={() => setCreateTicketPopup(true)}>
                            <span className="text">Create</span>
                            <span className="icon"><i className="fa-solid fa-plus"></i></span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-12' style={{ overflow: 'auto', padding: '25px 20px 0px' }}>
                      <nav className="tangoNavs">
                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                          <button
                            className="nav-link active"
                            id="nav-user-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-user"
                            type="button"
                            role="tab"
                            aria-controls="nav-user"
                            aria-selected="true"
                          >
                            Open Ticket
                          </button>
                          <button
                            className="nav-link"
                            id="nav-exten-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-exten"
                            type="button"
                            role="tab"
                            aria-controls="nav-exten"
                            aria-selected="false"
                          >
                            Close Ticket
                          </button>
                        </div>
                      </nav>
                      <div
                        className="tab-content"
                        id="nav-tabContent"
                        style={{
                          border: "1px solid var(--border-color)",
                          borderTop: "none",
                          borderRadius: "0 0 5px 5px",
                        }} >

                        <div
                          className="tab-pane fade show active"
                          id="nav-user"
                          role="tabpanel"
                          aria-labelledby="nav-user-tab"
                          tabindex="0" >

                          <div
                            className="col-12"
                            style={{ overflow: "auto", padding: "10px 20px 0" }}
                          >
                            {/* <div className="tableHeader">
                              <div className="showEntries">
                                <label>Show</label>
                                <select
                                  className="formItem"
                                >
                                  <option value={10}>10</option>
                                  <option value={20}>20</option>
                                  <option value={30}>30</option>
                                </select>
                                <label>entries</label>
                              </div>

                              <div className="searchBox">
                                <label>Search:</label>
                                <input
                                  type="search"
                                  className="formItem"
                                />
                              </div>
                            </div> */}
                            <div className="tableContainer">
                              {loading ? <ThreeDotedLoader /> :
                                <table>
                                  <thead>
                                    <tr>
                                      <th style={{ width: '20px' }}>#</th>
                                      <th>Time stamp</th>
                                      <th>Department</th>
                                      <th>Query Type</th>
                                      <th>Subject</th>
                                      <th>Username</th>
                                      <th>Status</th>
                                      <th className='text-center'>View Message</th>
                                      <th className='text-center'>Close Ticket</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {allTickets && allTickets?.data?.length > 0 ? allTickets?.data?.map((item, index) => {
                                      return (
                                        <tr>
                                          <td style={{ width: '20px' }}>{index + 1}</td>
                                          <td>{item.created_at.split('T')[0]}, {new Date(item.created_at).toLocaleTimeString()}</td>
                                          <td>{item.department}</td>
                                          <td>{item.query_type}</td>
                                          <td>{item.title}</td>
                                          <td>{accountDetails.users.find((acc) => acc.id == item.created_by).username}</td>
                                          <td>
                                            <div>
                                              <label className={`tableLabel ${item.status == 'open' ? 'success' : 'fail'}`} style={{ textTransform: 'capitalize' }}>{item.status}</label>
                                            </div>
                                          </td>
                                          <td>
                                            <div className=''>
                                              <button
                                                className="tableButton edit mx-auto"
                                                onClick={() => navigate('/live-chat', {
                                                  state: item.id,
                                                })}
                                              >
                                                <i className="fa-regular fa-eye"></i>
                                              </button>
                                            </div>
                                          </td>
                                          <td>
                                            <div className='d-flex align-items-center justify-content-start'>
                                              <button
                                                className="tableButton delete me-12 mx-auto"
                                                onClick={() => handleCloseTicket(item.id)}
                                              >
                                                <i className="fa-solid fa-x"></i>
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      )
                                    }) : <tr><td colSpan={99}><EmptyPrompt generic={true} /></td></tr>}
                                  </tbody>
                                </table>
                              }
                            </div>
                            <div className="tableHeader mb-3">
                              <PaginationComponent
                                pageNumber={(e) => setPageNumber(e)}
                                totalPage={allTickets?.last_page}
                                from={allTickets?.from}
                                to={allTickets?.to}
                                total={allTickets?.total}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="nav-exten"
                          role="tabpanel"
                          aria-labelledby="nav-exten-tab"
                          tabindex="0"
                        >
                          <div
                            className="col-12"
                            style={{ overflow: "auto", padding: "10px 20px 0" }}
                          >
                            {/* <div className="tableHeader">
                              <div className="showEntries">
                                <label>Show</label>
                                <select
                                  className="formItem"
                                >
                                  <option value={10}>10</option>
                                  <option value={20}>20</option>
                                  <option value={30}>30</option>
                                </select>
                                <label>entries</label>
                              </div>

                              <div className="searchBox">
                                <label>Search:</label>
                                <input
                                  type="search"
                                  className="formItem"
                                />
                              </div>
                            </div> */}
                            <div className="tableContainer">
                              <table>
                                <thead>
                                  <tr>
                                    <th style={{ width: '20px' }}>#</th>
                                    <th>Time stamp</th>
                                    <th>Department</th>
                                    <th>Query Type</th>
                                    <th>Subject</th>
                                    <th>Username</th>
                                    <th>Status</th>
                                    <th className='text-center'>View Message</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allClosedTickets && allClosedTickets?.data?.length > 0 ? allClosedTickets?.data?.map((item, index) => {
                                    return (
                                      <tr>
                                        <td style={{ width: '20px' }}>{index + 1}</td>
                                        <td>{item.created_at.split('T')[0]}, {new Date(item.created_at).toLocaleTimeString()}</td>
                                        <td>{item.department}</td>
                                        <td>{item.query_type}</td>
                                        <td>{item.title}</td>
                                        <td>{accountDetails.users.find((acc) => acc.id == item.created_by).username}</td>
                                        <td>
                                          <div>
                                            <label className={`tableLabel ${item.status == 'open' ? 'success' : 'fail'}`} style={{ textTransform: 'capitalize' }}>{item.status}</label>
                                          </div>
                                        </td>
                                        <td><div className=''>
                                          <button
                                            className="tableButton edit mx-auto"
                                            onClick={() => featureUnderdevelopment()}
                                          >
                                            <i className="fa-regular fa-eye"></i>
                                          </button>
                                        </div></td>
                                      </tr>
                                    )
                                  }) : <tr><td colSpan={99}><EmptyPrompt generic={true} /></td></tr>}
                                </tbody>
                              </table>
                            </div>
                            <div className="tableHeader mb-3">
                              <PaginationComponent
                                pageNumber={(e) => setPageNumber(e)}
                                totalPage={allClosedTickets?.last_page}
                                from={allClosedTickets?.from}
                                to={allClosedTickets?.to}
                                total={allClosedTickets?.total}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {createTicketPopup && <CreateTicketPopup setPopup={setCreateTicketPopup} setLoading={setLoading} refresh={refreshApiCall} loading={loading} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <ModalComponent task={"close"} reference={"Ticket"} />
      </main>
    </>
  )
}

export default Ticket

export function CreateTicketPopup({ setPopup, setLoading, refresh, loading }) {
  const { register, formState: { errors }, reset, handleSubmit } = useForm();

  const handleFormSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const payload = { ...data };
    const apiData = await generalPostFunction("/ticket/store", payload);
    if (apiData?.status) {
      setLoading(false);
      reset();
      refresh();
      setPopup(false);
      toast.success(apiData.messege);
    } else {
      setLoading(false);
    }
  });
  return (
    <div className="backdropContact">
      {loading && <CircularLoader />}
      <div className="addNewContactPopup p-3">
        <div className="row">
          <div className="col-12 heading border-0 bg-transparent mb-0">
            <i className="fa-light fa-user-plus" />
            <h5>Create Ticket</h5>
          </div>
          <div className="col-xl-12">
            <div
              className="tableContainer0"
              style={{ maxHeight: "calc(100vh - 100px)" }}>
              <div className='from-group'>
                <div className="formLabel">
                  <label for="">Title</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("title", { ...requiredValidator, })}
                  />
                  {errors.title && (
                    <ErrorMessage text={errors.title.message} />
                  )}
                </div>
              </div>
              <div className='from-group'>
                <div className="formLabel">
                  <label for="">Department</label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("department", { ...requiredValidator, })}
                  />
                  {errors.department && (
                    <ErrorMessage text={errors.department.message} />
                  )}
                </div>
              </div>
              <div className='from-group'>
                <div className="formLabel">
                  <label for="">Query Type: </label>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    name="extension"
                    className="formItem"
                    {...register("query_type", { ...requiredValidator, })}
                  />
                  {errors.query_type && (
                    <ErrorMessage text={errors.query_type.message} />
                  )}
                </div>
              </div>
              <div className='from-group'>
                <div className="formLabel">
                  <label for="">Message</label>
                </div>
                <div className="col-12">
                  <textarea
                    type="text"
                    name="extension"
                    className="formItem h-auto"
                    rows={2}
                    {...register("description", { ...requiredValidator, })}
                  />
                  {errors.description && (
                    <ErrorMessage text={errors.description.message} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12 mt-4">
            <div className="d-flex justify-content-between">
              <button
                className="panelButton gray ms-0"
                onClick={() => setPopup(false)}
              >
                <span className="text">Close</span>
                <span className="icon">
                  <i className="fa-solid fa-caret-left" />
                </span>
              </button>
              <button
                className="panelButton me-0"
                onClick={handleFormSubmit}
              >
                <span className="text">Done</span>
                <span className="icon">
                  <i className="fa-solid fa-check" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}