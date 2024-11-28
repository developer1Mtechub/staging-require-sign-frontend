// ** React Imports
import {Fragment} from 'react';

// ** Demo Components
import PaymentMethods from './PaymentMethods';
import BillingAddress from './BillingAddress';
import BillingHistory from './BillingHistory';
import BillingCurrentPlan from './BillingCurrentPlan';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { PrimaryKey } from '../../apis/api';

const BillingTabContent = ({
  stripe_customer_id,
  selectedPlan,
  userCards,
  billingDetails,
  planDetails,
  locationIP,
  totalDays,
  differenceInDays,
  percentageRemaining,
  recallCards,
  referalCodes
}) => {
  const stripePromise = loadStripe(PrimaryKey);
  const loader = 'auto';
  const appearance = {
    theme: 'stripe',
  };
  return (
    <Fragment>
      <div style={{width: '100%'}}>
        <BillingCurrentPlan
        referalCodes={referalCodes}
          selectedPlan={selectedPlan}
          planDetails={planDetails}
          locationIP={locationIP}
          totalDays={totalDays}
          differenceInDays={differenceInDays}
          percentageRemaining={percentageRemaining}
        />
        {selectedPlan?.subscription_end_date === null||selectedPlan?.subscription_end_date === undefined?
        null:
        <>
        <Elements stripe={stripePromise} options={{appearance, loader}}>
        {/* {stripe_customer_id} - cus_QBnYnPyPuvewWx */}
         <PaymentMethods stripe_customer_id={stripe_customer_id} userCards={userCards} recallCards={recallCards} />
        </Elements> 
        <BillingAddress billingDetails={billingDetails} recallCards={recallCards} />
        </>}
        
        {/* <BillingHistory /> */}
      </div>
    </Fragment>
  );
};

export default BillingTabContent;
