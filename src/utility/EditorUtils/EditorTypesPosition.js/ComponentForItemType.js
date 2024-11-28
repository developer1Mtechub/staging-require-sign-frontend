import React from 'react';
import MyTextComponent from './MyTextComponent';
import MySignatureComponent from './MySignatureComponent';
import DateComponent from './DateComponent';
import CheckmarkComponent from './CheckmarkComponent';
import HighlightComponent from './HighlightComponent';
import StampComponent from './StampComponent';
import MySignerTextComponent from './SignerTextComponent';
import MySignerDateComponent from './SignerDateComponent';
import SignerDrivinglicenseComponent from './SignerDrivingLicenseComponent';
import SignerPassportPhotoComponent from './SignerPassportPhotoComponent';
import SignerInitialsComponent from './SignerInitialsComponent';
import SignerStampComponent from './SignerStampComponent';
import SignerCheckmarkComponent from './SignerCheckmarkComponent';
import SignerRadioComponent from './SignerRadioComponent';
import SignerDropComponent from './SignerDropdownComponent';
import MyInitialsComponent from './MyInitialsComponent';
import SignerInitialsTextComponent from './SignerInitialsTextComponent';
const ComponentForItemType = ({
  item,
  handleInputChanged,
  handleInputChangedDate,
  handleInputChecked,
  handleSelectDropDownItem,
  handleDoubleClick,
  IsSigner,
  signer_id,
  signerObject,
  handleWidthChanged,
  handleFileChange,
  handleSignatureAdd,
  activeSignerId,
  // SignerActivePosition,
  RequiredActive,
  SignersWhoHaveCompletedSigning,
  signerFunctionalControls,
  onTouchEnd,
  zoomPercentage,
  setCallbackWidth
  // handleKeyPress
}) => {

  switch (item.type) {
    case 'my_text':
      return (
        <MyTextComponent
        zoomPercentage={zoomPercentage}
        activeSignerId={activeSignerId}
        signerFunctionalControls={signerFunctionalControls}
          item={item}
          handleInputChanged={handleInputChanged}
          handleDoubleClick={handleDoubleClick}
          onTouchEnd={onTouchEnd}
          handleWidthChanged={handleWidthChanged}
          IsSigner={IsSigner}
          setCallbackWidth={setCallbackWidth}
        />
      );
    case 'my_signature':
      return <MySignatureComponent
      zoomPercentage={zoomPercentage}
      activeSignerId={activeSignerId}
      signerFunctionalControls={signerFunctionalControls}
       IsSigner={IsSigner} 
       handleDoubleClick={handleDoubleClick}
       onTouchEnd={onTouchEnd}
        item={item} />;
    case 'my_initials':
      return <MyInitialsComponent
      zoomPercentage={zoomPercentage}
      activeSignerId={activeSignerId}
      onTouchEnd={onTouchEnd}
      signerFunctionalControls={signerFunctionalControls}
       IsSigner={IsSigner} handleDoubleClick={handleDoubleClick} item={item} />;
    case 'date':
      return <DateComponent 
      zoomPercentage={zoomPercentage}
      activeSignerId={activeSignerId}
      onTouchEnd={onTouchEnd}
      signerFunctionalControls={signerFunctionalControls}
      item={item} handleDoubleClick={handleDoubleClick} IsSigner={IsSigner} />;
    case 'checkmark':
      return (
        <CheckmarkComponent
        zoomPercentage={zoomPercentage}
        activeSignerId={activeSignerId}
        signerFunctionalControls={signerFunctionalControls}
          handleInputChecked={handleInputChecked}
          handleDoubleClick={handleDoubleClick}
           onTouchEnd={onTouchEnd}
          item={item}
          IsSigner={IsSigner}
        />
      );
    case 'highlight':
      return <HighlightComponent
      zoomPercentage={zoomPercentage}
      activeSignerId={activeSignerId}
      signerFunctionalControls={signerFunctionalControls}
       IsSigner={IsSigner} item={item} handleDoubleClick={handleDoubleClick}
        onTouchEnd={onTouchEnd} />;
    case 'stamp':
      return <StampComponent
      zoomPercentage={zoomPercentage}

      activeSignerId={activeSignerId}
      signerFunctionalControls={signerFunctionalControls}
       IsSigner={IsSigner} item={item} handleDoubleClick={handleDoubleClick}
        onTouchEnd={onTouchEnd} />;
    case 'signer_text':
      return (
        <MySignerTextComponent
        zoomPercentage={zoomPercentage}
          SignersWhoHaveCompletedSigning={SignersWhoHaveCompletedSigning}
          // handleKeyPress={handleKeyPress}
          // SignerActivePosition={SignerActivePosition}
          activeSignerId={activeSignerId}
          RequiredActive={RequiredActive}
          item={item}
          IsSigner={IsSigner}
          signerObject={signerObject}
          handleInputChanged={handleInputChanged}
          handleDoubleClick={handleDoubleClick}
           onTouchEnd={onTouchEnd}
        />
      );
    case 'signer_date':
      return (
        <MySignerDateComponent
        zoomPercentage={zoomPercentage}
          SignersWhoHaveCompletedSigning={SignersWhoHaveCompletedSigning}
          handleInputChangedDate={handleInputChangedDate}
          item={item}
          signerObject={signerObject}
          activeSignerId={activeSignerId}
          handleDoubleClick={handleDoubleClick}
           onTouchEnd={onTouchEnd}
          IsSigner={IsSigner}
        />
      );
    case 'signer_chooseImgDrivingL':
      return (
        <SignerDrivinglicenseComponent
        zoomPercentage={zoomPercentage}
          SignersWhoHaveCompletedSigning={SignersWhoHaveCompletedSigning}
          RequiredActive={RequiredActive}
          handleFileChange={handleFileChange}
          item={item}
          signerObject={signerObject}
          activeSignerId={activeSignerId}
          IsSigner={IsSigner}
          handleDoubleClick={handleDoubleClick}
           onTouchEnd={onTouchEnd}
        />
      );
    case 'signer_chooseImgPassportPhoto':
      return (
        <SignerPassportPhotoComponent
        zoomPercentage={zoomPercentage}
          SignersWhoHaveCompletedSigning={SignersWhoHaveCompletedSigning}
          RequiredActive={RequiredActive}
          handleFileChange={handleFileChange}
          signerObject={signerObject}
          item={item}
          activeSignerId={activeSignerId}
          IsSigner={IsSigner}
          handleDoubleClick={handleDoubleClick}
           onTouchEnd={onTouchEnd}
        />
      );
    case 'signer_chooseImgStamp':
      return (
        <SignerStampComponent
        zoomPercentage={zoomPercentage}
          SignersWhoHaveCompletedSigning={SignersWhoHaveCompletedSigning}
          RequiredActive={RequiredActive}
          handleFileChange={handleFileChange}
          item={item}
          activeSignerId={activeSignerId}
          signerObject={signerObject}
          IsSigner={IsSigner}
          handleDoubleClick={handleDoubleClick}
           onTouchEnd={onTouchEnd}
        />
      );
    case 'signer_initials':
      return (
        <SignerInitialsComponent
        zoomPercentage={zoomPercentage}
          SignersWhoHaveCompletedSigning={SignersWhoHaveCompletedSigning}
          RequiredActive={RequiredActive}
          handleSignatureAdd={handleSignatureAdd}
          item={item}
          activeSignerId={activeSignerId}
          signerObject={signerObject}
          IsSigner={IsSigner}
          handleDoubleClick={handleDoubleClick}
           onTouchEnd={onTouchEnd}
        />
      );
    case 'signer_initials_text':
      return (
        <SignerInitialsTextComponent
        zoomPercentage={zoomPercentage}
          SignersWhoHaveCompletedSigning={SignersWhoHaveCompletedSigning}
          RequiredActive={RequiredActive}
          handleSignatureAdd={handleSignatureAdd}
          item={item}
          activeSignerId={activeSignerId}
          signerObject={signerObject}
          IsSigner={IsSigner}
          handleDoubleClick={handleDoubleClick}
           onTouchEnd={onTouchEnd}
        />
      );
    case 'signer_checkmark':
      return (
        <SignerCheckmarkComponent
        zoomPercentage={zoomPercentage}
          SignersWhoHaveCompletedSigning={SignersWhoHaveCompletedSigning}
          handleInputChecked={handleInputChecked}
          item={item}
          activeSignerId={activeSignerId}
          IsSigner={IsSigner}
          handleDoubleClick={handleDoubleClick}
          signerObject={signerObject}
           onTouchEnd={onTouchEnd}
        />
      );
    case 'signer_radio':
      return (
        <SignerRadioComponent
          SignersWhoHaveCompletedSigning={SignersWhoHaveCompletedSigning}
          handleInputChecked={handleInputChecked}
          item={item}
          activeSignerId={activeSignerId}
          IsSigner={IsSigner}
          handleDoubleClick={handleDoubleClick}
          signerObject={signerObject}
           onTouchEnd={onTouchEnd}
        />
      );
    case 'signer_dropdown':
      return (
        <SignerDropComponent
        zoomPercentage={zoomPercentage}
          SignersWhoHaveCompletedSigning={SignersWhoHaveCompletedSigning}
          RequiredActive={RequiredActive}
          handleSelectDropDownItem={handleSelectDropDownItem}
          item={item}
          activeSignerId={activeSignerId}
          IsSigner={IsSigner}
          signerObject={signerObject}
          handleDoubleClick={handleDoubleClick}
           onTouchEnd={onTouchEnd}
        />
      );
    default:
      return null;
  }
};

export default ComponentForItemType;
