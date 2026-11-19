# Pilates en Casa · Ximena Robles

Variação visual **Rosa Suave**. Área de alunas em espanhol mexicano: login só com telefone (+ nome opcional), painel com progresso,
3 módulos (Desafío 24 aulas, Estiramientos 3, Fortalecimiento 3), página da aula com vídeo do
YouTube não listado, marcar como concluída, avaliação por estrelas e aviso de pagamento com link
de checkout.

**Stack:** React 19 + Vite + TypeScript · React Router · Supabase (Postgres) · Vercel.

## Onde editar

| O quê | Arquivo |
|---|---|
| Nome, título, frase do topo | `src/config.ts` → `BRAND` |
| IDs dos vídeos do YouTube | `src/config.ts` → `MODULES` (campo `youtube`) |
| Textos do aviso de pagamento | `src/config.ts` → `CHECKOUT` |
| Cores e fontes | `src/index.css` (`:root`) |

O ID do YouTube é o trecho depois de `youtu.be/` ou `watch?v=`. Aula sem ID mostra
"Video disponible pronto".

## Variáveis de ambiente (Vercel → Settings → Environment Variables)

| Variável | Valor |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API Keys → **Publishable key** (`sb_publishable_...`). Nunca use a secret key |
| `VITE_CHECKOUT_URL` | Link do checkout. Vazio = esconde o aviso de pagamento |

Sem as variáveis do Supabase o site funciona, mas o progresso fica só no navegador da aluna
e os telefones não são salvos.

## Supabase (uma vez)

1. Crie o projeto em supabase.com (plano grátis).
2. SQL Editor → cole o conteúdo de `supabase/schema.sql` → Run.
3. Os cadastros aparecem em Table Editor → `alumnas`; o resumo por aluna na view
   `resumen_alumnas`.

As tabelas ficam fechadas para o navegador: o site só chama as funções
`registrar_alumna`, `mi_progreso`, `guardar_clase` e `registrar_vista`.

## Rodar localmente

```bash
npm install
cp .env.example .env   # preencha os valores
npm run dev
```
