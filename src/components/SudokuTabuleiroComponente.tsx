import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, Platform, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Dificuldade, gerarJogoPorNivel, TabuleiroData } from '@/data/sudokuNiveis';
import { salvarResultadoPartida } from '@/data/authService';

interface Props {
    nivel: Dificuldade;
}

export default function SudokuTabuleiroComponente({ nivel }: Props) {
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    // Tamanho dinâmico e responsivo da célula com base na tela
    const tamanhoMaximoTabuleiro = Math.min(windowWidth - 24, 420);
    const tamanhoCelula = Math.floor((tamanhoMaximoTabuleiro - 16) / 9);
    const tamanhoFonte = Math.max(14, Math.floor(tamanhoCelula * 0.52));

    // Configuração do tabuleiro atual
    const [config, setConfig] = useState<TabuleiroData>(() => gerarJogoPorNivel(nivel));

    // Estado da grade do jogador
    const [grade, setGrade] = useState<number[][]>(() =>
        config.inicial.map(row => [...row])
    );
    // Modo Rascunho / Notas: cada célula pode ter uma lista de números anotados
    const [modoRascunho, setModoRascunho] = useState<boolean>(false);
    const [rascunhos, setRascunhos] = useState<Record<string, number[]>>({});

    // Célula selecionada: [linha, coluna] ou null
    const [selecionada, setSelecionada] = useState<[number, number] | null>(null);
    // Quantidade de dicas disponíveis (máximo 3 por partida)
    const [dicasRestantes, setDicasRestantes] = useState<number>(3);
    // Contador de erros
    const [erros, setErros] = useState<number>(0);
    // Cronômetro em segundos
    const [segundos, setSegundos] = useState<number>(0);
    // Status do jogo
    const [jogoFinalizado, setJogoFinalizado] = useState<boolean>(false);

    // Efeito para o cronômetro
    useEffect(() => {
        if (jogoFinalizado) return;

        const timer = setInterval(() => {
            setSegundos(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [jogoFinalizado]);

    // Formatação do tempo: MM:SS
    function formatarTempo(totalSegundos: number): string {
        const min = Math.floor(totalSegundos / 60);
        const seg = totalSegundos % 60;
        return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
    }

    // Identifica se uma célula era pista inicial (imutável)
    function isPistaFixa(linha: number, col: number): boolean {
        return config.inicial[linha][col] !== 0;
    }

    // Selecionar célula
    function selecionarCelula(linha: number, col: number) {
        if (jogoFinalizado) return;
        setSelecionada([linha, col]);
    }

    // Executa reinicialização do tabuleiro
    function executarReiniciar() {
        setGrade(config.inicial.map(row => [...row]));
        setRascunhos({});
        setErros(0);
        setSegundos(0);
        setSelecionada(null);
        setDicasRestantes(3);
        setJogoFinalizado(false);
    }

    // Reiniciar a mesma partida (compatível com Web e Mobile)
    function reiniciarPartida() {
        if (Platform.OS === 'web') {
            const confirmou = window.confirm('Deseja recomeçar este mesmo tabuleiro do zero?');
            if (confirmou) {
                executarReiniciar();
            }
            return;
        }

        Alert.alert(
            'Reiniciar Jogo',
            'Deseja recomeçar este mesmo tabuleiro do zero?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sim, Reiniciar',
                    onPress: executarReiniciar,
                },
            ]
        );
    }

    // Executa sorteio de um novo jogo
    function executarNovoJogo() {
        const novo = gerarJogoPorNivel(nivel);
        setConfig(novo);
        setGrade(novo.inicial.map(row => [...row]));
        setRascunhos({});
        setErros(0);
        setSegundos(0);
        setSelecionada(null);
        setDicasRestantes(3);
        setJogoFinalizado(false);
    }

    // Gerar um Novo Jogo do mesmo nível (compatível com Web e Mobile)
    function novoJogo() {
        if (Platform.OS === 'web') {
            const confirmou = window.confirm('Deseja sortear um tabuleiro totalmente novo?');
            if (confirmou) {
                executarNovoJogo();
            }
            return;
        }

        Alert.alert(
            'Novo Jogo',
            'Deseja sortear um tabuleiro totalmente novo?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Novo Tabuleiro',
                    onPress: executarNovoJogo,
                },
            ]
        );
    }

    // Notificação multiplataforma
    function exibirAviso(titulo: string, mensagem: string) {
        if (Platform.OS === 'web') {
            window.alert(`${titulo}: ${mensagem}`);
            return;
        }
        Alert.alert(titulo, mensagem);
    }

    // Usar uma Dica 💡
    function usarDica() {
        if (jogoFinalizado) return;

        if (dicasRestantes <= 0) {
            exibirAviso('Sem dicas', 'Você já usou todas as 3 dicas permitidas nesta partida!');
            return;
        }

        let alvo: [number, number] | null = null;

        if (selecionada && grade[selecionada[0]][selecionada[1]] === 0) {
            alvo = selecionada;
        } else {
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (grade[r][c] === 0) {
                        alvo = [r, c];
                        break;
                    }
                }
                if (alvo) break;
            }
        }

        if (!alvo) return;

        const [r, c] = alvo;
        const valorCorreto = config.solucao[r][c];

        const novaGrade = grade.map(row => [...row]);
        novaGrade[r][c] = valorCorreto;
        setGrade(novaGrade);
        setDicasRestantes(prev => prev - 1);
        setSelecionada([r, c]);

        const chave = `${r}-${c}`;
        if (rascunhos[chave]) {
            const novosRasc = { ...rascunhos };
            delete novosRasc[chave];
            setRascunhos(novosRasc);
        }

        const todasPreenchidas = novaGrade.every((row, rIdx) =>
            row.every((cell, cIdx) => cell === config.solucao[rIdx][cIdx])
        );

        if (todasPreenchidas) {
            setJogoFinalizado(true);
            const tempoTxt = formatarTempo(segundos);
            salvarResultadoPartida(nivel, true, tempoTxt, segundos);
            router.push({
                pathname: '/telafinalganhou',
                params: { tempo: tempoTxt, nivel },
            });
        }
    }

    // Jogador insere um número (1 a 9)
    function inserirNumero(num: number) {
        if (jogoFinalizado || !selecionada) return;

        const [linha, col] = selecionada;

        if (isPistaFixa(linha, col)) {
            exibirAviso('Fixo', 'Esta casa já veio preenchida inicialmente!');
            return;
        }

        if (modoRascunho) {
            const chave = `${linha}-${col}`;
            const atuais = rascunhos[chave] || [];
            let novos: number[];

            if (atuais.includes(num)) {
                novos = atuais.filter(n => n !== num);
            } else {
                novos = [...atuais, num].sort();
            }

            setRascunhos({ ...rascunhos, [chave]: novos });
            return;
        }

        const respostaCorreta = config.solucao[linha][col];

        if (num === respostaCorreta) {
            const novaGrade = grade.map(row => [...row]);
            novaGrade[linha][col] = num;
            setGrade(novaGrade);

            const chave = `${linha}-${col}`;
            if (rascunhos[chave]) {
                const novosRasc = { ...rascunhos };
                delete novosRasc[chave];
                setRascunhos(novosRasc);
            }

            const todasPreenchidas = novaGrade.every((r, rIdx) =>
                r.every((c, cIdx) => c === config.solucao[rIdx][cIdx])
            );

            if (todasPreenchidas) {
                setJogoFinalizado(true);
                const tempoTxt = formatarTempo(segundos);
                salvarResultadoPartida(nivel, true, tempoTxt, segundos);
                router.push({
                    pathname: '/telafinalganhou',
                    params: { tempo: tempoTxt, nivel },
                });
            }
        } else {
            const novosErros = erros + 1;
            setErros(novosErros);

            if (novosErros >= config.maxErros) {
                setJogoFinalizado(true);
                const tempoTxt = formatarTempo(segundos);
                salvarResultadoPartida(nivel, false, tempoTxt, segundos);
                router.push({
                    pathname: '/telafinalperdeu',
                    params: { tempo: tempoTxt, nivel },
                });
            } else {
                exibirAviso(
                    'Número incorreto!',
                    `Você cometeu um erro. Erros: ${novosErros}/${config.maxErros}`
                );
            }
        }
    }

    // Limpar célula (se não for fixa)
    function apagarCelula() {
        if (jogoFinalizado || !selecionada) return;
        const [linha, col] = selecionada;
        if (isPistaFixa(linha, col)) return;

        const novaGrade = grade.map(row => [...row]);
        novaGrade[linha][col] = 0;
        setGrade(novaGrade);

        const chave = `${linha}-${col}`;
        if (rascunhos[chave]) {
            const novosRasc = { ...rascunhos };
            delete novosRasc[chave];
            setRascunhos(novosRasc);
        }
    }

    const selLinha = selecionada ? selecionada[0] : null;
    const selColuna = selecionada ? selecionada[1] : null;
    const valorSelecionado = (selLinha !== null && selColuna !== null) ? grade[selLinha][selColuna] : null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Cabeçalho de Informações: Nível, Erros e Cronômetro */}
                <View style={[styles.cabecalho, { maxWidth: tamanhoMaximoTabuleiro }]}>
                    <View style={styles.infoBadge}>
                        <Text style={styles.infoBadgeTitulo}>DIFICULDADE</Text>
                        <Text style={styles.infoBadgeValor}>{nivel}</Text>
                    </View>

                    <View style={styles.infoBadge}>
                        <Text style={styles.infoBadgeTitulo}>ERROS</Text>
                        <Text style={[styles.infoBadgeValor, erros > 0 && styles.textoErro]}>
                            {erros}/{config.maxErros}
                        </Text>
                    </View>

                    <View style={styles.infoBadge}>
                        <Text style={styles.infoBadgeTitulo}>TEMPO</Text>
                        <Text style={styles.infoBadgeValor}>{formatarTempo(segundos)}</Text>
                    </View>
                </View>

                {/* Barra de Ferramentas: Rascunho, Dica, Reiniciar e Novo Jogo */}
                <View style={[styles.barraAcoes, { maxWidth: tamanhoMaximoTabuleiro }]}>
                    <Pressable
                        style={[styles.botaoAcao, modoRascunho && styles.botaoAcaoAtivo]}
                        onPress={() => setModoRascunho(prev => !prev)}
                    >
                        <Text style={[styles.botaoAcaoTexto, modoRascunho && styles.botaoAcaoTextoAtivo]}>
                            ✏️ {modoRascunho ? 'Notas: ON' : 'Notas: OFF'}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.botaoAcao, dicasRestantes === 0 && styles.botaoAcaoDesabilitado]}
                        onPress={usarDica}
                    >
                        <Text style={styles.botaoAcaoTexto}>💡 Dica ({dicasRestantes})</Text>
                    </Pressable>

                    <Pressable style={styles.botaoAcao} onPress={reiniciarPartida}>
                        <Text style={styles.botaoAcaoTexto}>🔁 Reiniciar</Text>
                    </Pressable>

                    <Pressable style={styles.botaoAcao} onPress={novoJogo}>
                        <Text style={styles.botaoAcaoTexto}>✨ Novo</Text>
                    </Pressable>
                </View>

                {/* Tabuleiro 9x9 com Destaques Visuais Inteligentes */}
                <View style={[styles.tabuleiro, { width: tamanhoMaximoTabuleiro }]}>
                    {grade.map((linha, i) => (
                        <View key={i} style={styles.linha}>
                            {linha.map((celula, j) => {
                                const estaSelecionada = selLinha === i && selColuna === j;
                                const fixa = isPistaFixa(i, j);

                                const mesmoBloco =
                                    selLinha !== null &&
                                    selColuna !== null &&
                                    Math.floor(selLinha / 3) === Math.floor(i / 3) &&
                                    Math.floor(selColuna / 3) === Math.floor(j / 3);

                                const emDestaqueCruz = (selLinha === i || selColuna === j || mesmoBloco) && !estaSelecionada;

                                const mesmoNumero =
                                    valorSelecionado !== null &&
                                    valorSelecionado !== 0 &&
                                    celula === valorSelecionado &&
                                    !estaSelecionada;

                                const notasDestaCasa = rascunhos[`${i}-${j}`] || [];

                                return (
                                    <Pressable
                                        key={j}
                                        style={[
                                            styles.celula,
                                            { width: tamanhoCelula, height: tamanhoCelula },
                                            i % 3 === 0 && i !== 0 && styles.bordaSuperior,
                                            j % 3 === 0 && j !== 0 && styles.bordaEsquerda,
                                            fixa && styles.celulaFixa,
                                            emDestaqueCruz && styles.celulaCruz,
                                            mesmoNumero && styles.celulaNumeroIgual,
                                            estaSelecionada && styles.celulaSelecionada,
                                        ]}
                                        onPress={() => selecionarCelula(i, j)}
                                    >
                                        {celula !== 0 ? (
                                            <Text
                                                style={[
                                                    styles.celulaTexto,
                                                    { fontSize: tamanhoFonte },
                                                    fixa ? styles.celulaTextoFixo : styles.celulaTextoUsuario,
                                                    mesmoNumero && styles.celulaTextoDestaque,
                                                ]}
                                            >
                                                {celula}
                                            </Text>
                                        ) : (
                                            notasDestaCasa.length > 0 && (
                                                <View style={styles.rascunhoContainer}>
                                                    <Text style={[styles.rascunhoTexto, { fontSize: Math.max(7, Math.floor(tamanhoCelula * 0.22)) }]}>
                                                        {notasDestaCasa.join(' ')}
                                                    </Text>
                                                </View>
                                            )
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    ))}
                </View>

                {/* Teclado Numérico Interativo (1 a 9 + Botão Apagar) */}
                <View style={[styles.tecladoContainer, { maxWidth: tamanhoMaximoTabuleiro }]}>
                    <View style={styles.tecladoLinha}>
                        {[1, 2, 3, 4, 5].map(num => (
                            <Pressable
                                key={num}
                                style={styles.tecladoBotao}
                                onPress={() => inserirNumero(num)}
                            >
                                <Text style={styles.tecladoBotaoTexto}>{num}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <View style={styles.tecladoLinha}>
                        {[6, 7, 8, 9].map(num => (
                            <Pressable
                                key={num}
                                style={styles.tecladoBotao}
                                onPress={() => inserirNumero(num)}
                            >
                                <Text style={styles.tecladoBotaoTexto}>{num}</Text>
                            </Pressable>
                        ))}
                        <Pressable
                            style={[styles.tecladoBotao, styles.tecladoBotaoApagar]}
                            onPress={apagarCelula}
                        >
                            <Text style={styles.tecladoBotaoApagarTexto}>⌫</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Botão Voltar */}
                <Pressable style={styles.botaoVoltar} onPress={() => router.back()}>
                    <Text style={styles.botaoVoltarTexto}>← Voltar aos Níveis</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7f6',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    cabecalho: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 340,
        marginBottom: 10,
    },
    infoBadge: {
        backgroundColor: '#ffffff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 2,
        alignItems: 'center',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1.5,
        borderColor: '#0d9488',
    },
    infoBadgeTitulo: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#5a737d',
        letterSpacing: 0.5,
    },
    infoBadgeValor: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0d7c7b',
        marginTop: 2,
    },
    textoErro: {
        color: '#e74c3c',
    },
    barraAcoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 340,
        marginBottom: 12,
        gap: 6,
    },
    botaoAcao: {
        flex: 1,
        paddingVertical: 7,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#cce2e0',
        elevation: 1,
    },
    botaoAcaoAtivo: {
        backgroundColor: '#0d9488',
        borderColor: '#0f766e',
    },
    botaoAcaoDesabilitado: {
        opacity: 0.4,
    },
    botaoAcaoTexto: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0d7c7b',
    },
    botaoAcaoTextoAtivo: {
        color: '#ffffff',
    },
    tabuleiro: {
        backgroundColor: '#ffffff',
        borderRadius: 2,
        padding: 2,
        borderWidth: 2.5,
        borderColor: '#0d9488',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    linha: {
        flexDirection: 'row',
    },
    celula: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#cbd5e1',
        backgroundColor: '#ffffff',
    },
    celulaFixa: {
        backgroundColor: '#f1f5f9',
    },
    celulaCruz: {
        backgroundColor: '#e6f4f2',
    },
    celulaNumeroIgual: {
        backgroundColor: '#c7ece5',
    },
    celulaSelecionada: {
        backgroundColor: '#99f6e4',
        borderColor: '#0d9488',
        borderWidth: 1.5,
    },
    bordaSuperior: {
        borderTopWidth: 2,
        borderTopColor: '#0d9488',
    },
    bordaEsquerda: {
        borderLeftWidth: 2,
        borderLeftColor: '#0d9488',
    },
    celulaTexto: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    celulaTextoFixo: {
        color: '#0f172a',
    },
    celulaTextoUsuario: {
        color: '#0d9488',
    },
    celulaTextoDestaque: {
        color: '#042f2e',
    },
    rascunhoContainer: {
        padding: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rascunhoTexto: {
        fontSize: 8,
        color: '#0d9488',
        fontWeight: '600',
        textAlign: 'center',
    },
    tecladoContainer: {
        marginTop: 14,
        width: '100%',
        maxWidth: 340,
        gap: 6,
    },
    tecladoLinha: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    tecladoBotao: {
        flex: 1,
        height: 44,
        backgroundColor: '#ffffff',
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#0d9488',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    tecladoBotaoTexto: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#0d7c7b',
    },
    tecladoBotaoApagar: {
        backgroundColor: '#fee2e2',
        borderColor: '#ef4444',
    },
    tecladoBotaoApagarTexto: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#ef4444',
    },
    botaoVoltar: {
        marginTop: 14,
        paddingVertical: 9,
        paddingHorizontal: 28,
        borderRadius: 2,
        borderWidth: 1.5,
        borderColor: '#0d9488',
        backgroundColor: '#ffffff',
    },
    botaoVoltarTexto: {
        color: '#0d7c7b',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
