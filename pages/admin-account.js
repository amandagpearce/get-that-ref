import * as React from 'react';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Container } from '@mui/material';
import { useQuery, gql } from '@apollo/client';
import { useMutation } from '@apollo/client';
import Sheet from '@mui/joy/Sheet';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';

const GET_REFERENCES_TO_APPROVE = gql`
  query {
    references {
      id
      productionType
      productionTitle
      productionYear
      season
      episode
      artist
      artworkTitle
      artworkDescription
      artworkYear
      size
      currentLocation
      sceneDescription
      sceneImgUrl
    }
  }
`;

const AdminAccount = () => {
  const [artworkTitle, setArtworkTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [episode, setEpisode] = useState('');
  const [season, setSeason] = useState('');
  const [artworkDescription, setArtworkDescription] = useState('');
  const [artworkYear, setArtworkYear] = useState('');
  const [size, setArtworkSize] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [editData, setEditData] = useState(null);
  const [productionType, setProductionType] = useState('');

  const { loading, error, data, refetch } = useQuery(
    GET_REFERENCES_TO_APPROVE,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleEditClick = (reference) => {
    setArtworkTitle(reference.artworkTitle);
    setArtist(reference.artist);
    setSceneDescription(reference.sceneDescription);
    setTitle(reference.productionTitle);
    setYear(reference.productionYear);
    setProductionType(reference.productionType);
    setArtworkYear(reference.artworkYear);
    setArtworkSize(reference.size);
    setArtworkDescription(reference.artworkDescription);
    setCurrentLocation(reference.currentLocation);

    if (reference.productionType === 'series') {
      setEpisode(reference.episode);
      setSeason(reference.season);
    }

    if (editData === reference.id) {
      // If the clicked card is already in edit mode, exit edit mode
      setEditData(null);
    } else {
      // Set the clicked card in edit mode
      setEditData(reference.id);
    }
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    const clearArtworkDescription = artworkDescription.replace(/"/g, "'");
    const escapedArtworkDescription = JSON.stringify(clearArtworkDescription);

    // Construct the GraphQL mutation
    const graphqlMutation = `
      mutation {
        createReference(
          id: ${editData},
          productionType: "${productionType}",
          artworkDescription: ${escapedArtworkDescription},
          artworkYear: ${artworkYear},
          artworkTitle: "${artworkTitle}",
          size: "${size}",
          currentLocation: "${currentLocation}",
          productionTitle: "${title}",
          productionYear: ${year},
          episode: ${episode},
          season: ${season},
          artist: "${artist}",
          sceneDescription: "${sceneDescription}"
        ) {
          success
          message
        }
      }
    `;

    try {
      // Send the GraphQL request to your server
      const graphqlResponse = await fetch('http://127.0.0.1:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: graphqlMutation }),
      });

      // Handle the response from the server
      const result = await graphqlResponse.json();

      if (result.data.createReference.success) {
        // setSubmissionStatus({
        //   success: true,
        //   message: 'Reference sent successfully!',
        // });
        refetch();
        setEditData(null);
      } else {
        // setSubmissionStatus({
        //   success: false,
        //   message: 'Something went wrong.',
        // });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    // Construct the GraphQL mutation
    const graphqlMutation = `
      mutation {
        deleteReference(
          id: ${id},
        ) {
          success
          message
        }
      }
    `;

    try {
      // Send the GraphQL request to your server
      const graphqlResponse = await fetch('http://127.0.0.1:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: graphqlMutation }),
      });

      // Handle the response from the server
      const result = await graphqlResponse.json();

      if (result.data.deleteReference.success) {
        // setSubmissionStatus({
        //   success: true,
        //   message: 'Reference sent successfully!',
        // });
        refetch();
        setEditData(null);
      } else {
        // setSubmissionStatus({
        //   success: false,
        //   message: 'Something went wrong.',
        // });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cards = data.references.map((card, key) => {
    const editMode = editData === card.id;

    return (
      <Grid item xs={12}>
        <Card xs={12} sx={{ display: 'flex', flexWrap: 'no-wrap' }}>
          <CardMedia
            xs={4}
            component="img"
            alt={card.productionTitle}
            height="auto"
            style={{ maxWidth: '500px' }}
            image={
              card.sceneImgUrl
                ? card.sceneImgUrl
                : 'https://placehold.co/500x450'
            }
          />

          <CardContent xs={8} sx={{ boxShadow: 'none' }}>
            <CardActions xs={12}>
              <Button
                onClick={() => handleEditClick(card)}
                variant={editMode ? 'contained' : 'outlined'}
                color="warning"
                size="medium"
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="success"
                size="medium"
                disabled={editMode ? 'disabled' : false}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="medium"
                onClick={() => handleDeleteClick(card.id)}
                disabled={editMode ? 'disabled' : false}
              >
                Delete
              </Button>
            </CardActions>

            <div style={{ padding: '0 10px', marginTop: '10px' }}>
              {!editMode && (
                <>
                  <Typography gutterBottom variant="body1" component="p">
                    <b>Artwork Title: </b>
                    {card.artworkTitle}
                    {card.artworkYear ? ` (${card.artworkYear})` : ''}
                  </Typography>
                  <Typography gutterBottom variant="body1" component="p">
                    <b>Artist: </b>
                    {card.artist}
                  </Typography>

                  {card.size && (
                    <Typography gutterBottom variant="body1" component="p">
                      <b>Artwork Size: </b>
                      {card.size}
                    </Typography>
                  )}

                  {card.artworkDescription && (
                    <Typography gutterBottom variant="body1" component="p">
                      <b>Artwork Description: </b>
                      {card.artworkDescription}
                    </Typography>
                  )}

                  <Typography gutterBottom variant="body1" component="p">
                    <b>Referenced in: </b>
                    {card.productionType} {card.productionTitle}&nbsp;(
                    {card.productionYear})
                    {card.episode &&
                      card.season &&
                      ` - S${card.season}E${card.episode}`}
                  </Typography>
                  <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                    <b>Scene Description: </b>
                    {card.sceneDescription}
                  </Typography>
                </>
              )}

              {editMode && (
                <Sheet
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'sm',
                    boxShadow: 'none',
                    padding: '10px',
                    boxSizing: 'border-box',
                  }}
                >
                  <form onSubmit={handleEditFormSubmit}>
                    <Grid
                      container
                      spacing={2}
                      sx={{ alignItems: 'flex-start' }}
                    >
                      <Grid item xs={12} md={6} lg={4}>
                        <Grid container alignItems="center">
                          <Grid item xs={12}>
                            <FormControl>
                              <FormLabel sx={{ fontSize: '1.1rem' }}>
                                {card.productionType === 'movie'
                                  ? 'Movie '
                                  : 'Series '}
                                Title
                              </FormLabel>
                              <Input
                                name="title"
                                type="text"
                                value={title}
                                required
                                onChange={(e) => {
                                  setTitle(e.target.value);
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item xs={12}>
                            <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                              <FormLabel sx={{ fontSize: '1.1rem' }}>
                                {card.productionType === 'movie'
                                  ? 'Movie '
                                  : 'Series '}{' '}
                                Year
                              </FormLabel>
                              <Input
                                name="year"
                                type="number"
                                value={year}
                                onChange={(e) => {
                                  setYear(e.target.value);
                                }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>

                        {card.productionType === 'series' && (
                          <>
                            <FormControl sx={{ marginBottom: 2 }}>
                              <FormLabel sx={{ fontSize: '1.1rem' }}>
                                Episode
                              </FormLabel>
                              <Input
                                name="episode"
                                type="text"
                                value={episode}
                                onChange={(e) => {
                                  setEpisode(e.target.value);
                                }}
                              />
                            </FormControl>
                            <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                              <FormLabel sx={{ fontSize: '1.1rem' }}>
                                Season
                              </FormLabel>
                              <Input
                                name="season"
                                type="text"
                                value={season}
                                onChange={(e) => {
                                  setSeason(e.target.value);
                                }}
                              />
                            </FormControl>
                          </>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6} lg={4}>
                        <FormControl sx={{ marginBottom: 2 }}>
                          <FormLabel sx={{ fontSize: '1.1rem' }}>
                            Artwork Title
                          </FormLabel>
                          <Input
                            name="artwork"
                            type="text"
                            value={artworkTitle}
                            onChange={(e) => {
                              setArtworkTitle(e.target.value);
                            }}
                          />
                        </FormControl>

                        <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                          <FormLabel sx={{ fontSize: '1.1rem' }}>
                            Artist
                          </FormLabel>
                          <Input
                            name="artist"
                            type="text"
                            value={artist}
                            onChange={(e) => {
                              setArtist(e.target.value);
                            }}
                          />
                        </FormControl>

                        <FormControl sx={{ marginBottom: 2 }}>
                          <FormLabel sx={{ fontSize: '1.1rem' }}>
                            Artwork year
                          </FormLabel>
                          <Input
                            name="artworkYear"
                            type="number"
                            value={artworkYear}
                            onChange={(e) => {
                              setArtworkYear(e.target.value);
                            }}
                          />
                        </FormControl>

                        <FormControl sx={{ marginBottom: 2 }}>
                          <FormLabel sx={{ fontSize: '1.1rem' }}>
                            Artwork size
                          </FormLabel>
                          <Input
                            name="artworkSize"
                            type="text"
                            value={size}
                            onChange={(e) => {
                              setArtworkSize(e.target.value);
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6} lg={4}>
                        <FormControl sx={{ marginBottom: 2 }}>
                          <FormLabel sx={{ fontSize: '1.1rem' }}>
                            Scene description
                          </FormLabel>
                          <Input
                            name="sceneDescription"
                            type="text"
                            value={sceneDescription}
                            onChange={(e) => {
                              setSceneDescription(e.target.value);
                            }}
                          />
                        </FormControl>

                        <FormControl sx={{ marginBottom: 2 }}>
                          <FormLabel sx={{ fontSize: '1.1rem' }}>
                            Artwork description
                          </FormLabel>
                          <Input
                            name="artworkDescription"
                            type="text"
                            value={artworkDescription}
                            onChange={(e) => {
                              setArtworkDescription(e.target.value);
                            }}
                          />
                        </FormControl>

                        <FormControl sx={{ marginBottom: 2 }}>
                          <FormLabel sx={{ fontSize: '1.1rem' }}>
                            Artwork current location
                          </FormLabel>
                          <Input
                            name="currentLocation"
                            type="text"
                            value={currentLocation}
                            onChange={(e) => {
                              setCurrentLocation(e.target.value);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <Button
                          type="submit"
                          sx={{
                            mt: 1,
                            width: '120px',
                            color: '#FFF',
                            background:
                              'linear-gradient(45deg, #ffe622, #ff54fd, #2196F3);',
                            fontSize: '1.1rem',
                            opacity: '1',
                          }}
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Sheet>
              )}
            </div>
          </CardContent>
        </Card>
      </Grid>
    );
  });

  return (
    <Grid container spacing={4} px={4}>
      <Typography
        variant="h4"
        component="h3"
        px={3}
        sx={{ marginTop: '1em', fontFamily: 'Staatliches' }}
      >
        Refs to approve:
      </Typography>
      {cards}
    </Grid>
  );
};

export default AdminAccount;
