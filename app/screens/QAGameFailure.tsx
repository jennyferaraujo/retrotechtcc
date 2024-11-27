import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type QAGameFailureRouteProp = RouteProp<RootStackParamList, "QAGameFailure">;
type QAGameFailureNavigationProp = NativeStackNavigationProp<RootStackParamList, "QAGameFailure">;

export default function QAGameFailure({ route }: { route: QAGameFailureRouteProp }) {
  const navigation = useNavigation<QAGameFailureNavigationProp>();
  const { peca, onNextQuestion } = route.params;

  const handleRetry = () => {
    onNextQuestion(); 
  };

  return (
    <LinearGradient colors={["#654ea3", "#eaafc8"]} style={styles.linearGradient}>
      <View style={styles.container}>
        {/* Botão de voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Games")}
        >
          <View style={styles.backButtonContent}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Que pena!</Text>
        <Text style={styles.message}>Você errou a peça.</Text>
        <Text style={styles.message}>A peça correta era: {peca.nome}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Jogar novamente</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});