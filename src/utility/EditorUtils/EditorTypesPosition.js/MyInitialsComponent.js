
import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';

const MyInitialsComponent = ({
  item,
  handleInputChanged,
  handleDoubleClick,
  IsSigner,
  activeSignerId,
  signerFunctionalControls,
  onTouchEnd,
  zoomPercentage
}) => {
  const [loading, setLoading] = useState(true);

  // To handle image load event
  useEffect(() => {
    setLoading(true); // Reset loading state when the image URL changes

    const img = new Image();
    img.src = item.url;
    img.onload = () => setLoading(false);
  }, [item.url]);

  return (
    <>
      {IsSigner ? (
        <>
          {signerFunctionalControls ? (
            <>
              {activeSignerId === item.signer_id_receive ? (
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: `${item.width * zoomPercentage}px`, height: `${item.height * zoomPercentage}px` }}>
                  
                  {loading && (
                    <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                      <Spinner color="primary"/>
                    </div>
                  )}
                  
                  <div 
                    onClick={handleDoubleClick}
                    onTouchEnd={onTouchEnd}
                    style={{
                      backgroundImage: `url(${item.url})`,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      display: loading ? 'none' : 'block'
                    }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: `${item.width * zoomPercentage}px`, height: `${item.height * zoomPercentage}px` }}>
                  
                  {loading && (
                    <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                      <Spinner color="primary"/>
                    </div>
                  )}
                  
                  <div 
                    style={{
                      backgroundImage: `url(${item.url})`,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                      display: loading ? 'none' : 'block'
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: `${item.width * zoomPercentage}px`, height: `${item.height * zoomPercentage}px` }}>
              
              {loading && (
                <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
                  <Spinner color="primary"/>
                </div>
              )}
              
              <div 
                style={{
                  backgroundImage: `url(${item.url})`,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  display: loading ? 'none' : 'block'
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: `${(item.width * zoomPercentage) - 4}px`, height: `${(item.height * zoomPercentage) - 4}px` }}>
          
          {loading && (
            <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
              <Spinner color="primary"/>
            </div>
          )}
          
          <div 
            onClick={handleDoubleClick}
            onTouchEnd={onTouchEnd}
            style={{
              backgroundImage: `url(${item.url})`,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              display: loading ? 'none' : 'block'
            }}
          />
        </div>
      )}
    </>
  );
};

export default MyInitialsComponent;

