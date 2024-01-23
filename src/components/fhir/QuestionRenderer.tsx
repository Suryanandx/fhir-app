import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  FormGroup,
  Checkbox,
  Typography,
} from '@mui/material';
import { QuestionItem } from './fhir.types';

interface QuestionRendererProps {
  question: QuestionItem;
  onAnswer: (answer: any) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
}) => {
  const handleAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAnswer(event.target.value);
  };

  const renderQuestionType = () => {
    switch (question.type) {
      case 'string':
        return (
          <TextField
            label={question.text}
            fullWidth
            margin="normal"
            onChange={handleAnswer}
            data-testid={`text-field-${question.linkId}`}
          />
        );

      case 'boolean':
        return (
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">{question.text}</FormLabel>
            <RadioGroup row name={question.linkId} onChange={handleAnswer}>
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        );

      case 'choice':
        if (!question.repeats) {
      
          return (
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">{question.text}</FormLabel>
              <RadioGroup name={question.linkId} onChange={handleAnswer}>
                {question.answerOption?.map((option) => (
                  <FormControlLabel
                    key={option.valueCoding.code}
                    control={
                      <Radio
                        value={option.valueCoding.code}
                      />
                    }
                    label={option.valueCoding.display}
                    data-testid={`radio-${option.valueCoding.code}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          );
        } else {
          
          return (
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">{question.text}</FormLabel>
              <FormGroup>
                {question.answerOption?.map((option) => (
                  <FormControlLabel
                    key={option.valueCoding.code}
                    control={
                      <Checkbox
                        value={option.valueCoding.code}
                        onChange={handleAnswer}
                      />
                    }
                    label={option.valueCoding.display}
                    data-testid={`checkbox-${option.valueCoding.code}`}
                  />
                ))}
              </FormGroup>
            </FormControl>
          );
        }

      case 'display':
        return question.parentLinkId ? (
          <Typography
            variant="body2"
            style={{ marginTop: '10px' }}
            data-testid={`display-text-${question.linkId}`}
          >
            {question.text}
          </Typography>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {renderQuestionType()}

      {question.item?.map((nestedItem) => (
        <div key={nestedItem.linkId}>
          {nestedItem.type === 'group' && (
            <Typography
              variant="body1"
              style={{
                marginTop: '10px',
                fontStyle: 'italic',
                textDecoration: 'underline',
              }}
              data-testid={`display-text-${nestedItem.linkId}`}
              key={nestedItem.linkId}
            >
              {nestedItem.text}
            </Typography>
          )}
          <QuestionRenderer question={nestedItem} onAnswer={onAnswer} />
        </div>
      ))}
    </div>
  );
};

export default QuestionRenderer;
