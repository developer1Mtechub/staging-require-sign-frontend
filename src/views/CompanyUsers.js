import { useEffect, useState } from "react";
import toastAlert from "@components/toastAlert";
import * as Yup from "yup";
import {
  Alert,
  TabContent,
  TabPane,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  ModalBody,
  Input,
  Spinner,
  UncontrolledTooltip,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  Label,
  ModalFooter,
  FormGroup,
  ModalHeader,
} from "reactstrap";
import { BASE_URL, deleteReq, get, post } from "../apis/api";
import image_dummy from "@assets/images/pages/images.jpg";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpCircle,
  AtSign,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  RefreshCcw,
  Send,
  Shield,
  Slash,
  UserCheck,
  X,
} from "react-feather";
import { formatDate, formatDateCustomTimelastActivity } from "../utility/Utils";
import { useParams, useNavigate } from "react-router-dom";
import emptyImage from "@assets/images/pages/empty.png";
import ModalConfirmationAlert from "../components/ModalConfirmationAlert";
// import FileUploaderBulkLink from "../components/FileUploaderBulkLink";
import getUserLocation from "../utility/IpLocation/GetUserLocation";
import getUserPlan from "../utility/IpLocation/GetUserPlanData";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";

import SpinnerCustom from "../components/SpinnerCustom";
import { useDispatch, useSelector } from "react-redux";

