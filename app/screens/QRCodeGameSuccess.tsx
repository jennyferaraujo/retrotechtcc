import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type QRCodeGameSuccessRouteProp = RouteProp<RootStackParamList, "QRCodeGameSuccess">;
type QRCodeGameSuccessNavigationProp = NativeStackNavigationProp<RootStackParamList, "QRCodeGameSuccess">;

export default function QRCodeGameSuccess({ route }: { route: QRCodeGameSuccessRouteProp }) {
  const navigation = useNavigation<QRCodeGameSuccessNavigationProp>();
  const lottieRef = useRef<LottieView>(null); 

  const handleRetry = () => {
    navigation.replace("QRCodeGame"); 
    lottieRef.current?.reset(); 
    lottieRef.current?.play(); 
  };

  return (
    <LinearGradient colors={["#654ea3", "#eaafc8"]} style={styles.linearGradient}>
      <LottieView
        ref={lottieRef}
        source={require("../../assets/confetti.json")} 
        autoPlay
        loop={false}
        style={styles.lottie}
      />

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Games")}
        >
          <View style={styles.backButtonContent}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.title}>Parabéns!</Text>
        <Text style={styles.message}>Você encontrou a peça certa!</Text>

        <TouchableOpacity style={styles.button} onPress={handleRetry}>
          <Text style={styles.buttonText}>Jogar Novamente</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  lottie: {
    position: "absolute",
    width: 400,
    height: 400,
    top: 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#9773b1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});