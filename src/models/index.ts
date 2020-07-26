export interface PositionModel {
    x: number,
    y: number,
    face: Direction
  }

  export enum Direction {
    'EAST' = 'East',
    'WEST' = 'West',
    'NORTH' = 'North',
    'SOUTH' = 'South'
  }

export interface Coordinates {
  x: number;
  y: number;
  char: string | '';
}

export interface CommandModel {
  type: 'ADVANCE' | 'LEFT' | 'RIGHT' | 'QUIT';
  visitedCoordinates?: Coordinates[];
  step?: number
}

export interface ActionModel {
  type: string;
  payload: PositionModel;
}

export const initBulldozerPos = { x: -1, y: -1, face: Direction.EAST };

export const initialState = {
  bulldozerPos: initBulldozerPos,
  commandHistory: [],
  report: []
};
