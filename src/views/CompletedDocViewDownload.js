import React, {useState, useRef, useEffect} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import {Button, Col, Row, Spinner, Table} from 'reactstrap';
import {ArrowLeft, CheckCircle, Clock, Image, Menu} from 'react-feather';
import logoRemoveBg from '@src/assets/images/pages/halfLogo.png';
import logoRemoveBgFull from '@src/assets/images/pages/logoRemoveBg.png';
import {PDFDocument, StandardFonts, rgb} from 'pdf-lib';

// import {PDFDocument, rgb} from 'pdf-lib';
// import 'react-resizable/css/styles.css';

import {BASE_URL, post} from '../apis/api';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// usama import
import {Rnd} from 'react-rnd';
import ComponentForItemTypeComp from '../utility/EditorUtils/EditorTypesPosition.js/CompletedDocView/ComponentForItemType';
import {formatDateCustom, formatDateCustomTime, formatDateTime, formatDateTimeZone, formatDateUSA} from '../utility/Utils';
import getUserLocation from '../utility/IpLocation/GetUserLocation';
import FullScreenLoader from '../@core/components/ui-loader/full-screenloader';

const CompletedDocViewDownload = () => {
  const [UniqIdDoc, setUniqIdDoc] = useState('');

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [textItems, setTextItems] = useState([]);
  const [canvasWidth, setCanvasWidth] = useState(1250);
  const [statusFile, setStatusFile] = useState('');
  const [signersData, setSignersData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true);

  // states

  const [imageUrls, setImageUrls] = useState([]);
  const file_id = window.location.pathname.split('/')[3];
  const receipt_email = window.location.pathname.split('/')[4];

  const [type, setType] = useState('');

  const [saveLoading, setsaveLoading] = useState(false);

  const [fileName, setFileName] = useState('');

  const [activePage, setActivePage] = useState(1);
  // end
  const [isLoadingDoc, setIsLoadingDoc] = useState(true);
  const [zoomPercentage, setZoomPercentage] = useState(100);
  // items list append end
  const handleZoomChange = percentage => {
    // if (percentage === 'fit') {
    //   setZoomPercentage(110); // Reset zoom percentage to 100% if "Fit to Width" is selected
    //   const newCanvasWidth = (800 * 110) / 100;
    //   setCanvasWidth(newCanvasWidth);
    //   // setCanvasWidth(800); // Reset canvas width to default
    // } else {
    //   setZoomPercentage(percentage);
    //   // Calculate new canvas width based on zoom percentage
    //   const newCanvasWidth = (800 * percentage) / 100;
    //   setCanvasWidth(newCanvasWidth);
    // }
    if (percentage === '50') {
      setZoomPercentage(50);
    } else if (percentage === '75') {
      setZoomPercentage(75);
    } else if (percentage === '100' || percentage === 'fit') {
      setZoomPercentage(100);
    } else if (percentage === '110') {
      setZoomPercentage(110);
    } else if (percentage === '125') {
      setZoomPercentage(125);
    } else if (percentage === '150') {
      setZoomPercentage(150);
    }
  };
  const handlePageClick = page => {
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
      fullPageElement.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
    // setIsLoadingDoc(false);
    // }, 1000);
  };
  // Define the dropdownOpen state

  const fetchData = async fileId => {
    // get Images from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post('file/getbgImagesByFileId', postData); // Specify the endpoint you want to call
    //console.log('apixxsData');

    //console.log(apiData);
    if (apiData.error) {
    } else {
      setImageUrls(apiData.result[0].image);
    }
  };
  // fetch positions
  const fetchDataPositions = async fileId => {
    // get positions from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post('file/getallPositionsFromFile_Id', postData); // Specify the endpoint you want to call
    //console.log('Position Data');

    //console.log(apiData);
    if (apiData.error) {
    } else {
      //console.log('positions');
      //console.log(apiData.result);

      setTextItems(apiData.result[0].position_array);
    }
  };
  const [User_id_created, setUser_id_created] = useState('');
  const [created_at_doc, setCreated_at_doc] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [securedShare, setSecuredShare] = useState(false);
  const [signerFunctionalControls, setSignerFunctionalControls] = useState(false);

  // Fetch File
  const fetchFileData = async fileId => {
    // get Images from db
    const postData = {
      file_id: fileId,
    };
    const apiData = await post('file/get-file', postData); // Specify the endpoint you want to call
    //console.log('File Dta Fetch');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      // toastAlert("success", "File exist")
      setFileName(apiData.data.name || '');
      setUniqIdDoc(apiData.data.uniq_id);
      setUser_id_created(apiData.data.user_id);
      setCreated_at_doc(apiData.data.created_at);
      //console.log(apiData.data.only_signer);
      // setOnlySigner(apiData.data.only_signer || false);
      setEmailMessage(apiData.data.email_message || '');
      setEmailSubject(apiData.data.name);
      setSecuredShare(apiData.data.secured_share || false);
      setSignerFunctionalControls(apiData.data.signer_functional_controls || false);
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
      const apiData = await post('file/getAllSignersByFileId', postData); // Specify the endpoint you want to call
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
  const fetchRecipientsData = async () => {
    const postData = {
      file_id: file_id,
    };
    try {
      const apiData = await post('file/getAllRecipientsByFileId', postData); // Specify the endpoint you want to call
      //console.log('Recipients');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === 'true') {
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
  const fetchRecipientLog = async fileId => {
    const location = await getUserLocation();

    // get Images from db
    const postData = {
      file_id: fileId,
      receipt_email: receipt_email,
      location_country: location.country,
      ip_address: location.ip,
      location_date: location.date,
      timezone: location?.timezone,
    };
    const apiData = await post('file/recipient-log-maintain', postData); // Specify the endpoint you want to call
    //console.log('apixxsData');

    //console.log(apiData);
  };
  const [ActivityLogData, setActivityLogData] = useState([]);
  const [LoaderDataIP, setLoaderDataIP] = useState(false);

  const getActivityLog = async file_id => {
    setLoaderDataIP(true);
    //console.log('Activity Log ');
    const postData = {
      file_id: file_id,
    };
    const apiData1 = await post('file/getFileActivityLog', postData); // Specify the endpoint you want to call
    //console.log('apiData1');

    //console.log(apiData1);
    if (apiData1.data.length === 0) {
      setLoaderDataIP(false);
      toastAlert('error', 'No Audit Log Added');
    } else {
      // const formattedData = await Promise.all(
      //   apiData1.data.map(async item => {
      //     const formattedDate = await formatDateTimeZone(item.location_date, item.ip_address);
      //     // const timeZone=userTimezone?.timezone

      //     return {...item, formattedDate: formattedDate.dateTime, timeZone: formattedDate?.timeZone};
      //   }),
      // );
      setLoaderDataIP(false);
      setActivityLogData(apiData1.data); // Set the state with formatted data
    }
  };
  const [ActivityLogHide, setActivityLogHide] = useState(false);
  const [locationIP, setLocationIP] = useState('');
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  useEffect(() => {
    getLocatinIPn();
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
    fetchData(file_id);
    fetchFileData(file_id);
    fetchDataPositions(file_id);
    fetchSignerData(file_id);
    fetchRecipientsData(file_id);
  }, []);

  const onDocumentLoadSuccess = ({numPages}) => {
    setNumPages(numPages);
    setIsLoadingDoc(false);
  };
  const onDocumentLoadError = error => {
    console.error('Error loading document:', error);
  };
  const handleDownloadPDF = async () => {
    const response = await fetch(`${BASE_URL}${imageUrls}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    // const response = await fetch(`${BASE_URL}${imageUrls}`);
    // const blob = await response.blob();
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'document.pdf';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
    //======================== START ========================
    // try {
    //   // Load the PDF
    //   const pdfBytes = await fetch(`${BASE_URL}${imageUrls}`).then(res => res.arrayBuffer());
    //   const pdfDoc = await PDFDocument.load(pdfBytes);
    //   const pages = pdfDoc.getPages();

    //   // Loop through text items
    //   for (const textItem of textItems) {
    //     //console.log('textItem.page:', textItem);
    //     if (textItem.bgImg < 1 || textItem.bgImg > pages.length) {
    //       console.console('Invalid bgImg index:', textItem.bgImg);
    //       continue; // Skip this text item if the page index is out of range
    //     }

    //     const page = pages[textItem.bgImg - 1]; // Pages are zero-indexed

    //     // Get the size of the page
    //     const {width, height} = page.getSize();

    //     // Calculate the ratio between canvas width and PDF page width
    //     const ratio = canvasWidth / width;

    //     // Adjust text position based on the ratio and zoom percentage
    //     const x = (textItem.x * zoomPercentage) / 100;
    //     const y = height - (textItem.y * zoomPercentage) / 100;
    //     // Draw the text on the page
    //     if (textItem.type === 'my_text') {
    //       page.drawText(textItem.text, {
    //         x,
    //         y,
    //         size: textItem.fontSize,
    //         color: rgb(0, 0, 0),
    //       });
    //     }
    //   }

    //   // Save the modified PDF
    //   const modifiedPdfBytes = await pdfDoc.save();

    //   // Create a blob from PDF data
    //   const blob = new Blob([modifiedPdfBytes], {type: 'application/pdf'});

    //   // Create a temporary URL for the blob
    //   const url = URL.createObjectURL(blob);

    //   // Create a temporary link element to trigger the download
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'modified_pdf_with_text.pdf';
    //   document.body.appendChild(a);
    //   a.click();

    //   // Clean up
    //   URL.revokeObjectURL(url);
    //   document.body.removeChild(a);
    // } catch (error) {
    //   console.error('Error generating PDF:', error);
    // }
    // last sol ===================
    // const canvas = document.getElementById('col-9'); // Get the canvas element
    // const pdf = new jsPDF('p', 'px', [canvas.width, canvas.height]); // Create a PDF document

    // html2canvas(canvas).then(canvas => {
    //   const imgData = canvas.toDataURL('image/png'); // Convert canvas to image data
    //   pdf.addImage(imgData, 'PNG', 0, 0); // Add image to PDF
    //   pdf.save('canvas_content.pdf'); // Save PDF
    // });
  };

  const handleDownloadPDFHere = async () => {
    try {
      // Fetch PDF
      const response = await fetch(`${BASE_URL}${imageUrls}`);
      const existingPdfBytes = await response.arrayBuffer();

      // Load existing PDF
      let pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      // Get the width of the first page to use as the default PDF width
      let pdfWidth = pages[0].getWidth();
      const pdfHeight = pages[0].getHeight();
      const canvasWidth = canvasRef.current.width;
      const scaleFactor = canvasWidth / pdfWidth;
      // Calculate scale factor
      // const scaleFactor = pdfWidth / 1250; // Assuming pdfWidth is the default width of the PDF
      //console.log('Scale Factor:', scaleFactor);
      // Add text items to each page
      //console.log(textItems);
      let yOffset = 0;
      textItems.forEach(async field => {
        const {
          x,
          y,
          width,
          height,
          text,
          color,
          fontSize,
          bgImg,
          fontFamily,
          fontWeight,
          fontStyle,
          textDecoration,
          page_no,
        } = field;
        //console.log(bgImg);
        // Adjust x and y coordinates based on the scale factor
        const adjustedX = x * scaleFactor;
        // const adjustedY = y * scaleFactor;

        // Find the corresponding PDF page based on the y-coordinate
        let page;
        let currentPageHeight;
        for (let i = 0; i < pages.length; i++) {
          currentPageHeight = pages[i].getHeight() - 20;
          if (y - yOffset < currentPageHeight) {
            page = pages[i];
            break;
          } else {
            yOffset += currentPageHeight;
          }
        }

        if (!page) {
          console.error('Failed to find corresponding PDF page.');
          return;
        }
        if (field.type === 'my_text') {
          const adjustedY = y - yOffset;
          //console.log("type",type)
          let height_atdf = currentPageHeight - adjustedY - height * scaleFactor;
          //console.log("height",height_atdf)
          //console.log("text",text)

          // Draw text on the PDF page
          page.drawText(text, {
            x: adjustedX,
            y: currentPageHeight - adjustedY - height * scaleFactor, // Invert y-coordinate since PDF's origin is at the bottom-left
            size: fontSize * scaleFactor,
            // Other text properties...
          });
        }
        // if (field.type === 'my_text') {
        //   //console.log(field);

        //   // //console.log('Original Font Size:', fontSize);
        //   const textSize = fontSize * scaleFactor; // Adjust text size based on scale factor
        //   // //console.log('Adjusted Text Size:', textSize);

        //   let FontText = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        //  //console.log("HEIGHT")
        //  //console.log(page.getHeight() - y * scaleFactor - height * scaleFactor + 9)
        //  //console.log("page_no",page_no)
        //  //console.log("type",type)
        //  //console.log("text",text)

        //   page.drawText(text, {
        //     x: x * scaleFactor, // Scale x position back to default PDF width
        //     y: page.getHeight() - y * scaleFactor - height * scaleFactor + 9, // Scale y position back to default PDF width
        //     size: textSize,
        //     color: rgb(0, 0, 0), // Assuming color is in RGB format
        //     font: FontText,
        //   });

        // }
      });
      // Last Page Activity Log ---------------

      // Save modified PDF
      const modifiedPdfBytes = await pdfDoc.save();

      // Create download link
      const blob = new Blob([modifiedPdfBytes], {type: 'application/pdf'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document_with_text_items.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Handle error appropriately
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoaded(false);
    }, 3000);

    // Cleanup function to clear the timeout in case component unmounts before 1 second
    return () => clearTimeout(timeoutId);
  }, []); // Empty dependency array to run effect only once

  return (
    <>
      {isLoaded ? <FullScreenLoader /> : null}
      <Row>
        <Col
          xl={12}
          md={12}
          sm={12}
          style={{
            // position: 'fixed',
            // top: 0,
            // left: 0,
            width: '100%',
            zIndex: 999,
            borderBottom: '1px solid #ececec',
            // background: 'white',
          }}>
          <Row>
            <Col
              xl={12}
              md={12}
              sm={12}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBlock: '0.2%',
                paddingInline: '2%',
              }}>
              {/* back button
               */}
              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {window.innerWidth < 380 ? (
                  <Menu
                    size={20}
                    style={{marginRight: '20px'}}
                    onClick={() => {
                      setIsOpenCanvas(true);
                    }}
                  />
                ) : null}
                {receiptView ? null : (
                  <Button
                    style={{boxShadow: 'none', height: '40px', marginLeft: '20px'}}
                    color="white"
                    onClick={async () => {
                      window.location.href = `/home`;
                    }}
                    className="btn-icon d-flex">
                    <ArrowLeft size={20} style={{color: '#2367a6'}} />
                    {/* <span style={{ fontSize: '16px' }} className='align-middle ms-25'>Back</span> */}
                  </Button>
                )}

                <img
                  src={logoRemoveBg}
                  style={{
                    width: '45px',
                    height: 'auto',
                    marginLeft: '20px',
                    marginRight: '20px',
                  }}
                />
                <h2 className="fw-bold" style={{marginLeft: '10px', marginTop: '5px'}}>
                  {fileName}.pdf
                </h2>
              </div>
              <div>{saveLoading ? <h4>Saving ...</h4> : null}</div>
              <div style={{display: 'flex', justifyContent: 'right', alignItems: 'center'}}>
                <Button
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
                  {/* leeter spacing 1 */}
                  <span style={{fontSize: '16px', letterSpacing: '.5px'}} className="align-middle ms-25">
                    Download Original
                  </span>
                </Button>
                {statusFile === 'Completed' ? (
                  <Button
                    // disabled={saveLoading}
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
                    {/* leeter spacing 1 */}
                    <span style={{fontSize: '16px', letterSpacing: '.5px'}} className="align-middle ms-25">
                      Download Completed
                    </span>
                  </Button>
                ) : null}

                {window.innerWidth < 380 ? (
                  <Image
                    style={{marginLeft: '20px'}}
                    size={20}
                    onClick={() => {
                      setIsOpenCanvasPages(true);
                    }}
                  />
                ) : null}
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row>
            <Col
              xs={12}
              style={{
                // backgroundColor: 'white',
                border: '1px solid lightGrey',
                // display: 'flex',
                // justifyContent: 'space-between',
                // alignItems: 'center',
                paddingBlock: '0.3%',
                paddingInline: '2%',
              }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h3 className="fw-bold">Doc Id : {UniqIdDoc}</h3>
                </div>
                <div>
                  <select
                    style={{border: 'none', fontSize: '16px', cursor: 'pointer'}}
                    value={zoomPercentage}
                    onChange={e => handleZoomChange(e.target.value)}>
                    <option value="75">75%</option>
                    <option value="100">100%</option>
                    <option value="110">110%</option>
                    <option value="125">125%</option>
                    <option value="fit">Fit to Width</option>
                  </select>
                </div>

                <div></div>
              </div>
            </Col>
            <Col
              xs={2}
              style={
                {
                  // backgroundColor: 'white',
                  // marginLeft: 5,
                }
              }>
              <div style={{padding: '10px'}}>
                {/* <h3>From Rimsha Riaz</h3> */}
                <h3>Sent on {formatDateTime(created_at_doc, locationIP)}</h3>
                <h3>
                  {/* {statusFile==="InProgress"?<>
              <Clock size={15}/>
              <span>In Progress</span>
              </>:null} */}
                  {statusFile === 'WaitingForOthers' ? (
                    <>
                      <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                        <Clock size={15} />
                        <span style={{marginLeft: '5px'}}>Waiting for others</span>
                      </div>
                    </>
                  ) : null}

                  {/* {statusFile==="WaitingForOthers"?<>
              <Users size={15}/>
              <span>Waiting for me</span>
              </>:null} */}
                </h3>
              </div>
              <div style={{borderBottom: '1px solid lightGrey'}}></div>

              <div style={{padding: '10px'}}>
                <h2 className="fw-bold" style={{marginBlock: '2%'}}>
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
                          borderBottom: '1px solid LightGrey',
                          paddingBlock: '10px',
                        }}>
                        <div>
                          {/* <h3 className="fw-bold">{signer.name}</h3> */}
                          <h3>{signer.email}</h3>
                        </div>
                        <div>
                          <h3>
                            {signer.completed_status === null || signer.completed_status === undefined ? (
                              'Needs to sign'
                            ) : (
                              <>
                                <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center'}}>
                                  <CheckCircle size={15} style={{color: 'green'}} />
                                  <h3 style={{marginLeft: '10px', fontWeight: 700}}>Completed</h3>
                                </div>
                              </>
                            )}
                          </h3>
                          <h3>
                            {signer.completed_status === null || signer.completed_status === undefined ? null : (
                              <>{formatDateTime(signer.completed_at, locationIP)}</>
                            )}
                          </h3>
                        </div>
                      </div>
                    ))}{' '}
                  </>
                )}

                {RecipientsData.length === 0 ? null : (
                  <>
                    <h2 className="fw-bold" style={{marginBlock: '2%'}}>
                      Recipient
                    </h2>
                    {RecipientsData.map((signer, index) => (
                      <div
                        style={{
                          // display: 'flex',
                          // justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: '1px solid LightGrey',
                          paddingBlock: '10px',
                        }}>
                        <div>
                          {/* <h3 className="fw-bold">{signer.name}</h3> */}
                          <h3>{signer.email}</h3>
                        </div>
                      </div>
                    ))}{' '}
                  </>
                )}
                <h2 className="fw-bold" style={{marginBlock: '2%'}}>
                  Message
                </h2>
                <h3 style={{marginBlock: '2%'}}>{emailMessage}</h3>
              </div>
            </Col>

            <Col
              xs={8}
              style={{
                cursor: type === 'my_text' || type === 'signer_text' ? 'none' : type ? 'none' : 'default',
                border: '1px solid lightGrey',
                maxHeight: '87dvh',
                paddingTop: '10px',
                overflow: 'auto',
                paddingBottom: '20px',
              }}>
              {/* editor  */}
              {isLoadingDoc && ( // Conditionally render spinner if isLoading is true
                <div style={{display: 'flex', justifyContent: 'right'}}>
                  {/* Render your spinner component */}
                  <Spinner />
                </div>
              )}

              <div
                style={{
                  position: 'relative',
                  transform: `scale(${zoomPercentage / 100})`,
                  transformOrigin: 'top left',
                }}>
                <canvas
                  id="col-9"
                  ref={canvasRef}
                  style={{
                    border: '1px solid lightgrey',
                    width: canvasWidth,
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                  }}
                />

                <Document
                  file={`${BASE_URL}${imageUrls}`}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onError={onDocumentLoadError} // Add this line
                >
                  {/* <Page
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    pageNumber={pageNumber}
                    width={canvasWidth}
                  /> */}

                  {Array.from({length: numPages}, (_, i) => i + 1).map(page => (
                    <>
                      <div
                        id={`full-page-${page}`}
                        style={{position: 'relative', display: activePage === page ? 'block' : 'none'}}>
                        <div
                          id={`page-${page}`}
                          key={`page-${page}`}
                          style={{position: 'absolute', top: 10, left: 10, zIndex: 2}}>
                          <h6 style={{color: 'black', fontSize: '16px'}}>Document ID: {UniqIdDoc}</h6>
                        </div>
                        <Page
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          key={page}
                          pageNumber={page}
                          width={canvasWidth}
                          // className={activePage === page ? 'active-page' : ''}
                          // onClick={() => handlePageClick(page)}
                        ></Page>
                        <h6 style={{marginBlock: '10px', textAlign: 'center'}}> Page {page}</h6>{' '}
                      </div>{' '}
                    </>
                  ))}
                </Document>

                {textItems.map((field, index) => (
                  <Rnd
                    disableDragging={true} // disable dragging
                    disableResizing={{
                      top: true,
                      right: true,
                      bottom: true,
                      left: true,
                      topRight: true,
                      bottomRight: true,
                      bottomLeft: true,
                      topLeft: true,
                    }}
                    key={field.id}
                    style={{
                      // border: field.type==="checkmark" || field.type==="radio" ?'none':'1px solid lightgrey',
                      border: 'none',
                      display: field.bgImg === activePage ? 'block' : 'none',
                      zIndex: 2,
                    }}
                    size={{width: field.width, height: field.height}}
                    // position={{x: field.x, y: field.y}}
                    position={{
                      x: (field.x * zoomPercentage) / 100, // Adjusted x position based on zoom percentage
                      y: (field.y * zoomPercentage) / 100, // Adjusted y position based on zoom percentage
                    }}
                    onDragStop={(e, d) => {}}
                    onResizeStop={(e, direction, ref, delta, position) => {}}
                    bounds="window">
                    <ComponentForItemTypeComp key={index} item={field} />
                  </Rnd>
                ))}
                {LoaderDataIP ? (
                  <Spinner size="sm" />
                ) : (
                  <div
                    id={`full-page-last`}
                    style={{
                      // position: 'relative', top: `${numPages * canvasWidth}px`, left: 0,
                      width: canvasWidth,
                      height: '110vh',
                      backgroundColor: 'white',
                      //  zIndex: 2,
                      border: '1px solid lightgrey',
                    }}>
                    <Row>
                      <Col xs={6} md={6}>
                        <h1 style={{textAlign: 'left', margin: '20px 10px', color: 'black', fontSize: '16px'}}>
                          Document ID: {UniqIdDoc}
                        </h1>
                        <img
                          src={logoRemoveBgFull}
                          style={{
                            width: '200px',
                            height: 'auto',
                            marginLeft: '20px',
                            marginRight: '20px',
                          }}
                        />
                      </Col>
                      <Col xs={6} md={6}>
                        <h1 style={{textAlign: 'right', margin: '20px 10px', color: 'black', fontSize: '24px'}}>
                          Audit Trail
                        </h1>
                      </Col>
                      <Col xs={12} md={12}>
                        <Table>
                          <thead>
                            <tr>
                              <th style={{marginLeft: '20px'}}>Event</th>
                              <th style={{marginLeft: '20px'}}>Description</th>
                              {/* <th style={{marginLeft: '20px'}}>Country</th> */}
                              <th style={{marginLeft: '20px'}}>IP Address</th>
                              <th style={{marginLeft: '20px'}}>Date Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ActivityLogData.map(item => (
                              <tr key={item.file_log_id}>
                                <td style={{marginLeft: '20px', fontSize: '14px'}}>
                                {item?.event ? item.event.split('-').join(' ') : ''}
                                </td>
                                <td style={{marginLeft: '20px', fontSize: '14px'}}>
                                  {item?.description.split(/(\S+@\S+\.\S+)/).map((part, index) => {
                                    // Check if the part is an email address
                                    if (/\S+@\S+\.\S+/.test(part)) {
                                      // Apply fontWeight 700 for email address
                                      return (
                                        <span key={index} style={{fontWeight: 700}}>
                                          {part}
                                        </span>
                                      );
                                    } else {
                                      // Keep other parts as they are
                                      return <span key={index}>{part}</span>;
                                    }
                                  })}
                                </td>
                                {/* <td style={{marginLeft: '20px', fontSize: '14px'}}>{item.location_country}</td> */}
                                <td style={{marginLeft: '20px', fontSize: '14px'}}>{item.ip_address}</td>
                                <td style={{marginLeft: '20px', fontSize: '14px'}}>
                                  {/* {item.formattedDate} {item.timeZone} */}
                                  {formatDateCustomTime(item.location_date)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                      {/* <Col xs={12} md={12}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        fontSize: '20px',
                        fontWeight: 600,
                        marginTop: '50px',
                      }}>
                      <span>Event</span>
                      <span>User</span>
                      <span>Date |Time |Time Zone</span>
                      <span>IP Address</span>
                    </div>
                    {signersData.map((field, index) => (
                      <div style={{display: 'flex', justifyContent: 'left', fontSize: '16px', marginTop: '20px'}}>
                        <span style={{marginLeft: '40px'}}>Sign Document</span>
                        <span style={{marginLeft: '40px'}}>{field.email}</span>
                        <span style={{marginLeft: '90px'}}>{formatDateCustomTime(field.completed_at)}</span>
                        
                      </div>
                    ))}
                  </Col> */}
                    </Row>

                    {/* Add your content for the additional page here */}
                  </div>
                )}
                {/* </div> */}
              </div>
              {/* {ActivityLogHide?null:<> */}

              {/* </>} */}
            </Col>
            <Col
              xs={2}
              style={{
                position: 'relative',
                // backgroundColor: 'white',
                border: '1px solid lightGrey',
                maxHeight: '87dvh',
                overflow: 'auto',
              }}>
              {/* Pages  */}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <div style={{display: 'flex', justifyContent: 'center', width: '100%', marginTop: '25px'}}>
                  <Document
                    file={`${BASE_URL}${imageUrls}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    noData="No PDF loaded">
                    {Array.from({length: numPages}, (_, i) => i + 1).map(page => (
                      <>
                        <div
                          id={`full-page-${page}`}
                          key={page}
                          style={{
                            border: activePage === page ? '2px solid #23b3e8' : '2px solid lightGrey',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => {
                            if (activePage !== page) {
                              e.target.style.border = '2px solid #c4c4c4';
                              e.target.style.borderRadius = '10px';
                            }
                          }}
                          onMouseLeave={e => {
                            if (activePage !== page) {
                              e.target.style.border = '2px solid white';
                            }
                          }}
                          onClick={() => handlePageClick(page)}>
                          <Page
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            key={page}
                            pageNumber={page}
                            width={150}
                            className={activePage === page ? 'active-page' : ''}
                            // onClick={() => handlePageClick(page)}
                          ></Page>
                        </div>
                        <h6 style={{marginBlock: '10px', textAlign: 'center'}}> Page {page}</h6>{' '}
                      </>
                    ))}
                  </Document>
                </div>
                {/* {ActivityLogHide?null:<> */}
                <div
                  onClick={() => handlePageClick('last')}
                  // id="additional-page"
                  style={{
                    // position: 'relative', top: `${numPages * canvasWidth}px`, left: 0,
                    width: 150,
                    height: '200px',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    //  zIndex: 2,
                    border: '1px solid lightgrey',
                  }}>
                  <Row>
                    <Col xs={6} md={6}>
                      <img
                        src={logoRemoveBgFull}
                        style={{
                          width: '30px',
                          height: 'auto',
                          marginLeft: '20px',
                          marginRight: '20px',
                        }}
                      />
                    </Col>
                    <Col xs={6} md={6}>
                      <h1 style={{textAlign: 'center', margin: '5px', color: 'black', fontSize: '5px'}}>Audit Trail</h1>
                    </Col>

                    <Col xs={12} md={12} style={{height: '10px'}}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          fontSize: '4px',
                          fontWeight: 600,
                          marginTop: '50px',
                        }}>
                        <span>Event</span>
                        <span>User</span>
                        <span>Date |Time |Time Zone</span>
                        <span>IP Address</span>
                      </div>
                      {ActivityLogData.slice(0, 5).map((field, index) => (
                        <div style={{display: 'flex', justifyContent: 'left', fontSize: '4px', height: '20px'}}>
                          <span>{field.event}</span>
                          <span style={{marginLeft: '4px'}}>{field.email}</span>
                          <span style={{marginLeft: '4px'}}>{field.location_country}</span>

                          {/* <span style={{marginLeft: '90px'}}>{formatDateCustomTime(field.completed_at)}</span> */}
                        </div>
                      ))}
                    </Col>
                  </Row>

                  {/* Add your content for the additional page here */}
                </div>
                <h6 style={{marginBlock: '10px', textAlign: 'center'}}> Page {numPages + 1}</h6> {/* </>} */}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default CompletedDocViewDownload;
