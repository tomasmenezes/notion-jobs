import { browser } from 'webextension-polyfill-ts';
import { Client } from '@notionhq/client';
import { markdownToBlocks, markdownToRichText } from '@tryfabric/martian';

import { DataObject } from '../content';
import { QueryObject, RequestMessage, initialDbInfo } from '../popup/Popup';
import secrets from '../../secrets';

const notion = new Client({ auth: secrets.NOTION_KEY });
const databaseId = secrets.NOTION_DATABASE_ID;

async function addItem({
  title,
  icon,
  company,
  stage,
  loc,
  body,
  note,
  link,
  tags,
}: DataObject): Promise<void> {
  try {
    console.log(body);

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      icon: {
        type: 'external',
        external: {
          url: icon,
        },
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Company: {
          select: {
            name: company,
          },
        },
        Stage: {
          select: {
            name: stage,
          },
        },
        ...(loc && {
          Location: {
            multi_select: [
              ...loc
                .replaceAll(',', '')
                .split(';')
                .map(entry => ({ name: entry })),
            ],
          },
        }),
        ...(tags && {
          Tags: {
            multi_select: [...tags.split(',').map(entry => ({ name: entry }))],
          },
        }),
        ...(note && {
          Notes: {
            rich_text: [
              {
                text: {
                  content: note,
                },
              },
            ],
          },
        }),
        'Posting URL': {
          url: link,
        },
      },
      ...(body && { children: markdownToBlocks(body) }),
      // children: [
      //   ...body.split(/\r?\n/).map(item => ({
      //     object: 'block',
      //     type: 'paragraph',
      //     paragraph: {
      //       rich_text: [
      //         {
      //           type: 'text',
      //           text: {
      //             content: item,
      //           },
      //         },
      //       ],
      //     },
      //   })),
      // ],
    });

    console.log(response);
    console.log('Success! Entry added.');
    browser.runtime.sendMessage({
      type: 'background',
      dataPosted: true,
      postMessage: 'Success',
    });
  } catch (error) {
    console.error(error);
    browser.runtime.sendMessage({
      type: 'background',
      dataPosted: false,
      postMessage: error,
    });
  }
}

const queryDB = async (): Promise<QueryObject> => {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });
  console.log(response);

  let query = initialDbInfo;
  if ('title' in response) {
    query = { title: response.title[0]?.plain_text, link: response.url };
  }
  return query;
};

console.log(notion);
console.log(databaseId);

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener((request: RequestMessage): void => {
  if (request.popupMounted) {
    console.log('Mount: Popup -> Background');
  }

  if (request.type === 'content') {
    console.log('Message: Content -> Background');
  }

  if (request.type === 'popup') {
    console.log('Message: Popup -> Background');
    if (request.query)
      queryDB().then(dbInfo =>
        browser.runtime.sendMessage({
          type: 'background',
          queryInfo: dbInfo,
        }),
      );

    if (request.data && request.postData) {
      console.log('Post data to DB');
      console.log(markdownToBlocks(request.data.body));
      console.log(markdownToRichText(request.data.body));
      addItem({
        title: request.data.title,
        icon: request.data.icon,
        company: request.data.company,
        stage: request.data.stage,
        loc: request.data.loc,
        tags: request.data.tags,
        body: request.data.body,
        note: request.data.note,
        link: request.data.link,
      });
    }
  }
});
