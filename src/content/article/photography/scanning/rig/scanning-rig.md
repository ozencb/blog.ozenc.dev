---
slug: scanning-rig
title: Negative film scanning with DSLR
pubDate: 2025-09-17
draft: true
---

#### *Part List*



---

I put together this simple DSLR film scanning rig to re-digitize (some of the shop scans I have are horrid) my negatives, and scan home-developed films. I went this way because:

- I had a DSLR laying around
- Decent scanners are expensive or hard to come-by where I live
- Second hand scanners are not guaranteed to not break

Going this way, though, was not very straight forward as it needed some research, careful planning, and some DIY work. In this blog I will try to write how I did the thing that's been done many times by other people.

# Need/No Need

Final result,

1. **Needed** to fit 35mm films in the frame nicely. Support for 120mm would have been a huge plus
2. **Needed** to be easy to put together,  have few moving parts, and be sturdy
3. **Needed** to be a lot cheaper than dedicated film scanners for all this to make any sense
4. **Did not need** motorization/automation. Speed is not a huge necessity since finishing a roll takes weeks for me

# The Camera

Everything had to be built around the camera I have, a **Nikon D5100**. Its 16 megapixel APS-C sensor (not full-frame) produces decent enough results since I have no plans for doing large prints. It has a swiveling screen which is nice for adjusting things without doing acrobatics. Rest of the specs and features are just details, as they either exist in most modern digital cameras or they make no difference in this context.

However, the sensor being smaller than full frame is a limiting factor, which I will talk about in the next section.

# The Lens

At the time, I was hesitant about building a DIY rig since I did not have a macro lens and I thought decent macro lenses were as expensive as scanners but I found out that our local camera shops had many budget options. After some research, I purchased a second hand **Sigma 70 mm f/2.8 EX DG** (older non "Art" version).

APS-C sensor has a crop factor of 1.5x so its full-frame equivalent would be 105mm (`70 * 1.5`). The lens itself does 1:1 magnification, which means that an object with an area of `5cm x 5cm` reflects on to the sensor as  `5cm x 5cm`; its real size. So, a 35mm (`24cm x 26cm`) film frame would create a reflection of the same size. Since full-frame digital cameras have the exact same size for their sensors, 1:1 magnification creates an ideal scenario where you can fit in the 35mm film into the viewfinder and capture all its details without zooming out. With the same object to sensor distance, if you were to take out the full frame sensor out and put in the smaller APS-C, it would only cover some part of that perfectly reflected 35mm image. 1.5x smaller precisely. That means in order to fit the whole thing into the frame, we have to move the camera further away from the film, losing some detail/density. In theory, this is far from ideal but the camera still produces perfectly usable images at this greater distance. However, in order to fit 120mm film, we need to zoom out even more since medium formats are usually 6cm x 6cm or 6cm x 9cm, sometimes even bigger. I do not have any 120mm negatives lying around at the moment, but I reckon in order to compensate the loss of quality, I will have to not zoom out but opt in for doing some digital stitching instead. Stitching requires some more effort though, so I am not sure how viable or "fun" it is yet.

The auto-focus does not work with D5100 body but film scanning requires manual focus anyway, so it was not a deal breaker.

Apart from these few disadvantages, the lens itself is great. It is very sharp in mid apertures (around 5.6 and 8 looks the best to me), edge performance is good, no visible distortions/barreling/aberrations (to my untrained eyes). Again, all other specs, features, and disadvantages can be ignored in this context.

# Copy Stand

There are many different DSLR scanner formats people use.

- Copy stands
- Lens attached contraptions (Like Valoi)
- Rail based rigs
- Tripods with inverted columns, camera facing down

I decided to go with the first one because it seemed like the most versatile design for improving and adapting different parts. It does not take much space, it is solid and stable. It is very important for the rig to not move around because the film plane and the sensor plane has to be perfectly parallel on all axes. Even the slightest deviation or tilt can result in unfocused parts in the photo, since depth-of-field is so thin. I don't have the exact measurements, but at f5.6 to f8 where the image is sharpest for this lens, the depth of field is probably within one milimeter.


The camera has to be perfectly solid and stable after leveling

# Film Plane

This is where all the 3D printing comes in. There are tons of readily available models


# Ideas To Explore
