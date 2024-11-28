// ** React Imports
import {Fragment, useEffect, useState} from 'react';
import americanExpress from '../../assets/images/pages/3.png';
import visaImage from '../../assets/images/pages/4.png';

import masterCard from '../../assets/images/pages/1.png';
import discover from '../../assets/images/pages/5.png';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import other from '../../assets/images/pages/2.png';
import emptyImage from '@assets/images/pages/empty.png';
import visa1Image from '../../assets/images/pages/req.png';
// ** Custom Components
import cvcImage from '../../assets/images/pages/cvc.png';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
  CardElement,
  ExpressCheckoutElement,
  LinkAuthenticationElement,
} from '@stripe/react-stripe-js';
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Form,
  Modal,
  Badge,
  Label,
  Input,
  Button,
  CardBody,
  CardTitle,
  ModalBody,
  CardHeader,
  InputGroup,
  ModalHeader,
  FormFeedback,
  InputGroupText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from 'reactstrap';

// ** Third Party Components
import { useTranslation } from 'react-i18next';

import {Check, MoreVertical, Plus, Trash2, X} from 'react-feather';
import {useForm, Controller} from 'react-hook-form';

// ** Card Images
import toastAlert from '@components/toastAlert';

import {PrimaryKey, post} from '../../apis/api';
import ModalConfirmationAlert from '../ModalConfirmationAlert';
import CustomButton from '../ButtonCustom';

const CARD_OPTIONS_No = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "black",
      fontWeight: 400,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "lightGrey" },
      "::placeholder": { color: "lightGrey" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "black",
    },
  },
};

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      width: '100%',
      iconColor: '#c4f0ff',
      color: 'black',
      fontWeight: 400,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {color: 'lightGrey'},
      '::placeholder': {color: 'lightGrey'},
    },
    invalid: {
      iconColor: '#ffc7ee',
      color: 'black',
    },
  },
};

