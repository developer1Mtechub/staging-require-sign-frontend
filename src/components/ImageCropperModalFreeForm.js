import React, { useState, useCallback, useEffect, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css'; // Ensure you import the styles
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Spinner, Row, Col } from 'reactstrap';

const TO_RADIANS = Math.PI / 180;

const ImageCropperModalFreeForm = ({ cropSrc, isOpen, toggle, onImageCropped }) => {
  const [crop, setCrop] = useState({ aspect: 1 }); // Set aspect ratio if needed
  const [completedCrop, setCompletedCrop] = useState(null);
  const [loader, setLoader] = useState(false);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef('');

  useEffect(() => {
    if (!isOpen) {
      setCompletedCrop(null);
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = '';
      }
    }
  }, [isOpen]);

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    setCrop({
      unit: '%',
      width: 50,
      aspect: 1,
    });
  }, []);

  const getCroppedImg = useCallback((image, crop) => {
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          console.error('Canvas is empty');
          return reject(new Error('Canvas is empty'));
        }
        blob.name = 'cropped.png';
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
        }
        const croppedImageURL = URL.createObjectURL(blob);
        blobUrlRef.current = croppedImageURL;
        resolve(croppedImageURL);
      }, 'image/png');
    });
  }, []);

  useEffect(() => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && previewCanvasRef.current) {
      getCroppedImg(imgRef.current, completedCrop).then(croppedImageUrl => {
        const canvas = previewCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.src = croppedImageUrl;

        image.onload = () => {
          canvas.width = completedCrop.width;
          canvas.height = completedCrop.height;
          ctx.drawImage(image, 0, 0);
        };
      });
    }
  }, [completedCrop, getCroppedImg]);

  const onSave = useCallback(() => {
    setLoader(true);
    if (!completedCrop || !previewCanvasRef.current) {
      setLoader(false);
      return;
    }

    previewCanvasRef.current.toBlob(blob => {
      const croppedFile = new File([blob], 'cropped.png', { type: blob.type });
      onImageCropped(croppedFile);
      setLoader(false);
      toggle();
    }, 'image/png');
  }, [completedCrop, onImageCropped, toggle]);

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered modal-lg">
     
      <ModalBody className="pb-5 px-sm-5 mx-50">
        <Row>
        <Col xs={12}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBlock:"10px"}}>
          <h1>Crop Image</h1>
          <X size={20} style={{cursor:"pointer"}} onClick={toggle}/>
          </div>
          </Col>
          <Col xs={12} style={{
            display:"none"
          }}>
            {!!completedCrop && (
              <div>
                <h4>Preview:</h4>
                <canvas
                  ref={previewCanvasRef}
                  style={{
                    width: completedCrop.width,
                    height: completedCrop.height,
                  }}
                />
              </div>
            )}
          </Col>
          <Col xs="12" style={{ marginBlock: '1%', display: 'flex', justifyContent: 'center', width: "100%", height: "500px", overflow: "auto" }}>
            {cropSrc && (
              <ReactCrop
                src={cropSrc}
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={c => setCompletedCrop(c)}
                style={{ width: '100%', height: '100%', overflowY: 'auto' }}
              >
                <img
                  ref={imgRef}
                  src={cropSrc}
                  alt="Crop me"
                  style={{ width: "100%", height: "100%", overflowY: "scroll" }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button size="sm" color="primary" onClick={onSave} style={{
          boxShadow:"none"
        }}  disabled={loader}>
          {loader ? <Spinner color="light" size="sm" /> : 'Done'}
        </Button>{' '}
        <Button style={{
          boxShadow:"none"
        }}  size="sm" color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ImageCropperModalFreeForm;
