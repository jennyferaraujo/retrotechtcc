import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Footer from "./Footer";

type RootStackParamList = {
  Games: undefined;
  QRCodeScanner: undefined;
  QA: undefined;
};

const GamesScreen = () => {
  const handleNavigateToQrCode = () => {
    console.log("Navegar para Caça às Peças");
    
  };

  const handleNavigateToQA = () => {
    console.log("Navegar para Q&A");
    
  };

  return (
    <LinearGradient colors={["#654ea3", "#eaafc8"]} style={styles.linearGradient}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Bem-vindo ao Retro Quizz!</Text>

        <TouchableOpacity style={styles.card} onPress={handleNavigateToQrCode}>
          <Ionicons name="qr-code-outline" size={40} color="#fff" style={styles.icon} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>1. Caça às peças</Text>
            <Text style={styles.cardDescription}>
              A partir do nome da peça em tela localize o QRCode da peça em questão no acervo
              tecnológico.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleNavigateToQA}>
          <Ionicons name="help-circle-outline" size={40} color="#fff" style={styles.icon} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>2. Q&A</Text>
            <Text style={styles.cardDescription}>
              Responda perguntas objetivas sobre as peças que você conheceu no acervo
              tecnológico.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Footer />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20, 
    },
    container: {
      flex: 1,
      justifyContent: "flex-start", 
      alignItems: "center", 
      marginTop: 20, 
    },
    headerText: {
      fontSize: 24,
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
    },
    card: {
      flexDirection: "row",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: 20,
      borderRadius: 15,
      marginBottom: 20,
      alignItems: "center",
    },
    cardContent: {
      flex: 1,
      marginLeft: 20,
    },
    cardTitle: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
      marginBottom: 5,
    },
    cardDescription: {
      fontSize: 14,
      color: "#fff",
    },
    icon: {
      marginRight: 10,
    },
  });  

export default GamesScreen;