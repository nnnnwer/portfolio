const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isUuid = (value) => UUID_PATTERN.test(value);
export const isSlug = (value) => value.length <= 120 && SLUG_PATTERN.test(value);
