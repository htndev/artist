declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql';
  const MyQuery: DocumentNode;

  export { MyQuery };

  export default MyQuery;
}
declare module '@xbeat/ui-kit';
declare module '*.png';
declare module '*.svg';
