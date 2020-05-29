import * as types from './actionTypes'

const initialState = {
  restoring: false,
  loading: false,
  user: null,
  error: null,
  ccloading: false,
  ccerror: null,
  members: null,
  loadMemberError: false,
  grouperror: false,
  groups: null,
  loadGroupsError: false,
  messages: null,
  loadMessagesError: false,
  add_message_error: false,
  profile: null,
  loadProfileError: false,
  loadPresenceError : false,
  presence: null,
  allmessages: null,
  loadAllMessagesError: false,
}

const session = (state = initialState, action) => {
  switch (action.type) {
    case types.SESSION_RESTORING:
      return { ...state, restoring: true }
    case types.SESSION_LOADING:
      return { ...state, restoring: false, loading: true, error: null }
    case types.SESSION_SUCCESS:
      return { ...state, restoring: false, loading: false, user: action.user, error: null }
    case types.SESSION_ERROR:
      return { restoring: false, loading: false, user: null, error: action.error }
    case types.SESSION_LOGOUT:
      return initialState
    case types.CC_LOADING:
      return { ...state, ccloading: true, ccerror: null }
    case types.CC_SUCCESS:
      return { ...state, ccloading: false, ccerror: null }
    case types.CC_ERROR:
      return { ...state, ccloading: false, ccerror: action.error }

    case types.ADDGROUP_SUCCESS:
      return { ...state, grouperror: null }
    case types.ADDGROUP_ERROR:
      return { ...state, grouperror: action.error }

    case types.ADD_MESSAGE_SUCCESS:
      return { ...state, add_message_error: null }
    case types.ADD_MESSAGE_ERROR:
      return { ...state, add_message_error: action.error }

    case types.CHAT_LOAD_MEMBER_SUCCESS:
      return { ...state, members: action.members, loadMemberError: null }
    case types.CHAT_LOAD_MEMBER_ERROR:
      return { ...state, members: null, loadMemberError: action.error }

    case types.CHAT_LOAD_GROUPS_SUCCESS:
      return { ...state, groups: action.groups, loadGroupsError: null }
    case types.CHAT_LOAD_GROUPS_ERROR:
      return { ...state, groups: null, loadGroupsError: action.error }

    case types.CHAT_LOAD_MESSAGES_SUCCESS:
      return { ...state, messages: action.messages, loadMessagesError: null }
    case types.CHAT_LOAD_MESSAGES_ERROR:
      return { ...state, messages: null, loadMessagesError: action.error }

      case types.CHAT_LOAD_ALL_MESSAGES_SUCCESS:
        return { ...state, allmessages: action.messages, loadAllMessagesError: null }
      case types.CHAT_LOAD_ALL_MESSAGES_ERROR:
        return { ...state, allmessages: null, loadAllMessagesError: action.error }

    case types.LOAD_PRESENCE_SUCCESS:
      return { ...state, presence: action.presence, loadPresenceError: null }
    case types.LOAD_PRESENCE_ERROR:
      return { ...state, presence: null, loadPresenceError: action.error }

    case types.LOAD_PROFILE_SUCCESS:
      return { ...state, profile: action.profile, loadProfileError: null }
    case types.LOAD_PROFILE_ERROR:
      return { ...state, profile: null, loadProfileError: action.error }
    default:
      return state
  }
}

export default session
