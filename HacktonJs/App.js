import { useState, useEffect } from 'react';
import 'react-native-gesture-handler';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// or any files within the Snack
// import AssetExample from './components/AssetExample';
import { openDatabase, VagasSalvas } from './components/Connection';
import Load from './components/Load';
import Home from './components/Home';
import LeiaMais from './components/LeiaMais';
import Header from './components/Header'

global.api = 'https://etecsjcampos.com.br/api/api.php';
global.db = null;
global.totalVagasEmprego = 0;
global.totalVagasEstagio = 0;
global.totalVagasAprendiz = 0;
global.vagas = [];
global.vagasFavoritas = null;
global.setVagasFavoritas = null;
global.userToken = '';

const initDB = async () => {
  await openDatabase();
};

const countVagas = async () => {
  let vagas = await fetch(
    'https://etecsjcampos.com.br/api/api.php?inicio=0&quantidade=10000000000',
    {
      method: 'GET',
    }
  );
  global.vagas = await vagas.json();
  // console.log(global.vagas.current)
  total = [0, 0, 0];
  for (let i = 0; i < global.vagas.length; i++) {
    if (global.vagas[i].id_tipo_vaga == 1) {
      total[0] += 1;
    } else if (global.vagas[i].id_tipo_vaga == 2) {
      total[1] += 1;
    } else if (global.vagas[i].id_tipo_vaga == 3) {
      total[2] += 1;
    }
  }
  return total;
};

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Load"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="Load"
        component={Load}
        options={{ title: 'Loading', headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={Home}
      />

      <Stack.Screen
        name="LeiaMais"
        component={LeiaMais}
      />
    </Stack.Navigator>
  );
}

function App() {
  const IniciarApp = async () => {
    await initDB();

    countVagas().then(async (total) => {
      global.totalVagasEmprego = total[0];
      global.totalVagasEstagio = total[1];
      global.totalVagasAprendiz = total[2];
      const salvos = await VagasSalvas();
    });
  };

  useEffect(() => {
    IniciarApp();
  }, []);

  return <NavigationContainer>{HomeStack()}</NavigationContainer>;
}

export default App;

