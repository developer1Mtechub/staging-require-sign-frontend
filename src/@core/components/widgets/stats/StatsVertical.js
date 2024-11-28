// ** Third Party Components
import PropTypes from 'prop-types';

// ** Reactstrap Imports
import {Card, CardBody, Col, Label, Row} from 'reactstrap';

const StatsVertical = ({icon, color, stats, statTitle, className,onClickEvent}) => {
  return (<>
  {window.innerWidth>730? <Card style={{cursor:'pointer'}}
    onClick={onClickEvent}
      // style={{boxShadow:'none',border:'1px solid lightGray',backgroundColor:'white'}}
      className="text-center">
      <CardBody className={className}>
        <Row>
          <Col md="2" xs="2">
            <div className={`avatar p-50 m-0 mb-1 ${color ? `bg-light-${color}` : 'bg-light-primary'}`}>
              <div className="avatar-content">{icon}</div>
            </div>
          </Col>
          <Col md="10" xs="10">
            <h2 className="fw-bolder">{stats}</h2>
            <Label className="card-text line-ellipsis form-label">{statTitle}</Label>
          </Col>
        </Row>
      </CardBody>
    </Card>:
    // <Card style={{cursor:'pointer'}}
    // onClick={onClickEvent}
    //   // style={{boxShadow:'none',border:'1px solid lightGray',backgroundColor:'white'}}
    //   className="text-center">
    //   <CardBody className={className}>
        <Row style={{border:"1px solid lightGrey",padding:"5px",backgroundColor:"white",borderRadius:"2px"}}>
          <Col md="12" xs="12" style={{display:"flex",flexDirection:"column"}}>
           <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
           <div className={`avatar p-10 m-0 mb-1 ${color ? `bg-light-${color}` : 'bg-light-primary'}`}>
              <div className="avatar-content">{icon}</div>
            </div>
            <h4 className="fw-bolder">{stats}</h4>

           </div>
            <Label className="card-text line-ellipsis form-label">{statTitle}</Label>
          </Col>
        </Row>
    //   </CardBody>
    // </Card>
    }</>
  );
};

export default StatsVertical;

// ** PropTypes
StatsVertical.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  stats: PropTypes.string.isRequired,
  statTitle: PropTypes.string.isRequired,
};
