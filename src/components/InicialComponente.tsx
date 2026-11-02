import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getUsuarioAtual, deslogarUsuario, getEstatisticasUsuario, EstatisticasUsuario } from '@/data/authService';

export default function InicialComponente() {
    const { width } = useWindowDimensions();
    const [modalVisivel, setModalVisivel] = useState(false);
    const [modalStatsVisivel, setModalStatsVisivel] = useState(false);
    const [nomeUsuario, setNomeUsuario] = useState<string>('Jogador');
    const [estatisticas, setEstatisticas] = useState<EstatisticasUsuario | null>(null);

    async function carregarDados() {
        const nome = await getUsuarioAtual();
        if (nome) {
            setNomeUsuario(nome);
        }
        const stats = await getEstatisticasUsuario(nome || undefined);
        setEstatisticas(stats);
    }

    useEffect(() => {
        carregarDados();
    }, []);

    async function abrirModalStats() {
        await carregarDados();
        setModalStatsVisivel(true);
    }

    async function sair() {
        await deslogarUsuario();
        router.replace('/login');
    }

    const larguraBotao = Math.min(width - 48, 280);

    return (
        <SafeAreaView style={styles.container}>
            {/* Barra Superior: Usuário logado e Botões de Ajuda / Estatísticas */}
            <View style={styles.barraSuperior}>
                <View style={styles.badgeUsuario}>
                    <Text style={styles.badgeUsuarioTexto}>👤 {nomeUsuario}</Text>
                    <Pressable style={styles.botaoSair} onPress={sair}>
                        <Text style={styles.botaoSairTexto}>Sair</Text>
                    </Pressable>
                </View>

                <View style={styles.botoesTopoDireita}>
                    <Pressable
                        style={styles.botaoIcone}
                        onPress={abrirModalStats}
                        accessibilityLabel="Estatísticas"
                    >
                        <Text style={styles.botaoIconeTexto}>📊</Text>
                    </Pressable>

                    <Pressable
                        style={styles.botaoIcone}
                        onPress={() => setModalVisivel(true)}
                        accessibilityLabel="Ajuda"
                    >
                        <Text style={styles.botaoAjudaTexto}>?</Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollCentral}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <Text style={styles.titulo}>Sudoku</Text>
                <Text style={styles.subtitulo}>Olá, {nomeUsuario}! Escolha a dificuldade:</Text>

                <Pressable
                    style={[styles.botao, styles.facil, { width: larguraBotao }]}
                    onPress={() => router.push('/nivelfacil')}
                >
                    <Text style={styles.botaoTexto}>Fácil</Text>
                    {estatisticas?.melhorTempoPorNivel?.Fácil && (
                        <Text style={styles.botaoSubtexto}>
                            ⭐ Recorde: {estatisticas.melhorTempoPorNivel.Fácil.tempoFormatado}
                        </Text>
                    )}
                </Pressable>

                <Pressable
                    style={[styles.botao, styles.medio, { width: larguraBotao }]}
                    onPress={() => router.push('/nivelmedio')}
                >
                    <Text style={styles.botaoTexto}>Médio</Text>
                    {estatisticas?.melhorTempoPorNivel?.Médio && (
                        <Text style={styles.botaoSubtexto}>
                            ⭐ Recorde: {estatisticas.melhorTempoPorNivel.Médio.tempoFormatado}
                        </Text>
                    )}
                </Pressable>

                <Pressable
                    style={[styles.botao, styles.dificil, { width: larguraBotao }]}
                    onPress={() => router.push('/niveldificil')}
                >
                    <Text style={styles.botaoTexto}>Difícil</Text>
                    {estatisticas?.melhorTempoPorNivel?.Difícil && (
                        <Text style={styles.botaoSubtexto}>
                            ⭐ Recorde: {estatisticas.melhorTempoPorNivel.Difícil.tempoFormatado}
                        </Text>
                    )}
                </Pressable>

                <Pressable
                    style={[styles.botaoStatsAcesso, { width: larguraBotao }]}
                    onPress={abrirModalStats}
                >
                    <Text style={styles.botaoStatsAcessoTexto}>📊 Ver Minhas Estatísticas</Text>
                </Pressable>

                {/* Seção SQLite */}
                <View style={[styles.secaoSqliteContainer, { width: larguraBotao }]}>
                    <Text style={styles.secaoSqliteTitulo}>BANCO DE DADOS SQLITE</Text>
                    <View style={styles.botoesSqliteLinha}>
                        <Pressable
                            style={styles.botaoSqliteItem}
                            onPress={() => router.push('/cadastro-desafio')}
                        >
                            <Text style={styles.botaoSqliteIcone}>➕</Text>
                            <Text style={styles.botaoSqliteTexto}>Novo Cadastro</Text>
                        </Pressable>

                        <Pressable
                            style={styles.botaoSqliteItem}
                            onPress={() => router.push('/lista-desafios')}
                        >
                            <Text style={styles.botaoSqliteIcone}>📋</Text>
                            <Text style={styles.botaoSqliteTexto}>Lista & Detalhes</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>


            {/* Modal com Instruções de Como Jogar */}
            <Modal
                visible={modalVisivel}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisivel(false)}
            >
                <View style={styles.modalFundo}>
                    <View style={styles.modalConteudo}>
                        <View style={styles.modalCabecalho}>
                            <Text style={styles.modalTitulo}>Como Jogar Sudoku</Text>
                            <Pressable
                                style={styles.modalFecharX}
                                onPress={() => setModalVisivel(false)}
                            >
                                <Text style={styles.modalFecharXTexto}>✕</Text>
                            </Pressable>
                        </View>

                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            <Text style={styles.secaoTitulo}>Objetivo do Jogo</Text>
                            <Text style={styles.secaoTexto}>
                                Preencher toda a grade de 9x9 casas com números de 1 a 9 sem repetir nenhum número.
                            </Text>

                            <Text style={styles.secaoTitulo}>As 3 Regras Básicas</Text>
                            <View style={styles.regraItem}>
                                <Text style={styles.regraNumero}>1.</Text>
                                <Text style={styles.regraTexto}>
                                    <Text style={styles.negrito}>Linhas:</Text> Cada uma das 9 linhas horizontais deve conter os números de 1 a 9 sem repetição.
                                </Text>
                            </View>

                            <View style={styles.regraItem}>
                                <Text style={styles.regraNumero}>2.</Text>
                                <Text style={styles.regraTexto}>
                                    <Text style={styles.negrito}>Colunas:</Text> Cada uma das 9 colunas verticais também deve ter os números de 1 a 9 sem repetição.
                                </Text>
                            </View>

                            <View style={styles.regraItem}>
                                <Text style={styles.regraNumero}>3.</Text>
                                <Text style={styles.regraTexto}>
                                    <Text style={styles.negrito}>Quadrantes 3x3:</Text> Cada um dos 9 blocos de 3x3 deve ter os números de 1 a 9 sem repetição.
                                </Text>
                            </View>

                            <Text style={styles.secaoTitulo}>Dificuldades e Limites de Erros</Text>
                            <Text style={styles.secaoTexto}>
                                • <Text style={styles.negrito}>Fácil:</Text> Muitas pistas reveladas, até 5 erros permitidos.{"\n"}
                                • <Text style={styles.negrito}>Médio:</Text> Desafio balanceado, até 3 erros permitidos.{"\n"}
                                • <Text style={styles.negrito}>Difícil:</Text> Poucas pistas, apenas 1 erro tolerado!
                            </Text>

                            <Text style={styles.secaoTitulo}>Como interagir</Text>
                            <Text style={styles.secaoTexto}>
                                Toque na casa vazia que deseja preencher e em seguida selecione o número no teclado abaixo do tabuleiro.
                            </Text>
                        </ScrollView>

                        <Pressable
                            style={styles.modalBotaoEntendi}
                            onPress={() => setModalVisivel(false)}
                        >
                            <Text style={styles.modalBotaoEntendiTexto}>Entendi, vamos jogar!</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Modal de Estatísticas e Recordes */}
            <Modal
                visible={modalStatsVisivel}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalStatsVisivel(false)}
            >
                <View style={styles.modalFundo}>
                    <View style={styles.modalConteudo}>
                        <View style={styles.modalCabecalho}>
                            <Text style={styles.modalTitulo}>📊 Estatísticas do Jogador</Text>
                            <Pressable
                                style={styles.modalFecharX}
                                onPress={() => setModalStatsVisivel(false)}
                            >
                                <Text style={styles.modalFecharXTexto}>✕</Text>
                            </Pressable>
                        </View>

                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            {/* Resumo Geral */}
                            <View style={styles.statsLinhaResumo}>
                                <View style={styles.statsCardMini}>
                                    <Text style={styles.statsCardNumero}>{estatisticas?.partidasJogadas || 0}</Text>
                                    <Text style={styles.statsCardLabel}>Partidas</Text>
                                </View>
                                <View style={styles.statsCardMini}>
                                    <Text style={styles.statsCardNumero}>{estatisticas?.partidasVencidas || 0}</Text>
                                    <Text style={styles.statsCardLabel}>Vitórias</Text>
                                </View>
                                <View style={styles.statsCardMini}>
                                    <Text style={styles.statsCardNumero}>
                                        {estatisticas?.partidasJogadas
                                            ? `${Math.round(((estatisticas.partidasVencidas || 0) / estatisticas.partidasJogadas) * 100)}%`
                                            : '0%'}
                                    </Text>
                                    <Text style={styles.statsCardLabel}>Taxa Vitórias</Text>
                                </View>
                            </View>

                            {/* Melhores Tempos */}
                            <Text style={styles.secaoTitulo}>⭐ Recordes Pessoais (Melhor Tempo)</Text>
                            <View style={styles.recordeContainer}>
                                <View style={styles.recordeItem}>
                                    <Text style={styles.recordeItemNivel}>Fácil</Text>
                                    <Text style={styles.recordeItemTempo}>
                                        ⏱️ {estatisticas?.melhorTempoPorNivel?.Fácil?.tempoFormatado || '--:--'}
                                    </Text>
                                </View>
                                <View style={styles.recordeItem}>
                                    <Text style={styles.recordeItemNivel}>Médio</Text>
                                    <Text style={styles.recordeItemTempo}>
                                        ⏱️ {estatisticas?.melhorTempoPorNivel?.Médio?.tempoFormatado || '--:--'}
                                    </Text>
                                </View>
                                <View style={styles.recordeItem}>
                                    <Text style={styles.recordeItemNivel}>Difícil</Text>
                                    <Text style={styles.recordeItemTempo}>
                                        ⏱️ {estatisticas?.melhorTempoPorNivel?.Difícil?.tempoFormatado || '--:--'}
                                    </Text>
                                </View>
                            </View>

                            {/* Histórico Recente */}
                            <Text style={styles.secaoTitulo}>🕒 Histórico Recente</Text>
                            {estatisticas?.historicoRecente && estatisticas.historicoRecente.length > 0 ? (
                                estatisticas.historicoRecente.map((item, idx) => (
                                    <View key={idx} style={styles.historicoItem}>
                                        <View>
                                            <Text style={styles.historicoItemTitulo}>
                                                {item.nivel} • {item.resultado === 'vitória' ? '🏆 Vitória' : '❌ Derrota'}
                                            </Text>
                                            <Text style={styles.historicoItemData}>{item.data}</Text>
                                        </View>
                                        <Text style={styles.historicoItemTempo}>⏱️ {item.tempo}</Text>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.textoSemHistorico}>Nenhuma partida registrada ainda.</Text>
                            )}
                        </ScrollView>

                        <Pressable
                            style={styles.modalBotaoEntendi}
                            onPress={() => setModalStatsVisivel(false)}
                        >
                            <Text style={styles.modalBotaoEntendiTexto}>Fechar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7f6',
    },
    barraSuperior: {
        position: 'absolute',
        top: 16,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    badgeUsuario: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#0d9488',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        gap: 10,
    },
    badgeUsuarioTexto: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0d7c7b',
    },
    botaoSair: {
        backgroundColor: '#fee2e2',
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 2,
        borderWidth: 1,
        borderColor: '#fca5a5',
    },
    botaoSairTexto: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#ef4444',
    },
    botoesTopoDireita: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    botaoIcone: {
        width: 38,
        height: 38,
        borderRadius: 4,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#0d9488',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    botaoIconeTexto: {
        fontSize: 18,
    },
    botaoAjudaTexto: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0d9488',
    },
    scrollCentral: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    titulo: {
        fontSize: 38,
        fontWeight: 'bold',
        color: '#0d7c7b',
        letterSpacing: 2,
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 15,
        color: '#5a737d',
        marginBottom: 32,
        textAlign: 'center',
    },
    botao: {
        paddingVertical: 14,
        borderRadius: 4,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#0f766e',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    facil: {
        backgroundColor: '#0d9488',
    },
    medio: {
        backgroundColor: '#0c7068',
    },
    dificil: {
        backgroundColor: '#0c524c',
    },
    botaoTexto: {
        color: '#ffffff',
        fontSize: 19,
        fontWeight: 'bold',
    },
    botaoSubtexto: {
        color: '#ccfbf1',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
    botaoStatsAcesso: {
        paddingVertical: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 6,
        borderWidth: 1.5,
        borderColor: '#0d9488',
        backgroundColor: '#ffffff',
    },
    botaoStatsAcessoTexto: {
        color: '#0d7c7b',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    secaoSqliteContainer: {
        marginTop: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#cbd5e1',
        alignItems: 'center',
    },
    secaoSqliteTitulo: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#64748b',
        letterSpacing: 1,
        marginBottom: 10,
    },
    botoesSqliteLinha: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    botaoSqliteItem: {
        flex: 1,
        backgroundColor: '#0d9488',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
    botaoSqliteIcone: {
        fontSize: 18,
        marginBottom: 4,
    },
    botaoSqliteTexto: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalFundo: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalConteudo: {
        width: '100%',
        maxWidth: 380,
        maxHeight: '82%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalCabecalho: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e2eceb',
        paddingBottom: 12,
        marginBottom: 12,
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0d7c7b',
    },
    modalFecharX: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalFecharXTexto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#64748b',
    },
    modalScroll: {
        marginBottom: 16,
    },
    secaoTitulo: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0d7c7b',
        marginTop: 14,
        marginBottom: 8,
    },
    secaoTexto: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    regraItem: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingRight: 10,
    },
    regraNumero: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0d9488',
        marginRight: 6,
    },
    regraTexto: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
        flex: 1,
    },
    negrito: {
        fontWeight: 'bold',
        color: '#1e293b',
    },
    modalBotaoEntendi: {
        backgroundColor: '#0d9488',
        paddingVertical: 13,
        borderRadius: 6,
        alignItems: 'center',
    },
    modalBotaoEntendiTexto: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    statsLinhaResumo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 6,
    },
    statsCardMini: {
        flex: 1,
        backgroundColor: '#f0fdfa',
        borderWidth: 1.5,
        borderColor: '#99f6e4',
        borderRadius: 6,
        paddingVertical: 10,
        alignItems: 'center',
    },
    statsCardNumero: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0d9488',
    },
    statsCardLabel: {
        fontSize: 11,
        color: '#5a737d',
        fontWeight: '600',
        marginTop: 2,
    },
    recordeContainer: {
        gap: 6,
        marginBottom: 6,
    },
    recordeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f8fafc',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    recordeItemNivel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#334155',
    },
    recordeItemTempo: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#0d9488',
    },
    historicoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    historicoItemTitulo: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    historicoItemData: {
        fontSize: 10,
        color: '#94a3b8',
        marginTop: 1,
    },
    historicoItemTempo: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f766e',
    },
    textoSemHistorico: {
        fontSize: 12,
        color: '#94a3b8',
        fontStyle: 'italic',
        paddingVertical: 8,
    },
});
