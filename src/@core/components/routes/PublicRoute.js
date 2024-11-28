// ** React Imports
import { Suspense } from "react";
import { Navigate } from "react-router-dom";
import { getHomeRouteForLoggedInUser ,getUserData} from "@utils/Utils";

// ** Utils
// import { getUserData, getHomeRouteForLoggedInUser } from "@utils";

const PublicRoute = ({ children, route }) => {
  if (route) {
    const user = getUserData();

    const restrictedRoute = route.meta && route.meta.restricted;

    if (user && restrictedRoute) {
      return <Navigate to={getHomeRouteForLoggedInUser(user.role)} />;
    }
  }

  return <Suspense fallback={null}>{children}</Suspense>;
};

export default PublicRoute;
