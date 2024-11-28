// api.js
import {post} from '../../apis/api';

const getUserPlan = async user_id => {
  const postData = {
    user_id: user_id,
  };
  try {
    const apiData = await post('plan/get_user_plan_data_v2', postData); // Specify the endpoint you want to call
    //console.log('LOG');
    //console.log(apiData);
    if (apiData.error) {
      return null;
    } else {
      return apiData;
    }
  } catch (error) {
    return null;
  }
  // usage
  // const location = await getUserLocation();
  //     //console.log(location)
};
export default getUserPlan;
