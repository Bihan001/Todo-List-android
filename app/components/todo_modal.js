import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, TextInput, Keyboard } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';

const TodoModal = ({ list, closeModal, updateList }) => {
  const [todo, setTodo] = useState('');

  const taskCount = list.todos.length;
  const completedCount = list.todos.filter((todo) => todo.completed).length;

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
    Keyboard.dismiss();
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
      <TouchableOpacity style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }} onPress={() => closeModal()}>
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
        <SwipeListView
          useFlatList={true}
          data={list.todos}
          useNativeDriver={true}
          keyExtractor={(item) => item.title}
          contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
          renderItem={(rowData, rowMap) => renderTodo(rowData.item, rowData.index)}
          renderHiddenItem={(rowData, rowMap) => (
            <View style={{ position: 'absolute', top: 0, right: 0, alignItems: 'center', flex: 1 }}>
              <TouchableOpacity
                style={{ backgroundColor: list.color, paddingHorizontal: 18, paddingVertical: 16, borderRadius: 4 }}
                onPress={() => deleteTodo(rowData.index)}>
                <AntDesign name='delete' size={20} color='#fff' />
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-66}
        />
      </View>
      <KeyboardAvoidingView style={[styles.section, styles.footer]}>
        <TextInput
          style={[styles.input, { borderColor: list.color }]}
          placeholder='Add Todo'
          onChangeText={(text) => setTodo(text)}
          value={todo}
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
  },
  todo: {
    fontSize: 16,
    fontFamily: 'open_sans_bold',
  },
});
