import * as THREE from "three";

export namespace Catalog {
  export const Type = {
    Desk: "desk",
    Chair: "chair",
    Monitor: "monitor",
    Lamp: "lamp",
    Plant: "plant",
  } as const;

  export type Type = (typeof Type)[keyof typeof Type];

  export type Item = {
    type: Type;
    name: string;
    price: number;
    image: string;
    color: string;
    kind: "procedural" | "glb";
    asset?: string;
  };

  export type BuiltItem = {
    group: THREE.Group;
    baseY: number;
  };

  export type PlacedItem = {
    group: THREE.Group;
    def: Item;
    baseY: number;
  };

  export const formatRupiah = (value: number) =>
    `Rp ${value.toLocaleString("id-ID")}`;

  function createMaterial(color: string) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.6,
      metalness: 0.05,
    });
  }

  function createMesh(
    geometry: THREE.BufferGeometry,
    color: string,
    x: number,
    y: number,
    z: number,
  ) {
    const mesh = new THREE.Mesh(geometry, createMaterial(color));

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    return mesh;
  }

  export function buildProcedural(def: Catalog.Item): Catalog.BuiltItem {
    switch (def.type) {
      case Catalog.Type.Desk: {
        const group = new THREE.Group();

        group.add(
          createMesh(new THREE.BoxGeometry(90, 4, 44), def.color, 0, 42, 0),
        );

        const legs: Array<[number, number]> = [
          [-40, -18],
          [40, -18],
          [-40, 18],
          [40, 18],
        ];

        legs.forEach(([x, z]) => {
          group.add(
            createMesh(new THREE.BoxGeometry(4, 42, 4), "#3E2C23", x, 20, z),
          );
        });

        return {
          group,
          baseY: 0,
        };
      }

      case Catalog.Type.Monitor: {
        const group = new THREE.Group();

        group.add(
          createMesh(new THREE.BoxGeometry(3, 2, 10), def.color, 0, 3, 0),
        );

        group.add(
          createMesh(
            new THREE.CylinderGeometry(2, 2, 10, 10),
            def.color,
            0,
            9,
            0,
          ),
        );

        group.add(
          createMesh(new THREE.BoxGeometry(38, 24, 2), def.color, 0, 28, 0),
        );

        group.add(
          createMesh(new THREE.PlaneGeometry(34, 20), "#7FA0B0", 0, 28, 1.05),
        );

        return {
          group,
          baseY: 44,
        };
      }

      case Catalog.Type.Lamp: {
        const group = new THREE.Group();

        group.add(
          createMesh(
            new THREE.CylinderGeometry(8, 8, 2, 16),
            "#3E2C23",
            0,
            1,
            0,
          ),
        );

        group.add(
          createMesh(
            new THREE.CylinderGeometry(1.5, 1.5, 26, 8),
            "#3E2C23",
            0,
            15,
            0,
          ),
        );

        const arm = createMesh(
          new THREE.CylinderGeometry(1.3, 1.3, 22, 8),
          "#3E2C23",
          9,
          26,
          0,
        );

        arm.rotation.z = Math.PI / 3.2;
        group.add(arm);

        group.add(
          createMesh(new THREE.ConeGeometry(7, 10, 16), def.color, 18, 36, 0),
        );

        return {
          group,
          baseY: 44,
        };
      }

      case Catalog.Type.Plant: {
        const group = new THREE.Group();

        group.add(
          createMesh(
            new THREE.CylinderGeometry(9, 7, 14, 12),
            "#C9A876",
            0,
            7,
            0,
          ),
        );

        group.add(
          createMesh(new THREE.IcosahedronGeometry(13, 0), def.color, 0, 24, 0),
        );

        return {
          group,
          baseY: 0,
        };
      }

      default:
        throw new Error(`Unsupported item type: ${def.type}`);
    }
  }

  export const buildName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1);

  export const Asset = {
    Chair: "/models/chair.glb",
    WoodChair: "/models/wood-chair.glb",
    FlatMonitor: "/models/flat-tv.glb",
    VintageMonitor: "/models/vintage-monitor.glb",
    VintageTable: "/models/vintage-table.glb",
    DeskLamp: "/models/desk-lamp.glb",
    Lamp: "/models/lamp.glb",
    HousePlant: "/models/house-plant.glb",
  } as const;

  export const AssetImages = {
    Beautilia: "/images/beautilia.png",
    Chair: "/images/chair.png",
    DeskLamp: "/images/desk-lamp.png",
    FlatMonitor: "/images/flat-monitor.png",
    Lamp: "/images/lamp.png",
    Monstera: "/images/monstera.png",
    RattanTable: "/images/rattan-table.png",
    VintageMonitor: "/images/vintage-monitor.png",
    VintageTable: "/images/vintage-table.png",
    WoodChair: "/images/wood-chair.png",
  } as const;

  export const ITEMS: Item[] = [
    {
      type: Type.Desk,
      name: "Rattan Desk",
      price: 450000,
      color: "#C9A876",
      image: AssetImages.RattanTable,
      kind: "procedural",
    },
    {
      type: Type.Desk,
      name: "Vintage Desk",
      price: 500000,
      color: "#C9A876",
      image: AssetImages.VintageTable,
      kind: "glb",
      asset: Asset.VintageTable,
    },
    {
      type: Type.Chair,
      name: "Wood Chair",
      price: 280000,
      color: "#E2E2E2",
      image: AssetImages.WoodChair,
      kind: "glb",
      asset: Asset.WoodChair,
    },
    {
      type: Type.Chair,
      name: "Office Chair",
      price: 280000,
      color: "#4A6741",
      image: AssetImages.Chair,
      kind: "glb",
      asset: Asset.Chair,
    },
    {
      type: Type.Monitor,
      name: 'Flat Monitor 27"',
      price: 280000,
      color: "#241A14",
      image: AssetImages.FlatMonitor,
      kind: "glb",
      asset: Asset.FlatMonitor,
    },
    {
      type: Type.Monitor,
      name: 'Vintage Monitor 27"',
      price: 280000,
      color: "#241A14",
      image: AssetImages.VintageMonitor,
      kind: "glb",
      asset: Asset.VintageMonitor,
    },
    {
      type: Type.Lamp,
      name: "Lamp",
      price: 60000,
      color: "#B5533C",
      image: AssetImages.Lamp,
      kind: "glb",
      asset: Asset.Lamp,
    },
    {
      type: Type.Lamp,
      name: "Desk Lamp",
      price: 60000,
      color: "#B5533C",
      image: AssetImages.DeskLamp,
      kind: "glb",
      asset: Asset.DeskLamp,
    },
    {
      type: Type.Plant,
      name: "Monstera",
      price: 40000,
      color: "#4A6741",
      image: AssetImages.Monstera,
      kind: "procedural",
    },
    {
      type: Type.Plant,
      name: "Beautilia",
      price: 40000,
      color: "#4A6741",
      image: AssetImages.Beautilia,
      kind: "glb",
      asset: Asset.HousePlant,
    },
  ];
}
