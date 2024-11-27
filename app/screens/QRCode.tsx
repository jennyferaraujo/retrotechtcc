import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Button, View, Modal, Alert, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import Footer from './Footer';
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

type QRCodeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Item">;

export default function QRCodeScanner() {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [alertShown, setAlertShown] = useState(false); 

  const qrCodeLock = useRef(false);
  const navigation = useNavigation<QRCodeScreenNavigationProp>();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await requestPermission();
      setHasPermission(status === "granted");
    };
    requestPermissions();
  }, []);

  const handleOpenCamera = async () => {
    if (hasPermission === null) {
      return Alert.alert("Câmera", "Solicitando permissão da câmera...");
    }

    if (hasPermission === false) {
      return Alert.alert("Câmera", "Permissão da câmera negada.");
    }

    setModalIsVisible(true);
    qrCodeLock.current = false;
    setAlertShown(false); 
  };

  const handleQRCodeRead = async (data: string) => {
    if (qrCodeLock.current) return; 
    qrCodeLock.current = true; 
  
    setIsScanning(true);
    setModalIsVisible(false);
  
    try {
      let itemFound = null;
  
      for (const collection of collections) {
        const doc = await firestore.collection(collection).doc(data).get();
        if (doc.exists) {
          itemFound = { collection, data: doc.data(), id: doc.id };
          break;
        }
      }
  
      if (itemFound) {
        const { collection, data: itemData, id: itemId } = itemFound;
        navigation.navigate("Item", {
          itemId,
          collection,
          name: itemData?.nome || "Item sem nome",
          details: itemData,
        });
      } else {
        if (!alertShown) {
          setAlertShown(true);
          Alert.alert("Erro de QR Code", "QR Code incompatível ou não reconhecido.", [
            {
              text: "OK",
              onPress: () => {
                setAlertShown(false);
                qrCodeLock.current = false;
              },
            },
          ]);
        }
      }
    } catch (error) {
      if (!alertShown) {
        setAlertShown(true); 
        Alert.alert("Erro de QR Code", "Ocorreu um erro ao buscar os dados. Por favor, tente novamente.", [
          {
            text: "OK",
            onPress: () => {
              setAlertShown(false); 
              qrCodeLock.current = false; 
            },
          },
        ]);
      }
    } finally {
      setIsScanning(false);
    }
  };  
  
  return (
    <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.linearGradient}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>Leitor de QR Code</Text>
        <Text style={styles.bodyText}>
          Escaneie um QR Code para acessar as informações do acervo de peças.
        </Text>
        <TouchableOpacity style={styles.scanButton} onPress={handleOpenCamera}>
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.scanButtonText}>Ler QR Code</Text>
        </TouchableOpacity>
      </View>

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
      <Footer />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  bodyText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#9773b1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  scanButtonText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },
  footer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignItems: "center",
  },
  loading: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: "center",
  },
});
