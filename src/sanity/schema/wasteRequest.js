import { defineType, defineField } from 'sanity';


const generate_request_id = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let requestId = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        requestId += characters.charAt(randomIndex);
    }
    return requestId;
}
export const wasteRequest = defineType({
  name: 'wasteRequest',
  title: 'Waste Request',
  type: 'document',
  fields: [
    defineField({ name: 'requestID', title: 'Request ID', type: 'string', initialValue: generate_request_id }),
    defineField({
      name: 'resident',
      title: 'Resident',
      type: 'reference',
      to: [{ type: 'resident' }],
    }),
    defineField({
      name: 'wasteType',
      title: 'Waste Type',
      type: 'string',
      options: { list: ['household', 'recyclable', 'commercial'] },
    }),
    defineField({ name: 'pickupDate', title: 'Pickup Date', type: 'datetime' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['pending', 'inProgress', 'completed', 'cancelled'] },
    }),
    defineField({
      name: 'collector',
      title: 'Collector',
      type: 'reference',
      to: [{ type: 'wasteCollector' }],
    }),
    defineField({ name: 'requestTimestamp', title: 'Request Timestamp', type: 'datetime' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'remarks', title: 'Remarks', type: 'text' }),
  ],
});
