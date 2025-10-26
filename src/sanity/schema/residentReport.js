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

export const residentReport = defineType({
  name: 'residentReport',
  title: 'Resident Report',
  type: 'document',
  fields: [
    defineField({
      name: 'reportID',
      title: 'Report ID',
      type: 'string',
      initialValue: generate_report_id
    }),
    defineField({
      name: 'resident',
      title: 'Resident',
      type: 'reference',
      to: [{ type: 'resident' }],
    }),
    defineField({
      name: 'category',
      title: 'Report Category',
      type: 'string',
      options: {
        list: [
          'missed_pickup',
          'bin_damage',
          'service_quality',
          'billing_issue',
          'app_technical',
          'route_complaint',
          'safety_concern',
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
        list: ['pending', 'in_review', 'responded', 'resolved', 'closed']
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
    defineField({
      name: 'response',
      title: 'Admin Response',
      type: 'text',
    }),
  ],
});
