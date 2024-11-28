// ** Third Party Components
import classnames from 'classnames';
import {useState} from 'react';
import toastAlert from '@components/toastAlert';

// ** Reactstrap Imports
import {Row, Col, Card, CardBody, CardText, Badge, ListGroup, ListGroupItem, Button, Input, Spinner} from 'reactstrap';
import {Check, CheckCircle, X} from 'react-feather';
import ModalConfirmationProfile from '../components/ModalConfirmationProfile';

const PricingCards = ({
  data,
  duration,
  bordered,
  fullWidth,
  cols,
  fetchData,
  email,
  selectedPlan,
  SelectedAmount,
  SelectedDuration,
  SelectedCustIdStripe,
  onNext,
  selectedPlanType,
  notCompletedProfile,
  checkProfileCompleted,
}) => {
  const colsProps = cols ? cols : {md: 4, xs: 12};
  const benefits = [
    {key: 'document_to_sign', label: 'Documents to Sign'},
    {key: 'unlimited_sending', label: 'Unlimited Sending'},
    {key: 'bulk_link', label: 'Public Form'},
    {key: 'template', label: 'Template'},
    {key: 'no_of_users', label: 'No of Users'},
    {key: 'branding', label: 'Branding'},
    {key: 'subdomain', label: 'Subdomain'},
    {key: 'custom_hosting', label: 'Custom Hosting'},
  ];
  const [completeProfileD, setCompleteProfileD] = useState(false);

  const renderPricingCards = () => {
    return data.map((item, index) => {
      const monthlyPrice = duration === 'yearly' ? item.yearly_price : item.monthly_price,
        YearlyPrice = duration === 'yearly' ? item.monthly_price : item.yearly_price,
        yearlyPrice = duration === 'yearly' ? item.yearly_price : item.monthly_price,
        imgClasses = item.name === 'Pro' ? 'mb-2 mt-5' : item.name === 'Biz' ? 'mb-1' : 'mb-2';

      return (
        <>
          <Col key={index} {...colsProps}>
            {/* {selectedPlan}=
          {item.pricing_id}=
          {SelectedDuration} */}
            <Card
              className={classnames('text-left', {
                border: '1px solid lightGrey',
                marginTop: '1%',
                'shadow-none': bordered,
                popular: item.popular === true,
                'border-primary': parseInt(selectedPlan) === parseInt(item.pricing_id) && SelectedDuration === duration,
                // parseInt(selectedPlan) === parseInt(item.pricing_id) && (SelectedDuration === duration) === true,
                [`${
                  item.name
                  // .toLowerCase()
                }-pricing`]: item.name,
              })}>
              <CardBody>
                {item.popular === true ? (
                  <div className="pricing-badge text-end">
                    <Badge color="light-primary" pill>
                      Popular
                    </Badge>
                  </div>
                ) : null}
                {/* <img className={imgClasses} src={item.img} alt="pricing svg" /> */}
                <CardText style={{fontWeight: 500, color: 'black', marginLeft: '20px', marginTop: '15px'}}>
                  {item.name}
                </CardText>
                <div className="annual-plan" style={{marginLeft: '20px'}}>
                  <div className="plan-price mt-1">
                    {/* <sup className="font-medium-1 fw-bold text-primary me-25">$</sup>  */}
                    <span
                      style={{fontSize: '17px'}}
                      className={`pricing-${
                        item.name
                        // .toLowerCase()
                      }-value fw-bolder`}>
                      ${monthlyPrice}
                      {item.type === 'FREE' ? null : (
                        <>{duration === 'yearly' ? <span> /year</span> : <span> /month</span>}</>
                      )}
                    </span>
                  </div>
                </div>
                {item.type === 'FREE' || duration === 'yearly' ? (
                  <div style={{height: '25px'}}></div>
                ) : (
                  <div>{duration === 'yearly' ? <span></span> : <h3> ${YearlyPrice} billed yearly</h3>}</div>
                )}

                <ListGroup tag="ul" className=" text-start text-start mb-2 bg-white">
                  {benefits.map((benefit, i) => {
                    let content = null;

                    if (benefit.key === 'document_to_sign') {
                      content =
                        item[benefit.key] === 'unlimited'
                          ? 'Unlimited Documents to Sign'
                          : `${item[benefit.key]} Documents to Sign`;
                    } else if (benefit.key === 'unlimited_sending' && item[benefit.key]) {
                      content = 'Unlimited Sending';
                    } else if (benefit.key === 'unlimited_sending' && item[benefit.key]===false) {
                      content = 'No Unlimited Sending';
                    } else if (benefit.key === 'bulk_link' && item[benefit.key] === 'unlimited') {
                      content = 'Public Form';
                    } else if (benefit.key === 'bulk_link' && item[benefit.key] === 'yes') {
                      content = 'No Public Form';
                    } else if (benefit.key === 'template' && item[benefit.key] === 'unlimited') {
                      content = 'Template';
                    } else if (benefit.key === 'template' && item[benefit.key] === 'yes') {
                      content = 'No Template';
                    } else if (benefit.key === 'no_of_users') {
                      content = item[benefit.key] === 'unlimited' ? 'Unlimited Users' : `${item[benefit.key]} Users`;
                    } else if (benefit.key === 'branding' && item[benefit.key] === 'yes') {
                      content = 'Branding';
                    } else if (benefit.key === 'branding' && item[benefit.key] === 'no') {
                      content = 'No Branding';
                    } else if (benefit.key === 'subdomain' && item[benefit.key] === 'no') {
                      content = 'No Subdomain';
                    } else if (benefit.key === 'subdomain' && item[benefit.key] === 'yes') {
                      content = 'Subdomain';
                    } else if (benefit.key === 'custom_hosting' && item[benefit.key] === 'yes') {
                      content = 'Custom Hosting(coming soon)';
                    } else if (benefit.key === 'custom_hosting' && item[benefit.key] === 'no') {
                      content = 'No Custom Hosting';
                    }

                    return content ? (
                      <ListGroupItem
                        key={i}
                        tag="li"
                        style={{
                          backgroundColor: 'white',
                          fontSize: '14px',
                          fontWeight: 400,
                          border: 'none',
                        }}>
                        {!content.includes('No') ? <CheckCircle size={15} /> : <X size={15} />}{' '}
                        {/* render the check icon or 'X' icon based on the content */}
                        {content}
                      </ListGroupItem>
                    ) : null;
                  })}
                </ListGroup>

                {/* {selectedPlan}
             {item.pricing_id} */}
                <div style={{display: 'flex', justifyContent: 'center'}}>
                  {/* {parseInt(selectedPlan) === parseInt(item.pricing_id) && SelectedDuration === duration ? ( */}
                  {parseInt(selectedPlan) === parseInt(item.pricing_id) && SelectedDuration === duration ? (
                    <Button
                      // block
                      size="md"
                      color={'success'}
                      style={{
                        fontSize: '18px',
                        fontWeight: 700,
                      }}>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      // block
                      size="md"
                      color={'primary'}
                      style={{
                        fontSize: '18px',
                        fontWeight: 700,
                      }}
                      onClick={() => {
                        // setCompleteProfileD(true);
                        // if (notCompletedProfile === true) {
                        //   setCompleteProfileD(true);
                        // } else {
                        //   if (item.type === 'FREE') {
                        //     //console.log('FREE');
                        //     toastAlert('error', 'Working on downgrade section !');
                        //     // Modal confirmation
                        //   } else {
                            localStorage.setItem(
                              '@selectedprice',
                              JSON.stringify({
                                priceId: item,
                                duration: duration,
                                email: email,
                                customer_id_stripe: SelectedCustIdStripe,
                              }),
                            );
                            // window.location.href = '/stripe_checkout';
                            onNext();
                        //   }
                        // }
                      }}>
                      Choose Plan
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </>
      );
    });
  };

  const defaultCols = {
    sm: {offset: 2, size: 10},
    lg: {offset: 2, size: 10},
  };

  return (
    <Row className="pricing-card">
      <Col {...(!fullWidth ? defaultCols : {})} className={classnames({'mx-auto': !fullWidth})}>
        <Row>{renderPricingCards()}</Row>
      </Col>
      <ModalConfirmationProfile
        isOpen={completeProfileD}
        toggleFunc={() => {
          setCompleteProfileD(!completeProfileD);
        }}
        profileGet={() => {
          checkProfileCompleted();
        }}
      />
    </Row>
  );
};

export default PricingCards;
