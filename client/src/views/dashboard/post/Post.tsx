import { useNavigate, useParams } from 'react-router-dom';
import {
	HeartButton,
	InlineProfile,
	PostSkeleton,
	Slideshow,
	Comment,
	TextArea,
} from '~/components';
import { useGetPostQuery } from '~/setup/features/posts/posts.api';
import { toast } from 'react-toastify';
import { FaRegComment } from 'react-icons/fa';
import { useAppSelector } from '~/hooks';
import { isHttpException } from '~/setup/features/auth/auth.types';

interface PostProps {}

export function Post(props: PostProps) {
	const state = useParams();
	const navigate = useNavigate();
	const { id: postId } = state;
	const { id: userId } = useAppSelector((st) => st.auth.user!);

	if (!postId || !userId) {
		toast.error('Failed to fetch post');
		return navigate('..');
	}

	const { data, isLoading, isError } = useGetPostQuery(postId); // RKT-Query query

	if (isLoading) {
		return <PostSkeleton />;
	}

	if (isError || !data) {
		toast.error('Failed to fetch post');

		return (
			<section className="w-full h-full flex items-center justify-center flex-col dark:text-gray-200">
				<h1 className="text-xl md:text-3xl mb-2">Post cannot be loaded</h1>
				<p>An uncaught error occurred and post could'nt be fetched</p>
			</section>
		);
	}

	return (
		<section className="w-full h-full py-2">
			<main className="container h-full mx-auto max-w-2xl overflow-y-auto border rounded-md dark:border-gray-800">
				{isLoading ? (
					<PostSkeleton />
				) : (
					<article className="w-full h-full p-4 dark:text-gray-200 overflow-y-auto">
						<InlineProfile
							id={data.authorId}
							username={data.author.username}
							profilePicture={data?.author.profilePicture}
						/>
						<figure className="my-4">
							{data.body.length === 1 ? (
								<img
									crossOrigin="anonymous"
									className={
										'w-full max-h-[500px] aspect-square object-cover rounded-md dark:brightness-75'
									}
									src={`http://localhost:8080/${data.body[0]}`}
									alt=""
									loading="eager"
								/>
							) : (
								<Slideshow
									images={data.body.map((filename) => `http://localhost:8080/${filename}`)}
									onClickCallback={function (): void {
										throw new Error('Function not implemented.');
									}}
								/>
							)}
						</figure>
						<div className="flex gap-x-3 my-4">
							<div className="flex items-center gap-x-2">
								<HeartButton
									isLiked={data.likedBy.includes(userId)}
									onClick={() => {}}
									likes={data.likedBy.length}
								/>
							</div>
							<span className="flex items-center text-lg gap-x-2">
								<FaRegComment /> {data.comments.length}
							</span>
						</div>
						<p>
							<span className="font-bold capitalize">{data.author.username}: </span>
							{data.title}
						</p>
						<hr className="dark:border-gray-800 my-4" />
						<details>
							<summary>comment section</summary>
							<ul className="my-4">
								{data.comments.length === 0 ? (
									<li>
										<span>Be first one to post a comment</span>
									</li>
								) : (
									data.comments.map((details) => (
										<Comment
											userId={details.authorId}
											value={details.value}
											key={details.id}
										/>
									))
								)}
							</ul>

							<TextArea
								label="comment"
								placeholder="e.g. nice pictures"
								parentClassName="w-full"
								className="resize-y"
							/>
						</details>
					</article>
				)}
			</main>
		</section>
	);
}
