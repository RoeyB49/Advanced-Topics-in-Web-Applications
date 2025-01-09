import initApp from "./server";
const PORT = process.env.PORT;

initApp().then((app) => {
  //initApp is a promise, so we need to use .then to get the app
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
