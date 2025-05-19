import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';

const Header = (props) => {

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>
          Informações da Vaga
        </Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
 headerContainer: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   width: '100%',
   backgroundColor: '#63bc74', // Fundo verde do cabeçalho
 },
 headerTitle: {
   fontSize: 25,
   fontWeight: 'bold',
   color: 'white',
   paddingTop:40,
   paddingBottom:20,
 },
});