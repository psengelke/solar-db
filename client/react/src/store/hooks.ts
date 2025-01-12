import {useDispatch, useSelector} from 'react-redux'
import type {AppDispatch, RootState} from './store'

// See https://redux.js.org/tutorials/typescript-quick-start
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
