import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; 
import firebase from 'firebase/compat/app';

type QRCodeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'QRCode'>;

export default function QRCodeScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation<QRCodeScreenNavigationProp>();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleQRCodeScan = async ({ data }: { data: string }) => {
    setScanned(true);
    const itemId = data;  

    try {
      const itemRef = firebase.firestore().collection('items').doc(itemId);
      const doc = await itemRef.get();

      if (doc.exists) {
        
        navigation.navigate('Item', { itemId });  
      } else {
        alert('Item não encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar item no Firebase:', error);
      alert('Erro ao buscar item.');
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permissão da câmera...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Sem permissão para acessar a câmera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleQRCodeScan}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && <Button title="Escanear novamente" onPress={() => setScanned(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
