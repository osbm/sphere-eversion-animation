import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

function get_geometry_from_coordinates(coordinates, obj) {
    var geometry = new THREE.BufferGeometry();

    var indices = [];
    var v_count = obj.v_count;
    var u_count = obj.u_count;
    for (var i = 0; i < u_count; i++) {
        for (var j = 0; j < v_count; j++) {
            var index = i * (v_count +1) + j;
            indices.push(index, index + 1, index + v_count+1);
            indices.push(index + v_count+1, index + 1, index + v_count+1 + 1);
        }
    }
    coordinates = coordinates.map(coord => [coord.x, coord.y, coord.z]).flat()
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(coordinates, 3))
    geometry.setIndex(indices);
    return geometry;
}


function complete_mirror(geometry, obj) {
    // first mirror the geometry 
    var geometry_clone = geometry.clone();
    // geometry_clone.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, -1));
    // instead of mirroring, jusr rotate the geometry by 180 degrees
    geometry_clone.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI));

    // merge the two geometries
    var merged = BufferGeometryUtils.mergeGeometries([geometry, geometry_clone]);
    
    // now i have apple slice of the sphere. I just need to copy rotate it by some angle and merge it with the original geometry
    var angle = 2 * Math.PI / obj.num_strips;

    var num_rotataions = obj.num_strips - 1;
    var rotated_geometry = merged.clone();
    for (var i = 0; i < num_rotataions; i++) {
        rotated_geometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(angle));
        merged = BufferGeometryUtils.mergeGeometries([merged, rotated_geometry]);
    }

    return merged;
}

export { get_geometry_from_coordinates, complete_mirror }