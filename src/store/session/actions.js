import * as types from './actionTypes'
import firebaseService from '../../services/firebase'

const FIREBASE_REF_USRES = firebaseService.database().ref('users')
const FIREBASE_REF_PRESENCE = firebaseService.database().ref('status')
const FIREBASE_REF_GROUPS = firebaseService.database().ref('groups')
const FIREBASE_REF_MESSAGES = firebaseService.database().ref('messages')

export const createGroup = (uid, name, type, country, city, members, about, img) => {
  return (dispatch) => {
    let newGroup = {
      name: name,
      type: type,
      country: country,
      city: city,
      members: members,
      owner: uid,
      lastMsg: '',
      lastMsgDate: '939719978706',
      about: about,
      img: img,
    }

    FIREBASE_REF_GROUPS.push().set(newGroup, (error) => {
      if (error) {
        dispatch(addGroupError(error.message))
      } else {
        dispatch(addGroupSuccess())
      }
    })
  }
}

export const restoreSession = () => {
  return (dispatch) => {
    dispatch(sessionRestoring())

    let unsubscribe = firebaseService.auth()
      .onAuthStateChanged(user => {
        if (user) {
          dispatch(sessionSuccess(user))
          unsubscribe()
        } else {
          dispatch(sessionLogout())
          unsubscribe()
        }
      })
  }
}

export const loadAllMessages = () => {
  return (dispatch) => {
    firebaseService.database().ref('messages').limitToLast(100000).on('value', (snapshot) => {
      var messages = snapshot.val();
      for(key in messages) {
        for(key1 in messages[key]){
          messages[key][key1].send_date =  (messages[key][key1].send_date - new Date().getTimezoneOffset()*60*1000);
        }
      }
      dispatch(loadAllMessagesSuccess(messages))
    }, (errorObject) => {
      dispatch(loadAllMessagesError(errorObject.message))
    })
  }
}

export const loadMessages = (groupKey) => {
  return (dispatch) => {
    firebaseService.database().ref('messages/' + groupKey).limitToLast(1000).on('value', (snapshot) => {
      dispatch(loadMessagesSuccess(snapshot.val()))
    }, (errorObject) => {
      dispatch(loadMessagesError(errorObject.message))
    })
  }
}

export const loadGroups = () => {
  return (dispatch) => {
    FIREBASE_REF_GROUPS.limitToLast(1000).on('value', (snapshot) => {
      var groups = snapshot.val();
      for(key in groups) {
        if('lastMsgDate' in groups[key]) {
          groups[key].lastMsgDate = (groups[key].lastMsgDate - new Date().getTimezoneOffset()*60*1000);
        }
        if('last_visit' in groups[key]) {
          for(key1 in groups[key].last_visit) {
            groups[key].last_visit[key1].createdAt = (groups[key].last_visit[key1].createdAt - new Date().getTimezoneOffset()*60*1000);
          }
        }
      }
      dispatch(loadGroupsSuccess(groups))
    }, (errorObject) => {
      dispatch(loadGroupsError(errorObject.message))
    })
  }
}

export const loadMember = () => {
  return (dispatch) => {
    FIREBASE_REF_USRES.limitToLast(1000).on('value', (snapshot) => {
      dispatch(loadMemberSuccess(snapshot.val()))
    }, (errorObject) => {
      dispatch(loadMemberError(errorObject.message))
    })
  }
}

export const loadPresence = () => {
  return (dispatch) => {
    FIREBASE_REF_PRESENCE.limitToLast(10000).on('value', (snapshot) => {
      dispatch(loadPresenceSuccess(snapshot.val()))
    }, (errorObject) => {
      dispatch(loadPresenceError(errorObject.message))
    })
  }
}

export const loadProfile = (uid) => {
  return (dispatch) => {
    firebaseService.database().ref('users/' + uid).limitToLast(1000).on('value', (snapshot) => {
      dispatch(loadProfileSuccess(snapshot.val()))
    }, (errorObject) => {
      dispatch(loadProfileError(errorObject.message))
    })
  }
}

export const loginUser = (email, password) => {
  return (dispatch) => {
    dispatch(sessionLoading())

    firebaseService.auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        firebaseService.database().ref().child('/users/' + user.user.uid)
          .update({ lastVisit: new Date().getTime() }, (error) => {
            if (error) {
            } else {
            }
          });
        dispatch(sessionSuccess(user))

        //load profile
        firebaseService.database().ref('users/' + user.user.uid).limitToLast(1000).on('value', (snapshot) => {
          dispatch(loadProfileSuccess(snapshot.val()))
        }, (errorObject) => {
          dispatch(loadProfileError(errorObject.message))
        });

        //presence system
        var uid = user.user.uid;

        var userStatusDatabaseRef = firebaseService.database().ref('/status/' + uid);

        var isOfflineForDatabase = {
          state: 'offline',
          last_changed: new Date().getTime(),
        };

        var isOnlineForDatabase = {
          state: 'online',
          last_changed: new Date().getTime(),
        };

        firebaseService.database().ref('.info/connected').on('value', function (snapshot) {
          if (snapshot.val() == false) {
            return;
          };
          userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
        });
      })
      .catch(error => {
        console.log(error);
        dispatch(sessionError(error.message))
      })
  }
}

