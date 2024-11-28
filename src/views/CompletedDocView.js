import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Col, Modal, ModalBody, Row, Spinner, Table } from "reactstrap";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Download,
  Image,
  Menu,
  X,
} from "react-feather";
import logoRemoveBg from "@src/assets/images/pages/logoRemoveBg.png";

import { BASE_URL, jpg_image1, post, postFormData } from "../apis/api";

// usama import
import { Rnd } from "react-rnd";
import ComponentForItemTypeComp from "../utility/EditorUtils/EditorTypesPosition.js/CompletedDocView/ComponentForItemType";
import {
  formatDateCustom,
  formatDateCustomTime,
  formatDateCustomTimelastActivity,
  formatDateTime,
  formatDateTimeZone,
  formatDateUSA,
} from "../utility/Utils";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import FullScreenLoader from "../@core/components/ui-loader/full-screenloader";
import * as htmlToImage from "html-to-image";
import CustomButton from "../components/ButtonCustom";
import { useTranslation } from "react-i18next";
import { decrypt } from "../utility/auth-token";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getUser,
  selectLoading,
  selectLogo,
  selectPrimaryColor,
} from "../redux/navbar";

const CompletedDocView = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const logo = useSelector(selectLogo);
  const loading = useSelector(selectLoading);

  const { user, plan, status, error } = useSelector((state) => state.navbar);
  const primary_color = useSelector(selectPrimaryColor);

  const [UniqIdDoc, setUniqIdDoc] = useState("");
  const [downloadLoader, setDownloadLoader] = useState(false);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState("100%");
  const [statusFile, setStatusFile] = useState("");
  const [signersData, setSignersData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);

  // states
  const [endPage, setEndPage] = useState(5);
  const [startPage, setStartPage] = useState(0);
  const colRef = useRef(null);
  // items list append end
  const [loadedPages, setLoadedPages] = useState([1, 2, 3, 4, 5]); // Manage loaded pages
  const [loadingP, setLoadingP] = useState(false); // Loading state
  const scrollContainerRefCol2 = useRef(null); // Ref for the scrollable container inside col 2 (thumbnails)

  const [loadingP8, setLoadingP8] = useState(false); // Loading state
  const [loadedPages8, setLoadedPages8] = useState([1]); // Manage loaded pages
  const observer = useRef(null);

  const loadMorePages8 = () => {
    if (loadedPages8.length >= numPages || loadingP8) return;

    setLoadingP8(true);
    setTimeout(() => {
      setLoadedPages8((prevPages) => {
        const nextPages = Array.from(
          { length: Math.min(5, numPages - prevPages.length) },
          (_, i) => prevPages.length + i + 1
        );

        // Update endPage to reflect the last page of the newly loaded pages
        const newEndPage = prevPages.length + nextPages.length;

        setLoadingP8(false);

        // Return the updated list of pages
        return [...prevPages, ...nextPages];
      });

      // Update the endPage after loading new pages (can be tracked in state)
      setEndPage((prevEndPage) => prevEndPage + 5);
    }, 1000);
  };
  const loadMorePages = () => {
    if (loadedPages.length >= numPages || loadingP) return;

    setLoadingP(true);
    setTimeout(() => {
      setLoadedPages((prevPages) => {
        const nextPages = Array.from(
          { length: Math.min(5, numPages - prevPages.length) },
          (_, i) => prevPages.length + i + 1
        );
        setLoadingP(false);
        return [...prevPages, ...nextPages];
      });
    }, 200);
  };
  const handleScrollCol2 = () => {
    if (!scrollContainerRefCol2.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRefCol2.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMorePages(); // This could be a separate load function if you want to treat it differently
    }
  };
  const loadPagesUntil = (page) => {
    setLoadingP(true);
    setLoadedPages((prevPages) => {
      const newPages = Array.from({ length: page }, (_, i) => i + 1);
      setLoadingP(false);
      return newPages;
    });
  };
  const handleJumpToPage = async (e) => {
    const selectedPage = Number(e.target.value); // Get the selected page
    if (selectedPage > loadedPages[loadedPages.length - 1]) {
      // Load pages up to the selected page if necessary
      await loadPagesUntil(selectedPage);
    }
    setActivePage(selectedPage);
    // handlePageClick(selectedPage);
    setPageNumber(selectedPage);
    if (selectedPage < startPage) {
      setStartPage(selectedPage);
      setEndPage(selectedPage + 4); // Load a new range of pages
    } else if (selectedPage > endPage) {
      setStartPage(selectedPage - 4);
      setEndPage(selectedPage);
    }
    const fullPageElement = document.getElementById(
      `full-page-${selectedPage}`
    );
    if (fullPageElement) {
      fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Scroll the main Col element to the clicked page
    setTimeout(() => {
      const canvasPageElement = canvasRefs.current[selectedPage - 1];
      if (canvasPageElement && colRef.current) {
        const colScrollTop = colRef.current.scrollTop;
        const colOffsetTop = colRef.current.getBoundingClientRect().top;
        const elementOffsetTop = canvasPageElement.getBoundingClientRect().top;
        const scrollToPosition = colScrollTop + elementOffsetTop - colOffsetTop;

        colRef.current.scrollTo({ top: scrollToPosition, behavior: "smooth" });
      }
    }, 1000);
    // const pageNumber = Number(e.target.value); // Get the selected page number
    // setActivePage(pageNumber); // Update the selected page in the state
    // handlePageClick(pageNumber); // Trigger the page click action

    // scrollToPage(pageNumber); // Scroll to the selected page if needed
  };

  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrls2, setImageUrls2] = useState([]);

  const file_id = window.location.pathname.split("/")[3];
  const receipt_email = window.location.pathname.split("/")[4];

  const [type, setType] = useState("");

  const [saveLoading, setsaveLoading] = useState(false);

  const [fileName, setFileName] = useState("");

  const [activePage, setActivePage] = useState(1);
  // end
  const [isLoadingDoc, setIsLoadingDoc] = useState(true);
  const [zoomPercentage, setZoomPercentage] = useState(100);
  // items list append end
  const zoomOptions = [0.5, 0.75, 0.85, 1.0, 1.5, 2.0]; // Zoom levels: 50%, 75%, 100%, 150%, 200%

  const handleZoomChange = (event) => {
    const newScale = parseFloat(event.target.value);
    setScale(newScale);
  };
  const handlePageClick = (page) => {
    // setIsLoadingDoc(true);
    // setTimeout(() => {
    setPageNumber(page);
    if (page < startPage) {
      setStartPage(page);
      setEndPage(page + 4); // Load a new range of pages
    } else if (page > endPage) {
      setStartPage(page - 4);
      setEndPage(page);
    }
    // setActivePage(page);
    // const pageElement = document.getElementById(`page-${page}`);
    // if (pageElement) {
    //   pageElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    // }
    // setActivePage(pageNumber);

    // Find the corresponding full-page view element
    // const fullPageElement = document.getElementById(`full-page-${page}`);

    // // Scroll the full-page view to the clicked page
    // if (fullPageElement) {
    //   fullPageElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    // }
    const fullPageElement = document.getElementById(`full-page-${page}`);
    if (fullPageElement) {
      fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Scroll the main Col element to the clicked page
    const canvasPageElement = canvasRefs.current[page - 1];
    if (canvasPageElement && colRef.current) {
      const colScrollTop = colRef.current.scrollTop;
      const colOffsetTop = colRef.current.getBoundingClientRect().top;
      const elementOffsetTop = canvasPageElement.getBoundingClientRect().top;
      const scrollToPosition = colScrollTop + elementOffsetTop - colOffsetTop;

      colRef.current.scrollTo({ top: scrollToPosition, behavior: "smooth" });
    }
    // setIsLoadingDoc(false);
    // }, 1000);
  };
  // Define the dropdownOpen state

  const fetchData = async (fileId) => {
    // get Images from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post("file/getbgImagesByFileId", postData); // Specify the endpoint you want to call
    console.log("apixxsData");

    console.log(apiData);
    if (apiData.error) {
    } else {
      setImageUrls(apiData?.result[0]?.inprocess_doc);
      setImageUrls2(apiData?.result[0]?.image);
    }
  };
  // fetch positions
  const fetchDataPositions = async (fileId) => {
    // get positions from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post("file/getallPositionsFromFile_Id", postData); // Specify the endpoint you want to call
    //console.log('Position Data');

    //console.log(apiData);
    if (apiData.error) {
    } else {
      //console.log('positions');
      //console.log(apiData.result);

      setTextItems(apiData.result[0].position_array);
    }
  };
  const [User_id_created, setUser_id_created] = useState("");
  const [created_at_doc, setCreated_at_doc] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [securedShare, setSecuredShare] = useState(false);
  const [signerFunctionalControls, setSignerFunctionalControls] =
    useState(false);

  // Fetch File
  const fetchFileData = async (fileId) => {
    // get Images from db
    const postData = {
      file_id: fileId,
      user_id: user?.user_id,
    };
    const apiData = await post("file/get-file", postData); // Specify the endpoint you want to call
    console.log("File Dta Fetch");

    console.log(apiData);
    if (apiData.error) {
      window.location.href = "/error";
      // toastAlert("error", "No File exist")
    } else {
      // toastAlert("success", "File exist")
      setFileName(apiData.data.name || "");
      setUniqIdDoc(apiData.data.uniq_id);
      setUser_id_created(apiData.data.user_id);
      setCreated_at_doc(apiData?.data?.uploaded_at || "");
      //console.log(apiData.data.only_signer);
      // setOnlySigner(apiData.data.only_signer || false);
      setEmailMessage(apiData.data.email_message || "");
      setEmailSubject(apiData.data.name);
      setSecuredShare(apiData.data.secured_share || false);
      setSignerFunctionalControls(
        apiData.data.signer_functional_controls || false
      );
      // setSetEsignOrder(apiData.data.esign_order || false);
      setStatusFile(apiData.data.status);
      //console.log(apiData.data.status);
    }
  };

  const [isOpenCanvas, setIsOpenCanvas] = useState(false);
  const [isOpenCanvasPages, setIsOpenCanvasPages] = useState(false);

  // end
  const canvasRef = useRef();
  const [RecipientsData, setRecipientsData] = useState([]);

  const fetchSignerData = async () => {
    const postData = {
      file_id: file_id,
    };
    try {
      const apiData = await post("file/getAllSignersByFileId", postData); // Specify the endpoint you want to call
      //console.log('Signers ');

      //console.log(apiData);
      if (apiData.error) {
        setSignersData([]);
      } else {
        setSignersData(apiData.result);
        // setSelectedSigner(apiData.result[0]);
        // setCount(apiData.result.length);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const [ContinueModal1, setContinueModal1] = useState(false);
  const fetchRecipientsData = async () => {
    const postData = {
      file_id: file_id,
    };
    try {
      const apiData = await post("file/getAllRecipientsByFileId", postData); // Specify the endpoint you want to call
      //console.log('Recipients');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === "true") {
        setRecipientsData([]);
        // setCountReceipient(apiData.result.length);
      } else {
        setRecipientsData(apiData.result);
        // setCountReceipient(apiData.result.length);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  const [receiptView, setReceiptView] = useState(false);
  const fetchRecipientLog = async (fileId) => {
    const location = await getUserLocation();

    // get Images from db
    const postData = {
      file_id: fileId,
      receipt_email: receipt_email,
      location_country: location?.country,
      ip_address: location?.ip,
      location_date: location?.date,
      timezone: location?.timezone,
    };
    const apiData = await post("file/recipient-log-maintain", postData); // Specify the endpoint you want to call
    //console.log('apixxsData');

    //console.log(apiData);
  };
  const [ActivityLogData, setActivityLogData] = useState([]);
  const [LoaderDataIP, setLoaderDataIP] = useState(false);

  const getActivityLog = async (file_id) => {
    setLoaderDataIP(true);
    //console.log('Activity Log ');
    const postData = {
      file_id: file_id,
    };
    const apiData1 = await post("file/getFileActivityLog", postData); // Specify the endpoint you want to call
    //console.log('apiData1');

    //console.log(apiData1);
    if (apiData1.data.length === 0) {
      setLoaderDataIP(false);
      toastAlert("error", "No Activity Log Added");
    } else {
      // const formattedData = await Promise.all(
      //   apiData1.data.map(async item => {
      //     const formattedDate = await formatDateTimeZone(item.location_date, item.ip_address);
      //     // const timeZone=userTimezone?.timezone

      //     return {...item, formattedDate: formattedDate.dateTime, timeZone: formattedDate?.timeZone};
      //   }),
      // );
      setLoaderDataIP(false);
      console.log(apiData1.data);
      setActivityLogData(apiData1.data); // Set the state with formatted data

      // setActivityLogData(formattedData); // Set the state with formatted data
    }
  };
  const [ActivityLogHide, setActivityLogHide] = useState(false);
  const [locationIP, setLocationIP] = useState("");
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [canvasHeight, setCanvasHeight] = useState(0);
  useEffect(() => {
    console.log("suydsjhgf");
    console.log(status);

    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            fetchData(file_id),
            fetchFileData(file_id),
            fetchDataPositions(file_id),
            fetchSignerData(file_id),
            fetchRecipientsData(file_id),
          ]);
          if (receipt_email === null || receipt_email === undefined) {
            //console.log('no receipt ');
            getActivityLog(file_id);
            setActivityLogHide(false);
          } else {
            setActivityLogHide(true);
            getActivityLog(file_id);
            //console.log('receipt');
            setReceiptView(true);
            //console.log('RECIPIENT');
            //console.log(receipt_email);
            fetchRecipientLog(file_id);
          }
          getLocatinIPn();

          if (window.innerWidth < 786) {
            setIsSmallScreen(true);
          } else {
            setIsSmallScreen(false);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoaded(false);
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user, status]);

  useEffect(() => {
    const encryptedData = localStorage.getItem("user_data");
    console.log("encryptedData");

    console.log(encryptedData);
    if (encryptedData) {
      try {
        const decryptedData = JSON.parse(decrypt(encryptedData));
        const { token, user_id } = decryptedData;
        console.log(decryptedData);

        // Fetch user data if not already available in Redux state
        if (token && user_id && !user) {
          dispatch(getUser({ user_id, token }));
        }
      } catch (error) {
        console.error("Error processing token data:", error);
      }
    }
  }, [dispatch, user]);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoadingDoc(false);
    const pagesArray = Array.from(
      { length: numPages },
      (_, index) => index + 1
    );

    console.log(pagesArray);
    if (numPages < 5) {
      setLoadedPages(pagesArray);
      setEndPage(numPages);
    }
  };
  const canvasRefs = useRef([]);
  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
  };
  const handleDownloadPDF1 = async () => {
    setDownloadLoader(true);
    const response = await fetch(`${imageUrls2}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadLoader(false);
  };
  const handleDownloadPDF = async () => {
    // setDownloadLoader(true);
    setDownloadPdfLoader(true);
    const response = await fetch(`${imageUrls}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadLoader(false);
    setDownloadPdfLoader(false);
  };
  const [scale, setScale] = useState(window.innerWidth < 730 ? 0.85 : 1.5);

  const [doenloadPdfLoader, setDownloadPdfLoader] = useState(false);

  const [ContinueModal, setContinueModal] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRefCol2.current;

    if (scrollContainer) {
      console.log("SCROLL ERRORS scrollContainerRefCol2");

      // Add scroll event listener for col 2 container (thumbnails)
      scrollContainer.addEventListener("scroll", handleScrollCol2);

      return () => {
        if (scrollContainerRefCol2.current) {
          scrollContainerRefCol2.current.removeEventListener(
            "scroll",
            handleScrollCol2
          );
        }
      };
    }
  }, [loadedPages, numPages]);
  useEffect(() => {
    // IntersectionObserver to detect when the endPage is in view
    const pageElement = document.getElementById(`full-page-${endPage}`);
    if (pageElement) {
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadMorePages8(); // Load more pages when endPage is in view
              setEndPage((prevEndPage) => prevEndPage + 5); // Update endPage to the next 5 pages
            }
          });
        },
        {
          rootMargin: "0px",
          threshold: 0.5, // Trigger when 50% of the page is visible
        }
      );

      observer.current.observe(pageElement);
    }

    // Cleanup observer on component unmount
    return () => {
      if (observer.current && pageElement) {
        observer.current.unobserve(pageElement);
      }
    };
  }, [endPage, loadedPages8, loadingP8, numPages, setLoadedPages8]);

  return (
    <>
      {isLoaded ? <FullScreenLoader /> : null}
      {isSmallScreen ? (
        <>
          <Row>
            <Col
              xl={12}
              md={12}
              sm={12}
              style={{
                // position: 'fixed',
                // top: 0,
                // left: 0,
                width: "100%",
                zIndex: 999,
                borderBottom: "1px solid #ececec",
                // background: 'white',
              }}
            >
              <Row>
                <Col
                  xl={12}
                  md={12}
                  sm={12}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBlock: "0.2%",
                    paddingInline: "2%",
                  }}
                >
                  {/* back button
                   */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ marginLeft: "20px" }}>
                      <Menu
                        size={20}
                        onClick={() => setContinueModal1(!ContinueModal1)}
                      />
                    </div>
                    {receiptView ? null : (
                      <ArrowLeft
                        size={20}
                        style={{ marginLeft: "10px" }}
                        onClick={async () => {
                          window.location.href = `/home`;
                        }}
                      />
                    )}
                    {loading ? null : (
                      <img
                        src={logo}
                        style={{
                          width: "100px",
                          height: "50px",
                          objectFit: "contain",
                          marginLeft: "20px",
                          marginRight: "20px",
                        }}
                      />
                    )}
                    <h4
                      className="fw-bold"
                      style={{ marginLeft: "10px", marginTop: "5px" }}
                    >
                      {fileName.length > 10
                        ? fileName.substring(0, 10) + "..."
                        : fileName}
                      .pdf
                    </h4>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Row>
                <Col
                  xs={12}
                  md={12}
                  style={{
                    cursor:
                      type === "my_text" || type === "signer_text"
                        ? "none"
                        : type
                        ? "none"
                        : "default",
                    border: "1px solid lightGrey",
                    // maxHeight: "92dvh",
                    paddingTop: "10px",
                    overflow: "auto",
                  }}
                >
                  {isLoadingDoc && ( // Conditionally render spinner if isLoading is true
                    <div style={{ display: "flex", justifyContent: "right" }}>
                      <Spinner />
                    </div>
                  )}
                  <div
                    style={{
                      position: "relative",
                      marginBottom: "130px",
                      // height: "90dvh",
                      // height:window.innerWidth
                      // transform: `scale(${zoomPercentage / 100})`,
                      // transformOrigin: "top left",
                      padding: "10px",
                    }}
                  >
                    <Document
                      // style={{ width: "100%", height: "100%" }}
                      file={`${imageUrls}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onError={onDocumentLoadError}
                    >
                      {Array.from({ length: numPages }, (_, i) => i + 1).map(
                        (page) => (
                          <>
                            <div
                              style={{ position: "relative" }}
                              //  id={`full-page-${page}`} style={{position: 'relative'}}
                            >
                              <Page
                                scale={scale}
                                onLoadSuccess={({ width }) => {
                                  setCanvasWidth(width);
                                }}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                key={page}
                                pageNumber={page}
                                onClick={() => setPageNumber(page)}
                                canvasRef={(ref) =>
                                  (canvasRefs.current[page - 1] = ref)
                                }
                              ></Page>
                              <h6
                                style={{
                                  marginBlock: "10px",
                                  textAlign: "left",
                                }}
                              >
                                {" "}
                                Page {page}
                              </h6>{" "}
                            </div>{" "}
                          </>
                        )
                      )}
                    </Document>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          {isLoaded === false && ContinueModal1 === false && (
            <div
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "white",
                zIndex: 22222222222222,
                width: parseInt(window.innerWidth),
                overflowX: "scroll",
                overflowY: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                justifyContent: "left",

                borderTop: ".5px solid lightGrey",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  alignItems: "center",
                }}
              >
                <div></div>
                {/* <Button
                      // disabled={saveLoading}
                      color="primary"
                      size="sm"
                      onClick={handleDownloadPDF}
                      style={{
                        display: "flex",
                        boxShadow: "none",
                        justifyContent: "center",
                        marginRight: "10px",
                        alignItems: "center",
                      }}
                      className="btn-icon d-flex"
                    >
                      <span
                        style={{ fontSize: "16px", letterSpacing: ".5px" }}
                        className="align-middle ms-25"
                      >
                        Download
                      </span>
                    </Button> */}
                <select
                  style={{
                    border: "1px solid lightGrey",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                  value={scale}
                  id="zoom"
                  onChange={handleZoomChange}
                >
                  {zoomOptions.map((option) => (
                    <option key={option} value={option}>
                      {option * 100}%
                    </option>
                  ))}
                </select>
                <Button
                  // disabled={saveLoading}
                  color="primary"
                  size="sm"
                  onClick={handleDownloadPDF}
                  style={{
                    display: "flex",
                    boxShadow: "none",
                    justifyContent: "center",
                    marginRight: "10px",
                    alignItems: "center",
                  }}
                  className="btn-icon d-flex"
                >
                  <span
                    style={{ fontSize: "16px", letterSpacing: ".5px" }}
                    className="align-middle ms-25"
                  >
                    Download
                  </span>
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <Row>
            <Col
              xl={12}
              md={12}
              sm={12}
              style={{
                // position: 'fixed',
                // top: 0,
                // left: 0,
                width: "100%",
                zIndex: 999,
                borderBottom: "1px solid #ececec",
                backgroundColor: "white",
              }}
            >
              <Row>
                <Col
                  xl={12}
                  md={12}
                  sm={12}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBlock: "0.2%",
                    paddingInline: "2%",
                  }}
                >
                  {/* back button
                   */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {receiptView ? null : (
                      <CustomButton
                        padding={true}
                        useDefaultColor={true}
                        size="sm"
                        // disabled={saveLoading}
                        color="primary"
                        // disabled={downloadLoader}
                        onClick={async () => {
                          window.location.href = `/home`;
                        }}
                        style={{
                          display: "flex",
                          boxShadow: "none",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        className="btn-icon d-flex"
                        text={
                          <>
                            {/* {downloadLoader ? <Spinner color="white" size="sm" /> : null} */}
                            <span className="align-middle ms-25">
                              {t("Back")}
                            </span>
                          </>
                        }
                      />
                    )}
                    {loading ? null : (
                      <img
                        src={logo}
                        style={{
                          width: "160px",
                          height: "50px",
                          objectFit: "contain",
                          marginLeft: "20px",
                          marginRight: "20px",
                        }}
                      />
                    )}
                    <h2
                      className="fw-bold"
                      style={{ marginLeft: "10px", marginTop: "5px" }}
                    >
                      {fileName}.pdf
                    </h2>
                  </div>
                  <div>
                    <select
                      style={{
                        border: "none",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                      value={scale}
                      id="zoom"
                      onChange={handleZoomChange}
                    >
                      {zoomOptions.map((option) => (
                        <option key={option} value={option}>
                          {option * 100}%
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* <div>{saveLoading ? <h4>Saving ...</h4> : null}</div> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "right",
                      alignItems: "center",
                    }}
                  >
                    <CustomButton
                      padding={true}
                      size="sm"
                      useDefaultColor={false}
                      color="orange"
                      disabled={downloadLoader}
                      onClick={handleDownloadPDF1}
                      style={{
                        display: "flex",
                        boxShadow: "none",
                        justifyContent: "center",
                        marginRight: "5px",
                        alignItems: "center",
                      }}
                      className="btn-icon d-flex"
                      text={
                        <>
                          {downloadLoader ? (
                            <Spinner color="white" size="sm" />
                          ) : null}
                          <span className="align-middle ms-25">
                            {t("Download Original")}
                          </span>
                        </>
                      }
                    />
                    {/* <Button
                      // disabled={saveLoading}
                      color="primary"
                      onClick={handleDownloadPDF}
                      style={{
                        display: 'flex',
                        boxShadow: 'none',
                        justifyContent: 'center',
                        marginRight: '10px',
                        alignItems: 'center',
                      }}
                      className="btn-icon d-flex">
                      <span style={{fontSize: '16px', letterSpacing: '.5px'}} className="align-middle ms-25">
                        Download Original
                      </span>
                    </Button> */}
                    {statusFile === "Completed" ? (
                      <CustomButton
                        padding={true}
                        size="sm"
                        disabled={doenloadPdfLoader}
                        color="primary"
                        onClick={handleDownloadPDF}
                        style={{
                          display: "flex",
                          boxShadow: "none",
                          justifyContent: "center",
                          marginRight: "5px",
                          alignItems: "center",
                        }}
                        className="btn-icon d-flex"
                        text={
                          <>
                            {" "}
                            {doenloadPdfLoader ? <Spinner size="sm" /> : null}
                            <span className="align-middle ms-25">
                              {t("Download Completed")}
                            </span>
                          </>
                        }
                      />
                    ) : null}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={12}>
              <Row id={`full-page-${pageNumber}`}>
                <Col
                  xs={2}
                  style={
                    {
                      // backgroundColor: 'white',
                      // marginLeft: 5,
                    }
                  }
                >
                  <div style={{ padding: "10px" }}>
                    {/* <h3>From Rimsha Riaz</h3> */}
                    <h3>
                      Sent on {formatDateCustomTimelastActivity(created_at_doc)}
                    </h3>
                    <h3>
                      {/* {statusFile==="InProgress"?<>
              <Clock size={15}/>
              <span>In Progress</span>
              </>:null} */}
                      {statusFile === "WaitingForOthers" ? (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "left",
                              alignItems: "center",
                            }}
                          >
                            <Clock size={15} />
                            <span style={{ marginLeft: "5px" }}>
                              Waiting for others
                            </span>
                          </div>
                        </>
                      ) : null}

                      {/* {statusFile==="WaitingForOthers"?<>
              <Users size={15}/>
              <span>Waiting for me</span>
              </>:null} */}
                    </h3>
                  </div>
                  <div style={{ borderBottom: "1px solid lightGrey" }}></div>

                  <div style={{ padding: "10px" }}>
                    <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                      Signers
                    </h2>
                    {signersData.length === 0 ? null : (
                      <>
                        {signersData.map((signer, index) => (
                          <div
                            style={{
                              // display: 'flex',
                              // justifyContent: 'space-between',
                              // alignItems: 'center',
                              borderBottom: "1px solid LightGrey",
                              paddingBlock: "10px",
                            }}
                          >
                            <div>
                              {/* <h3 className="fw-bold">{signer.name}</h3> */}
                              <h3>{signer.email}</h3>
                            </div>
                            <div>
                              <h3>
                                {signer.completed_status === null ||
                                signer.completed_status === undefined ? (
                                  "Needs to sign"
                                ) : (
                                  <>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "left",
                                        alignItems: "center",
                                      }}
                                    >
                                      <CheckCircle
                                        size={15}
                                        style={{ color: "green" }}
                                      />
                                      <h3
                                        style={{
                                          marginLeft: "10px",
                                          fontWeight: 700,
                                        }}
                                      >
                                        Completed
                                      </h3>
                                    </div>
                                  </>
                                )}
                              </h3>
                              <h3>
                                {signer.completed_status === null ||
                                signer.completed_status === undefined ? null : (
                                  <>
                                    {formatDateCustomTimelastActivity(
                                      signer.completed_at
                                    )}
                                  </>
                                )}
                              </h3>
                            </div>
                          </div>
                        ))}{" "}
                      </>
                    )}

                    {RecipientsData.length === 0 ? null : (
                      <>
                        <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                          Recipient
                        </h2>
                        {RecipientsData.map((signer, index) => (
                          <div
                            style={{
                              // display: 'flex',
                              // justifyContent: 'space-between',
                              alignItems: "center",
                              borderBottom: "1px solid LightGrey",
                              paddingBlock: "10px",
                            }}
                          >
                            <div>
                              {/* <h3 className="fw-bold">{signer.name}</h3> */}
                              <h3>{signer.email}</h3>
                            </div>
                          </div>
                        ))}{" "}
                      </>
                    )}
                    <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                      Message
                    </h2>
                    <h3 style={{ marginBlock: "2%" }}>{emailMessage}</h3>
                  </div>
                </Col>

                <Col
                  xs={8}
                  style={{
                    cursor:
                      type === "my_text" || type === "signer_text"
                        ? "none"
                        : type
                        ? "none"
                        : "default",
                    // border: '1px solid lightGrey',
                    backgroundColor: "#eaeaea",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // height: '93dvh',
                    paddingTop: "10px",
                    overflow: "auto",
                    // paddingBottom: '20px',
                  }}
                >
                  {/* editor  */}
                  {isLoadingDoc && ( // Conditionally render spinner if isLoading is true
                    <div style={{ display: "flex", justifyContent: "right" }}>
                      {/* Render your spinner component */}
                      <Spinner />
                    </div>
                  )}

                  <div
                    style={{
                      height: "92dvh",
                      position: "relative",
                      // transform: `scale(${zoomPercentage / 100})`,
                      // transformOrigin: 'top left',
                    }}
                  >
                    <Document
                      file={`${imageUrls}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onError={onDocumentLoadError} // Add this line
                    >
                      {/* <Page
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    pageNumber={pageNumber}
                    width={canvasWidth}
                  /> */}

                      {Array.from({ length: numPages }, (_, i) => i + 1)
                        .slice(0, endPage) // Only render a specific range of pages
                        .map((page) => (
                          <>
                            <div
                              key={page}
                              id={`full-page-${page}`}
                              style={{ position: "relative" }}
                            >
                              <Page
                                scale={scale}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                key={page}
                                onLoadSuccess={({ width, height }) => {
                                  setCanvasWidth(width);
                                }}
                                onMouseEnter={() => {
                                
                                  console.log("page",page)
                       
                         setActivePage(page)
                         setPageNumber(page)
                         // Ensure the thumbnail scrolls into view in Col 2
  const thumbnailElement = document.getElementById(`thumbnail-page-${page}`);
  if (thumbnailElement && scrollContainerRefCol2.current) {
    // Fallback to manual scroll if `scrollIntoView` fails
    thumbnailElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }
                                }}
                                pageNumber={page}
                                // width={canvasWidth}
                                // className={activePage === page ? 'active-page' : ''}
                                // onClick={() => handlePageClick(page)}
                              ></Page>
                              <h6
                                style={{
                                  marginBlock: "10px",
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                Page {page}
                              </h6>{" "}
                            </div>{" "}
                          </>
                        ))}
                    </Document>
                    {/* </div> */}
                  </div>
                  {/* {ActivityLogHide?null:<> */}

                  {/* </>} */}
                </Col>
                <Col
                  xs={2}
                  style={{
                    position: "relative",
                    backgroundColor: "white",
                    border: ".5px solid lightGrey",
                    maxHeight: "93dvh",
                    overflow: "auto",
                  }}
                >
                  {/* Pages  */}

                  <div
                    ref={scrollContainerRefCol2}
                    style={{ overflowY: "auto", maxHeight: "93dvh" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        marginTop: "25px",
                      }}
                    >
                      <Document
                        file={`${imageUrls}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        noData="No PDF loaded"
                      >
                        {loadedPages.map((page) => (
                          <>
                            <div
                                        id={`thumbnail-page-${page}`}

                              // id={`full-page-${page}`}
                              key={page}
                              style={{
                                border:
                                  pageNumber === page
                                    ? `1px solid ${primary_color}`
                                    : "1px solid lightGrey",
                                // borderRadius: '10px',
                                overflow: "hidden",
                                cursor: "pointer",
                              }}
                              onMouseEnter={(e) => {
                                if (pageNumber !== page) {
                                  e.target.style.border = "1px solid #c4c4c4";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (pageNumber !== page) {
                                  e.target.style.border = "1px solid white";
                                }
                              }}
                              onClick={() => handlePageClick(page)}
                            >
                              <Page
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                key={page}
                                pageNumber={page}
                                width={180}
                                className={
                                  activePage === page ? "active-page" : ""
                                }
                                // onClick={() => handlePageClick(page)}
                              ></Page>
                            </div>
                            <h5
                              style={{
                                marginBlock: "10px",
                                textAlign: "center",
                              }}
                            >
                              {" "}
                              Page {page}
                            </h5>{" "}
                          </>
                        ))}
                        {loadingP && (
                          <div
                            style={{
                              textAlign: "center",
                              fontSize: "12px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Spinner />
                            </div>
                          </div>
                        )}
                      </Document>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}
      <Modal
        isOpen={ContinueModal}
        toggle={() => setContinueModal(!ContinueModal)}
        className="modal-dialog-centered modal-lg "
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignatureModal(!ContinueModal)}></ModalHeader> */}
        <ModalBody className=" pb-2 pt-2">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h1>Select an Action</h1>
            <X
              size={20}
              onClick={() => {
                setContinueModal(!ContinueModal);
              }}
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="sm"
              style={{
                marginTop: "10px",
                width: "80%",
              }}
              color="warning"
              onClick={handleDownloadPDF1}
            >
              <Download size={15} />

              <span
                style={{ fontSize: "16px", marginLeft: "10px" }}
                className="align-middle ms-25"
              >
                Download Original
              </span>
            </Button>
            {statusFile === "Completed" ? (
              <Button
                size="sm"
                style={{
                  marginTop: "10px",
                  width: "80%",
                }}
                color="primary"
                // disabled={doenloadPdfLoader}
                onClick={handleDownloadPDF}
              >
                {doenloadPdfLoader ? (
                  <Spinner color="white" size="sm" />
                ) : (
                  <Download size={15} />
                )}
                <span
                  style={{ fontSize: "16px", marginLeft: "10px" }}
                  className="align-middle ms-25"
                >
                  Download Completed
                </span>
              </Button>
            ) : null}
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={ContinueModal1}
        toggle={() => setContinueModal1(!ContinueModal1)}
        className="modal-dialog-centered　modal-fullscreen"
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' toggle={() => setSignatureModal(!ContinueModal)}></ModalHeader> */}
        <ModalBody className=" pb-2 pt-2">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h1>File Details</h1>
            <X
              size={20}
              onClick={() => {
                setContinueModal1(!ContinueModal1);
              }}
              style={{
                cursor: "pointer",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              {/* <h3>From Rimsha Riaz</h3> */}
              <h3>Sent on {formatDateTime(created_at_doc, locationIP)}</h3>
              <h3>
                {/* {statusFile==="InProgress"?<>
              <Clock size={15}/>
              <span>In Progress</span>
              </>:null} */}
                {statusFile === "WaitingForOthers" ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <Clock size={15} />
                      <span style={{ marginLeft: "5px" }}>
                        Waiting for others
                      </span>
                    </div>
                  </>
                ) : null}

                {/* {statusFile==="WaitingForOthers"?<>
              <Users size={15}/>
              <span>Waiting for me</span>
              </>:null} */}
              </h3>
            </div>
            <div style={{ borderBottom: "1px solid lightGrey" }}></div>

            <div style={{ padding: "10px" }}>
              <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                Signers
              </h2>
              {signersData.length === 0 ? null : (
                <>
                  {signersData.map((signer, index) => (
                    <div
                      style={{
                        // display: 'flex',
                        // justifyContent: 'space-between',
                        // alignItems: 'center',
                        borderBottom: "1px solid LightGrey",
                        // paddingBlock: '10px',
                      }}
                    >
                      <div>
                        {/* <h3 className="fw-bold">{signer.name}</h3> */}
                        <h3>{signer.email}</h3>
                      </div>
                      <div>
                        <h3>
                          {signer.completed_status === null ||
                          signer.completed_status === undefined ? (
                            "Needs to sign"
                          ) : (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "left",
                                  alignItems: "center",
                                }}
                              >
                                <CheckCircle
                                  size={15}
                                  style={{ color: "green" }}
                                />
                                <h3
                                  style={{
                                    marginLeft: "10px",
                                    fontWeight: 700,
                                  }}
                                >
                                  Completed
                                </h3>
                              </div>
                            </>
                          )}
                        </h3>
                        <h3>
                          {signer.completed_status === null ||
                          signer.completed_status === undefined ? null : (
                            <>
                              {formatDateTime(signer.completed_at, locationIP)}
                            </>
                          )}
                        </h3>
                      </div>
                    </div>
                  ))}{" "}
                </>
              )}

              {RecipientsData.length === 0 ? null : (
                <>
                  <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                    Recipient
                  </h2>
                  {RecipientsData.map((signer, index) => (
                    <div
                      style={{
                        // display: 'flex',
                        // justifyContent: 'space-between',
                        alignItems: "center",
                        borderBottom: "1px solid LightGrey",
                        paddingBlock: "10px",
                      }}
                    >
                      <div>
                        {/* <h3 className="fw-bold">{signer.name}</h3> */}
                        <h3>{signer.email}</h3>
                      </div>
                    </div>
                  ))}{" "}
                </>
              )}
              <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                Message
              </h2>
              <h3 style={{ marginBlock: "2%" }}>{emailMessage}</h3>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CompletedDocView;
