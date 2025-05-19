import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Alert
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign'; 
import Feather from '@expo/vector-icons/Feather';
import * as Notifications from 'expo-notifications';
import Loading from './Loading';
import Header from './Header';
import { VagasSalvas, DesSalvarVaga, SalvarVaga } from './Connection';

const Home = ({ route, navigation }) => {
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [filtroTipoVaga, setFiltroTipoVaga] = useState(0);
  const [filtroNomeVaga, setFiltroNomeVaga] = useState('');
  const [vagasFavoritas, setVagasFavoritas] = useState({});
  const [receberNotificacao, setReceberNotificacao] = useState(false);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  const [searchVisible, setSearchVisible] = useState(false); // Controla a visibilidade da barra de pesquisa
  const [animationHeight] = useState(new Animated.Value(0)); // Estado para animação

  const toggleSearchBar = () => {
    if (searchVisible) {
      Animated.timing(animationHeight, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => setSearchVisible(false));
    } else {
      setSearchVisible(true);
      Animated.timing(animationHeight, {
        toValue: 200, // Aumente esse valor conforme necessário para os botões extras
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  const CarregarVagasFavoritas = async () => {
    let favs = {};
    global.vagas.forEach((vaga) => {
      favs = { ...favs, [vaga.cdvaga]: 'staro' };
    });
    const salvos = await VagasSalvas();
    salvos.forEach((vaga) => {
      favs = { ...favs, [vaga.cdvaga]: 'star' };
    });
    setVagasFavoritas(favs);
  };

  useEffect(() => {
    CarregarVagasFavoritas();
  }, []);

  let vagasFiltradas = global.vagas.filter((vaga) =>
    vaga.nm_vaga.toLowerCase().includes(filtroNomeVaga.toLowerCase())
  );

  global.totalVagasAprendiz = 0;
  global.totalVagasEstagio = 0;
  global.totalVagasEmprego = 0;

  vagasFiltradas.forEach((vaga) => {
    if (vaga.id_tipo_vaga == 1) {
      global.totalVagasEmprego += 1;
    }
    if (vaga.id_tipo_vaga == 2) {
      global.totalVagasEstagio += 1;
    }
    if (vaga.id_tipo_vaga == 3) {
      global.totalVagasAprendiz += 1;
    }
  });

  if (filtroTipoVaga != 0) {
    vagasFiltradas = vagasFiltradas.filter(
      (vaga) => vaga.id_tipo_vaga == filtroTipoVaga
    );
  }

  if (mostrarFavoritos) {
    vagasFiltradas = vagasFiltradas.filter((vaga) => {
      if (vagasFavoritas[vaga.cdvaga] == 'star') {
        return true
      }
    });
    console.log(vagasFiltradas)
  }

  const toggleVaga = async (vaga) => {
    if (vagasFavoritas[vaga.cdvaga] == 'star') {
      await DesSalvarVaga(vaga.cdvaga);
      setVagasFavoritas({
        ...vagasFavoritas,
        [vaga.cdvaga]: 'staro',
      });
      // console.log('star')
    } else if (vagasFavoritas[vaga.cdvaga] == 'staro') {
      await SalvarVaga(
        vaga.cdvaga,
        vaga.id_tipo_vaga,
        vaga.nm_vaga,
        vaga.ds_vaga,
        vaga.ds_keywords,
        vaga.st_vaga,
        vaga.dt_registro_vaga,
        vaga.url_imagem_vaga,
        vaga.nm_tipo_vaga
      );
      setVagasFavoritas({
        ...vagasFavoritas,
        [vaga.cdvaga]: 'star',
      });
      // console.log('staro')
    }
  };
 
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <Header toggleSearchBar={toggleSearchBar} />
      {searchVisible && (
        <Animated.View
          style={[styles.searchBarContainer, { height: animationHeight }]}>
          <View
            style={{
              height: 200,
              padding: 15,
            }}>
            {/* Botão "Favoritos" acima da barra de pesquisa */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => setMostrarFavoritos(!mostrarFavoritos)}
              >
              <Text style={styles.favoriteButtonText}>
                {mostrarFavoritos ? 'Todas as Vagas' : 'Favoritos'}
              </Text>
            </TouchableOpacity>

            {/* Barra de pesquisa */}
            <View style={styles.searchInputContainer}>
              <TextInput
                placeholder="Informar título..."
                style={styles.searchInput}
                onChangeText={(valor) => {
                  if (paginaAtual > 0) {
                    setPaginaAtual(0);
                  }
                  setFiltroNomeVaga(valor);
                }}
                value={filtroNomeVaga}
              />
            </View>

            {/* Botões de filtro */}
            <View style={styles.filterButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      filtroTipoVaga == 2 ? '#639774' : '#63bc74',
                  },
                ]}
                onPress={() => {
                  if (paginaAtual > 0) {
                    setPaginaAtual(0);
                  }
                  if (filtroTipoVaga == 2) {
                    setFiltroTipoVaga(0);
                    return;
                  }
                  setFiltroTipoVaga(2);
                }}>
                <Text style={styles.filterButtonText}>
                  ({global.totalVagasEstagio}) Estágio
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      filtroTipoVaga == 1 ? '#639774' : '#63bc74',
                  },
                ]}
                onPress={() => {
                  if (paginaAtual > 0) {
                    setPaginaAtual(0);
                  }
                  if (filtroTipoVaga == 1) {
                    setFiltroTipoVaga(0);
                    return;
                  }
                  setFiltroTipoVaga(1);
                }}>
                <Text style={styles.filterButtonText}>
                  ({global.totalVagasEmprego}) Emprego
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      filtroTipoVaga == 3 ? '#639774' : '#63bc74',
                  },
                ]}
                onPress={() => {
                  if (paginaAtual > 0) {
                    setPaginaAtual(0);
                  }
                  if (filtroTipoVaga == 3) {
                    setFiltroTipoVaga(0);
                    return;
                  }
                  setFiltroTipoVaga(3);
                }}>
                <Text style={styles.filterButtonText}>
                  ({global.totalVagasAprendiz}) Aprendiz
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
      <ScrollView
        style={{ padding: 13, backgroundColor: 'white' }}
        ref={(ref) => (this.ScrollView = ref)}
        onContentSizeChange={() => this.ScrollView.scrollTo({ y: 0 })}>
        <View
          style={{
            marginBottom: 15,
          }}>
          <FlatList
            data={vagasFiltradas.slice(paginaAtual * 8, paginaAtual * 8 + 8)}
            renderItem={({ item }) => (
              <View
                style={{
                  borderRadius: 20,
                  marginBottom: 15,
                  paddingRight: 7,
                  backgroundColor: '#e3ffe8',
                }}>
                <Text style={styles.fontTitulo}>{item.nm_vaga}</Text>
                <Text style={styles.fontSubTitulo}>{item.nm_tipo_vaga}</Text>
                <View
                  style={{
                    padding: 10,
                  }}>
                  <Image
                    style={{
                      width: '100%',
                      height: 320,
                      borderRadius: 10,
                    }}
                    source={{
                      uri: `https://etecsjcampos.com.br/vagas/${item.id_tipo_vaga}.png`,
                    }}
                  />
                </View>
                <Text style={styles.fontTexto} numberOfLines={4}>
                  {item.ds_vaga}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 2,
                    paddingRight: 10,
                    paddingBottom: 10,
                    paddingLeft: 10,
                    alignItems: 'flex-end',
                  }}>
                  <Text style={styles.date}>
                    {format(new Date(item.dt_registro_vaga), 'dd/MM/yyyy')}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      columnGap: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        toggleVaga(item);
                      }}>
                      <AntDesign
                        name={vagasFavoritas[item.cdvaga]}
                        size={30}
                        color="#FFD700"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        navigation.navigate('LeiaMais', {
                          previous: 'Home',
                          cdvaga: item.cdvaga,
                          id_tipo_vaga: item.id_tipo_vaga,
                          nm_vaga: item.nm_vaga,
                          ds_vaga: item.ds_vaga,
                          ds_keywords: item.ds_keywords,
                          st_vaga: item.st_vaga,
                          dt_registro_vaga: item.dt_registro_vaga,
                          url_imagem_vaga: item.url_imagem_vaga,
                          nm_tipo_vaga: item.nm_tipo_vaga,
                          vagasFavoritas: vagasFavoritas,
                          setVagasFavoritas: setVagasFavoritas,
                          fav: vagasFavoritas[item.cdvaga],
                        });
                      }}>
                      <Text style={styles.textButton}>Leia Mais</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
      <View
        style={{
          height: 55,
          width: '100%',
          backgroundColor: '#63bc74',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={async () => {
            if (!receberNotificacao) {
              const requestNotificationPermissions = async () => {
                const { status } = await Notifications.getPermissionsAsync();
                if (status !== 'granted') {
                  const { status: newStatus } =
                    await Notifications.requestPermissionsAsync();
                  if (newStatus !== 'granted') {
                    alert('You will not receive notifications!');
                    return;
                  }
                }
              };

              const registerForPushNotifications = async () => {
                await requestNotificationPermissions();
                const token = (await Notifications.getExpoPushTokenAsync())
                  .data;
                console.log(token);
                global.userToken = token; // Send this token to your server for sending notifications
              };

              await registerForPushNotifications();

              Notifications.setNotificationHandler({
                handleNotification: async () => ({
                  shouldShowAlert: true,
                  shouldPlaySound: true,
                  shouldSetBadge: true,
                }),
              });
            }
            Alert.alert(global.userToken)
            setReceberNotificacao(!receberNotificacao);
          }}>
          <Feather
            name={receberNotificacao ? 'bell' : 'bell-off'}
            size={24}
            color="white"
          />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            columnGap: 12,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setPaginaAtual(paginaAtual - 1);
            }}
            disabled={paginaAtual == 0}>
            <AntDesign
              name="banckward"
              size={20}
              color={paginaAtual == 0 ? '#a2a2a2' : 'white'}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 26, fontWeight: 'bold', color: 'white' }}>
            {paginaAtual + 1}/{Math.ceil(vagasFiltradas.length / 8)}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setPaginaAtual(paginaAtual + 1);
            }}
            disabled={
              vagasFiltradas.slice(
                (paginaAtual + 1) * 8,
                (paginaAtual + 1) * 8 + 8
              ).length == 0
            }>
            <AntDesign
              name="forward"
              size={20}
              color={
                vagasFiltradas.slice(
                  (paginaAtual + 1) * 8,
                  (paginaAtual + 1) * 8 + 8
                ).length == 0
                  ? '#a2a2a2'
                  : 'white'
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Home;
const styles = StyleSheet.create({
  button: {
    padding: 7,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#2c6233',
  },

  fontTitulo: {
    marginLeft: 20,
    marginTop: 10,
    margin: 1,
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'century gothic',
    color: '#2c6233',
    flexDirection: 'column',
  },

  fontSubTitulo: {
    fontSize: 16,
    fontFamily: 'century gothic',
    textAlign: 'justify',
    color: 'black',
    marginLeft: 20,
    flexDirection: 'column',
  },

  fontTexto: {
    fontSize: 16,
    fontFamily: 'century gothic',
    textAlign: 'justify',
    color: 'black',
    padding: 10,
    flexDirection: 'column',
  },
  textButton: {
    padding: 2,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'century gothic',
    color: '#2c6233',
    flexDirection: 'column',
  },
  date: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'century gothic',
    color: '#2c6233',
  },
  searchBarContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginRight: 10,
  },
  favoriteButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'stretch',
    marginBottom: 10, // Espaço entre o botão favoritos e a barra de pesquisa
  },
  favoriteButtonText: {
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  filterButton: {
    backgroundColor: '#63bc74',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  filterButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
