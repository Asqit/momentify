import { baseApi } from '../baseApi';
import { Post, PostWithReferences } from './posts.types';

export const postsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// get all posts --------------------------------------------------->
		getGlobalFeed: builder.query<Partial<PostWithReferences>[], void>({
			providesTags: ['Posts'],
			query: () => ({
				url: `/posts/`,
				method: 'GET',
			}),
		}),
		// Create post mutation -------------------------------------------->
		createPost: builder.mutation<void, FormData>({
			invalidatesTags: ['Posts', 'Users'],
			query: (body: FormData) => ({
				url: '/posts',
				method: 'POST',
				headers: {
					// Let RTK-Query generate the content type.
					// If we define it as "multipart/form-data" it fails
					// And it also fails if we manually set boundary
					'Content-Type': undefined,
				},
				body,
			}),
		}),
		// Get post ------------------------------------------------------->
		getPost: builder.query<PostWithReferences, string>({
			providesTags: ['Posts'],
			query: (id: string) => ({
				url: `/posts/${id}`,
				method: 'GET',
			}),
		}),
		// Like post mutation --------------------------------------------->
		likePost: builder.mutation<Post, { id: string; userId: string }>({
			invalidatesTags: ['Posts'],
			query: ({ id, userId }) => ({
				url: `/posts/${id}/like/${userId}`,
				method: 'PUT',
			}),
		}),
		// Delete post mutation -------------------------------------------->
		deletePost: builder.mutation<void, string>({
			invalidatesTags: ['Posts', 'Comments', 'Users'],
			query: (id) => ({
				url: `/posts/${id}`,
				method: 'DELETE',
			}),
		}),
	}),
});

export const {
	useGetPostQuery,
	useDeletePostMutation,
	useLikePostMutation,
	useCreatePostMutation,
	useGetGlobalFeedQuery,
} = postsApi;
