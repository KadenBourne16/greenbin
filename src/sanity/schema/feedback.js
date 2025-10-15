import { defineType, defineField } from 'sanity';

export const feedback = defineType({
  name: 'feedback',
  title: 'Feedback',
  type: 'document',
  fields: [
    defineField({ name: 'feedbackID', title: 'Feedback ID', type: 'string' }),
    defineField({
      name: 'resident',
      title: 'Resident',
      type: 'reference',
      to: [{ type: 'resident' }],
    }),
    defineField({ name: 'message', title: 'Message', type: 'text' }),
    defineField({
      name: 'rating',
      title: 'Rating (1–5)',
      type: 'number',
    }),
    defineField({ name: 'timestamp', title: 'Timestamp', type: 'datetime' }),
  ],
});
