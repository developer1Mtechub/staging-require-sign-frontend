// ** React Imports
import { Link } from "react-router-dom";

// ** Reactstrap Imports
import { Button } from "reactstrap";

// ** Custom Hooks
import { useSkin } from "@hooks/useSkin";

// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/error.png";
import illustrationsDark from "@src/assets/images/pages/error-dark.svg";
import logoRemoveBg from "@src/assets/images/pages/logoRemoveBg.png";


// ** Styles
import "@styles/base/pages/page-misc.scss";

const Error = () => {
  // ** Hooks
  const { skin } = useSkin();

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  return (
    <div className="misc-wrapper">
 <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
          <img src={logoRemoveBg} alt="Login Cover" style={{ width: '200px', height: 'auto' }} />
          {/* <h2 className='brand-text text-primary ms-1'>Vuexy</h2> */}
        </Link>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h1 className="mb-1 fw-bold">Page Not Found 🕵🏻‍♀️</h1>
          <p className="mb-2" style={{fontSize:'16px'}}>
            Oops! 😖 The requested URL was not found on this server.
          </p>
          <Button style={{boxShadow:'none'}}
            tag={Link}
            to="/"
            color="primary"
            className="btn-sm-block mb-2"
          >
            Back to home
          </Button>
          <img className="img-fluid" src={source} alt="Not authorized page" />
        </div>
      </div>
    </div>
  );
};
export default Error;
