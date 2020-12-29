export const url = () =>
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@development.romr0.gcp.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;
