// api.js
import getUserLocation from './GetUserLocation';
import {post} from '../../apis/api';

const getActivityLogUserTempResp = async ({ event, description,file_id,email,user_shared_email,response_get}) => {
  const location = await getUserLocation();
  console.log("Activity Log Locarion");

  console.log(location);
  console.log(event)
  console.log(description)
  console.log(file_id)
  console.log(email)
  console.log(user_shared_email)
  console.log(response_get)



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
    user_shared_email:user_shared_email,
    response_get:response_get
  };
  try {
    const apiData = await post('activity_log_maintain_temp_response', postData); // Specify the endpoint you want to call
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
export default getActivityLogUserTempResp;
