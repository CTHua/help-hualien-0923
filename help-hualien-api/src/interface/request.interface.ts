export interface CustomRequest extends Request {
  user: {
    uid: string;
    email: string;
  };
}
