# Level Design Companion

A context-aware tool for solo game developers. Build a room graph, tag rooms and items, and let tag-based heatmaps suggest where things belong — instead of hard-coding every placement.

## What it addresses

You mentioned the core frustration: building a map by "hard coding" it — manually placing every wall and object without context. A wall shouldn't just be geometry; it's *one of four walls of a room connected to a corridor*. A wrench shouldn't spawn anywhere; it belongs on a shelf in a maintenance room.

This tool lets you maintain that context while you build:

- **Room graph** — Add rooms, position them freely, connect them. Each room carries tags (e.g. `maintenance`, `corridor`, `living`, `dark`).
- **Item catalog** — Define items with preferred tags and avoided tags (e.g. a `wrench` likes `maintenance` + `shelf`, avoids `living`).
- **Heatmap** — Select an item and rooms are colored by fit score: green = great fit (tag match), red = poor fit (avoided tag), plus a small clustering bonus when connected rooms already have the item.
- **Placement** — Click a room to place or remove the selected item. Placed items render as dots inside rooms.
- **Export** — Download `level-<timestamp>.json` with rooms, connections, items, and placements — ready to consume in your game engine or procedural generator.

## How to use

Open `index.html` in any browser. No build step, no dependencies.

1. **Add rooms** — name them and give them tags. Click the canvas to place a room; drag to move it.
2. **Connect rooms** — pick two rooms from the dropdowns and click Connect.
3. **Add items** — name them, list preferred tags and tags to avoid.
4. **Heatmap** — pick an item from the Placement Assistant dropdown. Rooms light up red/green by fit. Click a room to place the item there.
5. **Export** — grab the JSON and feed it into your game or proc-gen system.

## Example flow (Backrooms-style maintenance room)

```
Room: Maintenance Closet  [tags: maintenance, small, dim]
Room: Corridor            [tags: corridor, connects-maintenance]
Item: Wrench              [prefers: maintenance, shelf | avoids: living, bedroom]
```

Select the Wrench → Maintenance Closet glows green (tag match), Corridor glows neutral/grey, and any `living` rooms would glow red. Click Maintenance Closet to place the wrench. Export the JSON; your spawn algorithm reads `maintenance` + `shelf` tags and places the wrench model on a shelf mesh at runtime.

## Why this shape

- **Single HTML file** — zero setup, runs offline, easy to version-control alongside your project.
- **JSON-first** — the tool doesn't run your game; it emits data your game (or your proc-gen scripts) can read. You stay in control of the engine integration.
- **Tags over hard coordinates** — you design by *meaning* (maintenance, corridor, dark) rather than absolute coordinates, which is what lets an algorithm reason about placement later.

## Extending it

If you want to go further, natural next steps:

- **3D preview**: load simple GLTF models per item and render them in placed rooms (Three.js).
- **Proc-gen bridge**: instead of exporting static JSON, have your room-generation script POST to a local endpoint that this tool reads, so generated rooms appear in the graph as they're made.
- **Heatmap weights**: make tag-match and avoidance weights editable per item type.
- **Room templates**: save reusable room configurations (e.g. "standard maintenance room") and stamp them into the graph.

---

Built as part of the [Meridian](https://github.com/trabar-tech/Meridian) toolset.