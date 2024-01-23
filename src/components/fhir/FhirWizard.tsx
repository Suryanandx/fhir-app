import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  CardActions,
  CircularProgress,
  Grid,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Answers, Questionnaire } from './fhir.types';
import QuestionRenderer from './QuestionRenderer';

interface FhirQuestionnaireProps {
  questionnaire: Questionnaire;
}

const FHIRWizard: React.FC<FhirQuestionnaireProps> = ({ questionnaire }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isSmallerScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleNext = () => {
    if (currentQuestionIndex < questionnaire.item.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: '80%', margin: 'auto', padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>
        {questionnaire.title}
      </Typography>

      <Card elevation={0}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {`Screening ${currentQuestionIndex + 1} of ${
              questionnaire.item.length
            }`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(currentQuestionIndex / questionnaire.item.length) * 100}
            style={{ height: '10px' }}
          />
          <QuestionRenderer
            question={questionnaire.item[currentQuestionIndex]}
            onAnswer={(answer) => {
              setAnswers({
                ...answers,
                [questionnaire.item[currentQuestionIndex].linkId]: answer,
              });
            }}
          />
        </CardContent>

        <CardActions
          style={{ justifyContent: 'space-between', padding: '16px' }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={isSmallerScreen ? 4 : 2}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                data-testid="previous-button"
              >
                Previous
              </Button>
            </Grid>
            <Grid item xs={isSmallerScreen ? 4 : 2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={
                  currentQuestionIndex === questionnaire.item.length - 1
                }
                data-testid="next-button"
              >
                Next
              </Button>
            </Grid>
            <Grid
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
              item
              xs={isSmallerScreen ? 4 : 8}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading}
                data-testid="save-button"
              >
                {loading ? <CircularProgress size={24} /> : 'Save'}
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
};

export default FHIRWizard;
