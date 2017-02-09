import fakeData from './fakeData';

function person( id, name, city, state, country, company, favoriteNumber)
{
  this.id = id;
  this.name = name;
  this.city = city;
  this.state = state;
  this.country = country;
  this.company = company;
  this.favoriteNumber = favoriteNumber;
}

class personClass {
  constructor(id, name, city, state, country, company, favoriteNumber) {
    this.id = id;
    this.name = name;
    this.city = city;
    this.state = state;
    this.country = country;
    this.company = company;
    this.favoriteNumber = favoriteNumber;
  }
}

var fakeData2 = fakeData.map( (x) => new person (...x));
var fakeData3 = fakeData.map( (x) => new personClass (...x));

export {fakeData2, fakeData3}