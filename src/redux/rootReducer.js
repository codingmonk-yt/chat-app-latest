import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import appReducer from './slices/app';
import audioCallReducer from './slices/audioCall';
import authReducer from './slices/auth';
import conversationReducer from './slices/conversation';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  //   whitelist: [],
  //   blacklist: [],
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  conversation: conversationReducer,
  audioCall: audioCallReducer,
});

export { rootPersistConfig, rootReducer };
