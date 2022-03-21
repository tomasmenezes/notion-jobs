// import React, { useState, useEffect } from 'react';

// import { browser, Tabs } from 'webextension-polyfill-ts';

// // Scripts to execute in current tab

// /**
//  * Executes a string of Javascript on the current tab
//  * @param code - The string of code to execute on the current tab
//  */
// async function executeScript(code: string): Promise<void> {
//   // Query for the active tab in the current window
//   try {
//     const tabs: Tabs.Tab[] = await browser.tabs.query({
//       active: true,
//       currentWindow: true,
//     });

//     const currentTab: Tabs.Tab | undefined = tabs[0];

//     if (!currentTab) {
//       return;
//     }

//     console.log(currentTab.url);

//     if (currentTab.url?.includes('github')) {
//       console.log('Where on github');

//       await browser.tabs.executeScript(currentTab.id, {
//         code,
//       });

//       console.log('Done Scrolling');
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// const Popup = () => {
//   const [popupMount, setPopupMount] = useState(1);
//   const [getData, setGetData] = useState(true);
//   const [pageData, setPageData] = useState({});

//   // Sends the `popupMounted` event
//   useEffect(() => {
//     console.log(popupMount);
//     console.log(getData);

//     // Send mount info to background
//     browser.runtime.sendMessage({ popupMounted: true });

//     // Send mount info to content
//     browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
//       const activeTab = tabs[0];
//       if (activeTab.id) {
//         browser.tabs.sendMessage(activeTab.id, { popupMounted: true, getData });
//         if (getData) {
//           console.log('Requested data from content');
//         } else {
//           console.log('Sent message to content');
//         }
//       }
//     });

//     browser.runtime.onMessage.addListener(
//       (request: { popupMounted?: boolean; type?: string; data?: object }) => {
//         if (request.type === 'content') {
//           console.log('Popup received message from Content');
//           if (request.data) {
//             setPageData(request.data);
//             console.log(pageData);
//             // addItem(request.data.title, request.data.icon);
//           }
//         }
//       },
//     );

//     setPopupMount(popupMount + 1);
//     setGetData(false);
//   }, []);

//   // Renders the component tree
//   return (
//     <div className="popupContainer">
//       <div className="mx-4 my-4">
//         <form>
//           <fieldset>
//             <label>
//               <p>Name</p>
//               <input name="name" />
//             </label>
//           </fieldset>
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Popup;
