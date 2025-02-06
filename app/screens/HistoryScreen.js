import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = () => {
  const [completedTimers, setCompletedTimers] = useState([]);

  useEffect(() => {
    loadCompletedTimers();
  }, []);

  const loadCompletedTimers = async () => {
    const savedTimers = await AsyncStorage.getItem('completedTimers');
    if (savedTimers) {
      setCompletedTimers(JSON.parse(savedTimers));
    }
  };

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>History Screen - Completed Timers</Text>
      <FlatList
        data={completedTimers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>{item.name}</Text>
            <Text>Completed at: {item.completionTime}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HistoryScreen;
