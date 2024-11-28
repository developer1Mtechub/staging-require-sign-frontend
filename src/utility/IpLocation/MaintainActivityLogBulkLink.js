// api.js
import getUserLocation from './GetUserLocation';
import {post} from '../../apis/api';

const getActivityLogUserBulk = async ({ event, description,file_id,email,user_shared_email}) => {
  const location = await getUserLocation();
  console.log("Activity Log Locarion");

  console.log(location);

  const postData = {
    // user_id: user_id,
    event: event,
    description: description,
    location_country: location.country,
    template_id:file_id,
    ip_address: location.ip,
    location_date: location.date,
    timezone: location?.timezone,
    email:email,
    user_shared_email:user_shared_email
  };
  try {
    const apiData = await post('activity_log_maintain_bulk', postData); // Specify the endpoint you want to call
    console.log('LOG');
    console.log(apiData);
    let dataResult=apiData.data
    if (apiData.error) {
      return null;
    } else {
      return dataResult;
    }
  } catch (error) {
    return null;
  }
  // usage
  // const location = await getUserLocation();
  //     //console.log(location)
};
export default getActivityLogUserBulk;
