import React, { useState, useEffect } from 'react';
import { View, Text, Button, ProgressBarAndroid, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TimerItem = ({ timer }) => {
  const [remainingTime, setRemainingTime] = useState(timer.remaining);
  const [status, setStatus] = useState(timer.status);
  const [intervalId, setIntervalId] = useState(null);

  const handleStart = () => {
    setStatus('Running');
    const id = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(id);
          setStatus('Completed');
          saveCompletedTimer();
          Alert.alert('Congratulations!', `Timer ${timer.name} is completed!`);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const handlePause = () => {
    clearInterval(intervalId);
    setStatus('Paused');
  };

  const handleReset = () => {
    clearInterval(intervalId);
    setRemainingTime(timer.duration);
    setStatus('Paused');
  };

  const saveCompletedTimer = async () => {
    const completedTimers = await AsyncStorage.getItem('completedTimers');
    const parsedTimers = completedTimers ? JSON.parse(completedTimers) : [];
    parsedTimers.push({
      name: timer.name,
      completionTime: new Date().toLocaleString(),
    });
    await AsyncStorage.setItem('completedTimers', JSON.stringify(parsedTimers));
  };

  useEffect(() => {
    setRemainingTime(timer.remaining);
  }, [timer]);

  return (
    <View style={{ marginBottom: 20 }}>
      <Text>{timer.name}</Text>
      <Text>Remaining: {remainingTime}s</Text>
      <Text>Status: {status}</Text>
      <ProgressBarAndroid style={{ marginVertical: 10 }} progress={remainingTime / timer.duration} indeterminate={false} />

      {status === 'Paused' ? (
        <Button title="Start" onPress={handleStart} />
      ) : status === 'Running' ? (
        <Button title="Pause" onPress={handlePause} />
      ) : (
        <Button title="Reset" onPress={handleReset} />
      )}
    </View>
  );
};

export default TimerItem;
