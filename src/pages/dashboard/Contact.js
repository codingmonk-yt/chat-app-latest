import React from 'react';
import { useTheme} from "@mui/material/styles";
import { useSearchParams } from 'react-router-dom';
import { Avatar, Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import { faker } from '@faker-js/faker';
import { Bell, CaretRight, Phone, Prohibit, Star, Trash, VideoCamera, X } from 'phosphor-react';
import useResponsive from '../../hooks/useResponsive';
import AntSwitch from '../../components/AntSwitch';

const Contact = () => {

    const theme = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();

    const isDesktop = useResponsive("up", "md");

    return (
        <Box sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
        <Stack sx={{ height: "100%" }}>
          <Box
            sx={{
              boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
              width: "100%",
              backgroundColor:
                theme.palette.mode === "light"
                  ? "#F8FAFF"
                  : theme.palette.background,
            }}
          >
            <Stack
              sx={{ height: "100%", p: 2 }}
              direction="row"
              alignItems={"center"}
              justifyContent="space-between"
              spacing={3}
            >
              <Typography variant="subtitle2">Contact Info</Typography>
              <IconButton
                onClick={() => {
                  searchParams.set("open", false);
                  setSearchParams(searchParams);
                }}
              >
                <X />
              </IconButton>
            </Stack>
          </Box>
          <Stack
            sx={{
              height: "100%",
              position: "relative",
              flexGrow: 1,
              overflow: "scroll",
            }}
            p={3}
            spacing={3}
          >
            <Stack alignItems="center" direction="row" spacing={2}>
              <Avatar
                src={faker.image.avatar()}
                alt={faker.name.firstName()}
                sx={{ height: 64, width: 64 }}
              />
              <Stack spacing={0.5}>
                <Typography variant="article" fontWeight={600}>
                  {faker.name.fullName()}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {"+91 62543 28 739"}
                </Typography>
              </Stack>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-evenly"}
            >
              <Stack alignItems={"center"} spacing={1}>
                <IconButton>
                  <Phone />
                </IconButton>

                <Typography variant="overline">Voice</Typography>
              </Stack>
              <Stack alignItems={"center"} spacing={1}>
                <IconButton>
                  <VideoCamera />
                </IconButton>

                <Typography variant="overline">Video</Typography>
              </Stack>
            </Stack>
            <Divider />
            <Stack spacing={0.5}>
              <Typography variant="article" fontWeight={600}>
                About
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {"Imagination is the only limit"}
              </Typography>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Typography variant="subtitle2">
                Media, Links & Docs
              </Typography>
              <Button endIcon={<CaretRight />}>401</Button>
            </Stack>
            <Stack direction={"row"} alignItems="center" spacing={2}>
              {[1, 2, 3].map((el) => (
                <Box>
                  <img
                    src={faker.image.city()}
                    alt={faker.internet.userName()}
                  />
                </Box>
              ))}
            </Stack>
            <Divider />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Star size={21} />
                <Typography variant="subtitle2">
                  Starred Messages
                </Typography>
              </Stack>

              <IconButton>
                <CaretRight />
              </IconButton>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Bell size={21} />
                <Typography variant="subtitle2">
                  Mute Notifications
                </Typography>
              </Stack>

              <AntSwitch />
            </Stack>
            <Divider />
            <Typography variant="body2">1 group in common</Typography>
            <Stack direction="row" alignItems={"center"} spacing={2}>
              <Avatar
                src={faker.image.imageUrl()}
                alt={faker.name.fullName()}
              />
              <Stack direction="column" spacing={0.5}>
                <Typography variant="subtitle2">Camel’s Gang</Typography>
                <Typography variant="caption">
                  Owl, Parrot, Rabbit , You
                </Typography>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction="row" alignItems={"center"} spacing={2}>
              <Button fullWidth startIcon={<Prohibit />} variant="outlined">
                Block
              </Button>
              <Button fullWidth startIcon={<Trash />} variant="outlined">
                Delete
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    )
}

export default Contact;