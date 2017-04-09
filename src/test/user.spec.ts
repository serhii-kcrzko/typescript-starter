import {suite, test} from "mocha-typescript";
import { IUser } from "../interfaces/user";
import { IUserModel } from "../models/user";
import { userSchema } from "../schemas/userSchema";
import mongoose = require("mongoose");
mongoose.Promise = global.Promise;

@suite
class UserTest {
  public static User: mongoose.Model<IUserModel>;

  public static before() {
    const MONGODB_CONNECTION: string = "mongodb://localhost:27017/heros";
    const connection: mongoose.Connection = mongoose.createConnection(MONGODB_CONNECTION);
    UserTest.User = connection.model<IUserModel>("User", userSchema);

    const chai = require("chai");
    chai.should();
  }

  private data: IUser;

  constructor() {
    this.data = {
      email: "foobar@com",
      firstName: "John",
      lastName: "Doe",
    };
  }

  @test("should create a new User")
  public create() {
    return new UserTest.User(this.data).save().then((result) => {
      result._id.should.exist;

      result.email.should.equal(this.data.email);

      result.firstName.should.equal(this.data.firstName);

      result.lastName.should.equal(this.data.lastName);
    });
  }
}
