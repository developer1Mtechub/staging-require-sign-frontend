import React from 'react';
import {Card, CardBody, Col, Row} from 'reactstrap';
import welcomeImg from '../../assets/images/pages/two-steps-verification-illustration.png';
import { useTranslation } from "react-i18next";

const WelcomeNewUser = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardBody>
        <Row>
          {window.innerWidth<730? <Col md="4" xs="12">
            <img src={welcomeImg} alt="welcomeImg" style={{width: '80%', height: 'auto'}} />
          </Col>:null}
          <Col
            md="8"
            xs="12"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'left',
            }}>
            <h1 className="fw-bold">{t("Welcome to your dashboard")}</h1>
            <h3 style={{lineHeight: 2}}>
              {t("Thanks for signing up with RequireSign.")}
              <br /> {t("Sign documents online using electronic signatures.")}
            </h3>
          </Col>
          {window.innerWidth<730? null: <Col md="4" xs="12">
            <img src={welcomeImg} alt="welcomeImg" style={{width: '80%', height: 'auto'}} />
          </Col>}
         
        </Row>
      </CardBody>
    </Card>
  );
};

export default WelcomeNewUser;
