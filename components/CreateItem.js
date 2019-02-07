import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends React.Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    price: 0,
  }

  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? (value) : value;
    this.setState({
      [name]: val
    })
  }

  uploadFile = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'dariosoto');

    const res = await fetch('http://api.cloudinary.com/v1_1/dmxhpzaga/image/upload',
    {
      method: 'POST',
      body: data
    })

    const file = await res.json();
    console.log(file)
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, {loading, error, called, data}) => (
        <Form onSubmit={async (e) => {
          e.preventDefault();
          const res = await createItem();
          Router.push({
            pathname: '/Item',
            query: {
              id: res.data.createItem.id
            }
          })
        }}>
          <Error error={error} />
          <h2>Sell an Item.</h2>
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input type="file" id="file" name="file"
              placeholder="Upload an image" required
              onChange={this.uploadFile} />
              {this.state.image && <img src={this.state.image} alt="Upload Preview" />}
            </label>

            <label htmlFor="title">
              Title
              <input type="text" id="title" name="title"
              placeholder="title" required
              value={this.state.title}
              onChange={this.handleChange} />
            </label>
            <label htmlFor="price">
              Price
              <input type="number" id="price" name="price"
              placeholder="Price" required
              value={this.state.price}
              onChange={this.handleChange} />
            </label>
            <label htmlFor="description">
              Description
              <textarea type="number" name="description"
              placeholder="Enter a description" required
              onChange={this.handleChange} />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
        )}
      </Mutation>
    )
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };