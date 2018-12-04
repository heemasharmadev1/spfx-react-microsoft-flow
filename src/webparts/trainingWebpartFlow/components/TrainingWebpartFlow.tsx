import * as React from 'react';
import styles from './TrainingWebpartFlow.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';

import {ITrainingWebpartFlowProps} from './ITrainingWebpartFlowProps';
import {ITrainingWebpartFlowState} from './ITrainingWebpartFlowState';
import { ITrainingsItem } from './ITrainingsItem';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';


export default class TrainingWebpartFlow extends React.Component<ITrainingWebpartFlowProps, ITrainingWebpartFlowState> {
  private listItemEntityTypeName: string = undefined;

  public constructor(props:ITrainingWebpartFlowProps,state:ITrainingWebpartFlowState){
    super(props);
    this.state = {
      status: this.listNotConfigured(this.props) ? 'Please configure list in Web Part properties' : 'Ready',
      items:[]
      };
  }

  public componentWillReceiveProps(nextProps: ITrainingWebpartFlowProps): void {
    this.listItemEntityTypeName = undefined;
    this.setState({
      status: this.listNotConfigured(nextProps) ? 'Please configure list in Web Part properties' : 'Ready',
      items: []
    });
  }

  public render(): React.ReactElement<ITrainingWebpartFlowProps> {
    const items: JSX.Element[] = this.state.items.map((item: ITrainingsItem, i:number):JSX.Element => {
      return(
        <li>{item.Title} ({item.TrainingId}))</li>
      );
    });

    //const disabled: string = this.listNotConfigured(this.props) ? styles.disabled : '';

    return (
      <div className={ styles.trainingWebpartFlow }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>YaY SharePointers!</span>
              <p className={ styles.subTitle }>CRUD operations using React + SPFx + Ms Flow.</p>
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
    //this._getListTrainings();
  }

