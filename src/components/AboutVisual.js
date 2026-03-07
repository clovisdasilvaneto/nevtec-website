import React, { useEffect, useRef } from "react"
import * as THREE from "three"

const AboutVisual = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mount = mountRef.current
    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Central wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(1.8, 1)
    const icoEdges = new THREE.EdgesGeometry(icoGeo)
    const icoMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.25,
    })
    const icoWireframe = new THREE.LineSegments(icoEdges, icoMat)
    scene.add(icoWireframe)

    // Inner solid icosahedron with subtle glow
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 1)
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x7b2ff7,
      transparent: true,
      opacity: 0.04,
      wireframe: false,
    })
    const innerMesh = new THREE.Mesh(innerGeo, innerMat)
    scene.add(innerMesh)

    // Second larger wireframe — outer cage
    const outerGeo = new THREE.IcosahedronGeometry(2.8, 0)
    const outerEdges = new THREE.EdgesGeometry(outerGeo)
    const outerMat = new THREE.LineBasicMaterial({
      color: 0x7b2ff7,
      transparent: true,
      opacity: 0.12,
    })
    const outerWireframe = new THREE.LineSegments(outerEdges, outerMat)
    scene.add(outerWireframe)

    // Orbiting particles on rings
    const ringParticles = []
    const ringCount = 3
    const particlesPerRing = 40

    for (let r = 0; r < ringCount; r++) {
      const ringGeo = new THREE.BufferGeometry()
      const positions = new Float32Array(particlesPerRing * 3)
      const radius = 2.2 + r * 0.6
      const tiltX = (r * Math.PI) / ringCount
      const tiltZ = r * 0.3

      for (let i = 0; i < particlesPerRing; i++) {
        const angle = (i / particlesPerRing) * Math.PI * 2
        positions[i * 3] = Math.cos(angle) * radius
        positions[i * 3 + 1] = Math.sin(angle) * radius
        positions[i * 3 + 2] = 0
      }

      ringGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))

      const ringMat = new THREE.PointsMaterial({
        color: r === 1 ? 0x7b2ff7 : 0x00e5ff,
        size: r === 0 ? 0.04 : 0.03,
        transparent: true,
        opacity: 0.6 - r * 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })

      const ringPoints = new THREE.Points(ringGeo, ringMat)
      ringPoints.rotation.x = tiltX
      ringPoints.rotation.z = tiltZ
      scene.add(ringPoints)
      ringParticles.push({ points: ringPoints, speed: 0.15 + r * 0.08, radius })
    }

    // Floating accent dots scattered around
    const scatterCount = 120
    const scatterGeo = new THREE.BufferGeometry()
    const scatterPos = new Float32Array(scatterCount * 3)
    const scatterSizes = new Float32Array(scatterCount)

    for (let i = 0; i < scatterCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 2.5 + Math.random() * 2.5
      scatterPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      scatterPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      scatterPos[i * 3 + 2] = r * Math.cos(phi)
      scatterSizes[i] = Math.random() * 2 + 0.5
    }

    scatterGeo.setAttribute("position", new THREE.BufferAttribute(scatterPos, 3))

    const scatterMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00e5ff) },
      },
      vertexShader: `
        uniform float uTime;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos += normal * sin(uTime * 0.5 + position.x * 2.0) * 0.15;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 1.5 * (6.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vAlpha = 0.15 + 0.3 * sin(uTime + position.y * 3.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float glow = 1.0 - d * 2.0;
          gl_FragColor = vec4(uColor, glow * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const scatterPoints = new THREE.Points(scatterGeo, scatterMat)
    scene.add(scatterPoints)

    // Connecting lines from center to vertices
    const vertexPositions = icoGeo.attributes.position.array
    const uniqueVerts = []
    const seen = new Set()
    for (let i = 0; i < vertexPositions.length; i += 3) {
      const key = `${vertexPositions[i].toFixed(2)},${vertexPositions[i+1].toFixed(2)},${vertexPositions[i+2].toFixed(2)}`
      if (!seen.has(key)) {
        seen.add(key)
        uniqueVerts.push(vertexPositions[i], vertexPositions[i+1], vertexPositions[i+2])
      }
    }

    const pulseLineGeo = new THREE.BufferGeometry()
    const pulseLinePos = new Float32Array(uniqueVerts.length * 2)
    for (let i = 0; i < uniqueVerts.length / 3; i++) {
      // From center
      pulseLinePos[i * 6] = 0
      pulseLinePos[i * 6 + 1] = 0
      pulseLinePos[i * 6 + 2] = 0
      // To vertex
      pulseLinePos[i * 6 + 3] = uniqueVerts[i * 3]
      pulseLinePos[i * 6 + 4] = uniqueVerts[i * 3 + 1]
      pulseLinePos[i * 6 + 5] = uniqueVerts[i * 3 + 2]
    }
    pulseLineGeo.setAttribute("position", new THREE.BufferAttribute(pulseLinePos, 3))

    const pulseLineMat = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
    })
    const pulseLines = new THREE.LineSegments(pulseLineGeo, pulseLineMat)
    scene.add(pulseLines)

    // Mouse tracking for subtle tilt
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handleMouseMove = e => {
      const rect = mount.getBoundingClientRect()
      mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    mount.addEventListener("mousemove", handleMouseMove)

    // Animation
    let animId
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // Rotate shapes
      icoWireframe.rotation.x = t * 0.12 + mouse.y * 0.3
      icoWireframe.rotation.y = t * 0.18 + mouse.x * 0.3
      innerMesh.rotation.x = t * 0.12 + mouse.y * 0.3
      innerMesh.rotation.y = t * 0.18 + mouse.x * 0.3
      pulseLines.rotation.x = t * 0.12 + mouse.y * 0.3
      pulseLines.rotation.y = t * 0.18 + mouse.x * 0.3

      outerWireframe.rotation.x = -t * 0.06 + mouse.y * 0.15
      outerWireframe.rotation.y = -t * 0.09 + mouse.x * 0.15

      // Pulse the inner glow
      innerMat.opacity = 0.03 + Math.sin(t * 1.5) * 0.02

      // Pulse line opacity
      pulseLineMat.opacity = 0.04 + Math.sin(t * 2) * 0.03

      // Rotate rings
      ringParticles.forEach((ring, i) => {
        ring.points.rotation.y += ring.speed * 0.008
        ring.points.rotation.x += ring.speed * 0.003
      })

      // Breathing scale
      const breathe = 1 + Math.sin(t * 0.8) * 0.03
      icoWireframe.scale.setScalar(breathe)
      innerMesh.scale.setScalar(breathe)
      pulseLines.scale.setScalar(breathe)

      // Scatter particles time
      scatterMat.uniforms.uTime.value = t

      // Scatter gentle rotation
      scatterPoints.rotation.y = t * 0.05
      scatterPoints.rotation.x = Math.sin(t * 0.3) * 0.1

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animId)
      mount.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      // Dispose geometries and materials
      ;[icoGeo, icoEdges, outerGeo, outerEdges, scatterGeo, pulseLineGeo].forEach(g => g.dispose())
      ;[icoMat, innerMat, outerMat, scatterMat, pulseLineMat].forEach(m => m.dispose())
      ringParticles.forEach(r => {
        r.points.geometry.dispose()
        r.points.material.dispose()
      })
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="about-visual-canvas"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        cursor: "crosshair",
      }}
    />
  )
}

export default AboutVisual
