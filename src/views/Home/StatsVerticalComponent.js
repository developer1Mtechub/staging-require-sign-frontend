import React from 'react';
import {Row, Col} from 'reactstrap';
import {Clock, Users, User, CheckCircle} from 'react-feather';
import StatsVertical from '@components/widgets/stats/StatsVertical';
import { useTranslation } from 'react-i18next';

const StatsGrid = ({
  active,
  toggle,
  setFolderLoader,
  setStatusData,
  setCurrentPage,
  inprogressFiles,
  waitingforothersFiles,
  waitingformeFiles,
  completedFiles,
}) => {
  const {t} = useTranslation();

  const handleClick = (status, index) => {
    if (active === index) {
      return;
    }
    toggle(index);
    setFolderLoader(true);
    setTimeout(() => {
      setStatusData(status);
    }, 500);
    setCurrentPage(1);
  };

  return (
    <Row >
      <Col xl="3" md="3" xs="6">
        <StatsVertical
          onClickEvent={() => handleClick('InProgress', '1')}
          icon={<Clock size={21} />}
          color="info"
          stats={inprogressFiles || 0}
          statTitle={t("In Progress")}
        />
      </Col>
      <Col xl="3" md="3" xs="6">
        <StatsVertical
          onClickEvent={() => handleClick('WaitingForOthers', '2')}
          icon={<Users size={21} />}
          color="warning"
          stats={waitingforothersFiles || 0}
          statTitle={t("Waiting for Others")}
        />
      </Col>
      <Col xl="3" md="3" xs="6">
        <StatsVertical
          onClickEvent={() => handleClick('WaitingForMe', '3')}
          icon={<User size={21} />}
          color="danger"
          stats={waitingformeFiles || 0}
          statTitle={t("Waiting For Me")}
        />
      </Col>
      <Col xl="3" md="3" xs="6">
        <StatsVertical
          onClickEvent={() => handleClick('Completed', '4')}
          icon={<CheckCircle size={21} />}
          color="success"
          stats={completedFiles || 0}
          statTitle={t("Completed")}
        />
      </Col>
    </Row>
  );
};

export default StatsGrid;
