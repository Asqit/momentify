import { User } from '../auth/auth.types';
import { baseApi } from '../baseApi';

const usersApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Get user details -------------------------------------->
		getUser: builder.query<User, string>({
			providesTags: ['Users'],
			query: (id: string) => ({
				method: 'GET',
				url: `/users/${id}`,
			}),
		}),
		// Toggle user follow ----------------------------------->
		toggleFollowUser: builder.mutation<void, { userId: string; followerId: string }>({
			invalidatesTags: ['Users'],
			query: ({ userId, followerId }) => ({
				method: 'PUT',
				url: `/users/${userId}/follow/${followerId}`,
			}),
		}),
		// Change user picture ----------------------------------->
		changeProfilePicture: builder.mutation<User, { data: FormData; id: string }>({
			invalidatesTags: ['Users'],
			query: ({ id, data }) => ({
				method: 'PUT',
				url: `/users/${id}/image`,
				headers: {
					'Content-Type': undefined,
				},
				body: data,
			}),
		}),
		// Change bio ------------------------------------------->
		changeBio: builder.mutation<User, { bio: string; id: string }>({
			invalidatesTags: ['Users'],
			query: ({ id, bio }) => ({
				method: 'PUT',
				url: `/users/${id}/bio`,
				body: { bio },
			}),
		}),
	}),
});

export const {
	useGetUserQuery,
	useToggleFollowUserMutation,
	useChangeProfilePictureMutation,
	useChangeBioMutation,
} = usersApi;
