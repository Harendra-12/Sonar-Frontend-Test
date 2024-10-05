import React, { useState } from "react";
import Header from "../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import {
  backToTop,
  generalPostFunction,
} from "../../GlobalFunction/globalFunction";
import { useForm } from "react-hook-form";
import {
  emailValidator,
  numberValidator,
  requiredValidator,
  restrictToAllowedChars,
  restrictToNumbers,
} from "../../validations/validation";
import ErrorMessage from "../../CommonComponents/ErrorMessage";
import { toast } from "react-toastify";
import CircularLoader from "../../Loader/CircularLoader";
import { useSelector } from "react-redux";

const MailSettingsAdd = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const loadings = useSelector((state) => state.loading);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm();

  const handleFormSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      mail_port: Number(data.mail_port),
    };

    setLoading(true);
    const addSettings = await generalPostFunction(
      "/mail-setting/store",
      payload
    );
    if (addSettings.status) {
      setLoading(false);
      reset();
      toast.success(addSettings.message);
      navigate("/mail-settings");
    } else {
      setLoading(false);
      // toast.error(addSettings.message);
    }
  });

  return (
    <>
      <style>
        {`
        .permissionListWrapper .formRow .formLabel{
          margin-left: 10px;
        }
      `}
      </style>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid px-0">
            <Header title="Mail Settings Add" />
            <div id="subPageHeader">
              <div className="col-xl-9 my-auto">
                <p className="mb-0">Add Mail Settings</p>
              </div>
              <div className="col-xl-3 ps-2">
                <div className="d-flex justify-content-end">
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={() => {
                      navigate(-1);
                      backToTop();
                    }}
                  >
                    Back
                  </button>
                  <button
                    effect="ripple"
                    className="panelButton"
                    onClick={handleFormSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-12" style={{ overflow: "auto" }}>
            <div className="mx-2" id="detailsContent">
              <form action="#" className="row">
                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Mail Driver</label>
                    <label htmlFor="mail_driver" className="formItemDesc">
                      Select Mail Driver Type
                    </label>
                  </div>
                  <div className="col-6">
                    <select
                      type="dropdown"
                      name="mail_driver"
                      className="formItem"
                      {...register("mail_driver", {
                        ...requiredValidator,
                      })}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="smtp" selected>
                        SMTP
                      </option>
                      <option value="pop3">POP3</option>
                      <option value="imap">IMAP</option>
                      <option value="ews">EWS (Exchange Web Services)</option>
                      <option value="mailgun">Mailgun</option>
                      <option value="sendgrid">SendGrid</option>
                      <option value="ses">Amazon SES</option>
                      <option value="postmark">Postmark</option>
                      <option value="mailchimp">Mailchimp</option>
                    </select>
                    {errors.mail_driver && (
                      <ErrorMessage text={errors.mail_driver.message} />
                    )}
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Host</label>
                    <label htmlFor="mail_host" className="formItemDesc">
                      Enter Mail Host
                    </label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="mail_host"
                      className="formItem"
                      placeholder="smtp.gmail.com"
                      {...register("mail_host", {
                        ...requiredValidator,
                      })}
                      onKeyDown={restrictToAllowedChars}
                    />
                    {errors.mail_host && (
                      <ErrorMessage text={errors.mail_host.message} />
                    )}
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Port</label>
                    <label htmlFor="mail_port" className="formItemDesc">
                      Enter Mail Port
                    </label>
                  </div>
                  <div className="col-6">
                    <input
                      type="number"
                      name="mail_port"
                      className="formItem"
                      placeholder="587"
                      {...register("mail_port", {
                        ...requiredValidator,
                        ...numberValidator,
                      })}
                      onKeyDown={restrictToNumbers}
                    />
                    {errors.mail_port && (
                      <ErrorMessage text={errors.mail_port.message} />
                    )}
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Username</label>
                    <label htmlFor="mail_username" className="formItemDesc">
                      Enter Mail Username
                    </label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="mail_username"
                      className="formItem"
                      placeholder="username"
                      {...register("mail_username", {
                        ...requiredValidator,
                      })}
                      onKeyDown={restrictToAllowedChars}
                    />
                    {errors.mail_username && (
                      <ErrorMessage text={errors.mail_username.message} />
                    )}
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Password</label>
                    <label htmlFor="mail_password" className="formItemDesc">
                      Enter Password
                    </label>
                  </div>
                  <div className="col-6">
                    <input
                      type="password"
                      name="mail_password"
                      className="formItem"
                      {...register("mail_password", {
                        ...requiredValidator,
                      })}
                    />
                    {errors.mail_password && (
                      <ErrorMessage text={errors.mail_password.message} />
                    )}
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Encryption</label>
                    <label htmlFor="mail_encryption" className="formItemDesc">
                      Select Encryption Type
                    </label>
                  </div>
                  <div className="col-6">
                    <select
                      type="dropdown"
                      name="mail_encryption"
                      className="formItem"
                      {...register("mail_encryption", {
                        ...requiredValidator,
                      })}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="tls" selected>
                        TLS (Transport Layer Security)
                      </option>
                      <option value="ssl">SSL (Secure Sockets Layer)</option>
                      <option value="pgp">PGP (Pretty Good Privacy)</option>
                      <option value="gpg">GPG (GNU Privacy Guard)</option>
                      <option value="smime">
                        S/MIME (Secure/Multipurpose Internet Mail Extensions)
                      </option>
                      <option value="end_to_end">End-to-End Encryption</option>
                      <option value="email_encryption">
                        Email Encryption Gateways
                      </option>
                    </select>
                    {errors.mail_encryption && (
                      <ErrorMessage text={errors.mail_encryption.message} />
                    )}
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Mail From</label>
                    <label htmlFor="mail_from_address" className="formItemDesc">
                      Enter Mail From
                    </label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="mail_from_address"
                      className="formItem"
                      placeholder="Xs6pI@example.com"
                      {...register("mail_from_address", {
                        ...requiredValidator,
                        ...emailValidator,
                      })}
                      onKeyDown={restrictToAllowedChars}
                    />
                    {errors.mail_from_address && (
                      <ErrorMessage text={errors.mail_from_address.message} />
                    )}
                  </div>
                </div>

                <div className="formRow col-xl-3">
                  <div className="formLabel">
                    <label htmlFor="">Mail From Name</label>
                    <label htmlFor="mail_from_name" className="formItemDesc">
                      Enter Mail From Name
                    </label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      name="mail_from_name"
                      className="formItem"
                      placeholder="Company Name"
                      {...register("mail_from_name", {
                        ...requiredValidator,
                      })}
                      onKeyDown={restrictToAllowedChars}
                    />
                    {errors.mail_from_name && (
                      <ErrorMessage text={errors.mail_from_name.message} />
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {loading && loadings && (
          <div colSpan={99}>
            <CircularLoader />
          </div>
        )}
      </main>
    </>
  );
};

export default MailSettingsAdd;
