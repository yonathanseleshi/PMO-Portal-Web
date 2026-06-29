import {LdapUserProfileModel} from './ldap-user-profile.model';


export class LoginResponseData {


  duoUrl: string = "";

  state: string = "";

  ldapUserProfile: LdapUserProfileModel = new LdapUserProfileModel();

}
