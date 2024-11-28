import { useEffect, useState } from "react";
import toastAlert from "@components/toastAlert";
import {
  TabContent,
  TabPane,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Spinner,
  UncontrolledTooltip,
  Table,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import pdfIcon from "../assets/images/pages/pdfIcon.png";

import shareLinkImg from "../assets/images/pages/share_link.png";
import { BASE_URL, deleteReq, FrontendBaseUrl, get, post } from "../apis/api";
import {
  ArrowUpCircle,
  AtSign,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Edit2,
  Eye,
  File,
  FilePlus,
  FileText,
  Folder,
  FolderPlus,
  Grid,
  Inbox,
  Key,
  Link,
  MoreVertical,
  Plus,
  RefreshCcw,
  RotateCw,
  Slash,
  Star,
  Trash2,
  User,
  Users,
  X,
} from "react-feather";
import {
  formatDate,
  formatDateCustomTimelastActivity,
  formatDateTime,
  formatDateTimeActivityLog,
  highlightText,
} from "../utility/Utils";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import emptyImage from "@assets/images/pages/empty.png";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
import FileUploaderBulkLink from "../components/upload-file/FileUploaderBulkLink";
import getActivityLogUser from "../utility/IpLocation/MaintainActivityLogUser";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import getUserPlan from "../utility/IpLocation/GetUserPlanData";
import ModalUpgradePremium from "../components/ModalUpgradePremium";
import ModalConfirmationPlan from "../components/ModalConfirmationPlan";
import useLogo from "@uselogo/useLogo";
import SpinnerCustom from "../components/SpinnerCustom";
import CustomButton from "../components/ButtonCustom";
import { getUser, selectLogo, selectLoading } from "../redux/navbar";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { decrypt } from "../utility/auth-token";
import FreeTrialAlert from "../components/FreeTrailAlert";
import PaginationComponent from "../components/pagination/PaginationComponent";
import { useTranslation } from "react-i18next";
import CustomBadge from "../components/BadgeCustom";
import "./StylesheetPhoneNo.css";

const BulkLinks = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const [LoaderFileAdd, setLoaderFileAdd] = useState(false);
  const dispatch = useDispatch();
  const {
    user,
    plan,
    subscription,
    isSubscripitonActive,
    isFreeTrialExpired,
    daysLeftExpiredfreePlan,
    userBulkDocuments,
    status,
    error,
  } = useSelector((state) => state.navbar);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("warning");
  const [SendTemplateResponses1, setSendTemplateResponses1] = useState(false);
  const logo = useSelector(selectLogo);
  const loading = useSelector(selectLoading);
  const [SendTemplateResponses, setSendTemplateResponses] = useState(false);
  const [planAlert, setPlanAlert] = useState(false);
  const [active, setActive] = useState("0");

  const { subFolderId, prevId } = useParams();
  const [documentName, setDocumentName] = useState("");

  const [statusData1, setStatusData1] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [restoreAllLoader, setRestoreAllLoader] = useState(false);
  const [ItemRestoreAllConfirm, setItemRestoreAllConfirm] = useState(false);
  const [bulk_link_id, setBulk_link_id] = useState("");
  const [TitleBulk, setTitleBulk] = useState("");
  const [responseTemp, setResponsesTemp] = useState([]);
  const [loaderResponseFetch, setLoaderResponseFetch] = useState(false);
  const [bulk_link_id_data, setbulk_link_id_data] = useState("");
  const [bulk_link_detail, setbulk_link_detail] = useState(null);
  const [loaderResponseFetch1, setLoaderResponseFetch1] = useState(false);
  const [modalUpgradePremium, setModalUpgradePremium] = useState(false);

  const getFunctionTemplateDetails = async (fileId) => {
    // setImageUrls(apiData.result[0].image);
    setLoaderResponseFetch(true);
    // get Images from db
    //console.log(fileId);
    const postData = {
      bulk_link_id: fileId,
    };
    const apiData = await post("bulk_links/viewBulkLink", postData); // Specify the endpoint you want to call
    //console.log('File Template Fetch');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      setResponsesTemp(apiData.response_data);
      setSendTemplateResponses(true);
      setLoaderResponseFetch(false);
      setbulk_link_detail(apiData.result);
    }
  };
  const getFunctionTemplateAuditLog = async (fileId) => {
    // setImageUrls(apiData.result[0].image);
    setLoaderResponseFetch1(true);
    // get Images from db
    //console.log(fileId);
    const postData = {
      bulk_link_id: fileId,
    };
    const apiData = await post("bulk_links/viewBulkLinkAuditLog", postData); // Specify the endpoint you want to call
    //console.log('File Template Fetch');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      setResponsesTemp(apiData.response_data);
      setSendTemplateResponses1(true);
      setLoaderResponseFetch1(false);
      setbulk_link_detail(apiData.result);
    }
  };
  const [SendTemplateResponses2, setSendTemplateResponses2] = useState(false);
  const [ResponsesTemp1, setResponsesTemp1] = useState([]);
  const getFunctionTemplateAuditLogSingle = async (fileId, emailData) => {
    // setImageUrls(apiData.result[0].image);
    setLoaderResponseFetch1(true);
    // get Images from db
    //console.log(fileId);
    const postData = {
      bulk_link_id: fileId,
      email: emailData,
    };
    const apiData = await post(
      "bulk_links/viewBulkLinkAuditLogSingle",
      postData
    ); // Specify the endpoint you want to call
    //console.log('File Template Fetch');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      setResponsesTemp1(apiData.response_data);
      setSendTemplateResponses2(true);
      setLoaderResponseFetch1(false);
      // setbulk_link_detail(apiData.result);
    }
  };
  const sizeP_icon = window.innerWidth < 730 ? 15 : 20;
  const pdfIcon_width = window.innerWidth < 730 ? "20px" : "30px";
  const fontSize_m = window.innerWidth < 730 ? "12px" : "16px";
  // Add this function to handle checkbox changes
  const handleCheckboxChange = (event, item, name) => {
    if (event.target.checked) {
      //console.log('selectedItems');

      //console.log(selectedItems);

      setSelectedItems((prevItems) => [...prevItems, { item, name }]);
    } else {
      //console.log(event.target.checked);

      //console.log(selectedItems);
      setSelectedItems((prevItems) => prevItems.filter((i) => i.item !== item));
    }
  };
  const [completeProfile, setCompleteProfile] = useState(false);

  const StatusChange = async () => {
    setRestoreAllLoader(true);

    const postData = {
      status: statusData1,
      bulk_link_ids: selectedItems,
    };
    try {
      const apiData = await post("bulk_links/updateStatus", postData); // Specify the endpoint you want to call
      //console.log('CHNAGE STATUS BULK LINK ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "PUBLIC-FORM-STATUS-CHANGED",
          description: `${email} Changed public form ${JSON.stringify(
            selectedItems
          )} status to ${statusData1}`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemRestoreAllConfirm(false);
        setRestoreAllLoader(false);
        fetchAllFiles();
        fetchAllBulkLinks();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };

  const [foldersArray, setFoldersArray] = useState([]);
  const [filesArray, setFilesArray] = useState([]);

  const fetchAllBulkLinks = async () => {
    const postData = {
      user_id: user?.user_id,
    };
    try {
      const apiData = await post("bulk_links/get_bulk_link", postData); // Specify the endpoint you want to call
      //console.log('GET FOLDER BY USER ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        // toastAlert("error", apiData.message)
        setFoldersArray([]);
      } else {
        // //console.log(apiData.result)
        setFoldersArray(apiData.result);
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
    setFolderLoader(false);
  };
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = foldersArray.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchAllFiles = async (statusData) => {
    //console.log('subFolderId');

    //console.log(subFolderId);
    if (
      subFolderId === null ||
      subFolderId === undefined ||
      subFolderId === "null" ||
      subFolderId === "undefined"
    ) {
      const postData = {
        user_id: user?.user_id,
        // user_id: 100617,
        subFolder: false,
        status: statusData,
      };
      try {
        const apiData = await post("file/getArchieveFiles", postData); // Specify the endpoint you want to call
        //console.log('GET Files BY USER ID ');

        //console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          // toastAlert("error", apiData.message)
          setFilesArray([]);
        } else {
          toastAlert("succes", apiData.message);
          //console.log(apiData.result);
          setFilesArray(apiData.result);
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
      }
    } else {
      //console.log('Not null subfolder ');
      //console.log(subFolderId);

      const postData = {
        user_id: user?.user_id,
        // user_id: 100617,
        subFolder: true,
        subFolder_id: subFolderId,
        status: statusData,
      };
      try {
        const apiData = await post("file/getArchieveFiles", postData); // Specify the endpoint you want to call
        //console.log('GET Files BY USER ID Subfolder');

        //console.log(apiData);
        if (apiData.error === true || apiData.error === undefined) {
          // toastAlert("error", apiData.message)
          setFilesArray([]);
        } else {
          toastAlert("succes", apiData.message);
          //console.log(apiData.result);
          setFilesArray(apiData.result);
        }
      } catch (error) {
        //console.log('Error fetching data:', error);
      }
    }
  };
  const handlePageChangeNo = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };
  const handlePageChangeNo1 = (e) => {
    setItemsPerPage1(parseInt(e.target.value));
    setCurrentPage1(1);
  };
  const handlePageChangeNo2 = (e) => {
    setItemsPerPage2(parseInt(e.target.value));
    setCurrentPage2(1);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items to display per page
  // let allItems = [...foldersArray, ...filesArray];
  const [itemsPerPage1, setItemsPerPage1] = useState(10); // Number of items to display per page
  const [itemsPerPage2, setItemsPerPage2] = useState(10); // Number of items to display per page

  // Calculate the index of the first and last item on the current page
  let indexOfLastItem = currentPage * itemsPerPage;
  let indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let indexOfLastItem1 = currentPage1 * itemsPerPage1;
  let indexOfFirstItem1 = indexOfLastItem1 - itemsPerPage1;
  let indexOfLastItem2 = currentPage2 * itemsPerPage2;
  let indexOfFirstItem2 = indexOfLastItem2 - itemsPerPage2;
  // Assuming you have your data stored in an array called `allItems`
  let currentItems = foldersArray.slice(indexOfFirstItem, indexOfLastItem);
  let currentItems1 = ResponsesTemp1.slice(indexOfFirstItem1, indexOfLastItem1);
  let currentItems2 = responseTemp.slice(indexOfFirstItem2, indexOfLastItem2);

  const fetchPlanUser = async () => {
    const dataGet = await getCheckUserPlan();
    //console.log('dataGet');
    //console.log(dataGet);
    if (dataGet?.userPlanDetails?.template === "unlimited") {
      // setShow(true);
      //console.log('dshjhjds');
    } else {
      setModalUpgradePremium(true);
      // toastAlert('error', ' Upgrade your plan!');
    }
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);

    //console.log('Page changed to:', pageNumber);
    indexOfLastItem = currentPage * itemsPerPage;
    //console.log(indexOfLastItem);

    indexOfFirstItem = indexOfLastItem - itemsPerPage;
    //console.log(indexOfFirstItem);

    currentItems = foldersArray.slice(indexOfFirstItem, indexOfLastItem);
    //console.log(currentItems);
  };
  const handlePageChange2 = (pageNumber) => {
    setCurrentPage2(pageNumber);

    //console.log('Page changed to:', pageNumber);
    indexOfLastItem2 = currentPage2 * itemsPerPage2;
    //console.log(indexOfLastItem);

    indexOfFirstItem2 = indexOfLastItem2 - itemsPerPage2;
    //console.log(indexOfFirstItem);

    currentItems2 = responseTemp.slice(indexOfFirstItem2, indexOfLastItem2);
    //console.log(currentItems);
  };
  const handlePageChangeauditRes = (pageNumber) => {
    setCurrentPage1(pageNumber);

    //console.log('Page changed to:', pageNumber);
    indexOfLastItem1 = currentPage1 * itemsPerPage1;
    //console.log(indexOfLastItem);

    indexOfFirstItem1 = indexOfLastItem1 - itemsPerPage1;
    //console.log(indexOfFirstItem);

    currentItems1 = ResponsesTemp1.slice(indexOfFirstItem1, indexOfLastItem1);
    //console.log(currentItems);
  };
  // delete folder
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);

  // delete folderv api
  const DeleteBulkLink = async () => {
    setLoadingDelete(true);
    //console.log(selectedItems);
    const postData = {
      bulk_link_ids: selectedItems,
    };
    try {
      const apiData = await post("bulk_links/deleteBulkLinks", postData); // Specify the endpoint you want to call
      //console.log('DELETE BULK LINKS ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        const user_id = user?.user_id;
        const email = user?.email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: "PUBLIC-FORM-DELETED",
          description: `${email} deleted public form ${JSON.stringify(
            selectedItems
          )}`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmation(false);
        setLoadingDelete(false);
        fetchAllBulkLinks();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };

  // Add files
  const [show, setShow] = useState(false);
  const [link, setLink] = useState("");
  const [subfolderState, setSubfolderState] = useState(false);
  const [folderLoader, setFolderLoader] = useState(true);
  const [modalSize, setModalSize] = useState("modal-lg");
  const [toastAlertIdBulk, setToastAlertIdBulk] = useState(false);
  const [locationIP, setLocationIP] = useState("");
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  const [userPlanCurrent, setUserPlanCurrent] = useState(null);
  const [userTotalDocCount, setUserTotalDocCount] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("email");
  const [data, setData] = useState([]);
  const getCheckUserPlan = async () => {
    const profileCompleted = await getUserPlan(user?.user_id);
    //console.log('PROFILE COMPLETED');
    //console.log(profileCompleted);
    return profileCompleted;
  };

  useEffect(() => {
    const results = responseTemp.filter((item) =>
      item.email.toLowerCase().includes(searchTerm)
    );

    setData(results);
  }, [searchTerm]);
  const [loaderData, setLoaderData] = useState(true);
  useEffect(() => {
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            fetchAllBulkLinks(),
            // fetchlocationUrl(),
            // fetchAllFiles(StatusData),
            // fetchAllFolder(),
            // fetchAllCardsDashboard(),
            // fetchAllFoldersForModalMove(),
          ]);
          console.log("REDUC SH");
          console.log(plan);
          setUserPlanCurrent(plan);
          setUserTotalDocCount(userBulkDocuments);
          const queryParams = new URLSearchParams(location.search);
          const toastAlertD = queryParams.get("toastAlert");
          const toastAlertNAme = queryParams.get("name");
          //console.log('toastAlertD');

          //console.log(toastAlertD);
          //console.log(toastAlertNAme);
          console.log("PLAN DATA ");

          if (toastAlertD === null || toastAlertD === undefined) {
            //console.log('No toastAlert ');
          } else {
            //console.log(' toastAlert ');
            setToastAlertIdBulk(true);
            setTitleBulk(toastAlertNAme);
            setLink(`${FrontendBaseUrl}public-form/esign/${toastAlertD}`);
          }
          // setUserDetailsCutrrent(user);
          // setUserPlanCurrent(plan);
          // setUserTotalDocCount(docuemntsCount)
          // setLoaderData(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoaderData(false);
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

  return (
    <div>
      <FreeTrialAlert
        isSubscripitonActive={isSubscripitonActive}
        subscription={subscription}
        isFreeTrialExpired={isFreeTrialExpired}
        daysleftExpired={daysLeftExpiredfreePlan}
      />

      {/* Row for table view and card view of documnets  */}
      <Row>
        {window.innerWidth < 730 ? (
          <>
            <Col
              md="12"
              xs="12"
              className="d-flex justify-content-between mt-1"
            >
              <h1 style={{ flexGrow: 1 }}>{t("Public Forms")}</h1>
              <div
                style={{
                  marginRight: "10px",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                {folderLoader ? null : (
                  <>
                    {/* {modalUpgradePremium ? null : ( */}
                    <CustomButton
                      style={{
                        boxShadow: "none",
                        marginLeft: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      color="primary"
                      size="sm"
                      onClick={async () => {
                        // window.location.href = "/create-public-form";
                        // setLoaderFileAdd(false);
                        // setLoaderFileAdd(true);
                        if (plan?.public_forms_count === "UNLIMITED") {
                          window.location.href = "/create-public-form";

                          setLoaderFileAdd(false);
                        } else {
                          const documents_to_sign_limit =
                            plan?.public_forms_count;
                          console.log("userTotalDocCount");
                          console.log(userTotalDocCount);
                          console.log("documents_to_sign_limit");

                          console.log(documents_to_sign_limit);

                          if (
                            parseInt(userTotalDocCount) <
                            parseInt(documents_to_sign_limit)
                          ) {
                            console.log("sahgdhgads");
                            window.location.href = "/create-public-form";
                            setLoaderFileAdd(false);
                          } else {
                            console.log("UPGRADE ");
                            setModalUpgradePremium(true);
                            setLoaderFileAdd(false);
                          }
                        }
                      }}
                      text={
                        <>
                          {" "}
                          {LoaderFileAdd ? (
                            <Spinner color="light" size="sm" />
                          ) : (
                            <Plus
                              id="RestoreAll"
                              size={20}
                              style={{ cursor: "pointer", marginLeft: "10px" }}
                            />
                          )}
                          <span style={{ marginLeft: "10px" }}>
                            {t("Public Form")}
                          </span>
                        </>
                      }
                    />

                    {/* )} */}
                  </>
                )}
              </div>
            </Col>
            <Col
              md="12"
              xs="12"
              className="d-flex justify-content-between  mt-1"
              style={{ alignItems: "center" }}
            >
              {/* <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}> */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                }}
              >
                <Input
                  style={{
                    height: "35px",
                    boxShadow: "none",
                    fontSize: "14px",
                    width: "100%",
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  id="login-email"
                  placeholder={t("Search by Title")}
                  autoFocus
                />
                {searchQuery && (
                  <span
                    style={{
                      position: "absolute",
                      right: "10px", // Adjust the position to fit the icon within the input
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSearchQuery(""); // Clear the search query
                    }}
                  >
                    &times; {/* Cross icon (X) */}
                  </span>
                )}
              </div>
              <div
                style={{
                  marginRight: "10px",
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                <RotateCw
                  id="refresh-icon"
                  onClick={async () => {
                    setFolderLoader(true);
                    await fetchAllBulkLinks();
                  }}
                />
                <UncontrolledTooltip placement="bottom" target="refresh-icon">
                  {t("Refresh")}
                </UncontrolledTooltip>
              </div>
            </Col>
          </>
        ) : (
          <>
            {" "}
            <Col
              md="12"
              xs="12"
              className="d-flex justify-content-between mt-1"
            >
              <h1 style={{ flexGrow: 1 }}>{t("Public Forms")}</h1>
              {/* <div style={{ display: 'flex', justifyContent: 'right', alignItems: 'center' }}> */}
              <div style={{ marginRight: "10px", cursor: "pointer" }}>
                <RotateCw
                  id="refresh-icon"
                  onClick={async () => {
                    setFolderLoader(true);
                    await fetchAllBulkLinks();
                  }}
                />
                <UncontrolledTooltip placement="bottom" target="refresh-icon">
                  {t("Refresh")}
                </UncontrolledTooltip>
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "right",
                  alignItems: "center",
                }}
              >
                <Input
                  style={{
                    height: "35px",
                    boxShadow: "none",
                    fontSize: "14px",
                    paddingLeft: "30px", // Add padding to make space for the icon
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  id="login-email"
                  placeholder={t("Search by Title")}
                  autoFocus
                />
                {searchQuery && (
                  <span
                    style={{
                      position: "absolute",
                      right: "10px", // Adjust the position to fit the icon within the input
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSearchQuery(""); // Clear the search query
                    }}
                  >
                    &times; {/* Cross icon (X) */}
                  </span>
                )}
              </div>

              {folderLoader ? null : (
                <>
                  {/* {modalUpgradePremium ? null : ( */}
                  <CustomButton
                    style={{
                      boxShadow: "none",
                      marginLeft: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    color="primary"
                    size="sm"
                    onClick={async () => {
                      // window.location.href = "/create-public-form";
                      // setLoaderFileAdd(false);
                      // setLoaderFileAdd(true);
                      if (plan?.public_forms_count === "UNLIMITED") {
                        window.location.href = "/create-public-form";

                        setLoaderFileAdd(false);
                      } else {
                        const documents_to_sign_limit =
                          plan?.public_forms_count;
                        console.log("userTotalDocCount");
                        console.log(userTotalDocCount);
                        console.log("documents_to_sign_limit");

                        console.log(documents_to_sign_limit);

                        if (
                          parseInt(userTotalDocCount) <
                          parseInt(documents_to_sign_limit)
                        ) {
                          console.log("sahgdhgads");
                          window.location.href = "/create-public-form";
                          setLoaderFileAdd(false);
                        } else {
                          console.log("UPGRADE ");
                          setModalUpgradePremium(true);
                          setLoaderFileAdd(false);
                        }
                      }
                    }}
                    text={
                      <>
                        {" "}
                        {LoaderFileAdd ? (
                          <Spinner color="light" size="sm" />
                        ) : (
                          <Plus
                            id="RestoreAll"
                            size={20}
                            style={{ cursor: "pointer", marginLeft: "10px" }}
                          />
                        )}
                        <span style={{ marginLeft: "10px" }}>
                          {t("Public Form")}
                        </span>
                      </>
                    }
                  />

                  {/* )} */}
                </>
              )}
            </Col>
          </>
        )}

        {/* <Card>
          <CardBody style={{backgroundColor:'transparent'}}>
            <CardText> */}
        <div className="nav-horizontal">
          {/* vertical for vertical  */}
          {/* {active} */}
          <TabContent activeTab={active}>
            <TabPane tabId={active}>
              {window.innerWidth < 730 ? (
                <>
                  {" "}
                  <Row className="match-height mb-2 mt-2">
                    <Col md="12" xs="12">
                      <div className="card-container">
                        {folderLoader ? (
                          <Row>
                            <Col
                              md="12"
                              xs="12"
                              className="d-flex justify-content-center"
                            >
                              <SpinnerCustom color="primary" />
                            </Col>
                          </Row>
                        ) : filteredItems.length > 0 ||
                          (filesArray.length > 0 && folderLoader === false) ? (
                          currentItems.map((item, index) => (
                            <>
                              <Card style={{ margin: "10px" }}>
                                {/* <CardImg top src={img1} alt='card1' /> */}
                                <CardBody
                                  style={{
                                    cursor: "pointer",
                                  }}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <CardTitle
                                      tag="h4"
                                      className="d-flex justify-content-between align-items-center"
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "left",
                                          alignItems: "center",
                                        }}
                                      >
                                        {" "}
                                        <img
                                          src={pdfIcon}
                                          alt="pdf icon"
                                          style={{
                                            width: pdfIcon_width,
                                            height: "auto",
                                          }}
                                        />
                                        <span
                                          style={{
                                            fontSize: "14px",
                                            marginTop: "2%",
                                            marginLeft: "10px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: "110px",
                                            display: "inline-block",
                                          }}
                                          title={
                                            item.title.length > 10
                                              ? item.title
                                              : null
                                          }
                                        >
                                          {highlightText(
                                            `${item.title}`,
                                            searchQuery
                                          )}
                                          {/* {item.title} */}
                                        </span>
                                      </div>
                                      <div>
                                        {item?.status === "active" ? (
                                          <Badge color="success">
                                            <Check
                                              size={12}
                                              className="align-middle me-25"
                                            />
                                          </Badge>
                                        ) : (
                                          <Badge color="danger">
                                            <X
                                              size={12}
                                              className="align-middle me-25"
                                            />
                                          </Badge>
                                        )}
                                      </div>

                                      {/* <span style={{ marginLeft: '10px' }}>
                                          {item.name}
                                        </span> */}
                                    </CardTitle>
                                    {/* folder icon here */}
                                    {/* <File size={24} /> */}
                                    <div
                                      style={{
                                        marginTop: "-25px",
                                      }}
                                    ></div>
                                  </div>

                                  {/* <CardText>
                                This is a wider card with supporting text below as a natural lead-in to additional content. This content
                                is a little bit longer.
                              </CardText> */}
                                  {/* image here */}

                                  {/* <Badge color='primary'>
                <Star size={12} className='align-middle me-25' />
                <span className='align-middle'>Primary</span>
              </Badge> */}
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      {/* view  */}
                                      {item.url === null ||
                                      item.url === undefined ? null : (
                                        <Copy
                                          size={sizeP_icon}
                                          style={{
                                            cursor: "pointer",
                                            color: "#3FB1DB",
                                          }}
                                          onClick={() => {
                                            // setLink(item.url);
                                            setLink(`${item.url}`);

                                            //console.log(item);
                                            setTitleBulk(item.file_name);
                                            setToastAlertIdBulk(true);
                                          }}
                                        />
                                      )}
                                      <Eye
                                        style={{
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                        }}
                                        size={sizeP_icon}
                                        onClick={() => {
                                          window.location.href = `e-sign-form-create/${item.bulk_link_id}?open=true `;
                                        }}
                                      />
                                      <FileText
                                        size={sizeP_icon}
                                        style={{
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                          color: "#FFCC99",
                                        }}
                                        onClick={() => {
                                          setLink(item.url);
                                          // setLink(`${FrontendBaseUrl}public-form/esign/${item.url}`);

                                          setbulk_link_id_data(
                                            item.bulk_link_id
                                          );
                                          //console.log(item);
                                          setTitleBulk(item.file_name);
                                          // setToastAlertIdBulk(true);
                                          getFunctionTemplateDetails(
                                            item.bulk_link_id
                                          );
                                          // setSendTemplateResponses(true);
                                        }}
                                      />
                                      <AtSign
                                        style={{
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                          color: "#FFCC99",
                                        }}
                                        size={sizeP_icon}
                                        onClick={() => {
                                          setbulk_link_id_data(
                                            item.template_id
                                          );
                                          setTitleBulk(`${item.file_name}`);
                                          getFunctionTemplateAuditLog(
                                            item.bulk_link_id
                                          );
                                          // setSendTemplateResponses(true);
                                        }}
                                      />

                                      {/* Icons for edit delete with tooltip  */}
                                    </div>

                                    {/* <div style={{ display: 'flex', justifyContent: 'right' }}>
                                      <h5 className='text-muted d-flex align-right'> {formatDateCustomTimelastActivity(
                                                    item.created_at
                                                  )}</h5>
          
                                    </div>  */}
                                  </div>
                                </CardBody>
                                {/* <CardFooter>
                                  
                                  </CardFooter> */}
                              </Card>
                            </>
                          ))
                        ) : (
                          <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                            <Col
                              md="12"
                              xs="12"
                              className="d-flex justify-content-center align-items-center"
                            >
                              <img
                                src={emptyImage}
                                alt="empty"
                                style={{ width: "100px", height: "auto" }}
                              />
                              <h4>{t("No File Exist")}</h4>
                            </Col>
                          </Row>
                        )}
                      </div>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row className="match-height mb-2 mt-2">
                    {/* <Col md='4' xs='12'> */}
                    <Col md="12" xs="12">
                      {/* <Table> */}
                      {/* <Card style={{padding: '15px'}}> */}
                      <div className="table-responsive">
                        <Table>
                          <thead>
                            <tr>
                              <th></th>

                              <th>
                                <h4
                                  className="table_header_size"
                                  style={{ fontWeight: 700 }}
                                >
                                  {t("File Name")}{" "}
                                </h4>
                              </th>
                              <th>
                                <h4
                                  className="table_header_size"
                                  style={{ fontWeight: 700 }}
                                >
                                  {t("Status")}{" "}
                                </h4>
                              </th>
                              <th>
                                <h4
                                  className="table_header_size"
                                  style={{ fontWeight: 700 }}
                                >
                                  {t("Created On")}
                                </h4>
                              </th>
                              <th>
                                <h4
                                  className="table_header_size"
                                  style={{
                                    fontWeight: 700,
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {t("Date Of Expiry")}{" "}
                                </h4>
                              </th>
                              <th>
                                <h4
                                  className="table_header_size"
                                  style={{ fontWeight: 700 }}
                                  width={10}
                                >
                                  {t("Responses")}{" "}
                                </h4>
                              </th>
                              <th>
                                <h4
                                  className="table_header_size"
                                  style={{ fontWeight: 700 }}
                                >
                                  {" "}
                                  {t("Actions")}
                                </h4>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {folderLoader ? (
                              <tr>
                                <td colspan="8">
                                  <Row>
                                    <Col
                                      md="12"
                                      xs="12"
                                      className="d-flex justify-content-center"
                                    >
                                      <SpinnerCustom color="primary" />
                                    </Col>
                                  </Row>
                                </td>
                              </tr>
                            ) : (
                              <tr>
                                <td colspan="8">
                                  {/* {modalUpgradePremium ? (
                              <>
                                <div
                                  className="d-flex flex-column justify-content-center align-items-center text-left"
                                  style={{marginBlock: '10px'}}>
                                  <ArrowUpCircle size={70} style={{color: '#ffdd2e'}} />
                                  <div style={{marginLeft: '15px', textAlign: 'center'}}>
                                    <h2 style={{fontWeight: 600, marginTop: '1%'}}>Upgrade Required</h2>
                                    <h3 style={{width: '100%', lineHeight: 1.5}}>
                                      To use this feature, you need to upgrade your plan.
                                    </h3>
                                    <Button
                                      onClick={() => {
                                        setCompleteProfile(true);
                                      }}
                                      style={{boxShadow: 'none'}}
                                      color="success"
                                      size="sm">
                                      <ArrowUpCircle size={20} />
                                      <span className="align-middle ms-25" style={{fontSize: '16px'}}>
                                        UPGRADE PLAN
                                      </span>
                                    </Button>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <> */}
                                  {filteredItems.length > 0 ||
                                  (filesArray.length > 0 &&
                                    folderLoader === false) ? null : (
                                    <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                                      <Col
                                        md="12"
                                        xs="12"
                                        className="d-flex justify-content-center align-items-center"
                                      >
                                        <img
                                          src={emptyImage}
                                          alt="empty"
                                          style={{
                                            width: "100px",
                                            height: "auto",
                                          }}
                                        />
                                        <h4>{t("No File Exist")}</h4>
                                      </Col>
                                    </Row>
                                  )}
                                  {/* </>
                            )} */}
                                </td>
                              </tr>
                            )}

                            {searchQuery.length === 0 ? (
                              <>
                                {currentItems.length > 0
                                  ? currentItems.map((item, index) => (
                                      <>
                                        <tr>
                                          <td>
                                            <input
                                              type="checkbox"
                                              onChange={(event) => {
                                                //console.log(item);
                                                handleCheckboxChange(
                                                  event,
                                                  item.bulk_link_id,
                                                  item.file_name
                                                );
                                              }}
                                            />
                                          </td>
                                          <td className="table_row_size">
                                            <span
                                              style={{
                                                display: "flex",
                                                cursor: "pointer",
                                              }}
                                              onClick={() => {
                                                window.location.href = `e-sign-form-create/${item.bulk_link_id}?open=true `;
                                              }}
                                            >
                                              {/* <Folder style={{ color: `${item.color}` }} size={25} /> */}
                                              <h3
                                                style={{
                                                  marginLeft: "5px",
                                                  whiteSpace: "nowrap",
                                                }}
                                              >
                                                {item?.title}
                                              </h3>
                                            </span>
                                          </td>

                                          <td className="table_row_size">
                                            {item?.status === "active" ? (
                                              <Badge color="success">
                                                <Check
                                                  size={12}
                                                  className="align-middle me-25"
                                                />
                                                <span
                                                  className="align-middle"
                                                  style={{
                                                    fontSize: "14px",
                                                  }}
                                                >
                                                  {t("Active")}
                                                </span>
                                              </Badge>
                                            ) : (
                                              <Badge color="danger">
                                                <X
                                                  size={12}
                                                  className="align-middle me-25"
                                                />
                                                <span
                                                  className="align-middle"
                                                  style={{
                                                    fontSize: "14px",
                                                  }}
                                                >
                                                  {t("In Active")}
                                                </span>
                                              </Badge>
                                            )}

                                            {/* <h3 style={{ marginLeft: '20px' }}>{item?.status}</h3> */}
                                          </td>
                                          <td className="table_row_size">
                                            <h3
                                              style={{ whiteSpace: "nowrap" }}
                                            >
                                              {formatDateCustomTimelastActivity(
                                                item.created_at
                                              )}
                                            </h3>
                                          </td>
                                          <td className="table_row_size">
                                            {item.expires_option === true ||
                                            item.expires_option === "true" ? (
                                              <h3
                                                style={{ whiteSpace: "nowrap" }}
                                              >
                                                {formatDateCustomTimelastActivity(
                                                  item.expiry_date
                                                )}
                                              </h3>
                                            ) : (
                                              <h3>--</h3>
                                            )}
                                          </td>
                                          <td className="table_row_size">
                                            <h3>
                                              {item.responses === null ||
                                              item.responses === undefined ||
                                              item.responses === "null" ||
                                              item.responses === "undefined"
                                                ? "0"
                                                : item.responses}
                                            </h3>
                                          </td>
                                          <td>
                                            <div
                                              className="d-flex justify-content-between"
                                              style={{ alignItems: "center" }}
                                            >
                                              {/* <div> */}

                                              {item.url === null ||
                                              item.url === undefined ? null : (
                                                <>
                                                  <CustomBadge
                                                    onClick={() => {
                                                      // setLink(item.url);
                                                      setLink(`${item.url}`);

                                                      //console.log(item);
                                                      setTitleBulk(
                                                        item.file_name
                                                      );
                                                      setToastAlertIdBulk(true);
                                                    }}
                                                    color="success"
                                                    text={t("Copy Link")}
                                                  />
                                                  {/* <Copy
                                              id="copy"
                                              style={{ cursor: "pointer" }}
                                              onClick={() => {
                                                // setLink(item.url);
                                                setLink(`${item.url}`);

                                                //console.log(item);
                                                setTitleBulk(item.file_name);
                                                setToastAlertIdBulk(true);
                                              }}
                                              size={20}
                                            />
                                            <UncontrolledTooltip
                                              placement="top"
                                              target="copy"
                                            >
                                              {t("Copy Link")}
                                            </UncontrolledTooltip> */}
                                                </>
                                              )}
                                              <CustomBadge
                                                onClick={() => {
                                                  window.location.href = `e-sign-form-create/${item.bulk_link_id}?open=true `;
                                                }}
                                                color="info"
                                                text={t("View")}
                                              />
                                              {/* <Eye
                                          id="eye_view"
                                          style={{
                                            cursor: "pointer",
                                            marginLeft: "10px",
                                          }}
                                          onClick={() => {
                                            window.location.href = `e-sign-form-create/${item.bulk_link_id}?open=true `;
                                          }}
                                          size={20}
                                        /> */}
                                              {/* <UncontrolledTooltip
                                          placement="top"
                                          target="eye_view"
                                        >
                                          {t("View")}
                                        </UncontrolledTooltip> */}
                                              <CustomBadge
                                                color="secondary"
                                                text={
                                                  loaderResponseFetch &&
                                                  bulk_link_id_data ===
                                                    item.bulk_link_id ? (
                                                    <>
                                                      <Spinner
                                                        color="white"
                                                        size="sm"
                                                      />{" "}
                                                      <span
                                                        style={{
                                                          marginLeft: "5px",
                                                        }}
                                                      >
                                                        {t("View Responses")}
                                                      </span>
                                                    </>
                                                  ) : (
                                                    t("View Responses")
                                                  )
                                                }
                                                onClick={() => {
                                                  setLink(item.url);
                                                  // setLink(`${FrontendBaseUrl}public-form/esign/${item.url}`);

                                                  setbulk_link_id_data(
                                                    item.bulk_link_id
                                                  );
                                                  //console.log(item);
                                                  setTitleBulk(item.file_name);
                                                  // setToastAlertIdBulk(true);
                                                  getFunctionTemplateDetails(
                                                    item.bulk_link_id
                                                  );
                                                  // setSendTemplateResponses(true);
                                                }}
                                              />
                                              {/* {loaderResponseFetch &&
                                        bulk_link_id_data ===
                                          item.bulk_link_id ? (
                                          <Spinner color="white" size="sm" />
                                        ) : (
                                          <FileText
                                            style={{
                                              cursor: "pointer",
                                              marginLeft: "10px",
                                            }}
                                            id="view_responses"
                                            onClick={() => {
                                              setLink(item.url);
                                              // setLink(`${FrontendBaseUrl}public-form/esign/${item.url}`);

                                              setbulk_link_id_data(
                                                item.bulk_link_id
                                              );
                                              //console.log(item);
                                              setTitleBulk(item.file_name);
                                              // setToastAlertIdBulk(true);
                                              getFunctionTemplateDetails(
                                                item.bulk_link_id
                                              );
                                              // setSendTemplateResponses(true);
                                            }}
                                            size={20}
                                          />
                                        )}
                                        <UncontrolledTooltip
                                          placement="top"
                                          target="view_responses"
                                        >
                                          {t("View Responses")} 
                                        </UncontrolledTooltip>*/}
                                              <CustomBadge
                                                color="warning"
                                                text={
                                                  loaderResponseFetch1 &&
                                                  bulk_link_id_data ===
                                                    item.bulk_link_id ? (
                                                    <>
                                                      <Spinner
                                                        color="white"
                                                        size="sm"
                                                      />{" "}
                                                      <span
                                                        style={{
                                                          marginLeft: "5px",
                                                        }}
                                                      >
                                                        {t("Audit Log")}
                                                      </span>
                                                    </>
                                                  ) : (
                                                    t("Audit Log")
                                                  )
                                                }
                                                onClick={() => {
                                                  setbulk_link_id_data(
                                                    item.template_id
                                                  );
                                                  setTitleBulk(
                                                    `${item.file_name}`
                                                  );
                                                  getFunctionTemplateAuditLog(
                                                    item.bulk_link_id
                                                  );
                                                  // setSendTemplateResponses(true);
                                                }}
                                              />
                                              {/* {loaderResponseFetch1 &&
                                        bulk_link_id_data ===
                                          item.bulk_link_id ? (
                                          <Spinner color="white" size="sm" />
                                        ) : (
                                          <AtSign
                                            onClick={() => {
                                              setbulk_link_id_data(
                                                item.template_id
                                              );
                                              setTitleBulk(`${item.file_name}`);
                                              getFunctionTemplateAuditLog(
                                                item.bulk_link_id
                                              );
                                              // setSendTemplateResponses(true);
                                            }}
                                            style={{
                                              cursor: "pointer",
                                              marginLeft: "10px",
                                              color: "#FFCC99",
                                            }}
                                            size={20}
                                            id="view_audit"
                                          />
                                        )}
                                        <UncontrolledTooltip
                                          placement="top"
                                          target="view_audit"
                                        >
                                          {t("Audit Log")}
                                        </UncontrolledTooltip> */}
                                              {/* </div> */}
                                            </div>
                                          </td>
                                        </tr>
                                      </>
                                    ))
                                  : null}
                              </>
                            ) : (
                              <>
                                {filteredItems.map((item, index) => (
                                  <>
                                    <tr>
                                      <td>
                                        <input
                                          type="checkbox"
                                          onChange={(event) => {
                                            //console.log(item);
                                            handleCheckboxChange(
                                              event,
                                              item.bulk_link_id,
                                              item.file_name
                                            );
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <span
                                          style={{
                                            display: "flex",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            window.location.href = `e-sign-form-create/${item.bulk_link_id}?open=true `;
                                          }}
                                        >
                                          {/* <Folder style={{ color: `${item.color}` }} size={25} /> */}
                                          <h3 style={{ marginLeft: "5px" }}>
                                            {highlightText(
                                              `${item.title}`,
                                              searchQuery
                                            )}
                                          </h3>
                                        </span>
                                      </td>

                                      <td>
                                        {item?.status === "active" ? (
                                          <Badge color="success">
                                            <Check
                                              size={12}
                                              className="align-middle me-25"
                                            />
                                            <span
                                              className="align-middle"
                                              style={{
                                                fontSize: "14px",
                                              }}
                                            >
                                              {t("Active")}
                                            </span>
                                          </Badge>
                                        ) : (
                                          <Badge color="danger">
                                            <X
                                              size={12}
                                              className="align-middle me-25"
                                            />
                                            <span
                                              className="align-middle"
                                              style={{
                                                fontSize: "14px",
                                              }}
                                            >
                                              {t("In Active")}
                                            </span>
                                          </Badge>
                                        )}

                                        {/* <h3 style={{ marginLeft: '20px' }}>{item?.status}</h3> */}
                                      </td>
                                      <td>
                                        <h3>
                                          {formatDate(
                                            item.created_at,
                                            locationIP
                                          )}
                                        </h3>
                                      </td>
                                      <td>
                                        {item.expires_option === true ||
                                        item.date_of_expiry === "true" ? (
                                          <h3>
                                            {formatDate(
                                              item.expiry_date,
                                              locationIP
                                            )}
                                          </h3>
                                        ) : (
                                          <h3>--</h3>
                                        )}
                                      </td>
                                      <td>
                                        <h3>
                                          {item.responses === null ||
                                          item.responses === undefined ||
                                          item.responses === "null" ||
                                          item.responses === "undefined"
                                            ? "0"
                                            : item.responses}
                                        </h3>
                                      </td>
                                      <td>
                                        <div
                                          className="d-flex justify-content-between"
                                          style={{ alignItems: "center" }}
                                        >
                                          {/* <div> */}

                                          {item.url === null ||
                                          item.url === undefined ? null : (
                                            <>
                                              <Copy
                                                id="copy"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                  setLink(item.url);
                                                  //console.log(item);
                                                  setTitleBulk(item.file_name);
                                                  setToastAlertIdBulk(true);
                                                }}
                                                size={sizeP_icon}
                                              />
                                              <UncontrolledTooltip
                                                placement="top"
                                                target="copy"
                                              >
                                                {t("Copy Link")}
                                              </UncontrolledTooltip>
                                            </>
                                          )}
                                          <Eye
                                            id="eye_view"
                                            style={{
                                              cursor: "pointer",
                                              marginLeft: "10px",
                                            }}
                                            onClick={() => {
                                              window.location.href = `e-sign-form-create/${item.bulk_link_id}?open=true `;
                                            }}
                                            size={sizeP_icon}
                                          />
                                          <UncontrolledTooltip
                                            placement="top"
                                            target="eye_view"
                                          >
                                            {t("View")}
                                          </UncontrolledTooltip>

                                          {loaderResponseFetch &&
                                          bulk_link_id_data ===
                                            item.bulk_link_id ? (
                                            <Spinner color="white" size="sm" />
                                          ) : (
                                            <FileText
                                              style={{
                                                cursor: "pointer",
                                                marginLeft: "10px",
                                              }}
                                              id="view_responses"
                                              onClick={() => {
                                                setLink(item.url);
                                                setbulk_link_id_data(
                                                  item.bulk_link_id
                                                );
                                                //console.log(item);
                                                setTitleBulk(item.file_name);
                                                // setToastAlertIdBulk(true);
                                                getFunctionTemplateDetails(
                                                  item.bulk_link_id
                                                );
                                                // setSendTemplateResponses(true);
                                              }}
                                              size={sizeP_icon}
                                            />
                                          )}
                                          <UncontrolledTooltip
                                            placement="top"
                                            target="view_responses"
                                          >
                                            {t("View Responses")}
                                          </UncontrolledTooltip>
                                          {loaderResponseFetch1 &&
                                          bulk_link_id_data ===
                                            item.bulk_link_id ? (
                                            <Spinner color="white" size="sm" />
                                          ) : (
                                            <AtSign
                                              onClick={() => {
                                                setbulk_link_id_data(
                                                  item.template_id
                                                );
                                                setTitleBulk(
                                                  `${item.file_name}`
                                                );
                                                getFunctionTemplateAuditLog(
                                                  item.bulk_link_id
                                                );
                                                // setSendTemplateResponses(true);
                                              }}
                                              style={{
                                                cursor: "pointer",
                                                marginLeft: "10px",
                                                color: "#FFCC99",
                                              }}
                                              size={sizeP_icon}
                                              id="view_audit"
                                            />
                                          )}
                                          <UncontrolledTooltip
                                            placement="top"
                                            target="view_audit"
                                          >
                                            {t("Audit Log")}
                                          </UncontrolledTooltip>
                                          {/* </div> */}
                                        </div>
                                      </td>
                                    </tr>
                                  </>
                                ))}
                              </>
                            )}
                          </tbody>
                        </Table>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          padding: "5px",
                          justifyContent: "right",
                          alignItems: "center",
                          paddingBottom: "1%",
                        }}
                      >
                        {filteredItems.length === 0 ||
                        currentItems.length === 0 ? null : (
                          <>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "right",
                              }}
                            >
                              <PaginationComponent
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={foldersArray?.length}
                                handlePageChange={handlePageChange}
                                handlePageChangeNo={handlePageChangeNo}
                              />
                            </div>
                          </>
                        )}
                      </div>{" "}
                      {/* </Card> */}
                      {/* </Table> */}
                    </Col>
                    {/* </>} */}
                  </Row>
                </>
              )}
            </TabPane>
          </TabContent>
        </div>
        {/* small screen  */}

        {/* small screen  */}
      </Row>
      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className={`modal-dialog-centered ${modalSize}`}
        // onClosed={() => setCardType('')}
      >
        {/* <ModalHeader className='bg-transparent' ></ModalHeader> */}
        <ModalBody className="px-sm-5 mx-50 pb-2 pt-2">
          {/* <h1 className="text-center mb-1 fw-bold">Upload Document</h1>
          <h4 className="text-center">Add pdf file to continue</h4> */}
          <Row tag="form" className="gy-1 gx-1 mt-75">
            <Col xs={12}>
              {/* Upload Document  */}

              <FileUploaderBulkLink
                bulk_link_id={bulk_link_id}
                // subFolder={subFolderId}
                //  onlySigner={onlySigner}
                onDataReceived={(item) => {
                  setModalSize(item);
                }}
              />
            </Col>

            {/* <Col className='text-center mt-1' xs={12}>
              <Button type='submit' className='me-1' color='primary'>
                Submit
              </Button>
              <Button
                color='secondary'
                outline
                onClick={() => {
                  setShow(!show)
                  reset()
                }}
              >
                Cancel
              </Button>
            </Col> */}
          </Row>
        </ModalBody>
      </Modal>
      <ModalConfirmationAlert
        isOpen={ItemRestoreAllConfirm}
        toggleFunc={() => setItemRestoreAllConfirm(!ItemRestoreAllConfirm)}
        loader={restoreAllLoader}
        callBackFunc={StatusChange}
        text={`${t(
          "Are you sure you want to change selected link status to"
        )} ${statusData1}?`}
      />
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteBulkLink}
        alertStatusDelete={"delete"}
        text={t("Are you sure you want to delete selected Public Form?")}
      />
      <Modal
        isOpen={toastAlertIdBulk}
        toggle={() => {
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.delete("toastAlert");
          window.history.replaceState({}, "", currentUrl.toString()); // Update URL without reloading
          setToastAlertIdBulk(!toastAlertIdBulk);
        }}
        className="modal-dialog-centered modal-md"
      >
        <ModalBody className="p-2">
          <Row>
            <Col
              xs={12}
              md={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <img
                src={shareLinkImg}
                style={{ width: "100px", height: "auto" }}
              />
            </Col>
            <Col
              xs={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="p-1">
                <div className="d-flex justify-content-center align-items-center mb-1">
                  <h1
                    className="fw-bold"
                    style={{
                      fontSize: window.innerWidth < 730 ? "18px" : "16px",
                    }}
                  >
                    Share Link
                  </h1>
                </div>
                <Col xs={12} md={12}>
                  {window.innerWidth < 730 ? (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ flexDirection: "column" }}
                    >
                      <Input
                        type="text"
                        id="link"
                        value={link}
                        readOnly
                        style={{
                          flexGrow: 1,
                          marginRight: "10px",
                          color: "black",
                          width: "100%",
                          border: "1px solid #ced4da",
                          borderRadius: "4px",
                          fontSize: "18px",
                        }}
                      />
                      <Button
                        color="primary"
                        size="sm"
                        style={{
                          boxShadow: "none",
                          marginTop: "20px",
                          fontSize: window.innerWidth < 730 ? "18px" : "16px",
                        }}
                        onClick={async () => {
                          await navigator.clipboard.writeText(link);
                          toastAlert("success", "Link Copied to Clipboard");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  ) : (
                    <div className="d-flex align-items-center">
                      <Link
                        size={50}
                        style={{
                          color: "rgb(33, 179, 232)",
                          marginRight: "10px",
                        }}
                      />
                      <Input
                        type="text"
                        id="link"
                        value={link}
                        readOnly
                        style={{
                          flexGrow: 1,
                          marginRight: "10px",
                          color: "black",
                          width: "100%",
                          border: "1px solid #ced4da",
                          borderRadius: "4px",
                          fontSize: "18px",
                        }}
                      />
                      <Button
                        color="primary"
                        size="sm"
                        style={{ boxShadow: "none" }}
                        onClick={async () => {
                          await navigator.clipboard.writeText(link);
                          toastAlert("success", "Link Copied to Clipboard");
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  )}
                </Col>
              </div>{" "}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      {/* Responses Modal  */}
      <Modal
        isOpen={SendTemplateResponses}
        toggle={() => {
          // setErrorRequired(false)
          // setFolderName('')
          setSendTemplateResponses(false);
        }}
        className="modal-dialog-centered modal-fullscreen"
        modalClassName="info"
        key="success1"
      >
        {/* <ModalHeader
         toggle={() => {
          setErrorRequired(false)
          setFolderName('')

          setModal(false)
        }}
        > */}

        {/* </ModalHeader> */}
        <ModalBody>
          <div
            style={{
              display: " flex",
              justifyContent: "space-between",
              marginBottom: "2%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                flexDirection: window.innerWidth < 730 ? "column" : "row",
              }}
            >
              {loading ? (
                <Spinner color="primary" />
              ) : (
                <img
                  src={
                    // logoFromApi ||
                    // logoFromLocalStorage ||
                    //  logoURL
                    logo
                  }
                  style={{
                    width: "160px",
                    height: "50px",
                    objectFit: "contain",
                    marginLeft: "10px",
                    marginRight: "10px",
                  }}
                />
              )}

              {window.innerWidth < 730 ? (
                <h3 className="fw-bold mt-2" style={{ marginLeft: "10px" }}>
                  {t("Public Form Responses Detail")}{" "}
                </h3>
              ) : (
                <h1 className="fw-bold">
                  {t("Public Form Responses Detail")}{" "}
                </h1>
              )}
            </div>
            <X
              size={24}
              onClick={() => {
                // setFolderName('')
                setSendTemplateResponses(false);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>
          <Row>
            <Col xs={12} md={6}>
              <div style={{ padding: "10px" }}>
                <h3 style={{ fontSize: fontSize_m }} className="fw-bold">
                  {t("Title")} :
                </h3>

                <h3 style={{ fontSize: fontSize_m }}>
                  {bulk_link_detail?.title}
                </h3>
                <h3 style={{ fontSize: fontSize_m }} className="fw-bold">
                  {t("Welcome Message")} :
                </h3>
                <h3 style={{ fontSize: fontSize_m }}>
                  {" "}
                  {bulk_link_detail?.welcome_message}
                </h3>
                <h3 style={{ fontSize: fontSize_m }} className="fw-bold">
                  {t("Acknowledgement Message")}:
                </h3>

                <h3 style={{ fontSize: fontSize_m }}>
                  {bulk_link_detail?.acknowledgement_message}
                </h3>
                <h3 style={{ fontSize: fontSize_m }} className="fw-bold">
                  {t("Created at")}:
                </h3>

                <h3 style={{ fontSize: fontSize_m }}>
                  {" "}
                  {formatDateCustomTimelastActivity(bulk_link_detail?.created_at)}
                </h3>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div>
                <h2
                  className="fw-bold"
                  style={{
                    marginBlock: "2%",
                    fontSize: window.innerWidth < 730 ? "14px" : "18px",
                  }}
                >
                  {t("Public Form Settings")}
                </h2>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    alignItems: "center",
                  }}
                >
                  <CheckCircle size={15} style={{ color: "green" }} />
                  <h3
                    style={{
                      marginLeft: "10px",
                      marginTop: "5px",
                      fontSize: fontSize_m,
                    }}
                  >
                    {bulk_link_detail?.link_response_limit === 0 ||
                    bulk_link_detail?.link_response_limit === "0"
                      ? ""
                      : bulk_link_detail?.link_response_limit}{" "}
                    {bulk_link_detail?.limit_responses} {t("Response Limit")}
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
                  <h3
                    style={{
                      marginLeft: "10px",
                      marginTop: "5px",
                      fontSize: fontSize_m,
                    }}
                  >
                    {bulk_link_detail?.user_email_verification
                      ? t("Needed Email Verification")
                      : ""}
                  </h3>
                </div>
                {bulk_link_detail?.expires_option ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircle size={15} style={{ color: "green" }} />
                    <h3
                      style={{
                        marginLeft: "10px",
                        marginTop: "5px",
                        fontSize: fontSize_m,
                      }}
                    >
                      {t("Expired on")}{" "}
                      {formatDate(bulk_link_detail?.expiry_date, locationIP)}
                    </h3>
                  </div>
                ) : null}
                {bulk_link_detail?.allow_download_after_submission ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircle size={15} style={{ color: "green" }} />
                    <h3
                      style={{
                        marginLeft: "10px",
                        marginTop: "5px",
                        fontSize: fontSize_m,
                      }}
                    >
                      {t("Allow to Download")}
                    </h3>
                  </div>
                ) : null}
                {bulk_link_detail?.users_receive_copy_in_email ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                    }}
                  >
                    <CheckCircle size={15} style={{ color: "green" }} />
                    <h3
                      style={{
                        marginLeft: "10px",
                        marginTop: "5px",
                        fontSize: fontSize_m,
                      }}
                    >
                      {t("Receives Copy")}{" "}
                    </h3>
                  </div>
                ) : null}
              </div>{" "}
            </Col>
            <Col xs={12}>
              {/* <Card style={{padding: '15px'}}> */}
              {/* <input
    type="text"
    placeholder="Search by email"
    onChange={e => setSearchTerm(e.target.value)}
  /> */}
              <Input
                style={{
                  width: "200px",
                  height: "40px",
                  boxShadow: "none",
                  marginBottom: "10px",
                  fontSize: "16px",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                id="login-email"
                placeholder="Search by Email"
                autoFocus
              />
              <div className="table-responsive-sm">
                <Table>
                  <thead>
                    <tr>
                      <th>
                        <h4 className="table_header_size">{t("Email")}</h4>
                      </th>
                      <th>
                        <h4
                          className="table_header_size"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {t("Completed Date")}
                        </h4>
                      </th>
                      <th>
                        <h4 className="table_header_size">{t("Action")}</h4>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchTerm.length === 0
                      ? responseTemp.map((item) => (
                          <tr key={item.bulk_link_response_id}>
                            <td className="table_row_size">
                              <h3>{item?.email}</h3>
                            </td>
                            <td className="table_row_size">
                              <h3 style={{ whiteSpace: "nowrap" }}>
                                {formatDateCustomTimelastActivity(
                                  item?.created_at
                                )} {" "}{item?.location_country===null?null:<>({item?.location_country})</>}
                              </h3>
                            </td>
                            <td>
                              {window.innerWidth < 730 ? (
                                <>
                                  <Eye
                                    size={sizeP_icon}
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      window.location.href = `public_form_response/${item.bulk_link_id}?item=${item.bulk_link_response_id}`;
                                    }}
                                  />
                                  <AtSign
                                    size={sizeP_icon}
                                    style={{
                                      cursor: "pointer",
                                      marginLeft: "10px",
                                      color: "#FFCC99",
                                    }}
                                    onClick={() => {
                                      getFunctionTemplateAuditLogSingle(
                                        item.bulk_link_id,
                                        item?.email
                                      );
                                      setSendTemplateResponses2(true);
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    color="primary"
                                    className="action-button"
                                    onClick={() => {
                                      window.location.href = `public_form_response/${item.bulk_link_id}?item=${item.bulk_link_response_id}`;
                                    }}
                                  >
                                    <span className="button-text">
                                      {t("View")}
                                    </span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    color="warning"
                                    className="action-button"
                                    onClick={() => {
                                      getFunctionTemplateAuditLogSingle(
                                        item.bulk_link_id,
                                        item?.email
                                      );
                                      setSendTemplateResponses2(true);
                                    }}
                                  >
                                    <span className="button-text">
                                      {t("Audit Log")}
                                    </span>
                                  </Button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      : data.map((item) => (
                          <tr key={item.bulk_link_response_id}>
                            <td className="table_row_size">
                              <h2>{item?.email}</h2>
                            </td>
                            <td className="table_row_size">
                              <h2>
                                {formatDateCustomTimelastActivity(
                                  item?.created_at
                                )}
                              </h2>
                            </td>
                            <td>
                              <Button
                                size="sm"
                                color="primary"
                                className="action-button"
                                onClick={() => {
                                  window.location.href = `public_form_response/${item.bulk_link_id}?item=${item.bulk_link_response_id}`;
                                }}
                              >
                                <span className="button-text">{t("View")}</span>
                              </Button>
                              <Button
                                size="sm"
                                color="primary"
                                className="action-button"
                                onClick={() => {
                                  getFunctionTemplateAuditLogSingle(
                                    item.bulk_link_id,
                                    item?.email
                                  );
                                  setSendTemplateResponses2(true);
                                }}
                              >
                                <span className="button-text">
                                  {t("Audit Log")}
                                </span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </Table>
              </div>

              {/* </Card> */}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      {/* Responses Modal  */}
      <Modal
        isOpen={SendTemplateResponses1}
        toggle={() => {
          // setErrorRequired(false)
          // setFolderName('')
          setSendTemplateResponses1(false);
        }}
        className="modal-dialog-centered modal-fullscreen"
        modalClassName="info"
        key="success1"
      >
        <ModalBody>
          {window.innerWidth < 730 ? (
            <div
              style={{
                display: " flex",
                justifyContent: "space-between",
                marginBottom: "2%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                  flexDirection: "column",
                }}
              >
                {loading ? (
                  <Spinner color="primary" />
                ) : (
                  <img
                    src={
                      // logoFromApi ||
                      // logoFromLocalStorage ||
                      //  logoURL
                      logo
                    }
                    style={{
                      width: "160px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  />
                )}

                <h3 className="fw-bold" style={{ marginTop: "10px" }}>
                  {t("Audit Log")}
                </h3>
                <h3 className="fw-bold" style={{ marginTop: "10px" }}>
                  {TitleBulk}
                </h3>
              </div>
              <X
                size={24}
                onClick={() => {
                  // setFolderName('')
                  setSendTemplateResponses1(false);
                }}
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : (
            <div
              style={{
                display: " flex",
                justifyContent: "space-between",
                marginBottom: "2%",
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
                  <Spinner color="primary" />
                ) : (
                  <img
                    src={
                      // logoFromApi ||
                      // logoFromLocalStorage ||
                      //  logoURL
                      logo
                    }
                    style={{
                      width: "160px",
                      height: "50px",
                      objectFit: "contain",
                      marginLeft: "10px",
                      marginRight: "10px",
                    }}
                  />
                )}
                |
                <h1 className="fw-bold" style={{ marginLeft: "10px" }}>
                  {t("Audit Log")} |{" "}
                </h1>
                <h1 className="fw-bold" style={{ marginLeft: "10px" }}>
                  {TitleBulk}
                </h1>
              </div>
              <X
                size={24}
                onClick={() => {
                  // setFolderName('')
                  setSendTemplateResponses1(false);
                }}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
          <Row>
            <Col xs={12}>
              {/* <Card style={{padding: '15px'}}> */}
              <div className="table-responsive">
                <Table>
                  <thead>
                    <tr>
                      <th>
                        <h4 className="table_header_size">{t("Event")}</h4>
                      </th>
                      <th>
                        <h4 className="table_header_size">
                          {t("Description")}
                        </h4>{" "}
                      </th>
                      <th>
                        <h4
                          className="table_header_size"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          {t("IP Address")}
                        </h4>{" "}
                      </th>
                      <th>
                        <h4 className="table_header_size">{t("Country")}</h4>{" "}
                      </th>

                      {/* <th style={{marginLeft: '20px'}}>
                      <h4 style={{fontWeight: 700}}>Email</h4>{' '}
                    </th> */}
                      <th>
                        <h4 className="table_header_size">{t("Date")}</h4>{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems2.map((item) => (
                      <tr key={item.bulk_link_response_id}>
                        <td className="table_row_size">
                          <h3  style={{ whiteSpace: "nowrap" }}>{item?.event}</h3>
                        </td>
                        <td className="table_row_size">
                          <h3  style={{ whiteSpace: "nowrap" }}>
                            {item.description}
                            {/* {item?.description.split(/(\S+@\S+\.\S+)/).map((part, index) => {
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
                          })} */}
                          </h3>
                        </td>
                        <td className="table_row_size">
                          <h3>{item.ip_address}</h3>
                        </td>
                        <td className="table_row_size">
                          <h3>{item.location_country}</h3>
                        </td>

                        <td className="table_row_size">
                          <h3  style={{ whiteSpace: "nowrap" }}>
                            {formatDateTimeActivityLog(
                              item.location_date
                            )}
                          </h3>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div style={{ display: "flex", justifyContent: "right" }}>
                <PaginationComponent
                  currentPage={currentPage2}
                  itemsPerPage={itemsPerPage2}
                  totalItems={responseTemp?.length}
                  handlePageChange={handlePageChange2}
                  handlePageChangeNo={handlePageChangeNo2}
                />{" "}
              </div>

              {/* </Card> */}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={SendTemplateResponses2}
        toggle={() => {
          // setErrorRequired(false)
          // setFolderName('')
          setSendTemplateResponses2(false);
        }}
        className="modal-dialog-centered modal-xl"
        modalClassName="info"
        key="success1"
      >
        <ModalBody>
          {window.innerWidth < 730 ? (
            <div
              style={{
                display: " flex",

                justifyContent: "space-between",
                marginBottom: "2%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  alignItems: "left",
                  flexDirection: "column",
                }}
              >
                {loading ? (
                  <Spinner color="primary" />
                ) : (
                  <img
                    src={
                      // logoFromApi ||
                      // logoFromLocalStorage ||
                      //  logoURL
                      logo
                    }
                    style={{
                      width: "160px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  />
                )}

                <h3 className="fw-bold mt-2">{t("Audit Log")}</h3>
                <h3 className="fw-bold">{TitleBulk}</h3>
              </div>
              <X
                size={24}
                onClick={() => {
                  // setFolderName('')
                  setSendTemplateResponses2(false);
                }}
                style={{ cursor: "pointer" }}
              />
            </div>
          ) : (
            <div
              style={{
                display: " flex",

                justifyContent: "space-between",
                marginBottom: "2%",
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
                  <Spinner color="primary" />
                ) : (
                  <img
                    src={
                      // logoFromApi ||
                      // logoFromLocalStorage ||
                      //  logoURL
                      logo
                    }
                    style={{
                      width: "160px",
                      height: "50px",
                      objectFit: "contain",
                      marginLeft: "10px",
                      marginRight: "10px",
                    }}
                  />
                )}
                |
                <h1 className="fw-bold" style={{ marginLeft: "10px" }}>
                  {t("Audit Log")} |{" "}
                </h1>
                <h1 className="fw-bold" style={{ marginLeft: "10px" }}>
                  {TitleBulk}
                </h1>
              </div>
              <X
                size={24}
                onClick={() => {
                  // setFolderName('')
                  setSendTemplateResponses2(false);
                }}
                style={{ cursor: "pointer" }}
              />
            </div>
          )}
          <Row>
            <Col xs={12}>
              {/* <Card style={{padding: '15px'}}> */}
              <div className="table-responsive-sm">
                {" "}
                <Table>
                  <thead>
                    <tr>
                      <th style={{ marginLeft: "20px" }}>
                        <h4 className="table_header_size">{t("Event")}</h4>
                      </th>
                      <th style={{ marginLeft: "20px" }}>
                        <h4 className="table_header_size">
                          {t("Description")}
                        </h4>{" "}
                      </th>
                      <th style={{ marginLeft: "20px" }}>
                        <h4 className="table_header_size">{t("IP Address")}</h4>{" "}
                      </th>

                      <th style={{ marginLeft: "20px" }}>
                        <h4 className="table_header_size">{t("Timezone")}</h4>{" "}
                      </th>
                      {/* <th style={{marginLeft: '20px'}}>
                      <h4 style={{fontWeight: 700}}>Email</h4>{' '}
                    </th> */}
                      <th style={{ marginLeft: "20px" }}>
                        <h4 className="table_header_size">{t("Date")}</h4>{" "}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems1.map((item) => (
                      <tr key={item.bulk_link_response_id}>
                        <td className="table_row_size">
                          <h3 style={{ whiteSpace: "nowrap" }}>{item?.event}</h3>
                        </td>
                        <td className="table_row_size">
                          <h3 style={{ whiteSpace: "nowrap" }}>{item.description}</h3>
                        </td>
                        <td className="table_row_size">
                          <h3 style={{ whiteSpace: "nowrap" }}>
                            {item.ip_address}
                          </h3>
                        </td>

                        <td className="table_row_size">
                          <h3>{item.timezone}</h3>
                        </td>
                        {/* <td style={{marginLeft: '20px', fontSize: '16px'}}>
                        <h3>{item.email}</h3>
                      </td> */}
                        <td className="table_row_size">
                          <h3 style={{ whiteSpace: "nowrap" }}>
                            {formatDateCustomTimelastActivity(
                              item.location_date
                            )}
                          </h3>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div style={{ display: "flex", justifyContent: "right" }}>
                <PaginationComponent
                  currentPage={currentPage1}
                  itemsPerPage={itemsPerPage1}
                  totalItems={ResponsesTemp1?.length}
                  handlePageChange={handlePageChangeauditRes}
                  handlePageChangeNo={handlePageChangeNo1}
                />
              </div>

              {/* </Card> */}
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <ModalUpgradePremium
        isOpen={modalUpgradePremium}
        toggleFunc={() => {
          setModalUpgradePremium(!modalUpgradePremium);
        }}
      />
      <ModalConfirmationPlan
        isOpen={completeProfile}
        toggleFunc={() => setCompleteProfile(!completeProfile)}
      />
    </div>
  );
};

export default BulkLinks;
