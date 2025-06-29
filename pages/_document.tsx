import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="AthleteDiary - Ваш персональный дневник тренировок" />
        <meta name="yandex-verification" content="c9f72810d5feb18d" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Заменён Jivosite на LiveTex */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
window['li'+'v'+'e'+'Te'+'x'] = true,
window['li'+'veTe'+'xID'] = 182128,
window['li'+'ve'+'Tex_obj'+'ect'] = true;
(function() {
var t = document['c'+'reateE'+'le'+'me'+'nt']('script');
t.type ='text/javascript';
t.async = true;
t.src = '/'+'/cs15.l'+'ivet'+'ex.'+'ru/js'+'/client.js';
var c = document['getElement'+'sByTag'+'Na'+'me']('script')[0];
if ( c ) c['p'+'ar'+'e'+'ntNo'+'de']['inse'+'rtB'+'efore'](t, c);
else document['docum'+'entEl'+'em'+'ent']['firs'+'tChi'+'ld']['appe'+'ndC'+'hil'+'d'](t);
})();
            `
          }}
        />
        
        {/* Yandex.Metrika counter */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(101127406, "init", {
                clickmap:true,
                trackLinks:true,
                accurateTrackBounce:true,
                webvisor:true
              });
            `,
          }}
        />
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/101127406" style={{ position: 'absolute', left: '-9999px' }} alt="" />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
} 