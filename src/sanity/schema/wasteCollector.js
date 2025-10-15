import { defineType, defineField } from 'sanity';

const generate_collector_id = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let collectorId = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        collectorId += characters.charAt(randomIndex);
    }
    return collectorId;
}

export const wasteCollector = defineType({
  name: 'wasteCollector',
  title: 'Waste Collector',
  type: 'document',
  fields: [
    defineField({ name: 'collectorID', title: 'Collector ID', type: 'string', initialValue: generate_collector_id }),
    defineField({ name: 'firstName', title: 'First Name', type: 'string' }),
    defineField({ name: 'middleName', title: 'Middle Name', type: 'string' }),
    defineField({ name: 'lastName', title: 'Last Name', type: 'string' }),
    defineField({ name: 'contactNumber', title: 'Contact Number', type: 'string' }),
    defineField({ name: 'assignedRoute', title: 'Assigned Route', type: 'string' }),
    defineField({ name: 'vehicleNumber', title: 'Vehicle Number', type: 'string' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['available', 'onDuty', 'offline'] },
    }),
    defineField({ name: 'lastUpdated', title: 'Last Updated', type: 'datetime' }),
  ],
});
