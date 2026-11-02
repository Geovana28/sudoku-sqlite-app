import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { autenticarUsuario, cadastrarUsuario } from '@/data/authService';

export default function LoginComponente() {
    const [isCadastro, setIsCadastro] = useState(false);
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    async function processarAcao() {
        if (usuario.trim() === '' || senha.trim() === '') {
            if (Platform.OS === 'web') {
                window.alert('Preencha o usuário e a senha!');
            } else {
                Alert.alert('Atenção', 'Preencha o usuário e a senha!');
            }
            return;
        }

        setCarregando(true);

        try {
            if (isCadastro) {
                const res = await cadastrarUsuario(usuario, senha);
                setCarregando(false);
                if (res.sucesso) {
                    router.replace('/inicial');
                } else {
                    if (Platform.OS === 'web') {
                        window.alert(res.mensagem);
                    } else {
                        Alert.alert('Aviso', res.mensagem);
                    }
                }
            } else {
                const res = await autenticarUsuario(usuario, senha);
                setCarregando(false);
                if (res.sucesso) {
                    router.replace('/inicial');
                } else {
                    if (Platform.OS === 'web') {
                        window.alert(res.mensagem);
                    } else {
                        Alert.alert('Acesso negado', res.mensagem);
                    }
                }
            }
        } catch {
            setCarregando(false);
            if (Platform.OS === 'web') {
                window.alert('Ocorreu um erro ao processar. Tente novamente.');
            } else {
                Alert.alert('Erro', 'Ocorreu um erro ao processar. Tente novamente.');
            }
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={styles.card}>
                        {/* Ícone estilizado em mini grid 3x3 de Sudoku */}
                        <View style={styles.miniGrid}>
                            <View style={styles.miniLinha}>
                                <View style={styles.miniBloco}><Text style={styles.miniNumero}>5</Text></View>
                                <View style={styles.miniBloco}><Text style={styles.miniNumero}>3</Text></View>
                                <View style={styles.miniBloco}><Text style={styles.miniNumeroVazio}>·</Text></View>
                            </View>
                            <View style={styles.miniLinha}>
                                <View style={styles.miniBloco}><Text style={styles.miniNumero}>6</Text></View>
                                <View style={[styles.miniBloco, styles.miniBlocoDestaque]}><Text style={styles.miniNumeroDestaque}>9</Text></View>
                                <View style={styles.miniBloco}><Text style={styles.miniNumero}>5</Text></View>
                            </View>
                            <View style={styles.miniLinha}>
                                <View style={styles.miniBloco}><Text style={styles.miniNumeroVazio}>·</Text></View>
                                <View style={styles.miniBloco}><Text style={styles.miniNumero}>8</Text></View>
                                <View style={styles.miniBloco}><Text style={styles.miniNumero}>1</Text></View>
                            </View>
                        </View>

                        <Text style={styles.titulo}>SUDOKU</Text>
                        <Text style={styles.subtitulo}>
                            {isCadastro ? 'Crie sua conta para salvar o progresso' : 'Acesse sua conta para jogar'}
                        </Text>

                        {/* Abas Alternadoras: Entrar vs Cadastrar */}
                        <View style={styles.abasContainer}>
                            <Pressable
                                style={[styles.aba, !isCadastro && styles.abaAtiva]}
                                onPress={() => setIsCadastro(false)}
                            >
                                <Text style={[styles.abaTexto, !isCadastro && styles.abaTextoAtivo]}>ENTRAR</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.aba, isCadastro && styles.abaAtiva]}
                                onPress={() => setIsCadastro(true)}
                            >
                                <Text style={[styles.abaTexto, isCadastro && styles.abaTextoAtivo]}>CRIAR CONTA</Text>
                            </Pressable>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>USUÁRIO</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Digite seu nome ou apelido"
                                placeholderTextColor="#94a3b8"
                                value={usuario}
                                onChangeText={setUsuario}
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>SENHA</Text>
                            <View style={styles.senhaWrapper}>
                                <TextInput
                                    style={styles.inputSenha}
                                    placeholder="Digite sua senha"
                                    placeholderTextColor="#94a3b8"
                                    value={senha}
                                    onChangeText={setSenha}
                                    secureTextEntry={!mostrarSenha}
                                    autoCapitalize="none"
                                />
                                <Pressable
                                    style={styles.botaoOlho}
                                    onPress={() => setMostrarSenha(prev => !prev)}
                                >
                                    <Text style={styles.botaoOlhoTexto}>{mostrarSenha ? '👁️' : '🔒'}</Text>
                                </Pressable>
                            </View>
                        </View>

                        <Pressable
                            style={[styles.botao, carregando && styles.botaoDesabilitado]}
                            onPress={processarAcao}
                            disabled={carregando}
                        >
                            <Text style={styles.botaoTexto}>
                                {carregando ? 'CARREGANDO...' : isCadastro ? 'CADASTRAR E ENTRAR' : 'ENTRAR'}
                            </Text>
                        </Pressable>

                        {/* Link de alternância rápida */}
                        <Pressable
                            style={styles.linkAlternar}
                            onPress={() => setIsCadastro(prev => !prev)}
                        >
                            <Text style={styles.linkAlternarTexto}>
                                {isCadastro
                                    ? 'Já tem uma conta? Clique para Entrar'
                                    : 'Ainda não tem conta? Clique para Criar'}
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f7f6',
    },
    keyboardContainer: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 32,
    },
    card: {
        width: '100%',
        maxWidth: 330,
        backgroundColor: '#ffffff',
        borderRadius: 4,
        paddingVertical: 24,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#0d9488',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
    },
    miniGrid: {
        width: 64,
        height: 64,
        borderWidth: 2,
        borderColor: '#0d9488',
        backgroundColor: '#f8fafc',
        marginBottom: 10,
    },
    miniLinha: {
        flex: 1,
        flexDirection: 'row',
    },
    miniBloco: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#cbd5e1',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    miniBlocoDestaque: {
        backgroundColor: '#ccfbf1',
    },
    miniNumero: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    miniNumeroDestaque: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#0d9488',
    },
    miniNumeroVazio: {
        fontSize: 11,
        color: '#94a3b8',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0d7c7b',
        letterSpacing: 3,
        marginBottom: 2,
    },
    subtitulo: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 16,
        textAlign: 'center',
    },
    abasContainer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#f1f5f9',
        borderRadius: 2,
        marginBottom: 14,
        padding: 2,
    },
    aba: {
        flex: 1,
        paddingVertical: 7,
        alignItems: 'center',
        borderRadius: 2,
    },
    abaAtiva: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#0d9488',
        elevation: 1,
    },
    abaTexto: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#64748b',
    },
    abaTextoAtivo: {
        color: '#0d7c7b',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 12,
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0d7c7b',
        letterSpacing: 1,
        marginBottom: 4,
    },
    input: {
        width: '100%',
        backgroundColor: '#f8fafc',
        color: '#0f172a',
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 2,
        fontSize: 14,
        borderWidth: 1.5,
        borderColor: '#cbd5e1',
    },
    senhaWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 2,
        borderWidth: 1.5,
        borderColor: '#cbd5e1',
    },
    inputSenha: {
        flex: 1,
        color: '#0f172a',
        paddingHorizontal: 12,
        paddingVertical: 9,
        fontSize: 14,
    },
    botaoOlho: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoOlhoTexto: {
        fontSize: 15,
    },
    botao: {
        width: '100%',
        backgroundColor: '#0d9488',
        paddingVertical: 12,
        borderRadius: 2,
        alignItems: 'center',
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#0f766e',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    botaoDesabilitado: {
        opacity: 0.6,
    },
    botaoTexto: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1.5,
    },
    linkAlternar: {
        marginTop: 14,
        padding: 4,
    },
    linkAlternarTexto: {
        fontSize: 11,
        color: '#0d7c7b',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
