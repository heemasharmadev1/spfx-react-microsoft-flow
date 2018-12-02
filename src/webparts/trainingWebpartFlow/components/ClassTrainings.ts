import {ISPTrainingsItem} from './ITrainings';

export class ClassTrainings{
    public Title: string;
    public TrainingDate: Date;
    public TrainingStatus: string;
    public TrainingApprover: string;

    constructor(item: ISPTrainingsItem){
        this.Title = item.Title;
        this.TrainingDate = item.TrainingDate;
        this.TrainingStatus = item.TrainingStatus;
        this.TrainingApprover = item.TrainingApprover;
    }
}