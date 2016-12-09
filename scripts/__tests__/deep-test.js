var deep = require('../deep.js');

describe('getObjectValues', function(){

  it('returns a single string', function(){
    let test = "test";
    let results = deep.getObjectValues(test);
    expect(results).toEqual(["test"]);
  });

  it('returns values from a more complex object', function(){
    let test = { "array": [1, "two", {"tree": 3}], "string": "a string" };
    let results = deep.getObjectValues(test);
    expect(results).toEqual([1, 'two', 3, 'a string']);
  });

});
