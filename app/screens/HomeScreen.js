import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, TouchableOpacity, SectionList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimerItem from '../component/TimerItem';

const HomeScreen = ({ navigation }) => {
  const [timers, setTimers] = useState([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    loadTimers();
  }, []);

  const loadTimers = async () => {
    const savedTimers = await AsyncStorage.getItem('timers');
    if (savedTimers) setTimers(JSON.parse(savedTimers));
  };

  const saveTimers = async (newTimers) => {
    setTimers(newTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
  };

  const addTimer = () => {
    if (name && duration && category) {
      const newTimer = { 
        id: Date.now().toString(), 
        name, 
        duration: parseInt(duration), 
        remaining: parseInt(duration), 
        category,
        status: 'Paused', // Status can be "Running", "Paused", or "Completed"
        running: false
      };
      saveTimers([...timers, newTimer]);
      setName('');
      setDuration('');
      setCategory('');
    }
  };

  const groupTimersByCategory = () => {
    return timers.reduce((acc, timer) => {
      const category = timer.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(timer);
      return acc;
    }, {});
  };

  const categories = groupTimersByCategory();

  return (
    <View style={{ padding: 10 }}>
      <TextInput
        placeholder="Timer Name"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Duration (sec)"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <Button title="Add Timer" onPress={addTimer} />

      <SectionList
        sections={Object.keys(categories).map((category) => ({
          title: category,
          data: categories[category],
        }))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TimerItem timer={item} />}
        renderSectionHeader={({ section }) => (
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{section.title}</Text>
        )}
      />

      <Button title="Go to History" onPress={() => navigation.navigate('History')} />
    </View>
  );
};

export default HomeScreen;
