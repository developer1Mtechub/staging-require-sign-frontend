// api.js
import {post} from '../../apis/api';

const GetUserProfileComp = async company_id => {
  const postData = {
    company_id: company_id,
  };
  try {
    const apiData = await post('company/get_company', postData); // Specify the endpoint you want to call
    //console.log('LOGING COMPANY PROFILE');
    //console.log(apiData);
    if (apiData?.data?.company_name === '' || apiData?.data?.company_name === null) {
      const data = {
        apiData: apiData.data,
        error: true,
      };
      return data;
    } else {
      const data = {
        apiData: apiData.data,
        error: false,
      };
      return data;
    }
  } catch (error) {
    //console.log(error)
    return null;
  }
  // usage
  // const location = await getUserLocation();
  //     //console.log(location)
};
export default GetUserProfileComp;
