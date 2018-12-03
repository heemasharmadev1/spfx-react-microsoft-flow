import * as React from 'react';
import styles from './TrainingWebpartFlow.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

import {ITrainingWebpartFlowProps} from './ITrainingWebpartFlowProps';
import {ITrainingWebpartFlowState} from './ITrainingWebpartFlowState';
import { ITrainingsItem } from './ITrainingsItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';


export default class TrainingWebpartFlow extends React.Component<ITrainingWebpartFlowProps, ITrainingWebpartFlowState> {
  public constructor(props:ITrainingWebpartFlowProps,state:ITrainingWebpartFlowState){
    super(props);
    this.state = {
      status: 'Ready',
      items:[]
      };
  }

  public render(): React.ReactElement<ITrainingWebpartFlowProps> {
    const items: JSX.Element[] = this.state.items.map((item: ITrainingsItem, i:number):JSX.Element => {
      return(
        <li>{item.Title} ({item.TrainingApprover}) ({item.TrainingDate}) | {item.TrainingStatus}</li>
      );
    });

    return (
      <div className={ styles.trainingWebpartFlow }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>YaY SharePointers!</span>
              <p className={ styles.subTitle }>CRUD operations using React + SPFx + PnP Js + Ms Flow.</p>
              {/* <p className={ styles.description }>{escape(this.props.description)}</p> */}
              <p className={ styles.description }>{escape(this.props.listName)}</p>
              
              <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>
                <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>  
                  <a href="#" className={`${styles.button}`} onClick={() => this.createItem()}>  
                    <span className={styles.label}>Create item</span>  
                  </a>   
                  <a href="#" className={`${styles.button}`} onClick={() => this.readItem()}>  
                    <span className={styles.label}>Read item</span>  
                  </a>  
                </div>  
              </div>  
              
              <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>  
                <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>  
                  <a href="#" className={`${styles.button}`} onClick={() => this.updateItem()}>  
                    <span className={styles.label}>Update item</span>  
                  </a>   
                  <a href="#" className={`${styles.button}`} onClick={() => this.deleteItem()}>  
                    <span className={styles.label}>Delete item</span>  
                  </a>  
                </div>  
              </div>  

              <div className={`ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`}>  
                <div className='ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1'>  
                  {this.state.status}  
                  <ul>  
                    {items}  
                  </ul>  
                </div>  
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount(){
    debugger;
    //this._getListTrainings();
  }

  private createItem():void{  
  }
  private readItem():void{  
  }
  private updateItem():void{  
  }
  private deleteItem():void{  
  }
  private getLatestItemID(): Promise<number>{
    return new Promise<number>((resolve:(itemId:number) => void, reject:(error:any)=>void):void => {
      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$orderby=Id desc&$top=1&$select=id`,
      SPHttpClient.configurations.v1,
      {
        headers:{
          'Accept': 'application/json;odata=nometadata',  
          'odata-version': ''
        }
      })
      .then((response: SPHttpClientResponse):Promise<{value: {Id:number}[]}> => {
        return response.json();
      }, (error: any): void=>{
        reject(error);
      })
      .then((response:{value:{Id:number}[]}):void => {
        if(response.value.length === 0){
          resolve(-1);
        }
        else{
          resolve(response.value[0].Id);
        }
      });
    });
  }
}