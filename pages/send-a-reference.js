import React, { useState, useEffect } from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const SendAReference = () => {
  const [artwork, setArtwork] = useState('');
  const [artist, setArtist] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [isMovie, setIsMovie] = useState(true);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [episode, setEpisode] = useState(null);
  const [season, setSeason] = useState(null);
  const [file, setFile] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState({
    success: false,
    message: '',
  });

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

  useEffect(() => {
    // This will ensure the component is rendered on the client side.
  }, []);

  const clearForm = () => {
    setArtwork('');
    setArtist('');
    setSceneDescription('');
    setTitle('');
    setYear('');
    setEpisode('');
    setSeason('');
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormValid()) {
      try {
        if (file) {
          const formData = new FormData();
          formData.append('file', file); // Append the Blob object
          formData.append('mimeType', file.type); // Append the MIME type

          // Make a POST request to the /api/uploadToS3 route
          const response = await fetch('/api/s3Upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            // Parse the response to get the S3 URL
            const { s3ImageUrl } = await response.json();
            console.log('s3ImageUrl', s3ImageUrl);

            // Define your GraphQL query string here (unchanged)
            const graphqlQuery = `
            mutation {
              createReference(
                artist: "${artist}",
                artworkTitle: "${artwork}",
                productionYear: ${parseInt(year, 10)},
                productionType: "${isMovie ? 'movie' : 'series'}",
                productionTitle: "${title}",
                ${season !== null ? `season: ${parseInt(season, 10)},` : ''}
                ${episode !== null ? `episode: ${parseInt(episode, 10)},` : ''}
                sceneDescription: "${sceneDescription}",
                sceneImgUrl: "${s3ImageUrl}"
              ) {
                success
                message
              }
            }
          `;

            // Construct the GraphQL request payload (unchanged)
            const requestBody = {
              query: graphqlQuery,
              variables: {
                productionType: isMovie ? 'movie' : 'series',
                productionTitle: title,
                productionYear: parseInt(year, 10),
                artist,
                artworkTitle: artwork,
                sceneDescription,
                season,
                episode,
                sceneImageUrl: s3ImageUrl, // Include the S3 URL in the request
              },
            };

            // Send the GraphQL request to your server (unchanged)
            const graphqlResponse = await fetch(
              'http://127.0.0.1:4000/graphql',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
              }
            );

            // Handle the response from the server (unchanged)
            const result = await graphqlResponse.json();

            console.log('result.data', result.data);

            if (result.data.createReference.success) {
              setSubmissionStatus({
                success: true,
                message: 'Reference sent successfully!',
              });
              clearForm();
            } else {
              setSubmissionStatus({
                success: false,
                message: 'Something went wrong.',
              });
            }
          } else {
            console.error('Error uploading to S3:', response.status);
            setSubmissionStatus({
              success: false,
              message: 'Something went wrong with the file upload.',
            });
          }
        }
      } catch (error) {
        // Handle any errors here
        console.error(error);
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

  const isFormValid = () => {
    return Object.values(validity).every((fieldValid) => fieldValid);
  };

  // will trigger whenever the file changes
  useEffect(() => {
    if (!file) {
      return;
    }
  }, [file]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const blob = new Blob([selectedFile], { type: selectedFile.type });
      console.log('blob.type', blob.type);
      setFile(blob);
    } else {
      setSceneImgUrl(null);
      setFile(null);
    }
  };

  return (
    <Sheet
      sx={{
        width: '100%',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 'sm',
        boxShadow: 'md',
      }}
      variant="outlined"
    >
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} p={4} sx={{ alignItems: 'flex-start' }}>
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
                    <Radio value="movie" sx={{ marginRight: '10px' }} /> Movie
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
                    <Radio value="series" sx={{ marginRight: '10px' }} /> Series
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <FormControl>
                  <FormLabel sx={{ fontSize: '1.1rem' }}>
                    {isMovie ? 'Movie' : 'Series '} Title*
                  </FormLabel>
                  <Input
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      handleInputChange('title', e.target.value);
                    }}
                    onBlur={() => handleBlur('title')}
                    required
                    sx={{
                      borderColor:
                        touched.title && !validity.title ? 'red' : '#cdd7e1',
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                  <FormLabel sx={{ fontSize: '1.1rem' }}>
                    {isMovie ? 'Movie' : 'Series '} Year*
                  </FormLabel>
                  <Input
                    name="year"
                    type="number"
                    value={year}
                    onChange={(e) => {
                      setYear(e.target.value);
                      handleInputChange('year', e.target.value);
                    }}
                    onBlur={() => handleBlur('year')}
                    required
                    sx={{
                      borderColor:
                        touched.year && !validity.year ? 'red' : '#cdd7e1',
                    }}
                  />
                </FormControl>
              </Grid>
            </Grid>

            {!isMovie && (
              <>
                <FormControl sx={{ marginBottom: 2 }}>
                  <FormLabel sx={{ fontSize: '1.1rem' }}>Episode</FormLabel>
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
                      borderColor:
                        touched.episode && !validity.episode
                          ? 'red'
                          : '#cdd7e1',
                    }}
                  />
                </FormControl>
                <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                  <FormLabel sx={{ fontSize: '1.1rem' }}>Season</FormLabel>
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
                      borderColor:
                        touched.season && !validity.season ? 'red' : '#cdd7e1',
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
                  borderColor:
                    touched.artwork && !validity.artwork ? 'red' : '#cdd7e1',
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
                  borderColor:
                    touched.artist && !validity.artist ? 'red' : '#cdd7e1',
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
                  borderColor:
                    touched.sceneDescription && !validity.sceneDescription
                      ? 'red'
                      : '#cdd7e1',
                }}
              />
            </FormControl>

            <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
              <FormLabel sx={{ fontSize: '1.1rem' }}>
                Scene screenshot/print/image
              </FormLabel>
              <Input
                name="file"
                type="file"
                accept=".png, .jpeg, .jpg"
                onChange={handleFileChange}
                sx={{ paddingTop: '7px' }}
              />
            </FormControl>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {/* Display the success message if submission was successful */}
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

            {/* Display the error message if there was an error */}
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
                <ErrorIcon sx={{ marginX: '5px' }} /> {submissionStatus.message}
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
                filter: `grayscale(${isFormValid() ? 0 : 1})`, // Apply grayscale filter when disabled
                color: isFormValid() ? 'white' : '#000!important', // Change color to black when disabled
              }}
              disabled={!isFormValid()}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Sheet>
  );
};

export default SendAReference;
