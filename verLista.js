import { useState } from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'

export default function VerificarLista({ navegacao }) {
   // const [listaProdutos, setListaProdutos] = useState([]);

    return (


        <View style={styles.container}>
            <Text style={styles.textos}>LISTA DE PRODUTOS</Text>
            <Text >ADICIONAR PRODUTO</Text>
            <TextInput style={styles.inputs}></TextInput>
            <TouchableOpacity style={styles.botao}
                onPress={() => navegacao('add')}>
                <Text>ADICIONAR</Text>
            </TouchableOpacity>
        </View>



    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '50',
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
