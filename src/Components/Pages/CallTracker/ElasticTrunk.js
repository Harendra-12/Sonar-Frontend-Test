import React, { useEffect, useState } from "react";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import { useNavigate } from "react-router-dom";
import Header from "../../CommonComponents/Header";
import PromptFunctionPopup from "../../CommonComponents/PromptFunctionPopup";
import {
  generalDeleteFunction,
  generalGetFunction,
  useDebounce,
} from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import ThreeDotedLoader from "../../Loader/ThreeDotedLoader";
function ElasticTrunk() {
  const navigate = useNavigate();

  const [allTrunk, setAllTrunk] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const { confirm, ModalComponent } = PromptFunctionPopup();
  const debouncedSearchTerm = useDebounce(searchValue, 1000);

  const getAllTrunk = async () => {
    setLoading(true);
    const response = await generalGetFunction(
      `fportaltrunk/all?page=${pageNumber}&row_per_page=${itemsPerPage}&search=${searchValue}`
    );
    if (response.status) {
      setAllTrunk(response?.data);
      setLoading(false);
    } else {
      toast.error(response.message);
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    getAllTrunk();
  }, [itemsPerPage, debouncedSearchTerm, pageNumber]);

  // Handle Edit Buyer
  const handleConfigEdit = async (id) => {
    if (id) {
      navigate("/elastic-trunk-edit", { state: { id: id } });
    }
  };

  // Handle Delete Buyer
  const handleDeleteConfig = async (id) => {
    const userConfirmed = await confirm();
    if (userConfirmed) {
      setLoading(true);
      try {
        const apiCall = await generalDeleteFunction(`/fportaltrunk/${id}`);
        if (apiCall.status) {
          setLoading(false);
          toast.success("Trunk Deleted Successfully.");
          getAllTrunk();
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
              <Header title="Elastic Trunk Portal" />
          <div className="container-fluid">
            <div className="row">
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4>
                            Elastic Trunk{" "}
                            <button
                              className="clearButton"
                              onClick={getAllTrunk}
                            >
                              <i
                                className={`fa-regular fa-arrows-rotate fs-5 ${
                                  loading ? "fa-spin" : ""
                                }`}
                              />
                            </button>
                          </h4>
                          <p>You can see all list of Elastic Trunk portal</p>
                        </div>
                        <div className="buttonGroup">
                          <button className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          <button
                            onClick={() => navigate("/elastic-trunk-add")}
                            className="panelButton"
                          >
                            <span className="text">Add</span>
                            <span className="icon">
                              <i className="fa-solid fa-plus"></i>
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-12"
                      style={{ overflow: "auto", padding: "10px 20px 0" }}
                    >
                      <div className="tableHeader">
                        <div className="showEntries">
                          <label>Show</label>
                          <select
                            className="formItem"
                            value={itemsPerPage}
                            onChange={(e) => {
                              setItemsPerPage(e.target.value);
                              setPageNumber(1);
                            }}
                          >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                          </select>
                          <label>entries</label>
                        </div>
                        <div className="searchBox position-relative">
                          <label>Search:</label>
                          <input
                            type="text"
                            name="Search"
                            placeholder="Search"
                            value={searchValue}
                            className="formItem"
                            onChange={(e) => {
                              setSearchValue(e.target.value);
                              setPageNumber(1);
                              setItemsPerPage(10);
                            }}
                          />
                        </div>
                      </div>
                      <div className="tableContainer">
                        <table>
                          <thead>
                            <tr>
                              <th>Description</th>
                              <th>Channel</th>
                              <th>Status</th>
                              <th>Caller ID </th>
                              <th>Emergency Location</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              // <SkeletonTableLoader col={7} row={15} />
                              <ThreeDotedLoader />
                            ) : allTrunk?.data && allTrunk?.data.length > 0 ? (
                              allTrunk?.data.map((trunk, index) => (
                                <tr key={index}>
                                  <td>{trunk.description}</td>
                                  <td>{trunk.channels}</td>
                                  <td>{trunk.status == 1 ? "On" : "Off"}</td>
                                  <td>{trunk.caller_id}</td>
                                  <td>{trunk.emergency_location}</td>
                                  <td>
                                    <button
                                      className="tableButton edit"
                                      onClick={() => handleConfigEdit(trunk.id)}
                                    >
                                      <i className="fa-solid fa-pen" />
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      className="tableButton delete"
                                      onClick={() =>
                                        handleDeleteConfig(trunk.id)
                                      }
                                    >
                                      <i className="fa-solid fa-trash" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={99}>
                                  <EmptyPrompt generic={true} />
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      <div className="tableHeader mb-3">
                        <PaginationComponent
                          pageNumber={(e) => setPageNumber(e)}
                          totalPage={allTrunk?.last_page}
                          from={allTrunk?.from}
                          to={allTrunk?.to}
                          total={allTrunk?.total}
                          defaultPage={pageNumber}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalComponent task={"delete"} reference={"Trunk"} />
        </section>
      </main>
    </>
  );
}

export default ElasticTrunk;