import CustomButton from "../components/ButtonCustom";
import PaginationComponent from "../components/pagination/PaginationComponent";
import { getUser, selectPrimaryColor } from "../redux/navbar";
import CustomBadge from "../components/BadgeCustom";
import { decrypt } from "../utility/auth-token";
const CompanyUsers = ({ companyUsersData, company_admin_Logged_User }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .nullable()
      .email("Invalid email")
      .required("Email is required"),
  });
  const handleEditClick = () => {
    setShowModal(true);
  };
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);

  const [message, setMessage] = useState("");
  const [urlshare, seturlshare] = useState("");
  const [severity, setSeverity] = useState("warning");
  const [planAlert, setPlanAlert] = useState(false);
  const [active, setActive] = useState("0");
  const { subFolderId, prevId } = useParams();
  const [statusData1, setStatusData1] = useState(null);
  const [selectedItems, setSelectedItems] = useState(null);
  const [restoreAllLoader, setRestoreAllLoader] = useState(false);
  const [ItemRestoreAllConfirm, setItemRestoreAllConfirm] = useState(false);
  const [ItemRestoreAllConfirm1, setItemRestoreAllConfirm1] = useState(false);

  const [sendTemplate, setSendTemplate] = useState(false);
  const [SendTemplateResponses, setSendTemplateResponses] = useState(false);
  const [SendTemplateResponses1, setSendTemplateResponses1] = useState(false);
  const [modalUpgradePremium, setModalUpgradePremium] = useState(false);
  const [modalUpgradePremiumD, setModalUpgradePremiumD] = useState(false);
  const dispatch = useDispatch();
  const primary_color = useSelector(selectPrimaryColor);
  const {
    user,
    subscription,
    isSubscripitonActive,
    isFreeTrialExpired,
    daysLeftExpiredfreePlan,
    plan,
    status,
    error,
    company_profile,
    company_admin,
  } = useSelector((state) => state.navbar);
  const fetchData = async () => {
    const items = JSON.parse(localStorage.getItem("@UserLoginRS"));
    if (items.user_type === "company") {
      // const user_id=items.token.activatedplan
      // get user user/getUserById
      const postData = {
        company_id: items.token.company_id,
      };
      const apiData1 = await post("company/getCompanyById", postData); // Specify the endpoint you want to call
      //console.log('apiData1');

      //console.log(apiData1);
      // if (apiData1.status) {
      //   //console.log("fffg")
      const planID = apiData1.result[0].activatedplan;
      //console.log(apiData1.result[0].activatedplan);
      if (planID === null || planID === undefined || planID === "null") {
        setSeverity("error");
        setMessage("Your Subscription has been expired");
        setPlanAlert(true);
      } else {
        //console.log(planID);
        const postData = {
          plan_id: planID,
          // plan_id: 100298
        };
        const apiData = await post("plan/get_user_plan", postData); // Specify the endpoint you want to call
        //console.log(apiData);
        if (apiData.error) {
          //console.log('errorin fetching data');
        } else {
          if (
            apiData.result[0].plan_name === "Yearly Pricing Description" ||
            apiData.result[0].plan_name === "Monthly Pricing Description"
          ) {
            const currentDate = new Date();

            const subscriptionEndDate = new Date(
              apiData.result[0].subscription_end_date
            );

            // Calculate the time difference in milliseconds
            const timeDifferenceInMilliseconds =
              subscriptionEndDate - currentDate;

            // Convert milliseconds to days
            const remainingDays = Math.ceil(
              timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
            );

            // Define the alert threshold (e.g., 14 days)
            const alertThreshold = 14;

            // Determine the subscription type and set appropriate messages
            let severity = "warning";
            let message = "";

            if (remainingDays <= 0) {
              severity = "error";
              message = "Your subscription has expired";
              localStorage.setItem(
                "@Plan",
                JSON.stringify({ plan_id: "null" })
              );
            } else if (remainingDays <= alertThreshold) {
              severity = "warning";
              message = `Your subscription will expire in ${remainingDays} day(s)`;
            } else {
              severity = "success";

              message = `Your subscription is active`;
            }
            setSeverity(severity);
            //console.log(`Remaining days in subscription: ${remainingDays}`);
            setMessage(message);
            setPlanAlert(true);
            //console.log(`Severity: ${severity}`);
            //console.log(`Message: ${message}`);
          } else {
            // Provided subscription end date
            const subscriptionEndDate = new Date(
              apiData.result[0].subscription_end_date
            );
            // const subscriptionEndDate = new Date('2023-08-28T06:46:49.349Z')
            // Current date
            const currentDate = new Date();
            const timeDifferenceInMilliseconds =
              subscriptionEndDate - currentDate;

            // Convert milliseconds to minutes
            const remainingMinutes = Math.ceil(
              timeDifferenceInMilliseconds / (1000 * 60)
            );
            //console.log(remainingMinutes);
            // Console log the result
            if (remainingMinutes <= 0) {
              setSeverity("error");
              setMessage(`Your Subscription has been expired`);
              localStorage.setItem(
                "@Plan",
                JSON.stringify({ plan_id: "null" })
              );
              setPlanAlert(true);
            } else {
              setSeverity("warning");
              //console.log(`Remaining days in subscription: ${remainingMinutes}`);
              setMessage(
                ` Your free trial will expire in ${remainingMinutes} Minutes`
              );
              //console.log(`Remaining days in subscription: ${remainingMinutes}`);
              setPlanAlert(true);
            }
          }
        }
      }
    } else if (items.user_type === "user") {
      // const user_id=items.token.activatedplan
      // get user user/getUserById
      const postData = {
        user_id: items.token.user_id,
      };
      const apiData1 = await post("user/getUserById", postData); // Specify the endpoint you want to call
      //console.log('apiData1');

      //console.log(apiData1);
      // if (apiData1.status) {
      //   //console.log("fffg")
      const planID = apiData1.result[0].activatedplan;
      //console.log(apiData1.result[0].activatedplan);
      if (planID === null || planID === undefined || planID === "null") {
        setSeverity("danger");
        setMessage("Your Subscription has been expired");
        setPlanAlert(true);
      } else {
        //console.log(planID);
        const postData = {
          plan_id: planID,
          // plan_id: 100298
        };
        const apiData = await post("plan/get_user_plan", postData); // Specify the endpoint you want to call
        //console.log(apiData);
        if (apiData.error) {
          //console.log('errorin fetching data');
        } else {
          if (
            apiData.result[0].plan_name === "Yearly Pricing Description" ||
            apiData.result[0].plan_name === "Monthly Pricing Description"
          ) {
            const currentDate = new Date();

            const subscriptionEndDate = new Date(
              apiData.result[0].subscription_end_date
            );

            // Calculate the time difference in milliseconds
            const timeDifferenceInMilliseconds =
              subscriptionEndDate - currentDate;

            // Convert milliseconds to days
            const remainingDays = Math.ceil(
              timeDifferenceInMilliseconds / (1000 * 60 * 60 * 24)
            );

            // Define the alert threshold (e.g., 14 days)
            const alertThreshold = 14;

            // Determine the subscription type and set appropriate messages
            let severity = "warning";
            let message = "";

            if (remainingDays <= 0) {
              severity = "danger";
              message = "Your subscription has expired";
              localStorage.setItem(
                "@Plan",
                JSON.stringify({ plan_id: "null" })
              );
            } else if (remainingDays <= alertThreshold) {
              severity = "warning";
              message = `Your subscription will expire in ${remainingDays} day(s)`;
            } else {
              severity = "success";

              message = `Your subscription is active`;
            }
            setSeverity(severity);
            //console.log(`Remaining days in subscription: ${remainingDays}`);
            setMessage(message);

            //console.log(`Severity: ${severity}`);
            //console.log(`Message: ${message}`);
            setPlanAlert(true);
          } else {
            // Provided subscription end date
            const subscriptionEndDate = new Date(
              apiData.result[0].subscription_end_date
            );
            // const subscriptionEndDate = new Date('2023-08-28T06:46:49.349Z')
            // Current date
            const currentDate = new Date();
            const timeDifferenceInMilliseconds =
              subscriptionEndDate - currentDate;

            // Convert milliseconds to minutes
            const remainingMinutes = Math.ceil(
              timeDifferenceInMilliseconds / (1000 * 60)
            );
            //console.log(remainingMinutes);
            // Console log the result
            if (remainingMinutes <= 0) {
              setSeverity("danger");
              setMessage(`Your Subscription has been expired`);
              localStorage.setItem(
                "@Plan",
                JSON.stringify({ plan_id: "null" })
              );
              setPlanAlert(true);
            } else {
              setSeverity("warning");
              //console.log(`Remaining days in subscription: ${remainingMinutes}`);
              setMessage(
                ` Your free trial will expire in ${remainingMinutes} Minutes`
              );
              //console.log(`Remaining days in subscription: ${remainingMinutes}`);
              setPlanAlert(true);
            }
          }
        }
      }
    }
  };
  const [userDetailsView, setUserDetailsView] = useState({});
  const [completeProfile, setCompleteProfile] = useState(false);

  const StatusChange = async () => {
    setRestoreAllLoader(true);

    const postData = {
      is_active: statusData1,
      user_id: selectedItems,
    };
    try {
      const apiData = await post("user/updateIsActive", postData); // Specify the endpoint you want to call
      //console.log('CHNAGE STATUS BULK LINK ');

      console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        setRestoreAllLoader(false);
        // setFilesArray([])
      } else {
        toastAlert("success", apiData.message);
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemRestoreAllConfirm(false);
        setRestoreAllLoader(false);
        // fetchAllFiles();
        fetchAllBulkLinks();
      }
    } catch (error) {
      setRestoreAllLoader(false);
      //console.log('Error fetching data:', error);
    }
  };
  const [loaderInvite, setLoaderInvite] = useState(false);
  const StatusChangeDelete = async () => {
    setRestoreAllLoader(true);
    console.log(statusData1);
    const postData = {
      is_active: statusData1,
      user_id: selectedItems,
    };
    try {
      const apiData = await post("user/updateIsdelete", postData); // Specify the endpoint you want to call
      //console.log('CHNAGE STATUS BULK LINK ');

      console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        setRestoreAllLoader(false);
        // setFilesArray([])
      } else {
        toastAlert("success", apiData.message);
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemRestoreAllConfirm1(false);
        setRestoreAllLoader(false);
        // fetchAllFiles();
        fetchAllBulkLinks();
      }
    } catch (error) {
      setRestoreAllLoader(false);
      //console.log('Error fetching data:', error);
    }
  };
  const [foldersArray, setFoldersArray] = useState([]);
  const [filesArray, setFilesArray] = useState([]);

  const fetchAllBulkLinks = async () => {
    //console.log('safhsfhsfjhjfsdfskjfddfs');
    //console.log(companyUsersData);
    const postData = {
      company_id: user?.company_id,
    };
    try {
      const apiData = await post("company/get_company", postData); // Specify the endpoint you want to call
      console.log("GET Company BY USER ID >>>>>>>>>>>");

      console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        // toastAlert("error", apiData.message)
        setFoldersArray([]);
        setFolderLoader(false);
      } else {
        // toastAlert('success', apiData.message);
        // //console.log(apiData.result)
        setFoldersArray(apiData.company_users);
        setFolderLoader(false);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
      setFolderLoader(false);
    }
  };

  const [itemsPerPage, setItemsPerPage] = useState(10); // Number of items to display per page
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Filtered items based on the search query
  const filteredItems = foldersArray.filter((item) =>
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // const itemsPerPage = 9; // Number of items to display per page
  // let allItems = [...foldersArray, ...filesArray];
  // Calculate the index of the first and last item on the current page
  let indexOfLastItem = currentPage * itemsPerPage;
  let indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Assuming you have your data stored in an array called `allItems`
  let currentItems = foldersArray.slice(indexOfFirstItem, indexOfLastItem);
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

    currentItems = foldersArray.slice(indexOfFirstItem, indexOfLastItem);
    //console.log(currentItems);
  };
  // delete folder
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);

  const [loadingDelete, setLoadingDelete] = useState(false);

  // delete folderv api
  // const DeleteBulkLink = async () => {
  //   setLoadingDelete(true);
  //   const postData = {
  //     company_id: companyUsersData,
  //     email: emailData,
  //   };
  //   try {
  //     const apiData = await post("company/add_company_user1", postData); // Specify the endpoint you want to call
  //     //console.log('DELETE BULK LINKS ');

  //     //console.log(apiData);
  //     if (apiData.error === true || apiData.error === undefined) {
  //       toastAlert("error", apiData.message);
  //       // setFilesArray([])
  //     } else {
  //       toastAlert("succes", apiData.message);
  //       //console.log(apiData.result);
  //       // setFilesArray(apiData.result)
  //       setItemDeleteConfirmation(false);
  //       setShow(!show);

  //       setLoadingDelete(false);
  //       fetchAllBulkLinks();
  //     }
  //   } catch (error) {
  //     //console.log('Error fetching data:', error);
  //   }
  // };
  const DeleteBulkLink = async () => {
    setLoadingDelete(true);
    const postData = {
      company_id: companyUsersData,
      // email: emailData,
    };
    try {
      const apiData = await post(
        "company/upgrade_plan_to_invite_user",
        postData
      ); // Specify the endpoint you want to call
      //console.log('DELETE BULK LINKS ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert("error", apiData.message);
        // setFilesArray([])
      } else {
        toastAlert("succes", apiData.message);
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmation(false);
        setShow(true);

        setLoadingDelete(false);
        fetchAllBulkLinks();
      }
    } catch (error) {
      //console.log('Error fetching data:', error);
    }
  };
  // Add files
  // Fetch File
  const [loaderResponseFetch, setLoaderResponseFetch] = useState(false);
  const [loaderResponseFetch1, setLoaderResponseFetch1] = useState(false);
  const [emailData, setEmailData] = useState("");
  const [responseTemp, setResponsesTemp] = useState([]);
  const getFunctionTemplateDetails = async (fileId) => {
    // setImageUrls(apiData.result[0].image);
    setLoaderResponseFetch(true);
    // get Images from db
    //console.log(fileId);
    const postData = {
      template_id: fileId,
    };
    const apiData = await post("template/viewTemplate", postData); // Specify the endpoint you want to call
    //console.log('File Template Fetch');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      setResponsesTemp(apiData?.response_data);
      setSendTemplateResponses(true);
      setLoaderResponseFetch(false);
    }
  };
  const getFunctionTemplateAuditLog = async (fileId) => {
    // setImageUrls(apiData.result[0].image);
    setLoaderResponseFetch1(true);
    // get Images from db
    //console.log(fileId);
    const postData = {
      template_id: fileId,
    };
    const apiData = await post("template/viewTemplateAuditLog", postData); // Specify the endpoint you want to call
    //console.log('File Template Fetch');

    //console.log(apiData);
    if (apiData.error) {
      // toastAlert("error", "No File exist")
    } else {
      setResponsesTemp(apiData.response_data);
      setSendTemplateResponses1(true);
      setLoaderResponseFetch1(false);
    }
  };
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);

  const [subfolderState, setSubfolderState] = useState(false);
  const [folderLoader, setFolderLoader] = useState(true);
  const [modalSize, setModalSize] = useState("md");
  // sort
  const [sortDirection, setSortDirection] = useState("asc");

  // Function to handle sorting by the "Created On" date
  const sortByCreatedOn = () => {
    const sorted = foldersArray; // yourData is the original data array
    //console.log(sorted);
    sorted.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFoldersArray(sorted);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // end sort
  const [locationIP, setLocationIP] = useState("");
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  const getCheckUserPlan = async () => {
    const items = JSON.parse(localStorage.getItem("@UserLoginRS"));
    const profileCompleted = await getUserPlan(items.token.user_id);
    //console.log('PROFILE COMPLETED');
    //console.log(profileCompleted);
    return profileCompleted;
  };
  const fetchPlanUser = async () => {
    const dataGet = await getCheckUserPlan();
    //console.log('dataGet');
    //console.log(dataGet);
    if (dataGet?.userPlanDetails?.template === "unlimited") {
      // setShow(true);
      //console.log('dshjhjds');
    } else {
      setModalUpgradePremiumD(true);
      // toastAlert('error', ' Upgrade your plan!');
    }
  };
  // useEffect(() => {
  //   fetchAllBulkLinks();
  // }, []);
  useEffect(() => {
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([fetchAllBulkLinks()]);
          console.log("PLAN DATA ");

          // setUserDetailsCutrrent(user);
          // console.log("companyExist");

          // if (company_profile === null || company_profile === undefined) {
          //   setCompanyData(null);
          // } else {
          //   setCompany_Admin_Logged_User(company_admin);
          //   setCompany_User_Logged_User(user?.company_user);
          //   setCompanyUsersData(user?.company_id);
          // }

          // if (user?.avatar === null) {
          //   setSelectedFileImage(null);
          // } else {
          //   setSelectedImage(user?.avatar);
          //   setSelectedFileImage("API");
          // }

          // setemail(user?.email);
          // setInitialValues({
          //   firstname: user?.first_name, // Set first name fetched from API
          //   lastname: user?.last_name,
          //   // phoneNo: user_profile.contact_no,
          // });
          // setValue(user?.contact_no);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setFolderLoader(false);
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user, subscription, plan, status, company_profile, company_admin]);
  // useEffect(() => {
  //   const encryptedData = localStorage.getItem("user_data");
  //   console.log("encryptedData");

  //   console.log(encryptedData);
  //   if (encryptedData) {
  //     try {
  //       const decryptedData = JSON.parse(decrypt(encryptedData));
  //       const { token, user_id } = decryptedData;
  //       console.log(decryptedData);

  //       // Fetch user data if not already available in Redux state
  //       if (token && user_id && !user) {
  //         dispatch(getUser({ user_id, token }));
  //       }
  //     } catch (error) {
  //       console.error("Error processing token data:", error);
  //     }
  //   }
  // }, [dispatch, user]);

  return (
    <div>
      {/* {planAlert ? (
        <Alert color={severity} >
          <h1 className='alert-body'>
            {message}.<strong style={{ cursor: 'pointer' }}
              onClick={() => window.location.href = '/stripe_plan'
              }> Buy a subscription .</strong>
          </h1>
        </Alert>
      ) : null} */}

      {/* Row for table view and card view of documnets  */}
      <Row style={{ width: "100%" }}>
        <Col md="12" xs="12" className="d-flex justify-content-between ">
          <h2>{t("Company Users")}</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            {/* <Input
              style={{
                height: "35px",
                boxShadow: "none",
                fontSize: "14px",
                paddingLeft: "30px", 
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              id="login-email"
              placeholder="Search by Email"
              autoFocus
            /> */}
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
                placeholder={t("Search by Email")}
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
            {company_admin_Logged_User === true ||
            company_admin_Logged_User === "true" ? (
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
                  const postData = {
                    company_id: companyUsersData,
                    // email: values.email,
                  };
                  setLoaderInvite(true);
                  const apiData = await post(
                    "company/check_invite_valid",
                    postData
                  ); // Specify the endpoint you want to call
                  console.log("apixxsData");
                  console.log(apiData);
                  if (apiData.error) {
                    setLoaderInvite(false);

                    if (apiData.userlimit === true) {
                      setItemDeleteConfirmation(true);
                    } else if (apiData.upgradePlan === true) {
                      toastAlert("error", apiData.message);
                    } else {
                      toastAlert("error", apiData.message);
                    }
                  } else {
                    setShow(true);
                    setLoaderInvite(false);
                  }
                }}
                text={
                  <>
                    {" "}
                    {loaderInvite ? (
                      <Spinner color="white" size="md" />
                    ) : (
                      <Plus
                        id="RestoreAll"
                        size={20}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    <span style={{ marginLeft: "10px" }}>
                      {t("Invite Users")}{" "}
                    </span>
                  </>
                }
              />
            ) : null}
          </div>
        </Col>
        {show ? (
          <>
            {" "}
            <Col xs={12} md={12}>
              {/* <div
            style={{
              display: " flex",
              justifyContent: "space-between",
              marginBottom: "2%",
            }}
          >
            <h1 className="fw-bold">{t("Invite User")}</h1>
             <X
              size={24}
              onClick={() => setShow(!show)}
              style={{ cursor: "pointer" }}
            /> 
          </div> */}
              <Row style={{ backgroundColor: "#f7f7f8", margin: "10px" }}>
                <Col xs={12} md={4}></Col>
                <Col xs={12} md={4}>
                  <h2 className="fw-bold mt-2">{t("Invite User")}</h2>

                  <Formik
                    initialValues={{
                      email: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                      // Call your API here
                      //console.log(values);
                      setSubmitting(true);
                      const postData = {
                        company_id: companyUsersData,
                        email: values.email,
                      };
                      const apiData = await post(
                        "company/add_company_user",
                        postData
                      ); // Specify the endpoint you want to call
                      console.log("apixxsData");
                      console.log(apiData);
                      if (apiData.error) {
                        setSubmitting(false);
                        if (apiData.userlimit === true) {
                          setEmailData(values.email);
                          setItemDeleteConfirmation(true);
                        } else if (apiData.upgradePlan === true) {
                          toastAlert("error", apiData.message);
                        } else {
                          toastAlert("error", apiData.message);
                        }
                      } else {
                        setSubmitting(false);
                        toastAlert("success", apiData.message);
                        setShow(false);
                        fetchAllBulkLinks();
                      }
                    }}
                  >
                    {({ getFieldProps, errors, touched, isSubmitting }) => (
                      <Form className="auth-login-form ">
                        <div>
                          <Label className="form-label" for="login-email">
                            {t("Email")}
                            <span style={{ color: "red" }}> *</span>
                          </Label>
                          <Input
                            style={{
                              height: "50px",
                              boxShadow: "none",
                              fontSize: "16px",
                            }}
                            className={`form-control ${
                              touched.email && errors.email ? "is-invalid" : ""
                            }`}
                            {...getFieldProps("email")}
                            type="email"
                            id="login-email"
                            placeholder="john@example.com"
                            autoFocus
                          />
                          {touched.email && errors.email ? (
                            <div className="invalid-feedback">
                              {errors.email}
                            </div>
                          ) : null}
                        </div>
                        <div className="d-flex justify-content-center">
                          <CustomButton
                            padding={true}
                            useDefaultColor={true}
                            size="sm"
                            // disabled={saveLoading}
                            color="primary"
                            disabled={isSubmitting}
                            type="submit"
                            style={{
                              display: "flex",
                              boxShadow: "none",
                              justifyContent: "center",
                              alignItems: "center",
                              marginBlock: "20px",
                            }}
                            className="btn-icon d-flex"
                            text={
                              <>
                                {isSubmitting ? (
                                  <Spinner color="white" size="sm" />
                                ) : null}
                                <span className="align-middle ms-25">
                                  {t("Send Invite")}
                                </span>
                              </>
                            }
                          />
                          {/* <Button
                            style={{
                              boxShadow: "none",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginBlock: "20px",
                            }}
                            type="submit"
                            color="primary"
                            size="sm"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <Spinner color="white" size="sm" />
                            ) : null}
                            <span
                              style={{ fontSize: "16px" }}
                              className="align-middle ms-25"
                            >
                              {" "}
                              {t("Send Invite")}
                            </span>
                          </Button> */}
                        </div>
                      </Form>
                    )}
                  </Formik>
                </Col>
                <Col xs={12} md={4}></Col>
              </Row>
            </Col>
          </>
        ) : null}
        <Col xs={12} md={12}>
          <div className="nav-horizontal">
            <TabContent activeTab={active}>
              <TabPane tabId={active}>
                <Row className="match-height mb-2 mt-2">
                  <Col md="12" xs="12">
                    <Table>
                      <thead>
                        <tr>
                          <th>
                            <h4 style={{ fontWeight: 700, marginLeft: "20px" }}>
                              {t("Email")}
                            </h4>{" "}
                          </th>

                          {/* <th>
                          <h4 style={{fontWeight: 700}}>Name</h4>
                        </th> */}
                          <th>
                            <h4 style={{ fontWeight: 700 }}>{t("Role")}</h4>
                          </th>
                          <th>
                            <h4 style={{ fontWeight: 700 }}>
                              {t("Invitation Status")}
                            </h4>
                          </th>

                          <th
                            onClick={sortByCreatedOn}
                            style={{ cursor: "pointer", display: "flex" }}
                          >
                            {" "}
                            <h4 style={{ fontWeight: 700 }}>
                              {t("Request Sent on")}{" "}
                            </h4>
                            {sortDirection === "asc" ? (
                              <ArrowUp
                                style={{ marginLeft: "5px" }}
                                size={15}
                              />
                            ) : (
                              <ArrowDown
                                style={{ marginLeft: "5px" }}
                                size={15}
                              />
                            )}
                          </th>
                          <th>
                            <h4 style={{ fontWeight: 700 }}>
                              {t("Account Status")}
                            </h4>
                          </th>

                          <th>
                            <h4 style={{ fontWeight: 700 }}>{t("Actions")} </h4>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchQuery.length === 0 ? (
                          <>
                            {currentItems.length > 0
                              ? currentItems.map((item, index) => (
                                  <>
                                    <tr>
                                      <td>
                                        {item?.email === null ||
                                        item?.email === undefined ||
                                        item?.email === "null" ||
                                        item?.email === "undefined" ? (
                                          <>
                                            <h3
                                              style={{
                                                color: "#2367a6",
                                                cursor: "pointer",
                                              }}
                                            >
                                              -{" "}
                                            </h3>
                                          </>
                                        ) : (
                                          <h3
                                            style={{
                                              marginLeft: "20px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            {item?.email}
                                          </h3>
                                        )}
                                      </td>
                                      <td>
                                        {item.company_admin === "true" ||
                                        item.company_admin === true ? (
                                          <>
                                            <h3
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Shield
                                                icon="shield"
                                                style={{
                                                  marginRight: "8px",
                                                  fontSize: "14px",
                                                  verticalAlign: "middle",
                                                  color: "green",
                                                }}
                                              />
                                              Admin
                                            </h3>{" "}
                                          </>
                                        ) : (
                                          <>
                                            <h3
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <UserCheck
                                                icon="shield"
                                                style={{
                                                  marginRight: "8px",
                                                  fontSize: "14px",
                                                  verticalAlign: "middle",
                                                  color: "green",
                                                }}
                                              />
                                              User
                                            </h3>
                                          </>
                                        )}
                                      </td>

                                      {/* <td>
                                      <h3 style={{marginLeft: '20px'}}>
                                        {item?.first_name === null ? '-' : `${item.first_name} ${item.last_name}`}
                                      </h3>
                                    </td> */}
                                      {/* <td>
                                      <h3 style={{marginLeft: '20px'}}>
                                        {' '}
                                        {item?.contact_no === null ? '-' : item?.contact_no}
                                      </h3>
                                    </td> */}
                                      <td>
                                        {item.company_admin === "true" ||
                                        item.company_admin === true ? (
                                          <>- </>
                                        ) : (
                                          <>
                                            {item?.is_verified === true ||
                                            item?.is_verified === "true" ? (
                                              <Badge color="success">
                                                <Check
                                                  size={12}
                                                  className="align-middle me-25"
                                                />
                                                <span
                                                  className="align-middle"
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  {t("Accepted")}
                                                </span>
                                              </Badge>
                                            ) : (
                                              <Badge color="danger">
                                                <Check
                                                  size={12}
                                                  className="align-middle me-25"
                                                />
                                                <span
                                                  className="align-middle"
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  {t("Pending")}
                                                </span>
                                              </Badge>
                                            )}
                                          </>
                                        )}
                                      </td>

                                      <td>
                                        {item.company_admin === "true" ||
                                        item.company_admin === true ? (
                                          <>- </>
                                        ) : (
                                          <>
                                            {" "}
                                            <h3>
                                              {formatDateCustomTimelastActivity(
                                                item.created_at
                                              )}
                                            </h3>
                                          </>
                                        )}
                                      </td>
                                      <td>
                                        {item?.is_active === true ||
                                        item?.is_active === "true" ? (
                                          <Badge color="success">
                                            <Check
                                              size={12}
                                              className="align-middle me-25"
                                            />
                                            <span
                                              className="align-middle"
                                              style={{ fontSize: "14px" }}
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
                                              style={{ fontSize: "14px" }}
                                            >
                                              {t("Blocked")}
                                            </span>
                                          </Badge>
                                        )}
                                      </td>
                                      <td>
                                        {item.company_admin === "true" ||
                                        item.company_admin === true ? (
                                          <>- </>
                                        ) : (
                                          <>
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-around",
                                              }}
                                            >
                                              <CustomBadge
                                                onClick={() => {
                                                  console.log(item);
                                                  setUserDetailsView(item);
                                                  setShow1(true);
                                                }}
                                                color="info"
                                                text={t("View")}
                                              />

                                              {item.is_active === true ||
                                              item.is_active === "true" ? (
                                                <>
                                                  <CustomBadge
                                                    color="danger"
                                                    text={t("Block")}
                                                    onClick={() => {
                                                      // setDeleteUser(item)
                                                      console.log(item);
                                                      // setShow2(true)
                                                      if (
                                                        item.is_active ===
                                                          true ||
                                                        item.is_active ===
                                                          "true"
                                                      ) {
                                                        setStatusData1(false);
                                                      } else {
                                                        setStatusData1(true);
                                                      }
                                                      setSelectedItems(
                                                        item.user_id
                                                      );
                                                      // setStatusData1
                                                      setItemRestoreAllConfirm(
                                                        true
                                                      );
                                                    }}
                                                  />
                                                </>
                                              ) : (
                                                <>
                                                  <CustomBadge
                                                    color="success"
                                                    text={t("Active")}
                                                    onClick={() => {
                                                      // setDeleteUser(item)
                                                      console.log(item);
                                                      // setShow2(true)
                                                      if (
                                                        item.is_active ===
                                                          true ||
                                                        item.is_active ===
                                                          "true"
                                                      ) {
                                                        setStatusData1(false);
                                                      } else {
                                                        setStatusData1(true);
                                                      }
                                                      setSelectedItems(
                                                        item.user_id
                                                      );

                                                      // setStatusData1
                                                      setItemRestoreAllConfirm(
                                                        true
                                                      );
                                                    }}
                                                  />
                                                </>
                                              )}
                                              {item.is_deleted === true ||
                                              item.is_deleted === "true" ? (
                                                <>
                                                  <CustomBadge
                                                    color="success"
                                                    text={t("Recover")}
                                                    onClick={() => {
                                                      // setDeleteUser(item)
                                                      console.log(item);
                                                      // setShow2(true)

                                                      setStatusData1(false);

                                                      setSelectedItems(
                                                        item.user_id
                                                      );
                                                      // setStatusData1
                                                      setItemRestoreAllConfirm1(
                                                        true
                                                      );
                                                    }}
                                                  />
                                                </>
                                              ) : (
                                                <>
                                                  <CustomBadge
                                                    color="danger"
                                                    text={t("Delete")}
                                                    onClick={() => {
                                                      // setDeleteUser(item)
                                                      console.log(item);
                                                      // setShow2(true)
                                                      // if (
                                                      //   item.is_deleted === true ||
                                                      //   item.is_deleted === "true"
                                                      // ) {
                                                      setStatusData1(true);
                                                      // } else {
                                                      //   setStatusData1(true);
                                                      // }
                                                      setSelectedItems(
                                                        item.user_id
                                                      );

                                                      // setStatusData1
                                                      setItemRestoreAllConfirm1(
                                                        true
                                                      );
                                                    }}
                                                  />
                                                </>
                                              )}
                                            </div>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                ))
                              : null}
                          </>
                        ) : (
                          <>
                            {filteredItems.length > 0 ? (
                              <>
                                {filteredItems.map((item, index) => (
                                  <>
                                    <tr>
                                      <td>
                                        {item?.email === null ||
                                        item?.email === undefined ||
                                        item?.email === "null" ||
                                        item?.email === "undefined" ? (
                                          <>
                                            <h3
                                              style={{
                                                color: "#2367a6",
                                                cursor: "pointer",
                                              }}
                                            >
                                              -{" "}
                                            </h3>
                                          </>
                                        ) : (
                                          <h3
                                            style={{
                                              marginLeft: "20px",
                                              cursor: "pointer",
                                            }}
                                          >
                                            {item?.email}
                                          </h3>
                                        )}
                                      </td>
                                      <td>
                                        {item.company_admin === "true" ||
                                        item.company_admin === true ? (
                                          <>
                                            <h3
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Shield
                                                icon="shield"
                                                style={{
                                                  marginRight: "8px",
                                                  fontSize: "14px",
                                                  verticalAlign: "middle",
                                                  color: "green",
                                                }}
                                              />
                                              Admin
                                            </h3>{" "}
                                          </>
                                        ) : (
                                          <>
                                            <h3
                                              style={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <UserCheck
                                                icon="shield"
                                                style={{
                                                  marginRight: "8px",
                                                  fontSize: "14px",
                                                  verticalAlign: "middle",
                                                  color: "green",
                                                }}
                                              />
                                              User
                                            </h3>
                                          </>
                                        )}
                                      </td>

                                      {/* <td>
                                      <h3 style={{marginLeft: '20px'}}>
                                        {item?.first_name === null ? '-' : `${item.first_name} ${item.last_name}`}
                                      </h3>
                                    </td> */}
                                      {/* <td>
                                      <h3 style={{marginLeft: '20px'}}>
                                        {' '}
                                        {item?.contact_no === null ? '-' : item?.contact_no}
                                      </h3>
                                    </td> */}
                                      <td>
                                        {item.company_admin === "true" ||
                                        item.company_admin === true ? (
                                          <>- </>
                                        ) : (
                                          <>
                                            {item?.is_verified === true ||
                                            item?.is_verified === "true" ? (
                                              <Badge color="success">
                                                <Check
                                                  size={12}
                                                  className="align-middle me-25"
                                                />
                                                <span
                                                  className="align-middle"
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  {t("Accepted")}
                                                </span>
                                              </Badge>
                                            ) : (
                                              <Badge color="danger">
                                                <Check
                                                  size={12}
                                                  className="align-middle me-25"
                                                />
                                                <span
                                                  className="align-middle"
                                                  style={{ fontSize: "14px" }}
                                                >
                                                  {t("Pending")}
                                                </span>
                                              </Badge>
                                            )}
                                          </>
                                        )}
                                      </td>

                                      <td>
                                        {item.company_admin === "true" ||
                                        item.company_admin === true ? (
                                          <>- </>
                                        ) : (
                                          <>
                                            {" "}
                                            <h3>
                                              {formatDate(
                                                item.created_at,
                                                locationIP
                                              )}
                                            </h3>
                                          </>
                                        )}
                                      </td>
                                      <td>
                                        {item.company_admin === "true" ||
                                        item.company_admin === true ? (
                                          <>- </>
                                        ) : (
                                          <>
                                            <Eye
                                              size={20}
                                              id="viewing"
                                              style={{ cursor: "pointer" }}
                                              onClick={() => {
                                                console.log(item);
                                                setUserDetailsView(item);
                                                setShow1(true);
                                              }}
                                            />
                                            {item.is_active === true ||
                                            item.is_active === "true" ? (
                                              <>
                                                <Slash
                                                  onClick={() => {
                                                    // setDeleteUser(item)
                                                    console.log(item);
                                                    // setShow2(true)
                                                    if (
                                                      item.is_active === true ||
                                                      item.is_active === "true"
                                                    ) {
                                                      setStatusData1(false);
                                                    } else {
                                                      setStatusData1(true);
                                                    }
                                                    setSelectedItems(
                                                      item.user_id
                                                    );
                                                    // setStatusData1
                                                    setItemRestoreAllConfirm(
                                                      true
                                                    );
                                                  }}
                                                  id="delete"
                                                  size={20}
                                                  style={{
                                                    cursor: "pointer",
                                                    marginLeft: "10px",
                                                    color: "red",
                                                  }}
                                                />
                                                <UncontrolledTooltip
                                                  placement="bottom"
                                                  target="delete"
                                                >
                                                  {t("Delete")}
                                                </UncontrolledTooltip>
                                              </>
                                            ) : (
                                              <>
                                                <CheckCircle
                                                  onClick={() => {
                                                    // setDeleteUser(item)
                                                    console.log(item);
                                                    // setShow2(true)
                                                    if (
                                                      item.is_active === true ||
                                                      item.is_active === "true"
                                                    ) {
                                                      setStatusData1(false);
                                                    } else {
                                                      setStatusData1(true);
                                                    }
                                                    setSelectedItems(
                                                      item.user_id
                                                    );

                                                    // setStatusData1
                                                    setItemRestoreAllConfirm(
                                                      true
                                                    );
                                                  }}
                                                  id="delete1"
                                                  size={20}
                                                  style={{
                                                    cursor: "pointer",
                                                    marginLeft: "10px",
                                                    color: "green",
                                                  }}
                                                />{" "}
                                                <UncontrolledTooltip
                                                  placement="bottom"
                                                  target="delete1"
                                                >
                                                  {t("Active")}
                                                </UncontrolledTooltip>
                                              </>
                                            )}
                                            {/* Permission give  */}

                                            <UncontrolledTooltip
                                              placement="bottom"
                                              target="viewing"
                                            >
                                              {t("View")}
                                            </UncontrolledTooltip>
                                          </>
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                ))}
                              </>
                            ) : null}
                          </>
                        )}
                      </tbody>
                    </Table>
                    {folderLoader ? (
                      <>
                        <Row>
                          <Col
                            md="12"
                            xs="12"
                            className="d-flex justify-content-center"
                          >
                            <SpinnerCustom
                              color="primary"
                              style={{ width: "3rem", height: "3rem" }}
                            />
                          </Col>
                        </Row>
                      </>
                    ) : (
                      <>
                        {/* {modalUpgradePremiumD ? (
                          <>
                            <div
                              className="d-flex flex-column justify-content-center align-items-center text-left"
                              style={{ marginBlock: "10px" }}
                            >
                              <ArrowUpCircle
                                size={70}
                                style={{ color: "#ffdd2e" }}
                              />
                              <div
                                style={{
                                  marginLeft: "15px",
                                  textAlign: "center",
                                }}
                              >
                                <h2
                                  style={{ fontWeight: 600, marginTop: "1%" }}
                                >
                                  Upgrade Required
                                </h2>
                                <h3 style={{ width: "100%", lineHeight: 1.5 }}>
                                  To use this feature, you need to upgrade your
                                  plan.
                                </h3>
                                <Button
                                  onClick={() => {
                                    setCompleteProfile(true);
                                  }}
                                  style={{ boxShadow: "none" }}
                                  color="success"
                                  size="sm"
                                >
                                  <ArrowUpCircle size={20} />
                                  <span
                                    className="align-middle ms-25"
                                    style={{ fontSize: "16px" }}
                                  >
                                    UPGRADE PLAN
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : ( */}
                        <>
                          {filteredItems.length > 0 ||
                          filesArray.length > 0 ? null : (
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
                                <h4>{t("No Users Invited")}</h4>
                              </Col>
                            </Row>
                          )}{" "}
                        </>
                        {/* // )} */}
                      </>
                    )}
                    {/* {foldersArray.length === 0 || filesArray.length === 0 ? null : ( */}
                    <div
                      style={{
                        display: "flex",
                        padding: "5px",
                        justifyContent: "right",
                        alignItems: "center",
                      }}
                    >
                      {searchQuery.length === 0 ? (
                        <>
                          <div
                            style={{ display: "flex", justifyContent: "right" }}
                          >
                            {/* <div style={{ marginTop: "40px" }}>
                              <select
                                className="form-select "
                                onChange={handlePageChangeNo}
                                style={{
                                  width: "150px",
                                  height: "40px",
                                  fontSize: "16px",
                                }}
                              >
                                <option value="10">
                                  1-10 of {foldersArray.length}
                                </option>
                                <option value="25">
                                  1-25 of {foldersArray.length}
                                </option>
                                <option value="50">
                                  1-50 of {foldersArray.length}
                                </option>
                              </select>
                            </div>
                            <div
                              style={{
                                marginLeft: "20px",
                                marginRight: "20px",
                              }}
                            >
                              <Pagination className="d-flex mt-3">
                                <PaginationItem disabled={currentPage === 1}>
                                  <PaginationLink
                                    previous
                                    href="#"
                                    onClick={() =>
                                      handlePageChange(currentPage - 1)
                                    }
                                  >
                                    <ChevronLeft
                                      size={20}
                                      id="Prev-btn-folder"
                                    />
                                    <UncontrolledTooltip
                                      placement="bottom"
                                      target="Prev-btn-folder"
                                    >
                                      Previous
                                    </UncontrolledTooltip>
                                  </PaginationLink>
                                </PaginationItem>
                                {Array(
                                  Math.ceil(foldersArray.length / itemsPerPage)
                                )
                                  .fill()
                                  .map((_, index) => (
                                    <PaginationItem
                                      key={index}
                                      active={index + 1 === currentPage}
                                    >
                                      <PaginationLink
                                        href="#"
                                        onClick={() =>
                                          handlePageChange(index + 1)
                                        }
                                      >
                                        {index + 1}
                                      </PaginationLink>
                                    </PaginationItem>
                                  ))}
                                <PaginationItem
                                  disabled={
                                    currentPage ===
                                    Math.ceil(
                                      foldersArray.length / itemsPerPage
                                    )
                                  }
                                >
                                  <PaginationLink
                                    previous
                                    href="#"
                                    onClick={() =>
                                      handlePageChange(currentPage + 1)
                                    }
                                  >
                                    <ChevronRight
                                      size={20}
                                      id="Next-btn-folder"
                                    />
                                    <UncontrolledTooltip
                                      placement="bottom"
                                      target="Next-btn-folder"
                                    >
                                      Next
                                    </UncontrolledTooltip>
                                  </PaginationLink>
                                </PaginationItem>
                              </Pagination>
                            </div> */}
                            <PaginationComponent
                              currentPage={currentPage}
                              itemsPerPage={itemsPerPage}
                              totalItems={foldersArray?.length}
                              handlePageChange={handlePageChange}
                              handlePageChangeNo={handlePageChangeNo}
                            />
                          </div>
                        </>
                      ) : null}
                    </div>
                    {/* // )} */}
                    {/* </Card> */}
                  </Col>
                  {/* </>} */}
                </Row>
              </TabPane>
            </TabContent>
          </div>
        </Col>{" "}
      </Row>
      {/* <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className={`modal-dialog-centered ${modalSize}`}
      >
        <ModalBody>
          <div
            style={{
              display: " flex",
              justifyContent: "space-between",
              marginBottom: "2%",
            }}
          >
            <h1 className="fw-bold">{t("Invite User")}</h1>
            <X
              size={24}
              onClick={() => setShow(!show)}
              style={{ cursor: "pointer" }}
            />
          </div>

          <Formik
            initialValues={{
              email: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              // Call your API here
              //console.log(values);
              setSubmitting(true);
              const postData = {
                company_id: companyUsersData,
                email: values.email,
              };
              const apiData = await post("company/add_company_user", postData); // Specify the endpoint you want to call
              console.log("apixxsData");
              console.log(apiData);
              if (apiData.error) {
                setSubmitting(false);
                if (apiData.userlimit === true) {
                  setEmailData(values.email);
                  setItemDeleteConfirmation(true);
                } else if(apiData.upgradePlan===true){
                  toastAlert("error", apiData.message);

                } else{
                  toastAlert("error", apiData.message);
                }
              } else {
                setSubmitting(false);
                toastAlert("success", apiData.message);
                setShow(false);
                fetchAllBulkLinks();
              }
            }}
          >
            {({ getFieldProps, errors, touched, isSubmitting }) => (
              <Form className="auth-login-form mt-2">
                <div className="mb-1">
                  <Label className="form-label" for="login-email">
                    {t("Email")}
                    <span style={{ color: "red" }}> *</span>
                  </Label>
                  <Input
                    style={{
                      height: "50px",
                      boxShadow: "none",
                      fontSize: "16px",
                    }}
                    className={`form-control ${
                      touched.email && errors.email ? "is-invalid" : ""
                    }`}
                    {...getFieldProps("email")}
                    type="email"
                    id="login-email"
                    placeholder="john@example.com"
                    autoFocus
                  />
                  {touched.email && errors.email ? (
                    <div className="invalid-feedback">{errors.email}</div>
                  ) : null}
                </div>
                <div className="d-flex justify-content-center">
                  <Button
                    style={{
                      boxShadow: "none",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "1%",
                      marginTop: "2%",
                    }}
                    type="submit"
                    color="primary"
                    size="sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Spinner color="white" size="sm" /> : null}
                    <span
                      style={{ fontSize: "16px" }}
                      className="align-middle ms-25"
                    >
                      {" "}
                      {t("Send Invite")}
                    </span>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal> */}

      <Modal
        isOpen={show1}
        toggle={() => setShow1(!show1)}
        className={`modal-dialog-centered ${modalSize}`}
      >
        <ModalBody className="px-sm-5 mx-20 pb-2 pt-2">
          <div
            style={{
              display: " flex",
              justifyContent: "space-between",
            }}
          >
            <h1 className="fw-bold">{userDetailsView?.email}</h1>
            <X
              size={24}
              onClick={() => setShow1(!show1)}
              style={{ cursor: "pointer" }}
            />
          </div>
          <Row>
            <Col
              xs={12}
              md={12}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBlock: "20px",
              }}
            >
              {userDetailsView.avatar === null ||
              userDetailsView.avatar === undefined ? (
                <img
                  src={image_dummy}
                  alt="image-data"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "1px solid lightGrey",
                  }}
                />
              ) : (
                <img
                  src={userDetailsView.avatar}
                  alt="image-data"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "1px solid lightGrey",
                  }}
                />
              )}
              {/* <img
                                    src={selectedImage}
                                    alt="image-data"
                                    style={{
                                      width: '100px',
                                      height: '100px',
                                      borderRadius: '50%',
                                      border: '1px solid lightGrey',
                                    }}
                                  /> */}
            </Col>
            <Col xs={12} md={6}>
              <h3>{t("Name")}</h3>
              <h3>{t("Contact No")}</h3>
              <h3>{t("Email")}</h3>
              <h3>{t("Total Files")}</h3>
              <h3>{t("Total Folders")}</h3>
              <h3>{t("Total Templates")}</h3>
              <h3>{t("Total Public Forms")}</h3>
            </Col>
            <Col xs={12} md={6}>
              <h3>
                {userDetailsView.first_name ? userDetailsView.first_name : "-"}{" "}
                {userDetailsView.last_name ? userDetailsView.last_name : ""}
              </h3>
              <h3>
                {userDetailsView.contact_no ? userDetailsView.contact_no : "-"}
              </h3>
              <h3>{userDetailsView.email ? userDetailsView.email : "-"}</h3>
              <h3>
                {userDetailsView.files_count
                  ? userDetailsView.files_count
                  : "-"}
              </h3>
              <h3>
                {userDetailsView.folders_count
                  ? userDetailsView.folders_count
                  : "-"}
              </h3>
              <h3>
                {userDetailsView.templates_count
                  ? userDetailsView.templates_count
                  : "-"}
              </h3>
              <h3>
                {userDetailsView.bulk_links_count
                  ? userDetailsView.bulk_links_count
                  : "-"}
              </h3>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <ModalConfirmationAlert
        isOpen={ItemRestoreAllConfirm}
        toggleFunc={() => setItemRestoreAllConfirm(!ItemRestoreAllConfirm)}
        loader={restoreAllLoader}
        callBackFunc={StatusChange}
        text={`Are you sure you want to ${
          statusData1 === false ? "block" : "active"
        } that user?`}
      />
      <ModalConfirmationAlert
        isOpen={ItemRestoreAllConfirm1}
        toggleFunc={() => setItemRestoreAllConfirm1(!ItemRestoreAllConfirm1)}
        loader={restoreAllLoader}
        callBackFunc={StatusChangeDelete}
        text={`Are you sure you want to ${
          statusData1 === false ? "recover" : "delete"
        } that user?`}
      />
      {/* <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteBulkLink}
        alertStatusDelete={'delete'}
        text={`By click delete, your document will go to Trash. Are you sure?`}
      /> */}
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteBulkLink}
        text={`Member limit exceeded. Adding more will impact billing. Continue?`}
      />
    </div>
  );
};

export default CompanyUsers;
