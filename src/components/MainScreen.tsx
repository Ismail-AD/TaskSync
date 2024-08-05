import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Keyboard,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, {useEffect, useRef, useState} from 'react';
import {HEIGHT} from '../Utils/const';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SingleTodo from './UtilityComponets/SingleTodo';
import SearchBar from './UtilityComponets/SearchBar';

const TODOS_STORAGE_KEY = 'TodoList';

function getCurrentDate() {
  const date = new Date();
  const monthname = date.toLocaleString('default', {month: 'long'});
  const dayname = date.toLocaleString('default', {weekday: 'long'});
  const todaysDate = ('0' + date.getDate()).slice(-2);

  return dayname + ' ' + todaysDate + ' ' + monthname;
}

export type TodoData = {
  id: string;
  task: string;
  completed: boolean;
};

async function saveTodo(data: TodoData) {
  try {
    const oldTodos = await fetchTodo();
    const newList = [...oldTodos, data];
    const dataInJson = JSON.stringify(newList);
    await AsyncStorage.setItem(TODOS_STORAGE_KEY, dataInJson);
  } catch (error) {
    console.log('Error while saving todo: ', error);
  }
}

async function fetchTodo() {
  try {
    const dataInJson = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
    return dataInJson != null ? JSON.parse(dataInJson) : [];
  } catch (error) {
    return [];
  }
}

const MainScreen = () => {
  const [bottomSheetOpen, setSheetState] = useState(false);
  const [enableSave, setSaveState] = useState(false);
  const [isFocused, setFocusState] = useState(false);
  const [isEditTodo, setOperationState] = useState(false);
  const [todoList, setListState] = useState<TodoData[]>([]);
  const [fiteredTodoList, setFilterListState] = useState<TodoData[]>([]);
  const [searchQuery, setQueryState] = useState('');
  const [InputData, setDataState] = useState('');
  const [itemToEdit, setEditItemState] = useState<[number, TodoData] | null>(
    null,
  );
  const snapPoints = React.useMemo(() => ['40%', '75%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inputFieldRef = useRef<TextInput>(null);
  async function onSaveClick() {
    await saveTodo({
      id: Date.now().toString(),
      task: InputData,
      completed: false,
    });
    await loadTodos();
    closeSheet();
  }
  const closeSheet = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      inputFieldRef.current?.clear();
      setDataState('');
      setOperationState(false);
      bottomSheetRef.current?.close();
      setSheetState(false);
    }, 100);
  };
  const updateTodo = async (index: number, todoitem: TodoData) => {
    console.log('update Call');
    try {
      const getTodos = await fetchTodo();
      getTodos[index] = todoitem;
      await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(getTodos));
      console.log('After UPDATE: ' + getTodos);
      setListState(getTodos);
      closeSheet();
    } catch (error) {
      console.warn(error);
    }
  };

  const deleteTodo = async (idOfItem: string) => {
    try {
      const getTodos: TodoData[] = await fetchTodo();
      const todosAfter = getTodos.filter(item => item.id !== idOfItem);
      await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todosAfter));
      setListState(todosAfter);
    } catch (error) {
      console.warn(error);
    }
  };

  const loadTodos = async () => {
    const getTodos = await fetchTodo();
    setListState(getTodos);
  };
  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const filterTodos = () => {
      if (searchQuery.trim() == '') {
        setFilterListState(todoList);
      } else {
        const filteredList = todoList.filter(item =>
          item.task.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setFilterListState(filteredList);
      }
    };
    filterTodos();
  }, [todoList, searchQuery]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styling.main}>
        <View style={[styling.firstBox, styling.commonStyle]}>
          <Text style={styling.textSmall}>{getCurrentDate()}</Text>
          <Text style={{fontSize: 18, fontWeight: '900'}}>TaskSync</Text>
        </View>

        <SearchBar
          input={searchQuery}
          isFocus={isFocused}
          onFieldClick={focusChange => setFocusState(focusChange)}
          onChangeValue={value => {
            setQueryState(value);
          }}
          onClearText={() => setQueryState('')}
        />

        <Text style={styling.title}>Tasks</Text>

        <FlatList
          data={fiteredTodoList}
          renderItem={({item, index}) => (
            <SingleTodo
              itemIndex={index}
              todoItem={item}
              onPress={() => {
                setDataState(item.task);
                setOperationState(true);
                setEditItemState([
                  todoList.findIndex(isItem => item.id == isItem.id),
                  item,
                ]);
                setSheetState(true);
              }}
              onMarkCheck={() =>
                updateTodo(
                  todoList.findIndex(isItem => item.id == isItem.id),
                  {
                    id: item.id,
                    task: item.task,
                    completed: !item.completed,
                  },
                )
              }
              onDeleteHit={() => deleteTodo(item.id)}
            />
          )}
          keyExtractor={(item: TodoData) => item.id}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styling.btnContainer}
          onPress={() => setSheetState(!bottomSheetOpen)}>
          <Icon name="plus" color="black" size={38} />
        </TouchableOpacity>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        snapPoints={snapPoints}
        style={styling.mainContainerOfBottom}
        index={bottomSheetOpen ? 0 : -1}
        onClose={() => (bottomSheetOpen ? closeSheet() : {})}>
        <BottomSheetView style={styling.contentBottom}>
          <View style={styling.top}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styling.iconParent}
              onPress={() => closeSheet()}>
              <Icon name="close" color="black" size={25} />
            </TouchableOpacity>
            <Text style={{fontSize: 16}}>New To-Do</Text>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styling.iconParent}
              onPress={() => {
                isEditTodo && itemToEdit != null
                  ? updateTodo(itemToEdit[0], {
                      id: itemToEdit[1].id,
                      task: InputData,
                      completed: itemToEdit[1].completed,
                    })
                  : onSaveClick();
              }}
              disabled={!enableSave}>
              <Icon
                name="check"
                color={enableSave ? 'black' : 'lightgray'}
                size={25}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            value={InputData}
            ref={inputFieldRef}
            multiline
            style={styling.field}
            placeholder="Input your task"
            onChangeText={(value: string) => {
              setSaveState(value.trim().length > 0);
              setDataState(value);
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styling = StyleSheet.create({
  iconParent: {
    padding: 8,
  },
  mainContainerOfBottom: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentBottom: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
  },
  commonStyle: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 35,
    fontWeight: '500',
    marginHorizontal: 18,
    marginVertical: 12,
  },
  field: {
    borderWidth: 2,
    borderColor: 'black',
    paddingStart: 15,
    borderRadius: 7,
    marginTop: 20,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  main: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#EDF3FF',
  },
  sheetParent: {
    height: HEIGHT,
    backgroundColor: 'white',
    width: '100%',
    position: 'absolute',
    zIndex: 1,
  },
  textSmall: {
    fontSize: 16,
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
  textoptions: {
    fontSize: 16,
    fontWeight: '500',
    color: '#AFAFAF',
  },
  firstBox: {},
  choiceBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  btnContainer: {
    elevation: 3,
    position: 'absolute',
    bottom: 30,
    height: 65,
    width: 65,
    borderRadius: 50,
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainScreen;
