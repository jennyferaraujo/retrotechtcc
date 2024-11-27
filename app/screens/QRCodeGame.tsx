import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Text,
  SafeAreaView,
  ScrollView,
  Button,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

type QRCodeGameNavigationProp = NativeStackNavigationProp<RootStackParamList, "QRCodeGame">;

export default function QRCodeGame() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [pecaAlvo, setPecaAlvo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const qrCodeLock = useRef(false);
  const navigation = useNavigation<QRCodeGameNavigationProp>();

  const randomizePeca = async () => {
    setLoading(true);
    const randomCollection =
      collections[Math.floor(Math.random() * collections.length)];
    const snapshot = await firestore.collection(randomCollection).get();
    const items = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      collection: randomCollection,
    }));
    if (items.length > 0) {
      setPecaAlvo(items[Math.floor(Math.random() * items.length)]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await requestPermission();
      setHasPermission(status === "granted");
    };

    requestPermissions();
    randomizePeca();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      randomizePeca();
    }, [])
  );

  const handleOpenCamera = async () => {
    if (hasPermission === null) {
      return alert("Solicitando permissão da câmera...");
    }

    if (hasPermission === false) {
      return alert("Permissão da câmera negada.");
    }

    setModalIsVisible(true);
    qrCodeLock.current = false;
  };

  const handleQRCodeRead = async (data: string) => {
    if (qrCodeLock.current) return;
    qrCodeLock.current = true;

    setIsScanning(true);
    setModalIsVisible(false);

    try {
      if (data === pecaAlvo?.id) {
        navigation.navigate("QRCodeGameSuccess", { peca: pecaAlvo });
      } else {
        navigation.navigate("QRCodeGameFailure", { peca: pecaAlvo });
      }
    } catch (error) {
      alert("Erro ao processar o QR Code.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleImageLoadEnd = () => {
    setImageLoading(false);
  };

  if (loading) {
    return (
      <LinearGradient colors={["#654ea3", "#eaafc8"]} style={styles.linearGradient}>
        <SafeAreaView style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#654ea3", "#eaafc8"]} style={styles.linearGradient}>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View style={styles.backButtonContent}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </View>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.headerText}>
            Identifique no acervo a peça mostrada abaixo e, ao encontrá-la, escaneie o QR Code para confirmar.
          </Text>
          {pecaAlvo ? (
            <>
              {imageLoading && (
                <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />
              )}
              <Image
                source={{ uri: pecaAlvo.imagem }}
                style={styles.image}
                onLoadEnd={handleImageLoadEnd}
              />
            </>
          ) : (
            <Text style={styles.noImageText}>Imagem não disponível</Text>
          )}
          <TouchableOpacity style={styles.scanButton} onPress={handleOpenCamera}>
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.scanButtonText}>Clique aqui para escanear a peça</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={modalIsVisible} animationType="slide">
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={({ data }) => {
              if (data) {
                handleQRCodeRead(data);
              }
            }}
          />
          {isScanning && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Processando QR Code...</Text>
            </View>
          )}
          <View style={styles.footer}>
            <Button title="Cancelar" onPress={() => setModalIsVisible(false)} />
          </View>
        </Modal>
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
    paddingVertical: 10,
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
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
    width: "100%",
    marginTop: 10,
  },
  image: {
    width: 350,
    height: 250,
    resizeMode: "contain",
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9773b1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  scanButtonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
  },
  loadingIndicator: {
    marginBottom: 20,
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignItems: "center",
  },
});