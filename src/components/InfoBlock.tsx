import React from 'react';

import * as classes from './InfoBlock.css';

const Time = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    enableBackground="new 0 0 24 24"
    height="24"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="M0,0h24v24H0V0z" fill="none" />
    <path d="M11.99,2C6.47,2,2,6.48,2,12s4.47,10,9.99,10C17.52,22,22,17.52,22,12S17.52,2,11.99,2z M15.29,16.71L11,12.41V7h2v4.59 l3.71,3.71L15.29,16.71z" />
  </svg>
);

const Ok = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    height="24"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const Info = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    height="24"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

type Props = {
  color: 'green' | 'orange' | 'red' | 'salad';
  icon: 'time' | 'info' | 'ok';
  style?: React.CSSProperties;
} & (
  | {
      type?: 'default';
      text: string;
    }
  | {
      type: 'trans';
      text: string;
    }
  | {
      type: 'jsx';
      content: React.ReactNode;
    }
);

const iconMapper: Record<Props['icon'], typeof Info> = {
  info: Info,
  ok: Ok,
  time: Time,
};

export const InfoBlock = (props: Props) => {
  const { color, icon, style } = props;

  const Icon = iconMapper[icon];

  const renderContent = () => {
    switch (props.type) {
      case 'jsx':
        return props.content;
      case 'trans':
        return <span dangerouslySetInnerHTML={{ __html: props.text }} />;
      case 'default':
      default:
        return <span>{props.text}</span>;
    }
  };

  return (
    <div style={style} className={classes.content({ color })}>
      <Icon />
      {renderContent()}
    </div>
  );
};
