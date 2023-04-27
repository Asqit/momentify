import { Link, useParams } from 'react-router-dom';
import { HeartButton, InlineProfile, Spinner, Textfield } from '~/components';
import { useGetPostQuery } from '~/setup/features/posts/posts.api';
import { toast } from 'react-toastify';
import { FaRegComment } from 'react-icons/fa';

interface PostProps {}

export function Post(props: PostProps) {
	const state = useParams();
	const { id } = state;
	const { data, isLoading, isError, error } = useGetPostQuery(id!);

	if (isError) {
		toast.error(String(error));
	}

	if (!data) {
		return (
			<section className="w-full h-full flex items-center justify-center flex-col">
				<h1>Post cannot be loaded</h1>
				<p>An uncaught error occurred and post could'nt be fetched</p>
			</section>
		);
	}

	return (
		<section className="w-full h-full py-2">
			{isLoading ? <Spinner /> : null}
			<main className="container mx-auto border rounded-md h-full p-4 max-w-3xl flex flex-col">
				<div className="my-4">
					<InlineProfile
						id={data.authorId}
						username={data.author.username}
						profilePicture={data.author.profilePicture}
					/>
				</div>
				<figure className="mb-4">
					{data.body.length === 1 ? (
						<img
							crossOrigin="anonymous"
							className={'w-full max-h-[600px] rounded-md object-cover'}
							src={`http://localhost:8080/${data.body[0]}`}
							alt=""
							loading="eager"
						/>
					) : null}
				</figure>
				<article className="flex-grow flex flex-col">
					<div className="flex gap-x-3">
						<HeartButton
							isLiked={false}
							onClick={function (): void {
								throw new Error('Function not implemented.');
							}}
							likes={0}
						/>
						<span className="flex items-center text-lg gap-x-2">
							<FaRegComment /> <span>{0}</span>
						</span>
					</div>
					<div>
						<p>
							<span className="font-semibold capitalize">{data.author.username}: </span>
							{data.title}
						</p>
					</div>
					<div className="relative flex-grow">
						{data.comments.length === 0 ? <p>Be first to post a comment</p> : null}
						<Textfield
							label="your comment"
							placeholder="e.g. nice photos"
							parentClassName="w-full absolute bottom-0 left-0"
						/>
					</div>
				</article>
			</main>
		</section>
	);
}
