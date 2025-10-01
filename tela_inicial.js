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
      // **MODO EDIÇÃO:** Substitui a receita existente pelo mesmo ID
      updatedRecipes = recipes.map(recipe =>
        recipe.id === editarReceita.id
          ? { id: editarReceita.id, title, ingredients, preparo: modoPreparo }
          : recipe
      );
    } else {
      // **MODO ADIÇÃO:** Cria uma nova receita
      const newRecipe = {
        id: Date.now().toString(),
        title: title,
        ingredients: ingredients,
        preparo: modoPreparo
      };
      updatedRecipes = [...recipes, newRecipe];
    }

    // 1. Atualiza o estado
    setRecipes(updatedRecipes);

    // 2. Salva no AsyncStorage
    try {
      await AsyncStorage.setItem('@recipes', JSON.stringify(updatedRecipes));
      Alert.alert('Sucesso', editarReceita ? 'Receita editada com sucesso!' : 'Receita adicionada com sucesso!');
    } catch (e) {
      console.error("Falha ao salvar receita.", e);
    }

    // 3. Limpa os campos, limpa o estado de edição e volta para a lista
    setModoPreparo('');
    setTitle('');
    setIngredients('');
    setEditarReceita(null); // **IMPORTANTE: Limpa o estado de edição**
    setView('lista');
  };

  const handleDeleteRecipe = async (id) => { // **Declare a função fora de handleAddRecipe e adicione async**
    // 1. Filtra a lista para criar uma nova lista sem a receita com o ID passado
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);

    // 2. Atualiza o estado com a nova lista
    setRecipes(updatedRecipes);

    // 3. Salva a nova lista no AsyncStorage
    try {
      await AsyncStorage.setItem('@recipes', JSON.stringify(updatedRecipes));
      alert('Receita excluída com sucesso!');
    } catch (e) {
      console.error("Falha ao excluir e salvar receitas.", e);
      alert('Erro ao excluir receita.');
    }
    // Não é necessário setView('lista') aqui, pois a exclusão já acontece na view 'lista'.
    const handleEditRecipe = (item) => {
      setEditarReceita(item); // 1. Define qual receita será editada
      setTitle(item.title);     // 2. Preenche o input do título
      setIngredients(item.ingredients); // 3. Preenche o input dos ingredientes
      setModoPreparo(item.preparo);   // 4. Preenche o input do modo de preparo
      setView('formulario'); // 5. Muda para a tela do formulário
    };
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
                    style={styles.botaoEditar}
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
              placeholder="Ingredientes"  // Mostra o texto Ingredientes na tela
              value={ingredients} // é o valor do input


              onChangeText={setIngredients}  // Pega o que o usuário digitou no input e coloca dentro da variável ingrediente mudando seu estado.

              multiline={true}  // Multiline é para que seja possível pular linhas dentro do input
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
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#e67e22',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  formHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  recipeItem: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recipeIngredients: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  botaoEditar: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: 'green',
    margin: '30px'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 18,
    color: '#95a5a6',
  },

}
);