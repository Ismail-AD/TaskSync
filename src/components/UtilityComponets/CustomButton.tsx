import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const CustomButton = ({onPress}: {onPress: () => void}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styling.btnContainer}>
      <Text style={styling.btnText}>Get Started</Text>
    </TouchableOpacity>
  );
};
const styling = StyleSheet.create({
  btnContainer: {
    elevation: 4,
    width: '100%',
    backgroundColor: '#8F80EF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  btnText: {
    alignSelf: 'center',
    textTransform: 'uppercase',
    color: 'white',
    fontSize:16,
    fontWeight:'bold'
  },
});

export default CustomButton;
