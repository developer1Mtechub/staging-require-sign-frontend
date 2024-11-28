import React, { useEffect, useState } from 'react';
import { ListGroup } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { selectPrimaryColor } from '../redux/navbar';
import { useSelector } from "react-redux";

const SidebarCustom = ({ type, typeData, handleCanvasClick2, menuData }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(); 
  const [activeNavLink, setActiveNavLink] = useState("/home");
  const [hoveredItem, setHoveredItem] = useState(null);
  const handleNavigate = (navLink) => {
    setActiveNavLink(navLink);
    navigate(navLink);
  };

  useEffect(() => {
    // Set the initial activeNavLink based on the current path
    setActiveNavLink(window.location.pathname);
  }, []);

  const primary_color = useSelector(selectPrimaryColor);

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

  const styleh22 = {
    fontSize: '15px',
    fontWeight: 600,
    marginTop: '10px',
    marginLeft: '15px',
  };

  return (
    <div>
      <ListGroup style={{ width: '100%',marginTop:"44px" }} className="list-group-vertical-sm">
        
        {menuData.map((item, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredItem(i)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => handleNavigate(item.navLink)}
            style={{
              ...styleText,
              backgroundColor: activeNavLink === item.navLink ? primary_color : (hoveredItem === i ? '#f5f5f5' : 'inherit'),
              color: activeNavLink === item.navLink ? 'white' : 'inherit',
            }}
          >
            {item.icon}
            <h2
              style={{
                ...styleh22,
                color: activeNavLink === item.navLink ? 'white' : 'inherit',
              }}
            >
              {t(item.title)}
            </h2>
          </div>
        ))}
      </ListGroup>
    </div>
  );
};

export default SidebarCustom;
