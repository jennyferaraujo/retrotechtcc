import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Footer from './Footer';

const AboutScreen = () => {
  return (
    <LinearGradient colors={['#654ea3', '#eaafc8']} style={styles.linearGradient}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerText}>
          Bem-vindo ao RetroTech
        </Text>
        <Text style={styles.bodyText}>
          Explore e aprenda sobre o acervo de peças de computação do Departamento de Sistemas e Computação (DSC) da FURB de forma interativa.
        </Text>
        <Text style={styles.sectionTitle}>
          Objetivo do aplicativo
        </Text>
        <Text style={styles.bodyText}>
          Facilitar o acesso e a compreensão do acervo histórico de peças de computação do DSC, proporcionando uma experiência educativa e imersiva.
        </Text>
        <Text style={styles.sectionTitle}>
          Principais funcionalidades
        </Text>
        <Text style={styles.bodyText}>
          Navegação por categorias de peças, acesso à timeline histórica e leitura de QR codes para informações detalhadas.
        </Text>
        <Text style={styles.sectionTitle}>
          Equipe de desenvolvimento
        </Text>
        <Text style={styles.bodyText}>
          Jennyfer Araujo e Guilherme Souza dos Santos - Sistemas da Informação
        </Text>
        <Text style={styles.bodyText}>
          Orientador: Dalton Solano dos Reis
        </Text>
        <Text style={styles.bodyText}>
          Supervisor: Miguel A. Wistainater
        </Text>
      </ScrollView>
      <Footer />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingBottom: 60,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  bodyText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 10,
  },
});

export default AboutScreen;