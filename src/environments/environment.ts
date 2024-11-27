export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  endpoints: {
    users: '/users',
    signin: '/users/signin',
    signup: '/users/signup',
    cars: '/cars',
    carsAvailable: '/users/available',
    addCarsToUser: (userId: number) => `/users/${userId}/add-cars`,
    userRemoveCar: (userId: number, carId: number) => `/users/${userId}/remove-car/${carId}`,
    userAddCars: (userId: number) => `/users/${userId}/add-cars`,
    getAllUsers: (page: number, size: number) => `/users?page=${page}&size=${size}`,
    getAvailableCars: '/users/available-cars',
  },
};