const PaymentMethods = ({stripe_customer_id, userCards, recallCards}) => {
  // ** States
const customStyle={
  width: '60px', height: 'auto',border:"1px solid lightGrey",borderRadius:"3px",padding:"2px"
}
const [cardNumberError, setCardNumberError] = useState(null);
const [cardExpiryError, setCardExpiryError] = useState(null);
const [cardCvcError, setCardCvcError] = useState(null);
  const [loadingStripe, setloadingStripe] = useState(false);
  const stripe = useStripe();
  const { t } = useTranslation();

  const elements = useElements();
  const handleSubmit = async () => {
   
    setloadingStripe(true);
    const cardNumberElement = elements.getElement(CardNumberElement);
    setCardNumberError(null);
    setCardExpiryError(null);
    setCardCvcError(null);
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumberElement,
      // card: elements.getElement(CardCvcElement, CardExpiryElement, CardNumberElement),
    });

    if (error) {
      if (error.code === "incomplete_number") {
        setCardNumberError(error.message);
      } else if (
        error.code === "incomplete_expiry" ||
        error.param === "exp_year"
      ) {
        setCardExpiryError(error.message);
      } else if (error.code === "incomplete_cvc") {
        setCardCvcError(error.message);
      }
      //console.log('error.message');
      setloadingStripe(false);

      toastAlert('error', error.message);
    } else {
      try {
        console.log(paymentMethod.id)
        const id = paymentMethod.id;
        const items = JSON.parse(localStorage.getItem('@UserLoginRS'));
        //console.log(paymentMethod.id);
        const postData = {
          paymentMethodId: id,
          customeremail: items?.token?.email,
          
        };
        const response = await post('add-customer-card-stripe', postData);

        //console.log(response);
        if (response.error) {
          toastAlert('error', response.message);
          setloadingStripe(false);
        } else {
          setloadingStripe(false);
          // get user local storage
          console.log(response)
          setShow(!show);
          toastAlert('success', 'Card added successfully');
          //console.log("response")
          recallCards();

          // localStorage.setItem('@UserLoginRS', JSON.stringify({token: response.userData}));
          // SuccessData(true);
        }
      } catch (error) {
        console.log(error)
        //console.log('Error', error);
        setloadingStripe(false);
      }
    }
    // }
  };
  const [show, setShow] = useState(false);
  const [cardType, setCardType] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalCardType, setModalCardType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [itemDeleteConfirmation, setItemDeleteConfirmation] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const DeleteFolder = async () => {
    setLoadingDelete(true);
    const postData = {
      paymentMethodId: DetachId,
    };
    const response = await post('detach-payment-method', postData);

    //console.log(response);
    if (response.error === true) {
      setLoadingDelete(false);
      toastAlert('error', 'An error occured while deleting card');
    } else {
      setItemDeleteConfirmation(false);
      setLoadingDelete(false);
      recallCards();
      toastAlert('success', 'Card deleted successfully');
    }
  };
  const selectedCondition = selected !== null;

  const [cards, setCards] = useState([]);
  const [billingInfo, setBillingInfo] = useState(null);
  const [loaderCards, setLoaderCards] = useState(true);
  const [CustomerStripeId, setCustomerStripeId] = useState(null);
  const [DetachId, setDetachId] = useState(null);

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom" >
          <CardTitle tag="h4"><h3 style={{fontWeight:600}}>{t("Manage Your Cards")}</h3></CardTitle>
          <CustomButton
                  // padding={true}
                  useDefaultColor={true}
                  size="sm"
                  // disabled={saveLoading}
                  color="primary"
                  // disabled={downloadLoader}
                  onClick={async () => {
                    setShow(true);
                  }}
                  style={{
                    display: "flex",
                    boxShadow: "none",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="btn-icon d-flex"
                  text={
                    <>
                      {/* {downloadLoader ? <Spinner color="white" size="sm" /> : null} */}
                      {' '}
                  <Plus id="RestoreAll" size={15} style={{cursor: 'pointer', margiRight: '10px',fontSize:"16px"}} />
                  <span className="align-middle ms-25" >Card </span>
                    </>
                  }
                />
        </CardHeader>
        <CardBody className="my-1 py-25">
          <Row className="gx-4">
            <Col xs={12} md={12}></Col>
            <Col lg="12" className="mt-2 mt-lg-0">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                {' '}
                <h2></h2>
              
              
              </div>
              <div className="added-cards">
                <Row>
                  {userCards?.length === 0 ? (
                    <Row className="match-height mb-2 mt-2 d-flex justify-content-center align-items-center">
                    <Col md="12" xs="12" className="d-flex justify-content-center align-items-center">
                      <img src={emptyImage} alt="empty" style={{width: '200px', height: 'auto'}} />
                      <h3>{t("No Cards Exist")}</h3>
                    </Col>
                  </Row>
                  ):null}
                  {userCards?.map((card, index) => (
                    <>
                      {' '}
                      <Col lg="4" className="mt-2 mt-lg-0">
                        {' '}
                             
                              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', border:"1px solid lightGrey",padding:"6px"}}>
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              fontWeight: 500,
                              justifyContent: 'left',
                              alignItems: 'center',
                              cursor: 'pointer',
                            }}>
                            {/* <p> {card.card.brand === 'visa' ? <img src={visaImage} /> : null}</p> */}
                            {card.card.brand === 'visa' ? (
                              <img src={visaImage} style={customStyle} />
                            ) : card.card.brand === 'mastercard' ? (
                              <img src={masterCard} style={customStyle} />
                            ) : card.card.brand === 'amex' ? (
                              <img src={americanExpress} style={customStyle} />
                            ) : card.card.brand === 'discover' ? (
                              <img src={discover} style={customStyle} />
                            ) : (
                              <img src={other} style={customStyle} />
                            )}
                            <h3 style={{fontWeight: 700, fontSize: '16px', marginLeft: '20px', wordSpacing: '2px',color:"black"}}>
                              .... {card.card.last4}
                            </h3>
                          </div>
                          <div>
                          <Trash2  onClick={() => {
                                    setItemDeleteConfirmation(true);
                                    setDetachId(card.id);
                                  }} size={16} className="me-75" style={{color: 'red',cursor:"pointer"}} />
                            {/* <UncontrolledDropdown className="dropdown-user nav-item">
                              <DropdownToggle href="/" tag="a" onClick={e => e.preventDefault()}>
                                <MoreVertical size={20} style={{cursor: 'pointer'}} />
                              </DropdownToggle>
                              <DropdownMenu end>
                                <DropdownItem
                                  onClick={() => {
                                    setItemDeleteConfirmation(true);
                                    setDetachId(card.id);
                                  }}
                                  className="d-flex w-100">
                                  <Trash2 size={14} className="me-75" style={{color: 'red'}} />
                                  <h3 className="align-middle">{t("Delete")}</h3>
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown> */}
                          </div>
                        </div>
                        <hr />
                      </Col>
                    </>
                  ))}
                </Row>
                {/* {cardsAdd ? null : (
              <>
                <hr />

                <div
                  style={{display: 'flex', cursor: 'pointer', marginBlock: '10px'}}
                  onClick={() => {
                    setCardsAdd(true);
                    setPaymentmMethodIdPrev(null);
                  }}>
                  <Plus size={20} style={{cursor: 'pointer'}} />
                  <h2 style={{fontWeight: 600, marginLeft: '10px'}}>Add Payment method</h2>
                </div>
              </>
            )} */}
                {/* {userCards.map((card, index) => {
                  const isLastCard = index === data[data.length - 1];
                  return (
                    <div
                      key={index}
                      className={classnames('cardMaster rounded border p-2', {
                        'mb-1': !isLastCard,
                      })}>
                      <div className="d-flex justify-content-between flex-sm-row flex-column">
                        <div className="card-information">
                          <div className="d-flex align-items-center mb-50">
                            <h6 className="mb-0">{card?.card?.brand}</h6>
                            {index === 0 && (
                              <Badge color="light-primary" className="ms-50">
                                Primary
                              </Badge>
                            )}
                          </div>
                          <span className="card-number ">**** **** **** {card?.card?.last4}</span>
                        </div>
                        <div className="d-flex flex-column text-start text-lg-end">
                          <div className="d-flex order-sm-0 order-1 mt-1 mt-sm-0">
                            <Button outline color="primary" className="me-75" onClick={() => openEditModal(card)}>
                              Edit
                            </Button>
                            <Button outline>Delete</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })} */}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Modal
        isOpen={show}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered"
        onClosed={() => setModalCardType('')}>
        {/* <ModalHeader className="bg-transparent" toggle={() => setShow(!show)}></ModalHeader> */}
        <ModalBody  className="px-sm-5 mx-20 pb-2 pt-2">
          <h2 className="text-center mb-1">
            {/* {selectedCondition ? 'Edit' : 'Add New'}  */}
            {t("Add New Card")}</h2>
          <h3 className="text-center">
{t("Add card for future billing")}
          </h3>
          <fieldset className="FormGroup">
            {/* Card Number */}
            <Label className="form-label" for="register-password">
            {t("Card Number")}
            </Label>

            <div className="FormRow d-flex align-items-center">
                          {/* Card Logos */}

                          {/* Stripe Card Input */}
                          <CardNumberElement options={CARD_OPTIONS_No} />
                          <div className="card-logos mr-2 d-flex">
                            <img
                              src={visa1Image}
                              alt="Visa"
                              width="150px"
                              className="mr-2"
                            />
                          </div>
                        </div>
                        {cardNumberError && (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {cardNumberError}
                          </div>
                        )}
          </fieldset>
          <Row>
            <Col xs={8} md={8}>
              <fieldset className="FormGroup">
                <Label className="form-label" for="register-password">
                  {t("Card Expiry")}
                </Label>
                <div className="FormRow">
                  <CardExpiryElement options={CARD_OPTIONS} />
                </div>
                {cardExpiryError && (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {cardExpiryError}
                          </div>
                        )}
              </fieldset>
            </Col>
            <Col xs={4} md={4}>
              <fieldset className="FormGroup">
                <Label className="form-label" for="register-password">
                  {t("CVC")}
                </Label>

                <div className="FormRow position-relative">
                          {/* Stripe CVC Input */}
                          <CardCvcElement options={CARD_OPTIONS} />
                          {/* CVC Icon */}
                          <img
                            src={cvcImage}
                            alt="CVC Icon"
                            className="cvc-icon"
                            width="50"
                          />
                        </div>
                        {cardCvcError && (
                          <div
                            className="error-message"
                            style={{ color: "red" }}
                          >
                            {cardCvcError}
                          </div>
                        )}
              </fieldset>{' '}
            </Col>
            {/* <Col xs={12} md={12}>
            <img src={CardImages} style={{width:"200px",
            height:"50px"
            }} />
            </Col> */}
          </Row>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Button
              size="sm"
              style={{height: '40px', marginTop: '2%'}}
              // type="submit"
              onClick={handleSubmit}
              color="primary"
              disabled={loadingStripe}>
              {' '}
              {loadingStripe ? <Spinner color="light" size="sm" /> : null}
              <span className="align-middle ms-25"> {t("Save")}</span>
            </Button>
          </div>
        </ModalBody>
      </Modal>
      <ModalConfirmationAlert
        isOpen={itemDeleteConfirmation}
        toggleFunc={() => setItemDeleteConfirmation(!itemDeleteConfirmation)}
        loader={loadingDelete}
        callBackFunc={DeleteFolder}
        text="Deleting this card will prevent us from charging you. Continue?"
        alertStatusDelete={'delete'}
      />
    </Fragment>
  );
};

export default PaymentMethods;
