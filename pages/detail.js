import React from 'react'
import Router from 'next/router'
import "../assets/styles.scss"

export default class extends React.Component {

  static getInitialProps({query}) {
    return {query}
  }

  render() {
    console.log(this.props.query) // The query is available in the props object
    let moviePoster = ''
    if(this.props.query.Poster === 'N/A') {
      moviePoster = 'http://tr.web.img4.acsta.net/r_1280_720/pictures/bzp/01/121163.jpg'
    } else {
      moviePoster = this.props.query.Poster
    }
    return (
      <div>
        <div className='detailContainer'>
          <div className='left'>
            <img src={moviePoster} />
          </div>
          <div className='right'>
            <table>
              <tbody>
                <tr>
                  <td className='heads'>Title: </td>
                  <td className='infos'>{this.props.query.Title}</td>
                </tr>
                <tr>
                  <td className='heads'>Type:</td>
                  <td className='infos'>{this.props.query.Type}</td>
                </tr>
                <tr>
                  <td className='heads'>Year:</td>
                  <td className='infos'>{this.props.query.Year}</td>
                </tr>
                <tr>
                  <td className='heads'>imdbID:</td>
                  <td className='infos'>{this.props.query.imdbID}</td>
                </tr>
              </tbody>
            </table>
            <div className='toHome'>
              <button className='button is-dark' onClick={() => Router.push('/')}>
                Home page
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}