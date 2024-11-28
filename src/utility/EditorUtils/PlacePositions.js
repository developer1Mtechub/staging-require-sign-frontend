export const handlePlacePosition = (
  event,
  type,
  activeImage,
  imageUrlSig,
  imageUrlLines,
  signerIdData,
  stateMemory,
  control,
  signer_id,
  pageNumber,
  zoomPercentage
) => {
  let scale=zoomPercentage
  // Add type
  //console.log('hello');
  //console.log(event);
  //console.log(type);
  //console.log('pageNumber');

  //console.log(pageNumber);

  if (type === 'my_text') {
    const x = event.x;
    const y = event.y;
    const text = '';

    const FontFam = 'Times New Roman';
    const fontSize = 15;
    const color = '#000000';
    const backgroundColor = 'red';
    //console.log('ydata');

    const randomId = Math.floor(1000 + Math.random() * 9000);
    let savedCanvasData = {};
    if (control === true || control === 'true') {
      savedCanvasData = {
        id: randomId,
        x,
        y,
        text,
        width: 80,
        height:window.innerWidth<730? 45*zoomPercentage : (stateMemory.fontSize-4) >= 18 ? 30*zoomPercentage : 15*zoomPercentage,
        type,
        placeholder: 'Text',
        // fontSize: (stateMemory.fontSize-4)*zoomPercentage,
        fontSize: stateMemory.fontSize,

        color: color,
        fontFamily: stateMemory.fontFamily,
        fontWeight: stateMemory.fontWeight,
        fontStyle: stateMemory.fontStyle,
        textDecoration: stateMemory.textDecoration,
        bgImg: activeImage,
        borderRadius: '3px',
        backgroundColor: 'rgba(98,188,221,.3)',
        signer_id_receive: signer_id,
        page_no: pageNumber,
      };
    } else {
      savedCanvasData = {
        id: randomId,
        x,
        y,
        text,
        width: 80,
        height:window.innerWidth<730? 45*zoomPercentage : (stateMemory.fontSize-4) >= 18 ? 25*zoomPercentage : 15*zoomPercentage,

        type,
        placeholder: 'Text',
        fontSize: (stateMemory.fontSize-4)*zoomPercentage,
        color: color,
        fontFamily: stateMemory.fontFamily,
        fontWeight: stateMemory.fontWeight,
        fontStyle: stateMemory.fontStyle,
        
        textDecoration: stateMemory.textDecoration,
        bgImg: activeImage,
        borderRadius: '3px',
        backgroundColor: 'rgba(98,188,221,.3)',
        page_no: pageNumber,
      };
    }
    // const savedCanvasData = {
    //   id: randomId,
    //   x,
    //   y,
    //   text,
    //   width: 120,
    //   height: stateMemory.fontSize >= 18 ? 40 : 30,
    //   type,
    //   placeholder: 'Text',
    //   fontSize: stateMemory.fontSize,
    //   color: color,
    //   fontFamily: stateMemory.fontFamily,
    //   fontWeight: stateMemory.fontWeight,
    //   fontStyle: stateMemory.fontStyle,
    //   textDecoration: stateMemory.textDecoration,
    //   bgImg: activeImage,
    //   borderRadius: '3px',
    //   backgroundColor: 'rgba(98,188,221,.3)',
    // };
    //console.log('savedCanvasData');
    return savedCanvasData;
  } else if (type === 'my_signature') {
    //console.log('Signature');
    //console.log(event);
    let savedCanvasData;
    const width =  200  ;
    const height = 60  ;
    const randomId = Math.floor(1000 + Math.random() * 9000);
    if (imageUrlLines === 'image') {
      if (signerIdData === true || signerIdData === 'true') {
        savedCanvasData = {
          id: randomId,
          x: event.x,
          y: event.y,
          url: imageUrlSig,
          lines: imageUrlLines || null,
          width: width,
          // height: 'auto',
          height: height,

          type,
          bgImg: activeImage,
          tooltip: '',
          signer_id_receive: stateMemory,
          page_no: pageNumber,
        };
      } else {
        savedCanvasData = {
          id: randomId,
          x: event.x,
          y: event.y,
          url: imageUrlSig,
          lines: imageUrlLines || null,
          width: width,
          // height: 'auto',
          height: height,

          type,
          bgImg: activeImage,
          tooltip: '',
          page_no: pageNumber,
        };
      }
    } else {
      if (signerIdData === true || signerIdData === 'true') {
        savedCanvasData = {
          id: randomId,
          x: event.x,
          y: event.y,
          url: imageUrlSig,
          lines: imageUrlLines || null,
          width: width,
          height: height,
          type,
          bgImg: activeImage,
          tooltip: '',
          signer_id_receive: stateMemory,
          page_no: pageNumber,
        };
      } else {
        savedCanvasData = {
          id: randomId,
          x: event.x,
          y: event.y,
          url: imageUrlSig,
          lines: imageUrlLines || null,
          width: width,
          height: height,
          type,
          bgImg: activeImage,
          tooltip: '',
          page_no: pageNumber,
        };
      }
    }

    return savedCanvasData;
  } else if (type === 'my_initials') {
    //console.log('Initials');
    //console.log(event);
    const width =  60  ;
    const height = 60  ;
    let savedCanvasData;
    const randomId = Math.floor(1000 + Math.random() * 9000);
    if (imageUrlLines === 'image') {

      if (control === true || control === 'true') {
        
        savedCanvasData = {
          id: randomId,
          x: event.x,
          y: event.y,
          url: imageUrlSig,
          lines: imageUrlLines || null,
          width: width,
          // height: 'auto',
          height: height,
          type,
          bgImg: activeImage,
          tooltip: '',
          signer_id_receive: stateMemory,
          page_no: pageNumber,
        };
      } else {
        savedCanvasData = {
          id: randomId,
          x: event.x,
          y: event.y,
          url: imageUrlSig,
          lines: imageUrlLines || null,
          width: width,
          // height: 'auto',
          height: height,
          type,
          bgImg: activeImage,
          tooltip: '',
          page_no: pageNumber,
        };
      }
    } else {
      console.log("control 4354")

      console.log(stateMemory)
      console.log(signer_id)
      console.log(signerIdData)

      if (control === true || control === 'true') {
        savedCanvasData = {
          id: randomId,
          x: event.x,
          y: event.y,
          url: imageUrlSig,
          lines: imageUrlLines || null,
          width: width,
          height: height,
          type,
          bgImg: activeImage,
          tooltip: '',
          signer_id_receive: stateMemory,
          page_no: pageNumber,
        };
      } else {
        savedCanvasData = {
          id: randomId,
          x: event.x,
          y: event.y,
          url: imageUrlSig,
          lines: imageUrlLines || null,
          width: width,
          height: height,
          type,
          bgImg: activeImage,
          tooltip: '',
          page_no: pageNumber,
        };
      }
    }
    // savedCanvasData = {
    //   id: randomId,
    //   x: event.x,
    //   y: event.y,
    //   url: imageUrlSig,
    //   lines: imageUrlLines || null,
    //   width: 60,
    //   height: 'auto',
    //   type,
    //   bgImg: activeImage,
    //   tooltip: '',
    // };

    return savedCanvasData;
  } else if (type === 'date') {
    const randomId = Math.floor(1000 + Math.random() * 9000);

    const x = event.x;
    const y = event.y;

    const fontSize = 10;

    const text = new Date();
    let savedCanvasData;
    if (control === true || control === 'true') {
      savedCanvasData = {
        id: randomId,
        x,
        y,
        text,
        width: 100,
        height: 20,
        type,
        fontSize: fontSize,
        bgImg: activeImage,
        backgroundColor: 'rgba(98,188,221,.3)',
        format: 'm-d-y',
        signer_id_receive: signer_id,
        page_no: pageNumber,
      };
    } else {
      savedCanvasData = {
        id: randomId,
        x,
        y,
        text,
        width: 100,
        height: 20,
        type,
        fontSize: fontSize,
        bgImg: activeImage,
        backgroundColor: 'rgba(98,188,221,.3)',
        format: 'm-d-y',
        page_no: pageNumber,
      };
    }

    return savedCanvasData;
  } else if (type === 'checkmark') {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const x = event.x;
    const y = event.y;
    const text = true;
    const fontSize = 12;
    let savedCanvasData;
    if (control === true || control === 'true') {
      savedCanvasData = {
        id: randomId,
        x,
        y,
        text,
        placeholder: '',
        width: 30,
        height: 20,
        type,
        fontSize: fontSize,
        bgImg: activeImage,
        signer_id_receive: signer_id,
        page_no: pageNumber,
      };
    } else {
      savedCanvasData = {
        id: randomId,
        x,
        y,
        text,
        placeholder: '',
        width: 30,
        height: 20,
        type,
        fontSize: fontSize,
        bgImg: activeImage,
        page_no: pageNumber,
      };
    }

    return savedCanvasData;
  } else if (type === 'radio') {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const text = '✔';
    const fontSize = 20;
    const randomId = Math.floor(1000 + Math.random() * 9000);

    const savedCanvasData = {
      id: randomId,
      x,
      y,
      text,
      width: 200,
      height: 60,
      type,
      fontSize: fontSize,
      bgImg: activeImage,
    };

    return savedCanvasData;
  } else if (type === 'highlight') {
    const x = event.x;
    const y = event.y;
    const text = '✔';
    const fontSize = 20;
    const randomId = Math.floor(1000 + Math.random() * 9000);
    let savedCanvasData;
    if (control === true || control === 'true') {
      savedCanvasData = {
        id: randomId,
        x,
        y,
        text,
        width: 150,
        height: 30,
        type,
        fontSize: fontSize,
        bgImg: activeImage,
        backgroundColor: '#ffff7f',
        signer_id_receive: signer_id,
        page_no: pageNumber,
      };
    } else {
      savedCanvasData = {
        id: randomId,
        x,
        y,
        text,
        width: 150,
        height: 30,
        type,
        fontSize: fontSize,
        bgImg: activeImage,
        backgroundColor: '#ffff7f',
        page_no: pageNumber,
      };
    }

    return savedCanvasData;
  } else if (type === 'stamp') {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    //console.log(type);
    //console.log(event);
    //console.log(imageUrlSig);
    // imageUrlLines,
    // signerIdData,
    console.log("pageNumber")
    console.log(pageNumber)
    let savedCanvasData;
    if (imageUrlLines === true || imageUrlLines === 'true') {
      if (control === true || control === 'true') {
        
        savedCanvasData = {
          id: randomId,
          x: event.x,
          y: event.y,
          url: imageUrlSig,
          // lines: imageUrlLines || null,
          width: 80,
          // height: 'auto',
          height: 80,
          type,
          bgImg: activeImage,
          signer_id_receive: signerIdData,
          page_no: pageNumber,
        };
      } else {
      savedCanvasData = {
        id: randomId,
        x: event.x,
        y: event.y,
        url: imageUrlSig,
        // lines: imageUrlLines || null,
        width: 80,
        height: 80,
        type,
        bgImg: activeImage,
        signer_id_receive: signerIdData,
        page_no: pageNumber,
      };
    }
    } else {
      if (control === true || control === 'true') {
        
        savedCanvasData = {
          id: randomId,
          x: event.x,
          y: event.y,
          url: imageUrlSig,
          // lines: imageUrlLines || null,
          width: 80,
          // height: 'auto',
          height: 80,
          type,
          bgImg: activeImage,
          signer_id_receive: signerIdData,
          page_no: pageNumber,
        };
      } else {
      savedCanvasData = {
        id: randomId,
        x: event.x,
        y: event.y,
        url: imageUrlSig,
        // lines: imageUrlLines || null,
        width: 80,
        height: 80,
        type,
        bgImg: activeImage,
        page_no: pageNumber,
      };
    }
    }

    return savedCanvasData;
  } else if (type === 'signer_text') {
    //console.log('signer yecfhgdshj');
    //console.log(signerIdData);
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const x = event.x;
    const y = event.y;
    const text = ' ';
    const FontFam = stateMemory.fontFamily;
    const fontSize = stateMemory.fontSize;
    const color = '#727272';
    const savedCanvasData = {
      id: randomId,
      x,
      y,
      text,
      placeholder: 'Enter Placeholder',
      width: 120,
      height: stateMemory.fontSize >= 18 ? 35 : 25,
      type,
      fontSize: fontSize,
      color: color,
      fontFamily: FontFam,
      fontWeight: stateMemory.fontWeight,
      fontStyle: stateMemory.fontStyle,
      signer_id: signerIdData,
      required: stateMemory.required,
      bgImg: activeImage,
      characterLimit: 4000,
      tooltip: '',
      page_no: pageNumber,
      backgroundColor: imageUrlSig === null || imageUrlSig === undefined ? 'rgb(98 188 221 / 28%)' : imageUrlSig,
    };
    //console.log('savedCanvasData');
    return savedCanvasData;
  } else if (type === 'signer_date') {
    const x = event.x;
    const y = event.y;
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const fontSize = 12;
    const text = new Date();
    const savedCanvasData = {
      id: randomId,
      x,
      y,
      text,
      width: 80,
      height: 20,
      signer_id: signerIdData,
      type,
      fontSize: fontSize,
      required: stateMemory.required,
      bgImg: activeImage,
      format: 'm-d-y',
      tooltip: '',
      page_no: pageNumber,
      backgroundColor: imageUrlSig === null || imageUrlSig === undefined ? 'rgb(98 188 221 / 28%)' : imageUrlSig,
    };

    return savedCanvasData;
  } else if (type === 'signer_chooseImgDrivingL') {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const width =  250  ;
    const height = 100  ;
    const savedCanvasData = {
      id: randomId,
      x: event.x,
      y: event.y,
      url: null,
      lines: null,
      width: width,
      height: height,
      type,
      required: stateMemory.required,
      tooltip: '',
      signer_id: signerIdData,
      bgImg: activeImage,
      backgroundColor: imageUrlSig === null || imageUrlSig === undefined ? 'rgb(98 188 221 / 28%)' : imageUrlSig,
      page_no: pageNumber,
    };

    return savedCanvasData;
  } else if (type === 'signer_chooseImgPassportPhoto') {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const width =  250  ;
    const height = 150  ;
    const savedCanvasData = {
      id: randomId,
      x: event.x,
      y: event.y,
      url: null,
      lines: null,
      width: width,
      height: height,
      type,
      tooltip: '',
      signer_id: signerIdData,
      bgImg: activeImage,
      required: stateMemory.required,
      backgroundColor: imageUrlSig === null || imageUrlSig === undefined ? 'rgb(98 188 221 / 28%)' : imageUrlSig,
      page_no: pageNumber,
    };

    return savedCanvasData;
  } else if (type === 'signer_chooseImgStamp') {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const width =  90  ;
    const height = 90  ;
    const savedCanvasData = {
      id: randomId,
      x: event.x,
      y: event.y,
      url: null,
      lines: null,
      width: width,
      height: height,
      type,
      signer_id: signerIdData,
      bgImg: activeImage,
      tooltip: '',
      required: stateMemory.required,
      backgroundColor: imageUrlSig === null || imageUrlSig === undefined ? 'rgb(98 188 221 / 28%)' : imageUrlSig,
      page_no: pageNumber,
    };

    return savedCanvasData;
  } else if (type === 'signer_initials') {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const width = 120*scale  ;
    const height = 38 *scale ;
    const savedCanvasData = {
      id: randomId,
      x: event.x,
      y: event.y,
      url: null,
      lines: imageUrlLines || null,
      width: width,
      height: height,
      type,
      tooltip: '',
      signer_id: signerIdData,
      required: stateMemory.required,
      bgImg: activeImage,
      backgroundColor: imageUrlSig === null || imageUrlSig === undefined ? 'rgb(98 188 221 / 28%)' : imageUrlSig,
      page_no: pageNumber,
    };

    return savedCanvasData;
  } else if (type === 'signer_initials_text') {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const width =  35*scale  ;
    const height = 35*scale;
    const savedCanvasData = {
      id: randomId,
      x: event.x,
      y: event.y,
      url: null,
      lines: imageUrlLines || null,
      width: width,
      height: height,
      type,
      tooltip: '',
      signer_id: signerIdData,
      required: stateMemory.required,
      bgImg: activeImage,
      backgroundColor: imageUrlSig === null || imageUrlSig === undefined ? 'rgb(98 188 221 / 28%)' : imageUrlSig,
      page_no: pageNumber,
    };

    return savedCanvasData;
  } else if (type === 'signer_checkmark') {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const x = event.x;
    const y = event.y;
    const text = false;
    const fontSize = 15;

    const savedCanvasData = {
      id: randomId,
      x,
      y,
      text,
      placeholder: '',
      width: 30,
      height: 30,
      type,
      fontSize: fontSize,
      signer_id: signerIdData,
      bgImg: activeImage,
      tooltip: '',
      required: stateMemory.required,
      backgroundColor: imageUrlSig === null || imageUrlSig === undefined ? 'rgb(98 188 221 / 28%)' : imageUrlSig,
      page_no: pageNumber,
    };

    return savedCanvasData;
  } else if (type === 'signer_radio') {
    const x = event.x;
    const y = event.y;
    const text = false;
    const fontSize = 15;
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const savedCanvasData = {
      id: randomId,
      x,
      y,
      text,
      placeholder: 'Enter Item name',
      width: 30,
      height: 30,
      type,
      direction: 'column',
      fontSize: fontSize,
      tooltip: '',
      required: stateMemory.required,
      options: imageUrlLines,
      signer_id: signerIdData,
      bgImg: activeImage,
      backgroundColor: imageUrlSig === null || imageUrlSig === undefined ? 'rgb(98 188 221 / 28%)' : imageUrlSig,
    };

    return savedCanvasData;
  } else if (type === 'signer_dropdown') {
    const x = event.x;
    const y = event.y;
    const text = null;
    const fontSize = 12;
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const savedCanvasData = {
      id: randomId,
      x,
      y,
      text,
      placeholder: 'Enter Item name',
      width: 90,
      height: 20,
      type,
      direction: 'column',
      fontSize: fontSize,
      tooltip: '',
      options: [],
      signer_id: signerIdData,
      bgImg: activeImage,
      required: stateMemory.required,
      backgroundColor: imageUrlSig === null || imageUrlSig === undefined ? 'rgb(98 188 221 / 28%)' : imageUrlSig,
      page_no: pageNumber,
    };

    return savedCanvasData;
  } else {
  }
};
