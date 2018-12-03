import {ITrainingsItem} from './ITrainingsItem';

export interface ITrainingWebpartFlowState{
    status: string;
    items: ITrainingsItem[];
}