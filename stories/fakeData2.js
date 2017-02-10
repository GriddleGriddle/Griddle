import fakeData from './fakeData';

export function person({ id, name, city, state, country, company, favoriteNumber }) {
  const personObject = {};

  personObject.id = id;
  personObject.name = name;
  personObject.city = city;
  personObject.state = state;
  personObject.country = country;
  personObject.company = company;
  personObject.favoriteNumber = favoriteNumber;

  return personObject;
}

export class personClass {
  constructor({ id, name, city, state, country, company, favoriteNumber }) {
    this.id = id;
    this.name = name;
    this.city = city;
    this.state = state;
    this.country = country;
    this.company = company;
    this.favoriteNumber = favoriteNumber;
  }
}

export const fakeData2 = fakeData.map( (x) => new person (x));
export const fakeData3 = fakeData.map( (x) => new personClass (x));