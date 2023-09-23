import React, { useState, useEffect, useContext, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';

import AuthContext from '../context/auth-context';
import FileInput from '../components/ui/forms/FileInput';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import {
  SEARCH_SERIES_TITLES_QUERY,
  SEARCH_MOVIE_TITLES_QUERY,
  generateSendReferenceQuery,
} from '../util/graphql_queries';
import { useHttpClient } from '../hooks/http-hook';

import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const SendAReference = () => {
  const authContext = useContext(AuthContext);
  const [artwork, setArtwork] = useState('');
  const [artist, setArtist] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [isMovie, setIsMovie] = useState(true);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [episode, setEpisode] = useState();
  const [season, setSeason] = useState();
  const [file, setFile] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const autocompleteRef = useRef(null);
  const [submissionStatus, setSubmissionStatus] = useState({
    success: false,
    message: '',
  });
  const [shouldClearFileName, setShouldClearFileName] = useState(false);
  const [validity, setValidity] = useState({
    title: false,
    year: false,
    episode: true,
    season: true,
    artwork: false,
    artist: false,
    sceneDescription: false,
  });
  const [touched, setTouched] = useState({
    title: false,
    year: false,
    episode: true,
    season: true,
    artwork: false,
    artist: false,
    sceneDescription: false,
  });
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const clearForm = () => {
    setArtwork('');
    setArtist('');
    setSceneDescription('');
    setTitle('');
    setYear('');
    setEpisode('');
    setSeason('');
    setFile(null);
    setShouldClearFileName(true);
    setSearchTerm('');
    setValidity({
      title: false,
      year: false,
      episode: true,
      season: true,
      artwork: false,
      artist: false,
      sceneDescription: false,
    });

    setTouched({
      title: false,
      year: false,
      episode: true,
      season: true,
      artwork: false,
      artist: false,
      sceneDescription: false,
    });

    if (autocompleteRef.current) {
      autocompleteRef.current.querySelector('button').click();
      autocompleteRef.current.querySelector('input').blur();
    }
  };

  const clearSubmissionStatus = (resetShouldClearFilename = false) => {
    setTimeout(() => {
      setSubmissionStatus({
        success: false,
        message: '',
      });

      if (resetShouldClearFilename) {
        setShouldClearFileName(false);
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitForm = async (s3ImageUrl = null) => {
      // Construct the GraphQL request payload
      const SEND_REFERENCE_QUERY = generateSendReferenceQuery(
        artist,
        artwork,
        year,
        isMovie,
        title,
        season,
        episode,
        sceneDescription,
        s3ImageUrl
      );

      const requestBody = {
        query: SEND_REFERENCE_QUERY,
        variables: {
          productionType: isMovie ? 'movie' : 'series',
          productionTitle: title,
          productionYear: parseInt(year, 10),
          artist,
          artworkTitle: artwork,
          sceneDescription,
          season,
          episode,
          ...(s3ImageUrl && { sceneImageUrl: s3ImageUrl }),
        },
      };

      try {
        const graphqlResponse = await sendRequest(
          `http://127.0.0.1:4000/graphql`,
          'POST',
          JSON.stringify(requestBody),
          { 'Content-Type': 'application/json' } // without this the backend does not know what type of data they are receiving
        );

        console.log('graphqlResponse', graphqlResponse);

        if (graphqlResponse.data.createReference.success) {
          setSubmissionStatus({
            success: true,
            message: 'Reference sent successfully!',
          });

          clearForm();
          clearSubmissionStatus(true);
        } else {
          setSubmissionStatus({
            success: false,
            message: 'Something went wrong.',
          });

          clearSubmissionStatus();
        }
      } catch (err) {
        console.log('error', err);
      }
    };

    if (isFormValid()) {
      try {
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('mimeType', file.type);

          try {
            const s3Response = await sendRequest(
              `/api/s3Upload`,
              'POST',
              formData
            );

            console.log('s3Response', s3Response);

            if (!!s3Response.success) {
              const { s3ImageUrl } = s3Response;
              submitForm(s3ImageUrl);
            } else {
              setSubmissionStatus({
                success: false,
                message: 'Something went wrong with the file upload.',
              });

              clearSubmissionStatus();
            }
          } catch (err) {
            setSubmissionStatus({
              success: false,
              message: 'Something went wrong with the file upload.',
            });

            clearSubmissionStatus();
          }
        } else {
          submitForm();
        }
      } catch (error) {
        // Handle any errors here
        console.error(error);

        setSubmissionStatus({
          success: false,
          message: 'Something went wrong.',
        });

        clearSubmissionStatus();
      }
    }
  };

  const handleRadioChange = (event) => {
    setIsMovie(event.target.value === 'movie');
  };

  const handleInputChange = (field, value) => {
    const isValid = !!value;

    setTouched((prevState) => ({
      ...prevState,
      [field]: true,
    }));

    setValidity((prevState) => ({
      ...prevState,
      [field]: isValid,
    }));
  };

  const handleBlur = (field) => {
    if (!validity[field]) {
      setTouched((prevState) => ({
        ...prevState,
        [field]: true,
      }));
    }
  };

  useEffect(() => {}, [authContext]);

  useEffect(() => {
    if (!file) {
      return;
    }
  }, [file]);

  useEffect(() => {
    handleInputChange('title', title);
    handleInputChange('year', year);
  }, [title, year]);

  const onFileChangeHandler = (file) => {
    setFile(file);
  };

  const handleTitleInputChange = (value) => {
    setSearchTerm(value);

    // Trigger the GraphQL query when the user types at least 3 characters
    if (value.length >= 3) {
      searchTitles({ variables: { searchTerm: value } });
    }
  };

  const isFormValid = () => {
    return Object.values(validity).every((fieldValid) => fieldValid);
  };

  const [searchTitles, { loading, data }] = useLazyQuery(
    isMovie ? SEARCH_MOVIE_TITLES_QUERY : SEARCH_SERIES_TITLES_QUERY
  );

  return (
    <>
      {isLoading && <LoadingSpinner />}

      {authContext.isLoggedIn && (
        <>
          <Typography
            px={3}
            sx={{
              margin: '0',
              padding: '0',
              fontFamily: 'Staatliches',
              fontSize: '2.5rem',
            }}
          >
            Send a new reference
          </Typography>
          <Sheet
            sx={{
              width: '100%',
              mx: 'auto',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 'sm',
              boxShadow: 'md',
            }}
            variant="outlined"
          >
            <form onSubmit={handleSubmit}>
              <Grid
                container
                spacing={4}
                p={4}
                sx={{ alignItems: 'flex-start' }}
              >
                <Grid item xs={12}>
                  <Typography level="h4" component="h1">
                    <b>Welcome!</b>
                  </Typography>
                  <Typography level="body-sm" sx={{ fontSize: '1.2rem' }}>
                    Fill in the form below with the visual arts reference data:
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item sx={{ marginRight: '20px' }}>
                      <FormControl>
                        <RadioGroup
                          name="isMovie"
                          value={isMovie ? 'movie' : 'series'}
                          onChange={handleRadioChange}
                          sx={{
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Radio value="movie" sx={{ marginRight: '10px' }} />{' '}
                          Movie
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Grid item sx={{ marginRight: '20px' }}>
                      <FormControl>
                        <RadioGroup
                          name="isMovie"
                          value={isMovie ? 'movie' : 'series'}
                          onChange={handleRadioChange}
                          sx={{
                            fontSize: '1.1rem',
                            fontWeight: '500',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Radio value="series" sx={{ marginRight: '10px' }} />{' '}
                          Series
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                  <Grid container alignItems="center">
                    <Grid item xs={12}>
                      <FormControl sx={{ marginBottom: 2 }}>
                        <FormLabel sx={{ fontSize: '1.1rem' }}>
                          {isMovie ? 'Movie' : 'Series '} Title*
                        </FormLabel>

                        <Autocomplete
                          ref={autocompleteRef}
                          options={
                            isMovie && data
                              ? data?.searchMoviesQuery
                              : data?.searchSeriesQuery || []
                          }
                          getOptionLabel={(option) =>
                            `${option.title} (${option.year})`
                          }
                          loading={loading}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setTitle(newValue.title);
                              setYear(newValue.year);
                              setSearchTerm('');
                            } else {
                              setTitle('');
                              setYear('');
                              setSearchTerm('');
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              fullWidth
                              value={searchTerm}
                              onChange={(e) =>
                                handleTitleInputChange(e.target.value)
                              }
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  {!isMovie && (
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
                            handleInputChange('episode', e.target.value);
                          }}
                          onBlur={() => handleBlur('episode')}
                          sx={{
                            borderRadius: '4px',
                            padding: '15px',
                            borderColor:
                              touched.episode && !validity.episode
                                ? 'red'
                                : '#c2c2c2',
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
                            handleInputChange('season', e.target.value);
                          }}
                          onBlur={() => handleBlur('season')}
                          sx={{
                            borderRadius: '4px',
                            padding: '15px',
                            borderColor:
                              touched.season && !validity.season
                                ? 'red'
                                : '#c2c2c2',
                          }}
                        />
                      </FormControl>
                    </>
                  )}
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                  <FormControl sx={{ marginBottom: 2 }}>
                    <FormLabel sx={{ fontSize: '1.1rem' }}>
                      Artwork referenced*
                    </FormLabel>
                    <Input
                      name="artwork"
                      type="text"
                      value={artwork}
                      onChange={(e) => {
                        setArtwork(e.target.value);
                        handleInputChange('artwork', e.target.value);
                      }}
                      onBlur={() => handleBlur('artwork')}
                      required
                      sx={{
                        borderRadius: '4px',
                        padding: '15px',
                        borderColor:
                          touched.artwork && !validity.artwork
                            ? 'red'
                            : '#c2c2c2',
                      }}
                    />
                  </FormControl>

                  <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                    <FormLabel sx={{ fontSize: '1.1rem' }}>Artist*</FormLabel>
                    <Input
                      name="artist"
                      type="text"
                      value={artist}
                      onChange={(e) => {
                        setArtist(e.target.value);
                        handleInputChange('artist', e.target.value);
                      }}
                      onBlur={() => handleBlur('artist')}
                      required
                      sx={{
                        borderRadius: '4px',
                        padding: '15px',
                        borderColor:
                          touched.artist && !validity.artist
                            ? 'red'
                            : '#c2c2c2',
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} lg={4}>
                  <FormControl sx={{ marginBottom: 2 }}>
                    <FormLabel sx={{ fontSize: '1.1rem' }}>
                      Scene description*
                    </FormLabel>
                    <Input
                      name="sceneDescription"
                      type="text"
                      value={sceneDescription}
                      onChange={(e) => {
                        setSceneDescription(e.target.value);
                        handleInputChange('sceneDescription', e.target.value);
                      }}
                      onBlur={() => handleBlur('sceneDescription')}
                      required
                      sx={{
                        borderRadius: '4px',
                        padding: '15px',
                        borderColor:
                          touched.sceneDescription && !validity.sceneDescription
                            ? 'red'
                            : '#c2c2c2',
                      }}
                    />
                  </FormControl>

                  <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                    <FileInput
                      onFileChange={(file) => onFileChangeHandler(file)}
                      shouldClearFileName={shouldClearFileName}
                    />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  {submissionStatus.success && (
                    <Typography
                      sx={{
                        color: 'green',
                        fontSize: '1.3em',
                        display: 'flex',
                        alignItems: 'center',
                        margin: '0 20px',
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
                        margin: '0 20px',
                      }}
                    >
                      <ErrorIcon sx={{ marginX: '5px' }} />{' '}
                      {submissionStatus.message}
                    </Typography>
                  )}

                  <Button
                    type="submit"
                    sx={{
                      mt: 1,
                      width: '120px',
                      background:
                        'linear-gradient(45deg, #ffe622, #ff54fd, #2196F3);',
                      fontSize: '1.1rem',
                      opacity: '1',
                      filter: `grayscale(${isFormValid() ? 0 : 1})`,
                      color: isFormValid() ? 'white' : '#000!important',
                    }}
                    disabled={!isFormValid()}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Sheet>
        </>
      )}

      {!authContext.isLoggedIn && (
        <Typography
          px={3}
          sx={{
            margin: '0',
            padding: '0',
            fontFamily: 'Staatliches',
            fontSize: '2.5rem',
          }}
        >
          Please login before sending a new reference!
        </Typography>
      )}
    </>
  );
};

export default SendAReference;
