import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const AddListModal = ({ closeModal, addList }) => {
  const backgroundColors = ['#5CD859', '#24A6D9', '#595BD9', '#8022D9', '#D159D8', '#D85963', '#D88559'];
  const [listName, setListName] = useState('');
  const [currentColor, setCurrentColor] = useState(backgroundColors[0]);
  const [error, setError] = useState(false);
  const renderColors = () =>
    backgroundColors.map((color) => (
      <TouchableOpacity
        key={color}
        style={[styles.colorSelect, { backgroundColor: color }]}
        onPress={() => setCurrentColor(color)}
      />
    ));
  const handleTextChange = (text) => {
    setListName(text);
    setError(false);
  };
  const createTodo = () => {
    if (listName.trim() === '') return setError(true);
    let list = { name: listName, color: currentColor };
    addList(list);
    setListName('');
    setError(false);
    closeModal();
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{ position: 'absolute', top: 32, right: 32 }}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        onPress={() => closeModal()}>
        <AntDesign name='close' size={24} color='#000' />
      </TouchableOpacity>

      <View style={{ alignSelf: 'stretch', marginHorizontal: 32 }}>
        <Text style={styles.title}>Create Todo List</Text>
        <TextInput
          required
          style={[styles.input, { borderColor: !error ? currentColor : 'red' }]}
          placeholder='List Name?'
          value={listName}
          onChangeText={(text) => handleTextChange(text)}
          onSubmitEditing={() => createTodo()}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>{renderColors()}</View>

        <TouchableOpacity style={[styles.create, { backgroundColor: currentColor }]} onPress={() => createTodo()}>
          <Text style={{ color: '#fff', fontFamily: 'open_sans_bold', fontSize: 16 }}>Create!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddListModal;

const styles = StyleSheet.create({
  container: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'open_sans_bold',
    color: '#000',
    alignSelf: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    height: 50,
    marginTop: 8,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  create: {
    marginTop: 24,
    height: 50,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelect: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
});
