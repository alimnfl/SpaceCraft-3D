# 3D Workspace Builder

An interactive 3D workspace configurator built with **Next.js, React, TypeScript, and Three.js**.

Users can browse workspace items, drag them into a 3D scene, move and rotate them, adjust their scale, and inspect the estimated total rental price.

**Live site:** https://desent.alimnfl.com
**Linkedin:** https://linkedin.com/in/alimnfl
**Personal Website:** https://alimnfl.com

## Features

- Interactive 3D workspace scene
- GLB model loading with `GLTFLoader`
- Procedurally generated 3D objects using Three.js geometries
- Categorized workspace item palette
- Drag-and-drop items into the scene
- Click to select objects
- Move selected objects
- Rotate and scale selected objects
- Delete selected objects
- Orbit camera controls
- Scroll-to-zoom
- Automatic model normalization
- Shadows and basic scene lighting
- Real-time workspace summary and pricing
- Type-safe catalog definitions with TypeScript

## Tech Stack

- **Next.js**
- **React**
- **TypeScript**
- **Three.js**
- **GLTF / GLB**
- **Tailwind CSS**

## 3D Assets

The builder uses two types of 3D objects.

### GLB Models

Some catalog items are loaded from `.glb` assets using Three.js's `GLTFLoader`.

```ts
const loader = new GLTFLoader();

loader.load(asset, (gltf) => {
  const object = gltf.scene;
});
```

Loaded models are normalized based on their height before being placed into the workspace so that different source models have a consistent scale.

### Procedural Models

Some objects are generated directly with Three.js instead of using external model files.

For example, a desk can be constructed from several `BoxGeometry` meshes:

```ts
new THREE.BoxGeometry(90, 4, 44);
new THREE.BoxGeometry(4, 42, 4);
```

Other procedural objects use geometries such as:

- `BoxGeometry`
- `CylinderGeometry`
- `ConeGeometry`
- `IcosahedronGeometry`
- `PlaneGeometry`

This keeps simple objects lightweight while allowing more detailed assets to use GLB models.

## Architecture

The workspace is separated into several React components:

```text
WorkspaceBuilder
├── WorkspacePalette
├── WorkspaceStage
└── WorkspaceSummary
```

### `WorkspaceBuilder`

The main controller for the 3D experience.

It handles:

- Three.js scene initialization
- Camera configuration
- Renderer lifecycle
- Lighting
- Floor and grid
- GLB loading
- Object placement
- Object selection
- Object manipulation
- Pointer interactions
- Drag and drop
- Camera orbit
- Zoom
- Scene cleanup

### `WorkspacePalette`

Displays the available catalog items and categories.

Items can be dragged from the palette into the 3D workspace.

### `WorkspaceStage`

Contains the Three.js canvas and workspace controls.

It handles the visual interaction area where users can:

- Orbit around the workspace
- Zoom
- Drag objects
- Select objects
- Drop new objects

### `WorkspaceSummary`

Displays the currently placed items, total price, and workspace readiness state.

## Catalog

Catalog data is kept separately from the rendering logic.

Each item defines information such as:

```ts
type Item = {
  type: Type;
  name: string;
  price: number;
  kind: "glb" | "procedural";
  asset?: string;
  color?: string;
};
```

This allows the UI to treat GLB and procedural objects consistently while the builder decides how each object should be created.

## Interaction Model

### Camera

The camera uses spherical coordinates:

- **Azimuth** — horizontal rotation
- **Polar** — vertical rotation
- **Radius** — zoom distance

Dragging an empty area of the scene orbits the camera.

Scrolling changes the camera radius to zoom in and out.

### Object Selection

Objects are detected using a Three.js `Raycaster`.

When an object is selected, a `THREE.BoxHelper` is added around it to provide a visual selection indicator.

### Object Movement

Dragging a selected object performs a raycast against the workspace floor.

The resulting world position is used to move the object while keeping it inside the workspace bounds.

### Object Transformation

Selected objects can be:

- Moved
- Rotated
- Scaled
- Removed

Scaling is constrained between `0.5x` and `1.8x`.

## Project Structure

A simplified structure looks like:

```text
app/
├── ...
│
ui/
├── WorkspaceBuilder/
│   ├── index.tsx
│   ├── WorkspacePalette.tsx
│   ├── WorkspaceStage.tsx
│   └── WorkspaceSummary.tsx
│
constants/
├── CatalogRecord.ts
│
tools/
├── cn.ts
│
public/
├── images/
│   └── *.png
├── models/
│   └── *.glb
│
```

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Build

Create a production build:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

## Notes

The Three.js scene is initialized on the client because WebGL and browser APIs are required.

The workspace builder therefore uses:

```tsx
"use client";
```

Three.js resources are also explicitly disposed during component cleanup to avoid unnecessary GPU and memory usage when the component is unmounted.

## Design Approach

The implementation intentionally combines **external 3D assets** and **procedural geometry**.

GLB is useful when an object requires a more detailed or realistic model, while procedural geometry is useful for simple objects that can be represented efficiently with basic Three.js primitives.

The result is a flexible catalog system where adding a new item does not require changing the main workspace interaction logic.
