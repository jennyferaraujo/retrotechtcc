import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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

type TimelineScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Item'>;

interface TimelineEvent {
  nome: string;
  ano: string;
  id: string;
  collection: string; 
}

const ITEM_HEIGHT = 80;

const TimelineScreen = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<TimelineScreenNavigationProp>();

  const fetchCollectionData = async (collectionName: string) => {
    const snapshot = await firestore.collection(collectionName).orderBy('ano', 'asc').get();
    const collectionData: TimelineEvent[] = [];

    snapshot.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
      const data = doc.data();
      if (data && data.nome && data.ano) { 
        collectionData.push({
          nome: data.nome || 'Nome não disponível', 
          ano: data.ano.toDate().getFullYear().toString(),
          id: doc.id,
          collection: collectionName, 
        });
      } else {
      
        collectionData.push({
          nome: 'Dados não disponíveis',
          ano: 'Ano desconhecido',
          id: doc.id,
          collection: collectionName,
        });
      }
    });

    return collectionData;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const calculadoras = await fetchCollectionData('Calculadoras');
        const comp = await fetchCollectionData('Computadores pessoais e monitores');
        const armazenamento = await fetchCollectionData('Dispositivos de armazenamento');
        const micro = await fetchCollectionData('Microcontroladores e Processadores');
        const placas = await fetchCollectionData('Placas controladoras e Relés');

        const allEvents = [...calculadoras, ...comp, ...armazenamento, ...micro, ...placas];
        allEvents.sort((a, b) => parseInt(a.ano) - parseInt(b.ano));

        setEvents(allEvents);
      } catch (error) {
        console.error('Erro ao buscar dados do Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    const index = events.findIndex(event =>
      event.nome.toLowerCase().includes(text.toLowerCase())
    );
    if (index !== -1 && flatListRef.current) {
      const offset = index * ITEM_HEIGHT;
      flatListRef.current.scrollToOffset({ animated: true, offset });
    }
  };

  const handleItemPress = (itemId: string, collection: string) => {
    navigation.navigate('Item', { itemId, collection });
  };

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
        
        <TextInput
          style={styles.searchBar}
          placeholder="Pesquisar"
          placeholderTextColor="#fff"
          value={searchTerm}
          onChangeText={handleSearch}
        />
        <View style={styles.timelineContainer}>
          <View style={styles.verticalLine} />
          <FlatList
            ref={flatListRef}
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => handleItemPress(item.id, item.collection)} style={[styles.eventContainer, { height: ITEM_HEIGHT }]}>
                <View style={styles.textContainerLeft}>
                  {index % 2 === 0 && (
                    <>
                      <Text style={styles.titleText}>
                        {item.nome} - {item.ano}
                      </Text>
                      <View style={styles.horizontalLineLeft} />
                    </>
                  )}
                </View>
                <View style={styles.iconContainer}>
                  <View style={styles.icon} />
                </View>
                <View style={styles.textContainerRight}>
                  {index % 2 !== 0 && (
                    <>
                      <Text style={styles.titleText}>
                        {item.nome} - {item.ano}
                      </Text>
                      <View style={styles.horizontalLineRight} />
                    </>
                  )}
                </View>
              </TouchableOpacity>
            )}
            getItemLayout={(data, index) => (
              { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
            )}
          />
        </View>
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
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 10,
  },
  searchBar: {
    height: 40,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#fff',
    marginBottom: 20,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineContainer: {
    flex: 1,
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: '#ffffff',
    transform: [{ translateX: -1 }],
    zIndex: 0,
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  textContainerLeft: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  textContainerRight: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    zIndex: 1,
    marginTop: 29,
  },
  titleText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  horizontalLineLeft: {
    height: 2,
    backgroundColor: '#ffffff',
    width: '110%',
    marginTop: 5,
    transform: [{ translateX: 20 }],
  },
  horizontalLineRight: {
    height: 2,
    backgroundColor: '#ffffff',
    width: '110%',
    marginTop: 5,
    transform: [{ translateX: -20 }],
  },
});

export default TimelineScreen;