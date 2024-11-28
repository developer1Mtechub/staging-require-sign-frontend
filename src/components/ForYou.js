import React, {useState} from 'react';
import {ListGroup} from 'reactstrap';
import {
  Calendar,
  CheckCircle,

  Italic,
  PenTool,
  Type,
  Zap,

  Edit2,
} from 'react-feather';
import { selectPrimaryColor } from '../redux/navbar';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const ForYou = ({type,typeData,handleCanvasClick2,compPrimaryColor}) => {
  // List
  const { t } = useTranslation();

  const [activeList, setActiveLIst] = useState('');
  const [TypeSelected,setTypeSelected]=useState('')
  const [hoveredItem, setHoveredItem] = useState(null);
  const toggleList = list => {
    if (activeList !== list) {
      setActiveLIst(list);
    }
  };
  
  // Tooltip

  const [tooltipOpen, setTooltipOpen] = useState({});

  const toggleTooltip = i => {
    setTooltipOpen({...tooltipOpen, [i]: !tooltipOpen[i]});
  };
  const styleText = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    alignContent: 'center',
    paddingInline: '2%',
    cursor: 'pointer',
    width: '85%',
    paddingBlock: 3,
    borderRadius: '5px',
    marginTop: '2%',
    alignSelf: 'center',
   
  };
  const styleText1 = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    // paddingInline: '20px',
    cursor: 'pointer',
    width: '85%',
    paddingBlock: 5,
    borderRadius: '5px',
    // marginTop: '2%',
    alignSelf: 'center',
   
  };
  const styleh2 = {
    fontSize: '12px',
    fontWeight: 600,
    marginTop: '10px',
    // marginLeft: '15px',
  };
  const styleh22 = {
    fontSize: '15px',
    fontWeight: 600,
    marginTop: '10px',
    marginLeft: '15px',
  };
  const forYouItems = [
    {
      name: t("Text"),
      type: 'my_text',
      icon: (
        <Type
          style={{
            marginLeft: '15px',
          }}
          size={15}
        />
      ),
      actionType: 'TEXT',
    },
    {
      name: t("Signature"),
      type: 'my_signature',
      icon: (
        <Edit2
          style={{
            marginLeft: '15px',
          }}
          size={15}
        />
      ),
      actionType: 'SIGNATURE',
    },
    {
      name: t('Initials'),
      type: 'my_initials',
      icon: (
       
        <Italic
        style={{
          marginLeft: '15px',
        }}
        size={15}
      />
      ),
      actionType: 'INITIALS',
    },
    {
      name: t('Date'),
      type: 'date',
      icon: (
        <Calendar
          style={{
            marginLeft: '15px',
          }}
          size={15}
        />
      ),
      actionType: 'DATE',
    },
    {
      name: t('Checkmark'),
      type: 'checkmark',
      icon: (
        <CheckCircle
          style={{
            marginLeft: '15px',
          }}
          size={15}
        />
      ),
      actionType: 'CHECKMARK',
    },
    {
      name: t('Highlight'),
      type: 'highlight',
      icon: (
        <PenTool
          style={{
            marginLeft: '15px',
          }}
          size={15}
        />
      ),
      actionType: 'HIGHLIGHT',
    },
    {
      name: t('Stamp'),
      type: 'stamp',
      icon: (
        <Zap
          style={{
            marginLeft: '15px',
          }}
          size={15}
        />
      ),
      actionType: 'STAMP',
    },
  ];
  const forYouItems1 = [
    {
      name: t('Text'),
      type: 'my_text',
      icon: (
        <Type
          size={15}
        />
      ),
      actionType: 'TEXT',
    },
    {
      name: t('Signature'),
      type: 'my_signature',
      icon: (
        <Edit2
          size={15}
        />
      ),
      actionType: 'SIGNATURE',
    },
    {
      name: t('Initials'),
      type: 'my_initials',
      icon: (
        <Italic
        size={15}
      />
      ),
      actionType: 'INITIALS',
    },
    {
      name: t('Date'),
      type: 'date',
      icon: (
        <Calendar
          size={15}
        />
      ),
      actionType: 'DATE',
    },
    {
      name: t('Checkmark'),
      type: 'checkmark',
      icon: (
        <CheckCircle
          size={15}
        />
      ),
      actionType: 'CHECKMARK',
    },
    {
      name: t('Highlight'),
      type: 'highlight',
      icon: (
        <PenTool
          size={15}
        />
      ),
      actionType: 'HIGHLIGHT',
    },
    {
      name: t('Stamp'),
      type: 'stamp',
      icon: (
        <Zap
          size={15}
        />
      ),
      actionType: 'STAMP',
    },
  ];
  const primary_color = useSelector(selectPrimaryColor);

  return (
    <div>
      {/* Your component code goes here */}
      <ListGroup style={{width: '100%'}} className="list-group-vertical-sm">
       
          <>
      {window.innerWidth>786 ?
      <>
       {forYouItems.map((item, i) => (
        <div 
            key={i}
         
              // onClick={() => {
              //   alert('hello');
              // }}
              onClick={() => {
                toggleList(i+1);
            type(item.type);
            setTypeSelected(item.type)
              }} 
              onMouseEnter={() => setHoveredItem(i)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                ...styleText,
                border: typeData===item.type ? `1px solid ${compPrimaryColor===null?primary_color:compPrimaryColor}` : '1px solid #e0e0e0',
                backgroundColor: hoveredItem === i ? '#f5f5f5' : 'transparent', }}>
             
                 {item.icon}    
              
           

              <h2 style={styleh22}>{item.name}</h2>
            </div>
             ))}
            </>: 
            <>
            <div style={{display:'flex',minWidth:'500px',overflowY:'scroll'}}>

            {forYouItems1.map((item, i) => (
            <div 
            key={i}
         
              // onClick={() => {
              //   alert('hello');
              // }}
              onClick={async() => {
                toggleList(i+1);
            type(item.type);
            
            setTypeSelected(item.type)
            handleCanvasClick2(item.type)
              }} 
              style={{
                ...styleText1,
                border: typeData===item.type ? `1px solid ${compPrimaryColor===null?primary_color:compPrimaryColor}` : "none"
              }}>
              <span style={{
                backgroundColor: compPrimaryColor===null?primary_color:compPrimaryColor,
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                // paddingRight: '15px',
                alignItems: 'center',
                fontSize:"20px",
                width: '40px',
                height: '40px',
              }}>{item.icon}
                </span>

              <h5 style={styleh2}>{item.name}</h5>
            </div>
              ))}
              </div>
            </> }

         
          </>
       
      
      </ListGroup>
    </div>
  );
};

export default ForYou;
