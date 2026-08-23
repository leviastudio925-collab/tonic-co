import { readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'public/models/building.glb';
const bytes = readFileSync(file);

if (bytes.toString('ascii', 0, 4) !== 'glTF') throw new Error('Not a GLB file');
const jsonLength = bytes.readUInt32LE(12);
const jsonType = bytes.readUInt32LE(16);
if (jsonType !== 0x4e4f534a) throw new Error('Missing GLB JSON chunk');

const document = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength).replace(/[\0 ]+$/, ''));
const parentByChild = new Map();
document.nodes?.forEach((node, parent) => node.children?.forEach((child) => parentByChild.set(child, parent)));

console.table((document.nodes ?? []).map((node, index) => ({
  index,
  name: node.name ?? '',
  parent: parentByChild.get(index) ?? '',
  children: (node.children ?? []).join(','),
  mesh: node.mesh ?? '',
  translation: (node.translation ?? [0, 0, 0]).join(','),
  rotation: (node.rotation ?? [0, 0, 0, 1]).join(','),
  scale: (node.scale ?? [1, 1, 1]).join(','),
})));

