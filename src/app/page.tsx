'use client'
import { useEffect } from 'react'
import './landing.css'

export default function HomePage() {
  useEffect(() => {
    // Google Fonts
    const fontLink = document.createElement('link')
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap'
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)

    let animRunning = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rendererRef: any = null

    const L = (a: number, b: number, t: number) => a + (b - a) * t
    const C = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
    const E = (a: number, b: number, t: number) => { t = C((t - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }

    let mx = 0, my = 0, smx = 0, smy = 0
    const mouseMoveHandler = (e: MouseEvent) => {
      mx = (e.clientX / innerWidth - .5) * 2
      my = (e.clientY / innerHeight - .5) * 2
    }
    document.addEventListener('mousemove', mouseMoveHandler)

    const lbls = ['Na Rua', 'Sobre', 'Remoções', 'Pátios', 'Vistoria', 'Consulta', 'Leilão']
    let sP = 0, bidDone = false
    const gP = () => { const h = document.documentElement.scrollHeight - innerHeight; return h > 0 ? scrollY / h : 0 }

    let scrollHandler: () => void
    let resizeHandler: () => void

    // Load Three.js from CDN (same version as original HTML, avoids bundling 600KB)
    const threeScript = document.createElement('script')
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    threeScript.onload = () => {
      if (!animRunning) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initThree((window as any).THREE)
    }
    document.head.appendChild(threeScript)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function initThree(THREE: any) {
      if (!animRunning) return

      const cvs = document.getElementById('world') as HTMLCanvasElement
      if (!cvs) return

      const R = new THREE.WebGLRenderer({ canvas: cvs, alpha: true, antialias: true })
      rendererRef = R
      R.setSize(innerWidth, innerHeight)
      R.setPixelRatio(Math.min(devicePixelRatio, 2))
      R.shadowMap.enabled = true
      R.shadowMap.type = THREE.PCFSoftShadowMap
      R.toneMapping = THREE.ACESFilmicToneMapping
      R.toneMappingExposure = 1.0

      const SC = new THREE.Scene()
      SC.fog = new THREE.FogExp2(0x0c131f, .01)
      const cam = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 500)

      // Lights
      SC.add(new THREE.AmbientLight(0x1a2744, .5))
      const keyL = new THREE.DirectionalLight(0xffeedd, .85)
      keyL.position.set(8, 14, 8)
      keyL.castShadow = true
      keyL.shadow.mapSize.set(1024, 1024)
      keyL.shadow.camera.near = .5
      keyL.shadow.camera.far = 60
      ;(keyL.shadow.camera as any).left = -25
      ;(keyL.shadow.camera as any).right = 25
      ;(keyL.shadow.camera as any).top = 25
      ;(keyL.shadow.camera as any).bottom = -25
      SC.add(keyL)
      const fillL = new THREE.DirectionalLight(0x4488cc, .2)
      fillL.position.set(-8, 6, -6)
      SC.add(fillL)
      const goldPt = new THREE.PointLight(0x2ecc71, .4, 25)
      goldPt.position.set(0, 6, 0)
      SC.add(goldPt)

      // Materials
      const MG = new THREE.MeshStandardMaterial({ color: 0x2ecc71, metalness: .65, roughness: .25 })
      const MD = new THREE.MeshStandardMaterial({ color: 0x1a2233, metalness: .3, roughness: .7 })
      const MW = new THREE.MeshStandardMaterial({ color: 0xddd8cc, metalness: .1, roughness: .5 })
      const MB = new THREE.MeshStandardMaterial({ color: 0x1a4a7a, metalness: .4, roughness: .5 })
      const MGl = new THREE.MeshStandardMaterial({ color: 0x5588aa, metalness: .8, roughness: .1, transparent: true, opacity: .3 })
      const MR = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: .1, roughness: .9 })
      const MCh = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: .95, roughness: .05 })
      const MRd = new THREE.MeshStandardMaterial({ color: 0xcc3333, metalness: .3, roughness: .5 })

      // Person builder
      function mkPerson(skin: number, shirt: number, pants: number, scale?: number) {
        const g = new THREE.Group()
        const sM = new THREE.MeshStandardMaterial({ color: skin, roughness: .8 })
        const shM = new THREE.MeshStandardMaterial({ color: shirt, roughness: .7 })
        const pM = new THREE.MeshStandardMaterial({ color: pants, roughness: .8 })
        const head = new THREE.Mesh(new THREE.SphereGeometry(.18, 8, 6), sM)
        head.position.y = 1.65; head.castShadow = true; g.add(head)
        const hair = new THREE.Mesh(new THREE.SphereGeometry(.19, 8, 6), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: .9 }))
        hair.position.y = 1.72; hair.scale.set(1, .5, 1); g.add(hair)
        const torso = new THREE.Mesh(new THREE.BoxGeometry(.35, .45, .2), shM)
        torso.position.y = 1.25; torso.castShadow = true; g.add(torso)
        const lL = new THREE.Mesh(new THREE.BoxGeometry(.12, .5, .14), pM)
        lL.position.set(-.08, .75, 0); g.add(lL)
        const lR = new THREE.Mesh(new THREE.BoxGeometry(.12, .5, .14), pM)
        lR.position.set(.08, .75, 0); g.add(lR)
        const aL = new THREE.Mesh(new THREE.BoxGeometry(.1, .4, .1), shM)
        aL.position.set(-.25, 1.2, 0); g.add(aL)
        const aR = new THREE.Mesh(new THREE.BoxGeometry(.1, .4, .1), shM)
        aR.position.set(.25, 1.2, 0); g.add(aR)
        ;[-.08, .08].forEach(x => { const s = new THREE.Mesh(new THREE.BoxGeometry(.1, .06, .18), MD); s.position.set(x, .5, .02); g.add(s) })
        g.userData = { lL, lR, aL, aR, head }
        g.scale.setScalar(scale || .85)
        return g
      }

      // Car builder
      function mkCar(mat: THREE.MeshStandardMaterial, sc?: number) {
        const g = new THREE.Group()
        const body = new THREE.Mesh(new THREE.BoxGeometry(3.8, 1, 1.8), mat)
        body.position.y = .7; body.castShadow = true; body.receiveShadow = true; g.add(body)
        const roof = new THREE.Mesh(new THREE.BoxGeometry(1.9, .7, 1.65), mat.clone())
        ;(roof.material as THREE.MeshStandardMaterial).color.multiplyScalar(.9)
        roof.position.set(-.2, 1.5, 0); roof.castShadow = true; g.add(roof)
        const wF = new THREE.Mesh(new THREE.BoxGeometry(.06, .55, 1.5), MGl)
        wF.position.set(.68, 1.48, 0); wF.rotation.z = .18; g.add(wF)
        const wB = new THREE.Mesh(new THREE.BoxGeometry(.06, .55, 1.5), MGl)
        wB.position.set(-1.08, 1.48, 0); wB.rotation.z = -.12; g.add(wB)
        ;[-1, .9].forEach(z => { const sw = new THREE.Mesh(new THREE.BoxGeometry(1.6, .45, .06), MGl); sw.position.set(-.2, 1.5, z * .83); g.add(sw) })
        const bF = new THREE.Mesh(new THREE.BoxGeometry(.15, .25, 1.7), MCh)
        bF.position.set(1.95, .38, 0); g.add(bF)
        const bB = new THREE.Mesh(new THREE.BoxGeometry(.15, .25, 1.7), MCh)
        bB.position.set(-1.95, .38, 0); g.add(bB)
        ;[.6, -.6].forEach(z => { const h = new THREE.Mesh(new THREE.SphereGeometry(.1, 6, 6), new THREE.MeshBasicMaterial({ color: 0xfff5dd })); h.position.set(1.92, .65, z); g.add(h) })
        ;[.65, -.65].forEach(z => { const t = new THREE.Mesh(new THREE.BoxGeometry(.08, .15, .2), new THREE.MeshBasicMaterial({ color: 0xff2222, transparent: true, opacity: .8 })); t.position.set(-1.95, .65, z); g.add(t) })
        const wG = new THREE.CylinderGeometry(.33, .33, .2, 12)
        ;[[1.15, .33, .95], [1.15, .33, -.95], [-1.15, .33, .95], [-1.15, .33, -.95]].forEach((p: number[]) => {
          const w = new THREE.Mesh(wG, MR); w.position.set(p[0], p[1], p[2]); w.rotation.x = Math.PI / 2; w.castShadow = true; g.add(w)
          const h = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .22, 6), MCh); h.position.set(p[0], p[1], p[2]); h.rotation.x = Math.PI / 2; g.add(h)
        })
        g.scale.setScalar(sc || 1); return g
      }

      // Truck builder
      function mkTruck() {
        const g = new THREE.Group()
        const cab = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 2.3), new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: .2, roughness: .6 }))
        cab.position.set(3.5, 1.3, 0); cab.castShadow = true; g.add(cab)
        const ws = new THREE.Mesh(new THREE.BoxGeometry(.06, 1, 2), MGl)
        ws.position.set(4.85, 1.5, 0); g.add(ws)
        const tl = new THREE.Mesh(new THREE.BoxGeometry(.5, .12, .3), new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: .8 }))
        tl.position.set(3.5, 2.45, 0); g.add(tl)
        const bed = new THREE.Mesh(new THREE.BoxGeometry(5.5, .15, 2.3), new THREE.MeshStandardMaterial({ color: 0x888888, metalness: .5, roughness: .4 }))
        bed.position.set(-.6, .55, 0); bed.castShadow = true; g.add(bed)
        ;[1.2, -1.2].forEach(z => { const r = new THREE.Mesh(new THREE.BoxGeometry(5.5, .25, .05), MG); r.position.set(-.6, .7, z); g.add(r) })
        const arm = new THREE.Mesh(new THREE.BoxGeometry(.15, 2.5, .15), MG)
        arm.position.set(1.8, 2, 0); arm.rotation.z = -.15; arm.castShadow = true; g.add(arm)
        const ramp = new THREE.Mesh(new THREE.BoxGeometry(2, .08, 2), new THREE.MeshStandardMaterial({ color: 0x777777, metalness: .4, roughness: .5 }))
        ramp.position.set(-4.3, .55, 0); g.add(ramp)
        g.userData.ramp = ramp
        const wG = new THREE.CylinderGeometry(.42, .42, .24, 12)
        ;[[4.2, .42, 1.2], [4.2, .42, -1.2], [-.5, .42, 1.2], [-.5, .42, -1.2], [-2, .42, 1.2], [-2, .42, -1.2]].forEach((p: number[]) => {
          const w = new THREE.Mesh(wG, MR); w.position.set(p[0], p[1], p[2]); w.rotation.x = Math.PI / 2; w.castShadow = true; g.add(w)
          const h = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, .26, 6), MCh); h.position.set(p[0], p[1], p[2]); h.rotation.x = Math.PI / 2; g.add(h)
        })
        return g
      }

      // City
      const cityGroup = new THREE.Group()
      const road = new THREE.Mesh(new THREE.PlaneGeometry(80, 8), new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: .95 }))
      road.rotation.x = -Math.PI / 2; road.position.y = .005; road.receiveShadow = true; cityGroup.add(road)
      ;[-5.5, 5.5].forEach(z => {
        const sw = new THREE.Mesh(new THREE.BoxGeometry(80, .12, 4), new THREE.MeshStandardMaterial({ color: 0x3a3a42, roughness: .9 }))
        sw.position.set(0, .06, z); sw.receiveShadow = true; cityGroup.add(sw)
      })
      for (let i = -18; i < 18; i++) {
        const d = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .08), new THREE.MeshBasicMaterial({ color: 0x444444 }))
        d.rotation.x = -Math.PI / 2; d.position.set(i * 2.2, .012, 0); cityGroup.add(d)
      }
      const bData = [
        { x: -18, h: 14, z: 12, w: 5, d: 5 }, { x: -10, h: 20, z: 13, w: 6, d: 7 }, { x: -3, h: 10, z: 11, w: 4, d: 4 },
        { x: 4, h: 24, z: 14, w: 6, d: 8 }, { x: 12, h: 12, z: 12, w: 5, d: 5 }, { x: 20, h: 18, z: 13, w: 6, d: 7 },
        { x: -16, h: 16, z: -12, w: 5, d: 5 }, { x: -8, h: 9, z: -11, w: 4, d: 4 }, { x: 0, h: 22, z: -13, w: 6, d: 8 },
        { x: 8, h: 13, z: -12, w: 5, d: 5 }, { x: 16, h: 19, z: -13, w: 6, d: 7 }, { x: 24, h: 11, z: -11, w: 4, d: 4 },
      ]
      bData.forEach(b => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(b.w, b.h, b.d), new THREE.MeshStandardMaterial({ color: 0x1e2840, metalness: .15, roughness: .85 }))
        m.position.set(b.x, b.h / 2, b.z); m.castShadow = true; m.receiveShadow = true; cityGroup.add(m)
        const floors = Math.floor(b.h / 2.5), cols = Math.floor(b.w / 1.8), side = b.z > 0 ? -1 : 1
        for (let f = 0; f < floors; f++) for (let c = 0; c < cols; c++) {
          const lit = Math.random() > .5
          const wm = new THREE.MeshBasicMaterial({ color: lit ? 0xffeebb : 0x5588aa, transparent: true, opacity: lit ? .15 + Math.random() * .25 : .08 })
          const w = new THREE.Mesh(new THREE.PlaneGeometry(.7, 1), wm)
          w.position.set(b.x - b.w / 2 + 1 + c * (b.w / cols), 1.5 + f * 2.5, b.z + side * (b.d / 2 + .01))
          if (side === -1) w.rotation.y = Math.PI
          cityGroup.add(w)
        }
      })
      ;[-12, -2, 8, 18].forEach(x => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(.05, .07, 6.5, 6), MD)
        pole.position.set(x, 3.25, 4.2); cityGroup.add(pole)
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(.5, .15, .25), new THREE.MeshBasicMaterial({ color: 0xfff4dd, transparent: true, opacity: .8 }))
        lamp.position.set(x - 1, 6.5, 4.2); cityGroup.add(lamp)
        const pl = new THREE.PointLight(0xffe4a8, .6, 12)
        pl.position.set(x - 1, 6.3, 4.2); cityGroup.add(pl)
      })
      SC.add(cityGroup)

      // Pedestrians
      const peds: THREE.Group[] = []
      ;[
        { s: 0xc4956a, sh: 0x334455, p: 0x222230, x: -14, z: 5.8, d: 1, sp: .9 },
        { s: 0xa0704a, sh: 0x993333, p: 0x1a1a28, x: 6, z: 6.2, d: -1, sp: 1.1 },
        { s: 0xddb896, sh: 0x225533, p: 0x2a2a38, x: -4, z: -5.8, d: 1, sp: .8 },
        { s: 0xb8845a, sh: 0x444466, p: 0x1e1e2a, x: 16, z: -6, d: -1, sp: .7 },
        { s: 0xc4956a, sh: 0x553344, p: 0x282838, x: -8, z: 5.5, d: 1, sp: 1.2 },
        { s: 0xddb896, sh: 0x224455, p: 0x222230, x: 10, z: -5.6, d: -1, sp: 1 },
      ].forEach(c => {
        const ped = mkPerson(c.s, c.sh, c.p)
        ped.position.set(c.x, .12, c.z)
        ped.rotation.y = c.d > 0 ? Math.PI / 2 : -Math.PI / 2
        ped.userData.dir = c.d; ped.userData.speed = c.sp
        SC.add(ped); peds.push(ped)
      })

      // Main car
      const car = mkCar(MG)
      car.rotation.y = Math.PI
      car.position.set(6, .02, 2.8)
      SC.add(car)

      // Truck
      const truck = mkTruck(); truck.visible = false; SC.add(truck)

      // Yard cars
      const yCars: THREE.Group[] = []
      const yMats = [MB, MD, MW, MB.clone(), MD.clone(), MW.clone(), MRd, MB]
      const yPos = [[-5, 0, -4], [0, 0, -4], [5, 0, -4], [-5, 0, 0], [5, 0, 0], [-5, 0, 4], [0, 0, 4], [5, 0, 4]]
      yPos.forEach((p, i) => {
        const c = mkCar(yMats[i], .75); c.position.set(p[0], p[1], p[2]); c.rotation.y = i % 2 ? 0 : Math.PI; c.visible = false; SC.add(c); yCars.push(c)
      })

      // Inspector
      const inspector = mkPerson(0xc4956a, 0x224466, 0x1a1a28, 1)
      inspector.visible = false; SC.add(inspector)
      const clipboard = new THREE.Group()
      const cbBoard = new THREE.Mesh(new THREE.BoxGeometry(.25, .35, .02), new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: .8 }))
      const cbPaper = new THREE.Mesh(new THREE.BoxGeometry(.22, .3, .01), new THREE.MeshBasicMaterial({ color: 0xf5f5dc }))
      cbPaper.position.z = .015; clipboard.add(cbBoard); clipboard.add(cbPaper)
      clipboard.position.set(.3, 1.1, .2); clipboard.rotation.set(-.3, -.2, 0)
      inspector.add(clipboard)

      // Scan rings
      const sr1 = new THREE.Mesh(new THREE.TorusGeometry(3, .025, 8, 64), new THREE.MeshBasicMaterial({ color: 0x2ecc71, transparent: true, opacity: .5 }))
      sr1.rotation.x = Math.PI / 2; sr1.visible = false; SC.add(sr1)
      const sr2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, .015, 8, 64), new THREE.MeshBasicMaterial({ color: 0x27ae60, transparent: true, opacity: .35 }))
      sr2.rotation.x = Math.PI / 2; sr2.visible = false; SC.add(sr2)

      // Data panels
      const dPanels: THREE.Group[] = []
      for (let i = 0; i < 6; i++) {
        const pg = new THREE.Group()
        pg.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 1, .04), new THREE.MeshBasicMaterial({ color: 0x2ecc71, transparent: true, opacity: .04 })))
        pg.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 1, .04), new THREE.MeshBasicMaterial({ color: 0x2ecc71, wireframe: true, transparent: true, opacity: .15 })))
        for (let j = 0; j < 3; j++) {
          const bar = new THREE.Mesh(new THREE.BoxGeometry(.25 + Math.random() * .7, .06, .01), new THREE.MeshBasicMaterial({ color: 0x2ecc71, transparent: true, opacity: .2 }))
          bar.position.set(-.25 + j * .3, -.18 + j * .13, .02); pg.add(bar)
        }
        pg.visible = false; SC.add(pg); dPanels.push(pg)
      }

      // Auction scene
      const auctionGroup = new THREE.Group(); auctionGroup.visible = false
      const stageFloor = new THREE.Mesh(new THREE.BoxGeometry(16, .2, 14), new THREE.MeshStandardMaterial({ color: 0x1a2744, metalness: .3, roughness: .6 }))
      stageFloor.position.set(0, -.1, 0); stageFloor.receiveShadow = true; auctionGroup.add(stageFloor)
      const platform = new THREE.Mesh(new THREE.CylinderGeometry(3, .1, .12, 32), new THREE.MeshStandardMaterial({ color: 0x1a2744, metalness: .5, roughness: .4 }))
      platform.position.set(0, 0, -3); platform.receiveShadow = true; auctionGroup.add(platform)
      const platGlow = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.3, .02, 32), new THREE.MeshBasicMaterial({ color: 0x2ecc71, transparent: true, opacity: .06 }))
      platGlow.position.set(0, .05, -3); auctionGroup.add(platGlow)
      const auctStep = new THREE.Mesh(new THREE.BoxGeometry(2, .5, 1.5), new THREE.MeshStandardMaterial({ color: 0x1a2744, metalness: .3, roughness: .6 }))
      auctStep.position.set(0, .25, .8); auctStep.castShadow = true; auctionGroup.add(auctStep)
      const podium = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1, .8), new THREE.MeshStandardMaterial({ color: 0x3a2510, metalness: .2, roughness: .7 }))
      podium.position.set(0, 1, 1.8); podium.castShadow = true; auctionGroup.add(podium)
      const podTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, .06, 1), new THREE.MeshStandardMaterial({ color: 0x4a3520, metalness: .15, roughness: .8 }))
      podTop.position.set(0, 1.53, 1.8); auctionGroup.add(podTop)
      const podTrim = new THREE.Mesh(new THREE.BoxGeometry(1.4, .06, .02), MG)
      podTrim.position.set(0, 1.2, 2.21); auctionGroup.add(podTrim)
      const podPlate = new THREE.Mesh(new THREE.BoxGeometry(.8, .25, .02), new THREE.MeshBasicMaterial({ color: 0x2ecc71, transparent: true, opacity: .15 }))
      podPlate.position.set(0, .9, 2.21); auctionGroup.add(podPlate)
      const strikePad = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, .03, 12), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: .3, roughness: .6 }))
      strikePad.position.set(.3, 1.57, 1.6); auctionGroup.add(strikePad)
      const auctioneer = mkPerson(0xc4956a, 0x111111, 0x111111, 1)
      auctioneer.position.set(0, .5, 1); auctioneer.rotation.y = 0; auctionGroup.add(auctioneer)
      const gavel = new THREE.Group()
      const gavelHead2 = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .25, 8), MG)
      gavelHead2.rotation.z = Math.PI / 2; gavel.add(gavelHead2)
      const gavelBand1 = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .03, 8), new THREE.MeshBasicMaterial({ color: 0x2ecc71, transparent: true, opacity: .4 }))
      gavelBand1.rotation.z = Math.PI / 2; gavelBand1.position.x = .08; gavel.add(gavelBand1)
      const gavelBand2 = gavelBand1.clone(); gavelBand2.position.x = -.08; gavel.add(gavelBand2)
      const gavelStick = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .35, 6), new THREE.MeshStandardMaterial({ color: 0x4a3520, metalness: .1, roughness: .8 }))
      gavelStick.position.y = -.18; gavel.add(gavelStick)
      gavel.position.set(.25, 1.25, .2); auctioneer.add(gavel)

      // Audience with bidding paddles
      const audience: THREE.Group[] = []
      const paddles: THREE.Group[] = []
      for (let row = 0; row < 3; row++) {
        for (let col = -3; col <= 3; col++) {
          const seat = new THREE.Mesh(new THREE.BoxGeometry(.55, .05, .55), new THREE.MeshStandardMaterial({ color: 0x8B0000, roughness: .8 }))
          seat.position.set(col * 1.1, -.05 + row * .55, 5 + row * 1.8); auctionGroup.add(seat)
          const ap = mkPerson(
            [0xc4956a, 0xa0704a, 0xddb896, 0xb8845a][Math.floor(Math.random() * 4)],
            [0x334455, 0x993333, 0x225533, 0x444466, 0x553344, 0x224455][Math.floor(Math.random() * 6)],
            [0x1a1a28, 0x222230, 0x2a2a38][Math.floor(Math.random() * 3)], .75
          )
          ap.position.set(col * 1.1, .05 + row * .55, 5 + row * 1.8); ap.rotation.y = Math.PI
          const paddle = new THREE.Group()
          const paddleBoard = new THREE.Mesh(new THREE.BoxGeometry(.22, .18, .02), new THREE.MeshStandardMaterial({ color: 0xf5f0e0, roughness: .6 }))
          const paddleNum = new THREE.Mesh(new THREE.BoxGeometry(.14, .08, .005), new THREE.MeshBasicMaterial({ color: 0x111111 }))
          paddleNum.position.z = .012
          const paddleStick = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, .25, 4), new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: .8 }))
          paddleStick.position.y = -.2
          paddle.add(paddleBoard); paddle.add(paddleNum); paddle.add(paddleStick)
          paddle.position.set(.2, 1.2, -.1); paddle.rotation.x = -.3
          ap.add(paddle); auctionGroup.add(ap)
          audience.push(ap); paddles.push(paddle)
        }
      }
      const winner = audience[10]
      SC.add(auctionGroup)

      // Spotlights
      const spotL = new THREE.SpotLight(0xffeedd, .8, 20, Math.PI / 6, .5)
      spotL.position.set(0, 8, -3); spotL.target.position.set(0, 0, -3)
      auctionGroup.add(spotL); auctionGroup.add(spotL.target)
      const spotL2 = new THREE.SpotLight(0xffeedd, .4, 15, Math.PI / 5, .6)
      spotL2.position.set(0, 7, 2); spotL2.target.position.set(0, 1.5, 1)
      auctionGroup.add(spotL2); auctionGroup.add(spotL2.target)

      // Particles
      const PCC = 400
      const pP = new Float32Array(PCC * 3)
      for (let i = 0; i < PCC; i++) { pP[i * 3] = (Math.random() - .5) * 80; pP[i * 3 + 1] = Math.random() * 25; pP[i * 3 + 2] = (Math.random() - .5) * 80 }
      const pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(pP, 3))
      SC.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x2ecc71, size: .06, transparent: true, opacity: .2, blending: THREE.AdditiveBlending, sizeAttenuation: true })))

      function setCity(v: boolean) { cityGroup.visible = v; peds.forEach(p => p.visible = v) }

      function update() {
        const raw = gP(); sP = L(sP, raw, .06); const sc = sP * 7; const t = performance.now() * .001
        smx = L(smx, mx, .04); smy = L(smy, my, .04)
        const progEl = document.getElementById('prog')
        if (progEl) progEl.style.transform = 'scaleX(' + raw + ')'
        const si = C(Math.round(sc), 0, 6)
        const slblEl = document.getElementById('slbl')
        if (slblEl) slblEl.textContent = 'Módulo 0' + (si + 1) + ' / 07 \u2014 ' + lbls[si]
        document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('on', i === si))
        const navEl = document.getElementById('nav')
        if (navEl) navEl.classList.toggle('solid', scrollY > 60)
        if (SC.fog) (SC.fog as THREE.FogExp2).density = sc < 3 ? .01 : (sc > 5 ? .008 : .012)
        const cmx = smx * 1.8, cmy = smy * .8

        if (sc < 3) peds.forEach(p => {
          p.position.x += p.userData.dir * p.userData.speed * .015
          if (p.position.x > 25) p.position.x = -25
          if (p.position.x < -25) p.position.x = 25
          const w = Math.sin(t * p.userData.speed * 4) * .2
          p.userData.lL.rotation.x = w; p.userData.lR.rotation.x = -w
          p.userData.aL.rotation.x = -w * .6; p.userData.aR.rotation.x = w * .6
          p.position.y = .12 + Math.abs(Math.sin(t * p.userData.speed * 4)) * .015
        })

        truck.visible = false; inspector.visible = false; sr1.visible = false; sr2.visible = false
        yCars.forEach(c => c.visible = false); dPanels.forEach(d => d.visible = false)
        auctionGroup.visible = false

        // S0: HERO — City with parked car
        if (sc < 1) {
          setCity(true); car.visible = true
          car.position.set(6, .02, 2.8); car.rotation.y = Math.PI; car.scale.setScalar(1)
          cam.position.set(L(-2, 8, sc) + cmx, L(8, 4, sc) + cmy * .4, L(16, 10, sc))
          cam.lookAt(L(0, 5, sc), L(2, 1, sc), 0)
        }
        // S1: TRUCK — ramp down, load car, ramp up
        else if (sc < 2) {
          const s = sc - 1; setCity(true); car.visible = true; truck.visible = true
          const tx = L(-20, 3, E(0, .4, s))
          truck.position.set(tx, .02, -.5); truck.rotation.y = 0
          const ramp = truck.userData.ramp
          if (s < .35) {
            ramp.rotation.z = 0; ramp.position.set(-4.3, .55, 0)
          } else if (s < .5) {
            const rt = E(.35, .5, s); ramp.rotation.z = L(0, .5, rt); ramp.position.set(-4.3, L(.55, .2, rt), 0)
          } else if (s < .75) {
            ramp.rotation.z = .5; ramp.position.set(-4.3, .2, 0)
            const lt = E(.5, .75, s)
            car.position.set(L(6, tx - .6, lt), L(.02, .7, lt), L(2.8, -.5, lt))
            car.rotation.y = L(Math.PI, Math.PI, lt); car.scale.setScalar(L(1, .6, lt))
          } else {
            const rt = E(.75, .9, s); ramp.rotation.z = L(.5, 0, rt); ramp.position.set(-4.3, L(.2, .55, rt), 0)
            car.position.set(tx - .6, .7, -.5); car.scale.setScalar(.6); car.rotation.y = Math.PI
          }
          cam.position.set(L(8, 12, s) + cmx, L(4, 5, s) + cmy * .4, L(10, 14, s))
          cam.lookAt(L(5, tx, s), 1.2, 0)
        }
        // S2: TRANSPORT
        else if (sc < 3) {
          const s = sc - 2; setCity(true); truck.visible = true; car.visible = true
          const tx = L(3, 25, s)
          truck.position.set(tx, .02 + Math.sin(t * 4) * .015, -.5); truck.rotation.y = 0
          truck.userData.ramp.rotation.z = 0; truck.userData.ramp.position.set(-4.3, .55, 0)
          car.position.set(tx - .6, .7 + Math.sin(t * 4) * .015, -.5); car.scale.setScalar(.6); car.rotation.y = Math.PI
          if (SC.fog) (SC.fog as THREE.FogExp2).density = L(.01, .035, s)
          cam.position.set(tx + 8 + cmx + Math.sin(t * .5) * .3, 5 + cmy * .3, L(14, 10, s))
          cam.lookAt(tx, 1.5, 0)
        }
        // S3: YARD
        else if (sc < 4) {
          const s = sc - 3; setCity(false)
          if (SC.fog) (SC.fog as THREE.FogExp2).density = .012
          car.visible = true; car.position.set(0, .02, 0); car.rotation.y = 0; car.scale.setScalar(.75)
          yCars.forEach((c, i) => { const d = .1 + i * .07; const yt = E(d, d + .25, s); c.visible = yt > .01; c.scale.setScalar(.75 * yt); c.position.y = L(3, 0, yt) })
          cam.position.set(cmx * 2, L(6, 20, E(0, .5, s)) + cmy, L(12, 5, E(0, .5, s))); cam.lookAt(0, 0, 0)
        }
        // S4: INSPECTION
        else if (sc < 5) {
          const s = sc - 4; setCity(false); car.visible = true; inspector.visible = true
          car.position.set(0, .02, 0); car.rotation.y = 0; car.scale.setScalar(1)
          const angle = s * Math.PI * 1.5 - Math.PI / 4
          inspector.position.set(Math.cos(angle) * 3.5, .02, Math.sin(angle) * 3.5)
          inspector.rotation.y = -angle + Math.PI
          const wk = Math.sin(t * 3) * .15
          inspector.userData.lL.rotation.x = wk; inspector.userData.lR.rotation.x = -wk
          inspector.userData.aL.rotation.x = -wk * .4; inspector.userData.aR.rotation.x = -.8
          sr1.visible = true; sr1.position.y = 1 + Math.sin(t * .7) * 1.5; sr1.rotation.z = t * .3; sr1.scale.setScalar(E(0, .2, s))
          sr2.visible = true; sr2.position.y = 1 + Math.cos(t * .5) * 1.2; sr2.rotation.z = -t * .25; sr2.scale.setScalar(E(.1, .3, s))
          cam.position.set(6 + cmx, 3 + cmy * .4, 7); cam.lookAt(0, .8, 0)
        }
        // S5: DATA CONSULTATION
        else if (sc < 6) {
          const s = sc - 5; setCity(false); car.visible = true
          car.position.set(-3, .02, 0); car.rotation.y = -.2; car.scale.setScalar(.9)
          dPanels.forEach((dp, i) => {
            const d = i * .08; const dt = E(d, d + .25, s); dp.visible = dt > .01
            const a = (i / 6) * Math.PI * 1.5 - .3; const r = 3 + i * .5
            dp.position.set(Math.cos(a + t * .07) * r - 1, 1.2 + i * .6 + Math.sin(t * .35 + i) * .2, Math.sin(a + t * .07) * r)
            dp.lookAt(cam.position); dp.scale.setScalar(dt)
          })
          cam.position.set(5 + cmx * 2, 4 + cmy * .5, 10); cam.lookAt(-1, 1.2, 0)
        }
        // S6: AUCTION
        else {
          const s = C(sc - 6, 0, 1); setCity(false); auctionGroup.visible = true
          car.visible = true; car.position.set(0, .15, -3); car.rotation.y = t * .2; car.scale.setScalar(L(.5, 1, E(0, .3, s)))
          const hammerCycle = t % 2
          if (hammerCycle < 1.5) { gavel.rotation.x = L(0, -.8, hammerCycle / 1.5) } else { gavel.rotation.x = L(-.8, .1, (hammerCycle - 1.5) / .5) }
          auctioneer.userData.aR.rotation.x = gavel.rotation.x * .6 - .3
          auctioneer.userData.aL.rotation.x = Math.sin(t * 1.5) * .2 - .6
          auctioneer.userData.head.rotation.y = Math.sin(t * .8) * .2
          audience.forEach((a, i) => {
            a.userData.head.rotation.y = Math.sin(t * .7 + i * .5) * .2
            const isRaising = i % 5 === Math.floor(t * 1.2) % 5
            if (isRaising) { a.userData.aR.rotation.x = -2.2; paddles[i].rotation.x = -1.8 } else { a.userData.aR.rotation.x = 0; paddles[i].rotation.x = -.3 }
          })
          if (s > .6) {
            winner.userData.aL.rotation.x = -2.5; winner.userData.aR.rotation.x = -2.5
            paddles[10].rotation.x = -2; winner.position.y = .05 + Math.sin(t * 5) * .08
          }
          spotL.intensity = .6 + Math.sin(t * 1.5) * .2; spotL2.intensity = .3 + Math.sin(t * 2) * .1
          cam.position.set(L(6, 4, s) + cmx * 1.2, L(3, 4, s) + cmy * .4, L(8, 6, s)); cam.lookAt(0, 1.2, -1)
          if (!bidDone) {
            bidDone = true
            const bidEl = document.getElementById('bidVal'), cntEl = document.getElementById('bidCount')
            if (bidEl) bidEl.textContent = '95.000'
            if (cntEl) cntEl.textContent = '0 lances'
            let bv = 95000, bc = 0
            const bi = setInterval(() => {
              bc++; bv += 1000
              if (bidEl) bidEl.textContent = bv.toLocaleString('pt-BR')
              if (cntEl) cntEl.textContent = bc + ' lance' + (bc > 1 ? 's' : '')
              if (bc >= 15) clearInterval(bi)
            }, 1000)
          }
        }
      }

      function checkR() {
        document.querySelectorAll('.act-inner').forEach(el => {
          const r = (el as HTMLElement).parentElement!.getBoundingClientRect()
          el.classList.toggle('show', r.top < innerHeight * .72 && r.bottom > innerHeight * .12)
        })
      }

      scrollHandler = () => checkR()
      window.addEventListener('scroll', scrollHandler, { passive: true })
      checkR()

      document.querySelectorAll('.dot').forEach(d => d.addEventListener('click', () => {
        const i = (d as HTMLElement).dataset.i
        document.getElementById('a' + i)?.scrollIntoView({ behavior: 'smooth' })
      }))

      document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
        e.preventDefault()
        const target = document.querySelector((a as HTMLAnchorElement).getAttribute('href')!)
        if (target) target.scrollIntoView({ behavior: 'smooth' })
      }))

      resizeHandler = () => {
        cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); R.setSize(innerWidth, innerHeight)
      }
      window.addEventListener('resize', resizeHandler)

      ;(function loop() {
        if (!animRunning) return
        requestAnimationFrame(loop)
        update()
        R.render(SC, cam)
      })()
    } // end initThree

    return () => {
      animRunning = false
      document.removeEventListener('mousemove', mouseMoveHandler)
      if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      if (rendererRef) rendererRef.dispose()
      if (fontLink.parentNode) fontLink.parentNode.removeChild(fontLink)
      if (threeScript.parentNode) threeScript.parentNode.removeChild(threeScript)
    }
  }, [])

  return (
    <div className="davora-landing">
      <div className="grain"></div>
      <div className="vignette"></div>
      <div className="progress" id="prog"></div>
      <div className="scene-lbl" id="slbl">Módulo 01 / 07</div>
      <canvas id="world"></canvas>

      <nav className="nav" id="nav">
        <a href="#" className="nav-logo">DAVORA <span>TECH</span></a>
        <a href="#contact" className="nav-mobile-cta">Contato</a>
        <div className="nav-links">
          <a href="#a3">Soluções</a>
          <a href="#a6">Leilão</a>
          <a href="#contact" className="nav-btn">Contato</a>
        </div>
      </nav>

      <div className="dots">
        <div className="dot on" data-i="0" data-label="Rua"></div>
        <div className="dot" data-i="1" data-label="Sobre"></div>
        <div className="dot" data-i="2" data-label="Remoções"></div>
        <div className="dot" data-i="3" data-label="Pátios"></div>
        <div className="dot" data-i="4" data-label="Vistoria"></div>
        <div className="dot" data-i="5" data-label="Consulta"></div>
        <div className="dot" data-i="6" data-label="Leilão"></div>
      </div>

      <section className="act center" id="a0" style={{ minHeight: '110vh' }}>
        <div className="act-inner show">
          <div className="hero-badge"><span className="blink"></span> Sistemas para Pátios · Leilões · Governo</div>
          <h1 className="hero-title">Controle não é opção.<br /><span className="gold">É necessidade.</span><span className="hero-subtitle">A jornada completa do ativo</span></h1>
          <p className="hero-sub">Da remoção ao leilão — cada etapa digitalizada com precisão.</p>
          <div className="scroll-cue"><span>Role para acompanhar</span><div className="scroll-arrow"></div></div>
        </div>
      </section>

      <section className="act" id="a1">
        <div className="act-inner">
          <div className="tag">Quem somos</div>
          <h2 className="hl">Softwares para<br /><span className="gold">gestão de ativos.</span></h2>
          <p className="bd">A DAVORA TECH desenvolve sistemas inteligentes para o ciclo completo do ativo — da remoção até a venda em leilão ou venda direta. Rastreabilidade total, controle em tempo real e inteligência artificial integrada em cada etapa.</p>
          <a href="#a2" className="mod-btn">Conheça nossos módulos ↓</a>
        </div>
      </section>

      <section className="act right" id="a2">
        <div className="act-inner">
          <div className="tag">Módulo 01 — Logística</div>
          <h2 className="hl">Sistema de<br /><span className="gold">Remoções</span></h2>
          <p className="bd">Controle o recolhimento de veículos com mapa logístico, vistoria e checklist, com fotos e gestão de manutenção dos guinchos e abastecimento. Rastreamento GPS em tempo real. Cada quilômetro documentado, cada rota otimizada.</p>
          <a href="/modulos/remocoes" className="mod-btn">Ver mais sobre o módulo →</a>
        </div>
      </section>

      <section className="act" id="a3">
        <div className="act-inner">
          <div className="tag">Módulo 02 — Guarda de Bens</div>
          <h2 className="hl">Sistema de<br /><span className="gold">Pátios</span></h2>
          <p className="bd">Controle de entrada e saída de ativos, vagas mapeadas, com QR Code, relatórios, mapa personalizável do seu pátio, fotos, vídeos, checklist e integração ao sistema do Senatran para consultas e vistorias.</p>
          <a href="/modulos/patios" className="mod-btn">Ver mais sobre o módulo →</a>
        </div>
      </section>

      <section className="act right" id="a4">
        <div className="act-inner">
          <div className="tag">Módulo 03 — Vistoria</div>
          <h2 className="hl">Vistoria Cautelar,<br /><span className="gold">Avaliação, PMG e ECV.</span></h2>
          <p className="bd">Laudos de vistorias cautelar para análise de danos, repintura, cálculo de monta e vistoria para transferência. Documentado com precisão.</p>
          <div className="inspect-grid">
            <div className="inspect-item"><div className="il">Motor</div><div className="iv ok">Dá partida e engrena</div></div>
            <div className="inspect-item"><div className="il">Lataria</div><div className="iv bad">Colisão frontal</div></div>
            <div className="inspect-item"><div className="il">Vidros</div><div className="iv bad">Parabrisa quebrado</div></div>
            <div className="inspect-item"><div className="il">Pneus</div><div className="iv warn">Meia vida</div></div>
          </div>
          <a href="/modulos/vistoria" className="mod-btn">Ver mais sobre o módulo →</a>
        </div>
      </section>

      <section className="act" id="a5">
        <div className="act-inner">
          <div className="tag">Módulo 04 — Consulta</div>
          <h2 className="hl">Consulta de<br /><span className="gold">dados SENATRAN e SERASA.</span></h2>
          <p className="bd">APIs integradas a SENATRAN, Receita Federal e registros nacionais. Informação completa em milissegundos de veículos e pessoas.</p>
          <div className="dash">
            <div className="dash-row">
              <div className="dash-card"><div className="dl">Placa</div><div className="dv">ABC-1D23</div></div>
              <div className="dash-card"><div className="dl">Chassi</div><div className="dv">9BR53...Z01</div></div>
            </div>
            <div className="dash-row">
              <div className="dash-card"><div className="dl">Débitos</div><div className="dv" style={{ color: 'var(--red)' }}>R$ 2.340</div></div>
              <div className="dash-card"><div className="dl">Restrições</div><div className="dv" style={{ color: 'var(--red)', fontSize: '1rem' }}>Restrição Judicial</div></div>
            </div>
            <div className="dash-row">
              <div className="dash-card"><div className="dl">Furto e Roubo</div><div className="dv" style={{ color: 'var(--green)' }}>Não</div></div>
              <div className="dash-card"><div className="dl">Passagem por leilão</div><div className="dv" style={{ color: '#e8a735', fontSize: '.95rem' }}>Sim - 18/02/2018</div></div>
            </div>
            <div className="dash-row">
              <div className="dash-card"><div className="dl">Sinistro</div><div className="dv" style={{ color: '#e8a735' }}>Média Monta</div></div>
              <div className="dash-card"><div className="dl">Probabilidade de Seguro</div><div className="dv" style={{ color: 'var(--gold)' }}>67%</div></div>
            </div>
            <div className="dash-row">
              <div className="dash-card" style={{ borderColor: 'rgba(46,204,113,.2)' }}><div className="dl">Status</div><div className="dv" style={{ color: 'var(--green)' }}>Regular</div></div>
            </div>
          </div>
          <a href="/modulos/consulta" className="mod-btn">Ver mais sobre o módulo →</a>
        </div>
      </section>

      <section className="act right" id="a6" style={{ minHeight: '120vh' }}>
        <div className="act-inner">
          <div className="tag">Módulo 05 — Leilão</div>
          <h2 className="hl">Sistema de<br /><span className="gold">Leilão</span></h2>
          <p className="bd">Gestão completa para leilões de ativos, veículos, imóveis e outros. Site moderno com design focado em alta conversão, integração com YouTube, Instagram, gestão de e-mails, email marketing, e todas as ferramentas para seu leilão ser um sucesso!</p>
          <div className="auction-hud">
            <div className="auction-val"><span className="cur">R$</span><span id="bidVal">95.000</span></div>
            <div className="bid-row">
              <div className="bid-live"><span className="bid-dot"></span> AO VIVO</div>
              <div className="bid-count" id="bidCount">0 lances</div>
            </div>
          </div>
          <a href="/modulos/leilao" className="mod-btn" style={{ marginTop: '20px' }}>Ver mais sobre o módulo →</a>
        </div>
      </section>

      <section className="act center" id="contact" style={{ minHeight: '60vh' }}>
        <div className="act-inner">
          <div className="tag tag-c">Próximo capítulo</div>
          <h2 className="hl">Sua operação,<br /><span className="gold">digitalizada.</span></h2>
          <p className="bd" style={{ textAlign: 'center', margin: '0 auto 32px' }}>Fale com a DAVORA TECH.</p>
          <a href="mailto:contato@davoratech.com.br" style={{ display: 'inline-block', padding: '18px 48px', background: 'var(--gold)', color: 'var(--bg)', borderRadius: '100px', textDecoration: 'none', fontWeight: 700, fontSize: '.85rem', letterSpacing: '2px', textTransform: 'uppercase', boxShadow: '0 4px 30px var(--gold-glow)' }}>
            Fale Conosco
          </a>
        </div>
      </section>

      <section className="portfolio">
        <div className="portfolio-label">— Portfólio —</div>
        <h2 className="portfolio-title">Sistemas já <span className="gold">desenvolvidos</span></h2>
        <div className="portfolio-grid">
          <a href="https://www.atelielauraverissimo.com.br" target="_blank" rel="noreferrer" className="portfolio-card">
            <div className="portfolio-card-img-placeholder">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="rgba(46,204,113,.15)" strokeWidth="1"/>
                <path d="M20 44 Q32 20 44 44" stroke="rgba(46,204,113,.4)" strokeWidth="1.5" fill="none"/>
                <circle cx="32" cy="24" r="6" stroke="rgba(46,204,113,.4)" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div className="portfolio-card-body">
              <div className="portfolio-card-tag">E-commerce · Artesanato</div>
              <div className="portfolio-card-name">Ateliê Laura Veríssimo</div>
              <p className="portfolio-card-desc">Produção artesanal em vidro e porcelana com e-commerce integrado para vendas em todo o Brasil.</p>
              <span className="portfolio-card-url">atelielauraverissimo.com.br</span>
            </div>
          </a>
          <a href="https://www.arremateclub.com.br" target="_blank" rel="noreferrer" className="portfolio-card">
            <div className="portfolio-card-img-placeholder">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="rgba(46,204,113,.15)" strokeWidth="1"/>
                <path d="M18 40 L32 18 L46 40 Z" stroke="rgba(46,204,113,.4)" strokeWidth="1.5" fill="none"/>
                <line x1="24" y1="40" x2="40" y2="40" stroke="rgba(46,204,113,.3)" strokeWidth="1"/>
                <circle cx="32" cy="44" r="3" stroke="rgba(46,204,113,.4)" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div className="portfolio-card-body">
              <div className="portfolio-card-tag">Plataforma · Leilões</div>
              <div className="portfolio-card-name">Arremate Club</div>
              <p className="portfolio-card-desc">Agregador de leilões de veículos com busca inteligente, filtros avançados e monitoramento de lotes.</p>
              <span className="portfolio-card-url">arremateclub.com.br</span>
            </div>
          </a>
        </div>
      </section>

      <footer>
        <div className="ft-logo">DAVORA <span>TECH</span></div>
        <div className="ft-tag">Sistemas para Pátios · Leilões · Órgãos Públicos</div>
        <div className="ft-links">
          <a href="#a1">Soluções</a>
          <a href="#a6">Leilão</a>
          <a href="mailto:contato@davoratech.com.br">Contato</a>
          <a href="https://davoratech.com.br" target="_blank" rel="noreferrer">davoratech.com.br</a>
        </div>
        <p className="ft-copy">© 2026 DAVORA TECH</p>
      </footer>
    </div>
  )
}
