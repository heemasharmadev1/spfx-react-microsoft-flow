import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TrainingWebpartFlowWebPartStrings';
import TrainingWebpartFlow from './components/TrainingWebpartFlow';
import { ITrainingWebpartFlowProps } from './components/ITrainingWebpartFlowProps';

export interface ITrainingWebpartFlowWebPartProps {
  //description: string;
  listName: string;
}

export default class TrainingWebpartFlowWebPart extends BaseClientSideWebPart<ITrainingWebpartFlowWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITrainingWebpartFlowProps > = React.createElement(
      TrainingWebpartFlow,
      {
        //description: this.properties.description
        listName: this.properties.listName,
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                // PropertyPaneTextField('description', {
                //   label: strings.DescriptionFieldLabel
                // })
                PropertyPaneTextField('listName',{
                  label: strings.ListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
