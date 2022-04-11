import { browser } from 'webextension-polyfill-ts';

import { RequestMessage } from 'src/popup/Popup';

export interface DataObject {
  title: string;
  company: string;
  icon: string;
  body: string;
  link: string;
  loc: string;
  note: string;
  jobType: string;
  stage: string;
  tags: string;
}

export const defaultData: DataObject = {
  title: '',
  company: '',
  icon: '',
  body: '',
  link: '',
  loc: '',
  note: '',
  jobType: '',
  stage: '',
  tags: '',
};

// Listen for messages sent from popup
browser.runtime.onMessage.addListener((request: RequestMessage) => {
  if (request.getPageData) {
    const pageData = defaultData;
    try {
      // Data Generator
      pageData.title = (<HTMLElement>(
        document.querySelector('.topcard__title')
      )).innerText.trim();

      pageData.company = (<HTMLElement>(
        document.querySelector('.topcard__org-name-link ')
      )).innerText.trim();

      const logo = <HTMLImageElement>(
        document.querySelector('.artdeco-entity-image--square-5')
      );
      if (!logo.src) {
        pageData.icon = logo.getAttribute('data-delayed-url') ?? '';
      } else {
        pageData.icon = logo.src;
      }

      pageData.body =
        (<HTMLElement>(
          document.querySelector('.show-more-less-html__markup')
        )).innerHTML.trim() || '';

      pageData.link = document.baseURI;

      pageData.loc = (<HTMLElement>(
        document.querySelector('.topcard__flavor--bullet')
      )).innerText.trim();

      const postTime = (<HTMLElement>(
        document.querySelector('.posted-time-ago__text')
      )).innerText.trim();

      const numApps = (<HTMLElement>(
        document.querySelector('.num-applicants__caption')
      )).innerText.trim();

      const senLevel = (<HTMLElement>(
        document.querySelectorAll('.description__job-criteria-text')[0]
      )).innerText.trim();

      pageData.note = `Posted ${postTime}, ${numApps}${
        senLevel !== 'Not Applicable' ? `, ${senLevel}` : ''
      }`;

      pageData.jobType = (<HTMLElement>(
        document.querySelectorAll('.description__job-criteria-text')[1]
      )).innerText.trim();
    } catch (error) {
      console.log(error);
    } finally {
      // Relay data to extension
      console.log('Getting data from content', pageData);
      browser.runtime.sendMessage({ data: pageData, type: 'content' });
    }
  }
});
