# Controle de Obras — RM Estruturas Pré-Fabricadas

App web (PWA) para controle financeiro de obras vendidas: valor da obra, parcelas
recebidas, valor de nota acordado e notas fiscais por fornecedor (com data e anexo
da NF). Funciona offline e pode ser instalado como aplicativo no celular.

Os dados ficam salvos **no próprio aparelho** (IndexedDB do navegador). Use os botões
**Backup** (exporta um `.json` com tudo, inclusive os anexos) e **Restaurar** para
mover os dados entre aparelhos ou guardar uma cópia de segurança.

## Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | O aplicativo (página principal) |
| `manifest.json` | Configuração do app instalável |
| `sw.js` | Service worker (offline) |
| `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` | Ícones do app |

> Mantenha todos os arquivos **na mesma pasta** do repositório.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `controle-de-obras`).
2. Envie **todos** os arquivos desta pasta para a raiz do repositório
   (botão **Add file → Upload files**, arraste tudo e confirme o commit).
3. No repositório, vá em **Settings → Pages**.
4. Em **Build and deployment → Source**, escolha **Deploy from a branch**.
5. Em **Branch**, selecione `main` e a pasta `/ (root)`. Clique em **Save**.
6. Aguarde ~1 minuto. O endereço aparece no topo da página, algo como:
   `https://SEU-USUARIO.github.io/controle-de-obras/`

Pronto. Abra o link no celular e, no menu do navegador, toque em
**Adicionar à tela de início / Instalar app**.

## Atualizando o app depois

Sempre que enviar uma versão nova do `index.html` (ou de qualquer arquivo),
abra o `sw.js` e troque a versão do cache:

```js
const CACHE = 'rm-obras-v1';   // mude para 'rm-obras-v2', 'v3', ...
```

Isso força os aparelhos já instalados a baixarem a versão atualizada na próxima
abertura. Sem isso, o navegador pode continuar servindo a versão antiga do cache.

## Observações

- Faça **Backup** antes de limpar dados do navegador ou trocar de celular —
  limpar os dados do site apaga as obras gravadas naquele aparelho.
- Anexos de NF têm limite de 8 MB por arquivo.
- As fontes (Archivo / JetBrains Mono) vêm do Google Fonts; offline o app usa as
  fontes do próprio sistema como reserva.
