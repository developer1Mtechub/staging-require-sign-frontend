// ** Logo
import { Spinner } from "reactstrap";
import useLogo from "@uselogo/useLogo";
import { useSelector } from "react-redux";
import SpinnerCustom from "../../../components/SpinnerCustom";
import {
  selectLogo,
  selectLoading,
  selectPrimaryColor,
} from "../../../redux/navbar";

const SpinnerComponent = () => {
  // const {logo: logoFromApi, loading} = useLogo();
  // const logo = useSelector(selectLogo);
  // const logoURL = useSelector(state => state.navbar.logo);
  const logo = useSelector(selectLogo);
  const loading = useSelector(selectLoading);

  // const company = JSON.parse(localStorage.getItem('token'));
  // const logoFromLocalStorage = company?.logo;
  return (
    <div className="fallback-spinner app-loader">
      {/* {loading ? null : ( */}
      {loading ? null : ( // Show loading spinner or placeholder
        <img
          className="fallback-logo"
          src={logo}
          alt="Company Logo"
          style={{ width: "300px", height: "70px", objectFit: "contain" }}
        />
      )}
      {/* )} */}
      <SpinnerCustom color="primary" style={{ marginTop: "10px" }} />
      {/* <Spinner color="primary" style={{marginTop: '10px'}} /> */}
      {/* <div className="loading">
        <div className="effect-1 effects"></div>
        <div className="effect-2 effects"></div>
        <div className="effect-3 effects"></div>
      </div> */}
    </div>
  );
};

export default SpinnerComponent;
