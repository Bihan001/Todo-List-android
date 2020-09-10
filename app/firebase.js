import firebase from 'firebase';

export const firebaseConfig = {
  apiKey: 'AIzaSyAnVGlUU2CAhqGL5arzjWRXQgz5yET4QgY',
  authDomain: 'native-todo-list.firebaseapp.com',
  databaseURL: 'https://native-todo-list.firebaseio.com',
  projectId: 'native-todo-list',
  storageBucket: 'native-todo-list.appspot.com',
  messagingSenderId: '143612177439',
  appId: '1:143612177439:web:e4b49580a26aaefa09792a',
  measurementId: 'G-Y12YNJ321L',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
