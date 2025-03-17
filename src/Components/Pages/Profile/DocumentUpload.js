import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fileUploadFunction } from "../../GlobalFunction/globalFunction";
import CircularLoader from "../../Loader/CircularLoader";
import { useNavigate } from "react-router-dom";

function DocumentUpload() {
  const account = useSelector((state) => state.account);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reg: null,
    tin: null,
    moa: null,
  });
  const [formDataError, setFormDataError] = useState({
    reg: false,
    tin: false,
    moa: false,
  });

  function handleChange(e) {
    const { name } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: e.target?.files?.[0],
    }));

    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 1024 * 1024) {
      setFormDataError((prevDat) => ({
        ...prevDat,
        [name]: false,
      }));
    } else {
      setFormDataError((prevDat) => ({
        ...prevDat,
        [name]: true,
      }));
    }
  }
  async function handleSubmit() {
    if (formDataError.tin || formDataError.reg || formDataError.moa) {
      toast.error("Image size must be less then 1 MB");
    } else if (!formData.reg) {
      toast.error("Please upload reg image");
    } else if (!formData.tin) {
      toast.error("Please upload TIN image");
    } else if (!formData.moa) {
      toast.error("Please upload MOA image");
    } else {
      setLoading(true);
      const parsedData = {
        account_id: account.account_id,
        documents: [
          {
            document_id: 1,
            path: formData.reg,
          },
          {
            document_id: 2,
            path: formData.tin,
          },
          {
            document_id: 3,
            path: formData.moa,
          },
        ],
      };
      const apiData = await fileUploadFunction(
        "/account-detail/store",
        parsedData
      );
      if (apiData.status) {
        toast.success(apiData.message);
        setLoading(false);
        navigate(-1);
      } else {
        setLoading(false);
        toast.error(apiData.message);
      }
    }
  }
  return (
    <>
      <style>
        {`
        .loginPanel {
    height: 500px;
    width: 100%;
}

.loginPanel .imgWrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
}

.loginPanel .imgWrapper img {
    width: 100%;
    height: 100%;
}

.loginPanel .wrapper {
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    padding: 20px;
    border-radius: 10px;
}

.loginPanel .docImgPlaceholder{
    width: 50px;
    height: 50px;

}

.loginPanel .docImgPlaceholder img{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
    input[type="file"] {
    display: none;
  }
  
  .custom-file-upload {
    width: 100%;
    height: 44px;
    font-family: 'Roboto';
    font-size: 0.8125rem;
    outline: none;
    padding-left: 10px;
    border: 1px solid #7ec9f4;
    border-radius: 4px;
    /* margin: 10px 0px 0px 0px; */
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
    .formItem{
    border: none;
    height: inherit;
    padding: 5px 0;
    }
      `}
      </style>
      <div className="main">
        <section className="loginPanel">
          <div className="imgWrapper">
            <img src={require("../../assets/images/5570879.jpg")} alt="" />
          </div>
          <form className="container h-100">
            <div className="row h-100 justify-content-center">
              {/* Create an Account Form (If Required)  || Remove the "d-none" class to make it visible*/}
              <div className="col-xl-4 my-auto">
                <div className="wrapper" id="register">
                  <div className="formItem d-flex">
                    <div className="col-12 me-2">
                      <label htmlFor="">Reg </label>
                      <label for="file-upload1" class="custom-file-upload">
                        {formData.reg ? (
                          formData.reg.name
                        ) : (
                          <>
                            {" "}
                            <i class="fa-solid fa-upload me-1"></i> Upload your
                            Document
                          </>
                        )}
                      </label>
                      <input
                        id="file-upload1"
                        type="file"
                        name="reg"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      {formDataError.reg ? (
                        <span style={{ color: "red", fontSize: 12 }}>
                          <i class="fa-solid fa-triangle-exclamation"></i> Image
                          should be less than 1 MB
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="docImgPlaceholder mt-auto">
                      {formData.reg && (
                        <img
                          src={URL.createObjectURL(formData.reg)}
                          alt="Selected"
                        />
                      )}
                    </div>
                  </div>
                  <div className="formItem d-flex">
                    <div className="col-12 me-2">
                      <label htmlFor="">Tin</label>
                      <label for="file-upload2" class="custom-file-upload">
                        {formData.tin ? (
                          formData.tin.name
                        ) : (
                          <>
                            {" "}
                            <i class="fa-solid fa-upload me-1"></i> Upload your
                            Document
                          </>
                        )}
                      </label>
                      <input
                        id="file-upload2"
                        type="file"
                        name="tin"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      {formDataError.tin ? (
                        <span style={{ color: "red", fontSize: 12 }}>
                          <i class="fa-solid fa-triangle-exclamation"></i> Image
                          should be less than 1 MB
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="docImgPlaceholder mt-auto">
                      {formData.tin && (
                        <img
                          src={URL.createObjectURL(formData.tin)}
                          alt="Selected"
                        />
                      )}
                    </div>
                  </div>
                  <div className="formItem d-flex">
                    <div className="col-12 me-2">
                      <label htmlFor="">Moa</label>
                      <label for="file-upload3" class="custom-file-upload">
                        {formData.moa ? (
                          formData.moa.name
                        ) : (
                          <>
                            {" "}
                            <i class="fa-solid fa-upload me-1"></i> Upload your
                            Document
                          </>
                        )}
                      </label>
                      <input
                        id="file-upload3"
                        type="file"
                        name="moa"
                        accept="image/*"
                        onChange={handleChange}
                      />
                      {formDataError.moa ? (
                        <span style={{ color: "red", fontSize: 12 }}>
                          <i class="fa-solid fa-triangle-exclamation"></i> Image
                          should be less than 1 MB
                        </span>
                      ) : (
                        ""
                      )}
                    </div>

                    <div className="docImgPlaceholder mt-auto">
                      {formData.moa && (
                        <img
                          src={URL.createObjectURL(formData.moa)}
                          alt="Selected"
                        />
                      )}
                    </div>
                  </div>
                  <div style={{ cursor: "pointer" }} onClick={handleSubmit}>
                    <div className="formButton mx-0 text-center">Submit</div>
                  </div>
                </div>
              </div>
            </div>
            {loading ? <CircularLoader /> : ""}
          </form>
        </section>
        {/* <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        /> */}
      </div>
    </>
  );
}

export default DocumentUpload;
