import { IContact } from '@/interfaces/Contact';
<<<<<<< HEAD:frontend/src/redux/query/contactSlice.ts
import { CONTACTS_URL } from '../../constants';
import { apiSlice } from '../slices/apiSlice';

=======
import { CONTACTS_URL } from '../constants';
import { apiSlice } from './apiSlice';
interface IUpdateContact{
  contactId:string
}
>>>>>>> db3ead38400b9c71025e66397ccea6069d81302a:frontend/src/slices/contactSlice.ts
export const contactSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query<IContact[], void>({
      query: () => ({
        url: CONTACTS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getContactDetails: builder.query<IContact[], string>({
      query: (contactId) => ({
        url: `${CONTACTS_URL}/${contactId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addContact: builder.mutation<IContact[], string>({
      query: (newContact) => ({
        url: `${CONTACTS_URL}`,
        method: 'POST',
        body: newContact,
      }),
      // Keep the data for a short time to update the list of products
      // or you can adjust this based on your requirements
      invalidatesTags: ['Contact'],
    }),

    deleteContact: builder.mutation<IContact[], string>({
      query: (contactId) => ({
        url: `${CONTACTS_URL}/${contactId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
    updateContact: builder.mutation<IContact[], IUpdateContact>({
      query: (data) => ({
        url: `${CONTACTS_URL}/${data.contactId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const {
  useGetContactsQuery,
  useGetContactDetailsQuery,
  useAddContactMutation,
  useDeleteContactMutation,
  useUpdateContactMutation,
} = contactSlice;
