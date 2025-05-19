import { StyleSheet, Text, TouchableOpacity, Image, View, ScrollView } from 'react-native';
import { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { format } from 'date-fns';
import { DesSalvarVaga, SalvarVaga } from './Connection';
import Header from './HeaderMais'

const LeiaMais = ({ route }) => {
  const [vagasFavorita, setVagasFavorita] = useState(route.params.fav);

  const toggleVaga = async (vaga) => {
    if (vagasFavorita == 'star') {
      await DesSalvarVaga(vaga.cdvaga);
      vaga.setVagasFavoritas({
        ...vaga.vagasFavoritas,
        [vaga.cdvaga]: 'staro',
      });
      setVagasFavorita('staro')
      // console.log('star')
    } else if (vagasFavorita == 'staro') {
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
      vaga.setVagasFavoritas({
        ...vaga.vagasFavoritas,
        [vaga.cdvaga]: 'star',
      });
      setVagasFavorita('star')
      // console.log('staro')
    }
  };

  return (
    <View style={{
        height:'100%',
        backgroundColor: '#e3ffe8',
      }}>
    <Header/>
    <ScrollView
      style={{
        marginBottom:20,
        padding: 15,
        backgroundColor: '#e3ffe8',
      }}>
      <Text style={styles.fontTitulo}>{route.params.nm_vaga}</Text>
      <Text style={styles.fontSubTitulo}>{route.params.nm_tipo_vaga}</Text>
      <View 
        style={{
          padding: 10,
        }}>
        <Image
          style={{
            width: '100%',
            height: 400,
            borderRadius: 10,
          }}
          source={{
            uri: `https://etecsjcampos.com.br/vagas/${route.params.id_tipo_vaga}.png`,
          }}
        />
      </View>
      <Text style={styles.fontTexto}>
        {route.params.ds_vaga}
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
          marginBottom:30,
        }}>
        <Text style={styles.date}>
          {format(new Date(route.params.dt_registro_vaga), 'dd/MM/yyyy')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            columnGap: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              toggleVaga(route.params);
            }}>
            <AntDesign
              name={vagasFavorita}
              size={30}
              color="#FFD700"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </View>
  );
};

export default LeiaMais;
const styles = StyleSheet.create({
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
  date: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'century gothic',
    color: '#2c6233',
  },
});
