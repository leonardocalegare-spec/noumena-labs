import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PhysicsEngine from './components/PhysicsEngine'

function App() {
  const [victory, setVictory] = useState(false);
  const [whatsapp, setWhatsapp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleVictory = useCallback(() => {
    setVictory(true);
    console.log("Victory Triggered!");
  }, []);

  const productAssets = useMemo(() => [
    'https://picsum.photos/id/1/200/200',
    'https://picsum.photos/id/2/200/200',
    'https://picsum.photos/id/3/200/200'
  ], []);

  const enviarLead = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validação: Remove caracteres não numéricos
    const cleanNumbers = whatsapp.replace(/\D/g, '');
    
    // Validação de formato brasileiro (10 ou 11 dígitos)
    if (cleanNumbers.length < 10 || cleanNumbers.length > 11) {
      setError('Insira um WhatsApp válido (10 ou 11 dígitos)');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://noumenalabs.app.n8n.cloud/webhook-test/captura-noumena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp: cleanNumbers,
          timestamp: new Date().toISOString(),
          origem: "Operação WhatsApp - Noumena Labs"
        })
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error('Falha na comunicação com o servidor');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
      console.error('Lead error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0a0a0b] flex flex-col items-center justify-center font-sans antialiased">
      <div className="relative w-full max-w-[450px] aspect-[9/16] bg-[#121214] border border-[#1f1f23] shadow-2xl overflow-hidden">
        <PhysicsEngine 
          onVictory={handleVictory} 
          assets={productAssets} 
        />
        
        <AnimatePresence>
          {victory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-50 p-8 text-center"
            >
              {!isSuccess ? (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-sm"
                >
                  <h1 className="text-[#00ff9d] text-4xl font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(0,255,157,0.4)] mb-2">
                    ESTABILIZADO
                  </h1>
                  <p className="text-white/60 mb-10 text-sm leading-relaxed">
                    A engine da Noumena Labs foi calibrada. <br/> 
                    Insira seu WhatsApp para liberar o acesso.
                  </p>

                  <form onSubmit={enviarLead} className="space-y-5">
                    <div className="relative">
                      <input 
                        type="tel" 
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="(00) 0 0000-0000"
                        className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#00ff9d] focus:ring-1 focus:ring-[#00ff9d]/20 transition-all`}
                        disabled={isLoading}
                      />
                      {error && (
                        <motion.p 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-red-500 text-[10px] mt-2 text-left absolute -bottom-5 left-1 uppercase font-bold tracking-widest"
                        >
                          {error}
                        </motion.p>
                      )}
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 mt-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 ${
                        isLoading 
                        ? 'bg-white/10 text-white/40 cursor-not-allowed opacity-50' 
                        : 'bg-[#00ff9d] text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(0,255,157,0.3)]'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                          DECODIFICANDO...
                        </>
                      ) : (
                        'RESGATAR ACESSO AGORA'
                      )}
                    </button>
                  </form>

                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-12 text-white/20 text-[10px] hover:text-white/40 transition-colors tracking-[0.2em] uppercase font-bold"
                  >
                    Reiniciar Simulação
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-[#00ff9d]/5 rounded-full flex items-center justify-center mb-8 border border-[#00ff9d]/20 shadow-[0_0_40px_rgba(0,255,157,0.1)]">
                    <motion.svg 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-12 h-12 text-[#00ff9d]" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </div>
                  <h2 className="text-[#00ff9d] text-3xl font-bold tracking-tight mb-3">ACESSO LIBERADO</h2>
                  <p className="text-white/60 text-sm max-w-[240px] leading-relaxed">
                    Verifique seu WhatsApp em instantes. Os dados estão sendo enviados.
                  </p>
                  
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-16 px-10 py-4 bg-white/5 text-white/40 text-[10px] rounded-2xl hover:bg-white/10 transition-all tracking-[0.2em] uppercase font-bold border border-white/5"
                  >
                    Voltar ao Início
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
