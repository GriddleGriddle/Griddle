export interface FakeData {
    id: number;
    name: string;
    city: string;
    state: string;
    country: string;
    company: string;
    favoriteNumber: number;
}

declare const fakeData: FakeData[];

export default fakeData;
