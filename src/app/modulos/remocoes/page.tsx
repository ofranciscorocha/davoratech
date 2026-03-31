'use client'
import Link from 'next/link'

export default function RemocoesPage() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0c131f', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif",
      overflow: 'hidden', position: 'relative',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600;700&family=Cormorant+Garamond:wght@600;700&family=IBM+Plex+Mono&display=swap');
        @keyframes truck { 0%{transform:translateX(-120%)} 100%{transform:translateX(120vw)} }
        @keyframes road { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes wheel { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes smoke { 0%{opacity:.8;transform:translateY(0) scale(1)} 100%{opacity:0;transform:translateY(-40px) scale(2)} }
        @keyframes titleIn { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes blink2 { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes gps { 0%{stroke-dashoffset:300} 100%{stroke-dashoffset:0} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:.6} 50%{transform:scale(1.4);opacity:1} }
        .truck-wrap { position:absolute; bottom:80px; animation: truck 8s linear infinite; }
        .road-line { animation: road 2s linear infinite; }
        .wheel-anim { animation: wheel .5s linear infinite; transform-origin:center; }
        .smoke1 { animation: smoke 1.2s ease-out infinite; }
        .smoke2 { animation: smoke 1.2s ease-out .4s infinite; }
        .smoke3 { animation: smoke 1.2s ease-out .8s infinite; }
        .title-anim { animation: titleIn .8s cubic-bezier(.19,1,.22,1) forwards; opacity:0; }
        .blink-dot { animation: blink2 1.5s infinite; }
        .gps-path { stroke-dasharray:300; animation: gps 3s ease-in-out infinite; }
        .gps-dot { animation: pulse 1.5s infinite; }
      `}</style>

      {/* Grade de fundo */}
      <div style={{
        position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(46,204,113,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(46,204,113,.04) 1px,transparent 1px)',
        backgroundSize:'60px 60px',
      }}/>

      {/* GPS path SVG decorativo */}
      <svg style={{position:'absolute',top:'10%',right:'5%',opacity:.15}} width="200" height="200" viewBox="0 0 200 200">
        <path className="gps-path" d="M20,180 Q50,20 100,80 Q150,140 180,20" fill="none" stroke="#2ecc71" strokeWidth="2"/>
        <circle className="gps-dot" cx="180" cy="20" r="6" fill="#2ecc71"/>
      </svg>

      {/* Estrada */}
      <div style={{position:'absolute', bottom:0, left:0, right:0, height:'90px', background:'#111820', borderTop:'2px solid #1e2d3d'}}>
        <div style={{position:'absolute',top:'50%',left:0,right:0,height:'3px',display:'flex',overflow:'hidden'}}>
          <svg className="road-line" width="200%" height="3" viewBox="0 0 800 3">
            {Array.from({length:20}).map((_,i)=>(
              <rect key={i} x={i*80} y={0} width={40} height={3} fill="rgba(46,204,113,.25)"/>
            ))}
          </svg>
        </div>
      </div>

      {/* Caminhão-guincho */}
      <div className="truck-wrap">
        <svg width="200" height="80" viewBox="0 0 200 80">
          {/* Fumaça */}
          <circle className="smoke1" cx="18" cy="28" r="7" fill="rgba(150,180,160,.5)"/>
          <circle className="smoke2" cx="12" cy="18" r="5" fill="rgba(150,180,160,.4)"/>
          <circle className="smoke3" cx="22" cy="10" r="4" fill="rgba(150,180,160,.3)"/>
          {/* Corpo do caminhão */}
          <rect x="15" y="30" width="150" height="35" rx="4" fill="#1e3a2e"/>
          <rect x="140" y="15" width="30" height="50" rx="4" fill="#1e4a38"/>
          {/* Cabine */}
          <rect x="145" y="20" width="20" height="25" rx="3" fill="#2d6b4e"/>
          {/* Janela */}
          <rect x="148" y="23" width="14" height="10" rx="2" fill="rgba(100,220,160,.3)"/>
          {/* Braço da grua */}
          <line x1="50" y1="30" x2="30" y2="5" stroke="#2ecc71" strokeWidth="3"/>
          <line x1="30" y1="5" x2="90" y2="5" stroke="#2ecc71" strokeWidth="3"/>
          <line x1="90" y1="5" x2="90" y2="30" stroke="#2ecc71" strokeWidth="2" strokeDasharray="4 2"/>
          {/* Trabalhador */}
          <circle cx="160" cy="16" r="6" fill="#f4c77a"/>
          {/* Capacete */}
          <path d="M154,16 Q160,5 166,16 Z" fill="#f5a623"/>
          <rect x="153" y="15" width="14" height="3" rx="1" fill="#f5a623"/>
          {/* Rodas */}
          <g transform="translate(40,65)"><circle r="14" fill="#1a2530" stroke="#2ecc71" strokeWidth="2"/><circle className="wheel-anim" r="8" fill="none" stroke="#2ecc71" strokeWidth="1.5" strokeDasharray="6 4"/><circle r="3" fill="#2ecc71"/></g>
          <g transform="translate(130,65)"><circle r="14" fill="#1a2530" stroke="#2ecc71" strokeWidth="2"/><circle className="wheel-anim" r="8" fill="none" stroke="#2ecc71" strokeWidth="1.5" strokeDasharray="6 4"/><circle r="3" fill="#2ecc71"/></g>
          <g transform="translate(158,65)"><circle r="12" fill="#1a2530" stroke="#2ecc71" strokeWidth="2"/><circle className="wheel-anim" r="7" fill="none" stroke="#2ecc71" strokeWidth="1.5" strokeDasharray="6 4"/><circle r="3" fill="#2ecc71"/></g>
        </svg>
      </div>

      {/* Conteúdo */}
      <div style={{textAlign:'center', position:'relative', zIndex:10, padding:'0 24px'}}>
        <div style={{fontFamily:"'IBM Plex Mono'",fontSize:'.6rem',letterSpacing:'6px',color:'#2ecc71',textTransform:'uppercase',marginBottom:'20px'}}>
          — Módulo 01 · Logística —
        </div>

        <h1 className="title-anim" style={{animationDelay:'.1s',fontFamily:"'Cormorant Garamond'",fontSize:'clamp(3rem,8vw,6rem)',fontWeight:700,lineHeight:.95,letterSpacing:'-2px',marginBottom:'8px',color:'#eae6de'}}>
          Sistema de<br/><span style={{color:'#2ecc71'}}>Remoções</span>
        </h1>

        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',margin:'28px 0'}}>
          <span className="blink-dot" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#f5a623',display:'inline-block'}}/>
          <span style={{fontFamily:"'IBM Plex Mono'",fontSize:'.7rem',letterSpacing:'4px',color:'rgba(234,230,222,.5)',textTransform:'uppercase'}}>Em Construção</span>
          <span className="blink-dot" style={{width:'8px',height:'8px',borderRadius:'50%',background:'#f5a623',display:'inline-block',animationDelay:'.5s'}}/>
        </div>

        <p style={{color:'rgba(234,230,222,.5)',maxWidth:'420px',lineHeight:1.8,fontSize:'.95rem',margin:'0 auto 40px'}}>
          Nossa equipe está otimizando cada rota. Em breve, controle completo de guinchos, GPS em tempo real e logística inteligente.
        </p>

        <Link href="/" style={{
          display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px 32px',
          border:'1px solid rgba(46,204,113,.3)',borderRadius:'100px',color:'#2ecc71',
          textDecoration:'none',fontSize:'.82rem',fontWeight:600,letterSpacing:'1px',
          background:'rgba(46,204,113,.06)',transition:'all .3s',
        }}>
          ← Voltar ao início
        </Link>
      </div>
    </div>
  )
}
