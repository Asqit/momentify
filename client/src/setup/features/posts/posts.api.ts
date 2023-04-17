import { baseApi } from '../baseApi';

const postsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// get personalized feed query -------------------------------------->
		getPersonFeed: builder.query({
			query: () => ({
				url: '/posts/feed/person',
				method: 'GET',
			}),
		}),
		// get global feed query ------------------------------------------->
		getGlobalFeed: builder.query({
			query: () => ({
				url: `/post/posts/feed/global/`,
				method: 'GET',
			}),
		}),
		// create post mutation -------------------------------------------->
		createPost: builder.mutation<void, FormData>({
			query: (body) => ({
				url: '/post',
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
		likePost: builder.mutation({
			query: () => ({
				url: '/post/like/:id/:authorId',
				method: 'PUT',
			}),
		}),
		// Delete post mutation -------------------------------------------->
		deletePost: builder.mutation({
			query: () => ({
				url: '/post/',
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
	useGetPersonFeedQuery,
} = postsApi;
