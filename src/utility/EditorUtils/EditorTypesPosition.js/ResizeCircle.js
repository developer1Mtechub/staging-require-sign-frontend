import React from 'react';
import { Edit2, Plus, X } from 'react-feather';

const ResizeCircle = ({ position, onClick, color, children,item }) => {
  return (
    <>
   {item==="delete"?
  <div
  className="resize-circle"
  onClick={onClick}
  style={{
    position: 'absolute',
    ...position,
    width: window.innerWidth<786?30:25,
    height: window.innerWidth<786?30:25,
    borderRadius: '50%',
    backgroundColor: color,
    border: `2px solid ${color}`,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  }}
>
<X size={15} color='white' />
</div>:null}
{item==="edit"?
  <div
  className="resize-circle"
  onClick={onClick}
  style={{
    position: 'absolute',
    ...position,
    width: window.innerWidth<786?30:25,
    height: window.innerWidth<786?30:25,
    borderRadius: '50%',
    backgroundColor: color,
    border: `2px solid ${color}`,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  }}
>
<Edit2 size={15} color='white' />
</div>:null}
{item==="none"?
<div
      className="resize-circle"
      onClick={onClick}
      style={{
        position: 'absolute',
        ...position,
        width: window.innerWidth<786?20:10,
        height: window.innerWidth<786?20:10,
        borderRadius: '50%',
        backgroundColor: color,
        border: `2px solid lightGrey`,
        // cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      {children}
    </div> :null}
    {item==="drag"?
<div
      className="resize-circle"
      onClick={onClick}
      style={{
        position: 'absolute',
        ...position,
        width: window.innerWidth<786?30:15,
        height: window.innerWidth<786?30:15,
        borderRadius: '50%',
        backgroundColor: color,
        border: `2px solid lightGrey`,
        // cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
      }}
    >
      <Plus size={15} color='black' />
    </div> :null}
    
     </>
  );
};

export default ResizeCircle;
