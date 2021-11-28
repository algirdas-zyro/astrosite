/**
 * used with filter function, pass this to array.filter(onlyUnique)
 * and it will filter out all unique items in the array
 */
export const onlyUnique = (value, index, self) => self.indexOf(value) === index;
