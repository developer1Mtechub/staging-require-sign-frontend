import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Button,
  ButtonDropdown,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Clock,
  Image,
  Menu,
  X,
} from "react-feather";
import logoRemoveBgFull from "@src/assets/images/pages/logoRemoveBg.png";

// import {PDFDocument, rgb} from 'pdf-lib';
// import 'react-resizable/css/styles.css';

import { BASE_URL, jpg_image1, post } from "../apis/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { formatDateCustomTimelastActivity } from "../utility/Utils";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import FullScreenLoader from "../@core/components/ui-loader/full-screenloader";
import CustomButton from "../components/ButtonCustom";
import { decrypt } from "../utility/auth-token";
import { getUser, selectLoading, selectLogo } from "../redux/navbar";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const ViewDocBulkLinkNReceiver = () => {
  const [ActivityLogData, setActivityLogData] = useState([]);
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.navbar);
  const logo = useSelector(selectLogo);
  // const loading = useSelector(selectLoading);
const [loading,setLoading]=useState(true)
const [companyLogo,setCompanyLogo]=useState(logo)
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState("100%");
  const [signersData, setSignersData] = useState([]);

  // states

  const [imageUrls, setImageUrls] = useState([]);
  const file_id = window.location.pathname.split("/")[2];
  const zoomOptions = [0.5, 0.75, 0.85, 1.0, 1.5, 2.0]; // Zoom levels: 50%, 75%, 100%, 150%, 200%

  const [type, setType] = useState("");

  const [saveLoading, setsaveLoading] = useState(false);

  const [fileName, setFileName] = useState("");
  const [selectedSigner, setSelectedSigner] = useState([]);

  const [activePage, setActivePage] = useState(1);
  // end
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [zoomPercentage, setZoomPercentage] = useState(100);
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
  // end
  // items list append end
  const handleZoomChange = (event) => {
    const newScale = parseFloat(event.target.value);
    setScale(newScale);
  };
  const handlePageClick = (page) => {
    // setIsLoadingDoc(true);
    // setTimeout(() => {
    setPageNumber(page);

    // setActivePage(page);
    // const pageElement = document.getElementById(`page-${page}`);
    // if (pageElement) {
    //   pageElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    // }
    // setActivePage(pageNumber);

    // Find the corresponding full-page view element
    const fullPageElement = document.getElementById(`full-page-${page}`);

    // Scroll the full-page view to the clicked page
    if (fullPageElement) {
      fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // setIsLoadingDoc(false);
    // }, 1000);
  };

  const [created_at_doc, setCreated_at_doc] = useState("");

  const [tileDoc, setTitleDoc] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [ackMessage, setAckMessage] = useState("");
  const [linkResponseLimit, setLinkResponseLimit] = useState("");
  const [linkLimitNo, setLinkLimitNo] = useState("");
  const [emailVerification, setEmailVerification] = useState("");
  const [expiredLinkCurrent, setExpiredLinkCurrent] = useState("");
  const [expiredAt, setExpiredAt] = useState("");
  const [allowDownloadAfterSubmission, setAllowDownloadAfterSubmission] =
    useState("");
  const [receiveCopyEmail, setReceiveCopyEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const [originaldoc, setOriginaldoc] = useState("");
  // Fetch File
  const fetchFileData = async (fileId, params) => {
    console.log("sdfhgsjhdfgsdf");
    console.log("____________");

    // setImageUrls(apiData.result[0].image);
    // get Images from db
    //console.log(fileId);
    const postData = {
      bulk_link_id: fileId,
      user_id: user?.user_id,
    };
    const apiData = await post("bulk_links/viewBulkLinkEditor", postData); // Specify the endpoint you want to call
    console.log("File Bulk Link Fetch");

    console.log(apiData);
    if (apiData.error) {
      // window.location.href = "/error";
      // toastAlert("error", "No File exist")
    } else {
      // toastAlert("success", "File exist")
      setFileName(apiData.result.file_name || "");
      if(apiData?.sender?.logo===null){
setCompanyLogo(logo)
setLoading(false)
      }else{
        setCompanyLogo(apiData?.sender?.logo)
        setLoading(false)

      }
      // setUniqIdDoc(apiData.data.uniq_id);
      // setUser_id_created(apiData.data.user_id);
      setCreated_at_doc(apiData.result.created_at);
      setOriginaldoc(apiData.result.file_url);

      if (
        apiData.response_data.length === 0 ||
        apiData.response_data === null ||
        apiData.response_data === undefined
      ) {
        setTextItems([]);
        setSignersData([]);
        setSelectedSigner(null);
      } else {
        // params
        console.log(params);
        if (params === null || params === undefined || params === "") {
          setSignersData(apiData.response_data);
          // setTextItems(apiData.response_data[0].position_array);
          setSelectedSigner(apiData.response_data[0]);
          setImageUrls(apiData.response_data[0].pdf_link);

          // pdf_link
          //console.log(apiData.response_data[0].email);
          // await getActivityLog(fileId, params, apiData.response_data[0].email);
        } else {
          //console.log(params);
          let ArrayObj = apiData.response_data;

          // const filteredData = ArrayObj.filter(item => parseInt(item.template_responses_id) === parseInt(params));
          //console.log('filteredData');
          setSignersData(apiData.response_data);
          const filteredIndex = apiData.response_data.findIndex(
            (item) => parseInt(item.bulk_link_response_id) === parseInt(params)
          );

          // //console.log(filteredData)
          // setFileName(apiData.response_data[filteredIndex].title || '');

          // setTextItems(apiData?.response_data[filteredIndex]?.position_array);
          setSelectedSigner(apiData.response_data[filteredIndex]);
          setImageUrls(apiData.response_data[filteredIndex].pdf_link);

          // await getActivityLog(fileId, params, apiData.response_data[filteredIndex].email);
        }
      }

      setTitleDoc(apiData.result.title);
      setWelcomeMessage(apiData.result.welcome_message);
      setAckMessage(apiData.result.acknowledgement_message);
      setLinkResponseLimit(apiData.result.limit_responses);
      setLinkLimitNo(apiData.result.link_response_limit);
      setEmailVerification(apiData.result.user_email_verification);
      setExpiredLinkCurrent(apiData.result.expires_option);
      setExpiredAt(apiData.result.expiry_date);
      setAllowDownloadAfterSubmission(
        apiData.result.allow_download_after_submission
      );
      setReceiveCopyEmail(apiData.result.users_receive_copy_in_email);

      // //console.log(apiData.data.only_signer);
      // setOnlySigner(apiData.data.only_signer || false);
      // setEmailMessage(apiData.data.email_message || '');
      // setEmailSubject(apiData.data.name);
      // setSecuredShare(apiData.data.secured_share || false);
      // setSignerFunctionalControls(apiData.data.signer_functional_controls || false);
      // // setSetEsignOrder(apiData.data.esign_order || false);
      // setStatusFile(apiData.data.status);
      // //console.log(apiData.data.status);
      setIsLoaded(false);
    }
  };

  const [isOpenCanvas, setIsOpenCanvas] = useState(false);
  const [isOpenCanvasPages, setIsOpenCanvasPages] = useState(false);

  // end
  const canvasRef = useRef();
  const [locationIP, setLocationIP] = useState("");
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  const [LoaderDataIP, setLoaderDataIP] = useState(true);

  const getActivityLog = async (file_id, waitingParam, email) => {
    setLoaderDataIP(true);
    //console.log('Activity Log ');
    //console.log(selectedSigner);
    //console.log(file_id);

    const postData = {
      bulk_link_id: file_id,
      email: email,
    };
    const apiData1 = await post(
      "bulk_links/viewBulkLinkAuditLogSingle",
      postData
    ); // Specify the endpoint you want to call
    //console.log('ACTIVITY LOG dfdsfdfddf');

    //console.log(apiData1);
    if (apiData1.error === true) {
      setLoaderDataIP(false);
      toastAlert("error", "No Audit Log Added");
    } else {
      // const formattedData = await Promise.all(
      //   apiData1.data.map(async item => {
      //     const formattedDate = await formatDateTimeZone(item.location_date, item.ip_address);
      //     // const timeZone=userTimezone?.timezone

      //     return {...item, formattedDate: formattedDate.dateTime, timeZone: formattedDate?.timeZone};
      //   }),
      // );
      setLoaderDataIP(false);
      setActivityLogData(apiData1.response_data); // Set the state with formatted data
    }
  };
  const [isLoaded, setIsLoaded] = useState(true);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setIsLoaded(false);
  //   }, 3000);
  //   return () => clearTimeout(timeoutId);
  // }, []);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    console.log("sdfhsfhjsdf");
    console.log(status);

      const fetchDataBasedOnUser = async () => {
        const queryString = window.location.search;

        // Parse the query string to get parameters
        const urlParams = new URLSearchParams(queryString);

        // Get the value of the 'waitingforOtherstoast' parameter
        let waitingParam = urlParams.get("item");
        console.log(waitingParam);
        try {
          await Promise.all([
            // getLocatinIPn(),
            fetchFileData(file_id, waitingParam),
          ]);
        } catch (error) {
          console.log(error);
          console.error("Error fetching data:", error);
        } finally {
          setIsLoaded(false);
        }
      };
      fetchDataBasedOnUser();
  }, []);
  const [ContinueModal1, setContinueModal1] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 786) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
   
  }, []);
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
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
  const [doenloadPdfLoader, setDownloadPdfLoader] = useState(false);
  const [scale, setScale] = useState(window.innerWidth < 730 ? 0.85 : 1.5);
  const [doenloadPdfLoader1, setDownloadPdfLoader1] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloadPdfLoader(true);
    const response = await fetch(`${originaldoc}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadPdfLoader(false);
  };
  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
  };

  const handleDownloadPDFHere = async () => {
    setDownloadPdfLoader1(true);
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
    setDownloadPdfLoader1(false);
  };
  const canvasRefs = useRef([]);
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
  const [showConfetti, setShowConfetti] = useState(false);

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
                background: "white",
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
                    marginBlock: "1%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ marginLeft: "20px" }}>
                      <Menu
                        size={20}
                        onClick={() => setContinueModal1(!ContinueModal1)}
                      />
                    </div>
                    {/* {downloadLoader ? <Spinner color="white" size="sm" /> : null} */}
                    <ArrowLeft
                      size={20}
                      style={{ marginLeft: "10px" }}
                      onClick={async () => {
                        window.location.href = `/public_forms`;
                      }}
                    />
{loading?null: <img
                      src={companyLogo}
                      style={{
                        width: "100px",
                        height: "50px",
                        objectFit: "contain",
                        marginLeft: "20px",
                        marginRight: "20px",
                      }}
                    />}
                   
                    <h4 className="fw-bold" style={{ marginTop: "10px" }}>
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
                              id={`full-page-${page}`}
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
                {/* <Col
                    xs={12}
                    style={{
                      height: "200px",
                      width: "10px",
                      backgroundColor: "black",
                    }}
                  ></Col> */}
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
                  onClick={handleDownloadPDFHere}
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
              background: "white",
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
                  {window.innerWidth < 380 ? (
                    <Menu
                      size={20}
                      style={{ marginRight: "20px" }}
                      onClick={() => {
                        setIsOpenCanvas(true);
                      }}
                    />
                  ) : null}

                  {/* <CustomButton
                    padding={true}
                    useDefaultColor={true}
                    size="sm"
                    // disabled={saveLoading}
                    color="primary"
                    onClick={async () => {
                      window.location.href = `/public_forms`;
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
                        <span className="align-middle ms-25">Back</span>
                      </>
                    }
                  /> */}

                  {loading ? null : (
                    <img
                      src={companyLogo}
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
                    {fileName}
                  </h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <select
                    style={{
                      border: "none",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                    value={scale}
                    onChange={handleZoomChange}
                  >
                    {zoomOptions.map((option) => (
                      <option key={option} value={option}>
                        {option * 100}%
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                    alignItems: "center",
                  }}
                >
                  <CustomButton
                    padding={true}
                    useDefaultColor={false}
                    size="sm"
                    disabled={doenloadPdfLoader}
                    color="orange"
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
                        {doenloadPdfLoader ? (
                          <Spinner color="white" size="sm" />
                        ) : null}

                        <span className="align-middle ms-25">
                          Download Original
                        </span>
                      </>
                    }
                  />
                  <CustomButton
                    padding={true}
                    useDefaultColor={false}
                    size="sm"
                    disabled={doenloadPdfLoader1}
                    // color="primary"
                    onClick={handleDownloadPDFHere}
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
                        {doenloadPdfLoader1 ? (
                          <Spinner color="white" size="sm" />
                        ) : null}
                        <span className="align-middle ms-25">
                          Download Completed
                        </span>
                      </>
                    }
                  />
                  {/* <Button
                  disabled={doenloadPdfLoader}
                  color="primary"
                  onClick={handleDownloadPDFHere}
                  style={{
                    display: 'flex',
                    boxShadow: 'none',
                    justifyContent: 'center',
                    marginRight: '10px',
                    alignItems: 'center',
                  }}
                  className="btn-icon d-flex">
                  {doenloadPdfLoader ? <Spinner size="sm" /> : null}
                  <span style={{fontSize: '16px', letterSpacing: '.5px'}} className="align-middle ms-25">
                    Download
                  </span>
                </Button> */}
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Row>
              <Col
                xs={12}
                style={{
                  backgroundColor: "white",
                  border: "1px solid lightGrey",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBlock: "0.3%",
                  paddingInline: "2%",
                }}
              >
                <div></div>

                <div>
                  {selectedSigner === null ||
                  selectedSigner === undefined ||
                  selectedSigner === "" ? null : (
                    <>
                      {" "}
                      {selectedSigner === null ||
                      selectedSigner === undefined ||
                      selectedSigner === "" ? (
                        <></>
                      ) : (
                        <>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              flexShrink: 1,
                            }}
                          >
                            <div
                              style={{
                                // width: '20px',
                                height: "20px",
                              }}
                            ></div>
                            <span>{selectedSigner.email}</span>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </Col>
              <Col
                xs={2}
                style={{
                  backgroundColor: "white",
                  // marginLeft: 5,
                }}
              >
                <div style={{ padding: "10px" }}>
                  <h3 className="fw-bold">Title :</h3>

                  <h3>{tileDoc}</h3>
                  <h3 className="fw-bold">Welcome Message :</h3>
                  <h3> {welcomeMessage}</h3>
                  <h3 className="fw-bold">Acknowledgement Message:</h3>

                  <h3>{ackMessage}</h3>
                  <h3 className="fw-bold">Created at:</h3>

                  <h3> {formatDateCustomTimelastActivity(created_at_doc)}</h3>
                </div>
                <div style={{ borderBottom: "1px solid lightGrey" }}></div>

                <div style={{ padding: "10px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                      Responses
                    </h2>
                    <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                      {signersData.length}
                    </h2>
                  </div>

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
                              {formatDateCustomTimelastActivity(
                                signer.created_at
                              )}
                            </h3>
                          </div>
                        </div>
                      ))}{" "}
                    </>
                  )}

                  <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                    Public Form Settings
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircle size={15} style={{ color: "green" }} />
                    <h3 style={{ marginLeft: "10px" }}>
                      {linkLimitNo === 0 || linkLimitNo === "0"
                        ? ""
                        : linkLimitNo}{" "}
                      {linkResponseLimit} Response Limit
                    </h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircle size={15} style={{ color: "green" }} />
                    <h3 style={{ marginLeft: "10px" }}>
                      {emailVerification ? "Needed Email Verification" : ""}
                    </h3>
                  </div>
                  {expiredLinkCurrent ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircle size={15} style={{ color: "green" }} />
                      <h3 style={{ marginLeft: "10px" }}>
                        Expired on {formatDateCustomTimelastActivity(expiredAt)}
                      </h3>
                    </div>
                  ) : null}
                  {allowDownloadAfterSubmission ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircle size={15} style={{ color: "green" }} />
                      <h3 style={{ marginLeft: "10px" }}>Allow to Download</h3>
                    </div>
                  ) : null}
                  {receiveCopyEmail ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <CheckCircle size={15} style={{ color: "green" }} />
                      <h3 style={{ marginLeft: "10px" }}>Receives Copy </h3>
                    </div>
                  ) : null}
                </div>
              </Col>

              <Col
                xs={8}
                ref={colRef}
                style={{
                  backgroundColor: "#eaeaea",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "10px",
                  overflow: "auto",
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
                    height: "93dvh",

                    position: "relative",
                  }}
                >
                  <Document
                    file={`${imageUrls}`}
                    onLoadSuccess={onDocumentLoadSuccess}
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
                            style={{ marginBottom: "20px" }}
                            id={`full-page-${page}`}
                          >
                            {/* <div
                          id={`page-${page}`}
                          key={`page-${page}`}
                          style={{position: 'absolute', top: 10, left: 10, zIndex: 2}}></div> */}
                            <Page
                              renderAnnotationLayer={false}
                              renderTextLayer={false}
                              scale={scale}
                              onLoadSuccess={({ width }) => {
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
                              key={page}
                              pageNumber={page}
                              ref={(ref) =>
                                (canvasRefs.current[page - 1] = ref)
                              }

                              // className={activePage === page ? 'active-page' : ''}
                              // onClick={() => handlePageClick(page)}
                            ></Page>
                            <h5
                              style={{
                                marginBlock: "10px",
                                textAlign: "center",
                              }}
                            >
                              {" "}
                              Page {page}
                            </h5>{" "}
                          </div>{" "}
                        </>
                      ))}
                  </Document>

                  {/* </div> */}
                </div>
                {/* aditional page  */}
              </Col>
              <Col
                xs={2}
                style={{
                  position: "relative",
                  backgroundColor: "white",
                  border: "1px solid lightGrey",
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
                                activePage === page
                                  ? "1px solid #23b3e8"
                                  : "1px solid lightGrey",
                              overflow: "hidden",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              if (activePage !== page) {
                                e.target.style.border = "1px solid #c4c4c4";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (activePage !== page) {
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
                            style={{ marginBlock: "10px", textAlign: "center" }}
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
      )}
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
            <div style={{ padding: "10px" }}>
              <h3 className="fw-bold">Title :</h3>

              <h3>{tileDoc}</h3>
              <h3 className="fw-bold">Welcome Message :</h3>
              <h3> {welcomeMessage}</h3>
              <h3 className="fw-bold">Acknowledgement Message:</h3>

              <h3>{ackMessage}</h3>
              <h3 className="fw-bold">Created at:</h3>

              <h3> {formatDateCustomTimelastActivity(created_at_doc)}</h3>
            </div>
            <div style={{ borderBottom: "1px solid lightGrey" }}></div>

            <div style={{ padding: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                  Responses
                </h2>
                <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                  {signersData.length}
                </h2>
              </div>

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
                          {formatDateCustomTimelastActivity(signer.created_at)}
                        </h3>
                      </div>
                    </div>
                  ))}{" "}
                </>
              )}

              <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                Public Form Settings
              </h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                <CheckCircle size={15} style={{ color: "green" }} />
                <h3 style={{ marginLeft: "10px" }}>
                  {linkLimitNo === 0 || linkLimitNo === "0" ? "" : linkLimitNo}{" "}
                  {linkResponseLimit} Response Limit
                </h3>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "center",
                }}
              >
                <CheckCircle size={15} style={{ color: "green" }} />
                <h3 style={{ marginLeft: "10px" }}>
                  {emailVerification ? "Needed Email Verification" : ""}
                </h3>
              </div>
              {expiredLinkCurrent ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                >
                  <CheckCircle size={15} style={{ color: "green" }} />
                  <h3 style={{ marginLeft: "10px" }}>
                    Expired on {formatDateCustomTimelastActivity(expiredAt)}
                  </h3>
                </div>
              ) : null}
              {allowDownloadAfterSubmission ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                >
                  <CheckCircle size={15} style={{ color: "green" }} />
                  <h3 style={{ marginLeft: "10px" }}>Allow to Download</h3>
                </div>
              ) : null}
              {receiveCopyEmail ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                >
                  <CheckCircle size={15} style={{ color: "green" }} />
                  <h3 style={{ marginLeft: "10px" }}>Receives Copy </h3>
                </div>
              ) : null}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ViewDocBulkLinkNReceiver;
