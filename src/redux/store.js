import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import authSlice from "./features/auth/auth.slice"
import subscriptionSlice from "./features/subscription.slice"
import gallerySlice from "./features/gallery/gallery.slice"
const persistConfig = {
  key: "root",
  storage
}
const rootReducer = combineReducers({
  auth: authSlice,
  subscription: subscriptionSlice,
  gallery: gallerySlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
  reducer: persistedReducer
})
export const persistor = persistStore(store)