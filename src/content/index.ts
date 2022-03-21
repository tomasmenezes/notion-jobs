import { browser } from 'webextension-polyfill-ts';

console.log('Logging from content script');

export interface dataObject {
  title?: string;
  company?: string;
  icon?: string;
  body?: string;
  link?: string;
  loc?: string;
  note?: string;
  jobType?: string;
  stage?: string;
}

// Listen for messages sent from popup
browser.runtime.onMessage.addListener((request: { getPageData: boolean }) => {
  if (request.getPageData) {
    // Data Generator
    const title = (<HTMLElement>(
      document.querySelector('.topcard__title')
    )).innerText.trim();

    const company = (<HTMLElement>(
      document.querySelector('.topcard__org-name-link ')
    )).innerText.trim();

    const logo = <HTMLImageElement>(
      document.querySelector('.artdeco-entity-image--square-5')
    );

    let icon;
    if (!logo.src) {
      icon = logo.getAttribute('data-delayed-url') ?? '';
    } else {
      icon = logo.src;
    }

    const body =
      (<HTMLElement>(
        document.querySelector('.show-more-less-html__markup')
      )).innerHTML.trim() || '';

    const link = document.baseURI;

    const loc = (<HTMLElement>(
      document.querySelector('.topcard__flavor--bullet')
    )).innerText.trim();

    // const note = `Posted ${(<HTMLElement>(
    //   (<HTMLElement>document.querySelector('.posted-time-ago__text'))
    //     .parentElement
    // )).innerText
    //   .split('ago')
    //   .map(field => field.trim())
    //   .join(', ')}`;

    const postTime = (<HTMLElement>(
      document.querySelector('.posted-time-ago__text')
    )).innerText.trim();

    const numApps = (<HTMLElement>(
      document.querySelector('.num-applicants__caption')
    )).innerText.trim();

    const senLevel = (<HTMLElement>(
      document.querySelectorAll('.description__job-criteria-text')[0]
    )).innerText.trim();

    const note = `Posted ${postTime}, ${numApps}${
      senLevel !== 'Not Applicable' ? `, ${senLevel}` : ''
    }`;

    const jobType = (<HTMLElement>(
      document.querySelectorAll('.description__job-criteria-text')[1]
    )).innerText.trim();

    const data: dataObject = {
      title,
      company,
      icon,
      body,
      link,
      loc,
      note,
      jobType,
    };

    // Relay data to extension
    console.log('Getting data from content', data);
    browser.runtime.sendMessage({ data, type: 'content' });
  }
});
