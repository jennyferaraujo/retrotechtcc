import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Footer from './Footer';

const firebaseConfig = {
  apiKey: 'AIzaSyAxgyaaAMItQoaduphVvbgx5bTZtdxeqiw',
  authDomain: 'fir-retro-f6ff4.firebaseapp.com',
  projectId: 'fir-retro-f6ff4',
  storageBucket: 'fir-retro-f6ff4.appspot.com',
  messagingSenderId: '952895017980',
  appId: '1:952895017980:web:7e5c759401713790e6d879',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

type RootStackParamList = {
  Categories: undefined;
  Item: { itemId: string; collection: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Categories'>;

interface Category {
  title: string;
  collectionName: string;
  data: { id: string; nome: string }[];
}

const CategoriesScreen = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const navigation = useNavigation<NavigationProp>();

  const fetchCategoryData = async (collectionName: string, title: string): Promise<Category> => {
    const snapshot = await firestore.collection(collectionName).get();
    return {
      title,
      collectionName,
      data: snapshot.docs.map((doc) => ({ id: doc.id, nome: doc.data().nome })),
    };
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const categories = await Promise.all([
        fetchCategoryData('Calculadoras', 'Calculadoras'),
        fetchCategoryData('Dispositivos de armazenamento', 'Dispositivos de armazenamento'),
        fetchCategoryData('Microcontroladores e Processadores', 'Microcontroladores e Processadores'),
        fetchCategoryData('Computadores pessoais e monitores', 'Computadores pessoais e monitores'),
        fetchCategoryData('Placas controladoras e Relés', 'Placas controladoras e Relés'),
      ]);
      setData(categories);
      setExpanded(
        categories.reduce((acc, category) => ({ ...acc, [category.title]: false }), {})
      );
    } catch (error) {
      console.error('Erro ao buscar dados do Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleItemPress = (itemId: string, collection: string) => {
    navigation.navigate('Item', { itemId, collection });
  };

  if (loading) {
    return (
      <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.linearGradient}>
        <SafeAreaView style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.linearGradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.spacer} />
        <FlatList
          data={data}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleExpand(item.title)}
              >
                <Text style={styles.categoryTitle}>{item.title}</Text>
                <Ionicons
                  name={expanded[item.title] ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
              {expanded[item.title] &&
                (item.data.length > 0 ? (
                  item.data.map((subItem) => (
                    <TouchableOpacity
                      key={subItem.id}
                      style={styles.itemContainer}
                      onPress={() => handleItemPress(subItem.id, item.collectionName)}
                    >
                      <Text style={styles.itemText}>{subItem.nome}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noResultsText}>Nenhum resultado encontrado</Text>
                ))}
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
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    height: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff33',
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemContainer: {
    backgroundColor: '#ffffff33',
    borderRadius: 8,
    padding: 10,
    marginVertical: 2,
    marginLeft: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
  noResultsText: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 10,
    marginTop: 5,
  },
});

export default CategoriesScreen;