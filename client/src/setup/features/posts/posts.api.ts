import { baseApi } from '../baseApi';
import { Post, PostWithReferences } from './posts.types';

export const postsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// get all posts --------------------------------------------------->
		getGlobalFeed: builder.query<Partial<PostWithReferences>[], void>({
			query: () => ({
				url: `/posts/`,
				method: 'GET',
			}),
		}),
		// Create post mutation -------------------------------------------->
		createPost: builder.mutation<void, FormData>({
			query: (body: FormData) => ({
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
		// Get post ------------------------------------------------------->
		getPost: builder.query<PostWithReferences, string>({
			query: (id: string) => ({
				url: `/posts/${id}`,
				method: 'GET',
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
	useGetPostQuery,
	useDeletePostMutation,
	useLikePostMutation,
	useCreatePostMutation,
	// This Query will fetch every post available, including post author. (That's why it's partial, because comments are missing)
	useGetGlobalFeedQuery,
} = postsApi;
