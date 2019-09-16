import React from 'react';
import Counter from './';
import renderer from 'react-test-renderer';

const renderTree = renderer.create(<Counter count = { 6 } />).toJSON();

test('counter component should correspond to its snapshot counterpart', () => {
    expect(renderTree).toMatchSnapshot();
});
