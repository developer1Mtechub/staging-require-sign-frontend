
import React from 'react';
import styled, {keyframes} from 'styled-components';
import { selectPrimaryColor } from '../redux/navbar';
import { useSelector } from "react-redux";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;


const SpinnerCustom = ({style = {}, color = 'primary', size = 'md'}) => {
  const primary_color = useSelector(selectPrimaryColor);
  const colorMap = {
    primary: primary_color,
    light: 'white',
  };

  const getSizeStyles = size => {
    switch (size) {
      case 'sm':
        return {
          width: '30px',
          height: '30px',
          borderThickness: '4px',
        };
      case 'lg':
        return {
          width: '70px',
          height: '70px',
          borderThickness: '7px',
        };
      case 'md':
      default:
        return {
          width: '50px',
          height: '50px',
          borderThickness: '5px',
        };
    }
  };

  const Spinner = styled.div`
    width: ${({size}) => getSizeStyles(size).width};
    height: ${({size}) => getSizeStyles(size).height};
    border-radius: 50%;
    border: ${({size}) => getSizeStyles(size).borderThickness} solid #f3f3f3;
    border-top: ${({size}) => getSizeStyles(size).borderThickness} solid ${({color}) => colorMap[color] || color};
    animation: ${spin} 1s linear infinite;
  `;
  return <Spinner style={style} color={color} size={size} />;
};

export default SpinnerCustom;
