import React, { ReactNode } from 'react';
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  bgColor?: string;
}

export default function Layout({ 
  children, 
  title = 'AthleteDiary - Ваш персональный дневник тренировок', 
  description = 'AthleteDiary - современное приложение для отслеживания тренировок, планирования и анализа фитнес-результатов. Ведите дневник тренировок, следите за прогрессом и достигайте своих целей.',
  keywords = 'дневник тренировок, фитнес, спорт, тренировки, отслеживание прогресса, фитнес-приложение, здоровый образ жизни',
  bgColor = 'bg-gray-100' 
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AthleteDiary" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      
      <div className={`flex flex-col ${bgColor}`}>
        {children}
      </div>
    </>
  );
} 