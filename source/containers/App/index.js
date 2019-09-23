// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

//Components
import Catcher from 'components/Catcher';
import Feed from 'components/Feed';
import Profile from 'components/Profile';
import { Provider } from 'components/HOC/withProfile';

//Instruments
import avatar from 'theme/assets/lisa';

const options = {
    avatar,
    currentUserFirstName: 'Александр',
    currentUserLastName:  'Смирнов',
};

@hot(module)
export default class App extends Component {
    render() {
        return (
            <Catcher>
                <Provider value = { options }>
                    <Feed />
                    <Profile />
                </Provider>
            </Catcher>
        );
    }
}
