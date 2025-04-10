import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="AthletDiary - Ваш персональный дневник тренировок" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script src="//code.jivo.ru/widget/baAsKme1em" async />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 