import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Usuario {
    nome: string;
    senha: string;
}

const STORAGE_USERS_KEY = '@sudoku_usuarios';
const STORAGE_CURRENT_USER_KEY = '@sudoku_usuario_atual';

// Armazenamento em memória resiliente como fallback garantido
let memoriaUsuarios: Usuario[] = [
    { nome: 'jogador', senha: '1234' }
];
let memoriaUsuarioAtual: string | null = null;

// Obter todos os usuários cadastrados
export async function getUsuarios(): Promise<Usuario[]> {
    try {
        if (AsyncStorage && AsyncStorage.getItem) {
            const data = await AsyncStorage.getItem(STORAGE_USERS_KEY);
            if (data) {
                const parseados = JSON.parse(data);
                if (Array.isArray(parseados) && parseados.length > 0) {
                    memoriaUsuarios = parseados;
                    return parseados;
                }
            }
        }
    } catch (e) {
        console.warn('AsyncStorage get error:', e);
    }
    return memoriaUsuarios;
}

// Cadastrar um novo usuário
export async function cadastrarUsuario(nome: string, senha: string): Promise<{ sucesso: boolean; mensagem: string }> {
    const nomeFormatado = nome.trim();
    if (!nomeFormatado || !senha) {
        return { sucesso: false, mensagem: 'Preencha o usuário e a senha!' };
    }

    try {
        const usuarios = await getUsuarios();

        // Verificar se usuário já existe
        const jaExiste = usuarios.some(
            u => u.nome.toLowerCase() === nomeFormatado.toLowerCase()
        );

        if (jaExiste) {
            return { sucesso: false, mensagem: 'Este nome de usuário já está cadastrado!' };
        }

        const novosUsuarios = [...usuarios, { nome: nomeFormatado, senha }];
        memoriaUsuarios = novosUsuarios;
        memoriaUsuarioAtual = nomeFormatado;

        try {
            if (AsyncStorage && AsyncStorage.setItem) {
                await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(novosUsuarios));
                await AsyncStorage.setItem(STORAGE_CURRENT_USER_KEY, nomeFormatado);
            }
        } catch (storageError) {
            console.warn('AsyncStorage set error (fallback to memory):', storageError);
        }

        return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!' };
    } catch (e: any) {
        return { sucesso: false, mensagem: 'Erro ao processar: ' + (e?.message || 'Tente novamente') };
    }
}

// Autenticar / Fazer Login
export async function autenticarUsuario(nome: string, senha: string): Promise<{ sucesso: boolean; mensagem: string }> {
    const nomeFormatado = nome.trim();
    if (!nomeFormatado || !senha) {
        return { sucesso: false, mensagem: 'Informe o usuário e a senha!' };
    }

    try {
        const usuarios = await getUsuarios();

        const usuarioEncontrado = usuarios.find(
            u => u.nome.toLowerCase() === nomeFormatado.toLowerCase() && u.senha === senha
        );

        if (!usuarioEncontrado) {
            return { sucesso: false, mensagem: 'Usuário ou senha incorretos!' };
        }

        memoriaUsuarioAtual = usuarioEncontrado.nome;

        try {
            if (AsyncStorage && AsyncStorage.setItem) {
                await AsyncStorage.setItem(STORAGE_CURRENT_USER_KEY, usuarioEncontrado.nome);
            }
        } catch (storageError) {
            console.warn('AsyncStorage set error (fallback to memory):', storageError);
        }

        return { sucesso: true, mensagem: 'Login realizado!' };
    } catch (e: any) {
        return { sucesso: false, mensagem: 'Erro ao validar login.' };
    }
}

// Obter usuário logado no momento
export async function getUsuarioAtual(): Promise<string | null> {
    try {
        if (AsyncStorage && AsyncStorage.getItem) {
            const user = await AsyncStorage.getItem(STORAGE_CURRENT_USER_KEY);
            if (user) return user;
        }
    } catch {
        // Fallback
    }
    return memoriaUsuarioAtual || 'Jogador';
}

// Deslogar / Sair da conta
export async function deslogarUsuario(): Promise<void> {
    memoriaUsuarioAtual = null;
    try {
        if (AsyncStorage && AsyncStorage.removeItem) {
            await AsyncStorage.removeItem(STORAGE_CURRENT_USER_KEY);
        }
    } catch {}
}

// --- ESTATÍSTICAS E RECORDES ---

export interface EstatisticasUsuario {
    partidasJogadas: number;
    partidasVencidas: number;
    melhorTempoPorNivel: {
        Fácil?: { segundos: number; tempoFormatado: string };
        Médio?: { segundos: number; tempoFormatado: string };
        Difícil?: { segundos: number; tempoFormatado: string };
    };
    historicoRecente: Array<{
        nivel: string;
        resultado: 'vitória' | 'derrota';
        tempo: string;
        data: string;
    }>;
}

const STORAGE_STATS_KEY = '@sudoku_estatisticas_';

let memoriaStats: Record<string, EstatisticasUsuario> = {};

export async function getEstatisticasUsuario(nomeUsuario?: string): Promise<EstatisticasUsuario> {
    const usuario = nomeUsuario || (await getUsuarioAtual()) || 'Jogador';
    const chave = `${STORAGE_STATS_KEY}${usuario.toLowerCase()}`;

    try {
        if (AsyncStorage && AsyncStorage.getItem) {
            const data = await AsyncStorage.getItem(chave);
            if (data) {
                const parsed = JSON.parse(data);
                memoriaStats[usuario.toLowerCase()] = parsed;
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Erro ao carregar estatísticas:', e);
    }

    if (memoriaStats[usuario.toLowerCase()]) {
        return memoriaStats[usuario.toLowerCase()];
    }

    return {
        partidasJogadas: 0,
        partidasVencidas: 0,
        melhorTempoPorNivel: {},
        historicoRecente: [],
    };
}

export async function salvarResultadoPartida(
    nivel: 'Fácil' | 'Médio' | 'Difícil',
    vitoria: boolean,
    tempoFormatado: string,
    segundos: number
): Promise<void> {
    const usuario = (await getUsuarioAtual()) || 'Jogador';
    const stats = await getEstatisticasUsuario(usuario);

    stats.partidasJogadas += 1;
    if (vitoria) {
        stats.partidasVencidas += 1;
        const recordeAtual = stats.melhorTempoPorNivel[nivel];
        if (!recordeAtual || segundos < recordeAtual.segundos) {
            stats.melhorTempoPorNivel[nivel] = {
                segundos,
                tempoFormatado,
            };
        }
    }

    const agora = new Date();
    const dataFormatada = `${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')} ${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

    stats.historicoRecente.unshift({
        nivel,
        resultado: vitoria ? 'vitória' : 'derrota',
        tempo: tempoFormatado,
        data: dataFormatada,
    });

    if (stats.historicoRecente.length > 10) {
        stats.historicoRecente = stats.historicoRecente.slice(0, 10);
    }

    const userKey = usuario.toLowerCase();
    memoriaStats[userKey] = stats;

    try {
        if (AsyncStorage && AsyncStorage.setItem) {
            await AsyncStorage.setItem(`${STORAGE_STATS_KEY}${userKey}`, JSON.stringify(stats));
        }
    } catch (e) {
        console.warn('Erro ao salvar estatísticas no storage:', e);
    }
}

