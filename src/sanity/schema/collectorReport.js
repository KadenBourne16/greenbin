import { defineType, defineField } from 'sanity';

const generate_report_id = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reportId = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        reportId += characters.charAt(randomIndex);
    }
    return reportId;
}

export const collectorReport = defineType({
  name: 'collectorReport',
  title: 'Collector Report',
  type: 'document',
  fields: [
    defineField({
      name: 'reportID',
      title: 'Report ID',
      type: 'string',
      initialValue: generate_report_id
    }),
    defineField({
      name: 'collector',
      title: 'Collector',
      type: 'reference',
      to: [{ type: 'wasteCollector' }],
    }),
    defineField({
      name: 'category',
      title: 'Report Category',
      type: 'string',
      options: {
        list: [
          'vehicle_maintenance',
          'route_issue',
          'pickup_problem',
          'safety_concern',
          'customer_complaint',
          'equipment_failure',
          'weather_delay',
          'other'
        ]
      },
    }),
    defineField({
      name: 'title',
      title: 'Report Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: ['low', 'medium', 'high', 'urgent']
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: ['pending', 'in_review', 'resolved', 'rejected']
      },
      initialValue: 'pending'
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'timestamp',
      title: 'Report Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
  ],
});
