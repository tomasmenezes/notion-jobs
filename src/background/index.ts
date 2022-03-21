import { browser } from 'webextension-polyfill-ts';
import { Client } from '@notionhq/client';
// import { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { markdownToBlocks, markdownToRichText } from '@tryfabric/martian';
import secrets from '../../secrets';

const notion = new Client({ auth: secrets.NOTION_KEY });
const databaseId = secrets.NOTION_DATABASE_ID;

async function addItem(
  title: string,
  icon: string,
  company: string,
  stage: string,
  loc: string,
  tags: string,
  body: string,
  note: string,
  link: string,
) {
  try {
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
        Location: {
          multi_select: [...loc.split(';').map(entry => ({ name: entry }))],
        },
        Tags: {
          multi_select: [...tags.split(',').map(entry => ({ name: entry }))],
        },
        Notes: {
          rich_text: [
            {
              text: {
                content: note,
              },
            },
          ],
        },
        'Posting URL': {
          url: link,
        },
      },
      children: [
        ...body.split(/\r?\n/).map(item => ({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: item,
                },
              },
            ],
          },
        })),
      ],
    });
    console.log(response);
    console.log('Success! Entry added.');
  } catch (error) {
    console.error(error);
  }
}

const queryDB = async () => {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });
  console.log(response);

  let query = {};
  if ('title' in response) {
    query = { title: response.title[0]?.plain_text, link: response.url };
  }
  return query;
};

console.log(notion);
console.log(databaseId);

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener(
  (request: {
    popupMounted?: boolean;
    type?: string;
    query?: boolean;
    data?: any;
    post?: boolean;
  }) => {
    // Log statement if request.popupMounted is true
    // NOTE: this request is sent in `popup/component.tsx`
    if (request.popupMounted) {
      console.log('Mount: Popup -> Background');
    }

    if (request.type === 'content') {
      console.log('Message: Content -> Background');
      // if (request.data) {
      //   console.log(request.data);
      // sendResponse({ status: 200 });
      // addItem(request.data.title, request.data.icon); }
    }

    if (request.type === 'popup') {
      console.log('Message: Popup -> Background');
      if (request.query)
        queryDB().then(dbTitle =>
          browser.runtime.sendMessage({
            type: 'background',
            query: true,
            queryTitle: dbTitle,
          }),
        );

      if (request.data && request.post) {
        console.log('Post data to DB');
        console.log(markdownToBlocks(request.data.body));
        console.log(markdownToRichText(request.data.body));
        addItem(
          request.data.title,
          request.data.icon,
          request.data.company,
          request.data.stage,
          request.data.loc,
          request.data.jobType,
          request.data.body,
          request.data.note,
          request.data.link,
        );
      }

      // if (request.data) {
      //   console.log(request.data);
      //   // sendResponse({ status: 200 });
      //   // addItem(request.data.title, request.data.icon);
      // }
    }
  },
);
