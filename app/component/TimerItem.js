import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, Animated, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressBar } from 'react-native-paper';
import * as Haptics from 'expo-haptics'; 

const TimerItem = ({ timer, onDelete }) => {
  const [remainingTime, setRemainingTime] = useState(timer.remaining);
  const [status, setStatus] = useState(timer.status);
  const [intervalId, setIntervalId] = useState(null);
  const [blink, setBlink] = useState(false);
  const [blinkInterval, setBlinkInterval] = useState(null);
  const [backgroundColor] = useState(new Animated.Value(0));

  const getBackgroundColor = () => {
    const percentageLeft = remainingTime / timer.duration;

    if (percentageLeft > 0.7) {
      return 'green';
    } else if (percentageLeft > 0.4) {
      return 'yellow';
    } else {
      if (blink) {
        return 'red';
      }
      return 'transparent';
    }
  };

  const getTextColor = () => {
    const backgroundColor = getBackgroundColor();
    if (backgroundColor === 'green') {
      return 'white';
    } else if (backgroundColor === 'yellow' || backgroundColor === 'red') {
      return 'black';
    }
    return 'black'; 
    };

  const startBlinking = () => {
    const blinkIntervalId = setInterval(() => {
      setBlink((prev) => !prev);
    }, 1000);
    setBlinkInterval(blinkIntervalId);
  };

  const animateBackgroundColor = (color) => {
    Animated.timing(backgroundColor, {
      toValue: color === 'green' ? 0 : color === 'yellow' ? 1 : 2,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    animateBackgroundColor(getBackgroundColor());
  }, [remainingTime, blink]);

  const handleStart = () => {
    setStatus('Running');
    const id = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(id);
          clearInterval(blinkInterval);
          setStatus('Completed');
          saveCompletedTimer();
          Alert.alert('Congratulations!', `Timer ${timer.name} is completed!`);
          onDelete(timer.id);
          return 0;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); 

        return newTime;
      });
    }, 1000);

    startBlinking();
    setIntervalId(id);
  };

  const handlePause = () => {
    clearInterval(intervalId);
    clearInterval(blinkInterval);
    setStatus('Paused');
  };

  const handleReset = () => {
    clearInterval(intervalId);
    setRemainingTime(timer.duration);
    clearInterval(blinkInterval);
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

  const handleDelete = () => {
    Alert.alert(
      'Delete Timer',
      `Are you sure you want to delete "${timer.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => onDelete(timer.id) },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    setRemainingTime(timer.remaining);
  }, [timer]);

  useEffect(() => {
    if (status === 'Running') {
      handleStart();
    }

    return () => {
      clearInterval(intervalId);
      clearInterval(blinkInterval);
    };
  }, [status]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const backgroundColorInterpolation = backgroundColor.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['green', 'yellow', 'red'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: backgroundColorInterpolation }]}>
      <Text style={[styles.title, { color: getTextColor() }]}>Title: {timer.name}</Text>
      <Text style={[styles.timeText, { color: getTextColor() }]}>{formatTime(remainingTime)}</Text>
      <ProgressBar progress={remainingTime / timer.duration} color="black" style={styles.progressBar} />

      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          {status === 'Paused' ? (
            <Button title="Start" onPress={handleStart} color="green" />
          ) : status === 'Running' ? (
            <Button title="Pause" onPress={handlePause} color="black" />
          ) : (
            <Button title="Reset" onPress={handleReset} color="blue" />
          )}
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Delete" onPress={handleDelete} color="red" />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    borderRadius: 40,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  timeText: {
    fontSize: 80,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  buttonWrapper: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    borderRadius: 50,
    width:"45%"
  },
});

export default TimerItem;
