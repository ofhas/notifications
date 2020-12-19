import { Profile } from 'passport-google-oauth';
import { v4 } from 'uuid';

export class User {
  id: string;
  name: string;
  organization: string;
  username: string;
  password: string;
  photo?: string;

  constructor(
    name: string,
    password: string,
    organization: string,
    username: string,
    id?: string,
    photo?: string
  ) {
    this.id = id || v4();
    this.name = name;
    this.username = username;
    this.password = password;
    this.organization = organization;
    this.photo = photo;
  }
  static fromGoogleProfile(profile: Profile, organization: string) {
    return new User(
      profile.displayName,
      v4(),
      organization,
      (profile?.emails && profile?.emails[0])?.value || profile.id,
      profile.id
    );
  }
}
