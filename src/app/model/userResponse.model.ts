export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
    phone: string;
    cars: {
      id: number;
      model: string;
      year: number;
      licensePlate: string;
      color: string;
    }[];
  }
  