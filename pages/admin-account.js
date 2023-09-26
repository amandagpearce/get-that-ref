import React, { useEffect } from 'react';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useQuery, gql } from '@apollo/client';

import AuthContext from '../context/auth-context';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  GET_REFERENCES_TO_APPROVE,
  generateEditRefMutationQuery,
  generateApproveRefMutationQuery,
} from '../util/graphql_queries';

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Grid,
} from '@mui/material';
import { Sheet, FormControl, FormLabel, Input } from '@mui/joy';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

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
  const [submissionStatus, setSubmissionStatus] = useState({
    success: false,
    message: '',
  });
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext.isLoggedIn || authContext.userType !== 'admin') {
      router.push('/');
    }
  }, [authContext, router]);

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

  const sanitizeInput = (input) => {
    // Replace double quotes with single quotes
    return input.replace(/"/g, "'");
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();

    const clearArtworkDescription = sanitizeInput(artworkDescription);
    const clearArtworkTitle = sanitizeInput(artworkTitle);
    const clearSceneDescription = sanitizeInput(sceneDescription);
    const clearArtist = sanitizeInput(artist);
    const clearCurrentLocation = sanitizeInput(currentLocation);
    const id = editData;

    console.log('id', id);
    console.log('clearArtworkDescription', clearArtworkDescription);

    const EDIT_REF_MUTATION_QUERY = generateEditRefMutationQuery({
      id,
      productionType,
      clearArtworkDescription,
      artworkYear,
      clearArtworkTitle,
      size,
      clearCurrentLocation,
      title,
      year,
      episode,
      season,
      clearArtist,
      clearSceneDescription,
    });

    try {
      // Send the GraphQL request to your server
      const graphqlResponse = await fetch('http://127.0.0.1:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: EDIT_REF_MUTATION_QUERY }),
      });

      // Handle the response from the server
      const result = await graphqlResponse.json();

      if (result.data.createReference.success) {
        setSubmissionStatus({
          success: true,
          message: 'Reference sent successfully!',
        });

        resetSubmissionMessage();

        refetch();
        setEditData(null);
      } else {
        setSubmissionStatus({
          success: false,
          message: 'Something went wrong.',
        });

        resetSubmissionMessage();
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
        setSubmissionStatus({
          success: true,
          message: 'Reference deleted successfully!',
        });

        resetSubmissionMessage();

        refetch();
        setEditData(null);
      } else {
        setSubmissionStatus({
          success: false,
          message: 'Something went wrong with deleting this ref.',
        });

        resetSubmissionMessage();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleApproveClick = async (card) => {
    const APPROVE_REF_MUTATION_QUERY = generateApproveRefMutationQuery(card);

    try {
      // Send the GraphQL request to your server
      const graphqlResponse = await fetch('http://127.0.0.1:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: APPROVE_REF_MUTATION_QUERY }),
      });

      // Handle the response from the server
      const result = await graphqlResponse.json();

      if (result.data.addInformation.success) {
        setSubmissionStatus({
          success: true,
          message: 'Reference sent successfully!',
        });

        resetSubmissionMessage();
        /* ref was approved so delete ref from refs_to_approve table */
        // handleDeleteClick(card.id);

        refetch();
        setEditData(null);
      }
    } catch (error) {
      console.error('Error:', error);

      setSubmissionStatus({
        success: false,
        message: 'Something went wrong.',
      });

      resetSubmissionMessage();
    }
  };

  const resetSubmissionMessage = () => {
    setTimeout(() => {
      setSubmissionStatus({
        success: false,
        message: '',
      });
    }, 3000);
  };

  const cards = data.references.map((card, key) => {
    const editMode = editData === card.id;

    return (
      <Grid item xs={12} key={key}>
        <Card
          xs={12}
          id={card.id}
          sx={{ display: 'flex', flexWrap: 'no-wrap' }}
        >
          <CardMedia
            xs={4}
            component="img"
            alt={card.productionTitle}
            height="auto"
            style={{ maxWidth: '300px' }}
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
                onClick={() => handleApproveClick(card)}
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
      {!authContext.isLoggedIn ||
        (authContext.userType !== 'admin' && <LoadingSpinner />)}

      {authContext.isLoggedIn && authContext.userType === 'admin' && (
        <>
          <Typography
            variant="h4"
            component="h3"
            px={3}
            sx={{ marginTop: '1em', fontFamily: 'Staatliches' }}
          >
            Refs to approve:
          </Typography>

          {cards}

          {submissionStatus.success && (
            <Typography
              sx={{
                color: 'green',
                fontSize: '1.3em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                margin: '20px 0',
                width: '100%',
              }}
            >
              <CheckCircleIcon sx={{ marginX: '5px' }} />{' '}
              {submissionStatus.message}
            </Typography>
          )}

          {!submissionStatus.success && submissionStatus.message && (
            <Typography
              sx={{
                color: 'red',
                fontSize: '1.3em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                margin: '20px 0',
                width: '100%',
              }}
            >
              <ErrorIcon sx={{ marginX: '5px' }} /> {submissionStatus.message}
            </Typography>
          )}

          {!cards.length && (
            <Typography
              sx={{
                fontSize: '1.3em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px 0',
                width: '100%',
              }}
            >
              Nothing to approve yet.
            </Typography>
          )}
        </>
      )}
    </Grid>
  );
};

export default AdminAccount;
