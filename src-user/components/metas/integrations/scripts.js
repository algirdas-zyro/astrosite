// Facebook messenger.
const facebookMessengerScript = ({
	version,
	locale,
}) => ({
	innerHTML: `window.fbAsyncInit = function() {
		FB.init({
			xfbml            : true,
			version          : 'v${version}'
		});
	};

	(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = 'https://connect.facebook.net/${locale}/sdk/xfbml.customerchat.js';
	fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));`,
	pbody: true,
	vmid: 'fb-customerchat',
});

const facebookMessengerScriptAsync = ({ locale }) => ({
	async: true,
	defer: true,
	crossorigin: 'anonymous',
	src: `https://connect.facebook.net/${locale}/sdk.js`,
	vmid: 'fb-customerchat-async',
});

// Facebook pixel
const facebookPixelScript = (facebookPixelId) => ({
	innerHTML: `!function(f,b,e,v,n,t,s)
	{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
	n.callMethod.apply(n,arguments):n.queue.push(arguments)};
	if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
	n.queue=[];t=b.createElement(e);t.async=!0;
	t.src=v;s=b.getElementsByTagName(e)[0];
	s.parentNode.insertBefore(t,s)}(window, document,'script',
	'https://connect.facebook.net/en_US/fbevents.js');
	fbq('init', '${facebookPixelId}');
	fbq('track', 'PageView');`,
	type: 'text/javascript',
	async: false,
	vmid: 'facebook-pixel',
});

const facebookPixelNoScript = (facebookPixelId) => ({
	innerHTML: `
	<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1"/>
	`,
	vmid: 'facebook-pixel-no-script',
});

// Google tag manager
const googleTagManagerScript = (containerId) => ({
	innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','${containerId}');`,
	type: 'text/javascript',
	async: false,
	vmid: 'google-tag-manager',
});

const googleTagManagerNoScript = (containerId) => ({
	innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}"
								height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
	pbody: true,
	vmid: 'google-tag-manager-no-script',
});

// Google analytics
const googleAnalyticsScript = (analyticsId) => ({
	innerHTML: `window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());
							gtag('config', '${analyticsId}');`,
	type: 'text/javascript',
	async: false,
	vmid: 'google-analytics',
});

const googleAnalyticsScriptAsync = (analyticsId) => ({
	src: `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`,
	async: true,
	vmid: 'google-analytics-async',
});

// Hotjar
const hotjarScript = (hotjarId) => ({
	innerHTML: `(function(h,o,t,j,a,r){
		h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
		h._hjSettings={hjid:${hotjarId},hjsv:6};
		a=o.getElementsByTagName('head')[0];
		r=o.createElement('script');r.async=1;
		r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
		a.appendChild(r);
	})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
	type: 'text/javascript',
	async: false,
	vmid: 'hotjar',
});

// JivoChat
const jivoChatScriptAsync = (widgetId) => ({
	src: `//code-eu1.jivosite.com/widget/${widgetId}`,
	async: true,
	vmid: 'jivochat-async',
});

export {
	facebookMessengerScript,
	facebookMessengerScriptAsync,
	facebookPixelScript,
	facebookPixelNoScript,
	googleTagManagerScript,
	googleTagManagerNoScript,
	googleAnalyticsScript,
	googleAnalyticsScriptAsync,
	hotjarScript,
	jivoChatScriptAsync,
};
