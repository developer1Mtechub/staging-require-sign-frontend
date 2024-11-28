import React from 'react';
import SpinnerCustom from '../../../components/SpinnerCustom';
import { useTranslation } from 'react-i18next';

const FullScreenLoader = () => {
  const { t } = useTranslation(); 

  return (
    <div style={styles.overlay}>
      {/* <div style={styles.loader}> */}
        <SpinnerCustom color="primary" />
        <h1 style={{color:'white',marginTop:'10px',marginLeft:"20px"}}>
          {t("Loading")} ...

        </h1>
      {/* </div> */}
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'grey', // Grey background with transparency

    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Grey background with transparency
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensures the loader is on top of other content
  },
  loader: {
    textAlign: 'center',
  },
};

export default FullScreenLoader;
