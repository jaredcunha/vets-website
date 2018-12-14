import { uploadDescription } from '../content/fileUploadDescriptions';
import { ptsd781aNameTitle } from '../content/ptsdClassification';
import fileUploadUI from 'us-forms-system/lib/js/definitions/file';
import environment from '../../../../platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { completedFormAttachments } = fullSchema.properties;

const FIFTY_MB = 52428800;

export const uiSchema = {
  'ui:title': ptsd781aNameTitle,
  'ui:description': uploadDescription,
  ptsd781a: fileUploadUI('', {
    itemDescription: 'PTSD 781a form',
    hideLabelText: true,
    fileUploadUrl: `${environment.API_URL}/v0/upload_supporting_evidence`,
    fileTypes: [
      'pdf',
      'jpg',
      'jpeg',
      'png',
      'gif',
      'bmp',
      'tif',
      'tiff',
      'txt',
    ],
    maxSize: FIFTY_MB,
    createPayload: file => {
      const payload = new FormData();
      payload.append('supporting_evidence_attachment[file_data]', file);

      return payload;
    },
    parseResponse: (response, file) => ({
      name: file.name,
      confirmationCode: response.data.attributes.guid,
      attachmentId:
        'VA Form 21-0781a-Statement in Support of Claim for PTSD Secondary to Personal Assault',
    }),
    // this is the uiSchema passed to FileField for the attachmentId schema
    // FileField requires this name be used
    attachmentSchema: {
      'ui:title': 'Document type',
      'ui:disabled': true,
      'ui:widget': 'textarea',
    },
    classNames: 'upload-completed-form',
  }),
};

export const schema = {
  type: 'object',
  required: ['ptsd781a'],
  properties: {
    ptsd781a: completedFormAttachments,
  },
};
