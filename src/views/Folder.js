import { Card, CardHeader, CardBody, CardTitle, CardText } from "reactstrap";
import Breadcrumbs from '@components/breadcrumbs'
import { Row, Col } from 'reactstrap'
// import AddCardExample from "../components/AddCard";

const Folder = () => {
  return (
    <>
      {/* <Breadcrumbs title='Folder And Files' data={[{ title: 'Pages' }]} /> */}
      <Row className='match-height'>
        <Col md='4'>
          {/* <AddCardExample /> */}
        </Col>
      </Row>
      <Card>
        <CardHeader>
          <CardTitle>Create Awesome 🙌</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>This is your second page.</CardText>
          <CardText>
            Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin.
            Carrot cake dragée chupa chups jujubes. Macaroon liquorice cookie
            wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.
          </CardText>
        </CardBody>
      </Card>
    </>
  );
};

export default Folder;
