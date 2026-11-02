# 🧩 Sudoku App com SQLite

Aplicativo móvel desenvolvido em **React Native** com **Expo** e **Expo Router**, focado em um jogo de Sudoku completo com sistema de autenticação, níveis de dificuldade e gerenciamento local de desafios e estratégias utilizando **SQLite** (`expo-sqlite`).

---

## 📱 Funcionalidades Principais

### 1. 🗄️ Persistência com SQLite (CRUD Completo)
- **Cadastro (`/cadastro-desafio`)**: Permite cadastrar novos desafios, anotações e estratégias de Sudoku no banco de dados local `sudoku_desafios.db` com:
  - Título do desafio
  - Nível de dificuldade (Fácil, Médio, Difícil)
  - Categoria / Técnica (ex: X-Wing, Par Oculto, Eliminação Cruzada)
  - Descrição do cenário
  - Dicas de resolução
  - Autor e data de criação
- **Lista (`/lista-desafios`)**: Listagem reativa com `FlatList`, badges visuais de nível, suporte a pull-to-refresh e opção de exclusão rápida.
- **Detalhes (`/detalhe-desafio`)**: Visualização completa de cada registro pelo ID, com atalho direto para jogar a partida correspondente.

### 2. 🎮 Jogo de Sudoku
- Tabuleiro interativo de 9x9 com validação em tempo real de linhas, colunas e quadrantes 3x3.
- Três modos de dificuldade:
  - **Fácil**: até 5 erros tolerados.
  - **Médio**: até 3 erros tolerados.
  - **Difícil**: apenas 1 erro tolerado.
- Cronômetro ativo e histórico de vitórias/derrotas por jogador.

### 3. 👤 Autenticação e Estatísticas
- Sistema de login e cadastro de usuários locais.
- Registro de recordes pessoais (melhores tempos por dificuldade) e histórico recente de partidas.

---

## 🛠️ Tecnologias e Componentes Utilizados

- **[React Native](https://reactnative.dev/)** & **[Expo SDK 57](https://expo.dev/)**
- **[Expo Router](https://docs.expo.dev/router/introduction/)** (Navegação baseada em arquivos na pasta `src/app`)
- **[expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)** (Banco de dados relacional SQLite local assíncrono)
- **Componentes Nativos:**
  - `useState` e Hooks do React para gerenciamento de estado reativo
  - `View`, `Text`, `TextInput`, `ScrollView`, `FlatList`
  - `TouchableOpacity` para feedback tátil com opacidade (`activeOpacity`)
  - `StyleSheet` para organização de estilos visuais
  - `StatusBar` para controle da barra de status

---

## 📁 Estrutura do Projeto

```text
├── assets/                  # Imagens e ícones
├── src/
│   ├── app/                 # Rotas e telas do Expo Router
│   │   ├── _layout.tsx      # Configuração global de navegação e StatusBar
│   │   ├── index.tsx        # Redirecionamento inicial
│   │   ├── login.tsx        # Tela de login/autenticação
│   │   ├── inicial.tsx      # Menu principal e seleção de modos
│   │   ├── nivelfacil.tsx   # Partida no nível Fácil
│   │   ├── nivelmedio.tsx   # Partida no nível Médio
│   │   ├── niveldificil.tsx # Partida no nível Difícil
│   │   ├── cadastro-desafio.tsx # Cadastro no SQLite
│   │   ├── lista-desafios.tsx   # Lista de registros do SQLite
│   │   ├── detalhe-desafio.tsx  # Tela de detalhes do SQLite
│   │   ├── telafinalganhou.tsx
│   │   └── telafinalperdeu.tsx
│   ├── components/          # Componentes reutilizáveis de interface
│   └── data/                # Camada de banco de dados e serviços
│       ├── desafiosDatabase.ts # Inicialização do SQLite e operações CRUD
│       ├── authService.ts      # Autenticação e persistência de dados do usuário
│       └── sudokuNiveis.ts     # Puzzles e gabaritos dos tabuleiros
├── package.json
└── tsconfig.json
```

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Geovana28/sudoku-sqlite-app.git
   cd sudoku-sqlite-app
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npx expo start
   ```

4. **Abra no dispositivo móvel:**
   - Escaneie o QR Code exibido no terminal utilizando o aplicativo **Expo Go** no Android ou a Câmera no iOS.
   - Ou pressione `a` para rodar no emulador Android, ou `w` para rodar na web.

---

## 👩‍💻 Autora

Desenvolvido por **Geovana** para a disciplina de Desenvolvimento Mobile.
