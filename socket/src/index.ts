import App from './app';


const app = new App();

app.startup();

process.on('uncaughtException', (e: Error) => {
  console.error(e);
});

process.on('unhandledRejection', (e: Error) => {
  console.error(e);
});

process.on('exit', () => {
  console.error('Exit event is called');
  process.exit(1);
});
