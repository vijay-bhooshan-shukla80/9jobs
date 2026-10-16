export const providerNameOptions = ['Aditya', 'Addy', 'Jay', 'Mayank Sodhi', 'Karan Singh'];

export const providerSignatureNameOptions = ['Aditya Singh', 'Addy', 'Jay', 'Mayank Sodhi', 'Karan Singh'];

export function getProviderSignatureName(providerName) {
  return providerName === 'Aditya' ? 'Aditya Singh' : providerName;
}

// Keep names from existing agreements selectable when editing older records.
export function getProviderOptions(field, currentValue) {
  const options = field === 'providerName' ? providerNameOptions : providerSignatureNameOptions;
  return currentValue && !options.includes(currentValue) ? [...options, currentValue] : options;
}
