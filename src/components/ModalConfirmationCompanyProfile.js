import {ArrowUp, X} from 'react-feather';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';
import '../views/StylesheetPhoneNo.css';
import {Form, Formik} from 'formik';
import {BASE_URL, post, postFormData} from '../apis/api';
import toastAlert from '@components/toastAlert';
import * as Yup from 'yup';
// ** Steps
import {Button, Col, Input, Label, Modal, ModalBody, Row, Spinner} from 'reactstrap';
import {useEffect, useState} from 'react';
import CompanyProfileForm from './CompanyProfileForm';
// ** Custom Components

const ModalConfirmationCompanyProfile = ({isOpen, toggleFunc, profileGet, companyId, companyData}) => {
  return (
    <>
      <Modal className={'modal-dialog-centered modal-lg'} isOpen={isOpen} toggle={toggleFunc} centered>
        <ModalBody>
          <div
            style={{
              display: ' flex',
              justifyContent: 'space-between',
            }}>
            <h1 className="fw-bold">Please Complete Your Company Profile</h1>
            <X size={24} onClick={toggleFunc} style={{cursor: 'pointer'}} />
          </div>

          <CompanyProfileForm
            initialValues1={{
              // name: getCompanyData===null||getCompanyData===undefined?'':getCompanyData?.company_name,
              // company_email: getCompanyData===null||getCompanyData===undefined? companyData?.company_email:getCompanyData?.company_email,
              // website_link: getCompanyData===null||getCompanyData===undefined?'':getCompanyData?.website_link,
              // phone_no: getCompanyData===null||getCompanyData===undefined?'':getCompanyData?.contact_no,
              // address: getCompanyData===null||getCompanyData===undefined?'':getCompanyData?.address,
              // company_admin_email: getCompanyData===null||getCompanyData===undefined? companyData?.company_admin_email:getCompanyData?.company_admin_email,
              // branding: '',
              // subdomain_name: getCompanyData===null||getCompanyData===undefined?'':getCompanyData?.subdomain_name,
              // primary_color: getCompanyData===null||getCompanyData===undefined?'':getCompanyData?.primary_color,
              // secondary_color: getCompanyData===null||getCompanyData===undefined?'':getCompanyData?.secondary_color,
              name: '',
              company_email: companyData?.company_email,
              website_link: '',
              phone_no: '',
              address: '',
              company_admin_email: companyData?.company_admin_email,
              branding: '',
              subdomain_name:'',
              primary_color: '',
              secondary_color:
                '',
            }}
            companyData={companyData}
            companyId={companyId}
            isOpen={isOpen}
            toggleFunc={toggleFunc}
            profileGet={profileGet}
          />
        </ModalBody>
      </Modal>
    </>
  );
};
export default ModalConfirmationCompanyProfile;
