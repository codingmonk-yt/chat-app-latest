// @mui
import { Divider, IconButton, Stack } from '@mui/material';
import { GithubLogo, GoogleLogo, TwitterLogo } from 'phosphor-react';

// ----------------------------------------------------------------------

export default function AuthSocial() {


  const handleGoogleLogin = async () => {

  };

  const handleGithubLogin = async () => {
    
  };

  const handleTwitterLogin = async () => {
    
  };

  return (
    <div>
      <Divider
        sx={{
          my: 2.5,
          typography: 'overline',
          color: 'text.disabled',
          '&::before, ::after': {
            borderTopStyle: 'dashed',
          },
        }}
      >
        OR
      </Divider>

      <Stack direction="row" justifyContent="center" spacing={2}>
        <IconButton onClick={handleGoogleLogin}>
          <GoogleLogo color="#DF3E30" />
        </IconButton>

        <IconButton color="inherit" onClick={handleGithubLogin}>
          <GithubLogo />
        </IconButton>

        <IconButton onClick={handleTwitterLogin}>
          <TwitterLogo color="#1C9CEA" />
        </IconButton>
      </Stack>
    </div>
  );
}
