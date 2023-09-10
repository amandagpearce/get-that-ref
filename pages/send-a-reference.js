import React, { useState } from 'react';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';

const SendAReference = () => {
  const [artwork, setArtwork] = useState('');
  const [artist, setArtist] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [isMovie, setIsMovie] = useState(true);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [episode, setEpisode] = useState('');
  const [season, setSeason] = useState('');

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

  const handleFileChange = (event) => {
    // Handle file selection here, you can set the selected file to state
    const file = event.target.files[0];
    // setSelectedFile(file);
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
                <FormLabel sx={{ fontSize: '1.1rem' }}>Title*</FormLabel>
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
                      touched.episode && !validity.episode ? 'red' : '#cdd7e1',
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
              name="sceneImage"
              type="file"
              accept=".png, .jpeg, .jpg"
              onChange={handleFileChange}
              sx={{ paddingTop: '7px' }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            sx={{
              mt: 1,
              width: '120px',
              background: 'linear-gradient(45deg, #ffe622, #ff54fd, #2196F3);',
              fontSize: '1.1rem',
              opacity: '1',
              filter: `grayscale(${isFormValid() ? 0 : 1})`, // Apply grayscale filter when disabled
              color: isFormValid() ? 'white' : '#000', // Change color to black when disabled
            }}
            disabled={!isFormValid()}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Sheet>
  );
};

export default SendAReference;
