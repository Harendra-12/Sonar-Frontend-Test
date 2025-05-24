import React, { useEffect, useState } from "react";
import PaginationComponent from "../../CommonComponents/PaginationComponent";
import Header from "../../CommonComponents/Header";
import { useNavigate } from "react-router-dom";
import { generalDeleteFunction, generalGetFunction } from "../../GlobalFunction/globalFunction";
import { toast } from "react-toastify";
import SkeletonTableLoader from "../../Loader/SkeletonTableLoader";
import EmptyPrompt from "../../Loader/EmptyPrompt";
import PromptFunctionPopup from "../../CommonComponents/PromptFunctionPopup";

function Buyers() {
  const navigate = useNavigate();
  const [allBuyers, setAllBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const { confirm, ModalComponent } = PromptFunctionPopup();

  const getAllBuyers = async () => {
    setLoading(true);
    const response = await generalGetFunction('buyer/all');
    if (response.status) {
      setAllBuyers(response.data);
      setLoading(false);
    } else {
      toast.error(response.message);
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    getAllBuyers();
  }, [itemsPerPage, searchValue])

  // Handle Edit Buyer
  const handleConfigEdit = async (id) => {
    if (id) {
      navigate('/buyer-edit', { state: { id: id } });
    }
  }

  // Handle Delete Buyer
  const handleDeleteConfig = async (id) => {
    const userConfirmed = await confirm();
    if (userConfirmed) {
      setLoading(true);
      try {
        const apiCall = await generalDeleteFunction(`/buyer/${id}`);
        if (apiCall.status) {
          setLoading(false);
          toast.success("Buyer Deleted Successfully.");
          getAllBuyers();
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    }
  }

  return (
    <>
      <main className="mainContent">
        <section id="phonePage">
          <div className="container-fluid">
            <div className="row">
              <Header title="Buyers" />
              <div className="overviewTableWrapper">
                <div className="overviewTableChild">
                  <div className="d-flex flex-wrap">
                    <div className="col-12">
                      <div className="heading">
                        <div className="content">
                          <h4> All Buyers
                            <button class="clearButton" onClick={getAllBuyers}><i class={`fa-regular fa-arrows-rotate fs-5 ${loading ? 'fa-spin' : ''}`} /></button>
                          </h4>
                          <p>You can see all list of all buyers</p>
                        </div>
                        <div className="buttonGroup">
                          <button className="panelButton gray">
                            <span className="text">Back</span>
                            <span className="icon">
                              <i className="fa-solid fa-caret-left"></i>
                            </span>
                          </button>
                          <button
                            onClick={() => navigate("/buyer-add")}
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
                      {/* <div className="tableHeader">
                        <div className="showEntries">
                          <label>Show</label>
                          <select
                            className="formItem"
                            value={itemsPerPage}
                            onChange={(e) => {
                              setItemsPerPage(e.target.value);
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
                            onChange={(e) => setSearchValue(e.target.value)}
                          />
                        </div>
                      </div> */}
                      <div className="tableContainer">
                        <table>
                          <thead>
                            <tr>
                              <th>Buyer name</th>
                              <th>Phone Code</th>
                              <th>Phone Number</th>
                              <th>Alt Phone Number</th>
                              <th>Email</th>
                              <th>Address</th>
                              <th>City</th>
                              <th>State</th>
                              <th>Province</th>
                              <th>Postal code</th>
                              <th>Country code</th>
                              <th>Edit</th>
                              <th>Delete</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? <SkeletonTableLoader col={13} row={15} /> :
                              allBuyers && allBuyers.length > 0 ?
                                allBuyers.map((buyer, index) => (
                                  <tr key={index}>
                                    <td>{buyer.name}</td>
                                    <td>{buyer.phone_code}</td>
                                    <td>{buyer.phone_number}</td>
                                    <td>{buyer.alt_phone}</td>
                                    <td>{buyer.email}</td>
                                    <td>{buyer.address}</td>
                                    <td>{buyer.city}</td>
                                    <td>{buyer.state}</td>
                                    <td>{buyer.province}</td>
                                    <td>{buyer.postal_code}</td>
                                    <td>{buyer.country_code}</td>
                                    <td><button className="tableButton edit" onClick={() => handleConfigEdit(buyer.id)}><i className='fa-solid fa-pen' /></button></td>
                                    <td><button className="tableButton delete" onClick={() => handleDeleteConfig(buyer.id)}><i className='fa-solid fa-trash' /></button></td>
                                  </tr>
                                )) : <tr><td colSpan={99}><EmptyPrompt generic={true} /></td></tr>
                            }
                          </tbody>
                        </table>
                      </div>

                      {/* <div className="tableHeader mb-3">
                        <PaginationComponent
                        pageNumber={(e) => setPageNumber(e)}
                        totalPage={ringGroup.last_page}
                        from={ringGroup.from}
                        to={ringGroup.to}
                        total={ringGroup.total}
                        />
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalComponent task={"delete"} reference={"Buyer"} />
        </section>
      </main>
    </>
  );
}

export default Buyers;
