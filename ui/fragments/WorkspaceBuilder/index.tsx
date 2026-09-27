"use client";

import * as THREE from "three";
import { Catalog } from "@/constants/CatalogRecord";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { cn } from "@/tools/cn";
import { WorkspaceSummary } from "./WorkspaceSummary";
import { WorkspaceStage } from "./WorkspaceStage";
import { WorkspacePalette } from "./WorkspacePalette";

export default function WorkspaceBuilder() {
  const glbTemplatesRef = useRef<Record<string, THREE.Object3D>>({});

  const [activeCategory, setActiveCategory] = useState<Catalog.Type>(
    Catalog.Type.Desk,
  );

  const categoryItems = useMemo(
    () => Catalog.ITEMS.filter((item) => item.type === activeCategory),
    [activeCategory],
  );

  const stageWrapRef = useRef<HTMLDivElement | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const floorRef = useRef<THREE.Mesh | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const placedRef = useRef<Catalog.PlacedItem[]>([]);
  const selectedRef = useRef<Catalog.PlacedItem | null>(null);
  const selectionBoxRef = useRef<THREE.BoxHelper | null>(null);

  const azimuthRef = useRef(Math.PI / 4);
  const polarRef = useRef(1.0);
  const radiusRef = useRef(340);

  const targetRef = useRef(new THREE.Vector3(0, 25, 0));

  const pointerModeRef = useRef<"pending" | "dragItem" | "orbit" | null>(null);

  const pointerStartRef = useRef({
    x: 0,
    y: 0,
  });

  const pointerCameraStartRef = useRef({
    azimuth: 0,
    polar: 0,
  });

  const dragGroupRef = useRef<THREE.Group | null>(null);

  const [placed, setPlaced] = useState<Catalog.PlacedItem[]>([]);
  const [selected, setSelected] = useState<Catalog.PlacedItem | null>(null);

  const [glbLoading, setGlbLoading] = useState(true);

  const total = useMemo(
    () => placed.reduce((sum, item) => sum + item.def.price, 0),
    [placed],
  );

  const isReady = useMemo(() => placed.length > 0, [placed]);

  const updateCamera = useCallback(() => {
    const camera = cameraRef.current;

    if (!camera) return;

    const target = targetRef.current;

    const azimuth = azimuthRef.current;
    const polar = polarRef.current;
    const radius = radiusRef.current;

    camera.position.set(
      target.x + radius * Math.sin(polar) * Math.sin(azimuth),

      target.y + radius * Math.cos(polar),

      target.z + radius * Math.sin(polar) * Math.cos(azimuth),
    );

    camera.lookAt(target);
  }, []);

  const resizeRenderer = useCallback(() => {
    const stage = stageWrapRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    if (!stage || !camera || !renderer) return;

    const width = stage.clientWidth;
    const height = stage.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, []);

  const getNDC = useCallback((clientX: number, clientY: number) => {
    const renderer = rendererRef.current;

    if (!renderer) return;

    const rect = renderer.domElement.getBoundingClientRect();

    mouseRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;

    mouseRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  const raycastFloor = useCallback(
    (clientX: number, clientY: number): THREE.Vector3 | null => {
      const camera = cameraRef.current;
      const floor = floorRef.current;
      const raycaster = raycasterRef.current;

      if (!camera || !floor) return null;

      getNDC(clientX, clientY);

      raycaster.setFromCamera(mouseRef.current, camera);

      const hit = raycaster.intersectObject(floor)[0];

      return hit ? hit.point : null;
    },
    [getNDC],
  );

  const raycastGroup = useCallback(
    (clientX: number, clientY: number): THREE.Group | null => {
      const camera = cameraRef.current;
      const raycaster = raycasterRef.current;

      if (!camera) return null;

      getNDC(clientX, clientY);

      raycaster.setFromCamera(mouseRef.current, camera);

      const meshes: THREE.Object3D[] = [];

      placedRef.current.forEach((item) => {
        item.group.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) {
            meshes.push(object);
          }
        });
      });

      const hit = raycaster.intersectObjects(meshes, false)[0];

      if (!hit) return null;

      return hit.object.userData.root ?? null;
    },
    [getNDC],
  );

  const selectItem = useCallback((group: THREE.Group | null) => {
    const scene = sceneRef.current;

    if (!scene) return;

    const oldBox = selectionBoxRef.current;

    if (oldBox) {
      scene.remove(oldBox);
      selectionBoxRef.current = null;
    }

    const entry =
      placedRef.current.find((item) => item.group === group) ?? null;

    selectedRef.current = entry;
    setSelected(entry);

    if (entry) {
      const box = new THREE.BoxHelper(entry.group, 0xb5533c);

      scene.add(box);

      selectionBoxRef.current = box;
    }
  }, []);

  const buildItem = useCallback(
    (def: Catalog.Item, x: number, z: number): Catalog.BuiltItem | null => {
      const scene = sceneRef.current;

      if (!scene) return null;

      let built: Catalog.BuiltItem;

      if (def.kind === "glb") {
        if (!def.asset) return null;

        const template = glbTemplatesRef.current[def.asset];

        if (!template) return null;

        const group = new THREE.Group();

        group.add(template.clone(true));

        built = {
          group,
          baseY: 0,
        };
      } else {
        built = Catalog.buildProcedural(def);
      }

      built.group.position.x = x;
      built.group.position.z = z;
      built.group.position.y = built.baseY;

      built.group.rotation.y = Math.random() * 0.3 - 0.15;

      built.group.traverse((object) => {
        object.userData.root = built.group;
      });

      scene.add(built.group);

      return built;
    },
    [],
  );

  const addItem = useCallback(
    (def: Catalog.Item, x: number, z: number): Catalog.PlacedItem | null => {
      const built = buildItem(def, x, z);

      if (!built) return null;

      const entry: Catalog.PlacedItem = {
        group: built.group,
        def,
        baseY: built.baseY,
      };

      placedRef.current.push(entry);
      setPlaced([...placedRef.current]);

      return entry;
    },
    [buildItem],
  );

  const moveSelected = useCallback((x: number, y: number) => {
    const current = selectedRef.current;

    if (!current) return;

    current.group.position.x += x;
    current.group.position.y += y;

    selectionBoxRef.current?.update();
  }, []);

  const removeSelected = useCallback(() => {
    const scene = sceneRef.current;
    const current = selectedRef.current;

    if (!scene || !current) return;

    scene.remove(current.group);

    placedRef.current = placedRef.current.filter((item) => item !== current);

    selectedRef.current = null;
    setSelected(null);
    setPlaced([...placedRef.current]);

    const box = selectionBoxRef.current;

    if (box) {
      scene.remove(box);
      selectionBoxRef.current = null;
    }
  }, []);

  const rotateSelected = useCallback((amount: number) => {
    const current = selectedRef.current;
    const box = selectionBoxRef.current;

    if (!current) return;

    current.group.rotation.y += amount;

    box?.update();
  }, []);

  const scaleSelected = useCallback((factor: number) => {
    const current = selectedRef.current;
    const box = selectionBoxRef.current;

    if (!current) return;

    const scale = current.group.scale.x;

    const nextScale = Math.max(0.5, Math.min(1.8, scale * factor));

    current.group.scale.setScalar(nextScale);

    box?.update();
  }, []);

  /*
   * THREE.JS INITIALIZATION
   */
  useEffect(() => {
    const stage = stageWrapRef.current;

    if (!stage) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 1, 3000);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.shadowMap.enabled = true;

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    renderer.domElement.style.display = "block";

    renderer.domElement.style.width = "100%";

    renderer.domElement.style.height = "100%";

    renderer.domElement.style.touchAction = "none";

    stage.appendChild(renderer.domElement);

    /*
     * LIGHTING
     */
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));

    const sun = new THREE.DirectionalLight(0xffffff, 0.9);

    sun.position.set(120, 220, 140);

    sun.castShadow = true;

    sun.shadow.mapSize.set(1024, 1024);

    sun.shadow.camera.left = -200;
    sun.shadow.camera.right = 200;
    sun.shadow.camera.top = 200;
    sun.shadow.camera.bottom = -200;

    scene.add(sun);

    /*
     * FLOOR
     */
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(220, 48),
      new THREE.MeshStandardMaterial({
        color: 0xe7d9bc,
        roughness: 0.95,
      }),
    );

    floor.rotation.x = -Math.PI / 2;

    floor.receiveShadow = true;

    floorRef.current = floor;

    scene.add(floor);

    /*
     * GRID
     */
    scene.add(new THREE.PolarGridHelper(220, 8, 8, 64, 0xd9cbae, 0xd9cbae));

    updateCamera();
    resizeRenderer();

    /*
     * LOAD GLB CHAIR
     */
    const loader = new GLTFLoader();
    const assets = Object.values(Catalog.Asset);

    let loaded = 0;

    assets.forEach((asset) => {
      loader.load(
        asset,
        (gltf) => {
          const object = gltf.scene;

          object.traverse((child) => {
            const mesh = child as THREE.Mesh;

            if (mesh.isMesh) {
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(object);
          const size = new THREE.Vector3();

          box.getSize(size);

          if (size.y > 0) {
            object.scale.setScalar(46 / size.y);
          }

          const normalizedBox = new THREE.Box3().setFromObject(object);

          object.position.y -= normalizedBox.min.y;

          glbTemplatesRef.current[asset] = object;

          loaded += 1;

          if (loaded === assets.length) {
            setGlbLoading(false);
          }
        },
        undefined,
        (error) => {
          console.error(`GLB failed to load: ${asset}`, error);

          loaded += 1;

          if (loaded === assets.length) {
            setGlbLoading(false);
          }
        },
      );
    });

    /*
     * ANIMATION LOOP
     */
    let animationFrame = 0;

    const loop = () => {
      animationFrame = requestAnimationFrame(loop);

      const currentBox = selectionBoxRef.current;

      if (currentBox) {
        currentBox.update();
      }

      renderer.render(scene, camera);
    };

    loop();

    const handleResize = () => {
      resizeRenderer();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", handleResize);

      renderer.dispose();

      renderer.domElement.remove();

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;

        if (mesh.geometry) {
          mesh.geometry.dispose();
        }

        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });

      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      floorRef.current = null;
    };
  }, [resizeRenderer, updateCamera]);

  /*
   * POINTER CONTROLS
   */
  useEffect(() => {
    const renderer = rendererRef.current;

    if (!renderer) return;

    const canvas = renderer.domElement;

    const handlePointerDown = (event: PointerEvent) => {
      pointerStartRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      pointerCameraStartRef.current = {
        azimuth: azimuthRef.current,
        polar: polarRef.current,
      };

      dragGroupRef.current = raycastGroup(event.clientX, event.clientY);

      pointerModeRef.current = "pending";

      canvas.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const start = pointerStartRef.current;

      const dx = event.clientX - start.x;

      const dy = event.clientY - start.y;

      const mode = pointerModeRef.current;

      if (mode === "pending" && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
        pointerModeRef.current = dragGroupRef.current ? "dragItem" : "orbit";
      }

      if (pointerModeRef.current === "dragItem") {
        const group = dragGroupRef.current;

        if (!group) return;

        const point = raycastFloor(event.clientX, event.clientY);

        if (!point) return;

        point.x = Math.max(-100, Math.min(100, point.x));

        point.z = Math.max(-100, Math.min(100, point.z));

        group.position.x = point.x;

        group.position.z = point.z;

        selectionBoxRef.current?.update();
      }

      if (pointerModeRef.current === "orbit") {
        const startCamera = pointerCameraStartRef.current;

        azimuthRef.current = startCamera.azimuth - dx * 0.008;

        polarRef.current = Math.max(
          0.35,
          Math.min(1.45, startCamera.polar - dy * 0.006),
        );

        updateCamera();
      }
    };

    const handlePointerUp = () => {
      if (pointerModeRef.current === "pending") {
        selectItem(dragGroupRef.current);
      }

      pointerModeRef.current = null;
      dragGroupRef.current = null;
    };

    canvas.addEventListener("pointerdown", handlePointerDown);

    canvas.addEventListener("pointermove", handlePointerMove);

    canvas.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);

      canvas.removeEventListener("pointermove", handlePointerMove);

      canvas.removeEventListener("pointerup", handlePointerUp);
    };
  }, [raycastFloor, raycastGroup, selectItem, updateCamera]);

  /*
   * WHEEL ZOOM
   */
  useEffect(() => {
    const stage = stageWrapRef.current;

    if (!stage) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      radiusRef.current = Math.max(
        140,
        Math.min(520, radiusRef.current + event.deltaY * 0.4),
      );

      updateCamera();
    };

    stage.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      stage.removeEventListener("wheel", handleWheel);
    };
  }, [updateCamera]);

  /*
   * DRAG & DROP
   */
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    def: Catalog.Item,
  ) => {
    event.dataTransfer.setData("application/json", JSON.stringify(def));

    event.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    event.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const raw = event.dataTransfer.getData("application/json");

    if (!raw) return;

    let def: Catalog.Item;

    try {
      def = JSON.parse(raw) as Catalog.Item;
    } catch {
      return;
    }

    const point =
      raycastFloor(event.clientX, event.clientY) ?? new THREE.Vector3(0, 0, 0);

    const x = Math.max(-100, Math.min(100, point.x));

    const z = Math.max(-100, Math.min(100, point.z));

    const entry = addItem(def, x, z);

    if (entry) {
      selectItem(entry.group);
    }
  };

  return (
    <main
      className={cn(
        "grid h-[calc(100vh-89px)]",
        "grid-cols-[260px_minmax(0,1fr)_280px]",
        "overflow-hidden bg-[#eee7d8]",
      )}
    >
      <WorkspacePalette
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryItems={categoryItems}
        glbLoading={glbLoading}
        handleDragStart={handleDragStart}
      />

      <WorkspaceStage
        stageWrapRef={stageWrapRef}
        selected={selected}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        rotateSelected={rotateSelected}
        scaleSelected={scaleSelected}
        moveSelected={moveSelected}
        removeSelected={removeSelected}
      />

      <WorkspaceSummary placed={placed} total={total} isReady={isReady} />
    </main>
  );
}
