import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { getEstatisticasUsuario, EstatisticasUsuario } from '@/data/authService';

export default function TelaGanhouComponente() {
    const params = useLocalSearchParams<{ tempo?: string; nivel?: string }>();
    const tempo = params.tempo || '--:--';
    const nivel = (params.nivel as 'Fácil' | 'Médio' | 'Difícil') || 'Fácil';

    const [stats, setStats] = useState<EstatisticasUsuario | null>(null);

    useEffect(() => {
        getEstatisticasUsuario().then(res => setStats(res));
    }, []);

    const recordeNivel = stats?.melhorTempoPorNivel?.[nivel]?.tempoFormatado || tempo;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                {/* Ícone de Vitória com Mini Grid Decorativo */}
                <View style={styles.iconeTrofeu}>
                    <Text style={styles.trofeuTexto}>🏆</Text>
                </View>

                <Text style={styles.titulo}>PARABÉNS!</Text>
                <Text style={styles.subtitulo}>Você completou com sucesso o {nivel}!</Text>

                <View style={styles.cardTempo}>
                    <Text style={styles.tempoLabel}>TEMPO DE JOGO</Text>
                    <Text style={styles.tempoValor}>⏱️ {tempo}</Text>
                    <View style={styles.divisorLinha} />
                    <Text style={styles.recordeSubtexto}>⭐ Recorde no {nivel}: {recordeNivel}</Text>
                </View>

                <Pressable style={styles.botao} onPress={() => router.replace('/inicial')}>
                    <Text style={styles.botaoTexto}>JOGAR NOVAMENTE</Text>
                </Pressable>

                <Pressable style={styles.botaoVoltar} onPress={() => router.replace('/login')}>
                    <Text style={styles.botaoVoltarTexto}>SAIR</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f7f6',
        padding: 20,
    },
    card: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0d9488',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
    },
    iconeTrofeu: {
        width: 80,
        height: 80,
        backgroundColor: '#ccfbf1',
        borderWidth: 2,
        borderColor: '#0d9488',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    trofeuTexto: {
        fontSize: 40,
    },
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0d7c7b',
        letterSpacing: 2,
        marginBottom: 6,
    },
    subtitulo: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 20,
        textAlign: 'center',
    },
    cardTempo: {
        width: '100%',
        backgroundColor: '#f8fafc',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 2,
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1.5,
        borderColor: '#ccfbf1',
    },
    tempoLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#5a737d',
        letterSpacing: 1,
    },
    tempoValor: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0d7c7b',
        marginTop: 4,
    },
    divisorLinha: {
        width: '80%',
        height: 1,
        backgroundColor: '#ccfbf1',
        marginVertical: 8,
    },
    recordeSubtexto: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0f766e',
    },
    botao: {
        width: '100%',
        backgroundColor: '#0d9488',
        paddingVertical: 14,
        borderRadius: 2,
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#0f766e',
    },
    botaoTexto: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    botaoVoltar: {
        width: '100%',
        paddingVertical: 12,
        borderRadius: 2,
        borderWidth: 1.5,
        borderColor: '#0d9488',
        backgroundColor: '#ffffff',
        alignItems: 'center',
    },
    botaoVoltarTexto: {
        color: '#0d7c7b',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
});
