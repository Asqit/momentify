import { Link } from 'react-router-dom';

export function Brand() {
	return (
		<Link to="/">
			<div className="flex items-center gap-x-2 transition-all hover:gap-x-1">
				<div className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-sky-500" />
				<h2 className="font-black text-2xl dark:text-gray-200">Momentify</h2>
			</div>
		</Link>
	);
}
