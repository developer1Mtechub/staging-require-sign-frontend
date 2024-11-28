// ** React Imports
import {useEffect} from 'react';
import {NavLink} from 'react-router-dom';

// ** Icons Imports
import {Disc, X, Circle} from 'react-feather';

// ** Config
import themeConfig from '@configs/themeConfig';
// import useLogo from '@uselogo/useLogo';
import { useSelector } from 'react-redux';

// ** Utils
import {getUserData, getHomeRouteForLoggedInUser} from '@utils/Utils';
import {Spinner} from 'reactstrap';
import { selectLoading, selectLogo } from '../../../../../redux/navbar';
import SpinnerCustom from '../../../../../components/SpinnerCustom';

const VerticalMenuHeader = props => {
  // const {logo, loading} = useLogo();
  // ** Props
  const {menuCollapsed, setMenuCollapsed, setMenuVisibility, setGroupOpen, menuHover} = props;

  // ** Vars
  const user = getUserData();
  const logo = useSelector(selectLogo);
  const loading = useSelector(selectLoading);
  // ** Reset open group
  useEffect(() => {
    if (!menuHover && menuCollapsed) setGroupOpen([]);
  }, [menuHover, menuCollapsed]);

  // ** Menu toggler component
  const Toggler = () => {
    if (!menuCollapsed) {
      return (
        <Disc
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(true)}
        />
      );
    } else {
      return (
        <Circle
          size={20}
          data-tour="toggle-icon"
          className="text-primary toggle-icon d-none d-xl-block"
          onClick={() => setMenuCollapsed(false)}
        />
      );
    }
  };
  // const logoURL = useSelector((state) => state.navbar.logoURL);
  // const company = JSON.parse(localStorage.getItem('token'));
  // const logoFromLocalStorage = company?.logo;
  return (
    <div className="navbar-header">
      {/* {logoFromLocalStorage} */}
      <ul className="nav navbar-nav flex-row">
        <li className="nav-item me-auto">
        {/* {loading?
            logo:logo} */}
          <NavLink to={user ? getHomeRouteForLoggedInUser(user.role) : '/'} className="navbar-brand">
            {/* <span className="brand-logo"> */}
            {loading ? (
             <SpinnerCustom size="sm" color="primary"   />
            ) : (
              <>

            
              <img src={
                logo 
                // logoFromLocalStorage || logoURL
                } alt="logo" style={{width: '180px', height: '60px',objectFit:"contain"}} />
                </>
            )}
            {/* </span> */}
            {/* <h2 className="brand-text mb-0">{themeConfig.app.appName}</h2> */}
          </NavLink>
        </li>
        {/* <li className="nav-item nav-toggle">
          <div className="nav-link modern-nav-toggle cursor-pointer">
            <Toggler />
            <X
              onClick={() => setMenuVisibility(false)}
              className="toggle-icon icon-x d-block d-xl-none"
              size={20}
            />
          </div>
        </li> */}
      </ul>
    </div>
  );
};

export default VerticalMenuHeader;
