import React, { useState, useEffect } from 'react';

import Form from '@components/Form';
import { browser } from 'webextension-polyfill-ts';
import html2md from 'html-to-md';
import toast, { Toaster } from 'react-hot-toast';
// import parseHtmlToNotionBlocks from 'html-to-notion';

// Scripts to execute in current tab
const initialPageData = {
  title: '',
  company: '',
  icon: '',
  body: '',
  link: '',
  loc: '',
  note: '',
  jobType: '',
  stage: 'Check',
};

const initialDbTitle = {
  title: '',
  link: '',
};

const Popup = () => {
  const [pageData, setPageData] = useState(initialPageData);
  const [dbTitle, setDbTitle]: [any, any] = useState(initialDbTitle);
  const [submitting, setSubmitting] = useState(false);
  const [submit, setSubmit] = useState(true);
  const [add, setAdd] = useState(false);

  const handleReset = () => {
    setPageData(initialPageData);
  };

  const handleSubmit = () => {
    // event.preventDefault();
    setSubmitting(true);
    setSubmit(false);

    console.log('Submitting', pageData);
    browser.runtime.sendMessage({
      data: pageData,
      type: 'popup',
      post: true,
    });

    // setTimeout(() => {
    //   console.log('Submitting', pageData);
    //   browser.runtime.sendMessage({
    //     data: pageData,
    //     type: 'popup',
    //     post: true,
    //   });
    //   console.log('MD to Blocks', markdownToBlocks(pageData.body));
    //   console.log('MD to Rich', markdownToRichText(pageData.body));
    //   setSubmitting(false);
    // }, 3000);
  };

  useEffect(() => {
    // Send db query request on mount info to background
    browser.runtime.sendMessage({ type: 'popup', query: true });
    console.log('DB Query Request: Popup -> Background');

    // Send data request on mount info to content
    browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
      const activeTab = tabs[0];
      if (activeTab.id) {
        browser.tabs.sendMessage(activeTab.id, { getPageData: true });
        console.log('Data Request: Popup -> Content');
      }
    });

    // Get data response from content
    browser.runtime.onMessage.addListener(
      (request: {
        data?: any;
        type?: string;
        query?: boolean;
        queryTitle?: object;
        add?: boolean;
        message?: any;
      }) => {
        // Message from content
        if (request.type === 'content')
          console.log('Message: Content -> Popup');

        // Retrieve scraped data from content
        if (request.data) {
          setPageData({
            ...pageData,
            title: request.data.title,
            company: request.data.company,
            icon: request.data.icon,
            body: html2md(request.data.body),
            link: request.data.link,
            loc: request.data.loc,
            note: request.data.note,
            jobType:
              request.data.jobType === 'Internship' ? request.data.jobType : '',
          });
          console.log('Data: Content -> Popup', pageData);
          // addItem(request.data.title, request.data.icon);
        }

        // Retrieve DB Title from background
        if (request.type === 'background' && request.queryTitle) {
          console.log('DB Query Title: Background -> Popup');
          setDbTitle(request.queryTitle);
        }

        // Retrieve post data status
        if (request.type === 'background' && request.message) {
          setSubmitting(false);

          if (request.add) {
            console.log('Entry added successfully!');
            console.log('TOAST SUCCESS');
            toast.success('Entry Added!');
            setAdd(true);
          } else {
            console.log(request.message);
            console.log('TOAST ERROR');
            toast.error('Error!');
            setSubmit(true);
          }
        }
      },
    );
  }, []);

  // Renders the component tree
  return (
    <div className="popupContainer">
      <Toaster position="bottom-center" />
      <div className="w-full h-full mx-5 my-5">
        <Form
          data={pageData}
          title={dbTitle}
          event={{
            setPageData,
            handleReset,
            handleSubmit,
          }}
          submit={submitting}
        />
      </div>
    </div>
  );
};

export default Popup;
