// ** React Imports
import { Fragment, lazy, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import { useDispatch, useSelector } from "react-redux";
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";
import {
  setLogo,
  setPrimaryColor,
  setSecondaryColor,
  setLoading,
} from "../../redux/navbar.js";
// ** Route Components
// import PublicRoute from '@components/routes/PublicRoute';
import Home from "../../views/Home";
import Folder from "../../views/Folder";
import Login from "../../views/Login";
import Register from "../../views/Register";
import ForgotPassword from "../../views/ForgotPassword";
import Error from "../../views/Error";
import MyAccount from "../../views/MyAccount";
import ManageTeams from "../../views/ManageTeams";
import PricingAndPlan from "../../views/PricingAndPlan";
import ResetPassword1 from "../../views/ResetPasswor1";
import EditorMainSmall from "../../views/EditorSmallScreen";
import ConfirmationProfile from "../../components/ConfirmationProfile";
import FileOpenHandler from "../../views/FileOpenHandler";

// ** Utils
import { isObjEmpty } from "@utils/Utils";
// import EditorPage from '../../views/Editor';
import TwoStepsCover from "../../views/TwoStepsCover";
// import StripePlan from '../../views/StripePlan';
import DedicatedServers from "../../views/DedicatedServers";
import StripeCheckout from "../../views/StripeCheckout";
import BulkLinks from "../../views/BulkLinks";
import AddBulkLink from "../../views/AddBulkLink";
import ResetPassword from "../../views/ResetPassword";
import ReceivedESignDoc from "../../views/ReceivedESignDoc";
import Archieve from "../../views/Archieve";
import TrashPage from "../../views/Trash";
import ViewDocEditor from "../../views/ViewDocEditor";
import ViewDocRecipient from "../../views/ViewDocRecipient";
import Template from "../../views/Template";
import TemplateDoc from "../../views/TemplateDoc";
import SharedTemplate from "../../views/SharedTemplate";
import Settings from "../../views/Settings";
import WaitingForOthersShowPdf from "../../views/WaitingForOthersShowPdf";
import CompletedDocView from "../../views/CompletedDocView";
import BulkLinkDocN from "../../views/BulkLinkDocN";
import BulkLinkDocViewN from "../../views/BulkLinkDocViewN";
import ViewDocBulkLinkN from "../../views/ViewDocBulkLinkN";
import TemplateDocN from "../../views/TemplateDocN";
import TemplateDocViewN from "../../views/TemplateDocViewN";
import TemplateResponses from "../../views/TemplateResponses";
import CompletedDocViewDownload from "../../views/CompletedDocViewDownload";
import { post } from "../../apis/api";
import FullScreenLoader from "../../@core/components/ui-loader/full-screenloader.js";
import CompletedDocViewReceiver from "../../views/CompletedDocViewReceiver.js";
import TemplateResponsesReceiver from "../../views/TemplateResponsesReceiver.js";
import ViewDocBulkLinkNReceiver from "../../views/ViewDocBulkLinkNReceiver.js";
// import EditorMainDummy from '../../views/Editor_DUMY';
const isAdminLoggedIn = () => {
  return localStorage.getItem("user_data") !== null;
};
const DefaultRoute = "/home";

// // import EditorMainDummy from '../../views/Editor_DUMY';
// const PublicOnlyRoute = ({ children }) => {
//   if (isAdminLoggedIn()) {
//     return <Navigate to={DefaultRoute} />;
//   }
//   return children;
// };
const PublicOnlyRoute = ({ route, children }) => {
  // Check if the route is truly public, meaning accessible to both logged-in and logged-out users
  if (route.meta && route.meta.publicOnly && isAdminLoggedIn()) {
    // If the route is public-only but the user is logged in, allow access
    return children;
  }

  // Otherwise, if the user is logged in, redirect to the default route
  if (isAdminLoggedIn()) {
    return <Navigate to={DefaultRoute} />;
  }

  // If the user is not logged in, allow access to the public route
  return children;
};

// const PrivateRoute = ({ children }) => {
//   if (!isAdminLoggedIn()) {
//     return <Navigate to="/login" />;
//   }
//   return children;
// };
const PrivateRoute = ({ children }) => {
  // If the user is not logged in, redirect them to the login page
  if (!isAdminLoggedIn()) {
    return <Navigate to="/login" />;
  }

  // Otherwise, allow access to private routes
  return children;
};
const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};

