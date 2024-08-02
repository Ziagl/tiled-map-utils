import { Grid, HexOffset, Orientation, defineHex, rectangle } from 'honeycomb-grid';
import { Utils } from '../main/Utils';
import { BaseTile } from '../main/models/BaseTile';

test('shuffle', () => {
  const originalArray = [1, 2, 3, 4, 5];
  const shuffledArray = [...originalArray]; // Create a copy to compare later
  Utils.shuffle(shuffledArray);

  // Check if the shuffled array has the same elements as the original
  expect(shuffledArray).toHaveLength(originalArray.length);
  originalArray.forEach((item) => {
    expect(shuffledArray).toContain(item);
  });
});
test('neighbors', () => {
  const grid = new Grid(BaseTile, rectangle({ width: 4, height: 4 }));
  // a hex field has normally 6 neighbors
  let neighbors = Utils.neighbors(grid, { q: 1, r: 1, s: -2 });
  expect(neighbors.length).toBe(6);
  // except on the corner
  neighbors = Utils.neighbors(grid, { q: 0, r: 0, s: 0 });
  expect(neighbors.length).toBe(2);
  // or borders
  neighbors = Utils.neighbors(grid, { q: 1, r: 0, s: -1 });
  expect(neighbors.length).toBe(4);
});
test('walkableNeighbors', () => {
  let exampleMap: number[] = [2, 1, 1, 2, 1, 0, 0, 1, 2, 0, 0, 1, 1, 1, 1, 1];
  const map = Utils.convertTo2DArray(exampleMap, 4, 4);
  const grid = new Grid(BaseTile, rectangle({ width: 4, height: 4 }));
  // test a tile in the middle
  let neighbors = Utils.neighbors(grid, { q: 1, r: 1, s: -2 });
  expect(neighbors.length).toBe(6);
  let walkableNeighbors = Utils.walkableNeighbors(neighbors, map);
  expect(walkableNeighbors.length).toBe(3);
  // check border
  neighbors = Utils.neighbors(grid, { q: 1, r: 0, s: -1 });
  expect(neighbors.length).toBe(4);
  walkableNeighbors = Utils.walkableNeighbors(neighbors, map);
  expect(walkableNeighbors.length).toBe(3);
});
test('getUnitOnPosition', () => {
  const exampleLayer = [
    [2, 0],
    [0, 0],
  ];
  const hexDefinition = defineHex({ offset: -1 as HexOffset, orientation: Orientation.POINTY });
  let value = Utils.getUnitIdOnPosition({ q: 0, r: 0, s: 0 }, exampleLayer, hexDefinition);
  expect(value).toBe(2);
  value = Utils.getUnitIdOnPosition({ q: 1, r: 0, s: 0 }, exampleLayer, hexDefinition);
  expect(value).toBe(0);
});
test('setUnitOnPosition', () => {
  const exampleLayer = [
    [0, 0],
    [0, 0],
  ];
  const hexDefinition = defineHex({ offset: -1 as HexOffset, orientation: Orientation.POINTY });
  const newValue = 3;
  Utils.setUnitIdOnPosition({ q: 0, r: 0, s: 0 }, exampleLayer, hexDefinition, newValue);
  expect(exampleLayer[0]?.[0]).toBe(newValue);
});
