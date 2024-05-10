import { TableProps } from 'sst/constructs';

export const PetSchema: TableProps = {
  fields: {
    pk: 'string',
    sk: 'string',

    // Fields

    createdAt: 'number',
    updatedAt: 'number',
    deletedAt: 'number'
  },
  primaryIndex: {
    partitionKey: 'pk',
    sortKey: 'sk'
  }
};

