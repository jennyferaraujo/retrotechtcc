import React, { useEffect, useState } from 'react';
import { Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { StackNavigationProp } from '@react-navigation/stack';

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
  Item: { itemId: string, collection: string };
  LearnMore: { itemId: string, collection: string };
};

type LearnMoreScreenRouteProp = RouteProp<RootStackParamList, 'LearnMore'>;
type LearnMoreScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LearnMore'>;

const LearnMore = () => {
  const route = useRoute<LearnMoreScreenRouteProp>();
  const { itemId, collection } = route.params;
  const navigation = useNavigation<LearnMoreScreenNavigationProp>();
  const [itemMore, setItemMore] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collection) {
      console.error("Erro: Coleção não foi especificada.");
      setLoading(false);
      return;
    }

    const fetchItemData = async () => {
      try {
        console.log(`Buscando item ${itemId} na coleção ${collection}`);

        const doc = await firestore.collection(collection).doc(itemId).get();

        if (doc.exists) {
          const data = doc.data();
          console.log("Dados do Firestore:", data);

          if (data && data.descricaoLonga) {
            setItemMore(data.descricaoLonga);
          } else {
            console.error("Campo não encontrado.");
            setItemMore(null);
          }
        } else {
          console.error(`Documento com ID ${itemId} não encontrado na coleção ${collection}.`);
          setItemMore(null);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do Firestore:', error);
        setItemMore(null);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [itemId, collection]);

  if (loading) {
    return (
      <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.linearGradient}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!itemMore) {
    return (
      <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.linearGradient}>
        <SafeAreaView style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Dados não disponíveis.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.linearGradient}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backButtonContent}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </View>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.descriptionText}>{itemMore}</Text>
        </ScrollView>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  backButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 5,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'justify',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
});

export default LearnMore;