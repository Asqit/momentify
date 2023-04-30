import { baseApi } from '../baseApi';
import { CreateCommentPayload, UpdateCommentPayload, Comment } from './comments.types';

const commentsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// Create comment --------------------------------------------->
		createComment: builder.mutation<Comment, CreateCommentPayload>({
			query: (body: CreateCommentPayload) => ({
				url: '/comments',
				method: 'POST',
				body,
			}),
		}),
		// Get post comments ------------------------------------------->
		getPostComments: builder.query<Comment[], string>({
			query: (id) => ({
				url: `/comments/post/${id}`,
				method: 'GET',
			}),
		}),
		// Delete comment ----------------------------------------------->
		deleteComment: builder.mutation<string, string>({
			query: (id) => ({
				method: 'DELETE',
				url: `/comments/${id}`,
			}),
		}),
		// Update comment ----------------------------------------------->
		updateComment: builder.mutation<Comment, UpdateCommentPayload>({
			query: (body) => ({
				method: 'PUT',
				url: 'comments',
				body,
			}),
		}),
	}),
});

export const {
	useCreateCommentMutation,
	useGetPostCommentsQuery,
	useUpdateCommentMutation,
	useDeleteCommentMutation,
} = commentsApi;
