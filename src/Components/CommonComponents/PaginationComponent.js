import React from "react";
import { Pagination } from "@mui/material";

function PaginationComponent({ pageNumber, totalPage, from, to,total }) {
  return (
    <>
    <div className="position-relative">
      <span style={{position: 'absolute', top: 7, right: 15, fontSize: 12, transform: 'translate(-50%)'}}>Showing {from} to {to} of {total} Entries.</span>
      <Pagination
        className="pagination_slider pb-2"
        count={totalPage} 
        color="primary" 
        onChange={(event, value) => pageNumber(value)}
      />
    </div>
    
    </>
  );
}

export default PaginationComponent;
