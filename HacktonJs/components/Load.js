import { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
  Animated,
  SafeAreaView,
  ImageBackground 
} from 'react-native';

const Load = ({ route, navigation }) => {
  const interval = 2000;
  const [isLoaded, setIsLoaded] = useState(false); // Para monitorar o carregamento

  let nextPage = 'Home';
  if (typeof route.params !== 'undefined') {
    nextPage = route.params.nextPage;
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
    }).start();
  };

  useEffect(() => {
    // Verifica a cada intervalo se os dados estão carregados
    const timer = setInterval(() => {
      if (global.vagas.length > 0) {
        setIsLoaded(true); // Indica que está carregado
        clearInterval(timer); // Limpa o intervalo
        navigation.replace(nextPage); // Navega para a próxima página
      }
    }, interval);

    // Limpar o temporizador se o componente for desmontado
    return () => clearInterval(timer);
  }, [navigation, nextPage, interval]);

  return (
    <ImageBackground
      style={{
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
        backgroundColor: '#63bc74',
        padding: 60,
      }}
      source={require('../assets/bg-etec_jobs.png')}
    >
      <SafeAreaView
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
          flex: 1,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            gap: 90,
            padding: 0,
          }}
        >
          <Image style={styles.logo} source={require('../assets/Etec-Logos.png')} />
          {fadeIn()}
          <Image style={styles.logo} source={require('../assets/CPS-Logo.png')} />
          {fadeIn()}
        </View>
        <Animated.View
          style={{
            opacity: fadeAnim,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 80,
          }}
        >
          <Image
            style={{
              height: 360,
              width: 440,
              marginLeft: -20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            source={require('../assets/Etec_Jobs-Logo.png')}
          />
          <View>
            <ActivityIndicator size="large" color="#f2cb05" />
          </View>
        </Animated.View>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Professor / Orientador</Text>
          <Text style={{ color: 'white', fontSize: 18 }}>Claudio Ferrini</Text>
          <Text style={{ color: 'white', fontSize: 18 }}>Rogério B. de Andrade</Text>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Equipe de Desenvolvimento</Text>
          <Text style={{ color: 'white', fontSize: 18 }}>Leonardo da Silva Irineu</Text>
          <Text style={{ color: 'white', fontSize: 18 }}>Lucas Leme</Text>
          <Text style={{ color: 'white', fontSize: 18 }}>Lucas Inácio</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Load;

const styles = StyleSheet.create({
  logo: {
    height: 90,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
