// // ** Third Party Components
// import {useTranslation} from 'react-i18next';
// import ReactCountryFlag from 'react-country-flag';

// // ** Reactstrap Imports
// import {UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle} from 'reactstrap';

// const IntlDropdown = ({widthD}) => {
//   // ** Hooks
//   const {i18n} = useTranslation();

//   // ** Vars
//   const langObj = {
//     en: 'English',
//     fr: 'French',
//     pt: 'Portuguese',
//     es: 'Spanish',
//     de: 'German',
//   };

//   // ** Function to switch Language
//   const handleLangUpdate = (language,ln) => {
//     // e.preventDefault();
//     // i18n.changeLanguage(lang);
//     i18n.changeLanguage(ln);
//     localStorage.setItem("selectedLanguage", ln);
//     localStorage.setItem("selectedLanguageName", language);
//     // setSelectedLanguage(language);
//   };

//   return (
//     <UncontrolledDropdown
//       style={{
//         border: '1px solid lightGrey',
//         width: widthD===null||widthD===undefined?'140px':widthD,
//         // borderRadius: '5px',
//         marginBlock: '5px',
//         paddingBlock: '5px',
//         marginInline:widthD===null||widthD===undefined?'10px':0,
//         paddingInline: '10px',
//         borderRadius: '5px',
//         // border: '1px solid lightGrey',
//         backgroundColor: 'white',
//         color: 'black',
//         fontWeight: 'bold',
//         cursor: 'pointer',
//       }}
//       // href="/"
//       // tag="li"
//       className="dropdown-language nav-item">
//       <DropdownToggle style={{display: 'flex',justifyContent:'left',alignItems:'center'}} href="/" tag="a" onClick={e => e.preventDefault()}>
//         <ReactCountryFlag
//           svg
//           className="country-flag flag-icon"
//           countryCode={i18n.language === 'en' ? 'us' : i18n.language}
//         />
//         <span style={{marginLeft: '10px',fontSize:"16px"}} className="selected-language">
//           {langObj[i18n.language]}
//         </span>
//       </DropdownToggle>
//       <DropdownMenu className="mt-0" end>
//         <DropdownItem style={{width:"100%"}}  onClick={e => handleLangUpdate('English','en')}>
//           <ReactCountryFlag className="country-flag" countryCode="us" svg />
//           <span className="ms-1" style={{fontSize:"16px"}}>English</span>
//         </DropdownItem>
//         <DropdownItem style={{width:"100%"}}  onClick={e => handleLangUpdate('French',"fr")}>
//           <ReactCountryFlag className="country-flag" countryCode="fr" svg />
//           <span className="ms-1" style={{fontSize:"16px"}}>French</span>
//         </DropdownItem>
//         <DropdownItem style={{width:"100%"}}  onClick={e => handleLangUpdate('German',"de")}>
//           <ReactCountryFlag className="country-flag" countryCode="de" svg />
//           <span className="ms-1" style={{fontSize:"16px"}}>German</span>
//         </DropdownItem>
//         <DropdownItem style={{width:"100%"}}  onClick={e => handleLangUpdate('Portuguese',"pt")}>
//           <ReactCountryFlag className="country-flag" countryCode="pt" svg />
//           <span className="ms-1" style={{fontSize:"16px"}}>Portuguese</span>
//         </DropdownItem>
//         <DropdownItem style={{width:"100%"}}  onClick={e => handleLangUpdate('Spanish',"es")}>
//           <ReactCountryFlag className="country-flag" countryCode="es" svg />
//           <span className="ms-1" style={{fontSize:"16px"}}>Spanish</span>
//         </DropdownItem>
//         {/* <DropdownItem
//           href="/"
//           tag="a"
//           onClick={(e) => handleLangUpdate(e, "de")}
//         >
//           <ReactCountryFlag className="country-flag" countryCode="de" svg />
//           <span className="ms-1">German</span>
//         </DropdownItem> */}
//         {/* <DropdownItem
//           href="/"
//           tag="a"
//           onClick={(e) => handleLangUpdate(e, "pt")}
//         >
//           <ReactCountryFlag className="country-flag" countryCode="pt" svg />
//           <span className="ms-1">Portuguese</span>
//         </DropdownItem> */}
//       </DropdownMenu>
//     </UncontrolledDropdown>
//   );
// };

// export default IntlDropdown;
// ** Third Party Components
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

const IntlDropdown = ({ widthD }) => {
  // ** Hooks
  const { i18n } = useTranslation();

  // ** Vars
  const langObj = {
    en: 'English',
    fr: 'French',
    pt: 'Portuguese',
    es: 'Spanish',
    de: 'German',
  };

  // ** Function to switch Language
  const handleLangUpdate = (language, ln) => {
    i18n.changeLanguage(ln);
    localStorage.setItem("selectedLanguage", ln);
    localStorage.setItem("selectedLanguageName", language);
  };

  return (
    <UncontrolledDropdown
      style={{
        border: '1px solid lightGrey',
        width: widthD === null || widthD === undefined ? '140px' : widthD,
        marginBlock: '5px',
        paddingBlock: '5px',
        marginInline: widthD === null || widthD === undefined ? '10px' : 0,
        paddingInline: '10px',
        borderRadius: '5px',
        backgroundColor: 'white',
        color: 'black',
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
      className="dropdown-language nav-item"
    >
      <DropdownToggle
        style={{
          display: 'flex',
          justifyContent: 'left',
          alignItems: 'center',
          width: '100%',  // Make the entire toggle clickable
        }}
        href="#"
        tag="a"
        onClick={e => e.preventDefault()}
      >
        <ReactCountryFlag
          svg
          className="country-flag flag-icon"
          countryCode={i18n.language === 'en' ? 'us' : i18n.language}
        />
        <span style={{ marginLeft: '10px', fontSize: "16px" }} className="selected-language">
          {langObj[i18n.language]}
        </span>
      </DropdownToggle>
      <DropdownMenu className="mt-0" end>
        {Object.entries(langObj).map(([key, value]) => (
          <DropdownItem
            key={key}
            style={{ width: "100%" }}  // Ensure full width clickable
            onClick={() => handleLangUpdate(value, key)}  // Pass both language name and code
          >
            <ReactCountryFlag className="country-flag" countryCode={key === 'en' ? 'us' : key} svg />
            <span className="ms-1" style={{ fontSize: "16px" }}>{value}</span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default IntlDropdown;

