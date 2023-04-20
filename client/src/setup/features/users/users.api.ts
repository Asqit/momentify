import { User } from '../auth/auth.types';
import { baseApi } from '../baseApi';

const usersApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Get user details -------------------------------------->
		getUser: builder.query({
			query: (id: string) => ({
				method: 'GET',
				url: `/users/${id}`,
			}),
		}),
		// Toggle user follow ----------------------------------->
		toggleFollowUser: builder.mutation<void, { userId: string; followerId: string }>({
			query: ({ userId, followerId }) => ({
				method: 'PUT',
				url: `/users/${userId}/follow/${followerId}`,
			}),
		}),
		// Change user picture ----------------------------------->
		changeProfilePicture: builder.mutation<User, { data: FormData; id: string }>({
			query: ({ id, data }) => ({
				method: 'PUT',
				url: `/users/${id}/image`,
				headers: {
					'Content-Type': undefined,
				},
				body: data,
			}),
		}),
	}),
});

export const {
	useGetUserQuery,
	useToggleFollowUserMutation,
	useChangeProfilePictureMutation,
} = usersApi;