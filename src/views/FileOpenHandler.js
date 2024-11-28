import React, {useEffect, useState} from 'react';
import Home from './Home';
import { Col, Modal, ModalBody, Row } from 'reactstrap';
import { X } from 'react-feather';

const FileOpenHandler = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    // Here you can add any additional logic for when the modal should be opened or closed
    // For this example, the modal is always open when this component is rendered
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    // Here you can add logic to redirect the user after closing the modal, if needed
  };

  return (
    <>
      {/* <Modal isOpen={isModalOpen} onClose={closeModal} 
       className={`modal-dialog-centered modal-sm`}>
        <ModalBody className="  pb-5 bg-white">
        <div xs={12} style={{display: 'flex', justifyContent: 'right'}}>
                <X
                  size={20}
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    // setCardType('');
                    setIsModalOpen(!isModalOpen);
                  }}
                />
              </div>
              <Row tag="form" className="gy-1 gx-2 mt-75">
                <Col xs={12}>
                  <UploadFile />
                </Col>
              </Row>

        </ModalBody>
      </Modal> */}
      <Home modalOpenFile={true}/> 
    </>
  );
};
export default FileOpenHandler;
