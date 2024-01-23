import React, { useEffect, useState } from 'react';
import Form from '@rjsf/mui';
import { Button } from '@mui/material';

interface FhirQuestionnaireProps {
  fhirData: FHIRQuestionnaire;
}

interface FHIRQuestionnaire {
  title: string;
  item: FHIRQuestionItem[];
}

interface FHIRQuestionItem {
  linkId: string;
  text: string;
  type: string;
  item?: FHIRQuestionItem[];
  answerOption?: AnswerOption[];
  required?: boolean;
  repeats?: boolean;
}

interface AnswerOption {
  valueCoding: {
    code: string;
    display: string;
  };
}

const FhirQuestionnaireToRjsf: React.FC<FhirQuestionnaireProps> = ({
  fhirData,
}) => {
  const [formData, setFormData] = useState({});
  const [schema, setSchema] = useState<any>({});
  const [uiSchema, setUiSchema] = useState<any>({});

  useEffect(() => {
    const convertedSchema = convertFhirQuestionnaireToRJSF(fhirData);
    setSchema(convertedSchema.schema);
    setUiSchema(convertedSchema.uiSchema);
  }, [fhirData]);

  const handleSubmit = ({ formData }: any) => {
    // Handle form submission, formData contains the answers
    console.log(formData);
  };

  const convertFhirQuestionnaireToRJSF = (
    fhirQuestionnaire: FHIRQuestionnaire
  ) => {
    const schema: any = {
      type: 'object',
      properties: {},
      required: [],
    };

    const uiSchema: any = {};

    const convertItemToSchema = (item: FHIRQuestionItem) => {
      const schemaItem: any = { title: item.text };

      if (item.type === 'boolean') {
        schemaItem.type = 'boolean';
      } else if (item.type === 'decimal' || item.type === 'integer') {
        schemaItem.type = 'number';
      } else if (item.type === 'string') {
        schemaItem.type = 'string';
      } else if (item.type === 'date' || item.type === 'dateTime') {
        schemaItem.type = 'string'; // Use 'string' for dates; you can add format constraints
      } else if (item.type === 'choice') {
        if (item.repeats) {
          // For multi-select, use checkboxes
          schemaItem.type = 'array';
          schemaItem.items = {
            type: 'string',
            enum: item.answerOption?.map((option) => option.valueCoding.code) || [],
            enumNames: item.answerOption?.map((option) => option.valueCoding.display) || [],
          };
          schemaItem.uniqueItems = true; // Ensure unique items in the array
          schemaItem.default = []; // Default value for multi-select

          // Modify UI schema to use checkboxes
          uiSchema[`${item.linkId}`] = {
            'ui:widget': 'radio',
          };
        } else {
          // For single-select, use radio buttons
          schemaItem.type = 'string';
          schemaItem.enum = item.answerOption?.map((option) => option.valueCoding.code);
          schemaItem.enumNames = item.answerOption?.map((option) => option.valueCoding.display) || [];
          uiSchema[`${item.linkId}`] = {
            'ui:widget': 'radio',
          };
        }
      } else if (item.type === 'display') {
       
        schemaItem.type = 'string';
        schemaItem.readOnly = true; // or use a custom widget that renders text
      } else if (item.type === 'group') {
        schemaItem.type = 'object';
        schemaItem.properties = {};
        schemaItem.required = [];

        item.item?.forEach((nestedItem) => {
          const nestedSchemaItem = convertItemToSchema(nestedItem);
          schemaItem.properties[nestedItem.linkId] = nestedSchemaItem;
          if (nestedItem.required) {
            schemaItem.required.push(nestedItem.linkId);
          }
        });
      }

      return schemaItem;
    };

    fhirQuestionnaire.item?.forEach((item) => {
      const schemaItem = convertItemToSchema(item);
      schema.properties[item.linkId] = schemaItem;
      if (item.required) {
        schema.required.push(item.linkId);
      }
    });

    return { schema, uiSchema };
  };

  return (
    <div>
      <h1>{fhirData.title}</h1>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onChange={({ formData }) => setFormData(formData)}
        onSubmit={handleSubmit}
        validator={() => {}}
      >
        <Button>Submit</Button>
      </Form>
    </div>
  );
};

export default FhirQuestionnaireToRjsf;
