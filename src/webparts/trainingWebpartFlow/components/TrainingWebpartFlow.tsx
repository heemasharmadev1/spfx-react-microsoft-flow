import * as React from 'react';
import styles from './TrainingWebpartFlow.module.scss';
import { ITrainingWebpartFlowProps } from './ITrainingWebpartFlowProps';
import { escape } from '@microsoft/sp-lodash-subset';
//import pnp from 'sp-pnp-js';
import { ClassTrainings } from './ClassTrainings';
import { ISPTrainingsItem } from './ITrainings';

export default class TrainingWebpartFlow extends React.Component<ITrainingWebpartFlowProps, any> {
  public constructor(props:ITrainingWebpartFlowProps,any){
    super(props);
    this.state = {
      items:[]
      };
  }

  public render(): React.ReactElement<ITrainingWebpartFlowProps> {
    return (
      <div className={ styles.trainingWebpartFlow }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>YaY SharePointers!</span>
              <p className={ styles.subTitle }>CRUD operations using React + SPFx + PnP Js + Ms Flow.</p>
              {/* <p className={ styles.description }>{escape(this.props.description)}</p> */}
              <p className={ styles.description }>{escape(this.props.listName)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
              {
                // this.state.items.map(function(item:ISPTrainingsItem){
                //   return(
                //     <div className={"ms-Grid-col ms-sm6 ms-md6 ms-lg4"}>               
                //   <div >
                //   <label className="ms-Label ms-font-xxl">{item.Title}</label>
                //   <label className="ms-Label">{item.TrainingDate}</label>
                //   <label className="ms-Label">{item.TrainingStatus}</label>
                //   <label className="ms-Label">{item.TrainingApprover}</label>                              
                //   </div>
                //   </div>
                //   )
                // })
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount(){
    debugger;
    this._getListTrainings();
  }

  private _getListTrainings():void{
  //   pnp.sp.web.lists.getByTitle(`TrainingList1`).items.get().then
  //   ((response) => {
  //     let trainingCollection = response.map(item => new ClassTrainings(item));
  //     this.setState({items:trainingCollection});
  //   }
  //   )
   }
}