export class AuthDTO {

  userId: string = '';

  password: string = '';

  isMfaLogin: boolean = false;

  ipAddress = "";

  callBackUrl: string = '';

  // Legacy/additional fields
  username: string = '';
  isMFA: boolean = false;
  callBackURL: string = 'http://vcappstore.venturacounty.gov/';
}
