export function addKeyToCollection(data, settings={}) {
  const defaultSettings = { name: 'griddleKey', startIndex: 0 };
  const localSettings = Object.assign({}, defaultSettings, settings);

  let key = localSettings.startIndex;
  const getKey = (() => key++);

  return data.map(row => row.set(localSettings.name, getKey()));
}
