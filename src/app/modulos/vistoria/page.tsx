'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const ITEMS = ['Motor','Lataria','Freios','Suspensão','Pneus','Vidros','Documentação','Pintura']

export default function VistoriaPage() {
  const [checked, setChecked] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setChecked(p => p >= ITEMS.length ? 0 : p + 1)
    }, 600)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      minHeight:'100vh', background:'#0d0c1d', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans',sans-serif",
      overflow:'hidden', position:'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600;700&family=Cormorant+Garamond:wght@600;700&family=IBM+Plex+Mono&display=swap');
        @keyframes titleIn{0%{opacity:0;transform:translateY(30px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes checkIn{0%{opacity:0;transform:translateX(-10px)}100%{opacity:1;transform:translateX(0)}}
        @keyframes workerWrite{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
        @keyframes blink2{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes lensMove{0%,100%{transform:translate(0,0)}25%{transform:translate(10px,-8px)}50%{transform:translate(-5px,10px)}75%{transform:translate(8px,5px)}}
        .title-anim{animation:titleIn .8s cubic-bezier(.19,1,.22,1) forwards;opacity:0}
        .check-in{animation:checkIn .3s ease forwards}
        .worker-write{animation:workerWrite 1s ease-in-out infinite;transform-origin:38px 42px}
        .blink-dot{animation:blink2 1.5s infinite}
        .lens-move{animation:lensMove 4s ease-in-out infinite}
      `}</style>

      {/* Fundo hexagonal */}
      <div style={{position:'absolute',inset:0,opacity:.04,backgroundImage:`url("data:image/svg+xml,%3Csvg width='52' height='60' viewBox='0 0 52 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M26 0 L52 15 L52 45 L26 60 L0 45 L0 15 Z' fill='none' stroke='%239b59b6' stroke-width='1'/%3E%3C/svg%3E")`,backgroundSize:'52px 60px'}}/>

      {/* Lupa animada */}
      <div className="lens-move" style={{position:'absolute',top:'12%',right:'8%',opacity:.15}}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="40" cy="40" r="28" fill="none" stroke="#9b59b6" strokeWidth="4"/>
          <circle cx="40" cy="40" r="18" fill="none" stroke="#9b59b6" strokeWidth="1.5" opacity=".5"/>
          <line x1="62" y1="62" x2="88" y2="88" stroke="#9b59b6" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Trabalhador com prancheta */}
      <div style={{position:'absolute',bottom:'8%',left:'6%'}}>
        <svg width="70" height="100" viewBox="0 0 70 100" className="worker-write">
          <circle cx="35" cy="12" r="10" fill="#f4c77a"/>
          <path d="M23,12 Q35,-2 47,12 Z" fill="#9b59b6"/>
          <rect x="22" y="11" width="26" height="5" rx="2" fill="#7d3c98"/>
          <rect x="26" y="22" width="18" height="30" rx="4" fill="#5d2e8c"/>
          <g className="worker-write">
            <rect x="36" y="28" width="22" height="28" rx="3" fill="#1a1a2e" stroke="#9b59b6" strokeWidth="1.5"/>
            <rect x="44" y="24" width="6" height="8" rx="2" fill="#9b59b6"/>
            {Array.from({length:4}).map((_,i)=>(
              <rect key={i} x="39" y={33+i*5} width={14-(i%2)*4} height="2" rx="1" fill={i<2?'#9b59b6':'rgba(155,89,182,.3)'}/>
            ))}
          </g>
          <rect x="24" y="52" width="8" height="24" rx="3" fill="#4a2476"/>
          <rect x="36" y="52" width="8" height="24" rx="3" fill="#4a2476"/>
        </svg>
      </div>

      {/* Checklist flutuante */}
      <div style={{
        position:'absolute', top:'15%', left:'5%',
        background:'rgba(20,15,40,.8)', border:'1px solid rgba(155,89,182,.2)',
        borderRadius:'12px', padding:'20px 24px', backdropFilter:'blur(16px)',
        minWidth:'200px',
      }}>
        <div style={{fontFamily:"'IBM Plex Mono'",fontSize:'.5rem',letterSpacing:'3px',color:'rgba(155,89,182,.6)',marginBottom:'14px',textTransform:'uppercase'}}>Checklist Vistoria</div>
        {ITEMS.map((item,i) => (
          <div key={item} className={i < checked ? 'check-in' : ''} style={{
            display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px',
            opacity: i < checked ? 1 : 0.2,
          }}>
            <div style={{
              width:'16px',height:'16px',borderRadius:'4px',flexShrink:0,
              border:`1.5px solid ${i<checked?'#9b59b6':'rgba(155,89,182,.3)'}`,
              background: i<checked?'rgba(155,89,182,.2)':'transparent',
              display:'flex',alignItems:'center',justifyContent:'center',
            }}>
              {i < checked && <span style={{color:'#9b59b6',fontSize:'10px',fontWeight:700}}>✓</span>}
            </div>
            <span style={{fontFamily:"'DM Sans'",fontSize:'.78rem',color:i<checked?'rgba(234,230,222,.85)':'rgba(234,230,222,.3)'}}>{item}</span>
          </div>
        ))}
      </div>

      {/* Conteúdo principal */}
      <div style={{textAlign:'center',position:'relative',zIndex:10,padding:'0 24px'}}>
        <div style={{fontFamily:"'IBM Plex Mono'",fontSize:'.6rem',letterSpacing:'6px',color:'#9b59b6',textTransform:'uppercase',marginBottom:'20px'}}>
          — Módulo 03 · Vistoria —
        </div>
        <h1 className="title-anim" style={{animationDelay:'.1s',fontFamily:"'Cormorant Garamond'",fontSize:'clamp(2.4rem,6vw,5rem)',fontWeight:700,lineHeight:.95,letterSpacing:'-2px',marginBottom:'8px',color:'#eae6de'}}>
          Vistoria Cautelar,<br/><span style={{color:'#9b59b6'}}>Avaliação & PMG</span>
        </h1>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',margin:'28px 0'}}>
          <span className="blink-dot" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#9b59b6',display:'inline-block'}}/>
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:'.7rem',letterSpacing:'4px',color:'rgba(234,230,222,.5)',textTransform:'uppercase'}}>Em Construção</span>
          <span className="blink-dot" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#9b59b6',display:'inline-block',animationDelay:'.5s'}}/>
        </div>
        <p style={{color:'rgba(234,230,222,.5)',maxWidth:'420px',lineHeight:1.8,fontSize:'.95rem',margin:'0 auto 40px'}}>
          Laudos completos com fotos, análise de danos, cálculo de monta e transferência. Documentação precisa em cada vistoria.
        </p>
        <Link href="/" style={{
          display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px 32px',
          border:'1px solid rgba(155,89,182,.3)',borderRadius:'100px',color:'#9b59b6',
          textDecoration:'none',fontSize:'.82rem',fontWeight:600,letterSpacing:'1px',
          background:'rgba(155,89,182,.06)',
        }}>
          ← Voltar ao início
        </Link>
      </div>
    </div>
  )
}
