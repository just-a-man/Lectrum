//Core
import React, {Component} from 'react';
import moment from 'moment';

//Components
import { withProfile } from 'components/HOC/withProfile';
import Catcher from 'components/Catcher';
import StatusBar from 'components/StatusBar';
import Composer from 'components/Composer';
import Post from 'components/Post';
import Spinner from 'components/Spinner';

//Instruments
import Styles from './styles.m.css';
import { getUniqueID, delay } from 'instruments';
import { api } from 'config/api';

@withProfile
export default class Feed extends Component {
    state = {
        posts: [
            {id: '1', comment: 'The first comment', created: 1526825076849, likes: []},
            {id: '2', comment: 'The second comment', created: 1526825098999, likes: []},
        ],
        isSpinning: false,
    };

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

         const post = {
             id:      getUniqueID(),
             created: moment().utc(),
             comment,
             likes:   [],
         };

         await delay(600);
         this.setState(({ posts }) => {
             return {
                 posts:      [ post, ...posts ],
                 isSpinning: false,
             };
         });
     }

      _deletePost = async (id) => {
          this._setPostFetchingState(true);

          await delay(600);

          const updatedPosts = this.state.posts.filter((post) => {
              return post.id !== id;
          });
          this.setState(() => {
              return {
                  posts:      updatedPosts,
                  isSpinning: false,
              };
          });
      }

      _likePost = async (id) => {
          const { currentUserFirstName, currentUserLastName} = this.props;
          this._setPostFetchingState(true);

          await delay(400);

          // eslint-disable-next-line react/no-access-state-in-setstate
          const newPosts = this.state.posts.map((post) => {
              if (post.id === id) {
                  return {
                      ...post,
                      likes: [
                          {
                              id:        getUniqueID(),
                              firstName: currentUserFirstName,
                              lastName:  currentUserLastName,
                          },
                      ],
                  };
              }

              return post;
          });

          this.setState({
              posts:      newPosts,
              isSpinning: false,
          });
      }

      render () {
          const { posts, isSpinning } = this.state;

          const postsJSX = posts.map((post) =>{
              return (
                  <Catcher key = { post.id }>
                      <Post
                          { ...post }
                          _deletePost = { this._deletePost }
                          _likePost = { this._likePost }
                      />
                  </Catcher>
              );
          });

          return (
              <section className = { Styles.feed }>
                  <Spinner isSpinning = { isSpinning } />
                  <StatusBar />
                  <Composer _createPost = { this._createPost } />
                  {postsJSX}
              </section>
          );
      }
}
