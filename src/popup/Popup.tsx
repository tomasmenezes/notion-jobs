import React, { useState, useEffect, FormEvent } from 'react';
import { browser } from 'webextension-polyfill-ts';
import toast, { Toaster } from 'react-hot-toast';
import html2md from 'html-to-md';

import Form from '@components/Form';

import { DataObject, defaultData } from '../content';

// Scripts to execute in current tab
export const initialPageData: DataObject = {
  ...defaultData,
  stage: 'Check',
};

export interface QueryObject {
  title: string;
  link: string;
}

export const initialDbInfo: QueryObject = {
  title: '',
  link: '',
};

export interface RequestMessage {
  type: string;
  popupMounted?: boolean;
  query?: boolean;
  postData?: boolean;
  dataPosted?: boolean;
  getPageData?: boolean;
  data?: DataObject;
  queryInfo?: QueryObject;
  postMessage?: string | unknown;
}

const Popup = () => {
  const [pageData, setPageData] = useState(initialPageData);
  const [dbInfo, setDbInfo] = useState(initialDbInfo);
  const [submitting, setSubmitting] = useState(false);

  const handleReset = () => {
    setPageData(initialPageData);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    console.log('Submitting', pageData);
    browser.runtime.sendMessage({
      type: 'popup',
      data: pageData,
      postData: true,
    });
  };

  useEffect(() => {
    // Send db query request on mount info to background
    browser.runtime.sendMessage({ type: 'popup', query: true });
    console.log('DB Query Request: Popup -> Background');

    // Send data request on mount info to content
    browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
      const activeTab = tabs[0];
      if (activeTab.id) {
        browser.tabs.sendMessage(activeTab.id, {
          type: 'popup',
          getPageData: true,
        });
        console.log('Data Request: Popup -> Content');
      }
    });

    // Get data response from content
    browser.runtime.onMessage.addListener((request: RequestMessage): void => {
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
          tags: request.data.tags === 'Internship' ? request.data.tags : '',
        });
        console.log('Data: Content -> Popup', pageData);
      }

      // Retrieve DB Title from background
      if (request.type === 'background' && request.queryInfo) {
        console.log('DB Query Title: Background -> Popup');
        setDbInfo(request.queryInfo);
      }

      // Retrieve post data status
      if (request.type === 'background' && request.postMessage) {
        setSubmitting(false);

        if (request.dataPosted) {
          console.log('Entry added successfully!');
          console.log('TOAST SUCCESS');
          toast.success('Entry Added!');
        } else {
          console.log(request.postMessage);
          console.log('TOAST ERROR');
          toast.error('Error submitting entry!');
        }
      }
    });
  }, []);

  return (
    <div className="popupContainer">
      <Toaster position="bottom-center" />
      <div className="w-full h-full mx-5 my-5">
        <Form
          data={pageData}
          title={dbInfo}
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
