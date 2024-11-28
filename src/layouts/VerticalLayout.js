// ** React Imports
import { Outlet } from "react-router-dom";

// ** Core Layout Import
// !Do not remove the Layout import
import Layout from "@layouts/VerticalLayout";

// ** Menu Items Array
import navigation from "@src/navigation/vertical";
import { useEffect, useState } from "react";
import getUserPlan from "../utility/IpLocation/GetUserPlanData";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { decrypt } from "../utility/auth-token";
import { getUser } from "../redux/navbar";

const VerticalLayout = (props) => {
  const dispatch = useDispatch();
  const { user, plan,docuemntsCount,subscription, status,error } = useSelector(
    (state) => state.navbar
  );
  const [menuData, setMenuData] = useState(navigation);
  // const [menuData, setMenuData] = useState([])

  // ** For ServerSide navigation
  // useEffect(() => {
  //   axios.get(URL).then(response => setMenuData(response.data))
  // }, [])

  const getPlanData = async () => {
//  const dataGet = await getCheckUserPlan();
    console.log('dataGet');
    // console.log(dataGet);
    if (plan?.document_to_sign === 'unlimited') {
      setMenuData(navigation);
    } else {
      const userDocumentsCount = plan?.document_to_sign;
      console.log(userDocumentsCount);
      // const userDocuments = dataGet?.userDocuments
      // const userDocuments = dataGet?.userDocuments;

      if (parseInt(docuemntsCount) === parseInt(userDocumentsCount)) {
        const filteredNavigation = navigation.filter(item => item.id !== 'file');
        setMenuData(filteredNavigation);
      } else {
        setMenuData(navigation);
      }
    }
  }
  
  useEffect(() => {
    if (status === "succeeded") {
      const fetchDataBasedOnUser = async () => {
        try {
          await Promise.all([
            getPlanData()
          ]);






       
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
        }
      };
      fetchDataBasedOnUser();
    }
  }, [user,status]);
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
  // useEffect(() => {
  //   getPlanData()

  
  // }, []);
  return (
    <Layout menuData={menuData} {...props}>
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;
