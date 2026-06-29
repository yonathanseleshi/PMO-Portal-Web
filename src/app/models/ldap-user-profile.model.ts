
export class LdapUserProfileModel {
  userId: string;
  displayName: string;
  email: string;
  telephone: string;
  mobile: string;
  description: string;
  jobTitle: string;
  department: string;
  company: string;
  distinguishedName: string;
  usedLdapPath: string;
  memberOf: string[];

  constructor(data?: Partial<LdapUserProfileModel>) {
    this.userId = data?.userId || '';
    this.displayName = data?.displayName || '';
    this.email = data?.email || '';
    this.telephone = data?.telephone || '';
    this.mobile = data?.mobile || '';
    this.description = data?.description || '';
    this.jobTitle = data?.jobTitle || '';
    this.department = data?.department || '';
    this.company = data?.company || '';
    this.distinguishedName = data?.distinguishedName || '';
    this.usedLdapPath = data?.usedLdapPath || '';
    this.memberOf = data?.memberOf || [];
  }
}
