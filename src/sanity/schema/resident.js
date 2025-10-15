import { defineType, defineField } from 'sanity';

export const resident =  defineType({
  name: 'resident',
  title: 'Resident',
  type: 'document',
  fields: [
    defineField({
      name: 'residentID',
      title: 'Resident ID',
      type: 'slug',
      description: 'Unique identifier for the resident (auto-generated)',
      options: {
        source: (doc) => `${doc.firstName || ''}-${doc.lastName || ''}`.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 200)
      }
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    }),
    defineField({
      name: 'middleName',
      title: 'Middle Name',
      type: 'string',
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    }),
    defineField({
      name: 'dateOfBirth',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      description: 'Used for SMS alerts',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      description: 'Physical location of the resident',
    }),
    defineField({
      name: 'passwordHash',
      title: 'Password Hash',
      type: 'string',
    }),
    defineField({
      name: 'accountStatus',
      title: 'Account Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Suspended', value: 'suspended' },
          { title: 'Pending', value: 'pending' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'registrationDate',
      title: 'Registration Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'locationCoordinates',
      title: 'Location Coordinates',
      type: 'geopoint',
      description: 'GPS coordinates for bin assignment',
    }),
  ],
});
