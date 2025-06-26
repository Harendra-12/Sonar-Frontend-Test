import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  emailValidator,
  requiredValidator,
} from "../../../validations/validation";
import ErrorMessage from "../../../CommonComponents/ErrorMessage";
import { toast } from "react-toastify";
import { generalPostFunction } from "../../../GlobalFunction/globalFunction";

const NewMail = ({
  handleShowNewMail,
  handleListingClick,
  handleMailReplay,
  availableFromMailAddresses,
  activeList,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // compose a new mail
  const handleComposeMail = async (data) => {
    setLoading(true);
    // implement dynamic toast
    try {
      const payload = {
        to: data.mailTo,
        subject: data.subjects,
        content: data.content,
      };
      console.log(payload);
      const apiData = await generalPostFunction("/send-mail", payload);
      if (apiData.status) {
        setLoading(false);
        toast.success(apiData.message);
        handleListingClick(activeList);
        reset();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="read_message h-100">
        <div className="card shadow-none rounded-3 h-100" style={{ borderColor: "var(--me-border1)" }}>
          <div className="card-body d-flex justify-content-between flex-column" style={{ borderColor: "var(--me-border1)" }}>
            <div className="d-flex align-items-center gap-3">
              <button
                className="back_pev"
                onClick={() => handleListingClick(activeList)}
              >
                <i class="fa-solid fa-arrow-left"></i>
              </button>
              <div className="d-flex justify-content-between align-items-center w-100">
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
                  <ul className="dropdown-menu light">
                    {/* {
                                                    item.is_admin ? */}
                    <li className="mailList_menu">
                      <button className="dropdown-item">
                        <i class="fa-duotone fa-light fa-star me-2"></i> Starred
                      </button>
                    </li>

                    <li className="mailList_menu">
                      <button className="dropdown-item text-danger">
                        <i class="fa-duotone fa-solid fa-trash me-2 "></i>{" "}
                        Deleted
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit(handleComposeMail)} className="d-flex justify-content-between flex-column h-100">
              <div className="mailBox_body p-3 " style={{    height: "calc(100vh - 337px)"}}>
                <div className="row ">
                  <div className=" col-12">
                    <div className="from-group">
                      <div className="formLabel">
                        <label htmlFor="fromAccount">Form</label>
                      </div>
                      {availableFromMailAddresses ? (
                        <select
                          type="text"
                          name="mailFrom"
                          className="formItem"
                          id="fromAccount"
                          defaultValue={""}
                          {...register("mailFrom", {
                            ...requiredValidator,
                            ...emailValidator,
                          })}
                        >
                          <option value={""} disabled>
                            Select an account
                          </option>
                          {availableFromMailAddresses.map((item, index) => (
                            <option kay={index} value={item?.mail_from_address}>
                              {item?.mail_from_address}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p>Sorry you don't have any mail account</p>
                      )}
                      {errors?.mailFrom && (
                        <ErrorMessage text={errors.mailFrom.message} />
                      )}
                    </div>
                  </div>
                  <div className=" col-12">
                    <div className="from-group">
                      <div className="formLabel">
                        <label htmlFor="mailToOption">To</label>
                      </div>
                      <input
                        type="text"
                        name="mailTo"
                        class="formItem"
                        placeholder="johndoe@example.com"
                        id="mailToOption"
                        {...register("mailTo", {
                          ...requiredValidator,
                          ...emailValidator,
                        })}
                      />
                      {errors?.mailTo && (
                        <ErrorMessage text={errors.mailTo.message} />
                      )}
                    </div>
                  </div>
                  <div className=" col-12">
                    <div className="from-group">
                      <div className="formLabel">
                        <label htmlFor="CCmailOption">CC</label>
                      </div>
                      <input
                        type="text"
                        name="CCmail"
                        class="formItem"
                        id="CCmailOption"
                        placeholder="johnnydepp@example.com"
                        {...register("CCmail", { ...emailValidator })}
                      />
                      {errors?.CCmail && (
                        <ErrorMessage text={errors.CCmail.message} />
                      )}
                    </div>
                  </div>

                  <div className=" col-12">
                    <div className="from-group">
                      <div className="formLabel">
                        <label htmlFor="subjectOption">Subjects</label>
                      </div>
                      <input
                        type="text"
                        name="subjects"
                        class="formItem"
                        id="subjectOption"
                        {...register("subjects", { ...requiredValidator })}
                        placeholder="example subject"
                      />
                      {errors?.subjects && (
                        <ErrorMessage text={errors.subjects.message} />
                      )}
                    </div>
                  </div>
                  <div className=" col-12">
                    <div className="textBox position-relative">
                      <textarea
                        type="text"
                        name="content"
                        rows={13}
                        className="formItem h-auto"
                        placeholder="Please enter your message"
                        {...register("content", { ...requiredValidator })}
                      />
                      {errors?.content && (
                        <ErrorMessage text={errors.content.message} />
                      )}
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
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="submit"
                    className="panelButton m-0"
                    disabled={loading}
                  >
                    <span className="text">Send</span>
                    <span className="icon">
                      <i className="fa-solid fa-check"></i>
                    </span>
                  </button>
                  <button
                    className="panelButton gray m-0 float-end"
                    onClick={() => handleListingClick(activeList)}
                  >
                    <span className="text">Cancel</span>
                    <span className="icon">
                      <i className="fa-solid fa-xmark"></i>
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewMail;
