export const LINK_PARSE_REG_EXP = /^(\/\/|http:\/\/|https:\/\/|#)?(.*)/;
export const VALIDATE_LINK_REG_EXP = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[\d:?]*)\S*$/;
export const VALIDATE_EMAIL_REG_EXP = /^[\w+.-]+@[\d.A-Za-z-]+\.[A-Za-z]+$/;
export const VALIDATE_PHONE_NUMBER_REG_EXP = /^\+*\({0,1}\d{1,4}\){0,1}[\d./s-]*$/;

// eslint-disable-next-line max-len, vue/max-len
export const VALID_DOMAIN_REG_EXP = /^(((([\dA-Za-z])|([\dA-Za-z][\dA-Za-z-]{0,86}[\dA-Za-z]))\.(([\dA-Za-z])|([\dA-Za-z][\dA-Za-z-]{0,73}[\dA-Za-z]))\.(([\dA-Za-z]{2,162}\.[\dA-Za-z]{2,12})|([\dA-Za-z]{2,25})))|((([\dA-Za-z])|([\dA-Za-z][\dA-Za-z-]{0,162}[\dA-Za-z]))\.(([\dA-Za-z]{2,12}\.[\dA-Za-z]{2,12})|([\dA-Za-z]{2,25}))))$/;
export const INTERNAL_LINK_WITHOUT_QUERY_OR_HASH = /\/[^#?|]+/;
