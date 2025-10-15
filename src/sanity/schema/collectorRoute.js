import { defineType, defineField } from 'sanity';

export const collectorRoute = defineType({
  name: 'collectorRoute',
  title: 'Collector Route',
  type: 'document',
  fields: [
    defineField({ name: 'routeID', title: 'Route ID', type: 'string' }),
    defineField({ name: 'routeName', title: 'Route Name', type: 'string' }),
    defineField({
      name: 'assignedCollector',
      title: 'Assigned Collector',
      type: 'reference',
      to: [{ type: 'wasteCollector' }],
    }),
    defineField({ name: 'startPoint', title: 'Start Point', type: 'string' }),
    defineField({ name: 'endPoint', title: 'End Point', type: 'string' }),
    defineField({ name: 'distance', title: 'Distance (km)', type: 'number' }),
    defineField({ name: 'estimatedTime', title: 'Estimated Time (mins)', type: 'number' }),
  ],
});
