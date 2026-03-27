import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Savdo-(E)</Text>
                <Text style={styles.subtitle}>Modern Mobile Marketplace</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Everything is Ready!</Text>
                <Text style={styles.cardDesc}>
                    Your professional React Native + Expo skeleton has been successfully initialized.
                </Text>
            </View>
            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#0F172A',
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '600',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
        width: '100%',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
});
