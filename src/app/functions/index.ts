import { PositionModel, CommandModel, Direction, initBulldozerPos, ActionModel } from "../../models";

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
    step?: number
  ): PositionModel => {
    const newDirection = getCurrentDirection(type, currentPosition);
    if (type === "ADVANCE" && step) {
      switch (newDirection) {
        case Direction.EAST:
          if (currentPosition.x + step  > boundary.x) {
            throw Error("Out of Sitemap boundary");
          }
          return {
            ...currentPosition,
            x: currentPosition.x + step,
            face: newDirection,
          };
        case Direction.NORTH:
          if (currentPosition.y + step  > boundary.y) {
            throw Error("Out of Sitemap boundary");
          }
          return {
            ...currentPosition,
            y: currentPosition.y - step,
            face: newDirection,
          };
        case Direction.SOUTH:
          if (currentPosition.y + step  > boundary.y) {
            throw Error("Out of Sitemap boundary");
          }
          return {
            ...currentPosition,
            y: currentPosition.y + step,
            face: newDirection,
          };
        case Direction.WEST:
          if (currentPosition.x + step  > boundary.x) {
            throw Error("Out of Sitemap boundary");
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

  interface Coordinates {
    x: number;
    y: number;
  }

  const getVisitedCoordinates = (curPos: PositionModel, prevPosition: PositionModel): Coordinates[] => {
    let coordinatesVisited = [];
    switch(curPos.face){
      case Direction.EAST:
      for (let i = prevPosition.x; i <= curPos.x; i++ ) {
        coordinatesVisited.push({ x: i , y: prevPosition.y})
      }
      break;
      case Direction.WEST:
        for (let i = prevPosition.x; i <= curPos.x; i++ ) {
          coordinatesVisited.push({ x: i , y: prevPosition.y})
        }
        break;
     case Direction.NORTH:
        for (let i = curPos.y; i <= prevPosition.y; i++ ) {
            coordinatesVisited.push({ x: curPos.x , y: i})
          }
        break;  
        case Direction.SOUTH:
          for (let i = prevPosition.y; i <= curPos.y; i++ ) {
              coordinatesVisited.push({ x: curPos.x , y: i})
            }
          break;
    }
    return coordinatesVisited

  }

  export const calculateCost = (actions: ActionModel[],
     sitemap: Map<number, string>): number => {
       let totalCoordVisited: any[] = [];
       const advanceCommands = actions.filter(a => a.type === 'ADVANCE');
       advanceCommands.forEach((a, index) => {
         let actionCoordVisited = [];
         if(index === 0) {
          actionCoordVisited = getVisitedCoordinates(a.payload, { x: 0, y: 0, face: Direction.EAST});
         } else {
          actionCoordVisited = getVisitedCoordinates(a.payload, advanceCommands[index -1].payload);
         }
          console.log('coord per action', actionCoordVisited);
          console.log('action', a)

        totalCoordVisited = [...totalCoordVisited, ...actionCoordVisited]
        
console.log(totalCoordVisited);

       })
       
  
       return 230;

  }