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

  const handleRadioChange = (event) => {
    setIsMovie(event.target.value === 'movie');
  };

  const handleFileChange = (event) => {
    // Handle file selection here, you can set the selected file to state
    const file = event.target.files[0];
    setSelectedFile(file);
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
      <Grid container spacing={2} p={4} sx={{ alignItems: 'flex-end' }}>
        <Grid item xs={12}>
          <Typography level="h4" component="h1">
            <b>Welcome!</b>
          </Typography>
          <Typography level="body-sm" sx={{ fontSize: '1.2rem' }}>
            Fill in the form below with the visual arts reference data:
          </Typography>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <FormControl>
            <Grid container alignItems="center">
              <Grid item xs={4} sx={{ marginBottom: 2 }}>
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
              </Grid>

              <Grid item xs={4} sx={{ marginBottom: 2 }}>
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
              </Grid>

              <Grid item xs={12}>
                <FormControl>
                  <FormLabel sx={{ fontSize: '1.1rem' }}>Title*</FormLabel>
                  <Input
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </FormControl>
              </Grid>
            </Grid>
          </FormControl>

          {isMovie ? (
            <>
              <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                <FormLabel sx={{ fontSize: '1.1rem' }}>Year*</FormLabel>
                <Input
                  name="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </FormControl>
            </>
          ) : (
            <>
              <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                <FormLabel sx={{ fontSize: '1.1rem' }}>Episode</FormLabel>
                <Input
                  name="episode"
                  type="text"
                  value={episode}
                  onChange={(e) => setEpisode(e.target.value)}
                />
              </FormControl>
              <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
                <FormLabel sx={{ fontSize: '1.1rem' }}>Season</FormLabel>
                <Input
                  name="season"
                  type="text"
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                />
              </FormControl>
            </>
          )}
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <FormLabel sx={{ fontSize: '1.1rem' }}>
              Artwork referenced*
            </FormLabel>
            <Input
              name="artwork"
              type="text"
              value={artwork}
              onChange={(e) => setArtwork(e.target.value)}
              required
            />
          </FormControl>

          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <FormLabel sx={{ fontSize: '1.1rem' }}>Artist*</FormLabel>
            <Input
              name="artist"
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              required
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <FormLabel sx={{ fontSize: '1.1rem' }}>
              Scene description*
            </FormLabel>
            <Input
              name="sceneDescription"
              type="text"
              value={sceneDescription}
              onChange={(e) => setSceneDescription(e.target.value)}
              required
            />
          </FormControl>

          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <FormLabel sx={{ fontSize: '1.1rem' }}>
              Scene screenshot/print/image
            </FormLabel>
            <Input
              name="sceneImage"
              type="file"
              accept=".png, .jpeg, .jpg" // Specify accepted file types
              onChange={handleFileChange}
              sx={{ paddingTop: '7px' }}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            sx={{
              mt: 1,
              background: 'linear-gradient(45deg, #ffe622, #ff54fd, #2196F3);',
              fontSize: '1.1rem',
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Sheet>
  );
};

export default SendAReference;
