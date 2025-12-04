import { createClient } from 'contentful';

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!space || !accessToken) {
  throw new Error(
    'CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN must be defined in environment variables'
  );
}

export const contentfulClient = createClient({
  space,
  accessToken,
  environment,
});

// GraphQL endpoint
export const CONTENTFUL_GRAPHQL_ENDPOINT = `https://graphql.contentful.com/content/v1/spaces/${space}/environments/${environment}`;
