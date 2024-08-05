import {View, Text, StyleSheet, LayoutAnimation} from 'react-native';
import React from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {TodoData} from '../MainScreen';
import {TouchableOpacity} from 'react-native';
import Animated, {SlideInLeft, SlideOutRight} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/AntDesign';

const truncateTask = (task: string) => {
  return task.length > 22 ? task.substring(0, 22) + '...' : task;
};

const SingleTodo = ({
  itemIndex,
  todoItem,
  onPress,
  onMarkCheck,
  onDeleteHit,
}: {
  itemIndex: number;
  todoItem: TodoData;
  onPress: () => void;
  onMarkCheck: () => void;
  onDeleteHit: () => void;
}) => {
  return (
    <Animated.View
      entering={SlideInLeft.delay(itemIndex * 100)}
      exiting={SlideOutRight.duration(500)}>
      <TouchableOpacity
        style={[styling.singleTask]}
        activeOpacity={0.7}
        onPress={onPress}>
        <View style={styling.divider} />
        <View style={styling.taskParent}>
          <Text
            style={[
              styling.taskTitle,
              todoItem.completed ? {textDecorationLine: 'line-through'} : {},
            ]}>
            {truncateTask(todoItem.task)}
          </Text>
          <View style={styling.iconParent}>
            <BouncyCheckbox
              isChecked={todoItem.completed}
              innerIconStyle={{borderWidth: 2}}
              onPress={() => onMarkCheck()}
            />
            <TouchableOpacity onPress={onDeleteHit}>
              <Icon name="delete" size={25} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styling = StyleSheet.create({
  singleTask: {
    borderRadius: 5,
    flexDirection: 'row',
    backgroundColor: 'white',
    overflow: 'hidden',
    marginTop: 9,
    marginHorizontal: 20,
    paddingEnd:10
  },
  divider: {
    backgroundColor: 'black',
    width: 4,
    height: '100%',
  },
  iconParent: {
    flexDirection:'row',
  },
  taskParent: {
    flex: 1,
    paddingVertical: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskTitle: {
    fontSize: 17,
    marginStart: 15,
  },
});
export default SingleTodo;
