import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, Row, Col, Table } from 'reactstrap'; // Make sure to install reactstrap if you're using it
import { X } from 'react-feather'; // Ensure you have react-feather or use an appropriate icon component
import { formatDateCustomTimelastActivity, formatDateTimeActivityLog } from '../../utility/Utils';
import SpinnerCustom from '../SpinnerCustom';
import { selectLoading, selectLogo } from '../../redux/navbar';
import {useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
import PaginationComponent from '../pagination/PaginationComponent';

const ActivityLogModal = ({ showLog, setShowLog, fileName, activityLogData, loaderData }) => {
  const logo = useSelector(selectLogo);
  const { t } = useTranslation(); 
  const loading = useSelector(selectLoading);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items to display per page
  let allItems = [activityLogData];
  // Calculate the index of the first and last item on the current page
  let indexOfLastItem = currentPage * itemsPerPage;
  let indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let currentItems = 
    allItems.slice(indexOfFirstItem, indexOfLastItem)
  
  const handlePageChangeNo = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);

    //console.log('Page changed to:', pageNumber);
    indexOfLastItem = currentPage * itemsPerPage;
    //console.log(indexOfLastItem);

    indexOfFirstItem = indexOfLastItem - itemsPerPage;
    //console.log(indexOfFirstItem);

    currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);
    //console.log(currentItems);
  };
  useEffect(() => {
    console.log("Loading state:", loading);
    console.log("Logo URL:", logo);
  }, [loading, logo]);
  return (
    <Modal
      isOpen={showLog}
      toggle={() => setShowLog(!showLog)}
      className="modal-dialog-centered modal-fullscreen"
    >
      <ModalBody className="pb-5">
        {window.innerWidth < 768 ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
               {loading ? (
      null // Show loading spinner or placeholder
      ) : (
        <img
          className="fallback-logo"
          src={logo}
          alt="Company Logo"
          style={{ width: '200px', height: '50px',objectFit:"contain" }}
        />
      )}
             
              <X
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => setShowLog(!showLog)}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "left",
                alignItems: "left",
              }}
            >
              <h1 className="fw-bold mt-1">{t("Audit Log")}</h1>
              <h3 className="fw-bold mt-1">{fileName}.pdf</h3>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              {loading ? (
      <SpinnerCustom
        color="primary"
        style={{ width: "3rem", height: "3rem" }}
      />
       // Show loading spinner or placeholder
      ) : (
        <img
          className="fallback-logo"
          src={logo}
          alt="Company Logo"
          style={{ width: '200px', height: '50px',objectFit:"contain"  }}
        />
      )}
              
              |
              <h1 className="fw-bold mt-1" style={{ marginLeft: "20px", marginRight: "20px" }}>
                Audit Log
              </h1>
              |
              <h1 className="fw-bold mt-1" style={{ marginLeft: "20px" }}>
                {fileName}.pdf
              </h1>
            </div>
            <X
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => setShowLog(!showLog)}
            />
          </div>
        )}
        <Row tag="form" className="gy-1 gx-2 mt-75">
          {loaderData ? (
            <Row>
              <Col md="12" xs="12" className="d-flex justify-content-center">
                <SpinnerCustom color="primary" />
              </Col>
            </Row>
          ) : null}
          <Col xs={12}>
            <div style={{ overflowX: "auto" }} className="table-responsive">
              <Table>
                <thead>
                  <tr>
                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>{t("Event")}</h2>
                    </th>
                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>{t("Description")}</h2>
                    </th>
                  
                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>{t("IP Address")}</h2>
                    </th>
                    <th style={{ marginLeft: "20px" }}>
                      <h2 style={{ fontWeight: 700 }}>{t("Timestamp")}</h2>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogData.map((item) => (
                    <tr key={item.file_log_id}>
                      <td style={{ marginLeft: "20px", fontSize: "16px",  whiteSpace: "nowrap", }}>
                        <h2>{item?.event?.split("-").join(" ") || ""}</h2>
                      </td>
                      <td style={{ marginLeft: "20px", fontSize: "16px",  whiteSpace: "nowrap" }}>
                        <h2>
                          {item?.description?.split(/(\S+@\S+\.\S+)/).map((part, index) => (
                            /\S+@\S+\.\S+/.test(part) ? (
                              <span key={index} style={{ fontWeight: 700 }}>
                                {part}
                              </span>
                            ) : (
                              <span key={index}>{part}</span>
                            )
                          ))}
                        </h2>
                      </td>
                     
                      <td style={{ marginLeft: "20px", fontSize: "16px",  whiteSpace: "nowrap", }}>
                        <h2>{item.ip_address}</h2>
                      </td>
                      <td style={{ marginLeft: "20px", fontSize: "16px" ,  whiteSpace: "nowrap",}}>
                        {formatDateTimeActivityLog(item.location_date)}{" "}({item.location_country}) 
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col xs={12}>
          {currentItems.length === 0 ? null : (
                                  <div
                                    style={{
                                      display: "flex",
                                      padding: "5px",
                                      justifyContent: "right",
                                      alignItems: "center",
                                    }}
                                  >
                                    {/* {searchQuery.length === 0 ? ( */}
                                      <>
                                        <PaginationComponent
                                          currentPage={currentPage}
                                          itemsPerPage={itemsPerPage}
                                          totalItems={allItems?.length}
                                          handlePageChange={handlePageChange}
                                          handlePageChangeNo={
                                            handlePageChangeNo
                                          }
                                        />
                                      </>
                                    {/* // ) : (
                                    //   <></>
                                    // )} */}
                                  </div>
                                )}</Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ActivityLogModal;
