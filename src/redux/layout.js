// ** Redux Imports
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';

// ** ThemeConfig Import
import themeConfig from '@configs/themeConfig';
import {post} from '../apis/api';

// ** Async thunk to fetch logo
export const fetchLogo = createAsyncThunk('layout/fetchLogo', async (_, {getState}) => {
  const state = getState();
  // const token = localStorage.getItem("token");
  // const companyId =token.company_id

  // if (token && companyId) {
  //   const postData={
  //     company_id:companyId
  //   }
  //   const companyDetails = await post('company/get_company', postData);
  //   console.log('companyDetails',companyDetails)
  //   // const response = await axios.get(`/api/logo/${companyId}`, {
  //   //   // headers: {
  //   //   //   Authorization: `Bearer ${token}`
  //   //   // }
  //   // });
  //   return companyDetails; // assuming the logo URL is in response.data.logo
  // }
  return null;
});

const initialMenuCollapsed = () => {
  const item = window.localStorage.getItem('menuCollapsed');
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.menu.isCollapsed;
};

const initialDirection = () => {
  const item = window.localStorage.getItem('direction');
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.isRTL;
};

const initialSkin = () => {
  const item = window.localStorage.getItem('skin');
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : themeConfig.layout.skin;
};
const token = window.localStorage.getItem('token');
// const companyId = token.company_id;

export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    skin: initialSkin(),
    isRTL: initialDirection(),
    layout: themeConfig.layout.type,
    lastLayout: themeConfig.layout.type,
    menuCollapsed: initialMenuCollapsed(),
    footerType: themeConfig.layout.footer.type,
    navbarType: themeConfig.layout.navbar.type,
    menuHidden: themeConfig.layout.menu.isHidden,
    contentWidth: themeConfig.layout.contentWidth,
    navbarColor: themeConfig.layout.navbar.backgroundColor,
    logo: themeConfig.layout.logo,
  },
  reducers: {
    handleRTL: (state, action) => {
      state.isRTL = action.payload;
      window.localStorage.setItem('direction', JSON.stringify(action.payload));
    },
    handleSkin: (state, action) => {
      state.skin = action.payload;
      window.localStorage.setItem('skin', JSON.stringify(action.payload));
    },
    handleLayout: (state, action) => {
      state.layout = action.payload;
    },
    handleFooterType: (state, action) => {
      state.footerType = action.payload;
    },
    handleNavbarType: (state, action) => {
      state.navbarType = action.payload;
    },
    handleMenuHidden: (state, action) => {
      state.menuHidden = action.payload;
    },
    handleLastLayout: (state, action) => {
      state.lastLayout = action.payload;
    },
    handleNavbarColor: (state, action) => {
      state.navbarColor = action.payload;
    },
    handleContentWidth: (state, action) => {
      state.contentWidth = action.payload;
    },
    handleMenuCollapsed: (state, action) => {
      state.menuCollapsed = action.payload;
      window.localStorage.setItem('menuCollapsed', JSON.stringify(action.payload));
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchLogo.fulfilled, (state, action) => {
      console.log('dshjfhjsdhjsdfhjsdfhjksdf');
      console.log(action.payload);
      state.logo = action.payload;
    });
  },
});

export const {
  handleRTL,
  handleSkin,
  handleLayout,
  handleLastLayout,
  handleMenuHidden,
  handleNavbarType,
  handleFooterType,
  handleNavbarColor,
  handleContentWidth,
  handleMenuCollapsed,
} = layoutSlice.actions;

export default layoutSlice.reducer;
// Dispatch fetchLogo if token and companyId exist
// if (token && companyId) {
//   store.dispatch(fetchLogo());
// }
