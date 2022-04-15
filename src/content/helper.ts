import { DataObject, defaultData } from '.';

interface ClassStructureObject {
  title: string;
  company: string;
  logo: string;
  body: string;
  link: string;
  loc: string;
  postTime: string;
  numApps: string;
  estSalary: string;
  senLevel: string;
  note: string;
  tags: string;
  authUser: boolean;
}

const baseClassStructure: ClassStructureObject = {
  title: '',
  company: '',
  logo: '',
  body: '',
  link: '',
  loc: '',
  postTime: '',
  numApps: '',
  estSalary: '',
  senLevel: '',
  note: '',
  tags: '',
  authUser: true,
};

export const getContentTags = (): ClassStructureObject => {
  const classStructure = { ...baseClassStructure };
  classStructure.authUser = !document.querySelector('[aria-label="Sign in"]');

  if (classStructure.authUser) {
    classStructure.title = '.jobs-unified-top-card h1';
    classStructure.company = '.jobs-unified-top-card__company-name';
    classStructure.logo = '.lazy-image';
    classStructure.body = '.jobs-description-content__text';
    classStructure.loc = '.jobs-unified-top-card__bullet';
    classStructure.postTime = '.jobs-unified-top-card__posted-date';
    classStructure.numApps =
      '.jobs-unified-top-card__subtitle-secondary-grouping .jobs-unified-top-card__bullet';
    classStructure.estSalary = '[href="#SALARY"]';
    classStructure.senLevel = '.jobs-unified-top-card__job-insight';
    classStructure.tags = '.jobs-unified-top-card__job-insight';
  } else {
    classStructure.title = '.topcard__title';
    classStructure.company = '.topcard__org-name-link';
    classStructure.logo = '.artdeco-entity-image--square-5';
    classStructure.body = '.show-more-less-html__markup';
    classStructure.loc = '.topcard__flavor--bullet';
    classStructure.postTime = '.posted-time-ago__text';
    classStructure.numApps = '.num-applicants__caption';
    classStructure.estSalary = '.compensation__salary';
    classStructure.senLevel = '.description__job-criteria-text';
    classStructure.tags = '.description__job-criteria-text';
  }

  return classStructure;
};

export const getContentData = (
  classStructure: ClassStructureObject,
): DataObject => {
  const pageData = { ...defaultData };
  // Data Generator
  pageData.title = (<HTMLElement>(
    document.querySelector(classStructure.title)
  ))?.innerText.trim();

  pageData.company = (<HTMLElement>(
    document.querySelector(classStructure.company)
  ))?.innerText.trim();

  const logo = <HTMLImageElement>document.querySelector(classStructure.logo);
  if (!logo.src) {
    pageData.icon = logo.getAttribute('data-delayed-url') ?? '';
  } else {
    pageData.icon = logo.src;
  }

  pageData.body =
    (<HTMLElement>document.querySelector(classStructure.body))?.innerHTML
      .trim()
      .replace(/<br>+(?:<br>)+/g, '<br>') // Repeated breaks
      .replace(/\n+(?:\s)*/g, '') // Initial and training newlines
      .replace(/(<\/?ul>)?(<\/?ol>)?/g, '') // Unsupported tags
      .replaceAll('&amp;', '&')
      .replaceAll('</strong>', '</strong> ') || '';

  pageData.link = document.baseURI;

  pageData.loc = (<HTMLElement>(
    document.querySelector(classStructure.loc)
  ))?.innerText.trim();

  const postTime = (<HTMLElement>(
    document.querySelector(classStructure.postTime)
  ))?.innerText.trim();

  const numApps = (<HTMLElement>(
    document.querySelector(classStructure.numApps)
  ))?.innerText.trim();

  const estSalary = (<HTMLElement>(
    document.querySelector(classStructure.estSalary)
  ))?.innerText.trim();

  let senLevel;
  if (!classStructure.authUser) {
    senLevel = (<HTMLElement>(
      document.querySelectorAll(classStructure.senLevel)[0]
    ))?.innerText.trim();

    pageData.tags = (<HTMLElement>(
      document.querySelectorAll(classStructure.tags)[1]
    ))?.innerText.trim();
  } else {
    senLevel = (<HTMLElement>(
      document.querySelectorAll(classStructure.senLevel)[0]
    ))?.innerText
      .split('·')
      .slice(-1)[0]
      .trim();

    pageData.tags = (<HTMLElement>(
      document.querySelectorAll(classStructure.tags)[0]
    ))?.innerText
      .split('·')
      [estSalary ? 1 : 0].trim();

    if (senLevel === pageData.tags) senLevel = 'Not Applicable';
  }

  pageData.note = `Posted ${postTime}, ${numApps}${
    senLevel !== 'Not Applicable' ? `, ${senLevel}` : ''
  }${estSalary ? `, Est. Salary: ${estSalary}` : ''}`;

  console.log({
    salary: estSalary,
    senlevel: senLevel,
    tags: pageData.tags,
    note: pageData.note,
  });
  console.log('Content data fetch', pageData);

  return pageData;
};

export default getContentData;
