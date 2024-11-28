import React from 'react';
import {Nav, NavItem, NavLink, Label} from 'reactstrap';
import {Clock, Users, User, CheckCircle} from 'react-feather';
import { useTranslation } from 'react-i18next';

const DesktopNav = ({active, toggle, pcolorFromLocalStorage, setFolderLoader, setStatusData, setCurrentPage}) => {
  const {t} = useTranslation();

  const commonStyles = {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  };

  const activeStyles = {
    color: pcolorFromLocalStorage,
    borderBottom: `3px solid ${pcolorFromLocalStorage}`,
  };

  return (
    <Nav className="nav-left">
      <NavItem>
        <NavLink
          active={active === '1'}
          style={active === '1' ? {...commonStyles, ...activeStyles} : commonStyles}
          onClick={() => {
            if (active !== '1') {
              toggle('1');
              localStorage.setItem('tabActive', '1');
              setFolderLoader(true);
              setTimeout(() => {
                setStatusData('InProgress');
              }, 500);
              setCurrentPage(1);
            }
          }}>
          <Clock size={14} />
          <Label className="form-label" style={{marginLeft: '5px', marginBottom: '0', cursor: 'pointer'}}>
            {t("New File")} | {t("In Progress")}
          </Label>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          active={active === '2'}
          style={active === '2' ? {...commonStyles, ...activeStyles} : commonStyles}
          onClick={() => {
            if (active !== '2') {
              toggle('2');
              localStorage.setItem('tabActive', '2');
              setFolderLoader(true);
              setTimeout(() => {
                setStatusData('WaitingForOthers');
              }, 500);
              setCurrentPage(1);
            }
          }}>
          <Users size={14} />
          <Label className="form-label" style={{marginLeft: '5px', marginBottom: '0', cursor: 'pointer'}}>
            {t("Waiting for Others")}
          </Label>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          active={active === '3'}
          style={active === '3' ? {...commonStyles, ...activeStyles} : commonStyles}
          onClick={() => {
            if (active !== '3') {
              toggle('3');
              localStorage.setItem('tabActive', '3');
              setFolderLoader(true);
              setTimeout(() => {
                setStatusData('WaitingForMe');
              }, 500);
              setCurrentPage(1);
            }
          }}>
          <User size={14} />
          <Label className="form-label" style={{marginLeft: '5px', marginBottom: '0', cursor: 'pointer'}}>
          {t("Waiting For Me")}
          </Label>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          active={active === '4'}
          style={active === '4' ? {...commonStyles, ...activeStyles} : commonStyles}
          onClick={() => {
            if (active !== '4') {
              toggle('4');
              localStorage.setItem('tabActive', '4');
              setFolderLoader(true);
              setTimeout(() => {
                setStatusData('Completed');
              }, 500);
              setCurrentPage(1);
            }
          }}>
          <CheckCircle size={14} />
          <Label className="form-label" style={{marginLeft: '5px', marginBottom: '0', cursor: 'pointer'}}>
            {t("Completed")}
          </Label>
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default DesktopNav;
