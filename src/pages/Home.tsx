import React, { useState } from 'react';
import FHIRWizard from '../components/fhir/FhirWizard';
import FhirQuestionnaireToRjsf from '../components/rjsf/FhirQuestionnaireToRjsf';
import fhirData from '../data/fhir-questionnaire.json';
import { Tab, Tabs } from '@mui/material';
import { Questionnaire } from '../components/fhir/fhir.types';

function Home() {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab label="Wizard" />
        <Tab label="Fhir Questionnaire To Rjsf" />
      </Tabs>
      <div role="tabpanel" hidden={selectedTab !== 0}>
        {selectedTab === 0 && <FHIRWizard questionnaire={fhirData as Questionnaire} />}
      </div>
      <div role="tabpanel" hidden={selectedTab !== 1}>
        {selectedTab === 1 && <FhirQuestionnaireToRjsf fhirData={fhirData as Questionnaire} />}
      </div>
    </div>
  );
}

export default Home;
