import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

/**
 * PhysicsEngine Component - Noumena Labs
 * Versão de Alta Eficiência | Correção de Renderização e Lógica de Vitória
 */
const PhysicsEngine = ({ onVictory, assets = [] }) => {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const [currentBoxCount, setCurrentBoxCount] = useState(0);
  const boxesRef = useRef([]);
  const isVictoryRef = useRef(false);
  const stabilityTimerRef = useRef(null);
  const assetScalesRef = useRef({});
  
  // Coordenadas Lógicas
  const logicalWidth = 600;
  const logicalHeight = 1067; 
  const boxSize = 70;

  // 1. Pré-carregamento com Fallback Seguro
  useEffect(() => {
    assets.forEach(url => {
      if (assetScalesRef.current[url]) return;
      const img = new Image();
      img.src = url;
      img.onload = () => {
        assetScalesRef.current[url] = {
          x: boxSize / img.width,
          y: boxSize / img.height
        };
      };
      img.onerror = () => {
        console.warn(`Asset failed: ${url}. Using procedural fallback.`);
      };
    });
  }, [assets]);

  // 2. Ciclo de Vida do Motor de Física
  useEffect(() => {
    if (!containerRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;
    
    // Limpeza Total antes do Início
    isVictoryRef.current = false;
    boxesRef.current = [];
    setCurrentBoxCount(0);
    if (stabilityTimerRef.current) {
      clearTimeout(stabilityTimerRef.current);
      stabilityTimerRef.current = null;
    }

    const engine = Engine.create();
    engine.gravity.y = 1.3;
    engineRef.current = engine;

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: logicalWidth,
        height: logicalHeight,
        wireframes: false,
        background: '#0a0a0b',
        pixelRatio: window.devicePixelRatio || 1
      }
    });
    renderRef.current = render;

    // Estilização do Canvas
    const canvas = render.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.objectFit = 'contain';

    // Hook de Renderização Customizada (Glow Neon)
    Events.on(render, 'afterRender', () => {
      const { context } = render;
      if (!context) return;
      
      context.save();
      // Desenha o chão visível
      context.fillStyle = '#121214';
      context.fillRect(0, logicalHeight - 40, logicalWidth, 40);
      context.strokeStyle = '#1f1f23';
      context.lineWidth = 1;
      context.strokeRect(0, logicalHeight - 40, logicalWidth, 40);

      // Desenha contornos neon das caixas
      boxesRef.current.forEach(box => {
        const { vertices } = box;
        if (!vertices || vertices.length === 0) return;
        
        context.beginPath();
        context.moveTo(vertices[0].x, vertices[0].y);
        for (let j = 1; j < vertices.length; j++) context.lineTo(vertices[j].x, vertices[j].y);
        context.closePath();
        
        context.lineWidth = 3;
        context.strokeStyle = '#00ff9d';
        context.shadowBlur = 10;
        context.shadowColor = '#00ff9d';
        context.stroke();
      });
      context.restore();
    });

    // Barreiras Físicas
    const ground = Bodies.rectangle(logicalWidth / 2, logicalHeight - 20, logicalWidth, 40, { 
      isStatic: true, 
      render: { visible: false } 
    });
    const leftWall = Bodies.rectangle(-20, logicalHeight / 2, 40, logicalHeight, { isStatic: true });
    const rightWall = Bodies.rectangle(logicalWidth + 20, logicalHeight / 2, 40, logicalHeight, { isStatic: true });
    
    Composite.add(engine.world, [ground, leftWall, rightWall]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);
    runnerRef.current = runner;

    // Lógica de Vitória Robusta
    const checkVictory = () => {
      // Bloqueio: Nunca avalia vitória com menos de 5 caixas
      if (isVictoryRef.current || boxesRef.current.length < 5) return;

      const stableBoxes = boxesRef.current.filter(box => {
        return box.speed < 0.2 && box.angularSpeed < 0.02;
      });

      if (stableBoxes.length >= 5) {
        if (!stabilityTimerRef.current) {
          stabilityTimerRef.current = setTimeout(() => {
            // Re-verifica após 2s
            const confirmed = boxesRef.current.filter(box => box.speed < 0.2 && box.angularSpeed < 0.02).length;
            if (confirmed >= 5) {
              isVictoryRef.current = true;
              if (onVictory) onVictory();
              Runner.stop(runner);
            } else {
              stabilityTimerRef.current = null;
            }
          }, 2000);
        }
      } else if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
        stabilityTimerRef.current = null;
      }
    };

    Events.on(engine, 'afterUpdate', checkVictory);

    return () => {
      Events.off(engine, 'afterUpdate', checkVictory);
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      canvas.remove();
      if (stabilityTimerRef.current) clearTimeout(stabilityTimerRef.current);
    };
  }, [onVictory]);

  const handleInteraction = (e) => {
    if (isVictoryRef.current || !engineRef.current) return;

    const { Bodies, Composite } = Matter;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = logicalWidth / rect.width;
    const x = (e.clientX - rect.left) * scaleX;
    
    // Escolha de Asset ou Fallback
    const asset = assets.length > 0 ? assets[Math.floor(Math.random() * assets.length)] : null;
    const scale = asset ? (assetScalesRef.current[asset] || { x: 1, y: 1 }) : { x: 1, y: 1 };

    const box = Bodies.rectangle(x, 100, boxSize, boxSize, {
      restitution: 0.3,
      friction: 0.8,
      render: asset ? {
        sprite: { texture: asset, xScale: scale.x, yScale: scale.y }
      } : {
        fillStyle: '#121214',
        strokeStyle: '#00ff9d',
        lineWidth: 2
      }
    });

    // Força o contorno verde mesmo se tiver sprite
    box.render.strokeStyle = '#00ff9d';
    box.render.lineWidth = 2;

    boxesRef.current.push(box);
    setCurrentBoxCount(prev => prev + 1);
    Composite.add(engineRef.current.world, box);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-[#0a0a0b] touch-none cursor-pointer flex items-center justify-center overflow-hidden"
      onPointerDown={handleInteraction}
    >
      {/* UI de Status - Útil para diagnóstico na tela */}
      <div className="absolute top-4 left-4 z-50 pointer-events-none">
        <span className="text-[10px] font-mono text-[#00ff9d] opacity-50 uppercase tracking-widest">
          Stack: {currentBoxCount}/5
        </span>
      </div>
    </div>
  );
};

export default PhysicsEngine;
