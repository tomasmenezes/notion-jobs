import { browser } from 'webextension-polyfill-ts';

import { RequestMessage } from '../popup/Popup';
import { getContentData, getContentTags } from './helper';

export interface DataObject {
  title: string;
  company: string;
  icon: string;
  body: string;
  link: string;
  loc: string;
  note: string;
  tags: string;
  stage: string;
}

export const defaultData: DataObject = {
  title: '',
  company: '',
  icon: '',
  body: '',
  link: '',
  loc: '',
  note: '',
  tags: '',
  stage: 'Check',
};

// Listen for messages sent from popup
browser.runtime.onMessage.addListener((request: RequestMessage) => {
  if (request.getPageData) {
    let pageData = { ...defaultData };
    try {
      // Data Generator
      console.log('Starting content data fetch');
      pageData = getContentData(getContentTags());
    } catch (error) {
      console.log(error);
    } finally {
      // Relay data to extension
      console.log('Getting data from content', pageData);
      browser.runtime.sendMessage({ data: pageData, type: 'content' });
    }
  }
});
