import { PRERENDERING_FLAG } from '@site-modules/utils/isAppPrerendering';

export const MAILCHIMP_INTEGRATION_PREFIX = '!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script",';
export const MAILCHIMP_INTEGRATION_REPLACEMENT = `!window.${PRERENDERING_FLAG}&&${MAILCHIMP_INTEGRATION_PREFIX}`;
