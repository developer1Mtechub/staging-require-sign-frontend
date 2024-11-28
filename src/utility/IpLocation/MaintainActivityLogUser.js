// api.js
import getUserLocation from './GetUserLocation';
import {post} from '../../apis/api';

const getActivityLogUser = async ({user_id, event, description}) => {
  const location = await getUserLocation();
  console.log("Activity Log Location");

  console.log(location);

  const postData = {
    user_id: user_id,
    event: event,
    description: description,
    location_country: location?.country,
    ip_address: location?.ip,
    location_date: location?.date,
    timezone: location?.timezone,
  };
  try {
    const apiData = await post('activity_log_maintain', postData); // Specify the endpoint you want to call
    //console.log('LOG');
    //console.log(apiData);
    if (apiData?.error) {
      return null;
      
    } else {
      return true;
    }
  } catch (error) {
    return null;
  }
  // usage
  // const location = await getUserLocation();
  //     //console.log(location)
};
export default getActivityLogUser;
