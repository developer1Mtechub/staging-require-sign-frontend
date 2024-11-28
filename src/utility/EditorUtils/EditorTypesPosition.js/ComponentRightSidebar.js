import React, {useState} from 'react';
import {Row, Col, Button} from 'reactstrap';
import {
  Type,
  Calendar,
  Edit,
  Zap,
  Image,
  FileText,
  Bold,
  Italic,
  Underline,
  Trash,
  Plus,
  ChevronDown,
  CheckCircle,
  Circle,
  MoreVertical,
} from 'react-feather';
import {formatDate} from '../../Utils';
import Slidedown from 'react-slidedown';
import 'react-slidedown/lib/slidedown.css';
const ComponentRightSidebar = ({
  editedItem,
  resizingIndex,
  handleInputChanged,
  handleInputRequired,
  handleFontSizeChange,
  handleFontFamChange,
  handleFontWeightChange,
  handleFontStyleChange,
  handleTextDecorationChange,
  handleDateChanged,
  formatDateUSA,
  formatDateInternational,
  formatDateCustom,
  handleDeleteCurrentPosition,
  handleAddSelectOptions,
  handleFormatChange,
  handleCharacterLimitChange,
  handleTooltipChanged,
  stateMemory
  // dataSavedTextMemory
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = index => {
    setDraggedIndex(index);
  };
  const handleDragOver = index => {
    if (draggedIndex === null || index === draggedIndex) return;
    const newOptions = [...options];
    const draggedOption = newOptions[draggedIndex];
    newOptions.splice(draggedIndex, 1);
    newOptions.splice(index, 0, draggedOption);
    setDraggedIndex(index);
    setOptions(newOptions);
    handleAddSelectOptions(newOptions, resizingIndex);
    // Update options state to reflect the new order
    // Example: updateOptions(newOptions);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };
  const [newOption, setNewOption] = useState({label: '', value: ''});
  const [options, setOptions] = useState(editedItem.options || []);

  const handleAddOption = () => {
    if (newOption.label && newOption.value) {
      setOptions([...options, newOption]);
      handleAddSelectOptions([...options, newOption], resizingIndex);
      setNewOption({label: '', value: ''});
    }
  };

  const handleRemoveOption = index => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
    handleAddSelectOptions(updatedOptions, resizingIndex);
  };

  const renderInputFields = () => {
    switch (editedItem.type) {
      case 'signer_text':
        return (
          <React.Fragment>
            <Col
              xs={12}
              md={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                marginBlock: '10px',
              }}>
              <input
                type="checkbox"
                style={{fontSize: '16px'}}
                checked={editedItem.required}
                onChange={e => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
              />
              <h3
                onClick={() => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
                className="fw-bold"
                style={{marginLeft: '10px', marginTop: '10px'}}>
                Required
              </h3>
            </Col>
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Character Limit(optional)</h3>
              <input
                type="number"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem?.characterLimit === 4000 ? '' : editedItem?.characterLimit}
                onChange={e => {
                  // stateMemory(e.target.value,'Character Limit')
                  handleCharacterLimitChange(e, resizingIndex);
                }}
              />
            </Col>
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Hint</h3>
              <input
                type="text"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem?.tooltip}
                onChange={e => handleTooltipChanged(e, resizingIndex)}
              />
            </Col>

            <Col xs={12} md={12} style={{display: 'flex', flexDirection: 'column', marginBlock: '10px'}}>
              <h3 className="fw-bold">Font size</h3>

              <select
                style={{width: '95%', fontSize: '16px', height: '30px'}}
                value={editedItem.fontSize}
                onChange={e => handleFontSizeChange(resizingIndex, e.target.value)}>
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={14}>14</option>
                <option value={16}>16</option>
                <option value={18}>18</option>
                <option value={20}>20</option>
                <option value={22}>22</option>
                <option value={24}>24</option>
              </select>
            </Col>
            <Col xs={12} md={12} style={{display: 'flex', flexDirection: 'column', marginBlock: '10px'}}>
              <h3 className="fw-bold">Font Family</h3>
              <select
                id="fontSelector"
                style={{fontSize: '16px', maxWidth: '95%', padding: '5px'}}
                value={editedItem?.fontFamily}
                onChange={e => handleFontFamChange(resizingIndex, e.target.value)}>
                <option value="">Select a Font</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Courier New">Courier New</option>
              </select>
            </Col>

            <Col
              xs={12}
              md={12}
              style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginBlock: '10px'}}>
              <Bold
                size={20}
                onClick={() => handleFontWeightChange(resizingIndex, editedItem?.fontWeight)}
                style={{
                  cursor: 'pointer',
                  border: editedItem?.fontWeight === 400 ? 'none' : '1px solid grey',
                }}
              />
              <Italic
                onClick={() => handleFontStyleChange(resizingIndex, editedItem?.fontStyle)}
                size={20}
                style={{
                  marginLeft: '10px',
                  cursor: 'pointer',
                  border: editedItem?.fontStyle === 'italic' ? '1px solid grey' : 'none',
                }}
              />
              <Underline
                onClick={() => handleTextDecorationChange(resizingIndex, editedItem?.textDecoration)}
                size={20}
                style={{
                  marginLeft: '10px',
                  cursor: 'pointer',
                  border: editedItem?.textDecoration === 'underline' ? '1px solid grey' : 'none',
                }}
              />
            </Col>
          </React.Fragment>
        );
      case 'my_text':
        return (
          <React.Fragment>
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Add Text</h3>
              <input
                style={{width: '95%', fontSize: '16px'}}
                // autoFocus
                value={editedItem?.text}
                placeholder={editedItem?.text === '' ? editedItem?.placeholder : null}
                onChange={e => handleInputChanged(e, resizingIndex)}
              />
            </Col>
            <Col xs={12} md={12} style={{display: 'flex', flexDirection: 'column', marginBlock: '10px'}}>
              <h3 className="fw-bold">Font size</h3>

              <select
                style={{width: '95%', fontSize: '16px', height: '30px'}}
                value={stateMemory.fontSize
                  // editedItem.fontSize
                }
                onChange={e => handleFontSizeChange(resizingIndex, e.target.value)}>
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={15}>15</option>
                <option value={16}>16</option>
                <option value={18}>18</option>
                <option value={20}>20</option>
                <option value={22}>22</option>
                <option value={24}>24</option>
              </select>
            </Col>
            <Col xs={12} md={12} style={{display: 'flex', flexDirection: 'column', marginBlock: '10px'}}>
              <h3 className="fw-bold">Font Family</h3>
              <select
                id="fontSelector"
                style={{fontSize: '16px', maxWidth: '95%', padding: '5px'}}
                value={editedItem?.fontFamily}
                onChange={e => handleFontFamChange(resizingIndex, e.target.value)}>
                <option value="">Select a Font</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Courier New">Courier New</option>
              </select>
            </Col>

            <Col
              xs={12}
              md={12}
              style={{display: 'flex', justifyContent: 'left', alignItems: 'center', marginBlock: '10px'}}>
              <Bold
                size={20}
                onClick={() => handleFontWeightChange(resizingIndex, editedItem?.fontWeight)}
                style={{
                  cursor: 'pointer',
                  border: editedItem?.fontWeight === 400 ? 'none' : '1px solid grey',
                }}
              />
              <Italic
                onClick={() => handleFontStyleChange(resizingIndex, editedItem?.fontStyle)}
                size={20}
                style={{
                  marginLeft: '10px',
                  cursor: 'pointer',
                  border: editedItem?.fontStyle === 'italic' ? '1px solid grey' : 'none',
                }}
              />
              <Underline
                onClick={() => handleTextDecorationChange(resizingIndex, editedItem?.textDecoration)}
                size={20}
                style={{
                  marginLeft: '10px',
                  cursor: 'pointer',
                  border: editedItem?.textDecoration === 'underline' ? '1px solid grey' : 'none',
                }}
              />
            </Col>
          </React.Fragment>
        );
      case 'date':
        return (
          <React.Fragment>
            <Col xs={12} md={12} style={{display: 'flex', flexDirection: 'column', marginBlock: '10px'}}>
              <h3 className="fw-bold">Change Date</h3>
              {/* {formatDate(editedItem.text)} */}
              <input
                type="date"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem.text instanceof Date ? editedItem.text.toISOString().split('T')[0] : ''}
                min={new Date().toISOString().split('T')[0]} // Disables past dates
                // value={editedItem.text ? editedItem.text.toISOString().split('T')[0] : ''}
                onChange={e => handleDateChanged(e, resizingIndex)}
              />
            </Col>

            <Col xs={12} md={12} style={{display: 'flex', flexDirection: 'column', marginBlock: '10px'}}>
              <h3 className="fw-bold">Font size</h3>

              <select
                style={{width: '95%', fontSize: '16px', height: '30px'}}
                value={editedItem.fontSize}
                onChange={e => handleFontSizeChange(resizingIndex, e.target.value)}>
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={15}>15</option>
                <option value={16}>16</option>
                <option value={18}>18</option>
                <option value={20}>20</option>
                <option value={22}>22</option>
                <option value={24}>24</option>
              </select>
            </Col>
            <Col xs={12} md={12} style={{display: 'flex', flexDirection: 'column', marginBlock: '10px'}}>
              <h3 className="fw-bold">Change Format</h3>
              <select
                style={{fontSize: '16px', maxWidth: '95%', padding: '5px'}}
                id="fontSelector"
                value={editedItem.format}
                onChange={e => handleFormatChange(resizingIndex, e)}>
                <option value="">Select a Format</option>
                <option value="m/d/y">{formatDateUSA(editedItem.text)}</option>
                <option value="d/m/y">{formatDateInternational(editedItem.text)}</option>
                <option value="m-d-y">{formatDateCustom(editedItem.text)}</option>
              </select>
            </Col>
            {/* Add other date-related fields here */}
          </React.Fragment>
        );
      case 'signer_date':
        return (
          <React.Fragment>
            <Col
              xs={12}
              md={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                marginBlock: '10px',
              }}>
              <input
                type="checkbox"
                style={{fontSize: '16px'}}
                checked={editedItem.required}
                onChange={e => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
              />
              <h3
                onClick={() => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
                className="fw-bold"
                style={{marginLeft: '10px', marginTop: '10px'}}>
                Required
              </h3>
            </Col>
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Hint</h3>
              <input
                type="text"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem?.tooltip}
                onChange={e => handleTooltipChanged(e, resizingIndex)}
              />
            </Col>
            <Col xs={12} md={12} style={{display: 'flex', flexDirection: 'column', marginBlock: '10px'}}>
              <h3 className="fw-bold">Font size</h3>

              <select
                style={{width: '95%', fontSize: '16px', height: '30px'}}
                value={editedItem.fontSize}
                onChange={e => handleFontSizeChange(resizingIndex, e.target.value)}>
                <option value={10}>10</option>
                <option value={12}>12</option>
                <option value={15}>15</option>
                <option value={16}>16</option>
                <option value={18}>18</option>
                <option value={20}>20</option>
                <option value={22}>22</option>
                <option value={24}>24</option>
              </select>
            </Col>
            <Col xs={12} md={12} style={{display: 'flex', flexDirection: 'column', marginBlock: '10px'}}>
              <h3 className="fw-bold">Change Format</h3>
              <select
                style={{fontSize: '16px', maxWidth: '95%', padding: '5px'}}
                id="fontSelector"
                value={editedItem.format}
                onChange={e => handleFormatChange(resizingIndex, e)}>
                <option value="">Select a Format</option>
                <option value="m/d/y">{formatDateUSA(editedItem.text)}</option>
                <option value="d/m/y">{formatDateInternational(editedItem.text)}</option>
                <option value="m-d-y">{formatDateCustom(editedItem.text)}</option>
              </select>
            </Col>
            {/* Add other date-related fields here */}
          </React.Fragment>
        );
      case 'signer_initials':
        return (
          <React.Fragment>
            <Col
              xs={12}
              md={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                marginBlock: '10px',
              }}>
              <input
                type="checkbox"
                style={{fontSize: '16px'}}
                checked={editedItem.required}
                onChange={e => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
              />
              <h3
                onClick={() => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
                className="fw-bold"
                style={{marginLeft: '10px', marginTop: '10px'}}>
                Required
              </h3>
            </Col>
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Hint</h3>
              <input
                type="text"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem?.tooltip}
                onChange={e => handleTooltipChanged(e, resizingIndex)}
              />
            </Col>
          </React.Fragment>
        );
      case 'signer_initials_text':
        return (
          <React.Fragment>
            <Col
              xs={12}
              md={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                marginBlock: '10px',
              }}>
              <input
                type="checkbox"
                style={{fontSize: '16px'}}
                checked={editedItem.required}
                onChange={e => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
              />
              <h3
                onClick={() => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
                className="fw-bold"
                style={{marginLeft: '10px', marginTop: '10px'}}>
                Required
              </h3>
            </Col>
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Hint</h3>
              <input
                type="text"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem?.tooltip}
                onChange={e => handleTooltipChanged(e, resizingIndex)}
              />
            </Col>
          </React.Fragment>
        );

      case 'signer_chooseImgStamp':
        return (
          <React.Fragment>
            <Col
              xs={12}
              md={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                marginBlock: '10px',
              }}>
              <input
                type="checkbox"
                style={{fontSize: '16px'}}
                checked={editedItem.required}
                onChange={e => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
              />
              <h3
                onClick={() => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
                className="fw-bold"
                style={{marginLeft: '10px', marginTop: '10px'}}>
                Required
              </h3>
            </Col>
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Hint</h3>
              <input
                type="text"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem?.tooltip}
                onChange={e => handleTooltipChanged(e, resizingIndex)}
              />
            </Col>
          </React.Fragment>
        );
      case 'signer_chooseImgPassportPhoto':
        return (
          <React.Fragment>
            <Col
              xs={12}
              md={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                marginBlock: '10px',
              }}>
              <input
                type="checkbox"
                style={{fontSize: '16px'}}
                checked={editedItem.required}
                onChange={e => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
              />
              <h3
                onClick={() => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
                className="fw-bold"
                style={{marginLeft: '10px', marginTop: '10px'}}>
                Required
              </h3>
            </Col>
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Hint</h3>
              <input
                type="text"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem?.tooltip}
                onChange={e => handleTooltipChanged(e, resizingIndex)}
              />
            </Col>
          </React.Fragment>
        );
      case 'signer_chooseImgDrivingL':
        return (
          <React.Fragment>
            <Col
              xs={12}
              md={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                marginBlock: '10px',
              }}>
              <input
                type="checkbox"
                style={{fontSize: '16px'}}
                checked={editedItem.required}
                onChange={e => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
              />
              <h3
                onClick={() => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
                className="fw-bold"
                style={{marginLeft: '10px', marginTop: '10px'}}>
                Required
              </h3>
            </Col>
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Hint</h3>
              <input
                type="text"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem?.tooltip}
                onChange={e => handleTooltipChanged(e, resizingIndex)}
              />
            </Col>
          </React.Fragment>
        );
      // case 'signer_chooseImgDrivingL':
      //   return (
      //     <React.Fragment>
      //       <Col
      //         xs={12}
      //         md={12}
      //         style={{
      //           display: 'flex',
      //           flexDirection: 'row',
      //           justifyContent: 'left',
      //           alignItems: 'center',
      //           marginBlock: '10px',
      //         }}>
      //         <input
      //           type="checkbox"
      //           style={{fontSize: '16px'}}
      //           checked={editedItem.required}
      //             onChange={e => handleInputRequired(e.target.value, resizingIndex)}
      //         />
      //         <h3 className="fw-bold" style={{marginLeft: '10px'}}>
      //           Required
      //         </h3>
      //       </Col>
      //       <Col xs={12} md={12} style={{marginTop: '10px'}}>
      //         <h3 className="fw-bold">Hint</h3>
      //         <input
      //           type="text"
      //           style={{width: '95%', fontSize: '16px'}}
      //           autoFocus
      //           value={editedItem?.tooltip}
      //           onChange={e => handleTooltipChanged(e, resizingIndex)}
      //         />
      //       </Col>
      //     </React.Fragment>
      //   );
      case 'signer_checkmark':
        return (
          <React.Fragment>
            {/* <Col
              xs={12}
              md={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                marginBlock: '10px',
              }}>
              <input
                type="checkbox"
                style={{fontSize: '16px'}}
                checked={editedItem.required}
                onChange={e => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
              />
              <h3
                onClick={() => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
                className="fw-bold"
                style={{marginLeft: '10px', marginTop: '10px'}}>
                Required
              </h3>
            </Col> */}
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Hint</h3>
              <input
                type="text"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem?.tooltip}
                onChange={e => handleTooltipChanged(e, resizingIndex)}
              />
            </Col>
          </React.Fragment>
        );
     
      case 'signer_dropdown':
        return (
          <React.Fragment>
            <Col
              xs={12}
              md={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'left',
                alignItems: 'center',
                marginBlock: '10px',
              }}>
              <input
                type="checkbox"
                style={{fontSize: '16px'}}
                checked={editedItem.required}
                onChange={e => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
              />
              <h3
                onClick={() => {
                  if (editedItem.required === true) {
                    handleInputRequired(false, resizingIndex);
                  } else {
                    handleInputRequired(true, resizingIndex);
                  }
                }}
                className="fw-bold"
                style={{marginLeft: '10px', marginTop: '10px'}}>
                Required
              </h3>
            </Col>
            <Col xs={12} md={12} style={{marginTop: '10px'}}>
              <h3 className="fw-bold">Hint</h3>
              <input
                type="text"
                style={{width: '95%', fontSize: '16px'}}
                autoFocus
                value={editedItem?.tooltip}
                onChange={e => handleTooltipChanged(e, resizingIndex)}
              />
            </Col>
            <Col xs={12} md={12}>
              <h3 className="fw-bold mt-1">Dropdown Options</h3>

              <input
                type="text"
                style={{width: '95%', fontSize: '16px'}}
                placeholder="Option Value"
                value={newOption.label}
                maxLength={12}
                
                onChange={e => setNewOption({...newOption, label: e.target.value, value: e.target.value})}
              />
              {/* <input
                style={{width: '95%', fontSize: '16px'}}
                type="text"
                placeholder="Option Value"
                value={newOption.value}
                onChange={e => setNewOption({...newOption, value: e.target.value})}
              /> */}
              <Button
                style={{boxShadow: 'none', marginTop: '10px'}}
                size="sm"
                className="btn-icon"
                color="primary"
                onClick={handleAddOption}>
                <Plus size={14} />
                <span className="align-middle ms-25"> Add</span>
              </Button>
            </Col>
            <Col xs={12} md={12} style={{marginTop: '10px', width: '93%'}}>
            {options.length > 0 &&<>
    <h3 className="fw-bold">Options:</h3>   
    <span style={{fontSize:'14px',fontWeight:600}}>Drag to reorder</span>   
      </> }
              {options.map((option, index) => (
                <Slidedown key={index} className="option-item">
                  <div
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={() => handleDragOver(index)}
                    onDragEnd={handleDragEnd}
                    style={{display: 'flex', justifyContent: 'space-between'}}>
                    <MoreVertical size={15} style={{cursor: 'pointer'}} />
                    <h2>{option.value}</h2>
                    <Trash
                      color="red"
                      style={{cursor: 'pointer'}}
                      onClick={() => handleRemoveOption(index)}
                      size={20}
                    />
                  </div>
                  <div
                    style={{border: '1px solid lightGrey', width: '100%', height: '1px', marginBottom: '10px'}}></div>
                </Slidedown>
              ))}
            </Col>
          </React.Fragment>
        );
      default:
        return null;
    }
  };

  return (
    <Row>
      <Col
        xs={12}
        md={12}
        style={{
          padding: '5px',
          borderBottom: '.5px solid lightGrey',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {/* Add icon based on item type */}
        {editedItem.type === 'my_text' || editedItem.type === 'signer_text' ? (
          <Type size={15} />
        ) : editedItem.type === 'date' || editedItem.type === 'signer_date' ? (
          <Calendar size={15} />
        ) : editedItem.type === 'signer_initials' ? (
          <Edit size={15} />
        ) : editedItem.type === 'signer_initials_text' ? (
          <Edit size={15} />
        ) : editedItem.type === 'signer_chooseImgStamp' ? (
          <Zap size={15} />
        ) : editedItem.type === 'signer_chooseImgPassportPhoto' ? (
          <Image size={15} />
        ) : editedItem.type === 'signer_chooseImgDrivingL' ? (
          <FileText size={15} />
        ) : editedItem.type === 'signer_dropdown' ? (
          <ChevronDown size={15} />
        ) : editedItem.type === 'signer_checkmark' ? (
          <CheckCircle size={15} />
        ) : editedItem.type === 'signer_radio' ? (
          <Circle size={15} />
        ) : null}
        <h3 style={{marginLeft: '10px', paddingTop: '7px', fontWeight: 600}}>
          {editedItem.type === 'my_text'
            ? 'Text'
            : editedItem.type === 'signer_text'
            ? 'Text'
            : editedItem.type === 'date'
            ? 'Date'
            : editedItem.type === 'signer_date'
            ? 'Date'
            : editedItem.type === 'signer_initials'
            ? 'Signature'
            : editedItem.type === 'signer_initials_text'
            ? 'Initials'
            : editedItem.type === 'signer_chooseImgStamp'
            ? 'Stamp'
            : editedItem.type === 'signer_chooseImgPassportPhoto'
            ? 'Passport Photo'
            : editedItem.type === 'signer_chooseImgDrivingL'
            ? 'Driving License'
            : editedItem.type === 'signer_checkmark'
            ? 'Check Mark'
            : editedItem.type === 'signer_radio'
            ? 'Radio'
            : editedItem.type === 'signer_dropdown'
            ? 'Dropdown'
            : ''}
        </h3>
      </Col>
      {renderInputFields()}
      {/* Add other common fields here */}
      <Col
        xs={12}
        md={12}
        style={{
          position: 'absolute',
          bottom: 5,
          left:-5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBlock: '10px',
        }}>
        {/* <button
          style={{
            backgroundColor: 'red',
            color: 'white',
            width: '60%',
            border: 'none',
            fontSize: '16px',
            borderRadius: '10px',
          }}
          onClick={() => handleDeleteCurrentPosition(editedItem.id)}>
          Delete
        </button> */}
        <Button
          size="sm"
          style={{
            boxShadow: 'none',
            // width: '100%',
            width: '93%',
          }}
          //   className="btn-icon"
          color="danger"
          onClick={() => handleDeleteCurrentPosition(editedItem.id)}>
          <Trash size={14} />
          <span style={{fontSize: '16px'}} className="align-middle ms-25">
            Delete
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ComponentRightSidebar;
