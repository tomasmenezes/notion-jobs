import React from 'react';

// import parseHtmlToNotionBlocks from 'html-to-notion';

import { dataObject } from 'src/content';

interface dataProps {
  data: dataObject;
  title: {
    title: string;
    link: string;
  };
  event: any;
  submit: boolean;
}

const Form = ({ data, title, event, submit }: dataProps) => {
  return (
    <div className="bg-gray-50 flex flex-col">
      {/* <div>{JSON.stringify(data)}</div> */}
      <div className="flex flex-col" id="forms">
        {/* Title */}
        <div className="flex items-center justify-between mb-2">
          <label className="flex-grow block text-xs font-medium text-gray-900">
            Title
            <input
              type="text"
              className="baseForm form-input mt-1"
              placeholder="Job Title"
              value={data.title}
              onChange={e => {
                event.setPageData({ ...data, title: e.target.value });
              }}
              required
            />
          </label>

          {/* Logo */}
          {data.icon && (
            <img
              src={data.icon}
              alt={data.company || 'Job logo'}
              className="w-[54px] h-[54px] ml-6 rounded-lg border border-gray-300"
            />
          )}
        </div>

        {/* Company */}
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-900">
            Company
            <input
              type="text"
              className="baseForm form-input mt-1"
              placeholder="Job Company"
              value={data.company || ''}
              onChange={e => {
                event.setPageData({ ...data, company: e.target.value });
              }}
            />
          </label>
        </div>

        {/* Stage */}
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-900">
            Stage
            <select
              className="baseForm form-select mt-1"
              placeholder="Application Stage"
              defaultValue={data.stage}
              onChange={e => {
                event.setPageData({ ...data, stage: e.target.value });
              }}
            >
              <option>Check</option>
              <option>Apply</option>
              <option>Applied</option>
            </select>
          </label>
        </div>

        {/* Location */}
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-900">
            Location
            <input
              type="text"
              className="baseForm form-input mt-1"
              placeholder="Job Location"
              value={data.loc}
              onChange={e => {
                event.setPageData({ ...data, loc: e.target.value });
              }}
            />
          </label>
        </div>

        {/* Content */}
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-900">
            Content
            <textarea
              className="baseForm form-textarea mt-1 prose"
              placeholder="Job Content"
              value={data.body}
              onChange={e => {
                event.setPageData({ ...data, body: e.target.value });
              }}
              rows={5}
            />
          </label>
        </div>

        {/* Notes */}
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-900">
            Notes
            <input
              type="text"
              className="baseForm form-input mt-1"
              placeholder="Job Notes"
              value={data.note}
              onChange={e => {
                event.setPageData({ ...data, note: e.target.value });
              }}
            />
          </label>
        </div>

        {/* Tags */}
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-900">
            Tags
            <input
              type="text"
              className="baseForm form-input mt-1"
              placeholder="Job Tags"
              value={data.jobType}
              onChange={e => {
                event.setPageData({ ...data, jobType: e.target.value });
              }}
            />
          </label>
        </div>

        {/* Button Container */}
        <div
          id="button-container"
          className="flex items-end justify-between mt-2 text-gray-400"
        >
          <div className="flex space-x-2">
            <button
              onClick={event.handleSubmit}
              type="button"
              className="inline-flex items-center px-3 py-1.5 mr-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-blue-500 focus:border-blue-500 focus:ring-2"
            >
              {submit && (
                <svg
                  role="status"
                  className="animate-spin inline w-4 h-4 mr-3 font-medium text-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="#E5E7EB"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {submit ? 'Submitting...' : 'Submit'}
            </button>
            <button
              className="inline-flex items-center px-3 py-1.5 mr-2 text-sm font-medium text-center border rounded-lg hover:bg-gray-200 focus:ring-blue-500 focus:border-blue-500 focus:ring-2"
              onClick={event.handleReset}
            >
              Reset
            </button>
          </div>
          <div className="">
            <p className="items-center text-xs">
              Posting job entry to{' '}
              {title.title ? (
                <a
                  href={title.link}
                  className="hover:underline font-semibold text-pink-500"
                  target="_blank"
                >
                  {title.title}
                </a>
              ) : (
                <span className="items-center ml-2">
                  <svg
                    role="status"
                    className="inline w-2.5 h-2.5 font-bold text-pink-200 animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="rgb(236, 72, 153)"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
