import * as React from 'react';
import styles from './TrainingWebpartFlow.module.scss';
import { ITrainingWebpartFlowProps } from './ITrainingWebpartFlowProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class TrainingWebpartFlow extends React.Component<ITrainingWebpartFlowProps, {}> {
  public render(): React.ReactElement<ITrainingWebpartFlowProps> {
    return (
      <div className={ styles.trainingWebpartFlow }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
