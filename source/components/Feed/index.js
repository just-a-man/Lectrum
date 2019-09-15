//Core
import React, {Component} from 'react';
import {
    Transition,
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';
import { fromTo } from 'gsap';

//Components
import { withProfile } from 'components/HOC/withProfile';
import Catcher from 'components/Catcher';
import StatusBar from 'components/StatusBar';
import Composer from 'components/Composer';
import Post from 'components/Post';
import Spinner from 'components/Spinner';
import Postman from 'components/Postman';

//Instruments
import Styles from './styles.m.css';
import { api, TOKEN, GROUP_ID } from 'config/api';
import { socket } from 'socket/init';

@withProfile
export default class Feed extends Component {
    state = {
        posts:      [],
        isSpinning: false,
        showPost:   true,
    };

    componentDidMount () {
        const { currentUserFirstName, currentUserLastName } = this.props;

        this._fetchPosts();
        socket.emit('join', GROUP_ID);

        socket.on('create', (postJSON) => {
            const { data: createdPost, meta } = JSON.parse(postJSON);

            if (
                `${currentUserFirstName} ${currentUserLastName}`
                !== `${meta.authorFirstName} ${meta.authorLastName}`
            ) {
                this.setState(({ posts }) => ({
                    posts: [ createdPost, ...posts ],
                }));
            }
        });

        socket.on('remove', (postJSON) => {
            const { data: removedPost, meta } = JSON.parse(postJSON);

            if (
                `${currentUserFirstName} ${currentUserLastName}`
                !== `${meta.authorFirstName} ${meta.authorLastName}`
            ) {
                this.setState(({ posts }) => ({
                    posts: posts.filter((post) => post.id !== removedPost.id),
                }));
            }
        });

        socket.on('like', (postJSON) => {
            const { data, meta } = JSON.parse(postJSON);

            if (
                `${currentUserFirstName} ${currentUserLastName}`
                !== `${meta.authorFirstName} ${meta.authorLastName}`
            ) {
                this.setState(({ posts }) => ({
                    posts: posts.map(
                        (post) => {
                            if (post.id === data.id) {
                                post.likes = data.likes;
                            }

                            return post;
                        },
                    ),
                }));
            }
        });
    }

    componentWillUnmount () {
        socket.removeListener('create');
        socket.removeListener('remove');
    }

    _setPostFetchingState = (state) => {
        this.setState({
            isSpinning: state,
        });
    }

    _fetchPosts = async () => {
        this._setPostFetchingState(true);

        const response = await fetch(api, {
            method: 'GET',
        });

        const {data: posts } = await response.json();

        this.setState({
            posts,
            isSpinning: false,
        });
    }

    _createPost = async (comment) => {
        this._setPostFetchingState(true);

        const response = await fetch(api, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({comment}),
        });

        const { data: post } = await response.json();
        this.setState(({ posts }) => {
            return {
                posts:      [ post, ...posts ],
                isSpinning: false,
            };
        });
    }

    _deletePost = async (id) => {
        this._setPostFetchingState(true);

        await fetch(`${api}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        this.setState(({ posts }) => ({
            posts:      posts.filter((post) => post.id !== id),
            isSpinning: false,
        }));
    };

    _likePost = async (id) => {
        this._setPostFetchingState(true);

        const response = await fetch(`${api}/${id}`, {
            method:  'PUT',
            headers: {
                Authorization: TOKEN,
            },
        });

        const { data: likedPost} = await response.json();

        this.setState(({ posts }) => ({
            posts: posts.map(
                (post) => post.id === likedPost.id ? likedPost : post,
            ),
            isSpinning: false,
        }));
    };

    _animateComposerEnter = (composer) => {
        fromTo(
            composer,
            1,
            { opacity: 0, rotationX: 50 },
            { opacity: 1, rotationX: 0 },
        );
    };

    _animatePostmanEnter = (postman) => {
        fromTo(
            postman,
            2,
            { opacity: 0 },
            { opacity: 1 },
        );
    };

    _animatePostmanEntered = (postman) => {
        fromTo(
            postman,
            1,
            { opacity: 1 },
            { opacity: 0 },
        );
    };

    render () {
        const { posts, isSpinning, showPost } = this.state;

        const postsJSX = posts.map((post) =>{
            return (
                <CSSTransition
                    classNames = {{
                        enter:       Styles.postInStart,
                        enterActive: Styles.postInEnd,
                        exit:        Styles.postOutStart,
                        exitActive:  Styles.postOutEnd,
                    }}
                    in = { showPost }
                    key = { post.id }
                    timeout = {{
                        enter: 500,
                        exit:  400,
                    }}>
                    <Catcher >
                        <Post
                            { ...post }
                            _deletePost = { this._deletePost }
                            _likePost = { this._likePost }
                        />
                    </Catcher>
                </CSSTransition>
            );
        });

        return (
            <section className = { Styles.feed }>
                <Spinner isSpinning = { isSpinning } />
                <StatusBar />
                <Transition
                    appear
                    in
                    timeout = { 1000 }
                    onEnter = { this._animateComposerEnter }>
                    <Composer _createPost = { this._createPost } />
                </Transition>
                <Transition
                    appear
                    in
                    timeout = { 4000 }
                    onEnter = { this._animatePostmanEnter }
                    onEntered = { this._animatePostmanEntered }>
                    <Postman />
                </Transition>
                <TransitionGroup>{postsJSX}</TransitionGroup>
            </section>
        );
    }
}
