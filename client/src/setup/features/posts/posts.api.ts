import { baseApi } from '../baseApi';
import { Post } from './posts.types';

export const postsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// get all posts --------------------------------------------------->
		getGlobalFeed: builder.query<Post[], void>({
			query: () => ({
				url: `/posts/`,
				method: 'GET',
			}),
		}),
		// Create post mutation -------------------------------------------->
		createPost: builder.mutation<void, FormData>({
			query: (body) => ({
				url: '/posts',
				method: 'POST',
				headers: {
					// Let RTK-Query generate the content type.
					// If we define it as "multipart/form-data" it fails
					// And even if we manually set the boundary it fails
					'Content-Type': undefined,
				},
				body,
			}),
		}),
		// Like post mutation --------------------------------------------->
		likePost: builder.mutation<Post, { id: string; userId: string }>({
			query: ({ id, userId }) => ({
				url: `/posts/${id}/like/${userId}`,
				method: 'PUT',
			}),
		}),
		// Delete post mutation -------------------------------------------->
		deletePost: builder.mutation<void, string>({
			query: (id) => ({
				url: `/posts/${id}`,
				method: 'DELETE',
			}),
		}),
	}),
});

export const {
	useDeletePostMutation,
	useLikePostMutation,
	useCreatePostMutation,
	useGetGlobalFeedQuery,
} = postsApi;
