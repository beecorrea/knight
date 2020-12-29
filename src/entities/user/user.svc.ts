import { Model } from 'mongoose';
import { UserDocument, UserType } from './user.model';
import { hashSync, compareSync, genSaltSync } from 'bcrypt';
import { Secret, sign } from 'jsonwebtoken';
import { GridFSBucketReadStream } from 'mongodb';
export interface IUserService<T extends UserType> {
  register(user: T): Promise<T>;
  signin(user: T): Promise<{ ok: boolean; code: number; msg: string; token?: string }>;
  // lougout(user: T): Promise<T[]>;
}
export class UserService implements IUserService<UserType> {
  private _userModel;

  constructor(userModel: Model<UserDocument>) {
    this._userModel = userModel;
  }

  async register(user: UserType): Promise<UserType> {
    const newUser = new this._userModel(user);
    console.log(newUser);
    newUser.password = hashSync(newUser.password, genSaltSync());
    return await newUser.save();
  }
  async signin(
    user: UserType,
  ): Promise<{ ok: boolean; code: number; msg: string; token?: string }> {
    try {
      const userSignIn = await this._userModel.findOne({ email: user.email });
      if (!userSignIn) return { ok: false, code: 404, msg: 'User not found!' };
      if (!compareSync(user.password, userSignIn.password))
        return { ok: false, code: 400, msg: 'Wrong password!' };
      else {
        const signParams = { email: userSignIn.email, role: userSignIn.role, _id: userSignIn._id };
        return {
          ok: true,
          code: 200,
          msg: 'Signed in!',
          token: sign(signParams, process.env.JWT_SECRET),
        };
      }
    } catch (error) {
      console.log(error);
      return { ok: false, code: 500, msg: 'Internal server error!!' };
    }
  }
}
