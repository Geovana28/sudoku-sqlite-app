import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { cadastrarDesafio } from '@/data/desafiosDatabase';

export default function CadastroDesafioTela() {
    const [titulo, setTitulo] = useState('');
    const [dificuldade, setDificuldade] = useState<'Fácil' | 'Médio' | 'Difícil'>('Fácil');
    const [categoria, setCategoria] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dicas, setDicas] = useState('');
    const [autor, setAutor] = useState('');
    const [salvando, setSalvando] = useState(false);

    async function handleSalvar() {
        if (!titulo.trim()) {
            Alert.alert('Atenção', 'Por favor, informe o título do desafio.');
            return;
        }
        if (!categoria.trim()) {
            Alert.alert('Atenção', 'Por favor, informe a categoria/estratégia.');
            return;
        }
        if (!descricao.trim()) {
            Alert.alert('Atenção', 'Por favor, informe a descrição do desafio.');
            return;
        }

        try {
            setSalvando(true);
            await cadastrarDesafio({
                titulo: titulo.trim(),
                dificuldade,
                categoria: categoria.trim(),
                descricao: descricao.trim(),
                dicas: dicas.trim() || 'Nenhuma dica específica informada.',
                autor: autor.trim() || 'Anônimo'
            });

            Alert.alert('Sucesso!', 'Desafio cadastrado no SQLite com sucesso!', [
                {
                    text: 'Ir para a Lista',
                    onPress: () => router.push('/lista-desafios')
                }
            ]);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível cadastrar o desafio no banco SQLite.');
        } finally {
            setSalvando(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                {/* Cabeçalho */}
                <View style={styles.topo}>
                    <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.back()} activeOpacity={0.7}>
                        <Text style={styles.botaoVoltarTexto}>← Voltar</Text>
                    </TouchableOpacity>
                    <Text style={styles.tituloTopo}>Cadastrar no SQLite</Text>
                    <View style={{ width: 60 }} />
                </View>

                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.cardForm}>
                        <Text style={styles.instrucoes}>
                            Cadastre um novo desafio, problema ou técnica de Sudoku no banco de dados SQLite local.
                        </Text>

                        {/* Título */}
                        <Text style={styles.label}>Título do Desafio *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Quebra-Cabeça da Diagonal Oculta"
                            placeholderTextColor="#94a3b8"
                            value={titulo}
                            onChangeText={setTitulo}
                        />

                        {/* Dificuldade */}
                        <Text style={styles.label}>Nível de Dificuldade</Text>
                        <View style={styles.botoesDificuldade}>
                            {(['Fácil', 'Médio', 'Difícil'] as const).map((nivel) => (
                                <TouchableOpacity
                                    key={nivel}
                                    activeOpacity={0.8}
                                    style={[
                                        styles.opcaoDificuldade,
                                        dificuldade === nivel && styles.opcaoDificuldadeAtiva,
                                        nivel === 'Fácil' && dificuldade === nivel && { backgroundColor: '#0d9488' },
                                        nivel === 'Médio' && dificuldade === nivel && { backgroundColor: '#0c7068' },
                                        nivel === 'Difícil' && dificuldade === nivel && { backgroundColor: '#0c524c' },
                                    ]}
                                    onPress={() => setDificuldade(nivel)}
                                >
                                    <Text
                                        style={[
                                            styles.opcaoDificuldadeTexto,
                                            dificuldade === nivel && styles.opcaoDificuldadeTextoAtivo
                                        ]}
                                    >
                                        {nivel}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Categoria */}
                        <Text style={styles.label}>Categoria / Técnica *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Eliminação Cruzada, X-Wing, Par Oculto"
                            placeholderTextColor="#94a3b8"
                            value={categoria}
                            onChangeText={setCategoria}
                        />

                        {/* Descrição */}
                        <Text style={styles.label}>Descrição do Cenário *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Descreva a regra do desafio ou configuração de números..."
                            placeholderTextColor="#94a3b8"
                            value={descricao}
                            onChangeText={setDescricao}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        {/* Dicas */}
                        <Text style={styles.label}>Dicas de Resolução</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ex: Observe a linha 3 e o quadrante 2 antes de avançar."
                            placeholderTextColor="#94a3b8"
                            value={dicas}
                            onChangeText={setDicas}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                        />

                        {/* Autor */}
                        <Text style={styles.label}>Autor / Criador</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Seu nome ou apelido de jogador"
                            placeholderTextColor="#94a3b8"
                            value={autor}
                            onChangeText={setAutor}
                        />

                        {/* Botão de Salvar */}
                        <TouchableOpacity
                            style={[styles.botaoSalvar, salvando && { opacity: 0.6 }]}
                            onPress={handleSalvar}
                            disabled={salvando}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.botaoSalvarTexto}>
                                {salvando ? 'Salvando no SQLite...' : '💾 Salvar no SQLite'}
                            </Text>
                        </TouchableOpacity>

                        {/* Atalho para Lista */}
                        <TouchableOpacity
                            style={styles.botaoVerLista}
                            onPress={() => router.push('/lista-desafios')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.botaoVerListaTexto}>📋 Ver Lista de Cadastros</Text>
                        </TouchableOpacity>
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
    scroll: {
        padding: 16,
        paddingBottom: 40,
    },
    cardForm: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1.5,
        borderColor: '#0d9488',
        shadowColor: '#0c4a60',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    instrucoes: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 16,
        lineHeight: 18,
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1.5,
        borderColor: '#cbd5e1',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1e293b',
    },
    textArea: {
        minHeight: 80,
    },
    botoesDificuldade: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 6,
    },
    opcaoDificuldade: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1.5,
        borderColor: '#cbd5e1',
        backgroundColor: '#f8fafc',
    },
    opcaoDificuldadeAtiva: {
        borderColor: 'transparent',
    },
    opcaoDificuldadeTexto: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#64748b',
    },
    opcaoDificuldadeTextoAtivo: {
        color: '#ffffff',
    },
    botaoSalvar: {
        backgroundColor: '#0d9488',
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 22,
        shadowColor: '#0d9488',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    botaoSalvarTexto: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    botaoVerLista: {
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1.5,
        borderColor: '#0d9488',
    },
    botaoVerListaTexto: {
        color: '#0d7c7b',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

