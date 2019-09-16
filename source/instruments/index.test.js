import { sum, delay, getUniqueID, getFullApiUrl } from './';

test('sum func should be a function', () => {
    expect(sum).toBeInstanceOf(Function);
});

test('sum should throw an error if the second argument is non-number', () => {
    expect(() => sum(2, 'Hi')).toThrow();
});

test('sum should throw an error if the first argument is non-number', () => {
    expect(() => sum('Hi', 2)).toThrow();
});

test('sum should be correct', () => {
    expect(sum(2, 3)).toBe(5);
    expect(sum(1, 8)).toMatchSnapshot();
});

test('delay function should return a resolved promise', async () => {
    await expect(delay()).resolves.toBeUndefined();
});

test('getUniqueID func should be a function', () => {
    expect(getUniqueID).toBeInstanceOf(Function);
});

test('getUniqueID should throw an error if the argument is not a number', () => {
    expect(() => getUniqueID('Hi')).toThrow();
});

test('getUniqueID should return Id as string', () => {
    expect(typeof getUniqueID()).toBe('string');
    expect(getUniqueID(5)).toHaveLength(5);
    expect(getUniqueID(13)).toHaveLength(13);
});

test('getFullApiUrl func should be a function', () => {
    expect(getFullApiUrl).toBeInstanceOf(Function);
});

test('getFullApiUrl should throw an error if the first argument is not a string', () => {
    expect(() => getFullApiUrl(1, 'some url')).toThrow();
});

test('getFullApiUrl should throw an error if the second argument is not a string', () => {
    expect(() => getFullApiUrl('api', 1)).toThrow();
});

test('getFullApiUrl should return concatenated value', () => {
    expect(getFullApiUrl('local/api', '1234')).toBe('local/api/1234');
});
