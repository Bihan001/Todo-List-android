import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, ImageBackground, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import TodoList from './components/todo_list';
import AddListModal from './components/add_list_modal';
import { AppLoading } from 'expo';
import firebase from './firebase';

import {
  useFonts,
  OpenSans_300Light,
  OpenSans_300Light_Italic,
  OpenSans_400Regular,
  OpenSans_400Regular_Italic,
  OpenSans_600SemiBold,
  OpenSans_600SemiBold_Italic,
  OpenSans_700Bold,
  OpenSans_700Bold_Italic,
  OpenSans_800ExtraBold,
  OpenSans_800ExtraBold_Italic,
} from '@expo-google-fonts/open-sans';

const Main = () => {
  const [fontsLoaded, error] = useFonts({
    open_sans_light: OpenSans_300Light,
    open_sans_regular: OpenSans_400Regular,
    open_sans_bold: OpenSans_600SemiBold,
    open_sans_bolder: OpenSans_700Bold,
  });

  const [addTodoVisible, setAddTodoVisibility] = useState(false);
  const [list, setList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else
        firebase
          .auth()
          .signInAnonymously()
          .catch((err) => console.log(err));
    });
  }, []);

  useEffect(() => {
    if (user) {
      let ref = firebase.firestore().collection('users').doc(user.uid).collection('lists').orderBy('name');
      let unsubscribe = ref.onSnapshot((snapshot) => {
        let lists = [];
        snapshot.forEach((doc) => {
          lists.push({ id: doc.id, ...doc.data() });
        });
        setList(lists);
        setLoading(false);
      });
    }
  }, [user]);

  const updateList = (item) =>
    firebase.firestore().collection('users').doc(user.uid).collection('lists').doc(item.id).update(item);

  const toggleAddTodoVisibility = () => setAddTodoVisibility(!addTodoVisible);

  const renderList = (list) => <TodoList list={list} updateList={updateList} />;

  const addList = (item) => {
    firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('lists')
      .add({ name: item.name, color: item.color, todos: [] });
  };

  if (!fontsLoaded) return <AppLoading />;

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size='large' color='dodgerblue' />
    </View>
  ) : (
    <ImageBackground style={styles.container}>
      <Modal
        isVisible={addTodoVisible}
        animationIn='fadeInUpBig'
        animationOut='fadeOutDownBig'
        animationInTiming={200}
        onSwipeComplete={toggleAddTodoVisibility}
        onBackButtonPress={toggleAddTodoVisibility}
        onBackdropPress={toggleAddTodoVisibility}
        swipeDirection={['down', 'left', 'right']}
        avoidKeyboard={true}
        backdropTransitionOutTiming={0}
        hideModalContentWhileAnimating={true}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <AddListModal closeModal={toggleAddTodoVisibility} addList={addList} />
      </Modal>

      <View style={{ flexDirection: 'row' }}>
        <View style={styles.divider}></View>
        <Text style={{ fontSize: 40, paddingHorizontal: 20 }}>
          TODO<Text style={styles.title}>LIST</Text>
        </Text>
        <View style={styles.divider}></View>
      </View>

      <View style={{ height: 275, paddingLeft: 32, marginTop: '-10%' }}>
        <Animated.FlatList
          data={list}
          keyExtractor={(item) => item.name}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderList(item)}
          keyboardShouldPersistTaps='always'
        />
      </View>

      <View>
        <TouchableOpacity style={styles.addList} onPress={() => toggleAddTodoVisibility()}>
          <AntDesign name='plus' size={26} color='#fff' />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'cover',
    marginBottom: 30,
    paddingTop: 130,
  },
  divider: {
    backgroundColor: 'grey',
    height: 1,
    flex: 1,
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'open_sans_bolder',
    color: '#54A9F0',
  },
  addList: {
    backgroundColor: '#54A9F0',
    borderRadius: 100,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    marginTop: 8,
    fontFamily: 'open_sans_bold',
    fontSize: 14,
    color: '#444',
  },
});

export default Main;
