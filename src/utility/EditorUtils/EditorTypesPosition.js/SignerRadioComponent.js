import React, {useState} from 'react';

const SignerRadioComponent = ({item, handleInputChecked, handleDoubleClick, IsSigner, activeSignerId,SignersWhoHaveCompletedSigning}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      {IsSigner ? (
        <>
          {activeSignerId === item.signer_id ? (
            <div style={{position: 'relative'}}>
              {isHovered && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      top: '-25px',
                      height: '25px',
                      width: 'auto',
                      padding: 1,
                      border: '1px solid black',
                      display:
                        item.tooltip === '' || item.tooltip === null || item.tooltip === undefined ? 'none' : 'flex',
                      justifyContent: 'left',
                      alignItems: 'center',
                      left: 0,
                      backgroundColor: 'rgb(255 214 91 / 78%)',
                      whiteSpace: 'nowrap', // Prevent text wrapping
                      overflow: 'hidden', // Hide overflow
                      textOverflow: 'ellipsis', // Truncate with ellipsis
                    }}>
                    {/* <h4 style={{fontWeight: 600}}>{item.required ? 'Required' : 'Optional'}</h4> */}
                    {/* <div>-</div> */}
                    {item.tooltip === '' || item.tooltip === null || item.tooltip === undefined ? null : (
                      <h4>{item.tooltip}</h4>
                    )}
                  </div>
                </>
              )}
              <div  style={{
              border:item.required?'1px solid red':'none',
              display:'flex',
              justifyContent:'center',
              height:'30px',
              alignItems:'center'
            }}>

              
              <input
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                checked={item.text}
                onChange={e => handleInputChecked(e)}
                type="radio"
                style={{transform: 'scale(1.5)'}}
                //  disabled
                //  onClick={handleDoubleClick}
              /></div>
            </div>
          ) : <>
          {SignersWhoHaveCompletedSigning.includes(item.signer_id) ? (
                <>
                  <h3
          style={{
            color: 'black',
            fontWeight: 700,
            display: 'flex',
            padding: 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {' '}
         {item.text?"●":""}
        </h3>
                </>
              ) : null}
          </>}
        </>
      ) : (
        <div
          onClick={handleDoubleClick}
          style={{
            width: '30px',
            margin: 0,
            height: '30px',
            border: '2px solid #6784a1',
            backgroundColor: item.backgroundColor, // Light grey with opacity
            position: 'fixed',
            borderRadius: '3px',
            // zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none', // Make sure the box doesn't interfere with mouse events
          }}>
          {/* <Input style={{ marginLeft: '-1px', marginTop: '15px', backgroundColor: "black" }} ref={elementRefCursor}
          type='checkbox'
          checked={true}

          id='basic-cb-checked' /> */}
          <input type="radio" value={false} onChange={() => console.log('disable')} style={{transform: 'scale(1.5)'}} />
        </div>
      )}
    </>
  );
};

export default SignerRadioComponent;
