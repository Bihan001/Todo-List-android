import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import TodoModal from './todo_modal';

const TodoList = ({ list, updateList }) => {
  const [showListVisible, setShowListVisibility] = useState(false);
  const toggleListModal = () => {
    setShowListVisibility(!showListVisible);
  };
  const completedCount = list.todos.filter((item) => item.completed).length;
  const remainingCount = list.todos.length - completedCount;
  return (
    <View>
      <Modal
        isVisible={showListVisible}
        animationIn='fadeInUpBig'
        animationOut='fadeOutDownBig'
        onSwipeComplete={toggleListModal}
        onBackButtonPress={toggleListModal}
        onBackdropPress={toggleListModal}
        swipeDirection={['down', 'left', 'right']}
        avoidKeyboard={true}
        backdropTransitionOutTiming={0}
        propagateSwipe={true}
        style={{ margin: 0, justifyContent: 'flex-end' }}>
        <TodoModal list={list} closeModal={toggleListModal} updateList={updateList} />
      </Modal>
      <View
        style={{
          flex: 1,
          borderRadius: 6,
          marginHorizontal: 12,
          width: 200,
          backgroundColor: '#ddd',
        }}>
        <LinearGradient
          style={[styles.listContainer]}
          colors={[list.color, list.color.slice(0, 3) + 'aaaa']}
          start={{ x: 0.0, y: 0 }}
          end={{ x: 1, y: 1.0 }}>
          <TouchableOpacity onPress={() => toggleListModal()}>
            <Text style={styles.listTitle} numberOfLines={1}>
              {list.name}
            </Text>
            <View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.count}>{remainingCount}</Text>
                <Text style={styles.listSubTitle}>Remaining</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.count}>{completedCount}</Text>
                <Text style={styles.listSubTitle}>Completed</Text>
              </View>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderBottomEndRadius: 78,
    overflow: 'hidden',
    alignItems: 'center',
    width: 200,
  },
  listTitle: {
    fontSize: 24,
    fontFamily: 'open_sans_bold',
    color: '#fff',
    marginBottom: 18,
  },
  count: {
    fontFamily: 'open_sans_light',
    fontSize: 48,
    color: '#fff',
  },
  listSubTitle: {
    fontSize: 14,
    fontFamily: 'open_sans_bolder',
    color: '#fff',
  },
});
