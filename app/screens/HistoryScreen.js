import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HistoryScreen = () => {
  const [completedTimers, setCompletedTimers] = useState([]);
  const navigation = useNavigation(); 

  useEffect(() => {
    loadCompletedTimers();
  }, []);

  const loadCompletedTimers = async () => {
    const savedTimers = await AsyncStorage.getItem('completedTimers');
    if (savedTimers) {
      setCompletedTimers(JSON.parse(savedTimers));
    }
  };

  const handleGoBack = () => {
    navigation.goBack(); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>History Screen - Completed Timers</Text>
      <FlatList
        data={completedTimers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
         <View style={{backgroundColor: '#fff',
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,}}>
           <View style={styles.timerItem}>
          <Text style={styles.timerName}>{item.name}</Text>
          <View style={styles.dot}></View>
        </View>

          <View>
          <Text style={styles.completionTime}>Completed at: {item.completionTime}</Text>
          </View>
         </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:14,

  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  timerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginLeft: 10,
  },
  timerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  completionTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});

export default HistoryScreen;
