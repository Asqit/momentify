import { baseApi } from '../baseApi';
import { CreatePostBody } from './post.types';

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
					'Content-Type': undefined, // We should let RTK-Query generate the content-type itself, otherwise we will get Multipart: No boundary found error
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
