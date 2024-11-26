import React from "react";
import { Pagination } from "@mui/material";

function PaginationComponent({
  pageNumber,
  totalPage,
  from,
  to,
  total,
  defaultPage,
}) {
  return (
    <>
      <style>
        {`
        .pagination_slider button{
          color: var(--color-subtext) !important;
        }
        .pagination_slider button[aria-current="true"]{
          color: #fff !important;
        }
      `}
      </style>
      <label style={{ marginRight: 10, fontFamily: 'Roboto', color: 'var(--color-subtext)', fontWeight: 500, fontSize: 14 }}>
        Showing {from} to {to} of {total} Entries.
      </label>
      <Pagination
        className="pagination_slider"
        count={totalPage}
        color="primary"
        onChange={(event, value) => pageNumber(value)}
        defaultPage={defaultPage}
      />
    </>
  );
}

export default PaginationComponent;
