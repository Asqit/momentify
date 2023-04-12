import { useTranslation } from 'react-i18next';
import { AiOutlineLoading } from 'react-icons/ai';

export function Spinner() {
	const { t } = useTranslation();

	return (
		<div className="w-full h-full flex flex-col items-center justify-center text-sky-500">
			<AiOutlineLoading className="text-4xl animate-spin" />
			<span className="font-semibold text-lg">{String(t('loading'))}...</span>
		</div>
	);
}
