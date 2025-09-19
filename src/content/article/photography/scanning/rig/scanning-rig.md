---
slug: scanning-rig
title: Negative Film Scanning with a DSLR
pubDate: 2025-09-17
draft: true
---

#### *Part List*

- Nikon D5100
- Sigma 70mm f/2.8 EX DG 
- Godox LDP8Bi LED Video Light
- [3D Printed 35mm film holder](https://www.thingiverse.com/thing:4620992)
- [3D Printed stand for film holder](https://www.printables.com/model/1357811-godox-ldp8bi-negative-holder)
- [3D Printed base stand for backlight](https://www.printables.com/model/1357811-godox-ldp8bi-negative-holder)
- [3D Printed focus ring extension](https://www.printables.com/model/1360363-74mm-lens-focus-ring-extension)
- [3D Printed lens hood](https://www.printables.com/model/1419290-35mm-hood-for-negative-holder-with-74mm-diameter)


---

I put together this simple DSLR film scanning rig to re-digitize my negatives (some of the shop scans I had were horrid) and to scan my home-developed films. I chose this route because:

- I already had a DSLR lying around
- Decent scanners are expensive or hard to come by where I live
- Second-hand scanners aren’t guaranteed to last

That said, this wasn’t a straightforward path. It required research, careful planning, and some DIY work. In this blog post, I’ll walk through how I did the thing that's been done many times by other people.

---

# Requirements

The final setup had to meet a few needs:

1. **Needed** to fit 35mm films in the frame nicely. Support for 120mm would have been a huge plus.
2. **Needed** to be easy to assemble, with few moving parts, and sturdy.
3. **Needed** to be much cheaper than dedicated film scanners for all this effort to make sense.
4. **Did not need** motorization or automation. Speed is not a priority since finishing a roll takes weeks for me.

---

# The Camera

Everything had to be built around the camera I own: a **Nikon D5100**. Its 16MP APS-C sensor (not full-frame) is good enough for my needs since I don’t plan on making large prints. The swiveling screen it has is especially useful for making adjustments without doing acrobatics.

The rest of the specs are irrelevant here because they are either common in most modern digital cameras, or they don’t matter for scanning.

The biggest limitation worth mentioning is that the APS-C sensor is smaller than full-frame, which introduces some challenges, which is covered in the lens section.

---

# The Lens

I picked up a second-hand **Sigma 70mm f/2.8 EX DG** (the older non-“Art” version) from my local camera shop for around ~150 Euros.

The APS-C crop factor is 1.5x, so this lens behaves like a 105mm on a full-frame (`70mm × 1.5`). It also supports true 1:1 magnification, meaning a `5cm × 5cm` subject projects onto the sensor exactly as `5cm × 5cm`.

For a 35mm (`24cm x 26cm`) film frame would create a reflection of the same size. Since full-frame digital cameras have the exact same size for their sensors, 1:1 magnification creates an ideal scenario where you can project the film frame perfectly onto the sensor and capture all its details without zooming out. But with an APS-C sensor, the smaller size means it only covers part of that projected image (roughly 1.5× cropped). To fit the whole frame, I need to move the camera further away from the negative, which sacrifices some detail/density.

In practice, the results are still very usable. But with 120 film (medium format), which ranges from `6×4.5cm` to `6×9cm` and beyond, you’d have to move even further back. That costs more detail than I’d like. My plan is to experiment with **digital stitching** instead. I am yet to try this out, and see if it is viable and fun.

Autofocus doesn’t work with the D5100 body, but that’s irrelevant since film scanning requires manual focus anyway.

Overall, the lens is great. It is quite sharp at mid apertures (f/5.6–f/8 looks best to me), good edge performance, and no noticeable distortion or aberrations to my untrained eyes.

---

# The Copy Stand

There are many approaches for holding the camera steady in scanning setups:

- Copy stands
- Lens mounted contraptions (like Valoi)
- Rail based rigs
- Tripods with inverted columns and camera facing down

I went with a copy stand form factor because it seemed the most versatile for upgrading and adapting different parts. It is compact, stable, and solid. Stability is critical. The sensor and film plane must be perfectly parallel on all axes. Even the slightest tilt can throw parts of the frame out of focus because the depth of field at f/5.6–f/8 is razor thin, probably less than a millimeter.

To keep things stable, I built the stand with a plastic butcher block, a 3/4" threaded metal pipe, and a metal flange. The flange is screwed into the base, and the pipe goes into it. A super clamp attaches the camera to the pipe, making it easy to adjust height. Once tightened, the whole setup is very solid.

---

# The Film Plane

This is where the 3D printing comes in. There are tons of models online for film holders, negative carriers, lightboxes, adapters, etc. I tried many, and they all do somehow work but I decided to go with what **samw427** has done with [here](https://www.thingiverse.com/thing:4620992). I did so because it

# Backlight