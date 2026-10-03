DROP YOUR 3D AVATAR MODEL HERE
=============================

File name (exact):
    avatar.glb

Full path:
    public/models/avatar.glb

Then set this one line in src/data/content.ts:

    export const avatar3d = {
      modelUrl: '/models/avatar.glb',

Rules for the file
------------------
- Format: .glb (binary glTF). Not .obj, not .gltf.
- Size: UNDER 2 MB. The site checks this and refuses anything bigger.
- Style: stylized / low-poly is ideal. It is a stylized avatar, NOT a
  scan of a real face and not a photoreal likeness.
- Geometry: keep the mesh simple. Fewer triangles and no textures over
  ~1024px is what keeps the file small.
- Pose: it is auto-centred and auto-scaled to fit the viewer, so the file
  does not need to be positioned by hand. Facing forward looks best.
- Materials: plain colours work fine. PBR metal/rough maps are what push
  a file over 2 MB.

How to check the size before uploading
--------------------------------------
    ls -la public/models/avatar.glb

What happens after you add it
-----------------------------
- The About page keeps showing the blueprint poster first.
- A "Turn on 3D" button appears over it once you scroll to it.
- Tapping that button loads three.js only at that moment and your model
  appears. Drag to rotate, tap the dots for gamer details.
- Nothing else on the site changes, and no other page gets heavier.
