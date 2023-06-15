import * as THREE from 'three';
import {getLathePoints, getLatheDegrees} from './three-utils';
import {reflection3D} from './data-3d';
import {RoadCustomMaterial} from './road-custom-material';
import {isMobile} from './../helpers.js';

export default class Road extends THREE.Group {
  constructor() {
    super();

    this.widthBase = 160;
    this.thicknessBase = 3;
    this.innerRadiusBase = 732;
    this.startDeg = 0;
    this.finishDeg = 90;
    this.isShadow = !isMobile();

    this.constructChildren();
  }

  constructChildren() {
    this.addRoad();
  }

  addRoad() {
    const points = getLathePoints(this.widthBase, this.thicknessBase, this.innerRadiusBase);
    const {start, length} = getLatheDegrees(this.startDeg, this.finishDeg);
    const material = new RoadCustomMaterial({
      metalness: reflection3D.soft.metalness,
      roughness: reflection3D.soft.roughness,
    });
    const geometry = new THREE.LatheGeometry(points, 50, start, length);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = this.isShadow;
    this.add(mesh);
  }
}
