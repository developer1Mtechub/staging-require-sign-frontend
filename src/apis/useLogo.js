import {useState, useEffect} from 'react';
import axios from 'axios'; // or use fetch
import {BASE_URL, post} from './api';
import logoRemoveBg from '@src/assets/images/pages/logoRemoveBg.png';

function useLogo() {
  const [logo, setLogo] = useState(logoRemoveBg);
  const [compNameAPI, setCompNameAPI] = useState(null);

  // const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  // const CheckSubdomainExistOrNotInUrl = async () => {
  //   const currentUrl = window.location.href;
  //   // Parse the URL
  //   const url = new URL(currentUrl);
  //   // Get the hostname (e.g., tsm.localhost)
  //   const hostname = url.hostname;
  //   // Split the hostname by '.' and get the first part (subdomain)
  //   const subdomain = hostname.split('.')[0];
  //   //console.log(subdomain);
  //   if (subdomain === 'localhost') {
  //     console.log('www');
  //     // setLogo(logoRemoveBg)
  //     // check localstorage token if exist then get company id frpm it 
  //     // if not exist then return null
  //     // setLogo(logoRemoveBg);
  //     // setLoading(false);
  //     const items = JSON.parse(localStorage.getItem('token'));
  //       if (items?.company_id === null||items?.company_id === undefined) {
  //         setLogo(logoRemoveBg)
  //         setLoading(false)

  //       } else {
  //         const company_id_data = items.company_id;
  //             if (company_id_data === null) {
  //               setLogo(logoRemoveBg);

  //                   setLoading(false);
  //             } else {
  //               try {
  //                 const postData = {
  //                   company_id: company_id_data,
  //                 };
  //                 const apiData = await post('company/get_company', postData); // Specify the endpoint you want to call
  //                 //console.log('LOGOG LOGOG GLGO');
      
  //                 //console.log(apiData.data.company_logo);
  //                 //console.log(apiData.data.company_name);
  //                 if (apiData.data) {
  //                   setCompNameAPI(apiData.data);
  //                 }
  //                 console.log(apiData.data.company_logo)
  //                 if (apiData.data.company_logo===null) {
  //                    setLogo(logoRemoveBg);
  //                   setLoading(false);

  //                 }else{
  //                   let logo_url = BASE_URL + apiData.data.company_logo;
  //                   setLogo(logo_url);
  //                 setLoading(false)
                  
  //                 }
  //                 // if (response.data.logo) {
  //                 //   setLogo(response.data.logo);
  //                 // }
  //               } catch (error) {
  //                 console.error(error);
  //                 setLoading(false)
  //                 setLogo(logoRemoveBg);

  //               } finally {
  //                 setLoading(false)

  //               }
  //             }

  //       }
  //     // localStorage.setItem('subdomain', 'www');
  //   } else {
  //     console.log(subdomain);
  //     const postData = {
  //       subdomain_name: subdomain,
  //     };
  //     try {
  //       const apiData = await post('company/get_company_by_subdomain', postData); // Specify the endpoint you want to call
  //       //console.log('LOG');
  //       console.log(apiData);
  //       if (apiData?.error) {
  //         console.log('ERROR');
  //         setLogo(logoRemoveBg);
  //         setLoading(false);

  //       } else {
  //         console.log('subdomain exist');
  //         console.log(apiData?.data);
  //         setCompNameAPI(apiData?.data);
  //         setLoading(false);
  //         setLogo(BASE_URL + apiData?.data?.company_logo);
  //         // setCompanyDetails(apiData.data);
  //       }
  //     } catch (error) {
  //       // return null;
  //       console.log('ERROR', error);
  //       setLoading(false);
  //       setLogo(logoRemoveBg);


  //     }
  //     // localStorage.setItem('subdomain', subdomain);
  //   }
  // };
  // useEffect(() => {
  //   const fetchDataSequentially = async () => {
  //     console.log("logo ")
  //     await  CheckSubdomainExistOrNotInUrl();
  //   };
  //   fetchDataSequentially();
  
  // }, []);

  return {logo, loading, compNameAPI};
}

export default useLogo;
