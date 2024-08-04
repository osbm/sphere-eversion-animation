
# Thurston's sphere eversion algorithm

![Animation of Thurston's sphere eversion](thurstons-sphere-eversion.gif)


Ported to javascript and visualized using [three.js](https://threejs.org/).

Here is the famous explainer video [Outside In](https://www.youtube.com/watch?v=wO61D9x6lNY). And more info about the source C++ program [here](https://profs.etsmtl.ca/mmcguffin/eversion/)

From what i can tell this algorithm almost forgotten on the internet. Almost 3/4 of the links i find are dead. I hope this project can help keep it alive.

## Credits

From the [original cpp code](https://github.com/osbm/sphereEversion-0.4-src/blob/main/generateGeometry.cpp#L2-L13) that generates the geometry:

```
This file is part of "sphereEversion",
a program by Michael McGuffin.
The code in this file was almost entirely taken
(with slight adaptations) from the source code of
"evert", a program written by Nathaniel Thurston.
evert's source code can be down loaded from
    http://www.geom.umn.edu/docs/outreach/oi/software.html
    http://www.geom.uiuc.edu/docs/outreach/oi/software.html

Grateful acknowledgements go out to Nathaniel Thurston,
Silvio Levy, and the Geometry Center (University of Minnesota)
for making evert's source code freely available to the public.
```

Initially i just ported the C++ code to the Javascript as you can see [here](https://github.com/osbm/sphere-eversion-animation/tree/basic_version). But with the contributions of [Joseph Faulkner](https://github.com/josephmfaulkner) this project has come to life. Please check him out, he is awesome. :)

## Try it Yourself

If you want to play with this app without downloading the source code, here's a demo link:  [Sphere Eversion Demo](https://osmanbayram.com/sphere-eversion-animation/)

## Up and running

### Requirements
You don't necessarily need these same versions, but I'm listing the ones I used:
- git (version 2.34.1)
- node (version 21.4.0)
- npm (version 10.2.4)

### Commands

```
git clone https://github.com/osbm/sphere-eversion-animation.git
cd sphere-eversion-animation
npm install
npm start
```
