export interface Car {
    year: number;
    licensePlate: string;
    model: string;
    color: string;
  }
  
  export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthday: string; // Data como string no formato ISO (ex: "1990-05-01")
    login: string;
    password: string;
    phone: string;
    cars: Car[];
  }
  