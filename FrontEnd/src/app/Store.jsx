import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers} from 'redux'
import userReducer from '../features/users/UserSlice';

//persist Config
const persistConfig = {
    key : "root",
    storage
}

const rootReducer = combineReducers({
    user: userReducer,
})

//persist reducer
const persistedReducer  = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;