import '@fontsource/inter';
import * as ROSLIB from 'roslib'

import { CssVarsProvider } from '@mui/joy/styles';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';

import Grid from '@mui/joy/Grid';
import Stack from '@mui/joy/Stack';

import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

import unicorn from "./unicorn.gif";
import rainbow from "./rainbow.gif";

function App() {
  const ros = new ROSLIB.Ros({
    url : 'ws://10.42.0.1:9090'
  });

  const cmdVel = new ROSLIB.Topic({
    ros : ros,
    name : '/cmd_vel',
    messageType : 'geometry_msgs/Twist'
  });

  var manualModeClient = new ROSLIB.Service({
    ros : ros,
    name : '/master_node/manual_service',
    serviceType : 'std_srvs/Trigger'
  });

  const move = (lvx, lvy, avz) => {
    var twist = new ROSLIB.Message({
      linear : {
        x : parseFloat(lvx),
        y : parseFloat(lvy),
        z : 0
      },
      angular : {
        x : 0,
        y : 0,
        z : parseFloat(avz)
      }
    });

    cmdVel.publish(twist);
  };

  const manualMode = () => {
    manualModeClient.callService({}, function(result) {
      console.log('Result for service call on '
        + manualModeClient.name
        + ': '
        + result.res);
    });
  }

  const Item = styled(Sheet)(({ theme }) => ({
    backgroundColor: "pink",
    ...theme.typography['body-sm'],
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 4,
    color: theme.vars.palette.text.secondary,
  }));

  return (
    <CssVarsProvider>
      <Sheet
        sx={{
        width: 1000,
        mx: 'auto', // margin left & right
        my: 4, // margin top & bottom
        py: 3, // padding top & bottom
        px: 2, // padding left & right
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 'sm',
        boxShadow: 'md',
        bgcolor: 'pink'
      }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ textAlign: 'center' }}>
        <img src={rainbow} width={75} height={75} alt="" />
          <Typography level="h3" component="h1">
            Teleop Control
          </Typography>
          <img src={unicorn} width={50} height={50} alt=""/>
        </Stack>

        <Grid container spacing={2}  alignItems="center"
          sx={{
            '--Grid-borderWidth': '1px',
            borderTop: 'var(--Grid-borderWidth) solid',
            borderColor: 'divider',
          }}>
          <Grid xs={6}>
            <Item>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    console.log(formData);
                    //const formJson = Object.fromEntries((formData).entries());
                    //alert(JSON.stringify(formJson));
                    move(formData.get("lvx"), formData.get("lvy"), formData.get("avz"));
                  }}
                >
                  <Stack spacing={1}>
                    <FormControl>
                      <FormLabel>Linear Velocity X</FormLabel>
                      <Input
                        name="lvx"
                        placeholder="0"
                        type="number"
                        defaultValue={0}
                        slotProps={{
                          input: {
                            min: -1,
                            max: 1,
                            step: 0.1,
                          },
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Linear Velocity Y</FormLabel>
                      <Input
                        name="lvy"
                        placeholder="0"
                        type="number"
                        defaultValue={0}
                        slotProps={{
                          input: {
                            min: -1,
                            max: 1,
                            step: 0.1,
                          },
                        }}
                      />
                    </FormControl>
                    <FormControl sx={{ pb: 2 }}>
                      <FormLabel>Angular Velocity Z</FormLabel>
                      <Input
                        name="avz"
                        placeholder="0"
                        type="number"
                        defaultValue={0}
                        slotProps={{
                          input: {
                            min: -1,
                            max: 1,
                            step: 0.1,
                          },
                        }}
                      />
                    </FormControl>
                    <Button sx={{ mt: 30 }} type="submit" color="danger">
                      Send
                    </Button>
                  </Stack>
                </form>
            </Item>
          </Grid>
          <Grid xs={6}s>
            <Grid container spacing={2}>
              <Grid xs={6} sx={{ flexGrow: 1 }}>
                <Item>
                  <Stack spacing={1}>
                    <Button color="danger" onClick={() => move(0.5,0,0)}>Forward (x = 0.5)</Button>
                    <Button color="danger" onClick={() => move(-0.5,0,0)}>Backward (x = -0.5)</Button>
                    <Button color="danger" sx={{ pt: 3.7, pb: 3.7 }} onClick={() => move(0,0,0)}>Stop</Button>
                  </Stack>
                </Item>
              </Grid>
              <Grid xs={6} sx={{ flexGrow: 1 }}>
                <Item>
                  <Stack spacing={1}>
                    <Button color="danger" onClick={() => move(0,0,0.5)}>Place Rotation (z = 0.3)</Button>
                    <Button color="danger" onClick={() => move(0,0.3, 0)}>Crab Walk Left (y = 0.3)</Button>
                    <Button color="danger" onClick={() => move(0,-0.3,0)}>Crab Walk Right (y = -0.3)</Button>
                    <Button color="danger" onClick={() => manualMode()}>Manual Mode</Button>
                  </Stack>
                </Item>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Sheet>
    </CssVarsProvider>
  );
}

export default App;
