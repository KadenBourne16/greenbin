import { defineType, defineField } from 'sanity';

export const admin = defineType({
  name: 'admin',
  title: 'Admin',
  type: 'document',
  fields: [
    defineField({ name: 'adminID', title: 'Admin ID', type: 'string' }),
    defineField({ name: 'username', title: 'Username', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: { list: ['SuperAdmin', 'Municipal Officer'] },
    }),
    defineField({ name: 'passwordHash', title: 'Password Hash', type: 'string', hidden: true }),
    defineField({ name: 'lastLogin', title: 'Last Login', type: 'datetime' }),
  ],
});
