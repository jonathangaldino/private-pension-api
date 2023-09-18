type EntityParams = {
  id: string;
  identity: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  gender: string;
  monthlyIncome: number;
};

export class CustomerEntity {
  readonly id: string;
  readonly identity: string;
  readonly name: string;
  readonly email: string;
  readonly dateOfBirth: Date;
  readonly gender: string;
  readonly monthlyIncome: number;

  constructor(params: EntityParams) {
    this.id = params.id;
    this.identity = params.identity;
    this.name = params.name;
    this.dateOfBirth = params.dateOfBirth;
    this.gender = params.gender;
    this.monthlyIncome = params.monthlyIncome;
  }
}
