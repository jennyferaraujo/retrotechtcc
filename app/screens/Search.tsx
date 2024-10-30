import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TextInput, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Footer from './Footer';

const firebaseConfig = {
  apiKey: "AIzaSyAxgyaaAMItQoaduphVvbgx5bTZtdxeqiw",
  authDomain: "fir-retro-f6ff4.firebaseapp.com",
  projectId: "fir-retro-f6ff4",
  storageBucket: "fir-retro-f6ff4.appspot.com",
  messagingSenderId: "952895017980",
  appId: "1:952895017980:web:7e5c759401713790e6d879"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

type RootStackParamList = {
  Search: undefined;
  Item: { itemId: string; collection: string };
};

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Search'>;

interface Props {
  navigation: SearchScreenNavigationProp;
}

interface Category {
  title: string;
  collectionName: string;
  data: { id: string; nome: string }[];
}

const SearchScreen = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const navigation = useNavigation<SearchScreenNavigationProp>();

  const fetchCollectionData = async (collectionName: string, title: string) => {
    const snapshot = await firestore.collection(collectionName).get();
    return {
      title,
      collectionName,
      data: snapshot.docs.map((doc) => ({ id: doc.id, nome: doc.data().nome })),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await Promise.all([
          fetchCollectionData('Calculadoras', 'Calculadoras'),
          fetchCollectionData('Dispositivos de armazenamento', 'Dispositivos de armazenamento'),
          fetchCollectionData('Microcontroladores e Processadores', 'Microcontroladores e Processadores'),
          fetchCollectionData('Computadores pessoais e monitores', 'Computadores pessoais e monitores'),
          fetchCollectionData('Placas controladoras e Relés', 'Placas controladoras e Relés'),
        ]);

        setData(categories);
        setExpanded(categories.reduce<{ [key: string]: boolean }>((acc, category) => {
          acc[category.title] = false;
          return acc;
        }, {}));
      } catch (error) {
        console.error('Erro ao buscar dados do Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleItemPress = (itemId: string, collection: string) => {
    navigation.navigate('Item', { itemId, collection });
  };

  const filteredData = data.map((category) => ({
    ...category,
    data: category.data.filter((item) =>
      item.nome && item.nome.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  if (loading) {
    return (
      <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.linearGradient}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.linearGradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchBarInput}
              placeholder="Pesquisar"
              placeholderTextColor="#fff"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search" size={20} color="white" />
          </View>
        </View>
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => item.title + index}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 20 }}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleExpand(item.title)}
              >
                <Text style={styles.titleText}>{item.title}</Text>
                <Ionicons
                  name={expanded[item.title] ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
              {expanded[item.title] && (
                item.data.length > 0 ? (
                  item.data.map((subItem, subIndex) => (
                    <TouchableOpacity
                      key={subIndex}
                      style={styles.resultItem}
                      onPress={() => handleItemPress(subItem.id, item.collectionName)}
                    >
                      <Text style={styles.resultText}>{subItem.nome}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noResultText}>Nenhum resultado encontrado</Text>
                )
              )}
            </View>
          )}
        />
        <Footer />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchBarContainer: {
    padding: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff33',
    borderRadius: 10,
    padding: 8,
  },
  searchBarInput: {
    flex: 1,
    marginLeft: 8,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff33',
    marginHorizontal: 10,
    borderRadius: 8,
    marginVertical: 2,
  },
  resultText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
  },
  noResultText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'gray',
  },
});

export default SearchScreen;