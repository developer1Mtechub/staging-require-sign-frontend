// ** Third Party Components
import { User, Power, Users, DollarSign } from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Spinner,
} from "reactstrap";
import { useSelector } from "react-redux";

// ** Default Avatar Image
import defaultAvatar from "@assets/images/pages/images.jpg";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../../apis/api";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { getUser, logout, selectPrimaryColor } from "../../../../redux/navbar";
import { decrypt } from "../../../../utility/auth-token";
import SpinnerCustom from "../../../../components/SpinnerCustom";

const UserDropdown = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { user, plan, status, error } = useSelector((state) => state.navbar);
  const primary_color = useSelector(selectPrimaryColor);

  const [emailData, setEmailData] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [avatarData, setAvatarData] = useState("");
  const [loaderData, setLoaderData] = useState(true);

  const [company_user_Logged_User, setCompany_User_Logged_User] =
    useState(null);
  const [company_admin_Logged_User, setCompany_Admin_Logged_User] =
    useState(null);
  // const getUserSecurityTabs = async () => {
  //   //console.log(items?.token?.user_id);
  //   const tokenString = localStorage.getItem("token");
  //   if (tokenString) {
  //     const token = JSON.parse(tokenString);
  //     if (token && token.user_id && token.token) {
  //       const action = await dispatch(
  //         getUser({ user_id: token.user_id, token: token.token })
  //       );
  //       console.log("User data:A");

  //       console.log("User data Plan Dropdown:", action.payload);
  //       setfirst_name(action.payload.result[0].first_name);
  //       let email = action.payload.result[0].email;
  //       let username = email.split("@")[0]; // This will be 'abc'
  //       setEmailData(username);
  //       // console.log(action.payload.avatar);

  //       // console.log(action.payload.avatar);
  //       setCompany_Admin_Logged_User(action.payload.result[0].company_admin);
  //       setCompany_User_Logged_User(action.payload.result[0].company_user);
  //       if (action.payload.result[0].avatar === null) {
  //         setAvatarData(null);
  //       } else {
  //         setAvatarData(BASE_URL + action.payload.result[0].avatar);
  //         // let url_LINK = BASE_URL + action.payload.avatar;
  //       }
  //     } else {
  //       console.error("Token not found in localStorage");
  //     }
  //   }
  //   //   const postData = {
  //   //     user_id: items?.token?.user_id,
  //   //   };
  //   //   //console.log('apixxsData');
  //   //   if (apiData.error) {
  //   //     // toastAlert("error", "")
  //   //   } else {
  //   //     //console.log('<<<<<<<<GET USER DETAILS DATA SETTINGS >>>>>>>');

  //   //     //console.log(apiData.result[0]);
  //   //     if (apiData.result[0].company_id === null || apiData.result[0].company_id === undefined) {
  //   //       // setCompanyData(null);
  //   //     } else {
  //   //       // let company_id = apiData.result[0].company_id;
  //   //       let company_admin_login = apiData.result[0].company_admin;
  //   //       setCompany_Admin_Logged_User(company_admin_login);
  //   //       setCompany_User_Logged_User(apiData.result[0].company_user);

  //   //   }
  //   // };
  // };
  // useEffect(() => {
  //   // getUserSignature();
  //   getUserSecurityTabs();
  // }, []);
  useEffect(() => {
    console.log("status");

    console.log(status);
    if (status === "succeeded") {
      console.log("userDatac ");
      console.log(user);

      const fetchDataBasedOnUser = async () => {
        let email = user?.email;
        let fisrt_name = user?.first_name;
        let avatar = user?.avatar;
        setCompany_User_Logged_User(user?.company_user);
        setCompany_Admin_Logged_User(user?.company_admin);
        if (avatar === null || avatar === undefined) {
          setAvatarData(null);
        } else {
          setAvatarData(avatar);
        }

        let username = email.split("@")[0]; // This will be 'abc'
        if (window.innerWidth < 736) {
          // const words = username.split('.'); // Assuming username might be separated by dots
          const limitedUsername =
            username.length > 6 ? username.slice(0, 6) + "..." : username;
          console.log("SMALL SCREEN IUSUEB");
          console.log(limitedUsername);
          setEmailData(limitedUsername);
          setfirst_name(fisrt_name);
        } else {
          console.log("NOPE SMALL SCREEN IUSUEB");

          setEmailData(username);
          setfirst_name(fisrt_name);
        }

        setLoaderData(false);
      };
      fetchDataBasedOnUser();
    }
  }, [user, status]);
  useEffect(() => {
    const encryptedData = localStorage.getItem("user_data");
    console.log("encryptedData USER DEOP");

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
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {avatarData === null || avatarData === undefined ? (
            <img
              src={defaultAvatar}
              alt="user-profile"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: "1px solid lightGrey",
              }}
            />
          ) : (
            <img
              src={avatarData}
              alt="user-profile"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                border: "1px solid lightGrey",
              }}
            />
          )}
          <>
            {window.innerWidth < 736 ? null : (
              <>
                {loaderData ? (
                  <div style={{ marginLeft: "10px" }}>
                    <SpinnerCustom color="primary" size="sm" />
                  </div>
                ) : (
                  <h3 style={{ marginLeft: "10px", paddingTop: "10px" }}>
                    {first_name === null || first_name === undefined
                      ? emailData
                      : first_name}
                  </h3>
                )}
              </>
            )}{" "}
          </>
        </div>
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem
          style={{
            backgroundColor: "transparent",
            color: "inherit",
            fontWeight: "bold",
            transition: "background-color 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primary_color;
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "inherit";
          }}
          // tag={Link}
          // to="/pages/"
          className="d-flex w-100 "
          onClick={() => {
            window.location.href = "/my_account";
          }}
        >
          <User size={14} className="me-75" />
          <h3 className="align-middle">{t("My Account")} </h3>
        </DropdownItem>
        {/* {company_admin_Logged_User === true ||
        company_admin_Logged_User === "true" ? (
          <DropdownItem
            // tag={Link}
            // to="/pages/"
            className="d-flex w-100"
            onClick={() => {
              window.location.href = "/manage_teams";
            }}
          >
            <Users size={14} className="me-75" />
            <h3 className="align-middle">{t("Manage Teams")} </h3>
          </DropdownItem>
        ) : null} */}
        {/* uncomment lazmin kr na hai  */}
        {company_user_Logged_User === true ||
        (company_user_Logged_User === "true" &&
          company_admin_Logged_User === null) ? null : (
          <DropdownItem
            style={{
              backgroundColor: "transparent",
              color: "inherit",
              fontWeight: "bold",
              transition: "background-color 0.3s, color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = primary_color;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "inherit";
            }}
            // tag={Link}
            // to="/pages/"
            className="d-flex w-100"
            onClick={() => {
              window.location.href = "/subscription_and_plan";
            }}
          >
            <DollarSign size={14} className="me-75" />
            <h3 className="align-middle">{t("Subscription & Plan")} </h3>
          </DropdownItem>
        )}

        <DropdownItem
          style={{
            backgroundColor: "transparent",
            color: "inherit",
            fontWeight: "bold",
            transition: "background-color 0.3s, color 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = primary_color;
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "inherit";
          }}
          className="d-flex w-100"
          onClick={async () => {
            // refresh page
            // window.location.reload();

            const user_id = user?.user_id;
            const email = user?.email;

            // let response_log = await getActivityLogUser({
            //   user_id: user_id,
            //   event: 'SIGN-OUT',
            //   description: `${email} signed out `,
            // });
            // if (response_log === true) {
            //   console.log("MAINTAIN LOG SUCCESS")
            // } else {
            //   console.log("MAINTAIN ERROR LOG")
            // }

            // window.location.href = "/login";
            dispatch(logout());
          }}
          // tag={Link} to="/login"
        >
          <Power size={14} className="me-75" />
          <h3 className="align-middle">{t("Logout")}</h3>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