  private createItem():void{  
    debugger;
    this.setState({
      status: 'Creating item...',
      items: []
    });

    const body:string = JSON.stringify({
      'Title':`Item ${new Date()}`
    });

    this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items`,SPHttpClient.configurations.v1,
    {
      headers:{
        'Accept': 'application/json;odata=nometadata',  
      'Content-type': 'application/json;odata=nometadata',  
      'odata-version': ''
      },
      body : body
    })
    .then((response:SPHttpClientResponse):Promise<ITrainingsItem> => {
      return response.json();
    })
    .then((item: ITrainingsItem):void => {
      this.setState({
        status: `Item '${item.Title}' (Training ID: ${item.TrainingId} successfully created)`,
        items: []
      });
    },(error : any): void =>{
        this.setState({
          status: 'Error while creating the item: '+error,
          items: []
        });
    });
  }
  private readItem():void{  
    this.setState({
      status: 'Loading items...',
      items: []
    });
    
    this.getLatestItemID()
    .then((itemId: number):Promise<SPHttpClientResponse> => {
      if(itemId === -1){
        throw new Error('No items found in the list');
      }
      this.setState({
        status: `Loading information about item ID: ${itemId}...`,
        items: []
      });
      return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle(${this.props.listName})/items(${itemId})?$select=Title,TrainingId`,
      SPHttpClient.configurations.v1,
      {
        headers: {  
          'Accept': 'application/json;odata=nometadata',  
          'odata-version': ''  
        } 
      });
    })
    .then((response:SPHttpClientResponse):Promise<ITrainingsItem> => {
      return response.json();
    })
    .then((item:ITrainingsItem):void => {
      this.setState({
        status: `Item ID: ${item.TrainingId}, Title: ${item.Title}`,  
        items: [] 
      });
    }, (error: any): void => {
        this.setState({  
          status: 'Loading latest item failed with error: ' + error,  
          items: []
      });
    });
  }
  private updateItem():void{  
    this.setState({
      status: 'Loading latest items...',
      items: []
    });
    let latestItemId: number = undefined;
    this.getLatestItemID()
    .then((itemId:number):Promise<SPHttpClientResponse> => {
      if(itemId === -1)
      {
        throw new Error('No items found in the list');
      }
      latestItemId = itemId;
      this.setState({
        status: `Loading information about item ID: ${latestItemId}...`,  
        items: []
      });
      return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${latestItemId})?$select=Title,TrainingId`,
      SPHttpClient.configurations.v1,
      {
        headers: {  
          'Accept': 'application/json;odata=nometadata',  
          'odata-version': ''  
        } 
      });
    })
    .then((response:SPHttpClientResponse):Promise<ITrainingsItem> => {
      return response.json();
    })
    .then((item: ITrainingsItem): void => {
      this.setState({  
        status: 'Loading latest items...',  
        items: []
      });
    
    const body: string = JSON.stringify({  
      'Title': `Updated Item ${new Date()}`  
    });

    this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${item.TrainingId})`,  
        SPHttpClient.configurations.v1,  
        {  
          headers: {  
            'Accept': 'application/json;odata=nometadata',  
            'Content-type': 'application/json;odata=nometadata',  
            'odata-version': '',  
            'IF-MATCH': '*',  
            'X-HTTP-Method': 'MERGE'  
          },  
          body: body  
        })  
        .then((response: SPHttpClientResponse): void => {  
          this.setState({  
            status: `Item with ID: ${latestItemId} successfully updated`,  
            items: []  
          });  
        }, (error: any): void => {  
          this.setState({  
            status: `Error updating item: ${error}`,  
            items: []  
          });  
        }); 
      });
  }
  private deleteItem():void{  
    if (!window.confirm('Are you sure you want to delete the latest item?')) {  
      return;  
    }  
    
    this.setState({  
      status: 'Loading latest items...',  
      items: []  
    });  
    
    let latestItemId: number = undefined;  
    let etag: string = undefined;  
    this.getLatestItemID()  
      .then((itemId: number): Promise<SPHttpClientResponse> => {  
        if (itemId === -1) {  
          throw new Error('No items found in the list');  
        }  
    
        latestItemId = itemId;  
        this.setState({  
          status: `Loading information about item ID: ${latestItemId}...`,  
          items: []  
        });  
    
        return this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${latestItemId})?$select=TrainingId`,  
          SPHttpClient.configurations.v1,  
          {  
            headers: {  
              'Accept': 'application/json;odata=nometadata',  
              'odata-version': ''  
            }  
          });  
      })  
      .then((response: SPHttpClientResponse): Promise<ITrainingsItem> => {  
        etag = response.headers.get('ETag');  
        return response.json();  
      })  
      .then((item: ITrainingsItem): Promise<SPHttpClientResponse> => {  
        this.setState({  
          status: `Deleting item with ID: ${latestItemId}...`,  
          items: []  
        });  
    
        return this.props.spHttpClient.post(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items(${item.TrainingId})`,  
          SPHttpClient.configurations.v1,  
          {  
            headers: {  
              'Accept': 'application/json;odata=nometadata',  
              'Content-type': 'application/json;odata=verbose',  
              'odata-version': '',  
              'IF-MATCH': etag,  
              'X-HTTP-Method': 'DELETE'  
            }  
          });  
      })  
      .then((response: SPHttpClientResponse): void => {  
        this.setState({  
          status: `Item with ID: ${latestItemId} successfully deleted`,  
          items: []  
        });  
      }, (error: any): void => {  
        this.setState({  
          status: `Error deleting item: ${error}`,  
          items: []  
        });  
      });  
  }
  private getLatestItemID(): Promise<number>{
    return new Promise<number>((resolve:(itemId:number) => void, reject:(error:any)=>void):void => {
      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items?$orderby=TrainingId desc&$top=1&$select=TrainingId`,
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
  private listNotConfigured(props: ITrainingWebpartFlowProps): boolean{
    return props.listName === undefined ||
      props.listName === null ||
      props.listName.length === 0;
  }
}