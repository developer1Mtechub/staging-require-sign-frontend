// ** React Imports
import {Fragment, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

// ** Custom Components
import Avatar from '@components/avatar';

// ** Third Party Components
import DataTable from 'react-data-table-component';
import {
 
  ChevronDown,

} from 'react-feather';

// ** Reactstrap Imports
import {
  Card,
  Badge,
  CardTitle,
  CardHeader,

} from 'reactstrap';


// ** Styles
import '@styles/react/apps/app-invoice.scss';
import '@styles/react/libs/tables/react-dataTable-component.scss';
import {formatDate, formatDateTime} from '../../utility/Utils';
import getUserLocation from '../../utility/IpLocation/GetUserLocation';


const BillingHistory = ({transactionHistory}) => {
  const [locationIP, setLocationIP] = useState('');
  const columns = [
    {
      name: '#',
      sortable: true,
      minWidth: '107px',
      selector: ({transaction_history_id}) => transaction_history_id,
      cell: row => <span>{`#${row.transaction_history_id}`}</span>,
    },
    {
      name: 'Plan',
      minWidth: '150px',
      selector: ({plan_id}) => plan_id,
      cell: row => <span>{row.plan_id}</span>,
    },
    {
      name: 'Amount',
      minWidth: '150px',
      selector: ({amount}) => amount,
      cell: row => <span>${row.amount || 0}</span>,
    },

    {
      minWidth: '200px',
      name: 'Issued Date',
      cell: row => <span> {formatDateTime(row.subscription_start_date, locationIP)} </span>,
      selector: ({subscription_start_date}) => subscription_start_date,
    },
  ];
  const getLocatinIPn = async () => {
    const location = await getUserLocation();
    //console.log('location');
    //console.log(location);
    setLocationIP(location.timezone);
    //console.log(location.timezone);
  };
  useEffect(() => {
    getLocatinIPn();
  }, []);
  return (
    <div className="invoice-list-wrapper">
      <Card>
        <CardHeader className="py-1">
          <CardTitle tag="h4">Billing History</CardTitle>
          {/* <UncontrolledButtonDropdown size='sm'>
          <DropdownToggle outline caret>
            Export
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem className='w-100'>
              <Printer className='font-small-4 me-50' />
              <span>Print</span>
            </DropdownItem>
            <DropdownItem className='w-100'>
              <FileText className='font-small-4 me-50' />
              <span>CSV</span>
            </DropdownItem>
            <DropdownItem className='w-100'>
              <File className='font-small-4 me-50' />
              <span>Excel</span>
            </DropdownItem>
            <DropdownItem className='w-100'>
              <Clipboard className='font-small-4 me-50' />
              <span>PDF</span>
            </DropdownItem>
            <DropdownItem className='w-100'>
              <Copy className='font-small-4 me-50' />
              <span>Copy</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown> */}
        </CardHeader>
        <div className="invoice-list-dataTable react-dataTable">
          <DataTable
            noHeader
            responsive
            data={transactionHistory}
            columns={columns}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
          />
        </div>
      </Card>
    </div>
  );
};

export default BillingHistory;
