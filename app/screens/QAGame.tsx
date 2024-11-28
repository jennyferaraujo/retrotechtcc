import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { RootStackParamList } from "../../App";

const firebaseConfig = {
  apiKey: "AIzaSyAxgyaaAMItQoaduphVvbgx5bTZtdxeqiw",
  authDomain: "fir-retro-f6ff4.firebaseapp.com",
  projectId: "fir-retro-f6ff4",
  storageBucket: "fir-retro-f6ff4.appspot.com",
  messagingSenderId: "952895017980",
  appId: "1:952895017980:web:7e5c759401713790e6d879",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();
const collections = [
  "Calculadoras",
  "Computadores pessoais e monitores",
  "Dispositivos de armazenamento",
  "Microcontroladores e Processadores",
  "Placas controladoras e Relés",
];

interface MemoryItem {
  id: string;
  collection: string;
  nome: string;
  descricaoCurta: string;
}

type QAGameNavigationProp = NativeStackNavigationProp<RootStackParamList, "QAGame">;

export default function QAGame() {
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState<MemoryItem | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const navigation = useNavigation<QAGameNavigationProp>();

  const fetchQuestion = async () => {
    setLoading(true);

    const fetchAdditionalOptions = async (excludedCollection: string) => {
      const otherCollections = collections.filter(
        (collection) => collection !== excludedCollection
      );
      const additionalItems: MemoryItem[] = [];

      for (const collection of otherCollections) {
        const snapshot = await firestore.collection(collection).get();
        const items = snapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<MemoryItem, "id" | "collection">),
          id: doc.id,
          collection: collection,
        }));
        additionalItems.push(...items);
      }

      return additionalItems;
    };

    const randomCollection =
      collections[Math.floor(Math.random() * collections.length)];
    const snapshot = await firestore.collection(randomCollection).get();
    const items: MemoryItem[] = snapshot.docs.map((doc) => ({
      ...(doc.data() as Omit<MemoryItem, "id" | "collection">),
      id: doc.id,
      collection: randomCollection,
    }));

    if (items.length > 0) {
      const correctItem = items[Math.floor(Math.random() * items.length)];
      setCorrectAnswer(correctItem);

      let otherOptions = items.filter((item) => item.id !== correctItem.id);

      if (otherOptions.length < 3) {
        const additionalOptions = await fetchAdditionalOptions(randomCollection);
        otherOptions = [...otherOptions, ...additionalOptions].filter(
          (item) => item.id !== correctItem.id
        );
      }

      const incorrectOptions = otherOptions
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const allOptions = [
        ...incorrectOptions.map((item) => item.nome),
        correctItem.nome,
      ].sort(() => Math.random() - 0.5);

      setOptions(allOptions);
      setDescription(correctItem.descricaoCurta || "Descrição indisponível");
    } else {
      setOptions([]);
      setDescription("Não foi possível carregar a pergunta. Tente novamente.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleAnswer = (selectedAnswer: string) => {
    if (selectedAnswer === correctAnswer?.nome) {
      navigation.navigate("QAGameSuccess", { peca: correctAnswer, onNextQuestion: fetchQuestion });
    } else {
      navigation.navigate("QAGameFailure", { peca: correctAnswer, onNextQuestion: fetchQuestion });
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={["#654ea3", "#eaafc8"]} style={styles.linearGradient}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando pergunta...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#654ea3", "#eaafc8"]} style={styles.linearGradient}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Games")}>
          <View style={styles.backButtonContent}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </View>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Qual é a peça descrita abaixo?</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    marginVertical: 10,
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 5,
  },
  content: {
    alignItems: "center",
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  optionsContainer: {
    width: "100%",
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: "#9773b1",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    color: "#fff",
  },
});