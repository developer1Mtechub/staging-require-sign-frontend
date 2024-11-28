import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postHeaders } from "../apis/api";
import logoRemoveBg from '@assets/images/pages/logoRemoveBg.png';
import toastAlert from "@components/toastAlert";
import { decrypt } from "../utility/auth-token";


// Thunks and slice setup
export const getUser = createAsyncThunk(
  "user/getUserDetails",
  async ({ user_id }, { rejectWithValue }) => {
    const encryptedData = localStorage.getItem("user_data");
    if (!encryptedData) {
      return rejectWithValue("User data is missing in localStorage");
    }
    
    // if (encryptedData) {
    
    //     const decryptedData = JSON.parse(decrypt(encryptedData));
    //     const { token, user_id } = decryptedData;

    //     // Fetch user data if not already available in Redux state
        
    //  }else{
    //   return rejectWithValue("Token is missing");
    
    // }
   

    try {
      const decryptedData = JSON.parse(decrypt(encryptedData));
      const { token } = decryptedData;
console.log("USER ID");
console.log(user_id);
console.log("TOKEN");
console.log(token);
      if (!token|| !user_id) {
        return rejectWithValue("Token is missing");
      }
      console.log("REDUX");

      console.log(token);
      console.log(user_id);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const postData = { user_id };
      const response = await postHeaders("user/getUserById", postData, headers);
      console.log(response);
      if(response.error===true){
        if(response.error_type===true){
          toastAlert("error",response.message)
          setTimeout(() => {
            localStorage.removeItem("user_data");

            if (window.location.pathname !== '/login') {
              window.location.href = '/login';  // Replace with your actual login route
            }  // Replace with your actual login route
          }, 2000);

        }else{
          toastAlert("error",response.message)
        }
      }
      console.log("response REDUX");

      if (response?.result?.length > 0) {
        // if(response.result)
        const user = response?.result[0];
        const user_current_subscription = response?.result1[0];
        const user_current_plan_details = response?.result2[0];
 const logo = response?.companyProfile?.company_logo ||user?.logo|| logoRemoveBg;
        const primary_color=response?.companyProfile?.primary_color || "#23b3e8";
        const  secondary_color= response?.companyProfile?.secondary_color || "#165eab";
           localStorage.setItem('companyLogo', logo);
        localStorage.setItem('company_primary_color', primary_color);
        localStorage.setItem('company_secondary_color', secondary_color);
        console.log("COMPANY");
        console.log(response?.companyProfile);
      

        return {
          user,
          subscription: user_current_subscription || [],
      
          plan: user_current_plan_details || null,
          docuemntsCount: response?.userDocuments || 0,
          userTempDocuments: response?.userTempDocuments || 0,
          userBulkDocuments: response?.userBulkDocuments || 0,
          company_profile: response?.companyProfile || null,
          company_admin:response?.company_admin ||null,
          logo: response?.companyProfile?.company_logo ||user?.logo|| logoRemoveBg,
          primary_color: response?.companyProfile?.primary_color || "#23b3e8",
         secondary_color: response?.companyProfile?.secondary_color || "#165eab"

        };

       
      } else {
        
        return rejectWithValue("User not found");
      }
    } catch (error) {
      console.log("Error fetching user:", error);
      return rejectWithValue("Error fetching user");
    }
  }
);

