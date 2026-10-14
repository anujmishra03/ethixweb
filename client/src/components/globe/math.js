import * as THREE from 'three';
import { INDIA_BOUNDARY, WORLD_LAND } from '../../data/geoData.js';

/**
 * Converts Geographic Latitude and Longitude to Cartesian 3D Vector3
 * @param {number} lat - Latitude in degrees (-90 to +90)
 * @param {number} lon - Longitude in degrees (-180 to +180)
 * @param {number} radius - Sphere radius
 * @returns {THREE.Vector3}
 */
export function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

/**
 * Point in polygon test using ray casting
 * @param {[number, number]} pt - [lon, lat]
 * @param {Array<[number, number]>} poly - Array of [lon, lat]
 * @returns {boolean}
 */
export function pointInPoly(pt, poly) {
  let inside = false;
  const x = pt[0];
  const y = pt[1];
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0];
    const yi = poly[i][1];
    const xj = poly[j][0];
    const yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Creates 3D Bezier curve arc points between two surface points
 * @param {THREE.Vector3} v1 - Origin vector
 * @param {THREE.Vector3} v2 - Destination vector
 * @param {number} radius - Sphere radius
 * @param {number} maxAltitude - Maximum elevation above sphere surface
 * @param {number} segments - Number of subdivisions along arc
 * @returns {{ points: THREE.Vector3[], curve: THREE.QuadraticBezierCurve3 }}
 */
export function createArc(v1, v2, radius, maxAltitude = 16, segments = 50) {
  const angle = v1.angleTo(v2);
  const mid = v1.clone().add(v2).multiplyScalar(0.5);
  // Scale altitude with angular distance (longer arcs lift higher)
  const altitude = Math.max(4, Math.sin(Math.min(Math.PI, angle)) * maxAltitude);
  mid.normalize().multiplyScalar(radius + altitude);

  const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
  const points = curve.getPoints(segments);
  return { points, curve };
}

/**
 * Generates dot matrix points for India and world continents
 * @param {number} radius - Base sphere radius
 * @param {boolean} isMobile - True to optimize particle density
 * @returns {{ indiaPoints: THREE.Vector3[], worldPoints: THREE.Vector3[] }}
 */
export function generateLandDots(radius = 100, isMobile = false) {
  const indiaPoints = [];
  const worldPoints = [];

  // 1. High density grid specifically over India's bounding box
  const step = isMobile ? 1.0 : 0.72;
  for (let lat = 8.1; lat <= 35.5; lat += step) {
    for (let lon = 68.2; lon <= 97.4; lon += step) {
      if (pointInPoly([lon, lat], INDIA_BOUNDARY)) {
        // Subtle height variance creates refined tactile presence
        const r = radius + 0.35 + (Math.sin(lat * 3) * Math.cos(lon * 3)) * 0.15;
        indiaPoints.push(latLonToVector3(lat, lon, r));
      }
    }
  }

  // 2. Uniform Fibonacci sphere distribution for other world landmasses
  const N = isMobile ? 1800 : 3600;
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    const lat = Math.asin(y) * (180 / Math.PI);
    const lon = Math.atan2(z, x) * (180 / Math.PI);

    // Skip if inside India (handled with dedicated high-density mesh above)
    if (pointInPoly([lon, lat], INDIA_BOUNDARY)) {
      continue;
    }

    // Check if on another world landmass
    let onLand = false;
    for (let k = 0; k < WORLD_LAND.length; k++) {
      if (pointInPoly([lon, lat], WORLD_LAND[k])) {
        onLand = true;
        break;
      }
    }

    if (onLand) {
      worldPoints.push(latLonToVector3(lat, lon, radius + 0.15));
    }
  }

  return { indiaPoints, worldPoints };
}

/**
 * Calculates Y rotation needed to face a specific lat/lon towards the camera (camera on +Z)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {{ rotX: number, rotY: number }}
 */
export function getFocusRotation(lat, lon) {
  const pt = latLonToVector3(lat, lon, 100);
  const angle = Math.atan2(pt.x, pt.z);
  const rotY = -angle;
  // Tilt X slightly so the target city sits at an ergonomic optical center
  const rotX = Math.max(-0.4, Math.min(0.35, (lat - 12) * 0.015));
  return { rotX, rotY };
}
