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

export interface CommandModel {
  type: 'ADVANCE' | 'LEFT' | 'RIGHT' | 'QUIT';
  step?: number
}

export interface ActionModel {
  type: string;
  payload: PositionModel;
}

export const initBulldozerPos = { x: 0, y: 0, face: Direction.EAST };

export interface simulatorState {
  bulldozerPos: PositionModel;
  commandHistory: ActionModel[];
  report:[]
}
export const initialState = {
  bulldozerPos: initBulldozerPos,
  commandHistory: [],
  report: []
};
