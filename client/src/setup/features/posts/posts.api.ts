import { baseApi } from '../baseApi';

const postsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// create post mutation -------------------------------------------->
		createPost: builder.mutation({
			query: () => ({
				url: '/post/',
				method: 'POST',
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
