import React, { useState, useEffect } from 'react';

import Form from '@components/Form';
import { browser } from 'webextension-polyfill-ts';
import html2md from 'html-to-md';

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

const Popup = () => {
  const [pageData, setPageData] = useState(initialPageData);
  const [dbTitle, setDbTitle]: [any, any] = useState({
    title: '',
    link: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleReset = () => {
    setPageData(initialPageData);
  };

  const handleSubmit = () => {
    // event.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      console.log('Submitting', pageData);
      setSubmitting(false);
    }, 3000);
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
      }) => {
        if (request.type === 'content')
          console.log('Message: Content -> Popup');

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

        if (request.type === 'background' && request.queryTitle) {
          console.log('DB Query Title: Background -> Popup');
          setDbTitle(request.queryTitle);
        }
      },
    );
  }, []);

  // Renders the component tree
  return (
    <div className="popupContainer">
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
