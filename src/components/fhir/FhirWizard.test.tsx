import React from 'react';
import { render, screen } from '@testing-library/react';
import { Questionnaire } from './fhir.types';
import FHIRWizard from './FhirWizard';

const sampleQuestionnaire: Questionnaire = {
  title: 'Sample Questionnaire',
  item: [
    {
      linkId: 'question1',
      text: 'Sample Question 1',
      type: 'string',
    },
    {
      linkId: 'question2',
      text: 'Sample Question 2',
      type: 'boolean',
    },
  ],
};

test('renders FHIRWizard component', () => {
  render(<FHIRWizard questionnaire={sampleQuestionnaire} />);

  expect(screen.getByText('Sample Questionnaire')).toBeInTheDocument();
  expect(screen.getByTestId('next-button')).toBeEnabled();
  expect(screen.getByTestId('previous-button')).toBeDisabled();
  expect(screen.getByTestId('save-button')).toBeEnabled();
});