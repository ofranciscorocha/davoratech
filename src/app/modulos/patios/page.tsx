'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const GRID_W = 8, GRID_H = 5
const TOTAL = GRID_W * GRID_H

export default function PatiosPage() {
  const [filled, setFilled] = useState<Set<number>>(new Set())

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i >= TOTAL) { setFilled(new Set()); i = 0; return }
      setFilled(prev => new Set([...prev, i]))
      i++
    }, 120)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      minHeight:'100vh', background:'#0c131f', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif",
      overflow:'hidden', position:'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600;700&family=Cormorant+Garamond:wght@600;700&family=IBM+Plex+Mono&display=swap');
        @keyframes titleIn{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes scanLine{0%{top:0}50%{top:calc(100% - 3px)}100%{top:0}}
        @keyframes workerBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes fadeSlot{0%{opacity:0;transform:scale(.7)}100%{opacity:1;transform:scale(1)}}
        @keyframes blink2{0%,100%{opacity:1}50%{opacity:.3}}
        .title-anim{animation:titleIn .8s cubic-bezier(.19,1,.22,1) forwards;opacity:0}
        .scan-line{position:absolute;left:0;right:0;height:2px;background:rgba(46,204,113,.8);box-shadow:0 0 10px rgba(46,204,113,.8);animation:scanLine 2s ease-in-out infinite}
        .worker-bob{animation:workerBob 1.5s ease-in-out infinite}
        .slot-filled{animation:fadeSlot .3s ease forwards}
        .blink-dot{animation:blink2 1.5s infinite}
      `}</style>

      {/* Fundo pontilhado */}
      <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(rgba(46,204,113,.08) 1px,transparent 1px)',backgroundSize:'28px 28px'}}/>

      {/* Scanner de QR + trabalhador — canto superior direito */}
      <div style={{position:'absolute',top:'8%',right:'6%',display:'flex',flexDirection:'column',alignItems:'center',gap:'12px'}}>
        {/* Trabalhador */}
        <div className="worker-bob">
          <svg width="60" height="80" viewBox="0 0 60 80">
            <circle cx="30" cy="14" r="10" fill="#f4c77a"/>
            <path d="M18,14 Q30,-2 42,14 Z" fill="#3498db"/>
            <rect x="17" y="13" width="26" height="5" rx="2" fill="#2980b9"/>
            <rect x="22" y="24" width="16" height="28" rx="4" fill="#2d5f8f"/>
            <rect x="14" y="26" width="8" height="22" rx="3" fill="#2d5f8f"/>
            <rect x="38" y="26" width="8" height="22" rx="3" fill="#2d5f8f" style={{transform:'rotate(15deg)',transformOrigin:'38px 26px'}}/>
            <rect x="22" y="52" width="7" height="20" rx="3" fill="#1e3a5f"/>
            <rect x="31" y="52" width="7" height="20" rx="3" fill="#1e3a5f"/>
            {/* Telefone com QR */}
            <rect x="30" y="30" width="18" height="22" rx="2" fill="#1a1a2e" stroke="#3498db" strokeWidth="1"/>
            <rect x="33" y="33" width="12" height="12" rx="1" fill="#0a0a15"/>
            <rect x="34" y="34" width="4" height="4" fill="#3498db"/>
            <rect x="40" y="34" width="4" height="4" fill="#3498db"/>
            <rect x="34" y="40" width="4" height="4" fill="#3498db"/>
            <rect x="37" y="37" width="3" height="3" fill="#3498db"/>
            <rect x="40" y="40" width="4" height="2" fill="#3498db"/>
          </svg>
        </div>
        <span style={{fontFamily:"'IBM Plex Mono'",fontSize:'.5rem',color:'rgba(52,152,219,.5)',letterSpacing:'2px'}}>SCANNING...</span>
      </div>

      {/* Grid de vagas */}
      <div style={{position:'absolute',bottom:'5%',left:'4%',opacity:.12}}>
        <div style={{display:'grid',gridTemplateColumns:`repeat(${GRID_W},28px)`,gap:'6px'}}>
          {Array.from({length:TOTAL}).map((_,i)=>(
            <div key={i} style={{
              width:'28px',height:'44px',borderRadius:'4px',border:'1px solid rgba(52,152,219,.5)',
              background: filled.has(i) ? 'rgba(52,152,219,.3)' : 'transparent',
              transition:'all .2s',
            }}/>
          ))}
        </div>
      </div>

      {/* Scanner overlay */}
      <div style={{position:'absolute',top:'25%',left:'50%',transform:'translateX(-50%)',width:'180px',height:'180px',border:'2px solid rgba(52,152,219,.2)',borderRadius:'8px',overflow:'hidden'}}>
        <div className="scan-line"/>
        <div style={{position:'absolute',top:'8px',left:'8px',width:'20px',height:'20px',borderTop:'2px solid #3498db',borderLeft:'2px solid #3498db'}}/>
        <div style={{position:'absolute',top:'8px',right:'8px',width:'20px',height:'20px',borderTop:'2px solid #3498db',borderRight:'2px solid #3498db'}}/>
        <div style={{position:'absolute',bottom:'8px',left:'8px',width:'20px',height:'20px',borderBottom:'2px solid #3498db',borderLeft:'2px solid #3498db'}}/>
        <div style={{position:'absolute',bottom:'8px',right:'8px',width:'20px',height:'20px',borderBottom:'2px solid #3498db',borderRight:'2px solid #3498db'}}/>
      </div>

      {/* Conteúdo */}
      <div style={{textAlign:'center',position:'relative',zIndex:10,padding:'0 24px'}}>
        <div style={{fontFamily:"'IBM Plex Mono'",fontSize:'.6rem',letterSpacing:'6px',color:'#3498db',textTransform:'uppercase',marginBottom:'20px'}}>
          — Módulo 02 · Guarda de Bens —
        </div>
        <h1 className="title-anim" style={{animationDelay:'.1s',fontFamily:"'Cormorant Garamond'",fontSize:'clamp(3rem,8vw,6rem)',fontWeight:700,lineHeight:.95,letterSpacing:'-2px',marginBottom:'8px',color:'#eae6de'}}>
          Sistema de<br/><span style={{color:'#3498db'}}>Pátios</span>
        </h1>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',margin:'28px 0'}}>
          <span className="blink-dot" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#3498db',display:'inline-block'}}/>
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:'.7rem',letterSpacing:'4px',color:'rgba(234,230,222,.5)',textTransform:'uppercase'}}>Em Construção</span>
          <span className="blink-dot" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#3498db',display:'inline-block',animationDelay:'.5s'}}/>
        </div>
        <p style={{color:'rgba(234,230,222,.5)',maxWidth:'420px',lineHeight:1.8,fontSize:'.95rem',margin:'0 auto 40px'}}>
          Vagas mapeadas, QR Code por ativo e mapa interativo do seu pátio. Em breve, controle total de entrada e saída.
        </p>
        <Link href="/" style={{
          display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px 32px',
          border:'1px solid rgba(52,152,219,.3)',borderRadius:'100px',color:'#3498db',
          textDecoration:'none',fontSize:'.82rem',fontWeight:600,letterSpacing:'1px',
          background:'rgba(52,152,219,.06)',
        }}>
          ← Voltar ao início
        </Link>
      </div>
    </div>
  )
}
