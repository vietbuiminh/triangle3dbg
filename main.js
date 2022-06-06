// Find the latest version by visitng https://unpkg.com

import gsap from 'gsap'
import * as THREE from 'https://unpkg.com/three@0.126.0/build/three.module.js'
import {OrbitControls} from 'https://unpkg.com/three@0.126.0/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

const gui = new dat.GUI()

const world = {
    plane: {
        width: 19,
        height: 19,
        widthSegments: 30,
        heightSegments: 30
    }
}
gui.add(world.plane, 'width', 1, 50).onChange(generatePlane)
gui.add(world.plane, 'height', 1, 50).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 50).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlane)

function generatePlane() {
    planeMesh.geometry.dispose()
    planeMesh.geometry = new THREE.PlaneGeometry(
        world.plane.width, 
        world.plane.height, 
        world.plane.widthSegments, 
        world.plane.heightSegments
    )
    const {array} = planeMesh.geometry.attributes.position

    for (let i = 0; i < array.length; i += 3) {
        const x = array[i]
        const y = array[i+1]
        const z = array[i+2]
        let randomGen = getRandomArbitrary(1, 100)
        console.log(randomGen)
        array[i + 2] = z + Math.random()
    }

    const colors = []
    for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
        colors.push(0,0.19,0.4)
}

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
}

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments)
const planeMaterial = new THREE.MeshPhongMaterial( {
    
    side: THREE.DoubleSide, 
    flatShading: THREE.FlatShading,
    vertexColors: true
} );

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

const {array} = planeMesh.geometry.attributes.position

for (let i = 0; i < array.length; i += 3) {
    const x = array[i]
    const y = array[i+1]
    const z = array[i+2]
    
    array[i] = x + Math.random() - 0.5
    array[i + 1] = y + Math.random() - 0.5
    array[i + 2] = z + Math.random()
}



//color attribute addition
const colors = []
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0,0.19,0.4)
}

planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 1)
scene.add(light)

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)
scene.add(backLight)

camera.position.z = 5
const mouse = {
    x: undefined,
    y: undefined
}

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

    raycaster.setFromCamera(mouse, camera)
    const intersect = raycaster.intersectObject(planeMesh)
    if (intersect.length > 0) {
        const {color} = intersect[0].object.geometry.attributes
        

        intersect[0].object.geometry.attributes.color.needsUpdate = true

        const initialColor = {
            r: 0,
            g: 0.19,
            b: .4
        }
        const hoverColor = {
            r: 0.1,
            g: 0.5,
            b: 1
        }
        gsap.to(hoverColor, {
            r: initialColor.r,
            g: initialColor.g,
            b: initialColor.b,
            duration: 1,
            onUpdate: () => {
                //vertice 1
                color.setX(intersect[0].face.a, hoverColor.r)
                color.setY(intersect[0].face.a, hoverColor.g)
                color.setZ(intersect[0].face.a, hoverColor.b)
                //vertice 2
                color.setX(intersect[0].face.b, hoverColor.r)
                color.setY(intersect[0].face.b, hoverColor.g)
                color.setZ(intersect[0].face.b, hoverColor.b)
                // vertice 3
                color.setX(intersect[0].face.c, hoverColor.r)
                color.setY(intersect[0].face.c, hoverColor.g)
                color.setZ(intersect[0].face.c, hoverColor.b)
                color.needsUpdate = true
            }
        })
    }
}

animate()


addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight ) * 2 + 1
})