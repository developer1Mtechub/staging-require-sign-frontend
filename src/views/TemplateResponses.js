import React, { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button, Col, Modal, ModalBody, Row, Spinner } from "reactstrap";

// import {PDFDocument, rgb} from 'pdf-lib';
// import 'react-resizable/css/styles.css';

import { BASE_URL, jpg_image1, post } from "../apis/api";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// usama import

import { formatDateCustomTimelastActivity } from "../utility/Utils";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import FullScreenLoader from "../@core/components/ui-loader/full-screenloader";
import CustomButton from "../components/ButtonCustom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getUser,
  selectLoading,
  selectLogo,
  selectPrimaryColor,
} from "../redux/navbar";
import { decrypt } from "../utility/auth-token";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Menu, X } from "react-feather";

const TemplateResponses = () => {
  const [UniqIdDoc, setUniqIdDoc] = useState("");
  const dispatch = useDispatch();
  const logo = useSelector(selectLogo);
  const { t } = useTranslation();
  const loading = useSelector(selectLoading);
  const { user, plan, status, error } = useSelector((state) => state.navbar);
  const primary_color = useSelector(selectPrimaryColor);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState("100%");
  const [signersData, setSignersData] = useState([]);

  // states
  const [ActivityLogData, setActivityLogData] = useState([]);

  const [imageUrls, setImageUrls] = useState([]);
  const [imageUrlsOriginal, setImageUrlsOriginal] = useState([]);

  const file_id = window.location.pathname.split("/")[2];

  const [type, setType] = useState("");

  const [saveLoading, setsaveLoading] = useState(false);

  const [fileName, setFileName] = useState("");
  const [selectedSigner, setSelectedSigner] = useState([]);

  const [activePage, setActivePage] = useState(1);
  // end
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  const [zoomPercentage, setZoomPercentage] = useState(100);
  const [startPage, setStartPage] = useState(0);
  const [endPage, setEndPage] = useState(5);

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
  // items list append end
  const zoomOptions = [0.5, 0.75, 0.85, 1.0, 1.5, 2.0]; // Zoom levels: 50%, 75%, 100%, 150%, 200%
  // Zoom levels: 50%, 75%, 100%, 150%, 200%

  const handleZoomChange = (event) => {
    const newScale = parseFloat(event.target.value);
    setScale(newScale);
    // if (percentage === '50') {
    //   setZoomPercentage(50);
    // } else if (percentage === '75') {
    //   setZoomPercentage(75);
    // } else if (percentage === '100' || percentage === 'fit') {
    //   setZoomPercentage(100);
    // } else if (percentage === '110') {
    //   setZoomPercentage(110);
    // } else if (percentage === '125') {
    //   setZoomPercentage(125);
    // } else if (percentage === '150') {
    //   setZoomPercentage(150);
    // }
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
    const fullPageElement = document.getElementById(`full-page-${page}`);

    // Scroll the full-page view to the clicked page
    if (fullPageElement) {
      fullPageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // setIsLoadingDoc(false);
    // }, 1000);
  };
  const onDocumentLoadError = (error) => {
    console.error("Error loading document:", error);
  };
  const [created_at_doc, setCreated_at_doc] = useState("");
  const [LoaderDataIP, setLoaderDataIP] = useState(true);

  const getActivityLog = async (file_id, waitingParam, email) => {
    setLoaderDataIP(true);
    //console.log('Activity Log ');
    //console.log(selectedSigner);
    const postData = {
      template_id: file_id,
      email: email,
    };
    const apiData1 = await post(
      "template/viewTemplateAuditLogSingle",
      postData
    ); // Specify the endpoint you want to call
    //console.log('ACTIVITY LOG');

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  // Fetch File
  const [completed_doc1, setCompleted_doc1] = useState(false);
  const fetchFileData = async (fileId, params) => {
    // setImageUrls(apiData.result[0].image);
    // get Images from db
    console.log("File Template Fetch 111");

    console.log(fileId);
    const postData = {
      template_id: fileId,
      params: params,
      user_id: user?.user_id,
    };
    const apiData = await post("template/viewTemplateResponses", postData); // Specify the endpoint you want to call
    console.log("File Template Fetch");

    console.log(apiData);
    if (apiData.error) {
      setIsLoaded(false);
      window.location.href = "/error";
      // toastAlert("error", "No File exist")
    } else {
      // toastAlert("success", "File exist")
      // setUniqIdDoc(apiData.data.uniq_id);
      // setUser_id_created(apiData.data.user_id);
      setCreated_at_doc(apiData.result[0].completed_at);
      setCompleted_doc1(apiData.result[0].completed);
      setImageUrls(apiData.result[0].completed_doc);
      setImageUrlsOriginal(apiData.template_details.file_url_completed);

      if (
        apiData.all_responses.length === 0 ||
        apiData.all_responses === null ||
        apiData.all_responses === undefined
      ) {
        setTextItems([]);
        setSignersData([]);
        setSelectedSigner(null);
      } else {
        setSignersData(apiData.all_responses);
        //   if (params === null || params === undefined || params === '') {
        //     //console.log('dshjhjds');
        setFileName(apiData.result[0].title || "");

        //     setTextItems(apiData?.result[0]?.position_array);

        // setSelectedSigner(apiData.result[0].email);

        //     await getActivityLog(fileId, params, apiData.response_data[0].email);
        //   } else {
        //     //console.log(params);
        //     let ArrayObj = apiData.response_data;

        //     // const filteredData = ArrayObj.filter(item => parseInt(item.template_responses_id) === parseInt(params));
        //     //console.log('filteredData');
        const filteredIndex = apiData.response_data.findIndex(
          (item) => parseInt(item.template_responses_id) === parseInt(params)
        );

        //     // //console.log(filteredData)
        setFileName(apiData.response_data[filteredIndex].title || "");

        //     setTextItems(apiData?.response_data[filteredIndex]?.position_array);
        //     setSelectedSigner(apiData.response_data[filteredIndex]);
        //     await getActivityLog(fileId, params, apiData.response_data[filteredIndex].email);
      }
      // }
      setIsLoaded(false);
    }
  };

  const [isOpenCanvas, setIsOpenCanvas] = useState(false);
  const [isOpenCanvasPages, setIsOpenCanvasPages] = useState(false);

  // end
  const canvasRef = useRef();
  const canvasRefs = useRef([]);
  const [SelectedIdResponse, setSelectedIdResponse] = useState(null);
  const [locationIP, setLocationIP] = useState("");
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  useEffect(() => {
    //console.log("dshhdfs")
    // //console.log(openValue)
    // getLocatinIPn();
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          const queryString = window.location.search;

          // Parse the query string to get parameters
          const urlParams = new URLSearchParams(queryString);

          // Get the value of the 'waitingforOtherstoast' parameter
          let waitingParam = urlParams.get("item");
          //console.log('ITEM');

          //console.log(waitingParam);
          setSelectedIdResponse(waitingParam);

          console.log(file_id);
          await Promise.all([fetchFileData(file_id, waitingParam)]);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoaded(false);
        }
      };

      fetchDataBasedOnUser();
    }
  }, [user, status]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
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

  useEffect(() => {
    if (window.innerWidth < 786) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
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
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setIsLoaded(false);
  //   }, 3000);

  //   // Cleanup function to clear the timeout in case component unmounts before 1 second
  //   return () => clearTimeout(timeoutId);
  // }, []); // Empty dependency array to run effect only once

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
  const [ContinueModal1, setContinueModal1] = useState(false);

  const handleDownloadPDF = async () => {
    const response = await fetch(`${imageUrlsOriginal}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const [doenloadPdfLoader, setDownloadPdfLoader] = useState(false);
  const [scale, setScale] = useState(window.innerWidth < 730 ? 0.85 : 1.5);

  const handleDownloadPDFHere = async () => {
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
    setDownloadPdfLoader(false);
  };

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
                        window.location.href = `/template`;
                      }}
                    />

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
                  <CustomButton
                    padding={true}
                    useDefaultColor={true}
                    size="sm"
                    // disabled={saveLoading}
                    color="primary"
                    // disabled={downloadLoader}
                    // onClick={async () => {
                    //   if (statusFile === 'InProgress') {
                    //     if (window.confirm('Do you want to save the previous changes?')) {
                    //       await saveData();
                    //     }
                    //     window.location.href = '/template';
                    //   } else {
                    //     window.location.href = '/template';
                    //   }
                    // }}
                    onClick={async () => {
                      window.location.href = `/template`;
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
                        <span className="align-middle ms-25">{t("Back")}</span>
                      </>
                    }
                  />

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
                    {t("Template")} : {fileName}
                  </h2>
                </div>
                <select
                  id="zoom"
                  onChange={handleZoomChange}
                  style={{
                    fontSize: "16px",
                    cursor: "pointer",
                    border: "1px solid lightGrey",
                    textAlign: "center",
                    textAlignLast: "center",
                  }}
                  value={scale}
                >
                  {zoomOptions.map((option) => (
                    <option key={option} value={option}>
                      {option * 100}%
                    </option>
                  ))}
                </select>
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
                    disabled={saveLoading}
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
                        {saveLoading ? (
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
                  {completed_doc1 === true || completed_doc1 === "true" ? (
                    <CustomButton
                      padding={true}
                      useDefaultColor={false}
                      size="sm"
                      disabled={doenloadPdfLoader}
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
                          {doenloadPdfLoader ? (
                            <Spinner color="white" size="sm" />
                          ) : null}
                          <span className="align-middle ms-25">
                            {t("Download Completed")}
                          </span>
                        </>
                      }
                    />
                  ) : null}
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
                    Download Completed
                  </span>
                </Button> */}
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={12}>
            <Row>
              <Col
                xs={2}
                // style={{
                //   backgroundColor: 'white',
                //   // marginLeft: 5,
                // }}
              >
                {completed_doc1 === true || completed_doc1 === "true" ? (
                  <div style={{ padding: "10px" }}>
                    <h3 className="fw-bold">{t("Completed at")}:</h3>

                    <h3> {formatDateCustomTimelastActivity(created_at_doc)}</h3>
                  </div>
                ) : null}
                <div style={{ borderBottom: "1px solid lightGrey" }}></div>

                <div style={{ padding: "10px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                      {t("Responses")}
                    </h2>
                    <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                      {signersData.length}
                    </h2>
                  </div>

                  {signersData.length === 0 ? null : (
                    <>
                      <div style={{ height: "70vh", overflowY: "auto" }}>
                        {signersData.map((signer, index) => (
                          <div
                            style={{
                              // display: 'flex',
                              // justifyContent: 'space-between',
                              // alignItems: 'center',
                              borderBottom: "1px solid LightGrey",
                              border:
                                selectedSigner.email === signer.email
                                  ? "1px solid lightGrey"
                                  : null,
                              paddingBlock: "10px",

                              paddingLeft: "10px",
                            }}
                            // onClick={()=>{
                            //   se
                            // }}
                          >
                            <div>
                              {/* <h3 className="fw-bold">{signer.name}</h3> */}
                              <h3>{signer.email}</h3>
                            </div>
                            {signer.completed_status === "true" ||
                            signer.completed_status === true ? (
                              <div>
                                {/* <h3>{formatDateTime(signer?.completed_at, locationIP)}</h3> */}
                                <h3>{t("Completed")}</h3>
                              </div>
                            ) : (
                              <div>
                                <h3>{t("Pending")}</h3>{" "}
                              </div>
                            )}
                          </div>
                        ))}{" "}
                      </div>{" "}
                    </>
                  )}
                </div>
              </Col>

              <Col
                 ref={colRef}
                xs={8}
                style={{
                  cursor:
                    type === "my_text" || type === "signer_text"
                      ? "none"
                      : type
                      ? "none"
                      : "default",
                  backgroundColor: "#eaeaea",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxHeight: "92dvh",
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
                    height: "92dvh",

                    position: "relative",
                    // position: 'relative',
                    // transform: `scale(${zoomPercentage / 100})`,
                    // transformOrigin: 'top left',
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
                            id={`full-page-${page}`}
                            key={page}
                            style={{ marginBottom: "20px" }}
                          >
                            {/* <div
                          id={`page-${page}`}
                          key={`page-${page}`}
                          style={{position: 'absolute', top: 10, left: 10, zIndex: 2}}></div> */}
                            <Page
                              scale={scale}
                              onLoadSuccess={({ width }) => {
                                setCanvasWidth(width);
                              }}
                              renderAnnotationLayer={false}
                              renderTextLayer={false}
                              key={page}
                              pageNumber={page}
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
                              ref={(ref) =>
                                (canvasRefs.current[page - 1] = ref)
                              }
                              // width={canvasWidth}
                              // className={activePage === page ? 'active-page' : ''}
                              // onClick={() => handlePageClick(page)}
                            >
                              {" "}
                              {/* <canvas
                            id={`full-page-${page}`}
                            onMouseMove={() => setPageNumber(page)}
                            ref={ref => (canvasRefs.current[page - 1] = ref)}
                            style={{
                              border: '1px solid lightgrey',
                              width: canvasWidth,
                              height: '100%',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              zIndex: 1,
                            }}
                          /> */}
                            </Page>
                            <h5
                              style={{
                                marginBlock: "10px",
                                textAlign: "center",
                              }}
                            >
                              {" "}
                              {t("Page")} {page}
                            </h5>{" "}
                          </div>{" "}
                        </>
                      ))}
                  </Document>

                  {/* </div> */}
                </div>
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
                                activePage === page
                                  ? `1px solid ${primary_color}`
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
                          <h6
                            style={{ marginBlock: "10px", textAlign: "center" }}
                          >
                            {" "}
                            {t("Page")} {page}
                          </h6>{" "}
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
            {completed_doc1 === true || completed_doc1 === "true" ? (
              <div style={{ padding: "10px" }}>
                <h3 className="fw-bold">{t("Completed at")}:</h3>

                <h3> {formatDateCustomTimelastActivity(created_at_doc)}</h3>
              </div>
            ) : null}
            <div style={{ borderBottom: "1px solid lightGrey" }}></div>

            <div style={{ padding: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                  {t("Responses")}
                </h2>
                <h2 className="fw-bold" style={{ marginBlock: "2%" }}>
                  {signersData.length}
                </h2>
              </div>

              {signersData.length === 0 ? null : (
                <>
                  <div style={{ height: "70vh", overflowY: "auto" }}>
                    {signersData.map((signer, index) => (
                      <div
                        style={{
                          // display: 'flex',
                          // justifyContent: 'space-between',
                          // alignItems: 'center',
                          borderBottom: "1px solid LightGrey",
                          border:
                            selectedSigner.email === signer.email
                              ? "1px solid lightGrey"
                              : null,
                          paddingBlock: "10px",

                          paddingLeft: "10px",
                        }}
                        // onClick={()=>{
                        //   se
                        // }}
                      >
                        <div>
                          {/* <h3 className="fw-bold">{signer.name}</h3> */}
                          <h3>{signer.email}</h3>
                        </div>
                        {signer.completed_status === "true" ||
                        signer.completed_status === true ? (
                          <div>
                            {/* <h3>{formatDateTime(signer?.completed_at, locationIP)}</h3> */}
                            <h3>{t("Completed")}</h3>
                          </div>
                        ) : (
                          <div>
                            <h3>{t("Pending")}</h3>{" "}
                          </div>
                        )}
                      </div>
                    ))}{" "}
                  </div>{" "}
                </>
              )}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default TemplateResponses;
