import React, {useState, useEffect} from 'react';
import {TabContent, TabPane,  Col, Row, Card, Label, Button} from 'reactstrap';

import {PenTool, X, Image, Type, User, Trash2, Plus} from 'react-feather';
import emptyImage from '@assets/images/pages/empty.png';
import ModalConfirmationAlert from '../../components/ModalConfirmationAlert';
// import getActivityLogUser from '../../IpLocation/MaintainActivityLogUser';
import toastAlert from '@components/toastAlert';
import DrawCanvas from './ElectronicSignature.js/DrawCanvas';
import ImagePicker from './ElectronicSignature.js/ImagePicker';
import TypeText from './ElectronicSignature.js/TypeText';
import { BASE_URL , post, postFormData} from '../../apis/api';
import getActivityLogUser from '../IpLocation/MaintainActivityLogUser';
import { selectPrimaryColor } from '../../redux/navbar';
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';

const SignatureModalContentProfile = ({
  user_id_user,
  user_email,
  user_first_name,
  user_last_name,
  initialsBox,
  profile,
  returnedSignature,
  modalClose,
}) => {
  // Tabs
  const [active, setActive] = useState(profile ? 1 : 4);
  const primary_color = useSelector(selectPrimaryColor);
  const { t } = useTranslation();

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  // Signature
  const [signature, setSignature] = useState(null);
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [loadingDeleteFile, setLoadingDeleteFile] = useState(false);
  const DeleteSignature = async () => {
    setLoadingDeleteFile(true);
   
    //console.log(items?.token?.user_id);
    const postData = {
      user_id: user_id_user,
      user_signature_id: DeleteSignatureId,
    };
    try {
      const apiData = await post('user/DeleteSignature', postData); // Specify the endpoint you want to call
      //console.log('DELETE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert('error', apiData.message);
        // setFilesArray([])
      } else {
     
        const user_id = user_id_user;
        const email = user_email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: 'DELETED-PROFILE-SIGNATURE',
          description: `${email} deleted profile signature`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        toastAlert('succes', apiData.message);
        console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmation(false);
        setLoadingDeleteFile(false);
        // getUserPrevSignatures();
        // getUserPrevInitials();
        handlegetUserImage('profile');
        handlegetUserImageInitials();
      }
    } catch (error) {
      toastAlert('error', "Something went wrong. Please try again later");
      setItemDeleteConfirmation(false);
      setLoadingDeleteFile(false);
      //console.log('Error fetching data:', error);
    }
  };
  const DeleteSignature1 = async () => {
    setLoadingDeleteFile(true);
    //console.log(DeleteSignatureId);
  
    //console.log(items?.token?.user_id);
    const postData = {
      user_id: user_id_user,
      user_signature_id: DeleteSignatureId,
    };
    try {
      const apiData = await post('user/DeleteSignature', postData); // Specify the endpoint you want to call
      //console.log('DELETE File BY File-ID ');

      //console.log(apiData);
      if (apiData.error === true || apiData.error === undefined) {
        toastAlert('error', apiData.message);
        // setFilesArray([])
      } else {
        const user_id = user_id_user;
        const email = user_email;

        let response_log = await getActivityLogUser({
          user_id: user_id,
          event: 'DELETED-PROFILE-SIGNATURE',
          description: `${email} deleted profile initials`,
        });
        if (response_log === true) {
          //console.log('MAINTAIN LOG SUCCESS');
        } else {
          //console.log('MAINTAIN ERROR LOG');
        }
        toastAlert('succes', apiData.message);
        //console.log(apiData.result);
        // setFilesArray(apiData.result)
        setItemDeleteConfirmation1(false);
        setLoadingDeleteFile(false);
        handlegetUserImage('profile');
        handlegetUserImageInitials();
        // refreshPrev();
      }
    } catch (error) {
      toastAlert('error', "Something went wrong. Please try again later");
      setItemDeleteConfirmation1(false);
      setLoadingDeleteFile(false);
      //console.log('Error fetching data:', error);
    }
  };
  const [image, setImage] = useState(null);
  const [DeleteSignatureId, setDeleteSignatureId] = useState('');
  const [itemDeleteConfirmation1, setItemDeleteConfirmation1] = useState(false);


  // Function to convert base64 to File object
  function base64toFile(base64URL, filename) {
    // Split the base64 data from the URL
    const splitDataURL = base64URL.split(',');

    // Get the content type of the image (e.g., "image/png")
    const contentType = splitDataURL[0].split(':')[1].split(';')[0];

    // Decode the base64 data
    const byteCharacters = atob(splitDataURL[1]);

    // Create a typed array to hold the binary data
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    // Create a Blob from the binary data
    const blob = new Blob(byteArrays, {type: contentType});

    // Create a File object from the Blob
    const file = new File([blob], filename, {type: contentType});

    return file;
  }
  const handleSaveSignature = async (linesImg, sign,initialBoxData) => {
   
    if (sign === 'prevSign') {
      returnedSignature(linesImg, 'prevSign', 'signature');
    } else {
      setSignature(linesImg);

      const filename = 'image.png';
      const fileObject = base64toFile(linesImg, filename);

      // call api to upload image
      const postData = {
        image: fileObject,
        user_id:user_id_user
      };
      const apiData = await postFormData(postData); // Specify the endpoint you want to call
      if (apiData.public_url === null || apiData.public_url === undefined || apiData.public_url === '') {
        toastAlert('error', 'Error uploading Files');
      } else {
        const ImageUrl = apiData.public_url;
        returnedSignature(ImageUrl, null, 'signature');
      }
    }
  };

  const handleSelectImage = async (selectedImage, prevSign) => {
    if (prevSign === 'prevSign') {
      returnedSignature(selectedImage, 'prevSign', 'image');
    } else {
      setImage(selectedImage);
      // const filename = 'image.png';
      // const fileObject = base64toFile(selectedImage, filename);
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const croppedFile = new File([blob], 'cropped.png', {type: blob.type});
      console.log('Cropped File Object:', croppedFile);
      // call api to upload image
      const postData = {
        image: croppedFile,
        user_id:user_id_user
      };
      const apiData = await postFormData(postData); // Specify the endpoint you want to call
      // //console.log(apiData)
      if (apiData.public_url === null || apiData.public_url === undefined || apiData.public_url === '') {
        toastAlert('error', 'Error uploading Files');
      } else {
        const ImageUrl = apiData.public_url;
        returnedSignature(ImageUrl, null, 'image');
      }
    }
  };

  const handleTypeText = async (image, prevSign) => {
    if (prevSign === 'prevSign') {
      returnedSignature(image, 'prevSign', 'text');
    } else {
      const filename = 'image.png';
      const fileObject = base64toFile(image, filename);
      // call api to upload image
      const postData = {
        image: fileObject,
        user_id:user_id_user
      };
      const apiData = await postFormData(postData); // Specify the endpoint you want to call
      if (apiData.public_url === null || apiData.public_url === undefined || apiData.public_url === '') {
        toastAlert('error', 'Error uploading Files');
      } else {
        const ImageUrl = apiData.public_url;
        returnedSignature(ImageUrl, null, 'text');
      }
    }
  };

  const [PrevSignatureArray, setPrevSignatureArray] = useState([]); // State to hold the generated image
  const [PrevSignatureArrayImage, setPrevSignatureArrayImage] = useState([]); // State to hold the generated image
  const [PrevSignatureArrayImageInitial, setPrevSignatureArrayImageInitial] = useState([]); // State to hold the generated image

  const handlegetUserImageSignatures = async type => {
    //console.log('imageDataURL');

    const user_id = user_id_user;
    //console.log(user_id);

    const postData = {
      user_id: user_id,
      // type: type
    };
    const apiData = await post('user/GetUserSignaturesToDb', postData); // Specify the endpoint you want to call

    if (apiData.error == true || apiData.error === 'true') {
      setPrevSignatureArray([]);
    } else {
      setPrevSignatureArray(apiData.data);
    }
  };
  const [loadingData,setLoadingData]=useState(false)
  const handlegetUserImage = async type => {
    setLoadingData(true)

    const user_id =user_id_user;

    const postData = {
      user_id: user_id,
      type: type,
    };
    const apiData = await post('user/GetUserSignaturesToDb', postData); // Specify the endpoint you want to call
    if (apiData.error == true || apiData.error === 'true') {
      setPrevSignatureArrayImage([]);
      setLoadingData(false)
    } else {
      setLoadingData(false)
      setPrevSignatureArrayImage(apiData.data);
    }
  };
  const handlegetUserImageInitials = async () => {
    setLoadingData(true)

    const user_id = user_id_user;

    const postData = {
      user_id: user_id,
      type: 'profile_initils',
    };
    const apiData = await post('user/GetUserSignaturesToDb', postData); // Specify the endpoint you want to call
    if (apiData.error == true || apiData.error === 'true') {
      setPrevSignatureArrayImageInitial([]);
      setLoadingData(false)

    } else {
      setPrevSignatureArrayImageInitial(apiData.data);
      setLoadingData(false)

    }
  };

  useEffect(() => {
    if (profile) {
      if (PrevSignatureArrayImage.length === 0) {
        setActive(1);
      } else {
        setActive(4);
      }
    } else {
      if (PrevSignatureArrayImage.length === 0) {
        setActive(1);
      } else {
        setActive(4);
      }
    }

    handlegetUserImage('profile');
    handlegetUserImageInitials();
  }, []);
  const [SaveAsProfile, setSaveAsProfile] = useState(false);
  const styleText = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    alignContent: 'center',
    paddingInline: '2%',
    cursor: 'pointer',
    width: window.innerWidth < 736 ? '100%' : '85%',
    paddingBlock: 3,
    borderRadius: '5px',
    marginTop: '2%',
    alignSelf: 'center',
  };
  const styleh2 = {
    fontSize: '13px',
    fontWeight: 300,
    marginTop: '10px',
    marginLeft: '15px',
  };
  const sideBarItems = [
    {
      name: t('Draw'),
      icon: (
        <PenTool
          style={{
            marginLeft: '15px',
          }}
          size={15}
        />
      ),
    },
    {
      name: t('Image'),
      icon: (
        <Image
          style={{
            marginLeft: '15px',
          }}
          size={15}
        />
      ),
    },
    {
      name: t('Type'),
      icon: (
        <Type
          style={{
            marginLeft: '15px',
          }}
          size={15}
        />
      ),
    },
  ];

  return (
    <>
      {window.innerWidth > 768 ? (
        <Row>
          <Col sm="12">
            <div
              style={{
                display: ' flex',
                justifyContent: 'space-between',
                marginBottom: '1%',
                paddingTop: '1%',
              }}>
              {/* {signatureChooseImage ? (
                <h1 className="mb-1 fw-bold">Add Image</h1>
              ) : (
                <> */}
                  {initialsBox ? (
                    <h1 className="mb-1 fw-bold">{t("Add Initials")}</h1>
                  ) : (
                    <h1 className="mb-1 fw-bold">{t("Add Signature")}</h1>
                  )}
                {/* </>
              )} */}
              <X size={24} onClick={modalClose} style={{cursor: 'pointer'}} />
            </div>{' '}
          </Col>
          <Col sm="4">
            {profile ? null : (
              <>
                {initialsBox ? (
                  <div
                    onClick={() => {
                      toggle(5);
                    }}
                    style={{
                      ...styleText,
                      border: active === 5 ? `1px solid ${primary_color}` : '1px solid #e0e0e0',
                    }}>
                    <User
                      size={15}
                      style={{
                        marginLeft: '15px',
                      }}
                    />
                    <h2 style={styleh2}>{t("Profile Initials")}</h2>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      toggle(4);
                    }}
                    style={{
                      ...styleText,
                      border: active === 4 ? `1px solid ${primary_color}` : '1px solid #e0e0e0',
                    }}>
                    <User
                      size={15}
                      style={{
                        marginLeft: '15px',
                      }}
                    />
                    <h2 style={styleh2}>{t("Profile Signatures")}</h2>
                  </div>
                )}
              </>
            )}
            {sideBarItems.map((item, i) => (
              <>
                <div
                  onClick={() => {
                    toggle(i + 1);
                    //console.log(i + 1);
                  }}
                  style={{
                    ...styleText,
                    border: active === i + 1 ? `1px solid ${primary_color}` : '1px solid #e0e0e0',
                  }}>
                  {item.icon}

                  <h2 style={styleh2}>{item.name}</h2>
                </div>
              </>
            ))}
          </Col>
          <Col sm={8}>
          {/* {PrevSignatureArrayImage.length}
          {PrevSignatureArrayImageInitial.length} */}
            <TabContent className="py-50" activeTab={active}>
              <TabPane tabId={1}>
                <DrawCanvas
                user_id_user={user_id_user}
                user_email={user_email}
                lengthPrevsign={PrevSignatureArrayImage.length}
                lengthPrevInitial={PrevSignatureArrayImageInitial.length}
                                        SaveAsProfile={SaveAsProfile}

                  initialsBox={initialsBox}
                  profile={profile}
                  refreshPrev={handlegetUserImageSignatures}
                  saveSignature={handleSaveSignature}
                  modalClose={modalClose}
                />
              </TabPane>
              <TabPane tabId={2}>
                <ImagePicker  user_id_user={user_id_user}
                user_email={user_email}  lengthPrevsign={PrevSignatureArrayImage.length}
                lengthPrevInitial={PrevSignatureArrayImageInitial.length} initialsBox={initialsBox} profile={profile} onSelectImage={handleSelectImage} modalClose={modalClose} />
              </TabPane>
              <TabPane tabId={3}>
                <TypeText  user_first_name={user_first_name} user_id_user={user_id_user}
                user_email={user_email} user_last_name={user_last_name} lengthPrevsign={PrevSignatureArrayImage.length}
                lengthPrevInitial={PrevSignatureArrayImageInitial.length} initialsBox={initialsBox}  profile={profile} onSaveText={handleTypeText} />
              </TabPane>
              {profile ? null : (
                <>
                  {initialsBox ? (
                    <TabPane tabId={5}>
                 
<Row style={{height: '250px', overflowY: 'auto',display:"flex"}}>
   
                        {PrevSignatureArrayImageInitial.length === 0 ? (
                          <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                            <Col md="12" xs="12" className="d-flex justify-content-center align-items-center">
                              <img src={emptyImage} alt="empty" style={{width: '100px', height: 'auto'}} />
                              <Label className="form-label" style={{fontSize: '14px'}}>
                                No Initials Exist
                              </Label>
                            </Col>
                          </Row>
                        ) : (
                          <>
                            {PrevSignatureArrayImageInitial.map((item, index) => (
                              <>
                                <Col sm="3" key={index}>
                                  <div
                                    style={{
                                      position: 'relative',
                                      height: 'auto',
                                      width: '100%',
                                      backgroundColor: '#f0f0f0',
                                      border: '1px solid lightGrey',
                                      cursor: 'pointer',
                                      marginBottom: '10px',
                                    }}>
                                    <img
                                      width="100%"
                                      height="100px"
                                      style={{objectFit:"contain"}}
                                      src={`${BASE_URL}${item?.signature_image_url}`}
                                      alt="Card image cap"
                                      onClick={() => handleSaveSignature(item?.signature_image_url, 'prevSign')}
                                    />
                                     <Trash2
                                                size={15}
                                                color="red"
                                                onClick={() => {
                                                  setDeleteSignatureId(item.user_signature_id);
                                                  setItemDeleteConfirmation1(true);
                                                }}
                                                style={{
                                                  cursor: 'pointer',
                                                  position: 'absolute',
                                                  top: 5,
                                                  right: 5,
                                                }}
                                              />
                                  </div>
                                </Col>
                              </>
                            ))}
                          </>
                        )}
                     </Row>
                     <Row >
                       
                       {/* make button 
                        */}
                        {/* <Col xs={12} style={{display:"flex",justifyContent:"right"}}> 
                        <Button
                                       // disabled={loader}
                                       size="sm"
                                       color="primary"
                                       style={{boxShadow: 'none', fontSize: '16px',marginBottom:"10px"}}
                                       onClick={()=>{
                                        setActive(1)
                                        setSaveAsProfile(true)
                                       }}
                                       >
                                       <span className="align-middle ms-25">Add</span>
                                     </Button>
                        </Col> */}
                       </Row>
                      {/* </Row> */}
                    </TabPane>
                  ) : (
                    <TabPane tabId={4}>
                      <Row style={{height: '250px', overflowY: 'auto'}}>
                        {PrevSignatureArrayImage.length === 0 ? (
                          <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                            <Col md="12" xs="12" className="d-flex justify-content-center align-items-center">
                              <img src={emptyImage} alt="empty" style={{width: '100px', height: 'auto'}} />
                              <Label className="form-label" style={{fontSize: '14px'}}>
                                No Signature Exist
                              </Label>
                            </Col>
                          </Row>
                        ) : (
                          <>
                            {PrevSignatureArrayImage.map((item, index) => (
                              <>
                                <Col sm="4" key={index}>
                                  <div
                                    style={{
                                      position: 'relative',
                                      height: 'auto',
                                      width: '100%',
                                      backgroundColor: '#f0f0f0',
                                      border: '1px solid lightGrey',
                                      cursor: 'pointer',
                                      marginBottom: '10px',
                                    }}>
                                    <img
                                      width="100%"
                                      height="100px"
                                      style={{objectFit:"contain"}}
                                      src={`${BASE_URL}${item?.signature_image_url}`}
                                      alt="Card image cap"
                                      onClick={() => handleSaveSignature(item?.signature_image_url, 'prevSign')}
                                    />
                                    <Trash2
                                      size={15}
                                      color="red"
                                      onClick={() => {
                                        setDeleteSignatureId(item.user_signature_id);
                                        setItemDeleteConfirmation(true);
                                      }}
                                      style={{
                                        cursor: 'pointer',
                                        position: 'absolute',
                                        top: 5,
                                        right: 5,
                                      }}
                                    />
                                  </div>
                                </Col>
                              </>
                            ))}
                          </>
                        )}
                      </Row>
                    </TabPane>
                  )}
                </>
              )}
            </TabContent>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col sm="12">
            <div
              style={{
                display: ' flex',
              
                justifyContent: 'space-between',
                marginBottom: '1%',
                paddingTop: '1%',
              }}>
              {/* {signatureChooseImage ? (
                <h1 className="mb-1 fw-bold">Add Image</h1>
              ) : (
                <> */}
                  {initialsBox ? (
                    <h1 className="mb-1 fw-bold">Add Initials</h1>
                  ) : (
                    <h1 className="mb-1 fw-bold">Add Signature</h1>
                  )}
                {/* </>
              )} */}
              <X size={24} onClick={modalClose} style={{cursor: 'pointer'}} />
            </div>{' '}
          </Col>
          <Col xs="12" md={4}>
            <Row>
              {profile ? null : (
                <Col xs={12} md={6}>
                  <div
                    onClick={() => {
                      toggle(4);
                    }}
                    style={{
                      ...styleText,
                      border: active === 4 ? `1px solid ${primary_color}` : '1px solid #e0e0e0',
                    }}>
                    <User
                      size={15}
                      style={{
                        marginLeft: '15px',
                      }}
                    />
                    <h2 style={styleh2}>Profile Signatures</h2>
                  </div>
                </Col>
              )}

              {sideBarItems.map((item, i) => (
                <>
                  <Col xs={12} md={6}>
                    <div
                      onClick={() => {
                        toggle(i + 1);
                        //console.log(i + 1);
                      }}
                      style={{
                        // width:"50%",
                        ...styleText,
                        border: active === i + 1 ? `1px solid ${primary_color}` : '1px solid #e0e0e0',
                      }}>
                      {item.icon}

                      <h2 style={styleh2}>{item.name}</h2>
                    </div>
                  </Col>
                </>
              ))}
            </Row>
          </Col>
          <Col sm={12} md={8} style={{marginTop: '10px'}}>
            <TabContent className="py-50" activeTab={active}>
              <TabPane tabId={1}>
                <DrawCanvas
                  initialsBox={initialsBox}
                  profile={profile}
                  refreshPrev={handlegetUserImageSignatures}
                  saveSignature={handleSaveSignature}
                  modalClose={modalClose}
                />
              </TabPane>
              <TabPane tabId={2}>
                <ImagePicker initialsBox={initialsBox} onSelectImage={handleSelectImage} modalClose={modalClose} />
              </TabPane>
              <TabPane tabId={3}>
                <TypeText initialsBox={initialsBox} onSaveText={handleTypeText} />
              </TabPane>
              {profile ? null : (
                <TabPane tabId={4}>
                  <Row style={{height: '250px', overflowY: 'auto'}}>
                    {PrevSignatureArrayImage.length === 0 ? (
                      <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                        <Col md="12" xs="12" className="d-flex justify-content-center align-items-center">
                          <img src={emptyImage} alt="empty" style={{width: '150px', height: 'auto'}} />
                          <h3>No Signature Added </h3>
                        </Col>
                      </Row>
                    ) : (
                      <>
                        {PrevSignatureArrayImage.map((item, index) => (
                          <>
                            <Col sm="4" key={index}>
                              <div
                                style={{
                                  position: 'relative',
                                  height: 'auto',
                                  width: '100%',
                                  backgroundColor: '#f0f0f0',
                                  border: '1px solid lightGrey',
                                  cursor: 'pointer',
                                  marginBottom: '10px',
                                }}>
                                <img
                                  style={{width: '100%', height: '100px', objectFit: 'contain'}}
                                  src={`${BASE_URL}${item?.signature_image_url}`}
                                  alt="Card image cap"
                                  onClick={() => handleSaveSignature(item?.signature_image_url, 'prevSign')}
                                />
                                <Trash2
                                                    size={15}
                                                    color="red"
                                                    onClick={() => {
                                                      setDeleteSignatureId(item.user_signature_id);
                                                      setItemDeleteConfirmation(true);
                                                    }}
                                                    style={{
                                                      cursor: 'pointer',
                                                      position: 'absolute',
                                                      top: 5,
                                                      right: 5,
                                                    }}
                                                  />
                              </div>
                            </Col>
                          </>
                        ))}
                      </>
                    )}
                  </Row>
                </TabPane>
              )}
            </TabContent>
          </Col>
        </Row>
      )}
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDeleteFile}
        callBackFunc={DeleteSignature}
        alertStatusDelete={'delete'}
        text="Are you sure you want to delete this Signature?"
      />
       <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation1}
        toggleFunc={() => setItemDeleteConfirmation1(!itemDeleteConfirmation1)}
        loader={loadingDeleteFile}
        callBackFunc={DeleteSignature1}
        alertStatusDelete={'delete'}
        text="Are you sure you want to delete this Initials?"
      />
      {/* Tabs  */}
      {/* {initialsBox===null||initialsBox===undefined?<> */}
    </>
  );
};

export default SignatureModalContentProfile;