export const setCC = (uid, country, city) => {
  return (dispatch) => {
    dispatch(ccLoading())
    firebaseService.database().ref().child('/users/' + uid)
      .update({ country: country, city: city }, (error) => {
        if (error) {
          dispatch(ccError(error.message))
        } else {
          dispatch(ccSuccess())
        }
      });
  }
}

export const sendMessage = (uid, msg, groupKey) => {
  return (dispatch) => {
    let createdAt = (new Date().getTime() + new Date().getTimezoneOffset()*60*1000);
    let newMessage = {
      sender_id: uid,
      msg: msg,
      send_date: createdAt,
    }

    firebaseService.database().ref().child('/messages/' + groupKey).push().set(newMessage, (error) => {
      if (error) {
        dispatch(addMessageError(error.message))
      } else {
        dispatch(addMessageSuccess())
      }
    })
    firebaseService.database().ref().child('/groups/' + groupKey)
      .update({ lastMsg: msg, lastMsgDate: createdAt }, (error) => {
        if (error) {
          console.log(error);
        }
      });
  }
}

export const signupUser = (email, password, name, phone) => {
  return (dispatch) => {
    dispatch(sessionLoading())

    firebaseService.auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(error => {
        dispatch(sessionError(error.message));
      })
      .then((user) => {
        let createdAt = new Date().getTime()
        let newUser = {
          id: user.user.uid,
          createdAt: createdAt,
          name: name,
          phone: phone,
          lastVisit: createdAt,
        }
        firebaseService.database().ref().child('/users/' + user.user.uid)
          .set(newUser, (error) => {
            if (error) {
              dispatch(sessionError(error.message))
            } else {
              dispatch(sessionSuccess(user))
            }
          })

        //load profile
        firebaseService.database().ref('users/' + user.user.uid).limitToLast(1000).on('value', (snapshot) => {
          dispatch(loadProfileSuccess(snapshot.val()))
        }, (errorObject) => {
          dispatch(loadProfileError(errorObject.message))
        });

        //presence system
        var uid = user.user.uid;


        var userStatusDatabaseRef = firebaseService.database().ref('/status/' + uid);

        var isOfflineForDatabase = {
          state: 'offline',
          last_changed: new Date().getTime(),
        };

        var isOnlineForDatabase = {
          state: 'online',
          last_changed: new Date().getTime(),
        };

        firebaseService.database().ref('.info/connected').on('value', function (snapshot) {
          if (snapshot.val() == false) {
            return;
          };
          userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
        });
      })
  }
}

export const logoutUser = (uid) => {
  return (dispatch) => {
    dispatch(sessionLoading())

    firebaseService.auth()
      .signOut()
      .then(() => {
        global.navigationProps.navigate('Auth');
        dispatch(sessionLogout())

        firebaseService.database().ref().child('/status/' + uid)
          .update({ state: 'offline' }, (error) => {
            if (error) {
              console.log(error);
            } else {
            }
          });

      })
      .catch(error => {
        dispatch(sessionError(error.message))
      })
  }
}

const sessionRestoring = () => ({
  type: types.SESSION_RESTORING
})

const sessionLoading = () => ({
  type: types.SESSION_LOADING
})

const sessionSuccess = user => ({
  type: types.SESSION_SUCCESS,
  user
})

const sessionError = error => ({
  type: types.SESSION_ERROR,
  error
})

const sessionLogout = () => ({
  type: types.SESSION_LOGOUT
})

const ccLoading = () => ({
  type: types.CC_LOADING
})

const ccSuccess = () => ({
  type: types.CC_SUCCESS,
})

const ccError = error => ({
  type: types.CC_ERROR,
  error
})

const addGroupSuccess = () => ({
  type: types.ADDGROUP_SUCCESS,
})

const addGroupError = error => ({
  type: types.ADDGROUP_ERROR,
  error
})


const addMessageSuccess = () => ({
  type: types.ADD_MESSAGE_SUCCESS,
})

const addMessageError = error => ({
  type: types.ADD_MESSAGE_ERROR,
  error
})

const loadMemberSuccess = members => ({
  type: types.CHAT_LOAD_MEMBER_SUCCESS,
  members
})

const loadMemberError = error => ({
  type: types.CHAT_LOAD_MEMBER_ERROR,
  error
})

const loadGroupsSuccess = groups => ({
  type: types.CHAT_LOAD_GROUPS_SUCCESS,
  groups
})

const loadGroupsError = error => ({
  type: types.CHAT_LOAD_GROUPS_ERROR,
  error
})

const loadMessagesSuccess = messages => ({
  type: types.CHAT_LOAD_MESSAGES_SUCCESS,
  messages
})

const loadMessagesError = error => ({
  type: types.CHAT_LOAD_MESSAGES_ERROR,
  error
})

const loadAllMessagesSuccess = messages => ({
  type: types.CHAT_LOAD_ALL_MESSAGES_SUCCESS,
  messages
})

const loadAllMessagesError = error => ({
  type: types.CHAT_LOAD_ALL_MESSAGES_ERROR,
  error
})

const loadPresenceSuccess = presence => ({
  type: types.LOAD_PRESENCE_SUCCESS,
  presence
})

const loadPresenceError = error => ({
  type: types.LOAD_PRESENCE_ERROR,
  error
})

const loadProfileSuccess = profile => ({
  type: types.LOAD_PROFILE_SUCCESS,
  profile
})

const loadProfileError = error => ({
  type: types.LOAD_PROFILE_ERROR,
  error
})
