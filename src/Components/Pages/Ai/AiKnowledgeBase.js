import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import {
  aiFileUploadFunction,
  aiGeneralDeleteFunction,
  aiGeneralGetFunction,
  aiGeneralPostFunction,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import { useForm, Controller, FormProvider } from "react-hook-form";
import ErrorMessage from "../../CommonComponents/ErrorMessage"; // use this to display form validation errors
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";

const AiKnowledgeBase = () => {
  const [refreshState, setRefreshState] = useState(false);
  const [addKnowledgeBase, setKnowledgeBase] = useState(false);
  const [linkCopy, setLinkCopy] = useState(null);
  const [deletePopup, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createFileLoading, setCreateFileLoading] = useState(false);
  const [initialData, setInitialData] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [currentTab, setCurrentTab] = useState("webPage");
  const [addedFiles, setAddedFiles] = useState([]);
  const [isValids, setIsValids] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    getValues,
    setValue,
    trigger,
    clearErrors,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  // link copy function with dynamically state change
  const copyLink = (link) => {
    if (!link) return;
    setLinkCopy(link);
    navigator.clipboard.writeText(link);

    setTimeout(() => {
      setLinkCopy(null);
    }, 1000);
  };

  const downloadFile = (link) => {
    // window.open(link, "_blank");
    const a = document.createElement("a");
    a.href = link;
    a.setAttribute("download", ""); // Or set a specific filename like 'example.pdf'
    document.body.appendChild(a); // Needed for Firefox
    a.click();
    document.body.removeChild(a);
  };

  // Clear errors when switching tabs
  useEffect(() => {
    clearErrors();
  }, [currentTab, clearErrors]);

  // initial fetch data
  useEffect(() => {
    fetchInitialData();
  }, []);
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setRefreshState(true);
      const res = await aiGeneralGetFunction("/knowledgebase/all");
      if (res.status) {
        setInitialData(res?.knowledgeBaseResponses);
        setActiveFile(
          res?.knowledgeBaseResponses?.length > 0
            ? res?.knowledgeBaseResponses[0]
            : null
        );
        setLoading(false);
        setRefreshState(false);
      }
    } catch (error) {
      setLoading(false);
      setRefreshState(false);
      console.error("Error fetching initial data: ", error);
    }
  };

  const handleDeleteKnowledgeBase = async () => {
    if (!activeFile) {
      toast.error("No knowledge base selected for deletion");
      return;
    }

    setCreateFileLoading(true);
    try {
      const res = await aiGeneralDeleteFunction(
        `/knowledgebase/delete/${activeFile?.knowledge_base_id}`
      );

      if (res.status) {
        toast.success("Knowledge base deleted successfully");
        setCreateFileLoading(false);
        setShowDeleteDialog(false);
        setActiveFile(null);
        fetchInitialData(); // Refresh the list after deletion
      } else {
        toast.error("Failed to delete knowledge base");
        setCreateFileLoading(false);
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error("Error deleting knowledge base: ", error);
      toast.error("Failed to delete knowledge base");
      setCreateFileLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const validateForm = async () => {
    const formValid = await trigger();
    console.log("formValid", formValid);
    if (!formValid) return false;

    const values = getValues();

    // Common validation for name
    if (!values.name?.trim()) {
      setError("name", { message: "Name is required" });
      return false;
    }

    // Validate based on current tab
    if (currentTab === "webPage") {
      const url = values.webPageUrl?.trim();
      if (!url) {
        setError("webPageUrl", { message: "Web page URL is required" });
        return false;
      }

      try {
        new URL(url); // Throws if invalid
      } catch {
        setError("webPageUrl", { message: "Please enter a valid URL" });
        return false;
      }
    } else if (currentTab === "uploadFile") {
      if (!values.uploadFile) {
        setError("uploadFile", { message: "File is required" });
        return false;
      }
    } else if (currentTab === "addText") {
      if (!values.addTextName?.trim() || !values.addTextContent?.trim()) {
        if (!values.addTextName?.trim()) {
          setError("addTextName", { message: "File name is required" });
        }
        if (!values.addTextContent?.trim()) {
          setError("addTextContent", { message: "Content is required" });
        }
        return false;
      }
    }

    return true;
  };
  const handleFileAdd = async () => {
    if (!(await validateForm())) return;

    const values = getValues();
    let displayName = "";
    let data = null;

    if (currentTab === "webPage") {
      try {
        const url = new URL(values.webPageUrl);
        displayName = url.hostname;
        data = values.webPageUrl;
      } catch (error) {
        displayName = values.webPageUrl;
        data = values.webPageUrl;
        console.error("Invalid URL:", error);
      }
    } else if (currentTab === "uploadFile") {
      displayName = values.uploadFile?.name || "Unnamed File";
      data = values.uploadFile;
    } else {
      displayName = values.addTextName;
      data = { name: values.addTextName, content: values.addTextContent };
    }

    const newFile = {
      id: Date.now(),
      name: values.name,
      displayName,
      type: currentTab,
      date: new Date().toISOString(),
      data,
    };

    setAddedFiles((prev) => [newFile, ...prev]);
    setIsValids(true);

    // Reset form while keeping the name
    const currentName = values.name;
    reset();
    setValue("name", currentName);
  };

  const handleRemoveFile = (id) => {
    setAddedFiles((prev) => {
      const newFiles = prev.filter((file) => file.id !== id);
      setIsValids(newFiles.length > 0);
      return newFiles;
    });
  };

  const handleSaveChanges = async () => {
    if (!isValids || addedFiles.length === 0) return;

    // toast.loading("Saving files...");
    setCreateFileLoading(true);
    const name = getValues("name").trim();
    const texts = [];
    const urls = [];
    const files = [];

    // Organize added files
    addedFiles.forEach((file) => {
      if (file.type === "webPage") {
        urls.push(file.data);
      } else if (file.type === "uploadFile") {
        if (Array.isArray(file.data)) {
          file.data.forEach((f) => files.push(f)); // support multiple files
        } else {
          files.push(file.data); // single File object
        }
      } else if (file.type === "addText") {
        texts.push({ title: file.data.name, text: file.data.content });
      }
    });

    // Create form data
    const formData = new FormData();
    formData.append("name", name);

    if (urls.length > 0) {
      formData.append("urls", JSON.stringify(urls));
    }

    if (texts.length > 0) {
      formData.append("texts", JSON.stringify(texts));
    }

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("file", file);
      });
    }

    try {
      const res = await aiFileUploadFunction("/knowledgebase/store", formData);

      if (res.status) {
        toast.success("Knowledge base saved successfully");
        setCreateFileLoading(false);
        setIsValids(false);
        setKnowledgeBase(false);
        setAddedFiles([]);
        reset();
        fetchInitialData();
      } else {
        toast.error("Failed to save knowledge base");
        setCreateFileLoading(false);
      }
    } catch (error) {
      console.error("Error saving knowledge base:", error);
      toast.error("Failed to save knowledge base");
      setCreateFileLoading(false);
    }
  };

  const handleRefreshBtnClicked = () => {
    fetchInitialData();
  };

  if (createFileLoading) return <ThreeDotedLoader />;
  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Knowledge Base" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div
                    className="d-flex flex-wrap position-relative"
                    style={
                      loading ? { height: "calc(100vh - 200px)" } : undefined
                    }
                  >
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Knowledge Base{" "}
                            <button
                              className="clearButton"
                              onClick={handleRefreshBtnClicked}
                              disabled={refreshState}
                            >
                              <i
                                className={
                                  refreshState
                                    ? "fa-regular fa-arrows-rotate fs-5 fa-spin"
                                    : "fa-regular fa-arrows-rotate fs-5"
                                }
                              ></i>
                            </button>
                          </h4>
                          <p>You can manage yours Knowledge Base here</p>
                        </div>
                      </div>
                    </div>
                    {loading ? (
                      <ThreeDotedLoader />
                    ) : (
                      <div className="col-12">
                        <div className="row p-3">
                          <div className="col-xxl-4 col-xl-5 col-lg-12 ">
                            <div className="KnowledgeLeftinfo">
                              <div className="info_header">
                                <h5 className="mb-0">Uploaded files</h5>
                                <button
                                  className={`tableButton`}
                                  onClick={setKnowledgeBase}
                                >
                                  <i className="fa-regular fa-plus" />
                                </button>
                              </div>
                              <div className="knowledge__list">
                                <div
                                  className="nav flex-column nav-pills me-3"
                                  id="v-pills-tab"
                                  role="tablist"
                                  aria-orientation="vertical"
                                >
                                  {initialData &&
                                    initialData.map((item) => (
                                      <button
                                        key={item.knowledge_base_id}
                                        className={`nav-link ${
                                          item.knowledge_base_id ===
                                          activeFile?.knowledge_base_id
                                            ? "active"
                                            : ""
                                        }`}
                                        id="v-pills-home-tab"
                                        data-bs-toggle="pill"
                                        data-bs-target="#v-pills-home"
                                        type="button"
                                        role="tab"
                                        aria-controls="v-pills-home"
                                        aria-selected="true"
                                        onClick={() => {
                                          setActiveFile(item);
                                        }}
                                      >
                                        <p className="mb-0">
                                          <i
                                            className="fa-duotone fa-solid fa-folder-open me-2"
                                            style={{
                                              color: "var(--color-subtext)",
                                            }}
                                          ></i>{" "}
                                          {item?.knowledge_base_name}
                                        </p>
                                        <p className="mb-0">
                                          <span
                                            style={{
                                              fontSize: "0.75rem",
                                              color: "var(--color-subtext)",
                                            }}
                                          >
                                            {" "}
                                            {new Date(
                                              item?.user_modified_timestamp
                                            ).toLocaleDateString()}
                                          </span>
                                        </p>
                                      </button>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-8 col-xl-7 col-lg-12 ">
                            <div
                              className="tab-content KnowledgeRightinfo"
                              id="v-pills-tabContent"
                            >
                              <div
                                className="tab-pane fade show active"
                                id="v-pills-home"
                                role="tabpanel"
                                aria-labelledby="v-pills-home-tab"
                              >
                                <div className="heading px-0">
                                  <div className="content">
                                    <h4>{activeFile?.knowledge_base_name}</h4>
                                    <p className="mb-0">
                                      ID:{" "}
                                      <span>
                                        {activeFile?.knowledge_base_id}
                                      </span>
                                      <button
                                        className="clearButton"
                                        onClick={() => {
                                          copyLink(
                                            activeFile?.knowledge_base_id
                                          );
                                        }}
                                      >
                                        <i
                                          className={
                                            linkCopy ===
                                            activeFile?.knowledge_base_id
                                              ? "fa-solid fa-check text_success"
                                              : "fa-solid fa-clone"
                                          }
                                        ></i>
                                      </button>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-end mb-2 f-s-14">
                                      Last Update on :{" "}
                                      <strong>
                                        {new Date(
                                          activeFile?.user_modified_timestamp
                                        ).toLocaleDateString()}
                                      </strong>
                                    </p>
                                    <div className="buttonGroup">
                                      <button
                                        className="panelButton danger"
                                        onClick={setShowDeleteDialog}
                                      >
                                        <span className="text">Delete</span>
                                        <span className="icon">
                                          <i className="fa-solid fa-trash"></i>
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="k_body">
                                  <div className="tableContainer">
                                    <table>
                                      <tbody className="">
                                        <>
                                          {activeFile &&
                                            activeFile?.knowledge_base_sources?.map(
                                              (data) => (
                                                <tr key={data?.source_id}>
                                                  <td colSpan={12}>
                                                    <div className="d-flex align-items-center">
                                                      <div className="table__icon">
                                                        {data.type ===
                                                          "text" && (
                                                          <i className="fa-solid fa-file-lines" />
                                                        )}
                                                        {data.type ===
                                                          "document" && (
                                                          <i className="fa-solid fa-file" />
                                                        )}
                                                        {data.type ===
                                                          "url" && (
                                                          <i className="fa-solid fa-link" />
                                                        )}
                                                      </div>
                                                      <div className="ms-2 detailsTable">
                                                        <h5 className="mb-0">
                                                          {(data?.type ===
                                                            "text" &&
                                                            data.title) ||
                                                            (data?.type ===
                                                              "url" &&
                                                              data?.url) ||
                                                            (data?.type ===
                                                              "document" &&
                                                              data?.filename)}
                                                        </h5>
                                                        <p className="mb-0">
                                                          {data?.type.toUpperCase()}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td>
                                                    <div className="d-flex justify-content-end align-items-center gap-2">
                                                      {(data.type === "text" ||
                                                        data.type ===
                                                          "document") && (
                                                        <button
                                                          className="aitable_button bg-transparent"
                                                          onClick={() =>
                                                            downloadFile(
                                                              data.type ===
                                                                "text"
                                                                ? data?.content_url
                                                                : data.type ===
                                                                  "document"
                                                                ? data?.file_url
                                                                : data.type ===
                                                                    "url" &&
                                                                  data.url
                                                            )
                                                          }
                                                        >
                                                          <i className="fa-regular fa-arrow-down-to-line"></i>
                                                        </button>
                                                      )}
                                                      <button
                                                        className="aitable_button bg-transparent"
                                                        onClick={() =>
                                                          copyLink(
                                                            data.type === "text"
                                                              ? data?.content_url
                                                              : data.type ===
                                                                "document"
                                                              ? data?.file_url
                                                              : data.type ===
                                                                  "url" &&
                                                                data.url
                                                          )
                                                        }
                                                      >
                                                        <i
                                                          className={
                                                            linkCopy ===
                                                            (data.type ===
                                                            "text"
                                                              ? data?.content_url
                                                              : data.type ===
                                                                "document"
                                                              ? data?.file_url
                                                              : data.type ===
                                                                  "url" &&
                                                                data.url)
                                                              ? "fa-solid fa-check text_success"
                                                              : "fa-solid fa-clone"
                                                          }
                                                        ></i>
                                                      </button>
                                                    </div>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                        </>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="tab-pane fade"
                                id="v-pills-profile"
                                role="tabpanel"
                                aria-labelledby="v-pills-profile-tab"
                              ></div>
                              <div
                                className="tab-pane fade"
                                id="v-pills-messages"
                                role="tabpanel"
                                aria-labelledby="v-pills-messages-tab"
                              ></div>
                              <div
                                className="tab-pane fade"
                                id="v-pills-settings"
                                role="tabpanel"
                                aria-labelledby="v-pills-settings-tab"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {addKnowledgeBase && (
          <div className="popup ">
            <div className="popup music">
              <div className="container h-100">
                <div className="row h-100 justify-content-center align-items-center">
                  <div
                    className="card px-0 col-5 shadow-none w50"
                    style={{
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div className="card-header bg-transparent ">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="card-title fs14 fw700 mb-0">
                            Add Knowledge Base for Agent
                          </h5>
                          <p className="sub_text mb-0">
                            choose any type of data that best suits for your
                            agent
                          </p>
                        </div>
                        <button
                          className="clearButton2 xl"
                          onClick={() => setKnowledgeBase(false)}
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                    <div className="card-body aiAgentTab p-3">
                      <div className="addFile_box">
                        <h5 className="card-title fs14 border-bootm fw700 mb-3">
                          Added Files List
                        </h5>
                        {addedFiles.length === 0 && (
                          <h5 className="sub_text mb-3">No files added yet</h5>
                        )}
                        {addedFiles.map((file) => (
                          <div
                            key={file.id}
                            className="addFile_box p-2 d-flex justify-content-between align-items-center gap-1 mb-2"
                          >
                            <div className="d-flex align-items-center gap-1">
                              <i
                                className={
                                  file.type === "addText"
                                    ? "fa-solid fa-file-lines"
                                    : file.type === "uploadFile"
                                    ? "fa-solid fa-file"
                                    : file.type === "webPage"
                                    ? "fa-solid fa-link"
                                    : "fa-solid fa-file-circle-question"
                                }
                              />

                              <h5 className="card-title fs14 border-bootm fw700 mb-0">
                                {file.displayName}
                              </h5>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(file.id)}
                              className="aitable_button bg-transparent d-flex justify-content-center align-items-center p-1 text-danger border-danger"
                            >
                              <i className={`fa-regular fa-trash `}></i>
                            </button>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSubmit(handleFileAdd)}>
                        <div className="formRow flex-column align-items-start">
                          <div className="formLabel">
                            <label> Name:</label>
                          </div>
                          <div className="col-12">
                            <input
                              type="text"
                              name="name"
                              className="formItem"
                              placeholder="Enter a name for your knowledge base"
                              {...register("name", {
                                required:
                                  currentTab === "webPage" ||
                                  currentTab === "uploadFile" ||
                                  currentTab === "addText"
                                    ? "Name is required"
                                    : false,
                              })}
                            />
                            {errors.name && (
                              <ErrorMessage text={errors.name.message} />
                            )}
                          </div>
                        </div>

                        <div className="mt-3 baseNav">
                          <ul
                            className="nav nav-pills"
                            id="pills-tab"
                            role="tablist"
                          >
                            <li className="nav-item" role="presentation">
                              <button
                                className={`nav-link${
                                  currentTab === "webPage" ? " active" : ""
                                }`}
                                id="webPAge-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#webPAge"
                                type="button"
                                role="tab"
                                aria-controls="webPAge"
                                aria-selected={currentTab === "webPage"}
                                onClick={() => setCurrentTab("webPage")}
                              >
                                Web Page
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className={`nav-link${
                                  currentTab === "uploadFile" ? " active" : ""
                                }`}
                                id="upload-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#upload"
                                type="button"
                                role="tab"
                                aria-controls="upload"
                                aria-selected={currentTab === "uploadFile"}
                                onClick={() => setCurrentTab("uploadFile")}
                              >
                                Upload File
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button
                                className={`nav-link${
                                  currentTab === "addText" ? " active" : ""
                                }`}
                                id="addText-tab"
                                data-bs-toggle="pill"
                                data-bs-target="#addText"
                                type="button"
                                role="tab"
                                aria-controls="addText"
                                aria-selected={currentTab === "addText"}
                                onClick={() => setCurrentTab("addText")}
                              >
                                Add Text
                              </button>
                            </li>
                          </ul>
                          <div className="tab-content" id="pills-tabContent">
                            <div
                              className={`tab-pane fade${
                                currentTab === "webPage" ? " show active" : ""
                              }`}
                              id="webPAge"
                              role="tabpanel"
                              aria-labelledby="webPAge-tab"
                            >
                              <div className="formRow flex-column align-items-start">
                                <div className="formLabel">
                                  <label> Web Page URL</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder="Enter Web page URL"
                                    name="webPageUrl"
                                    {...register("webPageUrl", {
                                      required:
                                        currentTab === "webPage"
                                          ? "Web page URL is required"
                                          : false,
                                      pattern:
                                        currentTab === "webPage"
                                          ? {
                                              value:
                                                /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/,
                                              message:
                                                "Please enter a valid URL",
                                            }
                                          : undefined,
                                    })}
                                  />
                                  {currentTab === "webPage" &&
                                    errors.webPageUrl && (
                                      <ErrorMessage
                                        text={errors.webPageUrl.message}
                                      />
                                    )}
                                </div>
                              </div>
                            </div>
                            <div
                              className={`tab-pane fade pb-3${
                                currentTab === "uploadFile"
                                  ? " show active"
                                  : ""
                              }`}
                              id="upload"
                              role="tabpanel"
                              aria-labelledby="upload-tab"
                            >
                              <h5 className="card-title fs14 border-bootm fw700 mt-3">
                                Upload File
                              </h5>
                              <div className="popup-border text-center p-2">
                                <Controller
                                  name="uploadFile"
                                  control={control}
                                  rules={{
                                    required:
                                      currentTab === "uploadFile"
                                        ? "File is required"
                                        : false,
                                  }}
                                  render={({ field: { onChange, value } }) => (
                                    <>
                                      <input
                                        type="file"
                                        className="form-control-file d-none"
                                        id="fileInput"
                                        accept=".pdf,.docx,.txt,.md"
                                        onChange={(e) => {
                                          onChange(e.target.files?.[0]);
                                        }}
                                      />
                                      <label
                                        htmlFor="fileInput"
                                        className="d-block"
                                      >
                                        <div className="test-user text-center">
                                          <i
                                            className="fa-solid fa-cloud-arrow-up"
                                            style={{ fontSize: 30 }}
                                          />
                                          <p className="mb-0 mt-2 text-center">
                                            Drag and Drop or{" "}
                                            <span>Click on upload</span>
                                          </p>
                                          <span className="text2">
                                            Supports formats : PDF, DOCX, TXT,
                                            MD
                                          </span>
                                          {value && (
                                            <p className="text-center mt-2">
                                              Selected file:
                                              <span className="text-success text2">
                                                {" "}
                                                {value.name}
                                              </span>
                                            </p>
                                          )}
                                        </div>
                                      </label>
                                    </>
                                  )}
                                />
                                {/* show selected file name */}
                              </div>
                              {currentTab === "uploadFile" &&
                                errors.uploadFile && (
                                  <ErrorMessage
                                    text={errors.uploadFile.message}
                                  />
                                )}
                            </div>
                            <div
                              className={`tab-pane fade${
                                currentTab === "addText" ? " show active" : ""
                              }`}
                              id="addText"
                              role="tabpanel"
                              aria-labelledby="addText-tab"
                            >
                              <div className="formRow flex-column align-items-start">
                                <div className="formLabel">
                                  <label> File Name</label>
                                </div>
                                <div className="col-12">
                                  <input
                                    type="text"
                                    className="formItem"
                                    placeholder="Enter file name"
                                    name="addTextName"
                                    {...register("addTextName", {
                                      required:
                                        currentTab === "addText"
                                          ? "File name is required"
                                          : false,
                                    })}
                                  />
                                  {currentTab === "addText" &&
                                    errors.addTextName && (
                                      <ErrorMessage
                                        text={errors.addTextName.message}
                                      />
                                    )}
                                </div>
                              </div>
                              <div className="formRow flex-column align-items-start">
                                <div className="formLabel">
                                  <label>Content</label>
                                </div>
                                <div className="col-12">
                                  <textarea
                                    rows={8}
                                    className="formItem"
                                    placeholder="Enter Text"
                                    name="addTextContent"
                                    {...register("addTextContent", {
                                      required:
                                        currentTab === "addText"
                                          ? "Content is required"
                                          : false,
                                    })}
                                  ></textarea>
                                  {currentTab === "addText" &&
                                    errors.addTextContent && (
                                      <ErrorMessage
                                        text={errors.addTextContent.message}
                                      />
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className=" d-flex justify-content-between px-2 pt-3">
                          <div className="d-flex justify-content-start">
                            <button
                              className="panelButton static add m-0"
                              type="submit"
                            >
                              <span className="text text-white">
                                Add
                                {currentTab === "webPage"
                                  ? " Web Page"
                                  : currentTab === "uploadFile"
                                  ? " File"
                                  : currentTab === "addText" && " Text"}
                              </span>
                              {/* <span className="icon">
                                <i className="fa-regular fa-plus"></i>
                              </span> */}
                            </button>
                          </div>
                          <div className="d-flex justify-content-end">
                            <button
                              className="panelButton transparentText m-0"
                              type="button"
                              onClick={handleSaveChanges}
                              disabled={
                                !isValids || addedFiles.length === 0 || loading
                              }
                            >
                              <span className="text text-white">Save</span>
                              <span className="icon">
                                <i className="fa-solid fa-check"></i>
                              </span>
                            </button>
                            <button
                              className="panelButton gray transparentText"
                              type="button"
                              onClick={() => {
                                setKnowledgeBase(false);
                              }}
                            >
                              <span className="text text-white">Cancel</span>
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
              </div>
            </div>
          </div>
        )}

        {deletePopup && (
          <div className="popup">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="row content col-xl-4 col-md-5">
                  <div className="col-12">
                    <div className="iconWrapper">
                      <i className="fa-duotone fa-circle-exclamation text-danger"></i>
                    </div>
                  </div>
                  <div className="col-12">
                    <h4 className="text-center text-danger">Confirmation!</h4>
                    <p className="text-center">
                      Are you sure! You want to delete this DID
                    </p>

                    <div className="d-flex justify-content-center gap-2 mt-4">
                      <button
                        className="panelButton m-0"
                        onClick={handleDeleteKnowledgeBase}
                      >
                        <span className="text">Delete</span>
                        <span className="icon">
                          <i className="fa-solid fa-check"></i>
                        </span>
                      </button>
                      <button
                        className="panelButton gray m-0 float-end"
                        onClick={() => {
                          setShowDeleteDialog(false);
                        }}
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
          </div>
        )}
      </main>
    </>
  );
};

export default AiKnowledgeBase;
