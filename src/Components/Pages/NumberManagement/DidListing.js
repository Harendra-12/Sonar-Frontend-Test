import React, { useEffect, useState } from "react";
import Header from "../../CommonComponents/Header";
import {  useNavigate } from "react-router-dom";
import {
  generalDeleteFunction,
  generalGetFunction,
} from "../../GlobalFunction/globalFunction";
import ContentLoader from "../../Loader/ContentLoader";

function DidListing() {
  const [did, setDid] = useState();
  const [loading, setLoading] = useState(true);
  // const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    async function getData() {
      const apiData = await generalGetFunction(`/did/all`);
      if (apiData.status) {
        setLoading(false);
        setDid(apiData.data);
      } else {
        setLoading(false);
        navigate(-1);
      }
    }
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = async (id)=>{
    setLoading(true)
    const apiData = await generalDeleteFunction(`/did/configure/destroy/${id}`)
    if(apiData.status){
      setLoading(false)
    }else{
      setLoading(false)
    }
  }

  console.log("This is transition details", did);
  return (
    <main className="mainContent">
      <section id="phonePage">
        <div className="container-fluid">
          <div className="row">
            <Header title="Wallet Transactions" />
            <div className="col-12" style={{ overflow: "auto" }}>
              <div className="tableContainer">
                <table>
                  <thead>
                    <tr>
                      <th>DID</th>
                      <th>Payment Date</th>
                      <th>Transaction Amount</th>
                      <th>E911</th>
                      <th>Cname</th>
                      <th>SMS</th>
                      <th>Configure</th>
                      <th>Reset Configuration</th>
                    </tr>
                  </thead>
                  <tbody>

                        {did && did.map((item)=>{
                            return(
                                <tr>
                                <td>{item.did}</td>
                                <td>{item.created_at.split("T")[0]}</td>
                                <td>${item.price}</td>
                                <td>{item?.e911}</td>
                                <td>{item?.cnam}</td>
                                <td>{item?.sms}</td>
                                {/* <td onClick={() => navigate(item.dialplan?"/destination-edit":"/destination-add",{ state: { state: item.dialplan ? item.dialplan : item, did: item.did } })}>Configure</td> */}
                                {/* <td onClick={()=>navigate(`/did-config?did_id=${item.did}`)}>Configure</td> */}
                                <td onClick={()=>navigate(`/did-config`, {state:  item})}>Configure</td>
                                {item.configuration !== null &&<td onClick={()=>handleClick(item.configuration.id)}>Reset</td>}
                              </tr>
                            )
                        })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {loading ? <ContentLoader /> : ""}
          {/* {did && did.data.length > 0 ? (
            <PaginationComponent
              pageNumber={(e) => setPageNumber(e)}
              totalPage={did.last_page}
              from={(pageNumber - 1) * did.per_page + 1}
              to={did.to}
              total={did.total}
            />
          ) : (
            ""
          )} */}
        </div>
      </section>
    </main>
  );
}

export default DidListing;
