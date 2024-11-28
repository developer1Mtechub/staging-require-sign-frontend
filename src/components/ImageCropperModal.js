
import React, { useState, useEffect, useCallback, useRef } from "react";
import { X } from "react-feather";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Spinner,
} from "reactstrap";
import { Cropper, CropperPreview } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import "./ImageCropper.css";
import { useTranslation } from "react-i18next";

const ImageCropperModal = ({ cropSrc, isOpen, toggle, onImageCropped }) => {
  const [cropData, setCropData] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [loader, setLoader] = useState(false);
  const [croppedImagePreview, setCroppedImagePreview] = useState(null);
  const cropperRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (cropSrc && cropper) {
      cropper.setImage(cropSrc);
    }
  }, [cropSrc, cropper]);

  const showCroppedImage = useCallback(async () => {
    setLoader(true);
    try {
      console.log("cropper");
      console.log(cropper);
      console.log(cropperRef);

     
      if (cropperRef.current) {
        const croppedImage = cropperRef.current
          .getCanvas()
          .toDataURL("image/jpeg");
        const response = await fetch(croppedImage);
        console.log(response);

        const blob = await response.blob();
        const croppedFile = new File([blob], "cropped.jpeg", {
          type: blob.type,
        });
        console.log(croppedFile);
        setLoader(false);
        toggle();
        onImageCropped(croppedFile);
      }
    } catch (e) {
      console.error(e);
      setLoader(false);
    }
  }, [cropper, onImageCropped, toggle]);

  return (
    <Modal
      isOpen={isOpen}
      // toggle={toggle}
      className="modal-dialog-centered modal-lg"
    >
      <ModalBody>
        <Row>
          <Col
            xs="12"
            md="12"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <h1>{t("Crop Image")}</h1>
            <X size={20} style={{ cursor: "pointer" }} onClick={toggle} />
          </Col>
          <Col
            xs="12"
            style={{
              marginBlock: "2%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {cropSrc && (
              <div
                style={{
                  position: "relative",
                  // height: "300px",
                  // width: "500px",
                  height: window.innerWidth>768 ? "300px" :  "100%",
                  width: window.innerWidth>768 ?"500px":"100%",
                  border: "1px solid lightGrey",
                }}
              >
                <Cropper
                  ref={cropperRef}
                  className={"cropper"}
                  src={cropSrc}
                  onInitialized={(instance) => {
                    console.log("Cropper initialized", instance);
                    setCropper(instance);
                  }}
                  onCropEnd={(crop) => {
                    console.log("Crop end", crop);
                    setCropData(crop);
                  }}
                  style={{ height: "100%", width: "100%" }}
                  stencilProps={{
                    aspectRatio: NaN,
                    handlers: {
                      zoomable: true,
                      corners: true,
                      sides: true,
                      center: true,

                      eastNorth: true,
                      north: true,
                      westNorth: true,
                      west: true,
                      westSouth: true,
                      south: true,
                      eastSouth: true,
                      east: true,
                    },
                    grid: true,
                    movable: true,
                    resizable: true,
                    lines: true,
                    // backgroundClassName: 'cropper-background',
                    // stencilClassName: 'cropper-stencil',
                  }}
                />
                {croppedImagePreview && (
                  <div
                    style={{
                      width: "45%",
                      border: "1px solid lightGrey",
                      padding: "10px",
                    }}
                  >
                    <h4>{t("Cropped Preview")}</h4>
                    <img
                      src={croppedImagePreview}
                      alt="Cropped Preview"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                )}
                {/* <CropperPreview cropper={cropper} style={{height: '100%', width: '100%'}} /> */}
              </div>
            )}
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button
          size="sm"
          color="primary"
          onClick={showCroppedImage}
          disabled={loader}
        >
          {loader ? (
            <Spinner color="light" size="sm" />
          ) : (
            <span className="align-middle ms-25" style={{ fontSize: "1rem" }}>
              {" "}
              {t("Done")}{" "}
            </span>
          )}
        </Button>{" "}
        <Button size="sm" color="secondary" onClick={toggle}>
          <span className="align-middle ms-25" style={{ fontSize: "1rem" }}>
            {" "}
            {t("Cancel")}{" "}
          </span>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ImageCropperModal;


