import { SPHttpClient } from '@microsoft/sp-http';

export interface ITrainingWebpartFlowProps {
  //description: string;
  listName: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}
