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
			query: (lastPostId: string) => ({
				url: `/posts/feed/global/${lastPostId}`,
				method: 'GET',
			}),
		}),
		// create post mutation -------------------------------------------->
		createPost: builder.mutation<void, CreatePostBody>({
			query: (body) => ({
				url: '/post/',
				method: 'POST',
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				body: { files: body.files, title: body.title },
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
