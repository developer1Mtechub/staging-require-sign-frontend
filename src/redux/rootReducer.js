// ** Reducers Imports
import layout from "./layout";
import navbar from "./navbar";
import { dashboardApi } from "./user";
import auth from "./authSlice";
const rootReducer = { navbar, layout ,dashboardApi,auth};

export default rootReducer;
