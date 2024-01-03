import { CONTACTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const contactSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getContacts: builder.query({
      query: () => ({
        url: CONTACTS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getContactDetails: builder.query({
      query: (contactId) => ({
        url: `${CONTACTS_URL}/${contactId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    addContact: builder.mutation({
      query: (newContact) => ({
        url: `${CONTACTS_URL}`,
        method: 'POST',
        body: newContact,
      }),
      // Keep the data for a short time to update the list of products
      // or you can adjust this based on your requirements
      invalidatesTags: ['Contact'],
    }),

    deleteContact: builder.mutation({
      query: (contactId) => ({
        url: `${CONTACTS_URL}/${contactId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Contact'],
    }),
    updateContact: builder.mutation({
      query: (data) => ({
        url: `${CONTACTS_URL}/${data.contactId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Contacts'],
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
