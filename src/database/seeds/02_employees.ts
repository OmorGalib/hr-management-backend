import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('employees').del();

  await knex('employees').insert([
    {
      name: 'John Smith',
      age: 30,
      designation: 'Software Engineer',
      hiring_date: '2023-01-15',
      date_of_birth: '1993-05-20',
      salary: 75000.0,
      photo_path: null,
    },
    {
      name: 'Sarah Johnson',
      age: 28,
      designation: 'Product Manager',
      hiring_date: '2022-08-10',
      date_of_birth: '1995-11-30',
      salary: 85000.0,
      photo_path: null,
    },
    {
      name: 'Michael Brown',
      age: 35,
      designation: 'Senior Developer',
      hiring_date: '2021-03-22',
      date_of_birth: '1988-07-12',
      salary: 95000.0,
      photo_path: null,
    },
  ]);
}