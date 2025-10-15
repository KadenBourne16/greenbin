import { defineType, defineField } from 'sanity';

export const bin = defineType({
  name: 'bin',
  title: 'Bin',
  type: 'document',
  fields: [
    defineField({ name: 'binID', title: 'Bin ID', type: 'string' }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'geopoint',
      description: 'GPS coordinates or address of the bin',
    }),
    defineField({ name: 'capacity', title: 'Capacity (Liters)', type: 'number' }),
    defineField({ name: 'currentLevel', title: 'Current Level (%)', type: 'number' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['active', 'full', 'needsRepair'] },
    }),
    defineField({
      name: 'wasteType',
      title: 'Waste Type',
      type: 'string',
      options: { list: ['recyclable', 'organic', 'general'] },
    }),
    defineField({ name: 'lastCollected', title: 'Last Collected', type: 'datetime' }),
  ],
});
