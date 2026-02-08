# Projeto: CEITEC Eventos - Refinamento e Estabilização

## 🎯 Visão Geral
Este plano visa estabilizar o codebase atual, removendo conflitos de GIT, e implementar as melhorias solicitadas: renomeação da marca para "CEITEC Eventos", sistema de autenticação e proteção do painel administrativo.

## 🛠️ Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend/Auth**: Supabase
- **IA**: Google Gemini API

## 📋 Critérios de Sucesso
- [ ] Aplicativo carrega sem erros de sintaxe (remoção dos merge markers).
- [ ] Nome "CEITEC Eventos" exibido em toda a interface.
- [ ] Painel Admin acessível apenas após 5 toques no ícone (com feedback tátil/visual).
- [ ] Sistema de Login funcional integrado ao Supabase.

## 🗂️ Estrutura de Arquivos (Referência)
- `App.tsx`: Orquestrador principal (CORE).
- `components/AdminScreen.tsx`: Painel de controle.
- `components/HomeScreen.tsx`: Lista de eventos.
- `components/LoginScreen.tsx`: Autenticação.

---

## 🏗️ Tarefas e Atribuições

### Fase 1: Análise e Estabilização (P0)
- **T1: Limpar Conflitos de GIT**
  - **Agente**: `orchestrator`
  - **Ação**: Remover `<<<<<<< HEAD`, `=======` e `>>>>>>>` do `App.tsx`. Escolher a lógica de autenticação integrada.
  - **Verify**: App volta a renderizar localmente.
- **T2: Auditoria de Marca (CEITEC)**
  - **Agente**: `frontend-specialist`
  - **Ação**: Buscar todas as instâncias de "CIETEC" e substituir por "CEITEC" em componentes e constantes.
  - **Verify**: `constants.tsx` e UI atualizados.

### Fase 2: Implementação de Funcionalidades (P1)
- **T3: Refinar Acesso Admin Oculto**
  - **Agente**: `frontend-specialist`
  - **Ação**: Implementar lógica de 5 toques no logo com feedback visual sutil (efeito de "balanço" ou opacidade).
  - **Verify**: O acesso ao admin só ocorre no quinto toque consecutivo.
- **T4: Fluxo de Autenticação Supabase**
  - **Agente**: `backend-specialist`
  - **Ação**: Garantir que o `LoginScreen` use o fluxo de sessão do Supabase corretamente e redirecione para o evento após login.
  - **Verify**: Usuário consegue logar e deslogar.

### Fase 3: UI/UX Pro Max (P2)
- **T5: Design Premium dos Cards de Eventos**
  - **Agente**: `frontend-specialist`
  - **Ação**: Aplicar glassmorphism e micro-animações nos cards da `HomeScreen`.
  - **Verify**: UI visualmente impactante e fluida.

---

## ✅ PHASE X: Verificação Final
- [ ] `npm run build` sem erros.
- [ ] Varredura de segurança (`security_scan.py`).
- [ ] Auditoria de UX (`ux_audit.py`).

## 🤖 Agentes Recém-Instalados em Uso
- `frontend-specialist`: UI, UX e Marca.
- `backend-specialist`: Supabase Auth.
- `orchestrator`: Estabilização e Conflitos.

---
**Status atual**: Aguardando início da Fase 1.
