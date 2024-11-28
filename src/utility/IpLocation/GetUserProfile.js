// api.js
import {post} from '../../apis/api';

const getUserProfile = async user_id => {
  const postData = {
    user_id: user_id,
  };
  try {
    const apiData = await post('user/getUserById', postData); // Specify the endpoint you want to call
    console.log('LOGING');
    console.log(apiData);
    if (apiData?.result[0]?.first_name === '' || apiData?.result[0]?.first_name === null|| apiData?.result[0]?.first_name === undefined) {
      return null;
    } else {
      return true;
    }
  } catch (error) {
    return null;
  }
 
};
export default getUserProfile;
