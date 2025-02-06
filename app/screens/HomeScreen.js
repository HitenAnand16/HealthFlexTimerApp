import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimerItem from '../component/TimerItem';  
import { Picker } from '@react-native-picker/picker'; 
import { MaterialIcons } from 'react-native-vector-icons';

const HomeScreen = ({ navigation }) => {
  const [timers, setTimers] = useState([]);
  const [name, setName] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [category, setCategory] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
    const totalDuration = hours * 3600 + minutes * 60 + seconds; 

    if (name && totalDuration > 0 && category) {
      const newTimer = { 
        id: Date.now().toString(), 
        name, 
        duration: totalDuration, 
        remaining: totalDuration, 
        category,
        status: 'Running', 
        running: true 
      };
      saveTimers([newTimer]); 
      setName(''); 
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setCategory('');
      setModalVisible(false); 
    }
  };

  const deleteTimer = (id) => {
    const updatedTimers = timers.filter((timer) => timer.id !== id);
    saveTimers(updatedTimers);
  };

  return (
    <View style={{ flex: 1, paddingTop: "10%", backgroundColor: "white" }}>
      {timers.length > 0 ? (
        <TimerItem timer={timers[0]} onDelete={deleteTimer} />  
      ) : (
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
          <Text style={{ fontSize: 18, color: 'gray' }}>Press + to add a timer</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 90,
          right: 20,
          backgroundColor: 'black',
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          width: 60,
          height: 60
        }}
        onPress={() => navigation.navigate('History')}
      >
        <MaterialIcons name="history" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          backgroundColor: 'black',
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          width: 60,
          height: 60
        }}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 40, width: '95%', position: "absolute", bottom: 10 }}>
            <TextInput
              placeholder="Timer Name"
              value={name}
              onChangeText={setName}
              style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 10 }}
            />
            <TextInput
              placeholder="Category"
              value={category}
              onChangeText={setCategory}
              style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 10 }}
            />
            {/* Duration Pickers */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text>Hours</Text>
                <Picker
                  selectedValue={hours}
                  onValueChange={(itemValue) => setHours(itemValue)}
                >
                  {[...Array(24).keys()].map((i) => (
                    <Picker.Item key={i} label={`${i}`} value={i} />
                  ))}
                </Picker>
              </View>
              <View style={{ flex: 1 }}>
                <Text>Minutes</Text>
                <Picker
                  selectedValue={minutes}
                  onValueChange={(itemValue) => setMinutes(itemValue)}
                >
                  {[...Array(60).keys()].map((i) => (
                    <Picker.Item key={i} label={`${i}`} value={i} />
                  ))}
                </Picker>
              </View>
              <View style={{ flex: 1 }}>
                <Text>Seconds</Text>
                <Picker
                  selectedValue={seconds}
                  onValueChange={(itemValue) => setSeconds(itemValue)}
                >
                  {[...Array(60).keys()].map((i) => (
                    <Picker.Item key={i} label={`${i}`} value={i} />
                  ))}
                </Picker>
              </View>
            </View>
            <Button title="Add Timer" onPress={addTimer} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
