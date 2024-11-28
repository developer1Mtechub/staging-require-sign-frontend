import { AlertTriangle, X } from "react-feather";
import { Button, Modal, ModalBody, ModalFooter, Spinner } from "reactstrap";
import warningImg from "../assets/images/warning-image.png";
import { useTranslation } from "react-i18next";

const ModalConfirmationAlert = ({
    isOpen,
    toggleFunc,
    loader,
    callBackFunc,
    text,
    alertStatusDelete
}) => {
    const words = text.split(' ');
const firstLine = words.slice(0, 5).join(' ');
const secondLine = words.slice(5).join(' ');
const { t } = useTranslation();
    return (
        <>
            <Modal
              className="modal-dialog-centered modal-sm"
                isOpen={isOpen} toggle={toggleFunc} centered>

                <ModalBody >
                    <div className="d-flex flex-column justify-content-center align-items-center text-center">
                        {/* <img
      src={warningImg}
      alt="warning"
      style={{ width: '100px', height: 'auto' }} 
    /> */}
                        <AlertTriangle size={70} style={{ color:alertStatusDelete==="delete"?'red': 'orange',marginBottom:"12px" }} />
                        <div>
    <h3 style={{  width: '100%', lineHeight: 1 }}>{firstLine}</h3>
    <h3 style={{  width: '100%'}}>{secondLine}</h3>
  </div>
                        {/* <h3 style={{ paddingTop: '3%',width:'90%',lineHeight:1.5 }}>{text}</h3> */}
                    </div>
                    <div className="d-flex flex-row justify-content-center align-items-center text-center" style={{ padding: '4%' }}>
                              <Button size="sm" disabled={loader} style={{
                            // marginRight: '20px',
                            marginRight: '20px',
                            fontSize:'16px',boxShadow:'none'

                        }} color='success' onClick={callBackFunc}>
                            {loader ? <Spinner color='light' size='sm' /> : null}
                            <span className='align-middle ms-25'>{t("Yes")}</span>
                        </Button>  
                            <Button style={{fontSize:'16px',boxShadow:'none'   }} size="sm" color='danger' onClick={toggleFunc} >
                            {t("No")}
                        </Button>

        
                        {/* <Button color='primary' onClick={() => {
            // deletePosition(deleteIndex)
            setItemDeleteConfirmation(!itemDeleteConfirmation)
          }}>
            Yes
          </Button> */}
                       
                    </div>
                    {/* <div style={{
                        display: ' flex',
                        justifyContent: 'space-between'
                    }}>
                        <h1 className="fw-bold">Confirmation Alert
                        </h1>
                        <X size={24} onClick={toggleFunc} style={{ cursor: 'pointer' }} />

                    </div> */}

                </ModalBody>
                {/* <ModalFooter>
                    <Button size="sm" disabled={loader} color='danger' onClick={callBackFunc}>
                        {loader ? <Spinner color='light' size='sm' /> : null}
                        <span className='align-middle ms-25'>Yes</span>
                    </Button>
                    
                    <Button size="sm" color='secondary' onClick={toggleFunc} outline>
                        No
                    </Button>
                </ModalFooter> */}
            </Modal>
        </>
    )
}
export default ModalConfirmationAlert;