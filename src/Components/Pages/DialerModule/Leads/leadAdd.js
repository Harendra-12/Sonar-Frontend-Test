import React, { useState } from "react";
import Header from "../../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import { backToTop, fileUploadFunction } from "../../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { requiredValidator } from "../../../validations/validation";
import ErrorMessage from "../../../CommonComponents/ErrorMessage";
import CircularLoader from "../../../Loader/CircularLoader";

function LeadAdd() {
  const navigate = useNavigate();
  const [addNewCsvToggle, setAddNewCsvToggle] = useState(false);
  const [newFile, setNewFile] = useState(null)
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, formState: { errors }, reset, watch } = useForm();

  // Function to get selected file name
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const sanitizedFileName = file.name.replace(/ /g, "-");
      setFileName(sanitizedFileName); // Set the file name in state
      // Additional logic for the newFile can go here
    }
  };

  // Step four form submit for adding leads
  async function handleFormSubmitStepFour() {
    if (newFile) {
      const maxSizeInKB = 2048;
      const fileSizeInKB = newFile.size / 1024;
      if (fileSizeInKB > maxSizeInKB) {
        toast.error("Please choose a file less than 2048 kilobytes.");
      } else {
        setLoading(true);
        const parsedData = new FormData();
        parsedData.append("file_url", newFile);
        parsedData.append("name", watch().name);
        parsedData.append("description", watch().description);
        const apiData = await fileUploadFunction("/lead-file/store", parsedData);
        if (apiData.status) {
          setLoading(false);
          setAddNewCsvToggle(false)
          setNewFile();
          reset({ name: "", description: "" });
          toast.success(apiData.message);
          navigate(-1);
        } else {
          setLoading(false);
          toast.error(apiData?.message || apiData?.error);
        }
      }
    } else {
      toast.error("Please choose a file");
    }
  }

  return (
    <main className="mainContent">
      {loading && <CircularLoader />}
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
                        <h4>Lead File Add</h4>
                        <p>Add A new Lead File</p>
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
                        <button type="button" className="panelButton" onClick={handleFormSubmitStepFour}>
                          <span className="text">Save</span>
                          <span className="icon">
                            <i className="fa-solid fa-floppy-disk"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-12" style={{ padding: "25px 23px" }}>
                    <form className="mb-0">
                      <div className="formRow col-xl-6">
                        <div className="formLabel">
                          <label>Lead File</label>
                        </div>
                        <div className="col-6">
                          <input
                            type="file"
                            className="form-control-file"
                            id="fileInput"
                            accept=".csv"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                // Check if the file type is MP3

                                const fileName = file.name.replace(/ /g, "-");
                                const newFile = new File([file], fileName, {
                                  type: file.type,
                                });
                                setNewFile(newFile);
                                handleFileChange(e);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="formRow col-xl-6">
                        <div className="formLabel">
                          <label>Lead Name</label>
                        </div>
                        <div className="col-6">
                          <input className='formItem' defaultValue={""} {...register("name", { ...requiredValidator, })} />
                          {errors.name && (
                            <ErrorMessage text={errors.name.message} />
                          )}
                        </div>
                      </div>
                      <div className="formRow col-xl-6">
                        <div className="formLabel">
                          <label>Lead Description</label>
                        </div>
                        <div className="col-6">
                          <input className='formItem' defaultValue={""} {...register("description", { ...requiredValidator, })} />
                          {errors.description && (
                            <ErrorMessage text={errors.description.message} />
                          )}
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LeadAdd;
