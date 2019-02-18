import React from 'react'
import dynamic from 'next/dynamic'
import fetch from 'isomorphic-unfetch'
import Head from 'next/head' 
import '../assets/styles.scss'

const Search = dynamic(() => import('../components/search'), {
  ssr: false
})
const Film = dynamic(() => import('../components/film'), {
  ssr: false
})

function debounce(a,b,c){var d,e;return function(){function h(){d=null,c||(e=a.apply(f,g))}var f=this,g=arguments;return clearTimeout(d),d=setTimeout(h,b),c&&!d&&(e=a.apply(f,g)),e}}
const Bounce = 300

export default class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      film: {
        Title: 'Film'
      },
      films: [],
      currentPage: 1,
      filmsPerPage: 20,
      totalResults: 0,
      searchedString: '',
      viewedPages: []
    }
  }

  static getInitialProps({query}) {
    return {query}
  }

  // handling escape close
  componentDidMount() {
    document.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
  }

  changePage(event) {
    if(event.target && event.target.id) 
      this.state.currentPage = Number(event.target.id)
    else
      this.state.currentPage = event
    this.fetchFilms(this.state.searchedString)
  }

  fetchBegin = debounce((e, isTyped) => {
    this.fetchFilms(e, isTyped)
  }, Bounce)

  async fetchFilms(query, isTyped) {
    if(isTyped) {
      this.setState({
        currentPage: 1
      })
    }
    if(
      !this.state.viewedPages.includes(this.state.currentPage+1) || this.state.searchedString != query
    ) {
      try {
        if(query.length) {
          var data = await Promise.all([
            fetch('http://www.omdbapi.com/?s='+query+'&page='+this.state.currentPage+'&apikey=4dfc64fa').then((response) => response.json()),// parse each response as json
            fetch('http://www.omdbapi.com/?s='+query+'&page='+(this.state.currentPage+1)+'&apikey=4dfc64fa').then((response) => response.json())
          ])
          console.log('data', data)
          
          for (var tenResult of data) {
            if(this.state.films[0] &&
              data[0].Search[0].Title !== this.state.films[0].Title &&
              this.state.viewedPages.includes(this.state.currentPage+1)
            ) {
              let newFilms = new Array()
              for (var obj of tenResult.Search) {
                newFilms.push(obj)
              }
              this.setState({
                films: newFilms,
                currentPage: 1,
                viewedPages: [1]
              })
            } else {
              for (var obj of tenResult.Search) {
                this.setState(prevState => ({
                  films: [...prevState.films, obj]
                }))
              }
            }
          }

          let totalFilms = Number(data[0].totalResults)
          this.setState(prevState => ({
            viewedPages: [...prevState.viewedPages, this.state.currentPage+1],
            totalResults: totalFilms,
            searchedString: query
          }))
          localStorage.setItem('query', query)
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      this.setState({
        films: this.state.films
      })
    }
  }

  render() {
    let { currentPage, filmsPerPage, films, totalResults, viewedPages } = this.state

    // Logic for listing Films on the page
    let filmsOnOnePage = 0
    let indexOfFirstFilm = 0
    let filmsByOnePage = 0
    if(viewedPages.includes(currentPage) && viewedPages.includes(currentPage+1)) {
      filmsOnOnePage = currentPage * filmsPerPage
      indexOfFirstFilm = filmsOnOnePage - filmsPerPage
      filmsByOnePage = films.slice(indexOfFirstFilm, filmsOnOnePage)
    } else {
      const filmsOnOnePage = currentPage * filmsPerPage
      const indexOfFirstFilm = filmsOnOnePage - filmsPerPage

      if(viewedPages.length) {
        let missingNumbers = (a, l=true) => Array.from(Array(Math.max(...a)).keys()).map((n, i) => a.indexOf(i) < 0  && (!l || i > Math.min(...a)) ? i : null).filter(f=>f);
        let missingPages = missingNumbers(viewedPages)
        if(missingPages.length) {
          const newIndexFirstFilm = missingPages.length * filmsPerPage
          if(indexOfFirstFilm > newIndexFirstFilm)
            filmsByOnePage = films.slice(indexOfFirstFilm-newIndexFirstFilm, filmsOnOnePage)
          else 
            filmsByOnePage = films.slice(newIndexFirstFilm-indexOfFirstFilm, filmsOnOnePage)
        } else {
          filmsByOnePage = films.slice(indexOfFirstFilm, filmsOnOnePage)
        }
      } else {
        filmsByOnePage = films.slice(indexOfFirstFilm, filmsOnOnePage)
      }
      
    }

    const renderFilms = filmsByOnePage.map((film, index) => {
      return (
        <div className='padding column is-variable is-one-third' key={index}>
          <Film filmInfo={film} />
        </div>
      )
    })

    // Logic for displaying page numbers
    const pageNumbers = new Array()
    for (let i = 1; i <= Math.ceil(totalResults / filmsPerPage); i++) {
      pageNumbers.push(i)
    }

    const renderPageNumbers = pageNumbers.map(number => {
      return (
        <button
          key={number}
          id={number}
          className={currentPage === number ? 'selected' : ''}
          onClick={() => this.changePage(number)}>
          {number}
        </button>
      )
    })

    return (
      <div>
        <Head>
          <title>Movie Search Application</title>
          <link rel='shortcut icon' type='image/png' href='https://image.flaticon.com/icons/png/128/263/263068.png'/>
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>
        <div className='search-bar'>
          <div className='align'>
            <Search 
              inputTypeSearch={true}
              type='search'
              autoFocus={true}
              fullWidth={true}
              sendKeyPress={(val) => this.fetchBegin(val, true)}
              defaultText='Type the film name...' />
          </div>
        </div>
        <div className='list'>
          <div className='margin'>
            <div className='films-box'>
              <div className='columns is-multiline film-container'>
                {!renderFilms.length &&
                  <h1 className='defaultText'>
                    Type any Film name you want to search!
                  </h1>
                }
                {renderFilms}
              </div>
            </div>
          </div>

          <div className='pagination-box'>
            <ul id='page-numbers'>
              {renderPageNumbers}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}
