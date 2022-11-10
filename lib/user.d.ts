export interface LdapUser {
    readonly dn: string;
    readonly attributes: {
        [key: string]: boolean | string | number | string[] | number[] | boolean[];
    };
}
