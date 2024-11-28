// ** React Imports
import {Fragment} from 'react';

// ** Third Party Components
import {useTranslation} from 'react-i18next';

// ** Custom Components

// ** Reactstrap Imports
import {Row, Col, Card, CardHeader, CardTitle, CardBody, Input, Label} from 'reactstrap';

const I18nExtension = () => {
  // ** Hooks
  const {i18n, t} = useTranslation();
  const handleLangUpdate = (e, lang) => {
    e.preventDefault()
    i18n.changeLanguage(lang)
  }
  return (
    <Fragment>
      <Row>
        <Col sm="2">
         
              <div className="language-options" style={{display:'flex'}}>
                <div className="form-check mb-1">
                  <Input
                    type="radio"
                    id="radio-en"
                    name="i18n-lang-radio"
                    checked={i18n.language === 'en'}
                    onChange={(e) => handleLangUpdate(e,'en')
  }
                  />
                  <Label className="form-check-label" for="radio-en">
                    English
                  </Label>
                </div>
                <div className="form-check mb-1">
                  <Input
                    type="radio"
                    id="radio-fr"
                    name="i18n-lang-radio"
                    checked={i18n.language === 'fr'}
                    onChange={(e) => handleLangUpdate(e,'fr')}
                  />
                  <Label className="form-check-label" for="radio-fr">
                    French
                  </Label>
                </div>
                {/* <div className="form-check mb-1">
                  <Input
                    type="radio"
                    id="radio-de"
                    name="i18n-lang-radio"
                    checked={i18n.language === 'de'}
                    onChange={() => i18n.changeLanguage('de')}
                  />
                  <Label className="form-check-label" for="radio-de">
                    German
                  </Label>
                </div>
                <div className="form-check mb-1">
                  <Input
                    type="radio"
                    id="radio-pt"
                    name="i18n-lang-radio"
                    onChange={() => i18n.changeLanguage('pt')}
                    checked={i18n.language === 'pt'}
                  />
                  <Label className="form-check-label" for="radio-pt">
                    Portuguese
                  </Label>
                </div> */}
              </div>
              {/* <div className="border p-2 mt-3">
                <h5 className="mb-1">Title</h5>
                {t('text')}
              </div> */}
            
        </Col>
      </Row>
    </Fragment>
  );
};

export default I18nExtension;
