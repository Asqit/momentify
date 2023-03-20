import { useDispatch } from 'react-redux';
import { AppDispatch } from '~/setup/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
