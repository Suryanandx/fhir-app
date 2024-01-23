import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuestionRenderer from './QuestionRenderer';

const mockOnAnswer = jest.fn();

const sampleQuestion = {
  linkId: 'question1',
  text: 'Sample Question',
  type: 'string',
  item: [
    {
      linkId: 'nestedQuestion1',
      text: 'Nested Question 1',
      type: 'boolean',
    },
    {
      linkId: 'nestedQuestion2',
      text: 'Nested Question 2',
      type: 'choice',
      answerOption: [
        {
          valueCoding: {
            code: 'option1',
            display: 'Option 1',
          },
        },
        {
          valueCoding: {
            code: 'option2',
            display: 'Option 2',
          },
        },
      ],
    },
  ],
};

describe('QuestionRenderer', () => {
  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  test('renders a string question', () => {
    render(<QuestionRenderer question={sampleQuestion} onAnswer={mockOnAnswer} />);
    fireEvent.change(screen.getByTestId('text-field-question1'), { target: { value: 'Sample Answer' } });
    expect(mockOnAnswer).toHaveBeenCalledWith('Sample Answer');
  });

  test('renders a boolean question', () => {
    render(<QuestionRenderer question={sampleQuestion.item[0]} onAnswer={mockOnAnswer} />);
    fireEvent.click(screen.getByText('Yes'));
    expect(mockOnAnswer).toHaveBeenCalledWith('true');
  });

  test('renders a choice question', () => {
    render(<QuestionRenderer question={sampleQuestion.item[1]} onAnswer={mockOnAnswer} />);
    fireEvent.click(screen.getByTestId('checkbox-option1'));
    expect(mockOnAnswer).toHaveBeenCalledWith('option1');
  });

  test('renders a display question', () => {
    render(<QuestionRenderer question={sampleQuestion.item[0]} onAnswer={mockOnAnswer} />);
    expect(screen.queryByText('Nested Question 1')).toBeNull();
    expect(screen.queryByText('Yes')).toBeNull();
    expect(screen.queryByText('No')).toBeNull();
    expect(screen.getByText('Sample Question')).toBeInTheDocument();
  });
});