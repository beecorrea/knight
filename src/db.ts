import mongoose from 'mongoose';
export class MongoDB {
  private readonly connectionString: string;
  private readonly options: mongoose.ConnectionOptions;
  constructor(cnStr: string, opts?: mongoose.ConnectionOptions) {
    this.connectionString = cnStr;
    this.options =
      opts ?? <mongoose.ConnectionOptions>{ useNewUrlParser: true, useUnifiedTopology: true };
  }
  public connectDB(): void {
    mongoose.connect(this.connectionString, this.options);
    const connection = mongoose.connection;
    connection.once('open', () => {
      console.log("Connected to database! You're free to use the APIs now!");
    });
  }
}
