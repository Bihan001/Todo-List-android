import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

const TodoModal = ({ list, closeModal, updateList }) => {
  const [todo, setTodo] = useState('');
  const [editText, setEditText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const taskCount = list.todos.length;
  const completedCount = list.todos.filter((todo) => todo.completed).length;

  const toggleEditModalVisibility = () => {
    setShowEditModal(!showEditModal);
  };

  const toggleTodoCompleted = (index) => {
    let tmpList = list;
    tmpList.todos[index].completed = !tmpList.todos[index].completed;
    updateList(tmpList);
  };

  const addTodo = () => {
    let tmpList = list;
    if (!tmpList.todos.some((t) => t.title === todo) && todo.trim()) {
      tmpList.todos.unshift({ title: todo, completed: false });
      updateList(tmpList);
    }
    setTodo('');
  };

  const editTodo = (index) => {
    let tmpList = list;
    if (!tmpList.todos.some((t) => t.title === editText) && editText.trim()) {
      tmpList.todos[index].title = editText;
      updateList(tmpList);
    }
    setEditText('');
    toggleEditModalVisibility();
  };

  const renderTodo = (todo, index) => (
    <TouchableOpacity activeOpacity={1} style={styles.todoContainer} onPress={() => toggleTodoCompleted(index)}>
      <Ionicons
        name={todo.completed ? 'ios-square' : 'ios-square-outline'}
        size={24}
        color='grey'
        style={{ width: 32 }}
      />
      <Text
        style={[
          styles.todo,
          { color: todo.completed ? 'grey' : '#000', textDecorationLine: todo.completed ? 'line-through' : 'none' },
        ]}>
        {todo.title}
      </Text>
    </TouchableOpacity>
  );

  const deleteTodo = (index) => {
    let tmpList = list;
    tmpList.todos.splice(index, 1);
    updateList(tmpList);
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={showEditModal}
        backdropOpacity={0.6}
        avoidKeyboard={true}
        animationIn='fadeInUpBig'
        animationOut='fadeOutDownBig'
        swipeDirection={['down', 'left', 'right', 'up']}
        backdropTransitionOutTiming={0}
        onBackButtonPress={toggleEditModalVisibility}
        onBackdropPress={toggleEditModalVisibility}
        onSwipeComplete={toggleEditModalVisibility}
        style={{ margin: 0, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            backgroundColor: '#ffffff',
            paddingVertical: 40,
            paddingHorizontal: 40,
            marginHorizontal: 20,
            borderRadius: 6,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TextInput
              value={editText}
              onChangeText={(text) => setEditText(text)}
              onSubmitEditing={() => editTodo(selectedIndex)}
              placeholder='Edit Todo'
              style={{
                borderColor: list.color,
                borderWidth: 0.5,
                height: 48,
                width: 200,
                borderRadius: 6,
                paddingLeft: 10,
                marginRight: 5,
              }}
            />
            <TouchableOpacity
              style={{ padding: 14, borderRadius: 4, backgroundColor: list.color }}
              onPress={() => editTodo(selectedIndex)}>
              <AntDesign name='check' size={22} color='white' />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        onPress={() => closeModal()}>
        <AntDesign name='close' size={24} color='#000' />
      </TouchableOpacity>

      <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
        <View>
          <Text style={styles.title}>{list.name}</Text>
          <Text style={styles.taskCount}>
            {completedCount} of {taskCount} tasks
          </Text>
        </View>
      </View>
      <View style={[styles.section, { flex: 3 }]}>
        {/* <FlatList
          data={list.todos}
          renderItem={({ item, index }) => renderTodo(item, index)}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
          showsVerticalScrollIndicator={false}
        /> */}
        {list.todos.length < 1 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Text style={{ color: '#888', fontSize: 16, paddingBottom: 2 }}>Create a new Todo below.</Text>
            <Text style={{ color: '#888', fontSize: 16 }}>Note: Swipe a todo to edit or delete it!</Text>
          </View>
        ) : null}
        <SwipeListView
          useFlatList={true}
          data={list.todos}
          useNativeDriver={true}
          keyExtractor={(item) => item.title}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
          renderItem={(rowData, rowMap) => renderTodo(rowData.item, rowData.index)}
          renderHiddenItem={(rowData, rowMap) => (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                alignItems: 'center',
                flex: 1,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: list.color,
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  borderTopLeftRadius: 4,
                  borderBottomLeftRadius: 4,
                }}
                onPress={() => {
                  toggleEditModalVisibility();
                  setSelectedIndex(rowData.index);
                  setEditText(list.todos[rowData.index].title);
                }}>
                <AntDesign name='edit' size={20} color='#fff' />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#F73345',
                  paddingHorizontal: 18,
                  paddingVertical: 16,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                }}
                onPress={() => deleteTodo(rowData.index)}>
                <AntDesign name='delete' size={20} color='#fff' />
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-115}
        />
      </View>
      <KeyboardAvoidingView style={[styles.section, styles.footer]}>
        <TextInput
          style={[styles.input, { borderColor: list.color }]}
          placeholder='Add Todo'
          onChangeText={(text) => setTodo(text)}
          value={todo}
          onSubmitEditing={() => addTodo()}
        />
        <TouchableOpacity style={[styles.addTodo, { backgroundColor: list.color }]} onPress={() => addTodo()}>
          <AntDesign name='plus' size={16} color='white' />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default TodoModal;

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  section: {
    flex: 1,
    alignSelf: 'stretch',
  },
  header: {
    justifyContent: 'flex-end',
    marginLeft: 64,
    borderBottomWidth: 3,
  },
  title: {
    fontSize: 30,
    fontFamily: 'open_sans_bolder',
    color: '#000',
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: 'grey',
    fontFamily: 'open_sans_bold',
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 18,
  },
  todo: {
    fontSize: 16,
    fontFamily: 'open_sans_bold',
  },
});
