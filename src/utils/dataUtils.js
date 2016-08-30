/** adds griddleKey to given collection
 * @param (List<Map>) data - data collection to work against
 * @param (object) settings - settings object -- default {}
 */
export function addKeyToCollection(data, settings={}) {
  const defaultSettings = { name: 'griddleKey', startIndex: 0 };
  const localSettings = Object.assign({}, defaultSettings, settings);

  let key = localSettings.startIndex;
  const getKey = (() => key++);

  return data.map(row => row.set(localSettings.name, getKey()));
}
