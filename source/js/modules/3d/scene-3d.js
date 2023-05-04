import * as THREE from 'three';
import {vertexShader} from './vertex-shader.js';
import {fragmentShader} from './fragment-shader.js';

export default class Scene3D {
  constructor(options) {
    this.canvasId = options.canvasId;
    this.width = options.width;
    this.height = options.height;
    this.aspectRation = this.width / this.height;
    this.alpha = options.alpha;
    this.backgroundColor = options.backgroundColor;
    this.fov = options.cameraOptions.fov;
    this.near = options.cameraOptions.near;
    this.far = options.cameraOptions.far;
    this.positionZ = options.cameraOptions.positionZ;
    this.textures = options.textures;
    this.stepScene = options.stepScene;
    this.render = this.render.bind(this);
  }

  init() {
    this.canvas = document.getElementById(this.canvasId);
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.scene = new THREE.Scene();
    this.color = new THREE.Color(this.backgroundColor);

    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspectRation, this.near, this.far);
    this.camera.position.z = this.positionZ;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas
    });
    this.renderer.setClearColor(this.color, this.alpha);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    const loadManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadManager);
    const loadedTextures = this.textures.map((texture) => textureLoader.load(texture.url));
    const geometry = new THREE.PlaneGeometry(1, 1);

    loadManager.onLoad = () => {
      loadedTextures.forEach((texture, i) => {
        const material = new THREE.RawShaderMaterial({
          uniforms: {
            map: {
              value: texture
            },
            hueShift: {
              value: this.textures[i].hue
            },
            circles: {
              value: this.textures[i].isCircles
            },
            paramArrayCircles: {
              value: [
                {
                  sphere: this.textures[i].paramCircles[0].sphere,
                  centerX: this.textures[i].paramCircles[0].centerX,
                  centerY: this.textures[i].paramCircles[0].centerY
                },
                {
                  sphere: this.textures[i].paramCircles[1].sphere,
                  centerX: this.textures[i].paramCircles[1].centerX,
                  centerY: this.textures[i].paramCircles[1].centerY
                },
                {
                  sphere: this.textures[i].paramCircles[2].sphere,
                  centerX: this.textures[i].paramCircles[2].centerX,
                  centerY: this.textures[i].paramCircles[2].centerY
                },
              ]
            }
					},
          vertexShader: vertexShader,
					fragmentShader: fragmentShader
        });

        const image = new THREE.Mesh(geometry, material);
        image.scale.x = this.textures[i].scaleX;
        image.scale.y = this.textures[i].scaleY;
        image.position.x = this.stepScene * i + this.textures[i].positionX;
        image.position.y = this.textures[i].positionY;
        this.scene.add(image);
      });
      this.render();
    };
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  setViewScene(i) {
    this.camera.position.x = this.stepScene * i;
    this.render();
  }
}
