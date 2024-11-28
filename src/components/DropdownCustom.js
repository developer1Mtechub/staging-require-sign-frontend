import React, {useState, useRef, useEffect} from 'react';
import {Trash2, ChevronDown} from 'react-feather'; // Assuming you are using react-feather for icons
import { selectPrimaryColor } from '../redux/navbar';
import { useSelector } from "react-redux";
import { Spinner } from 'reactstrap';

const DropdownCustom = ({template,signersData, selectedSigner, setSelectedSigner, setActive, deleteForm,deleteSignerLoader,active}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [clickedSignerIndex, setClickedSignerIndex] = useState(null);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const primary_color = useSelector(selectPrimaryColor);

  const handleClickOutside = event => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div ref={dropdownRef} style={{width: '95%', marginLeft: '10px', position: 'relative'}}>
      <button
        onClick={toggleDropdown}
        style={{
          outline: 'none',
          boxShadow: 'none',
          border:active==="1"?`1px solid lightGrey`:`1px solid ${primary_color}`,
          // border: `1px solid ${primary_color}`,
          color: 'grey',
          height: '40px',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'white', // Assuming primary color
          cursor: 'pointer',
          borderRadius: '5px',
        }}>
        {selectedSigner === null ||
        selectedSigner === undefined ||
        selectedSigner === '' ||
        selectedSigner.length === 0 ? (
          <span style={{fontSize: '15px'}}>Select Signer</span>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexShrink: 1,
            }}>
            <div
              style={{
                backgroundColor: `${selectedSigner.color}`,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
              }}></div>
            <span style={{marginLeft: '10px', fontSize: '15px'}}>
              {selectedSigner.name===""?<>
              {selectedSigner.placeholder}
              </>:<>
              {selectedSigner.name.length > 9 ? `${selectedSigner.name.slice(0, 9)}...` : selectedSigner.name}

              </>}
            </span>
          </div>
        )}
        <ChevronDown style={{marginLeft: '10px'}} />
      </button>
      {dropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '0',
            width: '100%',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            zIndex: 1000,
          }}>
          {signersData &&
            signersData.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  cursor: 'pointer',
                }}
                onClick={e => {
                    e.preventDefault();
                    setSelectedSigner(item);
                    setActive('2');
                    setDropdownOpen(!dropdownOpen);
                  }}
                >
                <div
                  style={{display: 'flex'}}
                  >
                  <div
                    style={{
                      backgroundColor: `${item.color}`,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                    }}></div>
                  <span style={{marginLeft: '20px', fontSize: '16px'}}>
                  {item.name===""?<>
              {item.placeholder}
              </>:<>
                    {item.name}</>}</span>
                </div>
                {!template || index !== 0 ? (<>
    {deleteSignerLoader && clickedSignerIndex === index ?
    <Spinner 
    color="primary"
    style={{marginLeft: '20px'}}
    />:<Trash2
          onClick={(e) => {
            e.stopPropagation();
            deleteForm(index);
            setClickedSignerIndex(index); 
          }}
          style={{ color: 'red', marginLeft: '20px' }}
          size={20}
        />
  }    
     </> ) : null}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DropdownCustom;
