
import React, { useRef, useState } from 'react';
import { darkenColorRGB } from '../../Utils';
import { ArrowRight } from 'react-feather';
import { Spinner } from 'reactstrap';

const SignerDrivinglicenseComponent = ({
  item,
  handleInputChanged,
  handleDoubleClick,
  IsSigner,
  handleFileChange,
  activeSignerId,
  RequiredActive,
  SignersWhoHaveCompletedSigning,
  onTouchEnd,
  zoomPercentage
}) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false); // New loading state

  // Function to handle click on the div
  const handleDivClick = () => {
    // Trigger click event of the file input
    fileInputRef.current.click();
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleFileInputChange = (event) => {
    setLoading(true); // Set loading to true when file is selected
    handleFileChange(event);
  };

  const handleImageLoad = () => {
    setLoading(false); // Set loading to false when image is loaded
  };

  return (
    <>
      {IsSigner ? (
        <>
          {activeSignerId === item.signer_id ? (
            <>
              {item.url === null || item.url === undefined ? (
                <div
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={handleDivClick}
                  style={{
                    display: 'flex',
                    cursor: 'pointer',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: item.width * zoomPercentage,
                    backgroundColor: item.required
                      ? darkenColorRGB('rgb(255 214 91 / 78%)')
                      : 'rgb(255 214 91 / 78%)',
                    height: item.height * zoomPercentage,
                    border: item.required ? '1px solid red' : '1px solid black',
                    borderRadius: '3px',
                    position: 'relative',
                  }}>
                  {isHovered ||
                    (item.tooltip === '' || item.tooltip === null || item.tooltip === undefined ? null : (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-25px',
                          height: '25px',
                          width: '100px',
                          padding: 1,
                          border: '1px solid black',
                          display: 'flex',
                          justifyContent: 'left',
                          alignItems: 'center',
                          left: 0,
                          backgroundColor: 'rgb(255 214 91 / 78%)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                        <h4>{item.tooltip}</h4>
                      </div>
                    ))}
                  {RequiredActive === item.id ? (
                    <div style={{ position: 'absolute', top: '-15px', left: -55 }}>
                      <ArrowRight size={60} color="orange" />
                    </div>
                  ) : null}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange} // Updated handler
                  />
                                    {window.innerWidth<730?
                         <h5 style={{ opacity: '1', color: "black" }}>Choose Driving Licence</h5>
                         :     <h3 style={{ opacity: '1', color: "black" }}>Choose Driving Licence</h3>} 
                 
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  {loading && (
                    <div
                      style={{
                        position: 'absolute',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      }}>
                      <div ><Spinner color="primary"/></div>
                    </div>
                  )}
                  <img
                    onClick={handleDivClick}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    alt="Driving License"
                    src={`${item.url}`}
                    onLoad={handleImageLoad} // Set loading to false when the image loads
                    style={{
                      width: `${(item.width * zoomPercentage) - 3}px`,
                      cursor: 'pointer',
                      objectFit: "contain",
                      border: item.required ? '1px solid red' : '1px solid black',
                      height: `${(item.height * zoomPercentage) - 3}px`,
                    }}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {SignersWhoHaveCompletedSigning.includes(item.signer_id) ? (
                <div
                  style={{
                    backgroundImage: `url(${item.url})`,
                    width: `${(item.width * zoomPercentage)}px`,
                    height: `${(item.height * zoomPercentage)}px`,
                    border: '1px solid lightGrey',
                    cursor: 'pointer',
                    objectFit: 'contain',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }} />
              ) : null}
            </>
          )}
        </>
      ) : (
        <div
          onClick={handleDoubleClick}
          onTouchEnd={onTouchEnd}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: `${(item.width * zoomPercentage) - 4}px`,
            height: `${(item.height * zoomPercentage) - 4}px`,
            backgroundColor: item.required ? darkenColorRGB(item.backgroundColor) : item.backgroundColor,
            borderRadius: '3px',
            position: 'relative',
          }}>
          <h2 style={{ opacity: '1', fontSize: 12 * zoomPercentage }}>Driving License</h2>
        </div>
      )}
    </>
  );
};

export default SignerDrivinglicenseComponent;
