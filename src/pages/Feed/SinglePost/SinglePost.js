import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const { postId } = this.props.match.params;
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `query FetchSinglePost($_id: ID!)
          { post(_id: $_id) {
          title creator { name } imageURL createdAt content }
        }`,
        variables: { _id: postId }
      })
    })
      .then(res => {
        return res.json();
      })
      .then(({ data }) => {
        console.log(data)
        if (!data.post) {
          throw new Error('Fetching post failed.')
        }
        this.setState({
          title: data.post.title,
          author: data.post.creator.name,
          image: `http://localhost:8080/${data.post.imageURL}`,
          date: new Date(data.post.createdAt).toLocaleDateString('en-US'),
          content: data.post.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageURL={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
