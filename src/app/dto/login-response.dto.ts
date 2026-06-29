import {LoginResponseData} from '../models/login-response-data.model';


export class LoginResponseDTO {

  success: boolean = false;

  message: string = "";

  errorCode: number | null = null;

  ipAddress = "";

  data: LoginResponseData = new LoginResponseData();


}
