import {PositionModel, Coordinates, Direction, CommandModel} from "../../models";

export const getCurrentDirection = (
    type: string,
    position: PositionModel
  ): Direction => {
    if (type === "ADVANCE") {
      return position.face;
    }
    if (type === "LEFT")
      switch (position.face) {
        case Direction.EAST:
          return Direction.NORTH;
        case Direction.NORTH:
          return Direction.WEST;
        case Direction.SOUTH:
          return Direction.EAST;
        case Direction.WEST:
          return Direction.SOUTH;
      }
    if (type === "RIGHT")
      switch (position.face) {
        case Direction.EAST:
          return Direction.SOUTH;
        case Direction.NORTH:
          return Direction.EAST;
        case Direction.SOUTH:
          return Direction.WEST;
        case Direction.WEST:
          return Direction.NORTH;
      }
    return Direction.EAST;
  };
  
  export const getXYCoordinate = (
    type: "ADVANCE" | "LEFT" | "RIGHT" | "QUIT",
    currentPosition: PositionModel,
    boundary: { x: number; y: number },
    showError: (message: string) => void,
    step?: number
  ): PositionModel => {
    const newDirection = getCurrentDirection(type, currentPosition);
    if (type === "ADVANCE" && step) {
      switch (newDirection) {
        case Direction.EAST:
          if (currentPosition.x + step  > boundary.x) {
            showError("Out of Sitemap boundary");
          }
          return {
            ...currentPosition,
            x: currentPosition.x === 0 ? (currentPosition.x + step -1) : (currentPosition.x + step),
            face: newDirection,
          };
        case Direction.NORTH:
          if (currentPosition.y + step  > boundary.y) {
            showError("Out of Sitemap boundary");
          }
          return {
            ...currentPosition,
            y: currentPosition.y - step,
            face: newDirection,
          };
        case Direction.SOUTH:
          if (currentPosition.y + step  > boundary.y) {
            showError("Out of Sitemap boundary");
          }
          return {
            ...currentPosition,
            y: currentPosition.y + step,
            face: newDirection,
          };
        case Direction.WEST:
          if (currentPosition.x + step  > boundary.x) {
            showError("Out of Sitemap boundary");
          }
          return {
            ...currentPosition,
            x: currentPosition.x - step,
            face: newDirection,
          };
      }
    } else {
      return { ...currentPosition, face: newDirection };
    }
  };

  export const getVisitedCoordinates = (curPos: PositionModel, prevPosition: PositionModel, sitemap: Map<number, string>): Coordinates[] => {
    let coordinatesVisited: Coordinates[] = [];
    switch(curPos.face){
      case Direction.EAST:
      for (let i = prevPosition.x; i <= curPos.x; i++ ) {
        const character = getXYCharFromMap(i, prevPosition.y, sitemap);
        coordinatesVisited.push({x: i, y: prevPosition.y, char: character} as Coordinates)
      }
      break;
      case Direction.WEST:
        for (let i = curPos.x; i <= prevPosition.x; i++ ) {
          const character = getXYCharFromMap(i, prevPosition.y, sitemap);
          coordinatesVisited.push({ x: i , y: prevPosition.y, char: character} as Coordinates)
        }
        break;
     case Direction.NORTH:
        for (let i = curPos.y; i <= prevPosition.y; i++ ) {
          const character = getXYCharFromMap(curPos.x, i, sitemap);
            coordinatesVisited.push({ x: curPos.x , y: i, char: character} as Coordinates)
          }
        break;  
        case Direction.SOUTH:
          for (let i = prevPosition.y; i <= curPos.y; i++ ) {
            const character = getXYCharFromMap(curPos.x, i, sitemap);
              coordinatesVisited.push({ x: curPos.x , y: i, char: character} as Coordinates)
            }
          break;
    }
    return coordinatesVisited

  }

  export const calculateCost = (actions: CommandModel[],
     sitemap: Map<number, string>): any[] => {
       const advanceCommands = actions.filter(a => a.type === 'ADVANCE');
       const directionCommands = actions.filter(a => ['LEFT', 'RIGHT'].includes(a.type));
       console.log(directionCommands);
       let actionCostArray: any[] = [];
       const allVisitedCoordinates = advanceCommands.map(a => a.visitedCoordinates).flat();
       advanceCommands.forEach(action => {
         actionCostArray.push({ name: `Move ${action.step} ${action.type} `,
           fuelCost: getActionCost(action.visitedCoordinates as Coordinates[], allVisitedCoordinates)});
       })
       return actionCostArray;

  }

  const getXYCharFromMap = (XPos: number, YPos: number, sitemap: Map<number, string>) => {
    const line = sitemap.get(YPos);
    const char = line?.split('')[XPos];
    return char;
}

const getActionCost = (actionCoordinates: Coordinates[], journeyCoordinates: Coordinates[]) => {
    let accCost = 0;
  actionCoordinates.forEach(value => {
    const alreadyCleared = journeyCoordinates.filter(jC => jC.x === value.x && jC.y === value.y).length > 1
    const cost = getFuelCost(value, alreadyCleared);
    accCost = accCost + cost;
  });
  return accCost;
}


const getFuelCost = (pV: Coordinates, cleared: boolean):number => {
  return ((pV.char === 't' || pV.char === 'r') && !cleared) ? 2 : 1;
}




