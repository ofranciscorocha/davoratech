'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const BIDDERS = ['Comprador #47','Comprador #12','Comprador #83','Comprador #29','Comprador #55']

export default function LeilaoPage() {
  const [bid, setBid] = useState(85000)
  const [count, setCount] = useState(0)
  const [lastBidder, setLastBidder] = useState(BIDDERS[0])
  const [hammer, setHammer] = useState(false)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    const t = setInterval(() => {
      const increment = Math.floor(Math.random()*3+1)*500
      setBid(p => p + increment)
      setCount(p => p + 1)
      setLastBidder(BIDDERS[Math.floor(Math.random()*BIDDERS.length)])
      setHammer(true)
      setFlash(true)
      setTimeout(()=>{setHammer(false); setFlash(false)}, 300)
    }, 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      minHeight:'100vh', background:'#0f0c00', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif",
      overflow:'hidden', position:'relative',
      transition: flash ? 'background .1s' : 'background .5s',
      backgroundColor: flash ? '#1a1200' : '#0f0c00',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600;700&family=Cormorant+Garamond:wght@600;700&family=IBM+Plex+Mono&display=swap');
        @keyframes titleIn{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes blink2{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes hammer{0%{transform:rotate(-30deg)}100%{transform:rotate(20deg)}}
        @keyframes bidIn{0%{opacity:0;transform:translateY(-10px) scale(1.05)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(230,180,30,.4)}50%{text-shadow:0 0 60px rgba(230,180,30,.8),0 0 100px rgba(230,180,30,.3)}}
        @keyframes rings{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.5);opacity:0}}
        @keyframes workerHammer{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-20deg)}}
        .title-anim{animation:titleIn .8s cubic-bezier(.19,1,.22,1) forwards;opacity:0}
        .blink-dot{animation:blink2 1.5s infinite}
        .hammer-anim{animation:${hammer?'hammer .2s ease forwards':'none'};transform-origin:80% 80%}
        .bid-val{animation:glow 2s infinite;key:${bid}}
        .ring1{animation:rings 1s ease-out infinite}
        .ring2{animation:rings 1s ease-out .3s infinite}
        .worker-h{animation:workerHammer 1.8s ease-in-out infinite}
      `}</style>

      {/* Fundo radiante */}
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at center, rgba(230,180,30,.04) 0%, transparent 70%)'}}/>
      <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(230,180,30,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(230,180,30,.03) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>

      {/* Ondas do martelo */}
      {hammer && (
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}>
          <div className="ring1" style={{position:'absolute',width:'200px',height:'200px',borderRadius:'50%',border:'1px solid rgba(230,180,30,.4)',top:'-100px',left:'-100px'}}/>
          <div className="ring2" style={{position:'absolute',width:'200px',height:'200px',borderRadius:'50%',border:'1px solid rgba(230,180,30,.3)',top:'-100px',left:'-100px'}}/>
        </div>
      )}

      {/* Trabalhador leiloeiro */}
      <div style={{position:'absolute',bottom:'4%',right:'6%'}}>
        <svg width="80" height="110" viewBox="0 0 80 110" className="worker-h">
          <circle cx="40" cy="12" r="11" fill="#f4c77a"/>
          {/* Capacete de obra dourado */}
          <path d="M27,12 Q40,-4 53,12 Z" fill="#e6b41e"/>
          <rect x="26" y="11" width="28" height="5" rx="2" fill="#c9a200"/>
          {/* Corpo com terno de leiloeiro */}
          <rect x="28" y="23" width="24" height="32" rx="4" fill="#2c1f00"/>
          <rect x="35" y="23" width="10" height="32" fill="#1a1200"/>
          {/* Gravata dourada */}
          <path d="M38,25 L42,25 L41,40 L40,42 L39,40 Z" fill="#e6b41e"/>
          {/* Braço com martelo */}
          <rect x="52" y="25" width="9" height="22" rx="3" fill="#2c1f00"/>
          {/* Martelo */}
          <g className="hammer-anim">
            <rect x="55" y="18" width="5" height="16" rx="2" fill="#8B6914"/>
            <rect x="50" y="14" width="15" height="8" rx="3" fill="#C9A200"/>
          </g>
          {/* Braço esquerdo */}
          <rect x="19" y="25" width="9" height="22" rx="3" fill="#2c1f00"/>
          <rect x="29" y="55" width="9" height="26" rx="3" fill="#1a1200"/>
          <rect x="42" y="55" width="9" height="26" rx="3" fill="#1a1200"/>
        </svg>
      </div>

      {/* HUD de lance */}
      <div style={{
        position:'absolute', top:'8%', right:'3%',
        background:'rgba(20,15,0,.9)', border:'1px solid rgba(230,180,30,.2)',
        borderRadius:'12px', padding:'20px 28px', backdropFilter:'blur(16px)',
        minWidth:'240px', boxShadow:'0 0 40px rgba(230,180,30,.05)',
      }}>
        <div style={{fontFamily:"'IBM Plex Mono'",fontSize:'.5rem',letterSpacing:'3px',color:'rgba(230,180,30,.5)',marginBottom:'8px',textTransform:'uppercase'}}>Lance Atual</div>
        <div key={bid} style={{fontFamily:"'IBM Plex Mono'",fontSize:'1.8rem',color:'#e6b41e',fontWeight:700,animation:'bidIn .3s ease'}}>
          R$ {bid.toLocaleString('pt-BR')}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:'12px',paddingTop:'12px',borderTop:'1px solid rgba(230,180,30,.08)'}}>
          <div>
            <div style={{fontFamily:"'IBM Plex Mono'",fontSize:'.45rem',color:'rgba(230,180,30,.4)',letterSpacing:'2px',textTransform:'uppercase'}}>Lances</div>
            <div style={{fontFamily:"'IBM Plex Mono'",fontSize:'1rem',color:'rgba(234,230,222,.8)',fontWeight:600}}>{count}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:"'IBM Plex Mono'",fontSize:'.45rem',color:'rgba(230,180,30,.4)',letterSpacing:'2px',textTransform:'uppercase'}}>Último</div>
            <div style={{fontFamily:"'DM Sans'",fontSize:'.75rem',color:'rgba(234,230,222,.6)'}}>{lastBidder}</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'12px'}}>
          <div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#2ecc71',animation:'blink2 1s infinite'}}/>
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:'.5rem',color:'#2ecc71',letterSpacing:'2px'}}>AO VIVO</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{textAlign:'center',position:'relative',zIndex:10,padding:'0 24px'}}>
        <div style={{fontFamily:"'IBM Plex Mono'",fontSize:'.6rem',letterSpacing:'6px',color:'#e6b41e',textTransform:'uppercase',marginBottom:'20px'}}>
          — Módulo 05 · Leilão —
        </div>
        <h1 className="title-anim" style={{animationDelay:'.1s',fontFamily:"'Cormorant Garamond'",fontSize:'clamp(3rem,8vw,6rem)',fontWeight:700,lineHeight:.95,letterSpacing:'-2px',marginBottom:'8px',color:'#eae6de'}}>
          Sistema de<br/><span style={{color:'#e6b41e'}} className="bid-val">Leilão</span>
        </h1>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',margin:'28px 0'}}>
          <span className="blink-dot" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#e6b41e',display:'inline-block'}}/>
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:'.7rem',letterSpacing:'4px',color:'rgba(234,230,222,.5)',textTransform:'uppercase'}}>Em Construção</span>
          <span className="blink-dot" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#e6b41e',display:'inline-block',animationDelay:'.5s'}}/>
        </div>
        <p style={{color:'rgba(234,230,222,.5)',maxWidth:'420px',lineHeight:1.8,fontSize:'.95rem',margin:'0 auto 40px'}}>
          Gestão completa para leilões de ativos, veículos e imóveis. Site moderno, transmissão ao vivo e lances em tempo real.
        </p>
        <Link href="/" style={{
          display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px 32px',
          border:'1px solid rgba(230,180,30,.3)',borderRadius:'100px',color:'#e6b41e',
          textDecoration:'none',fontSize:'.82rem',fontWeight:600,letterSpacing:'1px',
          background:'rgba(230,180,30,.06)',
        }}>
          ← Voltar ao início
        </Link>
      </div>
    </div>
  )
}
