// ** React Imports
import {Fragment, useState, useEffect} from 'react';
// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Modal,
  Input,
  Button,
  CardBody,
  Progress,
  CardTitle,
  ModalBody,
  CardHeader,
  ModalHeader,
  Table,
} from 'reactstrap';

// ** Demo Components
// import PricingCard from '@src/views/pages/pricing/PricingCards'

// ** Third Party Components
// import axios from 'axios'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// ** Styles
// import '@styles/base/pages/page-pricing.scss';
// import '@styles/base/plugins/extensions/ext-component-sweet-alerts.scss';
import ModalConfirmationPlan from '../ModalConfirmationPlan';
import {formatDate} from '../../utility/Utils';
import { useTranslation } from 'react-i18next';
import CustomButton from '../ButtonCustom';


const MySwal = withReactContent(Swal);

const BillingCurrentPlan = ({
  selectedPlan,
  planDetails,
  locationIP,
  totalDays,
  differenceInDays,
  percentageRemaining,
  referalCodes
}) => {
  const { t } = useTranslation();

  const [completeProfile, setCompleteProfile] = useState(false);

  // ** States
  const [duration, setDuration] = useState('monthly');


  const onChange = e => {
    if (e.target.checked) {
      setDuration('yearly');
    } else {
      setDuration('monthly');
    }
  };
 

  return (
    <Fragment>
    <Card>
      <CardHeader className="border-bottom">
        <CardTitle tag="h3"><h3 style={{fontWeight:600}}>{t("Current Plan")}</h3></CardTitle>
      </CardHeader>
      <CardBody className="my-2 py-25">
        <Table responsive>
          <thead>
            <tr>
              <th>{t("Description")}</th>
              <th>{t("Details")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><h3>{t("Your Current Plan is")}</h3></td>
              <td>
                <strong><h3>{planDetails?.name}</h3></strong>
              </td>
            </tr>
            {planDetails?.team_size === null || planDetails?.team_size === 0 ? null : (
              <tr>
                <td><h3>{t("Users Limit")}</h3></td>
                <td>
                  <strong><h3>{planDetails?.team_size}</h3></strong>
                </td>
              </tr>
            )}
            <tr>
              <td><h3>{t("Active until")}</h3></td>
              <td>
               <h3>{formatDate(selectedPlan?.subscription_end_date, locationIP)}</h3> 
              </td>
            </tr>
            <tr>
              <td><h3>{t("Price")}</h3></td>
              <td>
                <h1 style={{ fontSize: "16px", display: "inline" }}>
                  ${selectedPlan?.type === 'monthly' ? planDetails?.monthly_price : planDetails?.yearly_price} 
                  {planDetails?.name === 'Team' ? " per user" : null} / {selectedPlan?.type} 
                  <Badge color="light-primary" className="ms-50">
                    {planDetails?.name}
                  </Badge>
                </h1>
              </td>
            </tr>
            {selectedPlan?.subscription_end_date === null || selectedPlan?.subscription_end_date === undefined ? (
              <tr>
                <td colSpan="2">
                  <Alert color="warning">
                    <h4 className="alert-heading" style={{ fontSize: "16px" }}>{t("We need your attention!")}</h4>
                    <div className="alert-body" style={{ fontSize: "14px" }}>{t("Your plan requires update")}</div>
                  </Alert>
                </td>
              </tr>
            ) : null}
          </tbody>
        </Table>
        <Row>
          <Col xs={12} style={{display:'flex',justifyContent:"right"}}>
           <CustomButton
              color="success"
              onClick={() => setCompleteProfile(true)}
              text={t("Upgrade Plan")}
              style={{ fontSize: "16px",marginBlock:"20px",height:"40px" }}
              size="sm"
              />
           
            {/* Uncomment if cancel button is needed
            <Button
              outline
              color="danger"
              className="mt-1"
              // onClick={handleConfirmCancel}
            >
              Cancel Subscription
            </Button> */}
          </Col>
        </Row>
      </CardBody>
    </Card>
    <ModalConfirmationPlan planAll={referalCodes} isOpen={completeProfile} toggleFunc={() => setCompleteProfile(!completeProfile)} />
  </Fragment>
  
  );
};

export default BillingCurrentPlan;
