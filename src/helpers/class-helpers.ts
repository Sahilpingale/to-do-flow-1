export const classNames = (
  ...classes: (string | undefined | boolean)[]
): string => {
  return classes.filter((cls) => Boolean(cls)).join(" ")
}
