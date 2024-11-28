import {AlertTriangle, ArrowUpCircle, X} from 'react-feather';
import {Button, Modal, ModalBody, ModalFooter, Spinner} from 'reactstrap';
import warningImg from '../assets/images/warning-image.png';
import ModalConfirmationPlan from './ModalConfirmationPlan';
import { useState,useEffect } from 'react';
import { get } from '../apis/api';
const ModalUpgradePremium = ({isOpen, toggleFunc, loader, callBackFunc, text, alertStatusDelete}) => {
  //     const words = text.split(' ');
  // const firstLine = words.slice(0, 5).join(' ');
  // const secondLine = words.slice(5).join(' ');
  const [completeProfile, setCompleteProfile] = useState(false);
  const [referalCodes, setReferalCodes] = useState([]);
  const fetchData1 = async () => {
    const apiData1 = await get('pricing/get_all_pricing'); // Specify the endpoint you want to call
    console.log('----------Navbar -------------');

    console.log(apiData1);
    if (apiData1.error) {
      // toastAlert('error', apiData1.message);
    } else {
      // toastAlert('success', apiData1.message);
      // const freeItems = apiData1.result.filter(item => item.type === 'FREE');
      setReferalCodes(apiData1.result);
    }
  };
  useEffect(() => {
    fetchData1()
  }, []);
  return (
    <>
      <Modal className="modal-dialog-centered modal-sm" isOpen={isOpen} toggle={toggleFunc} centered>
        <ModalBody>
          <div style={{display: 'flex', justifyContent: 'right'}}>
            <X size={20} style={{cursor: 'pointer'}} onClick={toggleFunc} />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center text-left" style={{marginBlock:'10px'}}>
            <ArrowUpCircle size={70} style={{color: '#ffdd2e'}} />
           <div style={{marginLeft: '15px',textAlign:'center'}}>
            <h2 style={{fontWeight:600,marginTop:'1%'}}>Upgrade Required</h2>
           <h3 style={{width: '100%',lineHeight:1.5}}>To use this feature, you need to upgrade your plan.</h3>
           <Button
          onClick={() => {
            setCompleteProfile(true);
          }}
          style={{boxShadow: 'none'}}
          color="success"
          size="sm">
          <ArrowUpCircle size={20} />
          <span className="align-middle ms-25" style={{fontSize: '16px'}}>
            UPGRADE PLAN
          </span>
        </Button>
            </div> 
        
          </div>
        </ModalBody>
      </Modal>
      <ModalConfirmationPlan
      planAll={referalCodes}
        isOpen={completeProfile}
        toggleFunc={() => setCompleteProfile(!completeProfile)}
      />
    </>
  );
};
export default ModalUpgradePremium;
