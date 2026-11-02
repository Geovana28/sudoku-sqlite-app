import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export interface DesafioSudoku {
    id: number;
    titulo: string;
    dificuldade: 'Fácil' | 'Médio' | 'Difícil';
    categoria: string;
    descricao: string;
    dicas: string;
    autor: string;
    criadoEm: string;
}

let dbInstance: any = null;

// Fallback em memória para garantir compatibilidade se executado na web
let fallbackDesafios: DesafioSudoku[] = [
    {
        id: 1,
        titulo: 'Dominando o Quadrante Central',
        dificuldade: 'Fácil',
        categoria: 'Estratégia Básica',
        descricao: 'Exercício prático focado em escanear linhas e colunas para deduzir o centro sem margem para erro.',
        dicas: 'Olhe para as linhas 4, 5 e 6. Identifique quais números de 1 a 9 já foram usados no quadrante.',
        autor: 'Prof. Sudoku',
        criadoEm: '2026-11-01 10:00'
    },
    {
        id: 2,
        titulo: 'Técnica do Par Oculto (Hidden Pair)',
        dificuldade: 'Médio',
        categoria: 'Técnicas Avançadas',
        descricao: 'Quando duas células em um mesmo bloco ou linha só podem conter os mesmos dois números.',
        dicas: 'Se apenas duas células podem receber 3 e 7, todos os outros candidatos dessas células são descartados.',
        autor: 'Mestre dos Números',
        criadoEm: '2026-11-01 11:30'
    },
    {
        id: 3,
        titulo: 'O Padrão X-Wing',
        dificuldade: 'Difícil',
        categoria: 'Mestrado em Sudoku',
        descricao: 'Identifique quatro células formando um retângulo perfeito com o mesmo candidato para eliminar opções na coluna.',
        dicas: 'Requer atenção máxima nas linhas paralelas onde um número só cabe em duas posições idênticas.',
        autor: 'Grande Mestre',
        criadoEm: '2026-11-01 14:15'
    }
];

export async function getDatabase() {
    if (Platform.OS === 'web') {
        return null;
    }
    if (!dbInstance) {
        dbInstance = await SQLite.openDatabaseAsync('sudoku_desafios.db');
        await dbInstance.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS desafios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                dificuldade TEXT NOT NULL,
                categoria TEXT NOT NULL,
                descricao TEXT NOT NULL,
                dicas TEXT NOT NULL,
                autor TEXT NOT NULL,
                criadoEm TEXT NOT NULL
            );
        `);

        // Inserir dados iniciais caso a tabela esteja vazia
        const countResult = (await dbInstance.getFirstAsync('SELECT count(*) as total FROM desafios;')) as { total: number } | null;
        if (countResult && countResult.total === 0) {
            for (const item of fallbackDesafios) {
                await dbInstance.runAsync(
                    'INSERT INTO desafios (titulo, dificuldade, categoria, descricao, dicas, autor, criadoEm) VALUES (?, ?, ?, ?, ?, ?, ?);',
                    [item.titulo, item.dificuldade, item.categoria, item.descricao, item.dicas, item.autor, item.criadoEm]
                );
            }
        }
    }
    return dbInstance;
}

// 1. Cadastrar novo Desafio / Anotação de Sudoku
export async function cadastrarDesafio(desafio: Omit<DesafioSudoku, 'id' | 'criadoEm'>): Promise<number> {
    const agora = new Date();
    const criadoEm = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-${String(agora.getDate()).padStart(2, '0')} ${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;

    try {
        const db = await getDatabase();
        if (db) {
            const result = await db.runAsync(
                'INSERT INTO desafios (titulo, dificuldade, categoria, descricao, dicas, autor, criadoEm) VALUES (?, ?, ?, ?, ?, ?, ?);',
                [desafio.titulo, desafio.dificuldade, desafio.categoria, desafio.descricao, desafio.dicas, desafio.autor, criadoEm]
            );
            return result.lastInsertRowId;
        }
    } catch (e) {
        console.warn('Erro ao inserir no SQLite, utilizando memória:', e);
    }

    const novoId = fallbackDesafios.length > 0 ? Math.max(...fallbackDesafios.map(d => d.id)) + 1 : 1;
    const novoDesafio: DesafioSudoku = {
        id: novoId,
        ...desafio,
        criadoEm
    };
    fallbackDesafios.unshift(novoDesafio);
    return novoId;
}

// 2. Listar Desafios
export async function listarDesafios(): Promise<DesafioSudoku[]> {
    try {
        const db = await getDatabase();
        if (db) {
            const rows = (await db.getAllAsync('SELECT * FROM desafios ORDER BY id DESC;')) as DesafioSudoku[];
            return rows;
        }
    } catch (e) {
        console.warn('Erro ao listar do SQLite, utilizando memória:', e);
    }
    return fallbackDesafios;
}

// 3. Obter Detalhes de um Desafio por ID
export async function obterDesafioPorId(id: number): Promise<DesafioSudoku | null> {
    try {
        const db = await getDatabase();
        if (db) {
            const row = (await db.getFirstAsync('SELECT * FROM desafios WHERE id = ?;', [id])) as DesafioSudoku | null;
            return row || null;
        }
    } catch (e) {
        console.warn('Erro ao buscar desafio por ID no SQLite:', e);
    }
    const achado = fallbackDesafios.find(d => d.id === id);
    return achado || null;
}

// 4. Deletar Desafio
export async function excluirDesafio(id: number): Promise<void> {
    try {
        const db = await getDatabase();
        if (db) {
            await db.runAsync('DELETE FROM desafios WHERE id = ?;', [id]);
            return;
        }
    } catch (e) {
        console.warn('Erro ao excluir no SQLite:', e);
    }
    fallbackDesafios = fallbackDesafios.filter(d => d.id !== id);
}
