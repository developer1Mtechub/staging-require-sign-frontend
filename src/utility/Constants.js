import { Calendar, CheckCircle, Italic, PenTool, Type, Zap } from "react-feather";

export const getIconForType = (type) => {
    switch (type) {
        // Add cases for other types and return the corresponding icon JSX
        case 'my_text':
            return <Type size={16} />;
        case 'my_signature':
            return <Italic size={16} />;
        case 'date':
            return <Calendar size={16} />;
        case 'initials':
            return <Edit size={16} />;
        case 'radio':
            return <Circle size={16} />;
        case 'dropdown':
            return <ChevronDown size={16} />;
        case 'chooseImg':
            return <FileText size={16} />;
        case 'stamp':
            return <Zap size={16} />;
        case 'highlight':
            return <PenTool size={16} />;
        case 'checkmark':
            return <CheckCircle size={16} />;
        case 'signer_text':
            return <Type size={16} />;
        case 'signer_date':
            return <Calendar size={16} />;
        case 'signer_initials':
            return <Edit size={16} />;
        case 'signer_chooseImg':
            return <FileText size={16} />;
        case 'signer_highlight':
            return <PenTool size={16} />;
        case 'signer_checkmark':
            return <CheckCircle size={16} />;
        case 'signer_radio':
            return <Circle size={16} />;
        case 'signer_dropdown':
            return <ChevronDown size={16} />;
        case 'signer_stamp':
            return <Zap size={16} />;


        default:
            return null;
    }
};
// Define a function to get the text based on the selected type
export const getTextForType = (type) => {
    switch (type) {
        case 'my_text':
            return 'Text';
        case 'my_signature':
            return 'Signature';
        case 'date':
            return 'Date';
        case 'initials':
            return 'Initials';
        case 'radio':
            return 'Radio';
        case 'dropdown':
            return 'Dropdown';
        case 'chooseImg':
            return 'Choose Image';
        case 'stamp':
            return 'Stamp';
        case 'highlight':
            return 'Highlight';
        case 'checkmark':
            return 'Checkmark';
        case 'signer_text':
            return 'TextField';
        case 'signer_date':
            return 'Date';
        case 'signer_initials':
            return 'Initials';
        case 'signer_chooseImg':
            return 'Choose Image';
        case 'signer_highlight':
            return 'Highlight';
        case 'signer_checkmark':
            return 'Checkmark';
        case 'signer_stamp':
            return 'Stamp';
        case 'signer_radio':
            return 'Radio';
        case 'signer_dropdown':
            return 'Dropdown';
        // Add cases for other types and return the corresponding text
        default:
            return null;
    }
};
export const fontFamilyArray = [
    { label: 'Arial, sans-serif' },
    { label: 'Helvetica, sans-serif' },
    { label: 'Georgia, serif' },
    { label: 'Times New Roman, serif' },
    { label: 'Courier New, monospace' },
    { label: 'Verdana, sans-serif' },
    { label: 'Trebuchet MS, sans-serif' },
    { label: 'Palatino, serif' },
    { label: 'Garamond, serif' },
    { label: 'Impact, sans-serif' },
    { label: 'Lucida Console, monospace' },
    { label: 'Century Gothic, sans-serif' },
    { label: 'Book Antiqua, serif' },
    { label: 'Copperplate, sans-serif' },
    { label: 'Arial Narrow, sans-serif' },
    { label: 'Tahoma, sans-serif' },
    { label: 'Franklin Gothic Medium, sans-serif' },
    { label: 'Brush Script MT, cursive' },
    { label: 'Comic Sans MS, cursive' },
    { label: 'Monaco, monospace' },
]
