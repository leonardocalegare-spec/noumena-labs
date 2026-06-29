# Noumena Labs - Playable Ad Engine

Um motor de **Playable Ads B2B** construído com React e Matter.js, desenhado com uma estética *Premium SaaS Dark* focada em alta conversão. O objetivo interativo do usuário é empilhar os elementos na tela até estabilizar o motor de física para desbloquear o acesso, gerando engajamento e capturando o lead no momento de pico de atenção.

---

## 🚀 Tecnologias Utilizadas

- **React 19** + **Vite**: Base de alta performance e componentização.
- **Matter.js**: Motor de física 2D poderoso para a simulação de gravidade e colisões.
- **Tailwind CSS v4**: Estilização rápida e responsiva com estética Dark e toques Neon (`#00ff9d`).
- **Framer Motion**: Animações fluidas de entrada, saída e micro-interações no fluxo de lead.
- **Integração n8n**: Webhook de captura de leads preparado para produção.

## ✨ Funcionalidades Principais

- 🎮 **Simulação Física Estável**: Arquitetura baseada em **Coordenadas Lógicas (600x1067 / Aspect Ratio 9:16)**. Isso garante proporções precisas e comportamento físico previsível (caixas caindo de forma realista), independentemente do tamanho da tela, resolução do dispositivo ou taxa de atualização de pixels.
- 🎨 **Estética Premium B2B**: Otimizado para campanhas. Usa glassmorphism, contornos em glow neon (`shadowBlur` no Canvas) e um layout minimalista que eleva a percepção de valor.
- 🏆 **Algoritmo de Vitória Automática**: O sistema monitora constantemente a estabilidade vetorial das caixas. Quando 5 itens são empilhados com sucesso e perdem velocidade angular e linear, a tela de vitória é ativada suavemente.
- 📱 **Captura de Lead High-End**: Após a vitória, um modal elegante captura o WhatsApp do usuário (validação de formato br-number, remoção de máscaras e feedback de loading state) e envia o lead perfeitamente sanitizado para o webhook.
- ⚡ **Resiliência de Renderização**: Carregamento assíncrono de texturas (assets). Caso os servidores de imagem falhem, a Engine implementa fallbacks procedurais nativos da Canvas API desenhando as caixas para que a interação nunca pare ou fique invisível.

## 📦 Estrutura Principal

- **`src/App.jsx`**: Gerencia o estado global (Início, Vitória, Loading, Sucesso), orquestra a UI do formulário de captura e contém a lógica de disparo assíncrono do Webhook de leads (`enviarLead`).
- **`src/components/PhysicsEngine.jsx`**: O "coração" interativo. Gerencia o ciclo de vida do Canvas, usa `ResizeObserver` para detecção exata do DOM, faz a instanciação do `Matter.js` e executa o loop customizado (`afterRender` hook para o efeito Neon sobreponto as texturas físicas).

## 🛠️ Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/noumena-labs.git
   ```

2. **Instale as dependências:**
   Navegue até a pasta do projeto e instale as dependências usando NPM.
   ```bash
   cd noumena-labs
   npm install
   ```

3. **Rode o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   O terminal exibirá a URL local (geralmente `http://localhost:5173`).

## 🔗 Configuração do Webhook de Leads

No `App.jsx`, o disparo de requisições acontece no método `enviarLead`.
Para receber os leads corretamente, configure seu workflow na **n8n**, Make, Zapier ou em seu backend para escutar requisições **POST**.

O payload JSON enviado tem o seguinte formato:
```json
{
  "whatsapp": "11999999999",
  "timestamp": "2026-04-22T12:00:00.000Z",
  "origem": "Operação WhatsApp - Noumena Labs"
}
```

> **Aviso de Produção (CORS):** Garanta que sua plataforma de automação/webhook (ex: n8n) possua suporte de configuração CORS aberto ou whitelist do domínio frontend da Vercel (`https://noumena-labs.vercel.app`), caso contrário as requisições POST do navegador podem ser bloqueadas.

## 📄 Deployment

O projeto está 100% configurado para a Vercel. 
Basta importar o repositório na dashboard da Vercel, o script `npm run build` do Vite será detectado automaticamente e processará as dependências nativas para a cloud.

## 📄 Licença

Este projeto é de uso exclusivo para as operações de Playable Ads da Noumena Labs.
