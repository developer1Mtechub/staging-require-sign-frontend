import {useState, useCallback, useEffect} from 'react';
import {BASE_URL, post, postFormData} from '../../../apis/api';
import './ImagePickerStyle.css';
// import Cropper from 'react-easy-crop'; // Assuming you're using the same cropper as in the previous project
//
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner} from 'reactstrap';
import {ArrowUp, PlusCircle, X} from 'react-feather';
import ImageCropperModal from '../../../components/ImageCropperModal';
import toastAlert from '@components/toastAlert';
import { base64toFile } from '../../Utils';
import getActivityLogUser from '../../IpLocation/MaintainActivityLogUser';
import CustomButton from '../../../components/ButtonCustom';
import { selectPrimaryColor } from '../../../redux/navbar';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const ImagePicker = ({user_id_user,user_email,lengthPrevsign,lengthPrevInitial,initialsBox,profile, signatureChooseImage, onSelectImage, PrevSignatureArray, modalClose}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loader, setLoader] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const primary_color = useSelector(selectPrimaryColor);
  const { t } = useTranslation();

  const [modal, setModal] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [initialBoxData, setInitialBoxData] = useState(false);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const toggle = () => setModal(!modal);

  function getCroppedImg(imageSrc, pixelCrop) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height,
        );

        canvas.toBlob(blob => {
          blob.name = 'cropped.png';
          const croppedImageUrl = window.URL.createObjectURL(blob);
          resolve(croppedImageUrl);
        }, 'image/png');
      };
      image.onerror = error => reject(error);
    });
  }
  const convertToPng = src => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous'; // Required if loading from external URLs
      image.src = src;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);
        canvas.toBlob(blob => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          blob.name = 'converted.png';
          const pngUrl = window.URL.createObjectURL(blob);
          const convertedFile = new File([blob], blob.name, {
            type: blob.type,
          });
          console.log('PNG URL:', pngUrl);
          console.log('Converted File Object:', convertedFile);
          console.log(pngUrl);

          // resolve(pngUrl);
          resolve(pngUrl);
        }, 'image/png');
      };
      image.onerror = error => reject(error);
    });
  };
  const readFile = file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.addEventListener(
        'load',
        async () => {
          const imageDataUrl = await convertToPng(reader.result);
          console.log(imageDataUrl);
          resolve(imageDataUrl);
        },
        false,
      );
      reader.readAsDataURL(file);
    });
  };
  const handleImageChange = async event => {
    console.log(event);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      // Check for image types that you want to convert to PNG
      if (file.type.startsWith('image/')) {
        const imageDataUrl = await readFile(file);
        setImageSrc(imageDataUrl);
        toggle();
        // event.target.value = '';
      }
    }
  };

  const handleReplaceImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/';
    input.onchange = handleImageChange;
    input.click();
    // onSelectImage(selectedImage);
  };
 
  const handleImageCropped = async croppedFile => {
    console.log('Cropped File:', croppedFile);

    if (croppedFile instanceof Blob) {
      const objectURL = URL.createObjectURL(croppedFile);
      console.log('Preview URL:', objectURL);
      setSelectedImage(objectURL); // Assuming setSelectedImage can handle a URL
    } else {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;

        // Convert base64 to Blob
        try {
          const response = await fetch(base64data);
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);
          console.log('Preview URL:', objectURL);
          setSelectedImage(objectURL); // Assuming setSelectedImage can handle a URL

         
        } catch (error) {
          console.error('Error processing image:', error);
        }
      };

      reader.readAsDataURL(croppedFile);
    }
  };

  const handleSaveImage = async () => {
    setLoader(true);
    // saveImageToDB(selectedImage); // Save data to DB
    console.log("selectedImage");

    console.log(selectedImage);
    console.log("sdfjhsjhfsdf")
    //  onSelectImage(selectedImage);
    let base64data;

    // Check if selectedImage is a Blob URL or a base64 string
    if (selectedImage.startsWith("blob:")) {
      // Convert Blob URL to a Blob object
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      // Convert Blob to base64
      base64data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      // Assume selectedImage is already a base64 string
      base64data = selectedImage;
    }
   
    if (initialBoxData) {
      console.log('Base64 Data:', base64data);
      const filename = 'image.png';
      const fileObject = base64toFile(base64data, filename);
      console.log('File Object:', fileObject);

      const postData = {
        image: fileObject,
        user_id:user_id_user
         // or fileObject if the API requires a file
      };

      const apiData = await postFormData(postData); // Specify the endpoint you want to call
console.log(apiData);
      if (!apiData.public_url) {
        toastAlert('error', 'Error uploading Files');
      } else {
        const user_id =user_id_user;
        const ImageUrl = apiData.public_url;
        const TypeCheck = initialsBox ? 'profile_initils' : 'profile';
        const event = initialsBox ? 'PROFILE-INITIALS-ADDED' : 'PROFILE-SIGNATURE-ADDED';
        const textData = initialsBox ? 'profile initials added' : 'profile signature added';

        const postData = {
          user_id: user_id,
          signature_image_url: ImageUrl,
          type: TypeCheck,
        };

        const apiData1 = await post('user/AddUserSignaturesToDb', postData); // Specify the endpoint you want to call
 console.log(apiData1);
 console.log("apiData1");

        if (apiData1.error) {
          setIsSubmitting(false);
          toastAlert('error', "Can't Update Right Now!");
        } else {
          const email = user_email;

          let response_log = await getActivityLogUser({
            user_id: user_id_user,
            event: event,
            description: `${email} ${textData}`,
          });

          if (response_log !== true) {
            console.log('MAINTAIN ERROR LOG');
          }
        }
      }
      onSelectImage(selectedImage);
    }else{
      onSelectImage(selectedImage);
    }
  };
  

  return (
    <>
      <div>
        <Row>
          <Col sm={12}>
            <div style={{display: 'flex', justifyContent: 'space-between', flexDirection:window.innerWidth>781?"row":"column"}}>
              <h4 style={{color: 'grey'}}>
                {selectedImage === null || selectedImage === undefined ? t('Select Image') : t('Click to Replace Image')}
              </h4>
              {selectedImage === null || selectedImage === undefined ? null : (
                <h5 style={{color: primary_color, cursor: 'pointer'}} onClick={() => setSelectedImage(null)}>
                  {initialsBox ? t('Clear Initials') : t('Clear Signature')}
                </h5>
              )}
            </div>
          </Col>
          <Col md="12" style={{display: 'flex', justifyContent: 'center'}}>
            {selectedImage === null || selectedImage === undefined ? (
              <>
                <div className="image-picker">
                  {/* <input
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    style={{display: 'none'}}
                    onChange={handleImageChange}
                  /> */}
                   <input
                    type="file"
                    accept="image/*"
                    id="fileInput"
                    style={{display: 'none'}}
                    onChange={handleImageChange}
                  />
                  <label htmlFor="fileInput">
                    <div className="box d-flex align-items-center justify-content-center flex-column">
                      <span
                        style={{
                          padding: '6%',
                          borderRadius: '100px',
                          border: '2px solid lightGrey',
                        }}>
                        <ArrowUp size={40} color={primary_color}/>
                      </span>
                      <h2
                        style={{
                          fontSize: window.innerWidth>781?'16px' :'13px',
                          textAlign: 'center',
                          marginTop: '5%',
                          color: 'grey',
                        }}>
                        {t("Click or drop file to upload")}
                      </h2>
                    </div>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <div className="image_box" onClick={handleReplaceImage}>
                    <img
                      src={selectedImage}
                      alt="Selected"
                      style={{width: '100%', height: '100%', objectFit: 'contain'}}
                    />
                  </div>
                </div>
              </>
            )}
          </Col>
          {profile===false?
          <Col xs="12" md="12">
            <div style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginTop: '10px'}}>
              <input
                type="checkbox"
                id="initialsa"
                name="initialsa"
                value="initials"
                onChange={() => setInitialBoxData(!initialBoxData)}
              />
              <label htmlFor="initialsa" style={{marginLeft: '10px', fontSize: '14px'}}>
                {t("Save as Profile")} {initialsBox ? t('Initials') : t('Signature')}
              </label>
            </div>
          </Col>:null}
          {window.innerWidth > 781 ? (
            <Col sm="12">
              <div style={{display: 'flex', justifyContent: 'left', marginTop: '20px'}}>
              <CustomButton
               padding={true}
size="sm"
type="submit"
color="primary"
block
disabled={loader}
onClick={handleSaveImage}
style={{maxWidth: '20%', marginBlock: '2%', boxShadow: 'none'}}
text={<>
{loader ? <Spinner color="white" size="sm" /> : null}
<span style={{fontSize: '16px'}} className="align-middle ms-25">
{' '}
{t("Done")}
</span>
</>}
/>
              
              </div>
            </Col>
          ) : null}
          {signatureChooseImage ? (
            <></>
          ) : (
            <Col xs={12}>
              <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
              <h5 style={{lineHeight:1.5}}>
                {t("By selecting")} {initialsBox ? t('Inital') : t('Signature')} ,{t("I agree that the")}{' '}
                {initialsBox ? t('inital') : t('signature')} {t("will be the electronic representation of my")}{' '}
                {initialsBox ? t('inital') : t('signature')}
                {t("for all purposes when I use them on documents, including legally binding contracts.")}
              </h5>
              </div>
            </Col>
          )}
          {window.innerWidth < 781 ? (
            <Col
              sm="12"
              style={{
                display: 'flex',
                justifyContent: 'right',
              }}>
              <Button size="sm" color="primary" style={{boxShadow: 'none', fontSize: '16px'}} onClick={handleSaveImage}>
                {loader ? <Spinner color="light" size="sm" /> : null}
                <span className="align-middle ms-25">{t("Done")}</span>
              </Button>{' '}
            </Col>
          ) : null}
        </Row>
      </div>
      <ImageCropperModal cropSrc={imageSrc} isOpen={modal} toggle={toggle} onImageCropped={handleImageCropped} />
    </>
  );
};

export default ImagePicker;
