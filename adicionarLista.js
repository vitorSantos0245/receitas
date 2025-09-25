import { useState } from 'react';

import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'

export default function adicionar ({navegacao}) {

  return (

    <View>
        <text>PAGINA DE ADD</text>
         <View style={styles.container}>
                    <Text style={styles.textos}>LISTA DE PRODUTOS</Text>
                    <Text >ADICIONAR PRODUTO</Text>
                    <TextInput style={styles.inputs}></TextInput>
                    <TouchableOpacity style={styles.botao}
                        onPress={() => navegacao('add')}>
                        <Text>ADICIONAR</Text>
                    </TouchableOpacity>
                </View>
    </View>

  )
}