// ** Document title
const TemplateTitle = "%s - RequireSign User portal";

// ** Merge Routes
const Routes = [
  {
    path: "/",
    index: true,
    // element: <Navigate replace to={DefaultRoute} />,
    element: isAdminLoggedIn() ? (
      <Navigate replace to={DefaultRoute} />
    ) : (
      <Navigate replace to="/login" />
    ),
  },
  {
    path: "/home",
    element: <Home />,
    meta: {
      // layout: 'blank',
      layout: "vertical",

      publicOnly: false,
    },
  },
  {
    path: "/upload_document",
    element: <FileOpenHandler />,
    meta: {
      layout: "vertical",
      publicOnly: false,
    },
  },
  {
    path: "/trash",
    element: <TrashPage />,
    meta: {
      layout: "vertical",
      publicOnly: false,
    },
  },

  {
    path: "/archive",
    element: <Archieve />,
    meta: {
      layout: "vertical",
      publicOnly: false,
    },
  },

  {
    path: "/public_forms",
    element: <BulkLinks />,
    meta: {
      layout: "vertical",
      publicOnly: false,
    },
  },
  {
    path: "/my_account",
    element: <MyAccount />,
    meta: {
      layout: "vertical",
      publicOnly: false,
    },
  },
  {
    path: "/manage_teams",
    element: <ManageTeams />,
    meta: {
      layout: "vertical",
      publicOnly: false,
    },
  },
  {
    path: "/subscription_and_plan",
    element: <PricingAndPlan />,
    meta: {
      layout: "vertical",
      publicOnly: false,
    },
  },
  // {
  //   path: '/settings',
  //   element: <Settings />,
  //   meta: {
  //     layout: 'vertical',
  //   },
  // },

  // {
  //   path: '/template-builder/:template_id',
  //   element: <TemplateDoc />,
  //   meta: {
  //     layout: 'blank',
  //   },
  // },
  // {
  //   path: '/sign-template/:template_id/:id',
  //   element: <SharedTemplate />,
  //   meta: {
  //     layout: 'blank',
  //   },
  // },

  {
    path: "/template",
    element: <Template />,
    meta: {
      layout: "vertical",
      publicOnly: false,
    },
  },
  {
    path: "/create-public-form",
    element: <AddBulkLink />,
    meta: {
      layout: "vertical",
      publicOnly: false,
    },
  },
  {
    path: "/home/:subFolderId/:prevId",
    element: <Home />,
    meta: {
      layout: "vertical",
      publicOnly: false,
    },
  },
  // {
  //   path: '/stripe_plan',
  //   element: <StripePlan />,
  //   meta: {
  //     layout: 'blank',
  //   },
  // },
  {
    path: "/dedicated_server",
    element: <DedicatedServers />,
    meta: {
      layout: "blank",
      publicOnly: false,
    },
  },
  {
    path: "/stripe_checkout",
    element: <StripeCheckout />,
    meta: {
      layout: "blank",
      publicOnly: false,
    },
  },

  // {
  //   path: '/editor/:fileId',
  //   element: <EditorPage />,
  //   meta: {
  //     layout: 'blank',
  //   },
  // },
  // {
  //   path: '/editor1/:fileId',
  //   element: <EditorPage1 />,
  //   meta: {
  //     layout: 'blank',
  //   },
  // },
  {
    path: "/esign-setup/:fileId",
    // element: <EditorMain />,
    element: <EditorMainSmall />,
    meta: {
      layout: "blank",
      publicOnly: false,
    },
  },
  // {
  //   path: '/editordummy/:fileId',
  //   element: <EditorMainDummy />,
  //   meta: {
  //     layout: 'blank',
  //   },
  // },

  {
    path: "/waiting_for_others_doc/file/:fileId",
    element: <CompletedDocView />,
    meta: {
      layout: "blank",
      publicOnly: false,
    },
  },
  {
    path: "/completed/file/:fileId",
    element: <CompletedDocView />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/waiting_for_others_doc_download/file/:fileId",
    element: <CompletedDocViewDownload />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/received_doc/file/:fileId/:receipientEmail",
    element: <CompletedDocViewReceiver />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/copy_public_form_response/:bulk_link_id/:receipientEmail",
    element: <ViewDocBulkLinkNReceiver />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/received_doc_temp/file/:fileId/:receipientEmail",
    element: <TemplateResponsesReceiver />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  // ,WaitingForOthersShowPdf
  {
    path: "/view_doc/:fileId",
    element: <ViewDocEditor />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/waiting_for_others_doc/:fileId",
    element: <WaitingForOthersShowPdf />,
    meta: {
      layout: "blank",
      publicOnly: false,
    },
  },
  {
    path: "/view_doc_recipient/:emailHashed/:fileId",
    element: <ViewDocRecipient />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/e-sign-form-create/:bulk_link_id",
    element: <BulkLinkDocN />,

    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/template-builder/:bulk_link_id",
    element: <TemplateDocN />,

    meta: {
      layout: "blank",
      publicOnly: false,
    },
  },
  {
    path: "/bulk_link_doc_n/:bulk_link_id",
    element: <BulkLinkDocN />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/public_form_response/:bulk_link_id",
    element: <ViewDocBulkLinkN />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/template_responses/:bulk_link_id",
    element: <TemplateResponses />,
    meta: {
      layout: "blank",
      publicOnly: false,
    },
  },

  {
    path: "/public-form/esign/:bulk_link_id",
    element: <BulkLinkDocViewN />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/sign-template/:template_id/:id/:signer_id",
    element: <TemplateDocViewN />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/send-doc-to-esign/:emailHashed/:file_id/:senderId/:token",
    element: <ReceivedESignDoc />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/editor3/:fileId",
    element: <EditorMainSmall />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/update_password",
    element: <ResetPassword />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/update_password1",
    element: <ResetPassword1 />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/complete_profile",
    element: <ConfirmationProfile />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/verifyEmail/:token",
    element: <TwoStepsCover />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  // {
  //   path: '/verification-otp',
  //   element: <OTPVERIFFY />,
  //   meta: {
  //     layout: 'blank',
  //   },
  // },
  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "*",
    element: <Error />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.forEach((route) => {
      if (route.path) {
        let isBlank = false;
        if (
          (route.meta && route.meta.layout && route.meta.layout === layout) ||
          ((route.meta === undefined || route.meta.layout === undefined) &&
            defaultLayout === layout)
        ) {
          const RouteTag =
            route.meta && route.meta.publicOnly === true
              ? PublicOnlyRoute
              : PrivateRoute;

          isBlank = route.meta && route.meta.layout === "blank";

          if (route.element) {
            const Wrapper =
              isObjEmpty(route.element.props) && isBlank === false
                ? LayoutWrapper
                : Fragment;

            route.element = (
              <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
                <RouteTag route={route}>{route.element}</RouteTag>
              </Wrapper>
            );
          }
          LayoutRoutes.push(route);
        }
      }
    });
  }
  return LayoutRoutes;
};
const getRoutes = (layout) => {
  // const [subdomain, setSubdomain] = useState('');

  // const dispatch = useDispatch();
  // const loading = useSelector((state) => state.navbar.loading);
  // const fetchSubdomain = async (subdomain) => {
  //   dispatch(setLoading(true)); // Start loading
  //   try {
  //     const postData = {
  //       subdomain_name: subdomain,
  //     };
  //     const apiData = await post("company/check_company_subdomain", postData); // Specify the endpoint you want to call
  //     console.log("File Dta Fetch");
  //     console.log(apiData);
  //     if (apiData?.error === false && apiData?.subdomain && apiData?.data) {
  //       const { company_logo, primary_color } = apiData.data;

  //       // Set both Redux state and localStorage for persistence
  //       dispatch(setLogo(company_logo));
  //       dispatch(setPrimaryColor(primary_color));
  //       dispatch(setSecondaryColor(apiData.data.secondary_color || "#165eab"));

  //       localStorage.setItem("companyLogo", company_logo);
  //       localStorage.setItem("company_primary_color", primary_color);
  //       localStorage.setItem(
  //         "company_secondary_color",
  //         apiData.data.secondary_color || "#165eab"
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error fetching subdomain:", error);
  //   } finally {
  //     dispatch(setLoading(false)); // Stop loading
  //     // navigate("/target-route"); // Redirect after API call
  //   }
  // };

  // useEffect(() => {
  //   const hostname = window.location.hostname; // e.g., mtechub.requiresign.com
  //   const parts = hostname.split(".");
  //   const detectedSubdomain = parts[0];

  //   // alert(detectedSubdomain)

  //   // check if that subdomain exists in your database else set default logo
  //   fetchSubdomain(detectedSubdomain);
  //   // fetch the branding
  //   // set that in redux or localstorage
  // }, [dispatch]);
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
