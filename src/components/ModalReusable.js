import { CheckCircle, X, XCircle} from 'react-feather';
import { Button, Label, Modal, ModalBody, Spinner} from 'reactstrap';
import SpinnerCustom from './SpinnerCustom';
const ModalReusable = ({isOpen, toggleFunc, success, successMessageData, errorMessageData,sucessHeader,buttonStart,loader}) => {
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggleFunc} centered>
        <ModalBody>
        {loader?null :<div style={{display:'flex',justifyContent:"right"}}>
                  <X size={24} style={{cursor:'pointer'}} onClick={toggleFunc}/>
                </div>}
          <div
            className="d-flex flex-column justify-content-center align-items-center text-center"
            style={{marginTop: '5%'}}>
            {success ? (
              <CheckCircle size={70} style={{color: '#4BB543'}} />
            ) : (
              <XCircle size={70} style={{color: 'red'}} />
            )}
            {sucessHeader ===null||sucessHeader ===undefined ? <>
           {success ? (
              <h1 className="fw-bold" style={{paddingTop: '3%',textAlign: 'center', fontWeight: 900, color: '#115fa7'}}>
                 SUCCESS
               
              </h1>
            ) : (
              <h1 className="fw-bold" style={{paddingTop: '3%',textAlign: 'center', fontWeight: 900, color: '#115fa7'}}>
                ERROR
              </h1>
            )} </> : <h1 className="fw-bold" style={{paddingTop: '3%',textAlign: 'center', fontWeight: 900, color: '#115fa7'}}>{sucessHeader}</h1>
            }
            
            {/* {success ? (
              <h3 style={{fontSize: '16px', marginBottom: '5%',width:'75%'}}>
               {successMessageData}
              </h3>
            ) : (
              <h3>{errorMessageData}.</h3>
            )} */}
            {success ? (
  <h3 style={{fontSize: '16px', marginBottom: buttonStart?"0":'5%', width: '90%'}}>
     <Label className="form-label">
    {successMessageData.map((line, index) => (
      <>
      <div key={index} style={{letterSpacing: '0.5px', lineHeight: '1.5'}}>
        {line}{index < successMessageData.length - 1 && <br />}
      </div>
      {loader?<Spinner
      size={20} style={{marginTop:"10px"}}
      color="primary"/>
      :null} 

      
      </>
    ))}</Label>
  </h3>
) : (
  <h3 style={{
    letterSpacing: '0.5px',
    lineHeight: '1.5',
    fontSize: '16px', marginBottom: buttonStart?"0":'1%', width: '90%'
  }}> <Label className="form-label">

{errorMessageData
  ? errorMessageData.split('.').map((sentence, index) => (
      <span key={index}>
        {sentence.trim()}
        {index < errorMessageData.split('.').length - 1 && '.'}
        <br />
      </span>
    ))
  : null} </Label>
  </h3>
)}
{buttonStart?
 <Button size="sm" color="primary" onClick={toggleFunc} style={{ marginTop: '10px',marginBottom:"20px",fontSize:"16px" }}>
 Ok
</Button>
:null
}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
export default ModalReusable;
