import { ref, onMounted } from "vue";
//threejs本体
import * as THREE from "three";
//GLTF加载器
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
//webGpu
import WebGPU from "three/addons/capabilities/WebGPU.js";
import WebGPURenderer from "three/addons/renderers/webgpu/WebGPURenderer.js";

//控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



// import { timerLocal, oscSine, output } from "three/examples/jsm/nodes/Nodes.js";

export const useThreeJs = () => {
  /** 容器 */
  let container = ref<HTMLElement | null>(null);
  /** 场景 */
  let scene: THREE.Scene = {} as THREE.Scene;
  /** 相机 */
  let camera = {} as THREE.PerspectiveCamera;
  /** 渲染器 */
  let renderer = {} as any;
  /** 控制器 */
  let controls = {} as OrbitControls;

  /**
   * 检查webGPU是否可用
   */
  const checkWebGpu = async () => {
    if (WebGPU.isAvailable() === false) {
      document.body.appendChild(WebGPU.getErrorMessage());
      throw "No WebGPU support";
    }
    console.log("webGPU可用");
  };

  /**
   * 初始化场景
   */
  const initScene = async () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("lightblue");
  };

  /**
   * 初始化相机
   */
  const initCamera = async () => {
    if (!container) {
      // ElMessage.error("场景容器不存在");
      throw new Error("场景容器不存在");
    }
    const { clientWidth, clientHeight } = container.value!;
    camera = new THREE.PerspectiveCamera(
      75,
      clientWidth / clientHeight,
      0.1,
      100000
    );
    camera.position.copy(new THREE.Vector3(10, 10, 10));
    camera.lookAt(new THREE.Vector3(0, 0, 0));
  };

  /**
   * 初始化控制器
   */
  const initControls = async () => {
    if (!camera || !scene) {
      // ElMessage.error("相机或场景不存在");
      throw new Error("相机或场景不存在");
    }
    controls = new OrbitControls(camera, container.value!);
    controls.minDistance = 0.1;
    controls.maxDistance = 10000;
    // controls.maxPolarAngle = Math.PI / 2.1;
    controls.update();
  };

  const initRenderer = async () => {
    renderer = new WebGPURenderer({ antialias: true });
    // renderer = new THREE.WebGLRenderer({ antialias: true });
    //设置渲染器的大小
    const { clientWidth, clientHeight } = container.value!;
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.toneMappingNode = toneMapping( THREE.LinearToneMapping, .15 );
    //添加到容器
    container.value!.appendChild(renderer.domElement);

    renderer.setAnimationLoop(render);
  };

  /** 渲染*/
  const render = () => {
    if (controls) {
      //   console.log("更新渲染器");
      controls.update();
    }
    if (scene && camera && renderer) {
      renderer.render(scene, camera);
    }
  };

  const loadModel = async () => {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        "/RobotExpressive.glb",
        (gltf) => {
          const object = gltf.scene;
          object.scale.set(1, 1, 1);
          scene.add(object);
          resolve("ok");
        },
        (_xhr) => {
          //   console.log(xhr);
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  const initLight = async () => {
    //创建灯光
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 5);
    dirLight.position.set(20, 20, 10);
    dirLight.shadow.mapSize.set(4096, 4096);
    scene.add(dirLight);
  };

  const test = async () => {
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    const size = 100;
    const divisions = 100;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
  };

  onMounted(async () => {
    try {
      await checkWebGpu();
      await initScene();
      await initCamera();
      await initLight();
      await initRenderer();
      await initControls();

      await test();

      setTimeout( async ()=>{
        await loadModel();
      },2000)

    } catch (e) {
      console.log(e);
    }
  });

  return {
    container,
  };
};
