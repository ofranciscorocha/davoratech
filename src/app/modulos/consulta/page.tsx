'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CHARS = '0123456789ABCDEF'
function randChar() { return CHARS[Math.floor(Math.random()*CHARS.length)] }

const LINES = [
  { label:'> consultando SENATRAN...', delay:0 },
  { label:'> buscando dados SERASA...', delay:600 },
  { label:'> verificando restrições...', delay:1200 },
  { label:'> análise de sinistro...', delay:1800 },
  { label:'> STATUS: ██ CARREGANDO', delay:2400 },
]

export default function ConsultaPage() {
  const [matrix, setMatrix] = useState<string[][]>([])
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    const cols = 20, rows = 8
    setMatrix(Array.from({length:rows}, () => Array.from({length:cols}, randChar)))
    const t = setInterval(() => {
      setMatrix(m => m.map(row => row.map(() => Math.random()>.7 ? randChar() : randChar())))
    }, 100)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    LINES.forEach((_,i) => {
      setTimeout(() => setVisibleLines(i+1), LINES[i].delay)
    })
    const reset = setInterval(() => {
      setVisibleLines(0)
      LINES.forEach((_,i) => setTimeout(() => setVisibleLines(i+1), LINES[i].delay))
    }, 4000)
    return () => clearInterval(reset)
  }, [])

  return (
    <div style={{
      minHeight:'100vh', background:'#060d0a', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif",
      overflow:'hidden', position:'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600;700&family=Cormorant+Garamond:wght@600;700&family=IBM+Plex+Mono&display=swap');
        @keyframes titleIn{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes blink2{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes lineIn{0%{opacity:0;transform:translateX(-8px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes cursor{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes workerType{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        .title-anim{animation:titleIn .8s cubic-bezier(.19,1,.22,1) forwards;opacity:0}
        .blink-dot{animation:blink2 1.5s infinite}
        .line-in{animation:lineIn .3s ease forwards}
        .cursor{animation:cursor .8s infinite}
        .worker-type{animation:workerType .3s ease-in-out infinite}
      `}</style>

      {/* Matrix background */}
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',opacity:.05,fontFamily:"'IBM Plex Mono'",fontSize:'11px',color:'#00ff41',lineHeight:1.4,overflow:'hidden',pointerEvents:'none'}}>
        {matrix.map((row,i) => (
          <div key={i} style={{display:'flex',gap:'12px',padding:'0 20px'}}>
            {row.map((c,j) => <span key={j}>{c}</span>)}
          </div>
        ))}
      </div>

      {/* Terminal flutuante */}
      <div style={{
        position:'absolute', top:'10%', right:'4%',
        background:'rgba(0,10,5,.9)', border:'1px solid rgba(0,255,65,.15)',
        borderRadius:'8px', padding:'0', backdropFilter:'blur(16px)',
        width:'280px', boxShadow:'0 0 40px rgba(0,255,65,.05)',
      }}>
        <div style={{padding:'10px 16px',borderBottom:'1px solid rgba(0,255,65,.1)',display:'flex',gap:'8px',alignItems:'center'}}>
          <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#e74c3c'}}/>
          <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#f39c12'}}/>
          <div style={{width:'10px',height:'10px',borderRadius:'50%',background:'#27ae60'}}/>
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:'.5rem',color:'rgba(0,255,65,.3)',letterSpacing:'2px',marginLeft:'8px'}}>DAVORA_API</span>
        </div>
        <div style={{padding:'16px',fontFamily:"'IBM Plex Mono'",fontSize:'.65rem',color:'rgba(0,255,65,.7)',lineHeight:1.8}}>
          {LINES.map((line,i) => (
            visibleLines > i && (
              <div key={i} className="line-in" style={{marginBottom:'4px'}}>
                {line.label}
              </div>
            )
          ))}
          <span className="cursor">_</span>
        </div>
      </div>

      {/* Trabalhador hacker */}
      <div style={{position:'absolute',bottom:'5%',left:'4%'}}>
        <svg width="80" height="110" viewBox="0 0 80 110" className="worker-type">
          <circle cx="40" cy="14" r="11" fill="#f4c77a"/>
          <path d="M27,14 Q40,-2 53,14 Z" fill="#16a085"/>
          <rect x="26" y="13" width="28" height="5" rx="2" fill="#0e6655"/>
          {/* Monitor */}
          <rect x="45" y="28" width="30" height="22" rx="3" fill="#0a1a10" stroke="#00ff41" strokeWidth="1"/>
          <rect x="47" y="30" width="26" height="18" rx="2" fill="#041208"/>
          {Array.from({length:3}).map((_,i)=>(
            <rect key={i} x="49" y={32+i*5} width={10+i*4} height="2" rx="1" fill="rgba(0,255,65,.4)"/>
          ))}
          <rect x="56" y="50" width="8" height="3" rx="1" fill="#0e6655"/>
          {/* Corpo */}
          <rect x="28" y="25" width="18" height="30" rx="4" fill="#1a5276"/>
          <rect x="18" y="27" width="10" height="24" rx="3" fill="#1a5276"/>
          <rect x="46" y="27" width="10" height="20" rx="3" fill="#1a5276"/>
          <rect x="29" y="55" width="8" height="24" rx="3" fill="#154360"/>
          <rect x="40" y="55" width="8" height="24" rx="3" fill="#154360"/>
        </svg>
      </div>

      {/* Conteúdo */}
      <div style={{textAlign:'center',position:'relative',zIndex:10,padding:'0 24px'}}>
        <div style={{fontFamily:"'IBM Plex Mono'",fontSize:'.6rem',letterSpacing:'6px',color:'#00d45a',textTransform:'uppercase',marginBottom:'20px'}}>
          — Módulo 04 · Consulta —
        </div>
        <h1 className="title-anim" style={{animationDelay:'.1s',fontFamily:"'Cormorant Garamond'",fontSize:'clamp(2.4rem,6vw,5rem)',fontWeight:700,lineHeight:.95,letterSpacing:'-2px',marginBottom:'8px',color:'#eae6de'}}>
          Consulta SENATRAN<br/><span style={{color:'#00d45a'}}>e SERASA</span>
        </h1>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',margin:'28px 0'}}>
          <span className="blink-dot" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#00d45a',display:'inline-block'}}/>
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:'.7rem',letterSpacing:'4px',color:'rgba(234,230,222,.5)',textTransform:'uppercase'}}>Em Construção</span>
          <span className="blink-dot" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#00d45a',display:'inline-block',animationDelay:'.5s'}}/>
        </div>
        <p style={{color:'rgba(234,230,222,.5)',maxWidth:'420px',lineHeight:1.8,fontSize:'.95rem',margin:'0 auto 40px'}}>
          APIs integradas: SENATRAN, Receita Federal e registros nacionais. Informação completa em milissegundos.
        </p>
        <Link href="/" style={{
          display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px 32px',
          border:'1px solid rgba(0,212,90,.3)',borderRadius:'100px',color:'#00d45a',
          textDecoration:'none',fontSize:'.82rem',fontWeight:600,letterSpacing:'1px',
          background:'rgba(0,212,90,.06)',
        }}>
          ← Voltar ao início
        </Link>
      </div>
    </div>
  )
}
