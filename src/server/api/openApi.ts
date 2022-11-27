import { generateOpenApiDocument } from 'trpc-openapi';

import { getConfig } from '~/config/config.actions';

import { appRouter } from '.';

const { service, host } = getConfig().devopsConfig;

const hostUrl = service.hostUrl === '/' ? '' : service.hostUrl;
const baseUrl = (import.meta.env.DEV ? 'http://' : 'https://') + host + hostUrl;

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'Example CRUD API',
  description: 'OpenAPI compliant REST API built using tRPC with Express',
  version: '1.0.0',
  baseUrl: baseUrl + '/api/v1',
  docsUrl: baseUrl + '/api/v1/docs/json',
});
