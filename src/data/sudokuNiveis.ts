// Gerador e Validador Dinâmico de Sudoku

export type Dificuldade = 'Fácil' | 'Médio' | 'Difícil';

export interface TabuleiroData {
    solucao: number[][];
    inicial: number[][];
    maxErros: number;
}

// Verifica se um número pode ser colocado na posição (linha, col)
function podeColocar(tabuleiro: number[][], linha: number, col: number, num: number): boolean {
    // Linha e Coluna
    for (let i = 0; i < 9; i++) {
        if (tabuleiro[linha][i] === num || tabuleiro[i][col] === num) {
            return false;
        }
    }

    // Bloco 3x3
    const inicioLinha = Math.floor(linha / 3) * 3;
    const inicioCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (tabuleiro[inicioLinha + r][inicioCol + c] === num) {
                return false;
            }
        }
    }

    return true;
}

// Embaralha um array (Fisher-Yates)
function embaralhar<T>(array: T[]): T[] {
    const copiado = [...array];
    for (let i = copiado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copiado[i], copiado[j]] = [copiado[j], copiado[i]];
    }
    return copiado;
}

// Resolve/Preenche o tabuleiro recursivamente com backtracking aleatório
function preencherTabuleiro(tabuleiro: number[][]): boolean {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (tabuleiro[r][c] === 0) {
                const numeros = embaralhar([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (const num of numeros) {
                    if (podeColocar(tabuleiro, r, c, num)) {
                        tabuleiro[r][c] = num;
                        if (preencherTabuleiro(tabuleiro)) {
                            return true;
                        }
                        tabuleiro[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Gera um tabuleiro de Sudoku completo e válido
export function gerarSudokuCompleto(): number[][] {
    const tabuleiro: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
    preencherTabuleiro(tabuleiro);
    return tabuleiro;
}

// Gera o jogo sorteando as casas a serem reveladas conforme a dificuldade
export function gerarJogoPorNivel(nivel: Dificuldade): TabuleiroData {
    // 1. Gera uma solução completa válida e única para esta partida
    const solucao = gerarSudokuCompleto();

    // 2. Define a quantidade de pistas reveladas e o limite de erros
    let pistas: number;
    let maxErros: number;

    switch (nivel) {
        case 'Fácil':
            // 38 a 42 pistas sorteadas
            pistas = 38 + Math.floor(Math.random() * 5);
            maxErros = 5;
            break;
        case 'Médio':
            // 31 a 34 pistas sorteadas
            pistas = 31 + Math.floor(Math.random() * 4);
            maxErros = 3;
            break;
        case 'Difícil':
        default:
            // 25 a 28 pistas sorteadas
            pistas = 25 + Math.floor(Math.random() * 4);
            maxErros = 1;
            break;
    }

    // 3. Clona a solução para preparar o tabuleiro inicial do jogador
    const inicial: number[][] = solucao.map(linha => [...linha]);

    // 4. Cria todas as 81 posições e as embaralha para sortear as vazias
    const posicoes: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            posicoes.push([r, c]);
        }
    }
    const posicoesEmbaralhadas = embaralhar(posicoes);

    // Quantidade de casas que ficarão vazias (com 0)
    const casasOcultar = 81 - pistas;

    for (let i = 0; i < casasOcultar; i++) {
        const [r, c] = posicoesEmbaralhadas[i];
        inicial[r][c] = 0;
    }

    return {
        solucao,
        inicial,
        maxErros,
    };
}
