// Logo Import
import logo from "@src/assets/images/logo/logo.svg";

// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    // appName: "Require Sign",
    // appLogoImage: logo,
  },
  layout: {
    isRTL: false,
    skin: "light", // light, dark, bordered, semi-dark
    type: "vertical", // vertical, horizontal
    contentWidth: "boxed", // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: false,
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: "floating", // static , sticky , floating, hidden
      backgroundColor: "white", // BS color options [primary, success, etc]
    },
    logo:'https://res.cloudinary.com/dlm56y4v4/image/upload/v1714458748/logoRemoveBg_i9gwty.png',
    footer: {
      type: "static", // static, sticky, hidden
    },
    customizer: false,
    scrollTop: true, // Enable scroll to top button
    toastPosition: "top-center", // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  },
};

export default themeConfig;
