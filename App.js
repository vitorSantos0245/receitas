import { useState } from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';


import AsyncStorage from '@react-native-async-storage/async-storage';

import ADICIONAR from './AdicionarLista';
import VerificarLista from './verLista';

export default function App() {

  let [pagina, setPagina] = useState('ver');

  const navegacao = (rota) => {
    setPagina(rota);
  };

  const paginas = () => {
    switch (pagina) {
      case 'add':
        return <ADICIONAR navegacao={navegacao} />;
        case 'ver':
          return <VerificarLista navegacao={navegacao} />
      default:
        return <VerificarLista navegacao={navegacao} />;
    }
  }

  return (
    <View style={styles.container}>
    <Text>NÃO PODE ESTAR NESSA PÁGINA</Text>
    {paginas}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '40',
    padding: '40'
  },
  inputs: {
    backgroundColor: 'lightblue'
  },
  botao: {
    backgroundColor: 'yellow'
  },
  textos: {
    padding: '50px',
    margin: '30px',
  }
});
