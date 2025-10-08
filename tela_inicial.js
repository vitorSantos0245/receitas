import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Modal, requireNativeComponent } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TelaInicial() {

  const [view, setView] = useState('lista');
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [modoPreparo, setModoPreparo] = useState('');
  const [editarReceita, setEditarReceita] = useState(null);

  useEffect(() => {
    const loadRecipes = async () => {

      try {
        const storedRecipes = await AsyncStorage.getItem('@recipes');
        if (storedRecipes !== null) {
          setRecipes(JSON.parse(storedRecipes));
        }
      } catch (e) {
        console.error("Falha ao carregar receitas.", e);
      }
    };
    loadRecipes();
  }, []);

  const handleSaveRecipe = async () => {
    if (!title) {
      Alert.alert("Atenção", "O título da receita não pode estar vazio.");
      return;
    }

    let updatedRecipes = [];

    if (editarReceita) {
      updatedRecipes = recipes.map(recipe =>
        recipe.id === editarReceita.id
          ? { id: editarReceita.id, title, ingredients, preparo: modoPreparo }
          : recipe
      );
    } else {
      const newRecipe = {
        id: Date.now().toString(),
        title: title,
        ingredients: ingredients,
        preparo: modoPreparo
      };
      updatedRecipes = [...recipes, newRecipe];
    }
    setRecipes(updatedRecipes);

    try {
      await AsyncStorage.setItem('@recipes', JSON.stringify(updatedRecipes));
      Alert.alert('Sucesso', editarReceita ? 'Receita editada com sucesso!' : 'Receita adicionada com sucesso!');
    } catch (e) {
      console.error("Falha ao salvar receita.", e);
    }
    setModoPreparo('');
    setTitle('');
    setIngredients('');
    setEditarReceita(null);
    setView('lista');
  };

  const handleDeleteRecipe = async (id) => {

    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);

    setRecipes(updatedRecipes);

    try {
      await AsyncStorage.setItem('@recipes', JSON.stringify(updatedRecipes));
      alert('Receita excluída com sucesso!');
    } catch (e) {
      console.error("Falha ao excluir e salvar receitas.", e);
      alert('Erro ao excluir receita.');
    }
  };
  const handleEditRecipe = (item) => {
    setEditarReceita(item);
    setTitle(item.title);
    setIngredients(item.ingredients);
    setModoPreparo(item.preparo);
    setView('formulario');
  };
  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContainer}>


        <Text style={styles.header}>Meu Livro de Receitas</Text>

        {view === 'lista' ? (
          <View>

            <TouchableOpacity style={styles.addButton} onPress={() => + setView('formulario')}>
              <Text style={styles.buttonText}>Adicionar Nova Receita</Text>
            </TouchableOpacity>


            {recipes.length === 0 ? (
              <Text style={styles.emptyText}>Nenhuma receita cadastrada.</Text>
            ) : (
              recipes.map((item) => (
                <View key={item.id} style={styles.recipeItem}>

                  <View style={styles.recipeTextContainer}>
                    <Text style={styles.recipeTitle}>{item.title}</Text>
                    <Text style={styles.recipeIngredients}>{"\n"} {item.ingredients}</Text>
                    <Text style={styles.recipeIngredients}> {"\n"} MODO DE PREPARO: {"\n"} {item.preparo}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditRecipe(item)}>
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteRecipe(item.id)}>
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        ) : (

          <View style={styles.formContainer}>

            <Text style={styles.formHeader}>Adicionar Receita</Text>

            <TextInput
              style={styles.input}
              placeholder="Título da Receita"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ingredientes"
              value={ingredients}


              onChangeText={setIngredients}

              multiline={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Modo de preparo"
              value={modoPreparo}
              onChangeText={setModoPreparo}
            />

            <View style={styles.formActions}>

              <TouchableOpacity style={[styles.formButton, styles.cancelButton]} onPress={() => setView('lista')}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.formButton, styles.saveButton]} onPress={handleSaveRecipe}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7F3',
  },
  scrollContainer: {
    padding: 24,
  },
  header: {
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'left',
    marginBottom: 20,
    color: '#333333',
    borderBottomWidth: 3,
    borderBottomColor: '#B85F49',
    paddingBottom: 8,
    marginTop: 10,
  },
  formHeader: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 25,
    textAlign: 'center',
    color: '#B85F49',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#F9F7F3',
    borderColor: '#E0DEDC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    color: '#333333',
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  formButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#588B8B',
  },
  addButton: {
    backgroundColor: '#B85F49',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#B85F49',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  recipeItem: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: '#B85F49',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  recipeTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 5,
  },
  recipeIngredients: {
    fontSize: 15,
    color: '#666666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  actionButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    width: 50,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#588B8B',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: 50,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 18,
    color: '#B85F49',
    fontStyle: 'italic',
  },
});