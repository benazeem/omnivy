"use client"

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function ThreeScene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x73a1b2, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
 
    const existingCanvas = mountRef.current.querySelector('canvas')
    if (existingCanvas) { 
      mountRef.current.removeChild(existingCanvas)
    }

    renderer.domElement.classList.add('three-scene-canvas')
 
    const widthFactor = 0.65
    const initialWidth = (mountRef.current.clientWidth || 400) * widthFactor
    const initialHeight = mountRef.current.clientHeight || 400
    renderer.setSize(Math.floor(initialWidth), Math.floor(initialHeight)) 
    renderer.domElement.style.width = `${widthFactor * 100}%`
    renderer.domElement.style.height = '100%'
    mountRef.current.appendChild(renderer.domElement)

    const createObsidianGeometry = () => {
      const geometry = new THREE.BufferGeometry()

      const vertices = new Float32Array([
        // Top vertices (narrow end)
        0,
        2.0,
        0, // 0 - top point
        -0.3,
        1.7,
        0.2, // 1 - top left front
        0.3,
        1.7,
        0.2, // 2 - top right front
        0.3,
        1.7,
        -0.2, // 3 - top right back
        -0.3,
        1.7,
        -0.2, // 4 - top left back

        // Upper middle vertices
        -0.8,
        1.0,
        0.5, // 5 - upper left front
        0.8,
        1.0,
        0.5, // 6 - upper right front
        0.8,
        1.0,
        -0.5, // 7 - upper right back
        -0.8,
        1.0,
        -0.5, // 8 - upper left back

        // Middle vertices (widest part)
        -1.2,
        0.2,
        0.8, // 9 - middle left front
        1.2,
        0.2,
        0.8, // 10 - middle right front
        1.2,
        0.2,
        -0.8, // 11 - middle right back
        -1.2,
        0.2,
        -0.8, // 12 - middle left back

        // Lower vertices
        -0.9,
        -0.8,
        0.6, // 13 - lower left front
        0.9,
        -0.8,
        0.6, // 14 - lower right front
        0.9,
        -0.8,
        -0.6, // 15 - lower right back
        -0.9,
        -0.8,
        -0.6, // 16 - lower left back

        // Bottom vertices (pointed end)
        -0.4,
        -1.5,
        0.3, // 17 - bottom left front
        0.4,
        -1.5,
        0.3, // 18 - bottom right front
        0.4,
        -1.5,
        -0.3, // 19 - bottom right back
        -0.4,
        -1.5,
        -0.3, // 20 - bottom left back

        0,
        -2.2,
        0, // 21 - bottom point
      ])

      // Define faces to create the Obsidian-like faceted structure
      const indices = new Uint16Array([
        // Top pyramid faces
        0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1,

        // Top to upper middle faces
        1, 5, 6, 1, 6, 2, 2, 6, 7, 2, 7, 3, 3, 7, 8, 3, 8, 4, 4, 8, 5, 4, 5, 1,

        // Upper middle to middle faces
        5, 9, 10, 5, 10, 6, 6, 10, 11, 6, 11, 7, 7, 11, 12, 7, 12, 8, 8, 12, 9,
        8, 9, 5,

        // Middle to lower faces
        9, 13, 14, 9, 14, 10, 10, 14, 15, 10, 15, 11, 11, 15, 16, 11, 16, 12,
        12, 16, 13, 12, 13, 9,

        // Lower to bottom faces
        13, 17, 18, 13, 18, 14, 14, 18, 19, 14, 19, 15, 15, 19, 20, 15, 20, 16,
        16, 20, 17, 16, 17, 13,

        // Bottom pyramid faces
        17, 21, 18, 18, 21, 19, 19, 21, 20, 20, 21, 17,

        // Additional diagonal faces for more complex geometry
        1, 9, 5, 2, 6, 10, 3, 11, 7, 4, 8, 12,

        // Cross faces for internal structure
        5, 13, 9, 6, 10, 14, 7, 15, 11, 8, 12, 16,
      ])
      geometry.setIndex(new THREE.BufferAttribute(indices, 1))
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      geometry.computeVertexNormals()

      return geometry
    } 

    const obsidianGroup = new THREE.Group() 
    const obsidianGeometry = createObsidianGeometry()
 
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9)
    scene.add(hemi)

    const dir = new THREE.DirectionalLight(0xffffff, 0.9)
    dir.position.set(5, 10, 7)
    dir.castShadow = true
    dir.shadow.camera.left = -10
    dir.shadow.camera.right = 10
    dir.shadow.camera.top = 10
    dir.shadow.camera.bottom = -10
    dir.shadow.mapSize.width = 1024
    dir.shadow.mapSize.height = 1024
    scene.add(dir)

    const ambient = new THREE.AmbientLight(0xffffff, 0.12)
    scene.add(ambient)

    // PMREM environment for realistic lighting/reflections (dynamic import)
    const pmrem = new THREE.PMREMGenerator(renderer)
    pmrem.compileEquirectangularShader()
    let envMap: THREE.Texture | null = null
    import('three/examples/jsm/environments/RoomEnvironment')
      .then(({ RoomEnvironment }) => {
        const roomEnv = new RoomEnvironment()
        envMap = pmrem.fromScene(roomEnv, 0.04).texture
        scene.environment = envMap
        pmrem.dispose()
      })
      .catch(() => {
        // If examples aren't available, keep lights-only fallback
        try {
          pmrem.dispose()
        } catch (e) {
          // ignore
        }
      })
 
    const mainMaterial = new THREE.MeshStandardMaterial({
      color: 0x4f46e5, // indigo-600
      roughness: 0.18,
      metalness: 0.12,
      emissive: 0xff6b6b, // reddish accent
      emissiveIntensity: 0.12,
      transparent: false,
      opacity: 1,
    })

    const mainObsidian = new THREE.Mesh(obsidianGeometry, mainMaterial)
    mainObsidian.castShadow = true
    mainObsidian.receiveShadow = true
    obsidianGroup.add(mainObsidian)

    const edges = new THREE.EdgesGeometry(obsidianGeometry)
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      linewidth: 0.001,
      transparent: false,
      opacity: 1,
      depthTest: true,
    })
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial)
    obsidianGroup.add(edgeLines)

    scene.add(obsidianGroup)

    camera.position.set(1, 1, 4)
    camera.lookAt(0, 0, 0)

    // Edge color/hover and raycaster setup (declare before animate to avoid TDZ)
    // Use indigo base and reddish hover color
    let baseEdgeHex = 0x4f46e5 // indigo-600
    const hoverEdgeHex = 0xff6b6b // warm reddish
    const baseEdgeColor = new THREE.Color(baseEdgeHex)
    const hoverEdgeColor = new THREE.Color(hoverEdgeHex)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let isHovering = false
    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObject(mainObsidian, true)
      isHovering = intersects.length > 0
    }
    const onPointerLeave = () => {
      isHovering = false
    }
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerleave', onPointerLeave)

    // Animation loop
    let time = 0
    let rafId: number | null = null
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      time += 0.01

      // Gentle continuous rotation
      obsidianGroup.rotation.y += 0.0075
      // Subtle pitch bob and float
      obsidianGroup.rotation.x = Math.sin(time * 0.35) * 0.045
      obsidianGroup.position.y = Math.sin(time * 1.6) * 0.09
      obsidianGroup.position.x = Math.sin(time * 1.3) * 0.06
      // Slight breathing scale for a lively effect
      const scale = 1 + Math.sin(time * 1.2) * 0.01
      obsidianGroup.scale.set(scale, scale, scale)

      // Edge color/opacity animation based on hover (isHovering updated by pointer events)
      const lerpTarget = isHovering ? hoverEdgeColor : baseEdgeColor
      edgeMaterial.color.lerp(lerpTarget, 0.08)
      const baseOpacity = 0.55
      const hoverPulse = isHovering ? 0.25 * (0.5 + 0.5 * Math.sin(time * 8)) : 0
      edgeMaterial.opacity = Math.max(0.15, 0.95 * baseOpacity + hoverPulse)

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      if (mountRef.current) {
        const width = (mountRef.current.clientWidth || 400) * widthFactor
        const height = mountRef.current.clientHeight || 400
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(Math.floor(width), height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      }
    }

    const setThemeColors = (isDark: boolean) => {
      if (!mainMaterial) return
      if (isDark) {
        mainMaterial.color.setHex(0x0f1724) // deep cool base
        mainMaterial.emissive.setHex(0x06223a)
        mainMaterial.roughness = 0.28
        mainMaterial.metalness = 0.06
        baseEdgeHex = 0x38bdf8
        renderer.domElement.style.filter = 'contrast(1.12) saturate(1.2)'
      } else {
        mainMaterial.color.setHex(0x2b3f96) // brighter blue in light mode
        mainMaterial.emissive.setHex(0x001228)
        mainMaterial.roughness = 0.22
        mainMaterial.metalness = 0.02
        baseEdgeHex = 0x2563eb
        renderer.domElement.style.filter = 'contrast(1.05) saturate(1.05)'
      }
      baseEdgeColor.setHex(baseEdgeHex)
      mainMaterial.needsUpdate = true
      edgeMaterial.needsUpdate = true
    }
 
    const htmlEl = document.documentElement
    const applyTheme = () => {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const hasDarkClass = htmlEl.classList.contains('dark')
      setThemeColors(hasDarkClass || prefersDark)
    }

    applyTheme()

    const themeObserver = new MutationObserver(() => applyTheme())
    themeObserver.observe(htmlEl, { attributes: true, attributeFilter: ['class'] })
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)')
    const mqHandler = () => applyTheme()
    if (mq && mq.addEventListener) mq.addEventListener('change', mqHandler)
    else if (mq && (mq as any).addListener) (mq as any).addListener(mqHandler)


    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      // Cancel animation frame loop
      if (typeof rafId === 'number') {
        cancelAnimationFrame(rafId)
      }

      if (mountRef.current) {
        if (mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement)
        }
        mountRef.current.innerHTML = ''
      }

      // Dispose renderer resources
      try {
        renderer.forceContextLoss()
      } catch (e) {
        // ignore
      }
      renderer.dispose()

      // Clean up geometries, materials, and listeners
      obsidianGeometry.dispose()
      if (mainMaterial) mainMaterial.dispose()
      edgeMaterial.dispose()
      if (edges) edges.dispose()
      if (edgeLines && edgeLines.geometry) edgeLines.geometry.dispose()

      // Dispose environment map if present
      try {
        if (scene.environment && (scene.environment as any).dispose) (scene.environment as any).dispose()
      } catch (e) {
        // ignore
      }

      // Remove interaction listeners
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
      themeObserver.disconnect()
      if (mq && mq.removeEventListener) mq.removeEventListener('change', mqHandler)
      else if (mq && (mq as any).removeListener) (mq as any).removeListener(mqHandler)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="flex justify-center items-center w-full h-96 min-h-[200px] rounded-lg overflow-hidden three-scene-container"
    />
  )
}
