# Map Layer & Testimony Simulator

A thinking tool for **you** (the solo dev) to design and test the `[LOCATION]` testimony mechanic before writing game code.

## What it models

Your described mechanic: an entity has coordinates at a given time. The map is divided into named layers (medbay, security, cafeteria, ...). The testimony system looks up which layer contains those coordinates and emits:

> I saw PURPLE at MEDBAY

If the coordinates fall outside every layer, it emits:

> I saw PURPLE at UNKNOWN LOCATION

This tool lets you:
1. **Draw map layers** as rectangles on a canvas — name them (medbay, security, etc.) and give them colors
2. **Add sightings** — an entity name, a time, and X/Y coordinates
3. **See the generated testimony** for every sighting, resolved live against your layers
4. **Export JSON** with your layers, sightings, and the testimony rules

## Context of use

You're doing everything yourself, web-only, and both games are still in conceptualization. This isn't a player-facing feature — it's a **design sketchpad**. Use it while you're figuring out:

- How big should medbay be relative to security?
- If Purple is at (320, 180) at 13PM, does that fall inside medbay or the corridor?
- What should the system say when coordinates match no layer?

Once the layer geometry and testimony templates feel right, export the JSON and use it as the data shape your game code reads.

## How to use

Open `index.html` in any browser. No build step, no dependencies.

1. Click-drag on the canvas to draw a layer rectangle. Name it (e.g. `medbay`) and pick a color.
2. Add sightings: entity name (`PURPLE`), time (`13PM`), coordinates (`320, 180`).
3. Each sighting shows the testimony it would generate (`I saw PURPLE at MEDBAY` or `UNKNOWN LOCATION`).
4. Click a layer on the canvas or in the list to select/edit it.
5. Export the JSON when the layout and testimony look correct.

## Example flow

```
Layer: medbay      (rect: 200,100 → 400,300)
Layer: security    (rect: 450,50 → 650,250)

Sighting: PURPLE at 13PM, coords (320, 180)
→ Inside medbay → "I saw PURPLE at MEDBAY"

Sighting: ORANGE at 14PM, coords (700, 400)
→ Outside all layers → "I saw ORANGE at UNKNOWN LOCATION"
```

---

Built as part of the [Meridian](https://github.com/trabar-tech/Meridian) toolset.