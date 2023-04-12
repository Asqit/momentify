import { Link } from 'react-router-dom';

// TODO: Create an actual app. log// TODO: Create an actual app. logoo
export function Brand() {
	return (
		<Link to="/">
			<div className="flex items-center gap-x-2">
				<div className="inline-block w-8 h-8 rounded-full bg-sky-500" />
				<h2 className="font-black text-2xl">Momentify</h2>
			</div>
		</Link>
	);
}
