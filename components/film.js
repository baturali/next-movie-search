import React from 'react';
import Router from 'next/router'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    width: '100%',
    maxHeight: 600,
    boxShadow: '0 4px 20px 5px rgba(0,0,0,0.35)',
    mozBoxShadow: '0px 1px 20px 5px rgba(0,0,0,0.35)',
    webkitBoxShadow: '0px 1px 20px 5px rgba(0,0,0,0.35)'
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'contain',
    height: '400px'
  },
  title: {
    height: 'auto',
    padding: '15px'
  }
};

function ImgMediaCard(props) {
  const { classes } = props;
  const filmObj = props.filmInfo
  const defaultImage = 'http://tr.web.img4.acsta.net/r_1280_720/pictures/bzp/01/121163.jpg'
  let Poster = filmObj.Poster || defaultImage
  if(filmObj.Poster == 'N/A') Poster = defaultImage
  return (
    <Card 
      onClick={
        () => Router.push({
          pathname: '/detail',
          query: filmObj
        })
      }
      className={classes.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt={filmObj.Title}
          className={classes.media}
          image={Poster}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography 
            gutterBottom
            variant="subheading"
            className={classes.title}>
            { filmObj.Title }
          </Typography>
          <Typography component="p">
            { filmObj.Year }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

ImgMediaCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImgMediaCard);