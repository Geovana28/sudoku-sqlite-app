import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { listarDesafios, excluirDesafio, DesafioSudoku } from '@/data/desafiosDatabase';

export default function ListaDesafiosTela() {
    const [desafios, setDesafios] = useState<DesafioSudoku[]>([]);
    const [carregando, setCarregando] = useState(false);

    const carregar = async () => {
        setCarregando(true);
        try {
            const dados = await listarDesafios();
            setDesafios(dados);
        } catch (error) {
            console.error('Erro ao carregar desafios:', error);
        } finally {
            setCarregando(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    function confirmarExclusao(item: DesafioSudoku) {
        Alert.alert(
            'Excluir Desafio',
            `Deseja realmente excluir "${item.titulo}" do SQLite?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        await excluirDesafio(item.id);
                        await carregar();
                    }
                }
            ]
        );
    }

    const renderItem = ({ item }: { item: DesafioSudoku }) => {
        const corTag =
            item.dificuldade === 'Fácil'
                ? '#0d9488'
                : item.dificuldade === 'Médio'
                ? '#0c7068'
                : '#0c524c';

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: '/detalhe-desafio', params: { id: item.id } })}
            >
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitulo} numberOfLines={1}>
                            {item.titulo}
                        </Text>
                        <Text style={styles.cardCategoria}>📂 {item.categoria}</Text>
                    </View>
                    <View style={[styles.badgeDificuldade, { backgroundColor: corTag }]}>
                        <Text style={styles.badgeDificuldadeTexto}>{item.dificuldade}</Text>
                    </View>
                </View>

                <Text style={styles.cardDescricao} numberOfLines={2}>
                    {item.descricao}
                </Text>

                <View style={styles.cardFooter}>
                    <Text style={styles.cardAutor}>👤 {item.autor} • 🕒 {item.criadoEm}</Text>
                    <View style={styles.acoesCard}>
                        <TouchableOpacity
                            style={styles.botaoExcluir}
                            activeOpacity={0.7}
                            onPress={() => confirmarExclusao(item)}
                        >
                            <Text style={styles.botaoExcluirTexto}>🗑️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.botaoDetalhes}
                            activeOpacity={0.7}
                            onPress={() => router.push({ pathname: '/detalhe-desafio', params: { id: item.id } })}
                        >
                            <Text style={styles.botaoDetalhesTexto}>Ver Detalhes →</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Topo */}
            <View style={styles.topo}>
                <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push('/inicial')} activeOpacity={0.7}>
                    <Text style={styles.botaoVoltarTexto}>← Menu</Text>
                </TouchableOpacity>
                <Text style={styles.tituloTopo}>Desafios SQLite</Text>
                <TouchableOpacity style={styles.botaoNovo} onPress={() => router.push('/cadastro-desafio')} activeOpacity={0.7}>
                    <Text style={styles.botaoNovoTexto}>+ Novo</Text>
                </TouchableOpacity>
            </View>

            {/* Lista */}
            <FlatList
                data={desafios}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.lista}
                refreshControl={
                    <RefreshControl refreshing={carregando} onRefresh={carregar} colors={['#0d9488']} />
                }
                ListHeaderComponent={
                    <View style={styles.bannerInfo}>
                        <Text style={styles.bannerInfoTitulo}>📋 Gerenciamento de Desafios SQLite</Text>
                        <Text style={styles.bannerInfoTexto}>
                            Todos os itens abaixo estão persistidos na tabela local do SQLite. Toque em qualquer item para ver todos os detalhes ou cadastre novos registros.
                        </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.vazioContainer}>
                        <Text style={styles.vazioEmoji}>🧩</Text>
                        <Text style={styles.vazioTitulo}>Nenhum desafio encontrado</Text>
                        <Text style={styles.vazioSubtitulo}>
                            Clique no botão "+ Novo" acima para criar seu primeiro cadastro no SQLite!
                        </Text>
                        <TouchableOpacity
                            style={styles.botaoCadastrarAgora}
                            activeOpacity={0.8}
                            onPress={() => router.push('/cadastro-desafio')}
                        >
                            <Text style={styles.botaoCadastrarAgoraTexto}>+ Cadastrar Desafio</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
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
    botaoNovo: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#0d9488',
        borderRadius: 4,
    },
    botaoNovoTexto: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    lista: {
        padding: 16,
        paddingBottom: 30,
    },
    bannerInfo: {
        backgroundColor: '#e6fffa',
        borderWidth: 1.5,
        borderColor: '#99f6e4',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    bannerInfoTitulo: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0d7c7b',
        marginBottom: 4,
    },
    bannerInfoTexto: {
        fontSize: 12,
        color: '#475569',
        lineHeight: 17,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: '#0d9488',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    cardTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    cardCategoria: {
        fontSize: 12,
        color: '#0d9488',
        fontWeight: '600',
        marginTop: 2,
    },
    badgeDificuldade: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginLeft: 8,
    },
    badgeDificuldadeTexto: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    cardDescricao: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 18,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 10,
    },
    cardAutor: {
        fontSize: 11,
        color: '#94a3b8',
        flex: 1,
    },
    acoesCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    botaoExcluir: {
        padding: 6,
        backgroundColor: '#fee2e2',
        borderRadius: 4,
    },
    botaoExcluirTexto: {
        fontSize: 14,
    },
    botaoDetalhes: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#f0fdfa',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#99f6e4',
    },
    botaoDetalhesTexto: {
        color: '#0d7c7b',
        fontSize: 12,
        fontWeight: 'bold',
    },
    vazioContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    vazioEmoji: {
        fontSize: 50,
        marginBottom: 12,
    },
    vazioTitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 6,
    },
    vazioSubtitulo: {
        fontSize: 13,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 18,
    },
    botaoCadastrarAgora: {
        backgroundColor: '#0d9488',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 6,
    },
    botaoCadastrarAgoraTexto: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

