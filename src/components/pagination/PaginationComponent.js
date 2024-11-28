import React from "react";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  UncontrolledTooltip,
} from "reactstrap"; // Adjust imports based on your library
import { ChevronLeft, ChevronRight } from "react-feather"; // Adjust based on your icon library
import { selectPrimaryColor } from "../../redux/navbar";
import { useSelector } from "react-redux";

const PaginationComponent = ({
  currentPage,
  itemsPerPage,
  totalItems,
  handlePageChange,
  handlePageChangeNo,
}) => {
  const primary_color = useSelector(selectPrimaryColor);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div
      className="d-flex align-items-center"
      style={{
        flexDirection: window.innerWidth < 736 ? "column" : "row",
      }}
    >
      <div>
        <select
          className="form-select"
          onChange={handlePageChangeNo}
          style={{
            width: "150px",
            height: "40px",
            fontSize: "16px",
          }}
        >
          <option value="10">1-10</option>
          <option value="25">1-25</option>
          <option value="50">1-50</option>
          {/* Add additional options if needed */}
        </select>
      </div>
      <div
        style={{
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        <Pagination className="d-flex mt-1">
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink
              previous
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft size={20} id="Prev-btn-folder" />
              <UncontrolledTooltip placement="bottom" target="Prev-btn-folder">
                Previous
              </UncontrolledTooltip>
            </PaginationLink>
          </PaginationItem>
          {currentPage > 3 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem disabled>
                <PaginationLink>...</PaginationLink>
              </PaginationItem>
            </>
          )}
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          <PaginationItem active>
            <PaginationLink
              style={{ backgroundColor: primary_color, color: "white" }}
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          {currentPage < totalPages - 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          {currentPage < totalPages - 2 && (
            <>
              <PaginationItem disabled>
                <PaginationLink>...</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink
              next
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight size={20} id="Next-btn-folder" />
              <UncontrolledTooltip placement="bottom" target="Next-btn-folder">
                Next
              </UncontrolledTooltip>
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationComponent;
