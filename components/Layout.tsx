import React, { ReactNode } from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  bgColor?: string;
}

export default function Layout({ children, title = 'AthletDiary', bgColor = 'bg-gray-100' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Персональный дневник тренировок" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className={`flex flex-col ${bgColor}`}>
        {children}
      </div>
    </>
  );
} 