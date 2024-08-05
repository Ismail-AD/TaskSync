import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({
  input,
  isFocus,
  onFieldClick,
  onChangeValue,
  onClearText,
}: {
  input: string;
  isFocus: boolean;
  onFieldClick: (focusChange: boolean) => void;
  onChangeValue: (value: string) => void;
  onClearText: () => void;
}) => {
  return (
    <View style={styling.parent}>
      <Icon name="search-outline" size={24} />
      <TextInput
        value={input}
        style={styling.field}
        placeholder="Search Task"
        onBlur={() => onFieldClick(false)}
        onChangeText={value => {
          onFieldClick(value.trim().length > 0);
          onChangeValue(value);
        }}
      />

      {isFocus && (
        <TouchableOpacity onPress={onClearText} activeOpacity={0.6}>
          <Icon name="close" size={25} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styling = StyleSheet.create({
  parent: {
    marginTop: 20,
    marginHorizontal: 18,
    paddingVertical: 4,
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  field: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 5,
  },
});
export default SearchBar;
