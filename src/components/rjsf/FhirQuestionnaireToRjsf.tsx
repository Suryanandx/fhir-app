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

      switch (item.type) {
        case 'boolean':
          schemaItem.type = 'boolean';
          break;
        case 'decimal':
        case 'integer':
          schemaItem.type = 'number';
          break;
        case 'string':
          schemaItem.type = 'string';
          break;
        case 'date':
        case 'dateTime':
          schemaItem.type = 'string'; // Use 'string' for dates; you can add format constraints
          break;
        case 'choice':
          const options =
            (item.answerOption || []).map((opt) => opt.valueCoding.code) || [];
          const optionNames =
            (item.answerOption || []).map((opt) => opt.valueCoding.display) ||
            [];

          if (item.repeats) {
            // Multi-select (checkboxes)
            schemaItem.type = 'array';
            schemaItem.items = {
              type: 'string',
              enum: options,
              enumNames: optionNames,
            };
            schemaItem.uniqueItems = true;
            uiSchema[item.linkId] = { 'ui:widget': 'checkboxes' };
          } else {
            // Single select (radio buttons)
            schemaItem.type = 'string';
            schemaItem.enum = options;
            schemaItem.enumNames = optionNames;
            uiSchema[item.linkId] = { 'ui:widget': 'radio' };
          }
          break;
        case 'display':
          schemaItem.type = 'string';
          schemaItem.readOnly = true; // or use a custom widget that renders text
          break;
        case 'group':
          schemaItem.type = 'object';
          schemaItem.properties = {};
          schemaItem.required = [];

          (item.item || []).forEach((nestedItem) => {
            const nestedSchemaItem = convertItemToSchema(nestedItem);
            schemaItem.properties[nestedItem.linkId] = nestedSchemaItem;
            if (nestedItem.required) {
              schemaItem.required.push(nestedItem.linkId);
            }
          });
          break;
        default:
          break;
      }

      return schemaItem;
    };

    (fhirQuestionnaire.item || []).forEach((item) => {
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
