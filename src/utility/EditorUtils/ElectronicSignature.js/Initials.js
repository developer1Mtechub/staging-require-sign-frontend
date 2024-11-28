import {useState, useRef} from 'react';
import {Button, Card, Col, Form, FormGroup, Input, Label, Row, Spinner} from 'reactstrap';
import html2canvas from 'html2canvas';
import {Check} from 'react-feather';
import { useSelector } from "react-redux";

import { selectPrimaryColor } from '../../../redux/navbar';
const TypeInitials = ({onSaveText, PrevSignatureArray}) => {
  const [text, setText] = useState('IN');
  const [selectedFont, setSelectedFont] = useState('Brush Script MT');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [generatedImage, setGeneratedImage] = useState(null);
  const handleFontChange = e => {
    setSelectedFont(e.target.value);
  };
  const primary_color = useSelector(selectPrimaryColor);

  const handleColorChange = color => {
    setSelectedColor(color);
  };
  const [loaderButtonSave, setLoaderButtonSave] = useState(false);
  const handleSaveText = () => {
    setLoaderButtonSave(true);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const padding = 20;

    // Calculate canvas width based on text width and padding
    // const canvasWidth = context.measureText(text).width + 2 * padding;
    // canvas.width = canvasWidth; // Double the resolution
    const canvasWidth = context.measureText(text).width + 2 * padding;
    const canvasHeight = 100; // Set to a specific value based on your requirements
    const devicePixelRatio = window.devicePixelRatio || 1; // Get the device pixel ratio
    // Scale the canvas by the device pixel ratio to improve resolution
    canvas.width = canvasWidth * devicePixelRatio;
    canvas.height = canvasHeight * devicePixelRatio;
    context.scale(devicePixelRatio, devicePixelRatio);

    // Calculate the maximum font size to fit the text within the canvas
    const maxFontSize = 36; // Adjust as needed
    const minFontSize = 20; // Adjust as needed
    const maxLineWidth = canvasWidth - 2 * padding;
    const fontSize = Math.min(maxFontSize, (maxLineWidth / context.measureText(text).width) * maxFontSize, minFontSize);

    // Set canvas font properties
    // context.font = `${fontSize}px ${selectedFont}`;
    // end
    // Set canvas font properties
    context.font = `${fontSize}px ${selectedFont}`;
    context.fillStyle = selectedColor;

    // Disable image smoothing for sharp text rendering
    // context.imageSmoothingEnabled = false;

    // Calculate the text baseline to vertically center the text
    const textMetrics = context.measureText(text);
    const x = (canvasWidth - textMetrics.width) / 2;
    const y = (canvas.height + fontSize) / 2;

    // Fill the canvas with the text
    context.fillText(text, x, y);

    const image = new Image();
    image.src = canvas.toDataURL();

    setGeneratedImage(image.src);
    onSaveText(image.src, null);
    setLoaderButtonSave(false);
  };

  // fonts
  const [FontsArray, setFontsArray] = useState([
    'Brush Script MT',
    'Edwardian Script ITC',
    'Lucida Handwriting',
    'Monotype Corsiva',
    '"Great Vibes", cursive',
    '"Dancing Script", cursive',
    '"Allura", cursive',
    '"Pacifico", cursive',
  ]);
  // input as text
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('Initials');

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = e => {
    const name = e.target.value;
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
    setInputValue(name);
    setText(initials);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };
  // start
  //  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(30);
  const [fontColor, setFontColor] = useState('#000000');
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(100);
  const previewRef = useRef(null);

  const generateImage = () => {
    setLoaderButtonSave(true);
    html2canvas(previewRef.current).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      onSaveText(imgData, null);
      setLoaderButtonSave(false);
      //   const link = document.createElement("a");
      //   link.href = imgData;
      //   link.download = "generated-image.png";
      //   link.click();
    });
  };

  return (
    <>
      <div className="d-flex flex-column">
        <Row>
          <Col sm={12}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h4 style={{color: 'grey'}}>Type Name Here</h4>
              <h5
                style={{color: primary_color, cursor: 'pointer'}}
                onClick={() => {
                  setText('');
                  setInputValue('Initials');
                  setSelectedFont('Brush Script MT');
                  setSelectedColor('#000');
                }}>
                Clear Initials
              </h5>
            </div>
          </Col>
          <Col sm={12}>
            <Row>
              <Col sm="6">
                {isEditing ? (
                  <Input
                    autoFocus
                    style={{
                      maxWidth: '100%',
                      width: '100%',
                      padding: '5px 5px 5px 30px',
                      boxShadow: 'none',
                      marginBottom: '3%',
                      textAlign: 'center',
                      borderRadius: '5px',
                      border: '1px solid #2293fb',
                      // fontFamily: selectedFont,
                      fontSize: '20px',
                      // color: selectedColor
                    }}
                    placeholder="Name"
                    value={inputValue === 'Initials' ? '' : inputValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                ) : (
                  <p
                    onClick={handleClick}
                    style={{
                      borderBottom: '1px solid #2293fb',
                      padding: '11px 5px 11px 30px',
                      width: '100%',
                      textAlign: 'center',
                      // borderRadius: '5px',
                      // fontFamily: selectedFont,
                      fontSize: '20px',
                      // borderBottom: '1px solid lightGray'
                    }}>
                    {inputValue}
                  </p>
                )}
              </Col>
              <Col sm="6">
                <div
                  ref={previewRef}
                  style={{
                    display: 'inline-block',
                    border: '1px solid #f0f0f0',
                    fontFamily: selectedFont,
                    background: '#f0f0f0',
                    width: 'auto',
                    minWidth: '10px',
                    height: 'auto',
                    fontSize,
                    color: selectedColor,
                    textAlign: 'center',
                    // lineHeight: height + "px",
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    padding: 0,
                  }}>
                  {text}
                </div>
              </Col>
            </Row>
          </Col>
          <Col sm={12}>
            <Row>
              {FontsArray.map(font => (
                <Col sm="6">
                  <div className="flexWidth ">
                    <FormGroup
                      check
                      inline
                      style={{
                        maxWidth: '200px',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                      }}>
                      <Input type="checkbox" checked={selectedFont === font} onChange={handleFontChange} value={font} />
                      <Label
                        check
                        style={{
                          fontFamily: font,
                          // color: selectedColor,
                          fontSize: '25px',
                          maxWidth: '200px', // limit the width of the text
                          overflow: 'hidden', // hide the overflow
                          textOverflow: 'ellipsis', // add an ellipsis when the text overflows
                          whiteSpace: 'nowrap',
                        }}>
                        {text === '' ? 'IN' : text}
                      </Label>
                    </FormGroup>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col sm={12} style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px'}}>
            <Button
              size="sm"
              disabled={loaderButtonSave}
              style={{boxShadow: 'none', fontSize: '16px', height: '35px'}}
              color="primary"
              onClick={generateImage}>
              {loaderButtonSave ? <Spinner size="sm" color="light" /> : null}
              <span className="align-middle ms-25">Done </span>
            </Button>
            <div className="demo-inline-spacing mb-1">
              <span
                onClick={() => handleColorChange('#000000')}
                style={{
                  width: '40px',
                  height: '30px',
                  backgroundColor: '#000000',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: selectedColor === '#000000' ? `1px solid ${primary_color} ` : '1px solid #000000',
                }}>
                {selectedColor === '#000000' && <Check size={20} style={{color: 'white'}} />}{' '}
                {/* Add this to show the check icon */}
              </span>

              <span
                onClick={() => handleColorChange('#00008B')}
                style={{
                  width: '40px',
                  height: '30px',
                  backgroundColor: '#00008B',
                  border: selectedColor === '#00008B' ?`1px solid ${primary_color} ` : '1px solid #00008B',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {selectedColor === '#00008B' && <Check size={20} style={{color: 'white'}} />}{' '}
                {/* Add this to show the check icon */}
              </span>
              <span
                onClick={() => handleColorChange('#53bdeb')}
                style={{
                  width: '40px',
                  height: '30px',
                  backgroundColor: '#53bdeb',
                  border: selectedColor === '#53bdeb' ? `1px solid ${primary_color} ` : '1px solid #53bdeb',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {selectedColor === '#53bdeb' && <Check size={20} style={{color: 'white'}} />}{' '}
                {/* Add this to show the check icon */}
              </span>
            </div>
            {/* <Form>
              <FormGroup check inline className="form-check form-check-secondary">
                <Input
                  style={{
                    backgroundColor: '#000',
                    boxShadow: 'none',
                  }}
                  checked={selectedColor === '#000'}
                  type="radio"
                  name="color"
                  value="#000"
                  onClick={handleColorChange}
                />
              </FormGroup>
              <FormGroup check inline className="form-check form-check-primary">
                <Input
                  style={{
                    backgroundColor: '#0000ff',
                    boxShadow: 'none',
                  }}
                  checked={selectedColor === '#0000ff'}
                  type="radio"
                  name="color"
                  value="#0000ff"
                  onClick={handleColorChange}
                />
              </FormGroup>
            </Form> */}
          </Col>
          <Col sm={12} style={{display: 'flex', justifyContent: 'center', marginTop: '10px'}}>
            <h5 >
              By selecting Signature ,I agree that the signature will be the electronic representation of my signature
              for all purposes when I use them on documents, including legally binding contracts.
            </h5>
          </Col>
        </Row>

        {/* start  */}
        <div className="App">
          {/* <div>
        <label>Text:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <label>Font Size:</label>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        />
      </div>
      <div>
        <label>Font Color:</label>
        <SketchPicker
          color={fontColor}
          onChangeComplete={(color) => setFontColor(color.hex)}
        />
      </div>
      <div>
        <label>Width:</label>
        <input
          type="number"
          value={width}
          onChange={(e) => {
            //console.log("new width", e.target.value);
            setWidth(e.target.value);
          }}
        />
      </div>
      <div>
        <label>Height:</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div> */}
          {/* <button onClick={generateImage}>Generate PNG</button> */}
          {/* <div
        ref={previewRef}
        style={{
          display: "inline-block",
          border: "1px solid #C7C7C7",
          fontFamily: selectedFont,
          background: "#E4E3E3",
          width: width + "px",
          height: height + "px",
          fontSize,
          color: selectedColor,
          textAlign: "center",
          lineHeight: height + "px",
          whiteSpace: "nowrap",
          overflow: "hidden"
        }}
      >
        {text}
      </div> */}
        </div>
        {/* end  */}
        {/* {generatedImage && <img src={generatedImage} alt="Generated Text" />} */}
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    {PrevSignatureArray && PrevSignatureArray.length > 0 ? (
                        PrevSignatureArray.map((item, index) => (
                            <div key={index} onClick={() => onSaveText(item?.signature_image_url, "prevSign")} style={{
                                flex: '1 0 20%',
                                marginTop: '5px',
                            }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Card>
                                    <img width="100%" src={`${BASE_URL}${item?.signature_image_url}`} alt="Card image cap" />
                                </Card>
                            </div>
                        ))
                    ) : null}
                </div> */}
      </div>
    </>
  );
};

export default TypeInitials;
