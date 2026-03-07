import React, { useEffect, useRef } from "react"
import * as THREE from "three"

const WebGLBackground = () => {
  const mountRef = useRef(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const mount = mountRef.current
    const width = window.innerWidth
    const height = window.innerHeight

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Particle system - floating mesh grid
    const particleCount = 2000
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 80
      positions[i3 + 1] = (Math.random() - 0.5) * 80
      positions[i3 + 2] = (Math.random() - 0.5) * 40
      velocities[i3] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.005
      sizes[i] = Math.random() * 2 + 0.5
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))

    // Custom shader material for glowing particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color(0x00e5ff) },
        uColor2: { value: new THREE.Color(0x7b2ff7) },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        uniform vec2 uMouse;
        varying float vAlpha;
        varying float vColorMix;

        void main() {
          vec3 pos = position;

          // Gentle wave motion
          pos.x += sin(pos.y * 0.1 + uTime * 0.3) * 1.5;
          pos.y += cos(pos.x * 0.1 + uTime * 0.2) * 1.5;
          pos.z += sin(pos.x * 0.05 + pos.y * 0.05 + uTime * 0.15) * 2.0;

          // Mouse influence
          float mouseInfluence = smoothstep(20.0, 0.0, length(pos.xy - uMouse * 40.0));
          pos.z += mouseInfluence * 5.0;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          vAlpha = smoothstep(0.0, 1.0, 1.0 - length(mvPosition.xyz) / 60.0);
          vColorMix = sin(pos.x * 0.05 + uTime * 0.2) * 0.5 + 0.5;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vAlpha;
        varying float vColorMix;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float glow = 1.0 - dist * 2.0;
          glow = pow(glow, 3.0);

          vec3 color = mix(uColor1, uColor2, vColorMix);
          gl_FragColor = vec4(color, glow * vAlpha * 0.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Connection lines between nearby particles
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array(particleCount * particleCount * 0.01 * 6)
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    )
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    // Mouse tracking
    const mouse = { x: 0, y: 0 }
    const handleMouseMove = e => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Scroll tracking
    let scrollY = 0
    const handleScroll = () => {
      scrollY = window.scrollY
    }
    window.addEventListener("scroll", handleScroll)

    // Animation loop
    let animationId
    const clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      material.uniforms.uTime.value = elapsed
      material.uniforms.uMouse.value.set(mouse.x, mouse.y)

      // Rotate based on scroll
      particles.rotation.y = scrollY * 0.0003
      particles.rotation.x = scrollY * 0.0001
      lines.rotation.y = scrollY * 0.0003
      lines.rotation.x = scrollY * 0.0001

      // Update line connections
      const posArray = geometry.attributes.position.array
      let lineIndex = 0
      const maxConnections = linePositions.length / 6

      for (let i = 0; i < particleCount && lineIndex < maxConnections; i += 8) {
        for (
          let j = i + 8;
          j < particleCount && lineIndex < maxConnections;
          j += 8
        ) {
          const i3 = i * 3
          const j3 = j * 3
          const dx = posArray[i3] - posArray[j3]
          const dy = posArray[i3 + 1] - posArray[j3 + 1]
          const dz = posArray[i3 + 2] - posArray[j3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (dist < 12) {
            const li = lineIndex * 6
            linePositions[li] = posArray[i3]
            linePositions[li + 1] = posArray[i3 + 1]
            linePositions[li + 2] = posArray[i3 + 2]
            linePositions[li + 3] = posArray[j3]
            linePositions[li + 4] = posArray[j3 + 1]
            linePositions[li + 5] = posArray[j3 + 2]
            lineIndex++
          }
        }
      }
      lineGeometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className="webgl-background" />
}

export default WebGLBackground
