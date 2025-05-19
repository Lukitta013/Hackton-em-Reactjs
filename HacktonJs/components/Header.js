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
    <View
      style={{
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingLeft:10,
        paddingRight:10,
        paddingBottom:10,
      }}>
        <Image
          style={{ width: 80, height: 50 }}
          source={require('../assets/Etec-Logo.png')}
        />
      </View>
      <Text style={styles.headerTitle}>
          Vagas
        </Text>
        <TouchableOpacity
          style={styles.searchIcon}
          onPress={() => props.toggleSearchBar()}>
          <AntDesign name="search1" size={27} color="white" />
        </TouchableOpacity>
      </View>
  );
};

export default Header;

const styles = StyleSheet.create({
 headerContainer: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   width: '100%',
   backgroundColor: '#63bc74', // Fundo verde do cabeçalho
 },
 headerTitle: {
   fontSize: 36,
   fontWeight: 'bold',
   color: 'white',
   paddingLeft: Platform.OS === 'ios' ? 50 : 0,
   paddingTop: Platform.OS === 'ios' ? 50 : 25,
 },
 searchIcon: {
   padding: Platform.OS === 'ios' ? 30 : 30,
   paddingLeft: Platform.OS === 'ios' ? 90 : 30,
   paddingTop: Platform.OS === 'ios' ? 80 : 60,
 },
});