const navbarSlice = createSlice({
  name: "navbar",
  initialState: {
    user: null,
    logo: localStorage.getItem('companyLogo') || logoRemoveBg, 
    primary_color: localStorage.getItem('company_primary_color') ||  "#23b3e8", 
    secondary_color: localStorage.getItem('company_secondary_color') ||  "#165eab", 
    // logo:  logoRemoveBg, 
    //  primary_color:  "#23b3e8", 
    //  secondary_color: "#165eab", 



    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user_data");
      localStorage.removeItem("companyLogo");
      localStorage.removeItem("company_primary_color");
      localStorage.removeItem("company_secondary_color");
      state.user = null;
      // state.logo = null; // Clear logo on logout
      state.logo = logoRemoveBg;
      state.primary_color= "#23b3e8"
      state.secondary_color = "#165eab"
      window.location.href = '/login';
    },
    setLogo: (state, action) => {
      state.logo = action.payload;
    },
    setPrimaryColor: (state, action) => {
      state.primary_color = action.payload;
    },
    setSecondaryColor: (state, action) => {
      state.secondary_color = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        // state.loading = true;
        // state.error = null;
        state.status = "loading";
        state.loading = true; // Indicate loading state
        state.error = null;

      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        // state.user = action.payload;
        // state.error = null;
        state.logo=action.payload.logo;
        state.primary_color=action.payload.primary_color;

        state.secondary_color=action.payload.secondary_color;

        // state.primary_color=action.payload.pr
console.log("logo")
console.log(action.payload.logo)

        state.status = "succeeded";
        state.user = action.payload.user;
        state.subscription = action.payload.subscription;
        state.plan = action.payload.plan;
   
        state.docuemntsCount = action.payload.docuemntsCount;
        state.userTempDocuments = action.payload.userTempDocuments;
        state.userBulkDocuments = action.payload.userBulkDocuments;
        state.company_profile= action.payload.company_profile;
        state.company_admin = action.payload.company_admin;
        const plan_limitations = action.payload.plan;


  state.team_size = plan_limitations?.team_size;
        state.document_limit = plan_limitations?.document_limit;
        state.template_count = plan_limitations?.template_count;
        state.public_forms_count = plan_limitations?.public_forms_count;
        state.branding = plan_limitations?.branding;
        // Calculate if the free trial is expired
        let subscription_end_date =
          action.payload.subscription.subscription_end_date;
        console.log("DFSGFHG");
        console.log(subscription_end_date);
        if (
          subscription_end_date === null ||
          subscription_end_date === undefined
        ) {
          state.isSubscripitonActive=false

          console.log(action.payload.subscription.free_trail_end_date);
          const freeTrialEndDate = new Date(
            action.payload.subscription.free_trail_end_date
          );
          const currentDate = new Date();

          state.isFreeTrialExpired = freeTrialEndDate < currentDate;
          console.log("EEEEEEEEEEE");
          console.log(state.isFreeTrialExpired);

          if (state.isFreeTrialExpired) {
            state.daysLeftExpiredfreePlan = 0;
          } else {
            console.log("********");
            const daysLeft = Math.ceil(
              (freeTrialEndDate - currentDate) / (1000 * 60 * 60 * 24)
            );
            console.log("daysLeft4566")

            console.log(daysLeft)
            if (daysLeft > 0) {
              // Set the alert for trials expiring within 3 days
              console.log("Free trial expiring soon");
              state.daysLeftExpiredfreePlan = daysLeft;
          console.log("daysLeft5",daysLeft);

            } else {
              state.daysLeftExpiredfreePlan = 0;
          console.log("daysLeft",0);

            }
          }
        } else {
          console.log("SUBDCRIBED USER");
          state.isFreeTrialExpired=true
          const subscriptionEndDateObj = new Date(subscription_end_date);
          const currentDate = new Date();
          state.isSubscripitonActive=true
        
          if (subscriptionEndDateObj < currentDate) {
            // Subscription expired
            state.daysLeftExpiredfreePlan = 0;
            console.log("Subscription expired.");
          } else {
            // Subscription still active, calculate remaining days
            const daysLeft = Math.ceil((subscriptionEndDateObj - currentDate) / (1000 * 60 * 60 * 24));
        
            if (daysLeft <= 3 && daysLeft > 0) {
              // Set alert for subscriptions expiring within 3 days
              console.log("Subscription expiring soon",daysLeft);
              state.daysLeftExpiredfreePlan = daysLeft;
            } else {
              console.log("Subscription expiring soon ggf",daysLeft);

              state.daysLeftExpiredfreePlan = daysLeft;
            }
          }
        }

        
      })
      .addCase(getUser.rejected, (state, action) => {
        // state.error = action.payload;
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logout, setLogo, setPrimaryColor, setSecondaryColor ,setLoading} = navbarSlice.actions;
export const selectLogo = (state) => state.navbar.logo; 
export const selectLoading = (state) => state.navbar.loading;
export const selectPrimaryColor = (state) => state.navbar.primary_color;
export const selectSecondaryColor = (state) => state.navbar.secondary_color;
// here 
export const selectUser = (state) => state.navbar.user;
export const selectSubscription = (state) => state.navbar.subscription;
export const selectPlan = (state) => state.navbar.plan;
export const selectCompanyProfile = (state) => state.navbar.company_profile;
export const selectIsFreeTrialExpired = (state) => state.navbar.isFreeTrialExpired;
export const selectDaysLeftExpiredfreePlan = (state) => state.navbar.daysLeftExpiredfreePlan;
export const selectIsSubscriptionActive = (state) => state.navbar.isSubscripitonActive;
export const selectTeamSize = (state) => state.navbar.team_size;
export const selectDocumentLimit = (state) => state.navbar.document_limit;
export const selectTemplateCount = (state) => state.navbar.template_count;
export const selectPublicFormsCount = (state) => state.navbar.public_forms_count;
export const selectDocumentCount=(state)=>state.navbar.docuemntsCount;

export default navbarSlice.reducer;
