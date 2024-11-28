// ** React Imports

import CompanyProfileForm from '../CompanyProfileForm'

const CompanyProfile = ({
  isOpen, toggleFunc, profileGet, companyId, companyData
}) => {
  
  return (
    <>
   <CompanyProfileForm
          companyData={companyData}
          companyId={companyId}
          isOpen={isOpen}
            toggleFunc={toggleFunc}
            profileGet={profileGet}
            />
    </>
  )
}

export default CompanyProfile
