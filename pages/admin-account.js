import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Container } from '@mui/material';

const AdminAccount = () => {
  const DUMMY_TO_APPROVE_ARRAY = [
    {
      productionType: 'movie',
      productionTitle: 'The Dreamers',
      productionYear: '2003',
      artworkReferenced: 'Venus de Milo',
      artist: 'Alexandre de Antioquia',
      sceneDescription:
        "Just as the Venus de Milo represents classical beauty and grace, Isabelle's wearing of black gloves against a dark background creates a striking contrast that accentuates her hands and, by extension, her sensuality. In both instances, the visual elements are carefully composed to evoke a sense of elegance and allure. While the Venus de Milo is a classical representation of feminine beauty in art, Isabelle's scene adds a contemporary, provocative twist to the exploration of sensuality. The black gloves, much like the timeless allure of the Venus de Milo, symbolize the enduring fascination with the aesthetics of desire and the complexities of human sexuality, making it a thought-provoking and visually captivating moment in the film.",
      image:
        'https://static.boredpanda.com/blog/wp-content/uploads/2020/12/art-references-in-movies-35-5fc8d799c8fc7__700.jpg',
    },
    {
      productionType: 'movie',
      productionTitle: 'The Dreamers',
      productionYear: '2003',
      artworkReferenced: 'Venus de Milo',
      artist: 'Alexandre de Antioquia',
      sceneDescription:
        "Just as the Venus de Milo represents classical beauty and grace, Isabelle's wearing of black gloves against a dark background creates a striking contrast that accentuates her hands and, by extension, her sensuality. In both instances, the visual elements are carefully composed to evoke a sense of elegance and allure. While the Venus de Milo is a classical representation of feminine beauty in art, Isabelle's scene adds a contemporary, provocative twist to the exploration of sensuality. The black gloves, much like the timeless allure of the Venus de Milo, symbolize the enduring fascination with the aesthetics of desire and the complexities of human sexuality, making it a thought-provoking and visually captivating moment in the film.",
    },
  ];

  const cards = DUMMY_TO_APPROVE_ARRAY.map((card, key) => {
    return (
      <Grid item xs={12}>
        <Card xs={12} sx={{ display: 'flex' }}>
          <CardMedia
            component="img"
            alt={card.productionTitle}
            height="auto"
            style={{ maxWidth: '500px' }}
            image={card.image ? card.image : 'https://placehold.co/500x450'}
          />
          <CardContent sx={{ boxShadow: 'none' }}>
            <Typography gutterBottom variant="h6" component="h6" px={6} py={1}>
              {card.artworkReferenced}
            </Typography>
            <Typography gutterBottom variant="h7" component="h7" px={6} py={1}>
              <b>from </b>
              {card.artist}
            </Typography>
            <Typography gutterBottom variant="h7" component="p" px={6} py={1}>
              <b>in </b>
              {card.productionTitle}&nbsp;({card.productionYear})
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              px={6}
              sx={{ textAlign: 'justify' }}
            >
              {card.sceneDescription}
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="outlined" color="success" size="medium">
              Approve
            </Button>
            <Button variant="outlined" color="error" size="medium">
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  });

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4} my={4}>
        {cards}
      </Grid>
    </Container>
  );
};

export default AdminAccount;
