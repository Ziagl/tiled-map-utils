import { CubeCoordinates, Direction, Grid, Hex, hexToOffset } from 'honeycomb-grid';
import { BaseTile } from './models/BaseTile';

export class Utils {
  // converts a 1d array of numbers to a 2d array of numbers
  public static convertTo2DArray(map: number[], rows: number, cols: number): number[][] {
    const twoDArray: number[][] = [];
    for (let i = 0; i < rows; i++) {
      twoDArray[i] = map.slice(i * cols, (i + 1) * cols);
    }
    return twoDArray;
  }

  // randomly shuffles an array
  public static shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j]!;
        array[j] = temp!;
    }
  }

  // get all neighbors of given tile (pointy layout)
    public static neighbors(grid: Grid<BaseTile>, coordinates: CubeCoordinates) :BaseTile[] {
        let neighbors:BaseTile[] = [];
        const directions:Direction[] = [Direction.NE, Direction.E, Direction.SE, Direction.SW, Direction.W, Direction.NW];

        directions.forEach(direction => {
            if(grid.neighborOf(coordinates, direction, { allowOutside: false }) !== undefined) {
                let tile = grid.neighborOf(coordinates, direction);
                switch(direction) {
                    case Direction.NE: tile.coordinates = {
                        q: coordinates.q + 1, 
                        r: coordinates.r - 1,
                        s: coordinates.s,
                    }; break;
                    case Direction.E: tile.coordinates = {
                        q: coordinates.q + 1, 
                        r: coordinates.r,
                        s: coordinates.s - 1,
                    }; break;
                    case Direction.SE:  tile.coordinates = {
                        q: coordinates.q, 
                        r: coordinates.r + 1,
                        s: coordinates.s - 1,
                    };break;
                    case Direction.SW: tile.coordinates = {
                        q: coordinates.q - 1, 
                        r: coordinates.r + 1,
                        s: coordinates.s,
                    }; break;
                    case Direction.W: tile.coordinates = {
                        q: coordinates.q - 1, 
                        r: coordinates.r,
                        s: coordinates.s + 1,
                    }; break;
                    case Direction.NW: tile.coordinates = {
                        q: coordinates.q, 
                        r: coordinates.r - 1,
                        s: coordinates.s + 1,
                    }; break;
                }
                neighbors.push(tile);
            }
        });

        return neighbors;
    }

    // get all walkable neightbors
    public static walkableNeighbors(allNeighbors:BaseTile[], map:number[][]) :BaseTile[] {
        let neighbors:BaseTile[] = [];

        // filter out all not walkable neighbors
        allNeighbors.forEach((neighbor) => {
            const hex = new Hex([neighbor.coordinates.q, neighbor.coordinates.r]);
            const offset = hexToOffset(hex);
            const cost = map[offset.row]?.[offset.col];
            if(cost != undefined && cost > 0) {
                neighbors.push(neighbor);
            }
        });

        return neighbors;
    }

  // gets the stored value from map of given layer
  public static getUnitIdOnPosition(coordinates: CubeCoordinates, map: number[][], hexDefinition: any): number {
    const hex = new hexDefinition([coordinates.q, coordinates.r]);
    const offset = hexToOffset(hex);
    // @ts-ignore
    return map[offset.row][offset.col] ?? 0;
  }

  // sets the storage value of map of given layer
  public static setUnitIdOnPosition(coordinates: CubeCoordinates, map: number[][], hexDefinition: any, id: number) {
    const hex = new hexDefinition([coordinates.q, coordinates.r]);
    const offset = hexToOffset(hex);
    // @ts-ignore
    map[offset.row][offset.col] = id;
  }
}
