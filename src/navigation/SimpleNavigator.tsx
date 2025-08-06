import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

// 简单的测试页面
const TestScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>智能家居应用</Text>
    <Text style={styles.subtitle}>应用启动成功！</Text>
  </View>
);

const SimpleNavigator = () => {
  return (
    <NavigationContainer>
      <TestScreen />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default SimpleNavigator;