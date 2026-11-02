import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { obterDesafioPorId, excluirDesafio, DesafioSudoku } from '@/data/desafiosDatabase';

export default function DetalheDesafioTela() {
    const params = useLocalSearchParams();
    const id = params.id ? Number(params.id) : null;

    const [desafio, setDesafio] = useState<DesafioSudoku | null>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregarDetalhe() {
            if (id) {
                const item = await obterDesafioPorId(id);
                setDesafio(item);
            }
            setCarregando(false);
        }
        carregarDetalhe();
    }, [id]);

    function handleDelete() {
        if (!desafio) return;

        Alert.alert(
            'Confirmar Exclusão',
            `Deseja realmente apagar o registro #${desafio.id} do banco SQLite?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir Definitivamente',
                    style: 'destructive',
                    onPress: async () => {
                        await excluirDesafio(desafio.id);
                        Alert.alert('Sucesso', 'Registro removido do banco SQLite!');
                        router.replace('/lista-desafios');
                    }
                }
            ]
        );
    }

    if (carregando) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centro}>
                    <ActivityIndicator size="large" color="#0d9488" />
                    <Text style={styles.textoCarregando}>Carregando dados do SQLite...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!desafio) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topo}>
                    <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()} activeOpacity={0.7}>
                        <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
                    </TouchableOpacity>
                    <Text style={styles.tituloTopo}>Desafio</Text>
                    <View style={{ width: 60 }} />
                </View>
                <View style={styles.centro}>
                    <Text style={styles.textoNaoEncontrado}>Desafio não encontrado no banco de dados.</Text>
                    <TouchableOpacity style={styles.botaoVoltarLista} onPress={() => router.replace('/lista-desafios')} activeOpacity={0.8}>
                        <Text style={styles.botaoVoltarListaTexto}>Voltar para a Lista</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const corTag =
        desafio.dificuldade === 'Fácil'
            ? '#0d9488'
            : desafio.dificuldade === 'Médio'
            ? '#0c7068'
            : '#0c524c';

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Topo */}
            <View style={styles.topo}>
                <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()} activeOpacity={0.7}>
                    <Text style={styles.botaoVoltarTexto}>← Lista</Text>
                </TouchableOpacity>
                <Text style={styles.tituloTopo}>Detalhe do Desafio</Text>
                <TouchableOpacity style={styles.botaoExcluirTopo} onPress={handleDelete} activeOpacity={0.7}>
                    <Text style={styles.botaoExcluirTopoTexto}>Excluir</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Cartão de Detalhes Principal */}
                <View style={styles.cartaoPrincipal}>
                    {/* Header do Cartão */}
                    <View style={styles.cabecalhoDetalhe}>
                        <View style={[styles.badgeId]}>
                            <Text style={styles.badgeIdTexto}>ID #{desafio.id}</Text>
                        </View>
                        <View style={[styles.badgeDificuldade, { backgroundColor: corTag }]}>
                            <Text style={styles.badgeDificuldadeTexto}>{desafio.dificuldade}</Text>
                        </View>
                    </View>

                    <Text style={styles.titulo}>{desafio.titulo}</Text>
                    <Text style={styles.categoria}>Categoria: {desafio.categoria}</Text>

                    <View style={styles.divisor} />

                    {/* Metadados */}
                    <View style={styles.metaContainer}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaRotulo}>Criador / Autor</Text>
                            <Text style={styles.metaValor}>👤 {desafio.autor}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaRotulo}>Registrado em</Text>
                            <Text style={styles.metaValor}>📅 {desafio.criadoEm}</Text>
                        </View>
                    </View>

                    <View style={styles.divisor} />

                    {/* Descrição */}
                    <Text style={styles.secaoTitulo}>📝 Descrição do Desafio</Text>
                    <Text style={styles.textoCorpo}>{desafio.descricao}</Text>

                    {/* Dicas */}
                    <Text style={styles.secaoTitulo}>💡 Dicas & Estratégias</Text>
                    <View style={styles.boxDica}>
                        <Text style={styles.textoDica}>{desafio.dicas}</Text>
                    </View>
                </View>

                {/* Botões de Ação */}
                <View style={styles.botoesContainer}>
                    <TouchableOpacity
                        style={styles.botaoJogar}
                        activeOpacity={0.8}
                        onPress={() => {
                            if (desafio.dificuldade === 'Fácil') router.push('/nivelfacil');
                            else if (desafio.dificuldade === 'Médio') router.push('/nivelmedio');
                            else router.push('/niveldificil');
                        }}
                    >
                        <Text style={styles.botaoJogarTexto}>
                            🎮 Jogar Nível {desafio.dificuldade} Agora
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.botaoVoltarCard}
                        activeOpacity={0.8}
                        onPress={() => router.push('/lista-desafios')}
                    >
                        <Text style={styles.botaoVoltarCardTexto}>← Voltar à Lista</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f7f6',
    },
    topo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2eceb',
    },
    botaoVoltar: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#f0fdfa',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#99f6e4',
    },
    botaoVoltarTexto: {
        color: '#0d9488',
        fontSize: 14,
        fontWeight: 'bold',
    },
    tituloTopo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0d7c7b',
    },
    botaoExcluirTopo: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#fee2e2',
        borderRadius: 4,
    },
    botaoExcluirTopoTexto: {
        color: '#ef4444',
        fontSize: 13,
        fontWeight: 'bold',
    },
    scroll: {
        padding: 16,
        paddingBottom: 40,
    },
    cartaoPrincipal: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1.5,
        borderColor: '#0d9488',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cabecalhoDetalhe: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    badgeId: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeIdTexto: {
        color: '#64748b',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badgeDificuldade: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 6,
    },
    badgeDificuldadeTexto: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0d7c7b',
        marginBottom: 6,
    },
    categoria: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5a737d',
        marginBottom: 16,
    },
    divisor: {
        height: 1,
        backgroundColor: '#e2eceb',
        marginVertical: 14,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaItem: {
        flex: 1,
    },
    metaRotulo: {
        fontSize: 11,
        color: '#94a3b8',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 2,
    },
    metaValor: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#334155',
    },
    secaoTitulo: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0d7c7b',
        marginTop: 12,
        marginBottom: 8,
    },
    textoCorpo: {
        fontSize: 14,
        color: '#334155',
        lineHeight: 22,
    },
    boxDica: {
        backgroundColor: '#f0fdfa',
        borderLeftWidth: 4,
        borderLeftColor: '#0d9488',
        padding: 12,
        borderRadius: 4,
        marginTop: 4,
    },
    textoDica: {
        fontSize: 13,
        color: '#0f766e',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    botoesContainer: {
        marginTop: 20,
        gap: 10,
    },
    botaoJogar: {
        backgroundColor: '#0d9488',
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        shadowColor: '#0d9488',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    botaoJogarTexto: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    botaoVoltarCard: {
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#0d9488',
    },
    botaoVoltarCardTexto: {
        color: '#0d7c7b',
        fontSize: 14,
        fontWeight: 'bold',
    },
    centro: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    textoCarregando: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748b',
    },
    textoNaoEncontrado: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 16,
    },
    botaoVoltarLista: {
        backgroundColor: '#0d9488',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    botaoVoltarListaTexto: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

