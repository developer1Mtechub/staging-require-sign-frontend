import React from 'react';
import SignerDrivinglicenseComponent from './SignerDrivingLicenseComponent';
import SignerPassportPhotoComponent from './SignerPassportPhotoComponent';
import SignerInitialsComponent from './SignerInitialsComponent';
import SignerStampComponent from './SignerStampComponent';
import SignerCheckmarkComponent from './SignerCheckmarkComponent';
import SignerRadioComponent from './SignerRadioComponent';
import SignerDropComponent from './SignerDropdownComponent';
import MySignerTextComponent from './SignerTextComponent';
import MySignerDateComponent from './SignerDateComponent';
import MyTextComponent from './MyTextComponent';
import MySignatureComponent from './MySignatureComponent';
import DateComponent from './DateComponent';
import CheckmarkComponent from './CheckmarkComponent';
import HighlightComponent from './HighlightComponent';
import StampComponent from './StampComponent';
const ComponentForItemTypeComp = ({
  item,
}) => {
  switch (item.type) {
    case 'my_text':
      return <MyTextComponent item={item} />;
    case 'my_signature':
      return <MySignatureComponent item={item} />;
      case 'my_initials':
        return <MySignatureComponent item={item} />;
    case 'date':
      return <DateComponent item={item} />;
    case 'checkmark':
      return <CheckmarkComponent />;
    case 'highlight':
      return <HighlightComponent item={item}  />;
    case 'stamp':
      return <StampComponent item={item}  />;
    case 'signer_text':
      return <MySignerTextComponent item={item} />;
    case 'signer_date':
      return <MySignerDateComponent item={item} />;
    case 'signer_chooseImgDrivingL':
      return <SignerDrivinglicenseComponent item={item} />;
    case 'signer_chooseImgPassportPhoto':
      return <SignerPassportPhotoComponent item={item} />;
    case 'signer_chooseImgStamp':
      return <SignerStampComponent item={item} />;
    case 'signer_initials':
      return <SignerInitialsComponent item={item} />;
      case 'signer_initials_text':
        return <SignerInitialsComponent item={item} />;
  
    case 'signer_checkmark':
      return <SignerCheckmarkComponent item={item} />;
    case 'signer_radio':
      return <SignerRadioComponent item={item} />;
    case 'signer_dropdown':
      return <SignerDropComponent item={item} />;
    default:
      return null;
  }
};

export default ComponentForItemTypeComp;
