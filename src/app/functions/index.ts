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
    sitemap: Map<number, string>,
    step?: number
  ): PositionModel => {
    const newDirection = getCurrentDirection(type, currentPosition);
    let newCurrentPostion: PositionModel;
    if (type === "ADVANCE" && step) {
      switch (newDirection) {
        case Direction.EAST:
          newCurrentPostion = {
            ...currentPosition,
            y: currentPosition.y === -1 ? 0 : currentPosition.y,
            x: currentPosition.x === -1 ? step -1 : (currentPosition.x + step),
            face: newDirection,
          };
          break;
        case Direction.NORTH:
          newCurrentPostion = {
            ...currentPosition,
            x: currentPosition.x === -1  ? 0 : currentPosition.x,
            y: currentPosition.y === -1 ? 0 : currentPosition.y - step,
            face: newDirection,
          };
          break;
        case Direction.SOUTH:
          newCurrentPostion = {
            ...currentPosition,
            x: currentPosition.x === -1 ? 0 : currentPosition.x,
            y: currentPosition.y === -1 ? 0 : currentPosition.y + step,
            face: newDirection,
          };
          break;
        case Direction.WEST:
          newCurrentPostion = {
            ...currentPosition,
            y: currentPosition.y === -1 ? 0 : currentPosition.y,
            x: currentPosition.x === -1 ? 0 : currentPosition.x - step,
            face: newDirection,
          };
          break;
      }
    } else {
      newCurrentPostion = { ...currentPosition, face: newDirection };
    }
    checkErrors(newCurrentPostion, showError, boundary, sitemap);
    return newCurrentPostion;
  };

  export const getVisitedCoordinates = (curPos: PositionModel, prevPosition: PositionModel, sitemap: Map<number, string>): Coordinates[] => {
    let coordinatesVisited: Coordinates[] = [];
    switch(curPos.face){
      case Direction.EAST:
      const X= prevPosition.x === 0 ? 0 : prevPosition.x +1; //todo look for better soln
      for (let i = X; i <= curPos.x; i++ ) {
        const char = getXYCharFromMap(i, prevPosition.y, sitemap);
        coordinatesVisited.push({x: i, y: prevPosition.y, char: char} as Coordinates)
      }
      break;
      case Direction.WEST:
        for (let i = curPos.x +1; i <= prevPosition.x; i++ ) {
          const char = getXYCharFromMap(i, prevPosition.y, sitemap);
          coordinatesVisited.push({ x: i +1 , y: prevPosition.y , char} as Coordinates)
        }
        break;
     case Direction.NORTH:
        for (let i = curPos.y +1; i <= prevPosition.y; i++ ) {
          const char = getXYCharFromMap(curPos.x, i, sitemap);
            coordinatesVisited.push({ x: curPos.x , y: i, char: char} as Coordinates)
          }
        break;  
        case Direction.SOUTH:
          for (let i = prevPosition.y +1 ; i <= curPos.y; i++ ) {
            const char = getXYCharFromMap(curPos.x, i, sitemap);
              coordinatesVisited.push({ x: curPos.x , y: i, char} as Coordinates)
            }
          break;
    }
    return coordinatesVisited

  }

  export const calculateCost = (actions: CommandModel[],
     sitemap: Map<number, string>): any[] => {
       const advanceCommands = actions.filter(a => a.type === 'ADVANCE');
       let actionCostArray: any[] = [];
       const allVisitedCoordinates = advanceCommands.map(a => a.visitedCoordinates).flat();
       advanceCommands.forEach(action => {
         actionCostArray.push(
             getActionFuelCost(action.type, action.visitedCoordinates as Coordinates[], allVisitedCoordinates),
         );
       })
    actionCostArray.push({
      name: 'Communication Overhead',
      quantity: actions.length,
      cost: actions.length
    },
        getPaintCost(allVisitedCoordinates as Coordinates[]),
        unClearedSquaresCost(allVisitedCoordinates, sitemap));

       return actionCostArray;

  }

  const getXYCharFromMap = (XPos: number, YPos: number, sitemap: Map<number, string>) => {
    const line = sitemap.get(YPos);
    const char = line?.split('')[XPos];
    return char;
}

const getActionFuelCost = (actionName: string, actionCoordinates: Coordinates[], journeyCoordinates: Coordinates[]) => {
    let accCost = 0;
  actionCoordinates.forEach(value => {
    const alreadyCleared = journeyCoordinates.filter(jC => jC.x === value.x && jC.y === value.y).length > 1
    const cost = getSquareFuelCost(value, alreadyCleared);
    accCost = accCost + cost;
  });
  return { name: `Fuel Usage - ${actionName}`, quanity: actionCoordinates.length, cost: accCost };
}

const unClearedSquaresCost = (journeyCoordinates: Coordinates[], sitemap: Map<number, string>) => {
  let unVisitedSquares: any = []
  sitemap.forEach((xString, y) => {
    const xArray = xString.split('');
    xArray.map((x, i) => {
      if (journeyCoordinates.filter(jC => jC.x === i && jC.y === y).length === 0) {
        unVisitedSquares.push({ x: i, y });
      }
    })
  })
  if(unVisitedSquares.length > 0) {
    return { name: 'Uncleared squares', quantity: unVisitedSquares.length, cost: (10 + unVisitedSquares.length * 3) }
  } else {
    return { name: 'Uncleared squares', quantity: 0, cost: 0 };
  }
}

const getSquareFuelCost = (pV: Coordinates, cleared: boolean):number => {
  return ((pV.char === 't' || pV.char === 'r') && !cleared) ? 2 : 1;
}

const getPaintCost = (clearedSquares: Coordinates[]) => {
    let paintDamage = 0;
    let damageSquaresCnt = 0;
    clearedSquares.forEach(v => {
    if(v.char === 't')
    {
      paintDamage = paintDamage + 2;
      damageSquaresCnt++;
    };
  })

    return { name: 'Paint Damage to bulldozer', quantity: damageSquaresCnt, cost: paintDamage  }
}

const checkErrors = (pos: PositionModel, showError: (message: string) => void, boundary: { x: number; y: number },sitemap: Map<number, string>) => {
  const currentChar = getXYCharFromMap(pos.x, pos.y, sitemap);
  if(currentChar === 'T') {
    showError('You have hit the protected tree, Simulation ends !!');
  }
  if (pos.x >= boundary.x || pos.x <= -1 || pos.y >= boundary.y || pos.y <= -1) {
    showError('You have tried to go beyond the sitemap boundaries, Simulation ends !!');
  }

}
