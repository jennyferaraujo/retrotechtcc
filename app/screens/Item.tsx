import React, { useEffect, useState } from 'react';
import { Text, Image, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native';
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

type ItemScreenRouteProp = RouteProp<RootStackParamList, 'Item'>;
type ItemScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Item'>;

interface MemoryItem {
  nome: string;
  ano?: firebase.firestore.Timestamp;
  descricao: string;
  imagem?: string;
}

const ItemScreen = () => {
  const route = useRoute<ItemScreenRouteProp>();
  const { itemId, collection } = route.params;
  const navigation = useNavigation<ItemScreenNavigationProp>();
  const [itemData, setItemData] = useState<MemoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

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

          if (data) {
            setItemData({
              nome: data.nome || 'Nome não disponível',
              ano: data.ano || null,
              descricao: data.descricao || data.descricao || 'Descrição não disponível',
              imagem: data.imagem || data.imagem || '',
            });
          } else {
            console.error("Documento encontrado, mas sem dados.");
          }
        } else {
          console.error(`Documento com ID ${itemId} não encontrado na coleção ${collection}.`);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [itemId, collection]);

  const formatYear = (timestamp: firebase.firestore.Timestamp | undefined) => {
    if (!timestamp) return 'Ano desconhecido';
    return timestamp.toDate().getFullYear().toString();
  };

  const handleImageLoadEnd = () => {
    setImageLoading(false);
  };

  const handleLearnMore = (itemId: string, collection: string) => {
    navigation.navigate('LearnMore', { itemId, collection });
  };

  if (loading) {
    return (
      <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.linearGradient}>
        <SafeAreaView style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!itemData) {
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
          <Text style={styles.titleText}>{itemData.nome}</Text>
          {itemData.imagem && itemData.imagem !== '' ? (
            <>
              {imageLoading && (
                <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />
              )}
              <Image
                source={{ uri: itemData.imagem }}
                style={styles.image}
                onLoadEnd={handleImageLoadEnd}
              />
            </>
          ) : (
            <Text style={styles.noImageText}>Imagem não disponível</Text>
          )}
          <Text style={styles.dateText}>Ano: {formatYear(itemData.ano)}</Text>
          <Text style={styles.descriptionText}>{itemData.descricao}</Text>

          <TouchableOpacity
            style={styles.learnMoreButton}
            onPress={() => handleLearnMore(itemId, collection)}
          >
            <Text style={styles.learnMoreButtonText}>Saiba Mais</Text>
          </TouchableOpacity>
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
    padding: 20,
    alignItems: 'center',
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
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  image: {
    width: 350,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#fff',
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
  },
  loadingIndicator: {
    marginBottom: 20,
  },
  learnMoreButton: {
    marginTop: 20,
    paddingVertical: 7,
    paddingHorizontal: 32,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
   
  },
  learnMoreButtonText: {
    color: '#654ea3',
    fontSize: 16,
    fontWeight: 'bold',
  },

});

export default ItemScreen;
