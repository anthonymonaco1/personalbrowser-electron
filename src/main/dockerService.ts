import { ipcMain } from 'electron';
import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const imageName = 'fploptimizer-server'; // The name of your local Docker image
const containerName = 'fploptimizer-server-container'; // A unique name for your container

// Function to start the Docker container
// Function to start the Docker container
export async function startPythonServer() {
    try {
      console.log('Starting Python server...');
      const images = await docker.listImages();
      const imageExists = images.some((image) => image.RepoTags?.includes(`${imageName}:latest`));
      console.log(`Image exists: ${imageExists}`);
  
      if (!imageExists) {
        console.error(`Docker image ${imageName} not found locally.`);
        throw new Error(`Docker image ${imageName} not found locally. Please build the image before starting the server.`);
      }
  
      // Remove existing container if it exists
      let container = docker.getContainer(containerName);
      const containerInfo = await container.inspect().catch(() => null);
  
      if (containerInfo) {
        console.log('Existing container found. Removing...');
        if (containerInfo.State.Running) {
          await container.stop();
        }
        await container.remove();
      }
  
      console.log('Creating new container with the following configuration:');
      console.log({
        Image: imageName,
        name: containerName,
        ExposedPorts: {
          '8000/tcp': {},
        },
        HostConfig: {
          PortBindings: {
            '8000/tcp': [{ HostPort: '8000' }],
          },
        },
      });
  
      container = await docker.createContainer({
        Image: imageName,
        name: containerName,
        ExposedPorts: {
          '8000/tcp': {},
        },
        HostConfig: {
          PortBindings: {
            '8000/tcp': [{ HostPort: '8000' }],
          },
        },
      });
  
      console.log('Starting container...');
      await container.start();
      console.log('Python server started successfully.');
    } catch (error) {
      console.error('Error starting Python server:', error);
      throw error;
    }
  }

  export async function stopPythonServer() {
    try {
      const container = docker.getContainer(containerName);
      const containerInfo = await container.inspect().catch(() => null);
  
      if (containerInfo && containerInfo.State.Running) {
        await container.stop();
        await container.remove();
        console.log('Python server stopped.');
      } else {
        console.log('Python server is not running.');
      }
    } catch (error) {
      console.error('Error stopping Python server:', error);
      throw error;
    }
  }
  
  // Set up IPC handlers
  ipcMain.handle('start-python-server', async () => {
    await startPythonServer();
  });
  
  ipcMain.handle('stop-python-server', async () => {
    await stopPythonServer();
  });