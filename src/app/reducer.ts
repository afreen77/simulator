import {CommandModel, Direction, PositionModel} from "../models";
import {calculateCost, getCurrentDirection, getVisitedCoordinates} from "./functions";

export const simulatorReducer = (
    state: any,
    action: { type: string; payload: PositionModel | Map<number, string> }
) => {

    switch (action.type) {
        case "SITEMAP":
            return {
                ...state,
                sitemap: action.payload,
            };
        case "ADVANCE":
            // @ts-ignore
            const payload = action.payload as PositionModel;
            const advanceCommands = state.commandHistory.filter((a: CommandModel) => a.type === 'ADVANCE');
            const prevPosIndex = advanceCommands.length -1;
            const prevPos = advanceCommands[prevPosIndex]?.payload || { x: 0, y: 0, face: Direction.EAST };
            const visitedCoord = getVisitedCoordinates(payload,prevPos, state.sitemap);
            return {
                ...state,
                bulldozerPos: action.payload,
                commandHistory: [...state.commandHistory, { ...action, visitedCoordinates: visitedCoord }, ],
            };
        case "LEFT":
            return {
                ...state,
                bulldozerPos: {
                    ...state.bulldozerPos,
                    face: getCurrentDirection(action.type, state.bulldozerPos),
                },
                commandHistory: [...state.commandHistory, { ...action }],
            };
        case "RIGHT":
            return {
                ...state,
                bulldozerPos: {
                    ...state.bulldozerPos,
                    face: getCurrentDirection(action.type, state.bulldozerPos),
                },
                commandHistory: [...state.commandHistory, { ...action }],
            };
        case "QUIT":
            return {
                ...state,
                report: calculateCost(state.commandHistory, state.sitemap),
            };
        default:
            throw new Error('Something went wrong');
    }
};
